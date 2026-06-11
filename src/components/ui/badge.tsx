import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground',
        volt: 'bg-volt text-volt-foreground',
        outline: 'border border-border text-foreground',
        sale: 'bg-error text-white',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

/** Map a product badge label to a Badge variant. */
export function ProductBadge({ label }: { label: string }) {
  const variant =
    label === 'Sale' ? 'sale' : label === 'New' ? 'volt' : label === 'Limited' ? 'outline' : 'default'
  return <Badge variant={variant}>{label}</Badge>
}
