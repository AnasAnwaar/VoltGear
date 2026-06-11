import { cn } from '@/utilities/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const Pagination = ({
  page,
  totalPages,
  baseParams,
}: {
  page: number
  totalPages: number
  baseParams: Record<string, string | undefined>
}) => {
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => {
    const params = new URLSearchParams()
    Object.entries(baseParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `?${qs}` : '?'
  }

  const cellClass = (active: boolean) =>
    cn(
      'grid size-9 place-items-center rounded-md border font-mono text-sm transition-colors',
      active ? 'border-volt bg-volt text-volt-foreground' : 'hover:border-volt hover:text-volt',
    )

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={cellClass(false)} scroll>
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={hrefFor(p)} aria-current={p === page ? 'page' : undefined} className={cellClass(p === page)} scroll>
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={cellClass(false)} scroll>
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  )
}
