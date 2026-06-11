import type { Media } from '@/payload-types'

export type MediaSize = 'thumbnail' | 'card' | 'full'

/** Narrow a relationship field that may be an id, null, or a populated Media doc. */
export const asMedia = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

type ResolvedImage = { url: string; width?: number; height?: number; alt: string }

/** Resolve a usable image URL (preferring a named size) from a Media doc. */
export const resolveImage = (
  value: number | Media | null | undefined,
  size?: MediaSize,
): ResolvedImage | null => {
  const media = asMedia(value)
  if (!media) return null

  const sized = size ? media.sizes?.[size] : undefined
  const url = sized?.url || media.url
  if (!url) return null

  return {
    url,
    width: sized?.width || media.width || undefined,
    height: sized?.height || media.height || undefined,
    alt: media.alt || '',
  }
}
