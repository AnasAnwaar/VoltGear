import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Orders are created by the checkout server action via the Local API.
 * Reads are admin-only (orders contain customer PII); the confirmation page
 * fetches a single order server-side with elevated access.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    read: adminOnly,
    create: () => true,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shop',
    defaultColumns: ['orderNumber', 'customerName', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'paid',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Customer',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'customerName', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'customerEmail', type: 'email', required: true, admin: { width: '50%' } },
          ],
        },
        { name: 'customerPhone', type: 'text' },
        {
          name: 'shippingAddress',
          type: 'group',
          fields: [
            { name: 'line1', type: 'text', required: true },
            { name: 'line2', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'state', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'postalCode', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'country', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        { name: 'titleSnapshot', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'quantity', type: 'number', required: true, min: 1, admin: { width: '50%' } },
            {
              name: 'priceAtPurchase',
              type: 'number',
              required: true,
              min: 0,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotal', type: 'number', required: true, admin: { width: '33%' } },
        { name: 'shipping', type: 'number', required: true, defaultValue: 0, admin: { width: '33%' } },
        { name: 'total', type: 'number', required: true, admin: { width: '34%' } },
      ],
    },
  ],
}
