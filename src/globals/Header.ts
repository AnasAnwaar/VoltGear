import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'announcement',
      type: 'group',
      label: 'Announcement Bar',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'text', type: 'text' },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      labels: { singular: 'Nav Link', plural: 'Nav Links' },
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
}
