import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { updateListing } from "../api/listings.js";
import { ok } from "./utils.js";

export const schema = z.object({
  listingId: z.string().describe("The listing _id"),
  name: z.string().optional(),
  address: z.string().optional(),
  checkInTime: z.number().int().min(0).max(23).optional(),
  checkOutTime: z.number().int().min(0).max(23).optional(),
  minNights: z.number().int().min(1).optional(),
  maxGuests: z.number().int().min(0).optional(),
  basePrice: z.number().min(0).optional(),
  minPrice: z.number().min(0).nullable().optional(),
  weeklyDiscount: z.number().min(0).max(100).nullable().optional(),
  monthlyDiscount: z.number().min(0).max(100).nullable().optional(),
  messagingEnabled: z.boolean().optional(),
  syncAvailability: z.boolean().optional(),
  syncPricing: z.boolean().optional(),
  currency: z.string().optional(),
  timeZone: z.string().optional(),
  bookingWindow: z.number().optional(),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const { listingId, ...updates } = input;
  return ok(await updateListing(getToken, listingId, updates));
}
