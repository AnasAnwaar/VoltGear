import 'server-only'

import type { Category, Footer, Header, Page, Product, SiteSetting } from '@/payload-types'
import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'

const PUBLISHED: Where = { status: { equals: 'published' } }

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name'

const sortMap: Record<ProductSort, string> = {
  newest: '-createdAt',
  'price-asc': 'price',
  'price-desc': '-price',
  name: 'title',
}

// ---- Globals ----
export const getSiteSettings = async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export const getHeader = async (): Promise<Header> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header', depth: 1 })
}

export const getFooter = async (): Promise<Footer> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer', depth: 1 })
}

// ---- Categories ----
export const getCategories = async (featuredOnly = false): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    sort: 'name',
    where: featuredOnly ? { featured: { equals: true } } : {},
  })
  return docs
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return docs[0] ?? null
}

// ---- Products ----
type ProductFilters = {
  categorySlug?: string
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  q?: string
  sort?: ProductSort
  page?: number
  limit?: number
}

export const getProducts = async (filters: ProductFilters = {}) => {
  const payload = await getPayloadClient()
  const and: Where[] = [PUBLISHED]

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug)
    and.push({ category: { equals: category?.id ?? -1 } })
  }
  if (filters.q) {
    and.push({
      or: [
        { title: { like: filters.q } },
        { brand: { like: filters.q } },
        { shortDescription: { like: filters.q } },
      ],
    })
  }
  if (filters.brands?.length) {
    and.push({ brand: { in: filters.brands } })
  }
  if (typeof filters.minPrice === 'number') {
    and.push({ price: { greater_than_equal: filters.minPrice } })
  }
  if (typeof filters.maxPrice === 'number') {
    and.push({ price: { less_than_equal: filters.maxPrice } })
  }
  if (filters.inStockOnly) {
    and.push({ stock: { greater_than: 0 } })
  }

  return payload.find({
    collection: 'products',
    depth: 1,
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
    sort: sortMap[filters.sort ?? 'newest'],
    where: { and },
  })
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
  })
  return docs[0] ?? null
}

export type ProductBadge = 'New' | 'Best Seller' | 'Sale' | 'Limited'

export const getProductsByBadge = async (
  badge: ProductBadge,
  limit = 8,
): Promise<Product[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit,
    sort: '-createdAt',
    where: { and: [PUBLISHED, { badges: { contains: badge } }] },
  })
  return docs
}

export const getNewArrivals = async (limit = 8): Promise<Product[]> => {
  const { docs } = await getProducts({ sort: 'newest', limit })
  return docs
}

/** Distinct list of published product brands for filter UIs. */
export const getBrands = async (): Promise<string[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
    where: PUBLISHED,
    select: { brand: true },
  })
  return Array.from(new Set(docs.map((d) => d.brand).filter(Boolean) as string[])).sort()
}

export const getAllProductSlugs = async (): Promise<string[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
    where: PUBLISHED,
    select: { slug: true },
  })
  return docs.map((d) => d.slug).filter(Boolean) as string[]
}

// ---- Pages ----
export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 1,
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
  })
  return docs[0] ?? null
}
