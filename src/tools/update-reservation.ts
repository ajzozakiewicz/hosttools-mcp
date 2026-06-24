import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { updateReservation } from "../api/reservations.js";
import { ok } from "./utils.js";

export const schema = z.object({
  reservationId: z.string().describe("The reservation _id"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  accessCode: z.string().nullable().optional().describe("Lock code; null to auto-generate"),
  checkInTime: z.number().int().min(0).max(23).optional(),
  checkOutTime: z.number().int().min(0).max(23).optional(),
  notes: z.string().optional(),
  guideBookURL: z.string().nullable().optional(),
  verificationURL: z.string().nullable().optional(),
  verificationStatus: z.enum(["signed", "approved"]).nullable().optional(),
  incidentURL: z.string().nullable().optional(),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  const { reservationId, ...updates } = input;
  return ok(await updateReservation(getToken, reservationId, updates));
}
