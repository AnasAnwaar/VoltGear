import type { Metadata } from 'next'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'VoltGear — Premium Computer Accessories',
    template: '%s — VoltGear',
  },
  description:
    'VoltGear builds and curates premium computer accessories — keyboards, mice, headsets, monitors and desk gear — for people who care how their tools feel.',
  openGraph: {
    type: 'website',
    siteName: 'VoltGear',
    title: 'VoltGear — Premium Computer Accessories',
    description: 'Premium keyboards, mice, headsets, monitors and desk gear.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
