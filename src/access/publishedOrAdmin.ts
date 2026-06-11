import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Admins can read everything (including drafts); the public can only read
 * documents whose `status` field is `published`.
 */
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user && checkRole(['admin'], user)) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}
