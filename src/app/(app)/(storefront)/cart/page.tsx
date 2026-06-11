import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { getSiteSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your cart',
  robots: { index: false, follow: true },
}

export default async function CartPage() {
  const settings = await getSiteSettings()
  return (
    <CartView
      freeShippingThreshold={settings.freeShippingThreshold}
      flatShippingRate={settings.flatShippingRate}
    />
  )
}
