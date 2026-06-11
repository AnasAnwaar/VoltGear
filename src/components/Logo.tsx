import { cn } from '@/utilities/cn'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export const Logo = ({ className, storeName = 'VoltGear' }: { className?: string; storeName?: string }) => {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2', className)}
      aria-label={`${storeName} home`}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-volt text-volt-foreground transition-transform group-hover:-rotate-12">
        <Zap className="size-5" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-semibold tracking-tight">{storeName}</span>
    </Link>
  )
}
