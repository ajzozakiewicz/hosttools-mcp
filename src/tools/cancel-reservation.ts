import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { cancelReservation } from "../api/reservations.js";
import { ok } from "./utils.js";

export const schema = z.object({
  reservationId: z.string().describe("The reservation _id (internal/direct sources only)"),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await cancelReservation(getToken, input.reservationId));
}
