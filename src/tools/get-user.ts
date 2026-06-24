import { z } from "zod";
import type { GetToken } from "../api/client.js";
import { getUser } from "../api/user.js";
import { ok } from "./utils.js";

export const schema = z.object({});

export async function handler(_input: z.infer<typeof schema>, getToken: GetToken) {
  return ok(await getUser(getToken));
}
