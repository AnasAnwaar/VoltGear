import { cn } from '@/utilities/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type Crumb = { label: string; href?: string }

export const Breadcrumbs = ({ items, className }: { items: Crumb[]; className?: string }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && 'text-foreground')} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
