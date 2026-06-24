import { readTokens, writeTokens, type TokenRecord, type ClientRecord } from "./storage.js";

const TOKEN_URL = "https://app.hosttools.com/oauth/token";
const EXPIRY_BUFFER_MS = 60_000; // refresh 1 min before actual expiry

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export async function exchangeCode(
  client: ClientRecord,
  code: string,
  codeVerifier: string
): Promise<TokenRecord> {
  return fetchTokens({
    grant_type: "authorization_code",
    client_id: client.clientId,
    redirect_uri: client.redirectUri,
    code,
    code_verifier: codeVerifier,
    ...(client.clientSecret ? { client_secret: client.clientSecret } : {}),
  });
}

export async function refreshTokens(
  client: ClientRecord,
  refreshToken: string
): Promise<TokenRecord> {
  return fetchTokens({
    grant_type: "refresh_token",
    client_id: client.clientId,
    refresh_token: refreshToken,
    ...(client.clientSecret ? { client_secret: client.clientSecret } : {}),
  });
}

async function fetchTokens(params: Record<string, string>): Promise<TokenRecord> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Token request failed (${res.status}): ${JSON.stringify(err)}`);
  }

  const data = (await res.json()) as TokenResponse;
  const record: TokenRecord = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  };

  writeTokens(record);
  return record;
}

export async function getValidAccessToken(client: ClientRecord): Promise<string> {
  const record = readTokens();
  if (!record) throw new Error("Not authenticated. Run the auth_login tool.");

  if (Date.now() < record.expiresAt - EXPIRY_BUFFER_MS) {
    return record.accessToken;
  }

  if (!record.refreshToken) {
    throw new Error("Access token expired and no refresh token available. Run auth_login again.");
  }

  process.stderr.write(`[hosttools-mcp] Access token expired, refreshing...\n`);
  const refreshed = await refreshTokens(client, record.refreshToken);
  process.stderr.write(`[hosttools-mcp] Token refreshed successfully.\n`);
  return refreshed.accessToken;
}
