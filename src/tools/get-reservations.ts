import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getReservations } from '../api/reservations.js'
import { ok } from './utils.js'
import lodash from 'lodash'
const { omit, map } = lodash

export const schema = z.object({
  listingId: z.string().describe('The listing _id'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('YYYY-MM-DD'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const results = await getReservations(getToken, input.listingId, input.startDate, input.endDate)
  const filtered = map(results, (result) => omit(result, [
    'userID',
    'lockCode',
    'confirmationCode',
    'listingID',
    'phone'
  ]))
  return ok(filtered)
}
