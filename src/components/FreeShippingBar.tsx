import { formatPrice } from '@/lib/money'
import { Truck } from 'lucide-react'

/** Progress toward the free-shipping threshold. Pure component (no hooks). */
export const FreeShippingBar = ({
  subtotal,
  threshold,
}: {
  subtotal: number
  threshold: number
}) => {
  const remaining = Math.max(0, threshold - subtotal)
  const pct = Math.min(100, threshold > 0 ? (subtotal / threshold) * 100 : 100)
  const qualified = remaining <= 0

  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="flex items-center gap-2 text-sm">
        <Truck className="size-4 text-volt" />
        {qualified ? (
          <span>
            You&apos;ve unlocked <span className="font-semibold text-volt">free shipping</span>!
          </span>
        ) : (
          <span>
            Add <span className="font-mono font-semibold">{formatPrice(remaining)}</span> for free
            shipping
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-volt transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
