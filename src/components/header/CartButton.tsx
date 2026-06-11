'use client'

import { useCart } from '@/providers/Cart'
import { ShoppingBag } from 'lucide-react'

export const CartButton = () => {
  const { count, openCart, isReady } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Open cart, ${count} items` : 'Open cart'}
      className="relative grid size-9 place-items-center rounded-md text-foreground/70 transition-colors hover:text-foreground"
    >
      <ShoppingBag className="size-5" />
      {isReady && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-volt px-1 text-[10px] font-bold leading-none text-volt-foreground">
          {count}
        </span>
      )}
    </button>
  )
}
