import { z } from 'zod'
import { readTokens, readClient } from '../auth/storage.js'
import { ok } from './utils.js'

export const schema = z.object({})

export async function handler(_input: z.infer<typeof schema>) {
  const tokens = readTokens()
  const client = readClient()

  if (!tokens) {
    return ok({ authenticated: false, message: 'Not logged in. Run auth_login.' })
  }

  const expiresInMs = tokens.expiresAt - Date.now()
  const expiresInMin = Math.round(expiresInMs / 60_000)

  return ok({
    authenticated: true,
    scope: tokens.scope,
    hasRefreshToken: Boolean(tokens.refreshToken),
    accessTokenExpiresInMinutes: expiresInMin
  })
}
