import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getReservation } from '../api/reservations.js'
import { ok } from './utils.js'
import lodash from 'lodash'
const { omit } = lodash

export const schema = z.object({
  reservationId: z.string().describe('The reservation _id'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const result = await getReservation(getToken, input.reservationId)
  const filtered = omit(result, [
    'userID',
    'lockCode',
    'confirmationCode',
    'listingID',
    'phone'
  ])
  return ok(filtered)
}
