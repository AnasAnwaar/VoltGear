import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Link Column', plural: 'Link Columns' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      labels: { singular: 'Social Link', plural: 'Social Links' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              admin: { width: '50%' },
              options: [
                { label: 'X / Twitter', value: 'twitter' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
            },
            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      admin: { description: 'e.g. © 2025 VoltGear. All rights reserved.' },
    },
  ],
}
