import { createHash, randomBytes } from 'node:crypto'

export function generateVerifier(): string {
  return randomBytes(32).toString('base64url')
}

export function deriveChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url')
}
