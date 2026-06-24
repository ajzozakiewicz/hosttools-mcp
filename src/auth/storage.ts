import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".config", "hosttools-mcp");
const CLIENT_FILE = join(CONFIG_DIR, "client.json");
const TOKENS_FILE = join(CONFIG_DIR, "tokens.json");

function ensureDir(): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
}

export interface ClientRecord {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
}

export interface TokenRecord {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
  scope?: string;
}

export function readClient(): ClientRecord | null {
  try {
    return JSON.parse(readFileSync(CLIENT_FILE, "utf8")) as ClientRecord;
  } catch {
    return null;
  }
}

export function writeClient(record: ClientRecord): void {
  ensureDir();
  writeFileSync(CLIENT_FILE, JSON.stringify(record, null, 2), { mode: 0o600 });
}

export function readTokens(): TokenRecord | null {
  try {
    return JSON.parse(readFileSync(TOKENS_FILE, "utf8")) as TokenRecord;
  } catch {
    return null;
  }
}

export function writeTokens(record: TokenRecord): void {
  ensureDir();
  writeFileSync(TOKENS_FILE, JSON.stringify(record, null, 2), { mode: 0o600 });
}

export function deleteTokens(): void {
  try { unlinkSync(TOKENS_FILE); } catch { /* already gone */ }
}
