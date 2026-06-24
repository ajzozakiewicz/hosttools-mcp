import { createServer } from "node:http";
import { URL } from "node:url";
import { generateVerifier, deriveChallenge } from "./pkce.js";
import { registerClient } from "./registration.js";
import { exchangeCode } from "./tokens.js";
import type { TokenRecord, ClientRecord } from "./storage.js";

const AUTHORIZE_URL = "https://app.hosttools.com/oauth/authorize";
export const DEFAULT_CALLBACK_PORT = 9876;

export interface AuthFlowResult {
  authorizeUrl: string;
  tokenPromise: Promise<TokenRecord>;
  client: ClientRecord;
}

export async function startAuthFlow(port = DEFAULT_CALLBACK_PORT): Promise<AuthFlowResult> {
  const client = await registerClient(`http://localhost:${port}/callback`);
  const verifier = generateVerifier();
  const challenge = deriveChallenge(verifier);
  const state = generateVerifier(); // reuse for random state token

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client.clientId,
    redirect_uri: client.redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  });

  const authorizeUrl = `${AUTHORIZE_URL}?${params}`;

  process.stderr.write(`[hosttools-mcp] OAuth flow started. Listening on port ${port} for callback.\n`);
  process.stderr.write(`[hosttools-mcp] Authorize URL: ${authorizeUrl}\n`);

  const tokenPromise = waitForCallback(port, state, verifier, client);

  return { authorizeUrl, tokenPromise, client };
}

function waitForCallback(
  port: number,
  expectedState: string,
  verifier: string,
  client: ClientRecord
): Promise<TokenRecord> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);

      if (url.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }

      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" })
          .end(`<h1>Authorization denied</h1><p>${error}</p><p>You may close this tab.</p>`);
        server.close();
        reject(new Error(`Authorization denied: ${error}`));
        return;
      }

      if (!code || state !== expectedState) {
        res.writeHead(400, { "Content-Type": "text/html" })
          .end("<h1>Invalid callback</h1><p>State mismatch or missing code.</p>");
        server.close();
        reject(new Error("Invalid callback: state mismatch or missing code"));
        return;
      }

      try {
        const tokens = await exchangeCode(client, code, verifier);
        process.stderr.write(`[hosttools-mcp] OAuth callback received. Token exchange successful.\n`);
        res.writeHead(200, { "Content-Type": "text/html" })
          .end("<h1>Authenticated!</h1><p>You may close this tab and return to your MCP client.</p>");
        server.close();
        resolve(tokens);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/html" })
          .end(`<h1>Token exchange failed</h1><p>${String(err)}</p>`);
        server.close();
        reject(err);
      }
    });

    server.on("error", (err) => {
      process.stderr.write(`[hosttools-mcp] Callback server error: ${String(err)}\n`);
      reject(err);
    });
    server.listen(port, () => {
      process.stderr.write(`[hosttools-mcp] Callback server listening on http://localhost:${port}/callback\n`);
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      process.stderr.write(`[hosttools-mcp] OAuth flow timed out after 5 minutes.\n`);
      reject(new Error("Auth flow timed out (5 minutes). Run auth_login again."));
    }, 5 * 60 * 1000);
  });
}
