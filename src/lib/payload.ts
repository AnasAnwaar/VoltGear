import 'server-only'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

let cached: Promise<Payload> | null = null

/** Cached Local API client for server components and server actions. */
export const getPayloadClient = (): Promise<Payload> => {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}
