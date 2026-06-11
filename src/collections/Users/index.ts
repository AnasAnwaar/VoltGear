import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

/**
 * Admin users only. The storefront is a guest experience (cart lives client-side,
 * checkout is a demo) so there are no customer-facing accounts.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    group: 'Admin',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['admin'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [{ label: 'Admin', value: 'admin' }],
    },
  ],
}
