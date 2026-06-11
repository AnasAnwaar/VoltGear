'use client'

import { CartLineItem } from '@/components/cart/CartLineItem'
import { FreeShippingBar } from '@/components/FreeShippingBar'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCart } from '@/providers/Cart'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export const CartDrawer = ({ freeShippingThreshold }: { freeShippingThreshold: number }) => {
  const { items, isOpen, closeCart, subtotal, count } = useCart()

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart()
      }}
    >
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" /> Your cart{count > 0 ? ` (${count})` : ''}
          </SheetTitle>
          <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="volt" onClick={closeCart}>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <CartLineItem key={item.productId} item={item} onNavigate={closeCart} />
                ))}
              </div>
            </div>

            <SheetFooter className="border-t">
              <FreeShippingBar subtotal={subtotal} threshold={freeShippingThreshold} />
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Subtotal</span>
                <Price className="text-lg font-semibold" amount={subtotal} />
              </div>
              <Button asChild variant="volt" size="xl" onClick={closeCart}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" onClick={closeCart}>
                <Link href="/cart">View full cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
