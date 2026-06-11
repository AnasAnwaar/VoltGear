import { cn } from '@/utilities/cn'
import type { ReactNode } from 'react'

export const SectionHeading = ({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
  className?: string
}) => {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-volt">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}
