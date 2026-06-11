'use client'

import { cn } from '@/utilities/cn'
import { Minus, Plus } from 'lucide-react'

export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  className?: string
}) => {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className={cn('inline-flex items-center rounded-lg border', className)}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid size-9 place-items-center rounded-l-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="w-10 text-center font-mono text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-9 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
