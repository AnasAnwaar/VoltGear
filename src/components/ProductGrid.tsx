import type { Product } from '@/payload-types'

import { ProductCard } from '@/components/ProductCard'
import { cn } from '@/utilities/cn'

export const ProductGrid = ({
  products,
  className,
  priorityCount = 0,
}: {
  products: Product[]
  className?: string
  priorityCount?: number
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priorityCount} />
      ))}
    </div>
  )
}
