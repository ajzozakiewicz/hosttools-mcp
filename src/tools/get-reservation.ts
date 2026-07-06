import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getReservation } from '../api/reservations.js'
import { ok } from './utils.js'

export const schema = z.object({
  reservationId: z.string().describe('The reservation _id'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await getReservation(getToken, input.reservationId))
}
