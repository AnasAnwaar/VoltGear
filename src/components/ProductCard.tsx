import type { Product } from '@/payload-types'

import { Img } from '@/components/Img'
import { Price } from '@/components/Price'
import { QuickAddButton } from '@/components/cart/AddToCart'
import { ProductBadge } from '@/components/ui/badge'
import { resolveImage } from '@/lib/media'
import Link from 'next/link'

export const ProductCard = ({ product, priority }: { product: Product; priority?: boolean }) => {
  const firstImage = product.images?.[0]?.image
  const card = resolveImage(firstImage, 'card')
  const href = `/product/${product.slug}`

  const item = {
    productId: product.id,
    slug: product.slug ?? '',
    title: product.title,
    brand: product.brand ?? undefined,
    price: product.price,
    image: card?.url,
    maxStock: product.stock,
  }

  return (
    <div className="group flex flex-col">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden rounded-xl border bg-card"
      >
        {product.badges?.length ? (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <ProductBadge key={b} label={b} />
            ))}
          </div>
        ) : null}
        <div className="absolute inset-0">
          <div className="relative h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.06]">
            <Img
              media={firstImage}
              size="card"
              priority={priority}
              imgClassName="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        {product.brand && (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </p>
        )}
        <h3 className="truncate font-medium leading-snug">
          <Link href={href} className="transition-colors hover:text-volt">
            {product.title}
          </Link>
        </h3>
        <Price className="text-sm" amount={product.price} compareAt={product.compareAtPrice} />
      </div>

      <div className="mt-3 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
        <QuickAddButton item={item} className="w-full" />
      </div>
    </div>
  )
}
