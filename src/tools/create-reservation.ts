import { z } from 'zod'
import type { GetToken } from '../api/client.js'
import { createReservation } from '../api/reservations.js'
import { ok } from './utils.js'

export const schema = z.object({
  listingId: z.string().describe('The listing _id'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Check-in date YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Check-out date YYYY-MM-DD'),
  confirmationCode: z.string().describe('Custom confirmation identifier'),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  adults: z.number().int().min(1).describe('Number of adult guests'),
  children: z.number().int().min(0).optional(),
  infants: z.number().int().min(0).optional(),
  pets: z.number().int().min(0).optional(),
  hostPayout: z.number().min(0),
  guestPrice: z.number().min(0),
  status: z.enum(['inquiry', 'pending', 'accepted']).optional().default('accepted'),
  notes: z.string().optional(),
  checkInTime: z.number().int().min(0).max(23).optional(),
  checkOutTime: z.number().int().min(0).max(23).optional(),
})

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const { listingId, adults, children, infants, pets, ...rest } = input
  return ok(
    await createReservation(getToken, {
      ...rest,
      listingID: listingId,
      guests: { adults, children, infants, pets },
    })
  )
}
