import React from 'react'

import { CartProvider } from '@/providers/Cart'
import { SonnerProvider } from '@/providers/Sonner'
import { ThemeProvider } from '@/providers/Theme'

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <SonnerProvider />
      </CartProvider>
    </ThemeProvider>
  )
}
