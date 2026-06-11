'use client'

import { AddToCartButton } from '@/components/cart/AddToCart'
import { Price } from '@/components/Price'
import { QuantityStepper } from '@/components/QuantityStepper'
import { ProductBadge } from '@/components/ui/badge'
import { cn } from '@/utilities/cn'
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'

type Props = {
  productId: number
  slug: string
  title: string
  brand?: string | null
  price: number
  compareAtPrice?: number | null
  image?: string
  stock: number
  badges?: string[] | null
  shortDescription?: string | null
}

const StockIndicator = ({ stock }: { stock: number }) => {
  const tone =
    stock <= 0 ? 'text-error' : stock < 5 ? 'text-warning' : 'text-success'
  const label =
    stock <= 0 ? 'Out of stock' : stock < 5 ? `Only ${stock} left in stock` : 'In stock'
  return (
    <p className={cn('flex items-center gap-2 text-sm font-medium', tone)}>
      <span className={cn('size-2 rounded-full', stock <= 0 ? 'bg-error' : stock < 5 ? 'bg-warning' : 'bg-success')} />
      {label}
    </p>
  )
}

export const BuyPanel = ({
  productId,
  slug,
  title,
  brand,
  price,
  compareAtPrice,
  image,
  stock,
  badges,
  shortDescription,
}: Props) => {
  const [qty, setQty] = useState(1)

  const item = {
    productId,
    slug,
    title,
    brand: brand ?? undefined,
    price,
    image,
    maxStock: stock,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {brand && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{brand}</p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <ProductBadge key={b} label={b} />
            ))}
          </div>
        )}
      </div>

      <Price className="text-2xl" compareClassName="text-base" amount={price} compareAt={compareAtPrice} />

      {shortDescription && <p className="text-muted-foreground">{shortDescription}</p>}

      <StockIndicator stock={stock} />

      {stock > 0 && (
        <div className="flex items-center gap-4">
          <QuantityStepper value={qty} max={stock} onChange={setQty} />
          <span className="text-sm text-muted-foreground">{stock} available</span>
        </div>
      )}

      <AddToCartButton item={item} quantity={qty} />

      <ul className="flex flex-col gap-2.5 border-t pt-5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2.5">
          <Truck className="size-4 shrink-0 text-volt" /> Free shipping on orders over $75
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-volt" /> Covered by a 2-year warranty
        </li>
        <li className="flex items-center gap-2.5">
          <RotateCcw className="size-4 shrink-0 text-volt" /> 30-day no-questions-asked returns
        </li>
      </ul>
    </div>
  )
}
