import type { Metadata } from 'next'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Img } from '@/components/Img'
import { getPageBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  if (!page) return { title: 'About' }
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.hero?.subheading || undefined,
  }
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')
  if (!page) notFound()

  const hero = page.hero

  return (
    <div className="flex flex-col pb-20">
      {hero && (hero.heading || hero.subheading) && (
        <section className="relative overflow-hidden border-b">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="volt-glow pointer-events-none absolute inset-0" />
          <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div className="flex flex-col gap-5">
              {hero.eyebrow && (
                <p className="font-mono text-xs uppercase tracking-widest text-volt">
                  {hero.eyebrow}
                </p>
              )}
              {hero.heading && (
                <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  {hero.heading}
                </h1>
              )}
              {hero.subheading && (
                <p className="max-w-md text-lg text-muted-foreground">{hero.subheading}</p>
              )}
            </div>
            {hero.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
                <Img media={hero.image} size="full" imgClassName="object-cover" priority sizes="(max-width:1024px) 100vw, 50vw" />
              </div>
            )}
          </div>
        </section>
      )}

      <div className="pt-20">
        <RenderBlocks blocks={page.layout} />
      </div>
    </div>
  )
}
