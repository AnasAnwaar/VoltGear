import { CategoryTile } from '@/components/CategoryTile'
import { Img } from '@/components/Img'
import { ProductGrid } from '@/components/ProductGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/money'
import {
  getCategories,
  getNewArrivals,
  getProductsByBadge,
  getSiteSettings,
} from '@/lib/queries'
import { ArrowRight, Lock, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const trust = [
  { icon: Truck, title: 'Free shipping', copy: 'On orders over $75' },
  { icon: ShieldCheck, title: '2-year warranty', copy: 'On everything we sell' },
  { icon: RotateCcw, title: '30-day returns', copy: 'No-questions-asked' },
  { icon: Lock, title: 'Secure checkout', copy: 'Encrypted & protected' },
]

export default async function HomePage() {
  const [featuredCategories, bestSellers, newArrivals, settings] = await Promise.all([
    getCategories(true),
    getProductsByBadge('Best Seller', 4),
    getNewArrivals(8),
    getSiteSettings(),
  ])

  const heroProduct = bestSellers[0] ?? newArrivals[0]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="volt-glow pointer-events-none absolute inset-0" />
        <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span className="size-1.5 rounded-full bg-volt" /> New gear, every week
            </span>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Gear that earns its place on your desk
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Premium keyboards, mice, audio and monitors — engineered for the people who live at
              their setup.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="volt" size="xl">
                <Link href="/shop">
                  Shop now <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/about">Our story</Link>
              </Button>
            </div>
          </div>

          {heroProduct && (
            <Link
              href={`/product/${heroProduct.slug}`}
              className="group relative mx-auto aspect-square w-full max-w-md"
            >
              <div className="volt-glow absolute inset-0 scale-110" />
              <div className="relative h-full w-full p-8 transition-transform duration-300 group-hover:scale-105">
                <Img
                  media={heroProduct.images?.[0]?.image}
                  size="full"
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>
              <div className="absolute bottom-2 left-2 rounded-xl border bg-card/80 px-4 py-2 backdrop-blur">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {heroProduct.brand}
                </p>
                <p className="font-medium">{heroProduct.title}</p>
                <p className="font-mono text-sm text-volt">{formatPrice(heroProduct.price)}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <div className="container flex flex-col gap-20 py-20">
        {/* Categories bento */}
        {featuredCategories.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="Browse"
              title="Shop by category"
              action={
                <Button asChild variant="ghost">
                  <Link href="/shop">All products</Link>
                </Button>
              }
            />
            <div className="grid auto-rows-[12rem] grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredCategories.map((cat, i) => (
                <CategoryTile
                  key={cat.id}
                  category={cat}
                  className={i === 0 ? 'col-span-2 row-span-2' : ''}
                />
              ))}
            </div>
          </section>
        )}

        {/* Best sellers */}
        {bestSellers.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="Most popular"
              title="Best sellers"
              action={
                <Button asChild variant="ghost">
                  <Link href="/shop">View all</Link>
                </Button>
              }
            />
            <ProductGrid products={bestSellers} priorityCount={4} />
          </section>
        )}

        {/* Promo banner */}
        <section className="relative overflow-hidden rounded-3xl border bg-card p-10 text-center sm:p-16">
          <div className="volt-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <Truck className="size-8 text-volt" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Free shipping over {formatPrice(settings.freeShippingThreshold)}
            </h2>
            <p className="text-muted-foreground">
              Plus a 2-year warranty and 30-day returns on every order. Upgrade your setup with zero
              risk.
            </p>
            <Button asChild variant="volt" size="xl">
              <Link href="/shop">
                Start shopping <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* New arrivals */}
        {newArrivals.length > 0 && (
          <section>
            <SectionHeading eyebrow="Just landed" title="New arrivals" />
            <ProductGrid products={newArrivals} />
          </section>
        )}

        {/* Trust strip */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {trust.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border bg-card p-5">
              <Icon className="size-6 shrink-0 text-volt" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{copy}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
