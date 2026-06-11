import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { publishedOrAdmin } from '@/access/publishedOrAdmin'
import { pageBlocks } from '@/blocks/blocks'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: publishedOrAdmin,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'subheading', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    seoField,
    slugField('title'),
  ],
}
