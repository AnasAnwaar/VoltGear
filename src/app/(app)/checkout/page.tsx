import type { Metadata } from 'next'

import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { getSiteSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings()

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
      <CheckoutClient
        freeShippingThreshold={settings.freeShippingThreshold}
        flatShippingRate={settings.flatShippingRate}
      />
    </div>
  )
}
