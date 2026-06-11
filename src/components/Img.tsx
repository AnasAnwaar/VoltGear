import type { Media } from '@/payload-types'

import { cn } from '@/utilities/cn'
import { resolveImage, type MediaSize } from '@/lib/media'
import Image from 'next/image'

type Props = {
  media: number | Media | null | undefined
  size?: MediaSize
  alt?: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  /** When true the image fills its (positioned) parent. */
  fill?: boolean
  width?: number
  height?: number
}

/**
 * next/image wrapper that resolves a Payload Media doc (or a named size) and
 * degrades to a subtle placeholder block when no image is available.
 */
export const Img = ({
  media,
  size = 'card',
  alt,
  className,
  imgClassName,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority,
  fill = true,
  width,
  height,
}: Props) => {
  const resolved = resolveImage(media, size)

  if (!resolved) {
    return <div className={cn('bg-muted', className)} aria-hidden="true" />
  }

  if (fill) {
    return (
      <Image
        src={resolved.url}
        alt={alt ?? resolved.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-contain', imgClassName)}
      />
    )
  }

  return (
    <Image
      src={resolved.url}
      alt={alt ?? resolved.alt}
      width={width ?? resolved.width ?? 768}
      height={height ?? resolved.height ?? 768}
      sizes={sizes}
      priority={priority}
      className={cn(className, imgClassName)}
    />
  )
}
