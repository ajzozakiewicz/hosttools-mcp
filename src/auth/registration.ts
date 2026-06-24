import { readClient, writeClient, type ClientRecord } from "./storage.js";

const REGISTER_URL = "https://app.hosttools.com/oauth/register";
const DEFAULT_REDIRECT_URI = "http://localhost:9876/callback";

interface RegistrationRequest {
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  scope: string;
}

interface RegistrationResponse {
  client_id: string;
  client_secret?: string;
}

export async function registerClient(redirectUri?: string): Promise<ClientRecord> {
  const existing = readClient();
  if (existing) {
    process.stderr.write(`[hosttools-mcp] Reusing existing OAuth client: ${existing.clientId}\n`);
    return existing;
  }

  const uri = redirectUri ?? DEFAULT_REDIRECT_URI;

  const body: RegistrationRequest = {
    client_name: "hosttools-mcp",
    redirect_uris: [uri],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
    scope: "listings:read listings:write reservations:read reservations:write messaging:write reviews:read webhooks:read webhooks:write user:read",
  };

  const res = await fetch(REGISTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Client registration failed (${res.status}): ${JSON.stringify(err)}`);
  }

  const data = (await res.json()) as RegistrationResponse;
  const record: ClientRecord = { clientId: data.client_id, redirectUri: uri };
  if (data.client_secret) record.clientSecret = data.client_secret;

  writeClient(record);
  process.stderr.write(`[hosttools-mcp] OAuth client registered: ${record.clientId}\n`);
  return record;
}
