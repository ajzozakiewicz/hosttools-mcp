import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { getPricingQuote } from "../api/reservations.js";
import { ok } from "./utils.js";

export const schema = z.object({
  listingId: z.string().describe("The listing _id"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-in date YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-out date YYYY-MM-DD"),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).optional(),
  infants: z.number().int().min(0).optional(),
  pets: z.number().int().min(0).optional(),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const { listingId, startDate, endDate, adults, children, infants, pets } = input;
  return ok(await getPricingQuote(getToken, listingId, startDate, endDate, { adults, children, infants, pets }));
}
