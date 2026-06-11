import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { publishedOrAdmin } from '@/access/publishedOrAdmin'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: publishedOrAdmin,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    defaultColumns: ['title', 'price', 'stock', 'category', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'One-line summary used on cards, the buy panel, and meta tags.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Full product description shown on the detail page.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '33%', description: 'In USD, e.g. 129.99' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          admin: { width: '33%', description: 'Original price — shows a sale badge when set.' },
        },
        {
          name: 'sku',
          type: 'text',
          admin: { width: '34%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: { width: '50%' },
        },
        {
          name: 'brand',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'specs',
      type: 'array',
      label: 'Specifications',
      labels: { singular: 'Spec', plural: 'Specs' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'New', value: 'New' },
        { label: 'Best Seller', value: 'Best Seller' },
        { label: 'Sale', value: 'Sale' },
        { label: 'Limited', value: 'Limited' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar', sortOptions: 'name' },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => (id ? { id: { not_in: [id] } } : true),
      admin: { position: 'sidebar' },
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
