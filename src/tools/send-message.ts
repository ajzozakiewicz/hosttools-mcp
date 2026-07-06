import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { sendMessage } from '../api/messaging.js'
import { ok } from './utils.js'

export const schema = z.object({
  reservationId: z.string().describe('The reservation _id'),
  message: z.string().describe('Message text to send to the guest'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await sendMessage(getToken, input.reservationId, input.message))
}
