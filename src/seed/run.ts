// Load environment variables before the Payload config is evaluated.
import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import { seedDatabase } from './seed'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  await seedDatabase(payload)
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
