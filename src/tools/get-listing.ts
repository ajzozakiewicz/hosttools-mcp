import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getListing } from '../api/listings.js'
import { ok } from './utils.js'
import lodash from 'lodash'
const { omit } = lodash


export const schema = z.object({
  listingId: z.string().describe('The listing _id'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const result = await getListing(getToken, input.listingId)
  const filtered = omit(result, [
      'userID',
      'channels',
      'linkedRoomID',
      'priceSource',
      'priceSourceListingID',
      'latitude',
      'longitude',
      'images',
      'calendars'
  ])
  return ok(filtered)
}
