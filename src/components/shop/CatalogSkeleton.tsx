export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="aspect-square animate-pulse rounded-xl border bg-muted" />
    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
  </div>
)

export const CatalogSkeleton = () => (
  <div className="container py-10">
    <div className="mb-8 h-9 w-56 animate-pulse rounded bg-muted" />
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="hidden w-60 shrink-0 flex-col gap-4 lg:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)
