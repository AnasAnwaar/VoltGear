import { CartDrawer } from '@/components/cart/CartDrawer'
import { AnnouncementBar } from '@/components/header/AnnouncementBar'
import { CartButton } from '@/components/header/CartButton'
import { MobileNav } from '@/components/header/MobileNav'
import { SearchBox } from '@/components/header/SearchBox'
import { ThemeToggle } from '@/components/header/ThemeToggle'
import { Logo } from '@/components/Logo'
import { getHeader, getSiteSettings } from '@/lib/queries'
import Link from 'next/link'

export const Header = async () => {
  const [header, settings] = await Promise.all([getHeader(), getSiteSettings()])
  const navLinks = (header.navLinks ?? [])
    .filter((l) => l.label && l.href)
    .map((l) => ({ label: l.label, href: l.href }))

  return (
    <header className="sticky top-0 z-40">
      {header.announcement?.enabled && header.announcement.text && (
        <AnnouncementBar text={header.announcement.text} />
      )}

      <div className="glass border-b">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <MobileNav links={navLinks} />
            <Logo storeName={settings.storeName} />
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <SearchBox />
            <ThemeToggle />
            <CartButton />
          </div>
        </div>
      </div>

      <CartDrawer freeShippingThreshold={settings.freeShippingThreshold} />
    </header>
  )
}
