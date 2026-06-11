import { Logo } from '@/components/Logo'
import { getSiteSettings } from '@/lib/queries'
import { Lock } from 'lucide-react'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Logo storeName={settings.storeName} />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-volt" /> Secure checkout
          </p>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  )
}
