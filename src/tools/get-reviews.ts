import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { getReviews } from "../api/reviews.js";
import { ok } from "./utils.js";

export const schema = z.object({
  listingId: z.string().describe("The listing _id (must have Airbnb channel connected)"),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await getReviews(getToken, input.listingId));
}
