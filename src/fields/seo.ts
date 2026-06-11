import type { Field } from 'payload'

/** Shared SEO field group used by Products and Pages. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      admin: { description: 'Falls back to the document title when empty.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { description: 'Recommended 150–160 characters.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Social share image (1200×630 recommended).' },
    },
  ],
}
