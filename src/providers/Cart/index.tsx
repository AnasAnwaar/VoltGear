'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type CartItem = {
  productId: number
  slug: string
  title: string
  brand?: string
  price: number
  image?: string
  maxStock: number
  quantity: number
}

type AddInput = Omit<CartItem, 'quantity'>

type CartContextType = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  isReady: boolean
  addItem: (item: AddInput, qty?: number) => void
  updateQuantity: (productId: number, qty: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const STORAGE_KEY = 'voltgear-cart'

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      /* ignore malformed cart */
    }
    setIsReady(true)
  }, [])

  // Persist on change (after hydration so we don't clobber stored data).
  useEffect(() => {
    if (!isReady) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage full / unavailable */
    }
  }, [items, isReady])

  // Keep the cart in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue))
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item: AddInput, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        const quantity = Math.min(existing.quantity + qty, item.maxStock)
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, ...item, quantity } : i,
        )
      }
      return [...prev, { ...item, quantity: Math.max(1, Math.min(qty, item.maxStock)) }]
    })
    setIsOpen(true)
  }, [])

  const updateQuantity = useCallback((productId: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(qty, i.maxStock)) }
          : i,
      ),
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextType>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    }),
    [items, count, subtotal, isOpen, isReady, addItem, updateQuantity, removeItem, clear, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
