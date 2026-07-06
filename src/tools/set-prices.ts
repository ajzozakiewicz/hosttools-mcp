import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { setPrices } from '../api/listings.js'
import { ok } from './utils.js'

export const schema = z.object({
  listingId: z.string().describe('The listing _id'),
  prices: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('YYYY-MM-DD'),
    price: z.number().optional(),
    minNights: z.number().int().optional(),
    blockCheckin: z.boolean().optional(),
    blockCheckout: z.boolean().optional(),
  })).describe('Array of per-date price overrides'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await setPrices(getToken, input.listingId, input.prices))
}
