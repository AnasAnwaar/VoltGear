'use client'

import { Price } from '@/components/Price'
import { QuantityStepper } from '@/components/QuantityStepper'
import { useCart, type CartItem } from '@/providers/Cart'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const CartLineItem = ({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) => {
  const { updateQuantity, removeItem } = useCart()
  const href = `/product/${item.slug}`

  return (
    <div className="flex gap-4">
      <Link
        href={href}
        onClick={onNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-card"
      >
        {item.image && (
          <Image src={item.image} alt={item.title} fill sizes="80px" className="object-contain p-2" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {item.brand && (
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {item.brand}
              </p>
            )}
            <Link href={href} onClick={onNavigate} className="line-clamp-2 font-medium hover:text-volt">
              {item.title}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.title} from cart`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-error"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper
            value={item.quantity}
            max={Math.max(1, item.maxStock)}
            onChange={(q) => updateQuantity(item.productId, q)}
          />
          <Price className="text-sm" amount={item.price * item.quantity} />
        </div>
      </div>
    </div>
  )
}
