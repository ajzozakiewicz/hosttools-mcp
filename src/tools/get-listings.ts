import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { getListings } from '../api/listings.js'
import { ok } from './utils.js'
import lodash from 'lodash'
const { omit, map } = lodash

export const schema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('YYYY-MM-DD filter start date (availability)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('YYYY-MM-DD filter end date (availability)'),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  console.error('IN GET LISTINGS')
  const results = await getListings(getToken, input.startDate, input.endDate)
  const filtered = map(results, (result) => {
    return omit(result, [
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
  })
  return ok(filtered)
}
