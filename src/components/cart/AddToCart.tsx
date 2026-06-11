'use client'

import type { CartItem } from '@/providers/Cart'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { useCart } from '@/providers/Cart'
import { Check, Plus, ShoppingBag } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

type AddInput = Omit<CartItem, 'quantity'>

export const AddToCartButton = ({
  item,
  quantity = 1,
  className,
  label = 'Add to cart',
}: {
  item: AddInput
  quantity?: number
  className?: string
  label?: string
}) => {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const outOfStock = item.maxStock <= 0

  const onClick = useCallback(() => {
    addItem(item, quantity)
    setAdded(true)
    toast.success(`${item.title} added to cart`)
    const t = setTimeout(() => setAdded(false), 1500)
    return () => clearTimeout(t)
  }, [addItem, item, quantity])

  return (
    <Button
      type="button"
      variant="volt"
      size="xl"
      disabled={outOfStock}
      onClick={onClick}
      className={cn('w-full', className)}
    >
      {outOfStock ? (
        'Out of stock'
      ) : added ? (
        <>
          <Check className="size-5" /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="size-5" /> {label}
        </>
      )}
    </Button>
  )
}

/** Compact icon-only quick add for product cards. */
export const QuickAddButton = ({ item, className }: { item: AddInput; className?: string }) => {
  const { addItem } = useCart()
  const outOfStock = item.maxStock <= 0

  return (
    <Button
      type="button"
      variant="volt"
      size="sm"
      disabled={outOfStock}
      aria-label={outOfStock ? `${item.title} is out of stock` : `Add ${item.title} to cart`}
      onClick={(e) => {
        e.preventDefault()
        addItem(item, 1)
        toast.success(`${item.title} added to cart`)
      }}
      className={cn('gap-1.5', className)}
    >
      <Plus className="size-4" />
      {outOfStock ? 'Sold out' : 'Add'}
    </Button>
  )
}
