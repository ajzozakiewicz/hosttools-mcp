import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getCalendar } from '../api/listings.js'
import { ok } from './utils.js'
import lodash from 'lodash'
const { omit } = lodash

export const schema = z.object({
  listingId: z.string().describe('The listing _id'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('YYYY-MM-DD'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const result = await getCalendar(getToken, input.listingId, input.startDate, input.endDate)
  const filtered = omit(result, ['userID'])
  return ok(filtered)
}
