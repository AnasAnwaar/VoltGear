import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/money'
import { getPayloadClient } from '@/lib/payload'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'orders',
    where: { orderNumber: { equals: orderNumber } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
  const order = docs[0]
  if (!order) notFound()

  const addr = order.shippingAddress

  return (
    <div className="container max-w-2xl py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-14 text-volt" strokeWidth={1.5} />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks, {order.customerName.split(' ')[0]}! A confirmation has been sent to{' '}
          <span className="text-foreground">{order.customerEmail}</span>.
        </p>
        <p className="mt-4 rounded-full border bg-card px-4 py-1.5 font-mono text-sm">
          Order {order.orderNumber}
        </p>
      </div>

      <div className="mt-10 rounded-xl border bg-card">
        <ul className="divide-y">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium">{item.titleSnapshot}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Qty {item.quantity}
                </p>
              </div>
              <Price className="text-sm" amount={item.priceAtPurchase * item.quantity} />
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>
              <Price className="text-lg font-semibold" amount={order.total} />
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 text-sm">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Shipping to
        </p>
        <p>{order.customerName}</p>
        <p className="text-muted-foreground">
          {addr.line1}
          {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}
          {addr.state ? `, ${addr.state}` : ''} {addr.postalCode}, {addr.country}
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="volt" size="xl">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
