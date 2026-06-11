'use client'

import { cn } from '@/utilities/cn'
import Image from 'next/image'
import { useState } from 'react'

type GalleryImage = { url: string; alt: string }

export const Gallery = ({ images }: { images: GalleryImage[] }) => {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return <div className="aspect-square rounded-2xl border bg-card" />
  }

  const current = images[Math.min(active, images.length - 1)]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-card p-8">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative size-20 overflow-hidden rounded-lg border bg-card transition',
                i === active ? 'ring-2 ring-volt' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
