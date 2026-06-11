'use client'

import type { Category } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/utilities/cn'
import { SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Props = { categories: Category[]; brands: string[]; showCategory?: boolean }

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
)

const radioClass = (active: boolean) =>
  cn(
    'rounded-md px-2 py-1.5 text-left text-sm transition-colors',
    active ? 'bg-volt font-medium text-volt-foreground' : 'hover:bg-accent',
  )

const FilterBody = ({
  categories,
  brands,
  showCategory,
  onApply,
}: Props & { onApply?: () => void }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedBrands = (searchParams.get('brands') ?? '').split(',').filter(Boolean)
  const selectedCategory = searchParams.get('category') ?? ''
  const inStock = searchParams.get('inStock') === '1'
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  const push = (params: URLSearchParams) => {
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    onApply?.()
  }
  const update = (fn: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams.toString())
    fn(p)
    push(p)
  }

  const toggleBrand = (brand: string) =>
    update((p) => {
      const next = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
      if (next.length) p.set('brands', next.join(','))
      else p.delete('brands')
    })

  const setCategory = (slug: string) =>
    update((p) => {
      if (slug) p.set('category', slug)
      else p.delete('category')
    })

  const toggleInStock = () =>
    update((p) => {
      if (inStock) p.delete('inStock')
      else p.set('inStock', '1')
    })

  const applyPrice = () =>
    update((p) => {
      if (minPrice) p.set('minPrice', minPrice)
      else p.delete('minPrice')
      if (maxPrice) p.set('maxPrice', maxPrice)
      else p.delete('maxPrice')
    })

  const hasFilters =
    selectedBrands.length > 0 ||
    Boolean(selectedCategory) ||
    inStock ||
    Boolean(minPrice) ||
    Boolean(maxPrice)

  return (
    <div className="flex flex-col gap-7">
      {hasFilters && (
        <Button
          variant="ghost"
          className="self-start"
          onClick={() => {
            router.push(pathname, { scroll: false })
            onApply?.()
          }}
        >
          Clear all
        </Button>
      )}

      {showCategory && categories.length > 0 && (
        <FilterGroup title="Category">
          <button type="button" onClick={() => setCategory('')} className={radioClass(!selectedCategory)}>
            All products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.slug ?? '')}
              className={radioClass(selectedCategory === c.slug)}
            >
              {c.name}
            </button>
          ))}
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Brand">
          {brands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 py-1">
              <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => toggleBrand(b)} />
              <span className="text-sm">{b}</span>
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Price (USD)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimum price"
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price"
            className="h-9"
          />
        </div>
        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={applyPrice}>
          Apply
        </Button>
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox checked={inStock} onCheckedChange={toggleInStock} />
          <span className="text-sm">In stock only</span>
        </label>
      </FilterGroup>
    </div>
  )
}

export const Filters = (props: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24">
          <FilterBody {...props} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="size-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="sr-only">Filter and refine products</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-10">
              <FilterBody {...props} onApply={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
