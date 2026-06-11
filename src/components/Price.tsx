import { cn } from '@/utilities/cn'
import { formatPrice } from '@/lib/money'

type Props = {
  amount: number
  compareAt?: number | null
  className?: string
  compareClassName?: string
  currency?: string
}

/** Monospace price with optional struck-through compare-at value. */
export const Price = ({ amount, compareAt, className, compareClassName, currency }: Props) => {
  const onSale = typeof compareAt === 'number' && compareAt > amount

  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={cn('font-mono tabular-nums tracking-tight', className)}>
        {formatPrice(amount, currency)}
      </span>
      {onSale && (
        <span
          className={cn('font-mono text-sm text-muted-foreground line-through', compareClassName)}
        >
          {formatPrice(compareAt!, currency)}
        </span>
      )}
    </span>
  )
}
