import type { Field } from 'payload'

/** Lowercase, hyphenated, URL-safe slug. */
export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

/**
 * Reusable slug field that auto-generates from a source field (default `title`)
 * when left empty, and normalises any manual input.
 */
export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Auto-generated from the title if left blank. URL-safe.',
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, value }) => {
        if (typeof value === 'string' && value.length > 0) {
          return formatSlug(value)
        }

        const fallback = data?.[fieldToUse] || originalDoc?.[fieldToUse]

        if (fallback && typeof fallback === 'string') {
          return formatSlug(fallback)
        }

        return value
      },
    ],
  },
})
