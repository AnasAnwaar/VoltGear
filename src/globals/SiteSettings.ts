import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'storeName',
      type: 'text',
      required: true,
      defaultValue: 'VoltGear',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'supportEmail',
      type: 'email',
      defaultValue: 'support@voltgear.store',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'freeShippingThreshold',
          type: 'number',
          required: true,
          defaultValue: 75,
          admin: { width: '50%', description: 'Order subtotal (USD) for free shipping.' },
        },
        {
          name: 'flatShippingRate',
          type: 'number',
          required: true,
          defaultValue: 9.99,
          admin: { width: '50%', description: 'Flat shipping fee below the threshold.' },
        },
      ],
    },
  ],
}
