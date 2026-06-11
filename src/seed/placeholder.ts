import sharp from 'sharp'

const ACCENT = '#4f9dff'

/**
 * Download a real product photo from Unsplash, square-cropped, as a JPEG buffer.
 * Returns null on any failure so the caller can fall back to a placeholder.
 */
export async function fetchUnsplashSquare(photoId: string): Promise<Buffer | null> {
  const url = `https://images.unsplash.com/${photoId}?w=1200&h=1200&fit=crop&crop=entropy&q=80&auto=format`
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (VoltGear seed)' },
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    return buffer.length > 1000 ? buffer : null
  } catch {
    return null
  }
}

const baseDefs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16161a"/>
      <stop offset="100%" stop-color="#0A0A0B"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>`

// A clean volt "bolt" mark — no text, so a fallback never duplicates a UI label.
const bolt = (cx: number, cy: number, s: number) =>
  `<path transform="translate(${cx - 60 * s} ${cy - 90 * s}) scale(${s})" d="M70 0 L20 95 H58 L42 180 L110 70 H66 Z" fill="${ACCENT}" fill-opacity="0.85"/>`

/** On-brand textless placeholder for a product (fallback only). */
export async function makeProductImage(): Promise<Buffer> {
  const svg = `<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
    ${baseDefs}
    <rect width="1200" height="1200" fill="url(#bg)"/>
    <rect width="1200" height="1200" fill="url(#grid)"/>
    <circle cx="600" cy="600" r="300" fill="${ACCENT}" fill-opacity="0.10"/>
    ${bolt(600, 600, 1.6)}
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** Wider textless placeholder for category tiles / hero (fallback only). */
export async function makeBannerImage(): Promise<Buffer> {
  const svg = `<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
    ${baseDefs}
    <rect width="1600" height="1000" fill="url(#bg)"/>
    <rect width="1600" height="1000" fill="url(#grid)"/>
    <circle cx="1240" cy="300" r="320" fill="${ACCENT}" fill-opacity="0.10"/>
    ${bolt(800, 500, 1.4)}
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
