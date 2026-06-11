'use client'

import { CartLineItem } from '@/components/cart/CartLineItem'
import { FreeShippingBar } from '@/components/FreeShippingBar'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/money'
import { useCart } from '@/providers/Cart'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export const CartView = ({
  freeShippingThreshold,
  flatShippingRate,
}: {
  freeShippingThreshold: number
  flatShippingRate: number
}) => {
  const { items, subtotal, count, isReady } = useCart()

  if (!isReady) {
    return (
      <div className="container py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-5 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
        </p>
        <Button asChild variant="volt" size="xl">
          <Link href="/shop">
            Browse products <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    )
  }

  const shipping = subtotal >= freeShippingThreshold ? 0 : flatShippingRate
  const total = subtotal + shipping

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
        Your cart <span className="text-muted-foreground">({count})</span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.productId} className="py-6 first:pt-0">
              <CartLineItem item={item} />
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <FreeShippingBar subtotal={subtotal} threshold={freeShippingThreshold} />
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>
                  <Price amount={subtotal} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className={shipping === 0 ? 'font-medium text-volt' : ''}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="mt-1 flex items-center justify-between border-t pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd>
                  <Price className="text-lg font-semibold" amount={total} />
                </dd>
              </div>
            </dl>
            <Button asChild variant="volt" size="xl">
              <Link href="/checkout">
                Checkout <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
