import type { Category } from '@/payload-types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductGrid } from '@/components/ProductGrid'
import { Filters } from '@/components/shop/Filters'
import { Pagination } from '@/components/shop/Pagination'
import { SortSelect } from '@/components/shop/SortSelect'
import { Button } from '@/components/ui/button'
import { getBrands, getCategories, getProducts, type ProductSort } from '@/lib/queries'
import Link from 'next/link'

type SP = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v

export const Catalog = async ({
  searchParams,
  category,
  title,
  description,
}: {
  searchParams: SP
  category?: Category
  title: string
  description?: string | null
}) => {
  const q = first(searchParams.q)
  const brandsParam = first(searchParams.brands)
  const minPrice = first(searchParams.minPrice)
  const maxPrice = first(searchParams.maxPrice)
  const inStock = first(searchParams.inStock) === '1'
  const sort = (first(searchParams.sort) ?? 'newest') as ProductSort
  const page = Math.max(1, Number(first(searchParams.page) ?? 1) || 1)
  const categorySlug = category?.slug ?? first(searchParams.category)

  const [result, categories, brands] = await Promise.all([
    getProducts({
      categorySlug: categorySlug ?? undefined,
      brands: brandsParam ? brandsParam.split(',').filter(Boolean) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStock,
      q: q ?? undefined,
      sort,
      page,
      limit: 12,
    }),
    getCategories(),
    getBrands(),
  ])

  const baseParams: Record<string, string | undefined> = {
    q,
    brands: brandsParam,
    minPrice,
    maxPrice,
    inStock: inStock ? '1' : undefined,
    sort,
    category: category ? undefined : first(searchParams.category),
  }

  return (
    <div className="container py-10">
      <Breadcrumbs
        items={
          category
            ? [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: category.name }]
            : [{ label: 'Home', href: '/' }, { label: 'Shop' }]
        }
        className="mb-6"
      />

      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
        {q && (
          <p className="text-sm text-muted-foreground">
            Showing results for <span className="text-foreground">“{q}”</span>
          </p>
        )}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Filters categories={categories} brands={brands} showCategory={!category} />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {result.totalDocs} {result.totalDocs === 1 ? 'product' : 'products'}
            </p>
            <SortSelect />
          </div>

          {result.docs.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
              <p className="text-lg font-medium">No products match your filters</p>
              <p className="max-w-sm text-muted-foreground">
                Try widening your price range, removing a brand, or clearing your search.
              </p>
              <Button asChild variant="volt">
                <Link href={category ? `/category/${category.slug}` : '/shop'}>Clear filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid products={result.docs} priorityCount={4} />
              <Pagination page={result.page ?? 1} totalPages={result.totalPages} baseParams={baseParams} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
