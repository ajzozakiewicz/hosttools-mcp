import { z } from 'zod'
import { startAuthFlow } from '../auth/flow.js'
import { readTokens } from '../auth/storage.js'
import { ok } from './utils.js'

export const schema = z.object({})

export async function handler(_input: z.infer<typeof schema>) {
  const existing = readTokens()
  if (existing && Date.now() < existing.expiresAt - 60_000) {
    return ok({ message: 'Already authenticated. Use auth_status to check details or auth_logout to sign out.' })
  }

  const { authorizeUrl, tokenPromise } = await startAuthFlow()

  tokenPromise.then(
    () => process.stderr.write('[hosttools-mcp] Background token exchange complete.\n'),
    (e: unknown) => process.stderr.write(`[hosttools-mcp] Background token exchange failed: ${String(e)}\n`)
  )

  return ok({
    message: 'Open this URL in your browser to authorize. Then call auth_status to confirm.',
    url: authorizeUrl,
  })
}
