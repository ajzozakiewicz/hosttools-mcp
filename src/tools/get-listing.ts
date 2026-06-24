import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { getListing } from "../api/listings.js";
import { ok } from "./utils.js";

export const schema = z.object({
  listingId: z.string().describe("The listing _id"),
});

export async function handler(input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await getListing(getToken, input.listingId));
}
