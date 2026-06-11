import type { Product } from '@/payload-types'
import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductGrid } from '@/components/ProductGrid'
import { BuyPanel } from '@/components/product/BuyPanel'
import { Gallery } from '@/components/product/Gallery'
import { RichText } from '@/components/RichText'
import { SectionHeading } from '@/components/SectionHeading'
import { resolveImage } from '@/lib/media'
import { getAllProductSlugs, getProductBySlug } from '@/lib/queries'
import { getServerSideURL } from '@/utilities/getURL'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }

  const og = resolveImage(product.seo?.ogImage ?? product.images?.[0]?.image, 'full')
  const description = product.seo?.metaDescription || product.shortDescription || undefined

  return {
    title: product.seo?.metaTitle || product.title,
    description,
    openGraph: {
      title: product.seo?.metaTitle || product.title,
      description,
      images: og ? [{ url: og.url }] : undefined,
    },
  }
}

const asCategory = (value: Product['category']) =>
  value && typeof value === 'object' ? value : null

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const images = (product.images ?? [])
    .map((i) => resolveImage(i.image, 'full'))
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .map((v) => ({ url: v.url, alt: v.alt || product.title }))

  const cardImage = resolveImage(product.images?.[0]?.image, 'card')
  const category = asCategory(product.category)

  const related = (product.relatedProducts ?? []).filter(
    (p): p is Product => typeof p === 'object',
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription ?? undefined,
    sku: product.sku ?? undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    image: images.map((i) => i.url),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${getServerSideURL()}/product/${product.slug}`,
    },
  }

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          { label: product.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={images} />

        <BuyPanel
          productId={product.id}
          slug={product.slug ?? ''}
          title={product.title}
          brand={product.brand}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          image={cardImage?.url}
          stock={product.stock}
          badges={product.badges}
          shortDescription={product.shortDescription}
        />
      </div>

      {/* Details */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          {product.description && (
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight">Description</h2>
              <RichText data={product.description} />
            </section>
          )}

          {product.features && product.features.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight">Highlights</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-volt" />
                    {f.feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {product.specs && product.specs.length > 0 && (
          <section className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Specifications</h2>
            <dl className="overflow-hidden rounded-xl border">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-4 border-b px-4 py-3 text-sm last:border-b-0 odd:bg-card/50"
                >
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading eyebrow="You might also like" title="Related products" />
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </div>
  )
}
