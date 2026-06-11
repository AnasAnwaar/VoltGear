'use server'

import { checkoutItemSchema, checkoutSchema, type CheckoutValues } from '@/lib/checkout-schema'
import { getPayloadClient } from '@/lib/payload'
import { z } from 'zod'

export type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string }

const inputSchema = z.object({
  customer: checkoutSchema,
  items: z.array(checkoutItemSchema).min(1, 'Your cart is empty'),
})

const generateOrderNumber = (): string => {
  const rand = Math.floor(100000 + Math.random() * 900000)
  const stamp = Date.now().toString(36).slice(-4).toUpperCase()
  return `VG-${stamp}-${rand}`
}

/**
 * Demo checkout: validates input, re-prices and re-checks stock against the
 * database (never trusting client prices), creates an Order, and decrements
 * stock. No real payment is processed.
 */
export async function createOrder(input: {
  customer: CheckoutValues
  items: { productId: number; quantity: number }[]
}): Promise<CreateOrderResult> {
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid order details' }
  }

  const { customer, items } = parsed.data
  const payload = await getPayloadClient()

  try {
    // Re-fetch every product server-side: authoritative price + stock.
    const priced = await Promise.all(
      items.map(async (line) => {
        const product = await payload.findByID({
          collection: 'products',
          id: line.productId,
          depth: 0,
        }).catch(() => null)
        return { line, product }
      }),
    )

    const orderItems: {
      product: number
      titleSnapshot: string
      quantity: number
      priceAtPurchase: number
    }[] = []

    for (const { line, product } of priced) {
      if (!product || product.status !== 'published') {
        return { ok: false, error: 'One or more items are no longer available.' }
      }
      if (product.stock < line.quantity) {
        return {
          ok: false,
          error: `"${product.title}" only has ${product.stock} left in stock.`,
        }
      }
      orderItems.push({
        product: product.id,
        titleSnapshot: product.title,
        quantity: line.quantity,
        priceAtPurchase: product.price,
      })
    }

    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const subtotal = orderItems.reduce((s, i) => s + i.priceAtPurchase * i.quantity, 0)
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.flatShippingRate
    const total = subtotal + shipping
    const orderNumber = generateOrderNumber()

    await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        status: 'paid',
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: {
          line1: customer.line1,
          line2: customer.line2,
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          country: customer.country,
        },
        items: orderItems,
        subtotal,
        shipping,
        total,
      },
    })

    // Decrement stock for each purchased product.
    await Promise.all(
      orderItems.map((i) =>
        payload.update({
          collection: 'products',
          id: i.product,
          data: { stock: Math.max(0, (priced.find((p) => p.product?.id === i.product)?.product?.stock ?? 0) - i.quantity) },
        }),
      ),
    )

    return { ok: true, orderNumber }
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to create order' })
    return { ok: false, error: 'Something went wrong placing your order. Please try again.' }
  }
}
