import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProductGrid } from '@/components/ProductGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { getNewArrivals, getProductsByBadge } from '@/lib/queries'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default async function NotFound() {
  const popular = await getProductsByBadge('Best Seller', 4)
  const products = popular.length > 0 ? popular : await getNewArrivals(4)

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="volt-glow pointer-events-none absolute inset-0" />
          <div className="container relative flex flex-col items-center py-24 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-volt">
              Error · Signal lost
            </p>
            <h1 className="flex items-center font-mono text-7xl font-bold tracking-tighter text-volt sm:text-9xl">
              404
              <span className="ml-2 inline-block h-[0.8em] w-3 animate-blink bg-volt sm:w-5" />
            </h1>
            <p className="mt-6 text-2xl font-semibold tracking-tight">This page got unplugged</p>
            <p className="mt-2 max-w-md text-muted-foreground">
              The page you&apos;re after has been moved, retired, or never existed. Let&apos;s get
              you back to the good stuff.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="volt" size="xl">
                <Link href="/shop">
                  <Search className="size-5" /> Browse the shop
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </div>
        </section>

        {products.length > 0 && (
          <section className="container py-16">
            <SectionHeading eyebrow="Don't leave empty-handed" title="Popular right now" />
            <ProductGrid products={products} />
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
