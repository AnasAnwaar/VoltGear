import type { Category } from '@/payload-types'

import { Img } from '@/components/Img'
import { cn } from '@/utilities/cn'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export const CategoryTile = ({ category, className }: { category: Category; className?: string }) => {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group relative flex min-h-44 flex-col justify-end overflow-hidden rounded-2xl border p-5 text-white',
        className,
      )}
    >
      <div className="absolute inset-0">
        <Img
          media={category.image}
          size="card"
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      </div>
      <div className="relative">
        <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow">{category.name}</h3>
        {category.description && (
          <p className="mt-0.5 line-clamp-1 text-sm text-white/75">{category.description}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-[#8fc0ff]">
          Shop{' '}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
