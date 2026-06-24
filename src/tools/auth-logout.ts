import { z } from "zod";
import { deleteTokens } from "../auth/storage.js";
import { ok } from "./utils.js";

export const schema = z.object({});

export async function handler(_input: z.infer<typeof schema>) {
  deleteTokens();
  return ok({ message: "Logged out. Access tokens deleted." });
}
