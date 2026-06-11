import type { MetadataRoute } from 'next'

import { getAllProductSlugs, getCategories } from '@/lib/queries'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/product/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
