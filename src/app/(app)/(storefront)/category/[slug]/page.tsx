import type { Metadata } from 'next'

import { Catalog } from '@/components/shop/Catalog'
import { getCategories, getCategoryBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug ?? '' })).filter((c) => c.slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category not found' }
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at VoltGear.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const [category, sp] = await Promise.all([getCategoryBySlug(slug), searchParams])
  if (!category) notFound()

  return (
    <Catalog
      searchParams={sp}
      category={category}
      title={category.name}
      description={category.description}
    />
  )
}
