const BASE_URL = "https://app.hosttools.com";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** A function that resolves a fresh (auto-refreshed) access token. */
export type GetToken = () => Promise<string>;

async function makeRequest(
  method: string,
  path: string,
  getToken: GetToken,
  options: { query?: Record<string, string>; body?: unknown } = {}
): Promise<Response> {
  const url = new URL(`${BASE_URL}${path}`);
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) url.searchParams.set(k, v);
  }

  const token = await getToken();
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  return fetch(url.toString(), {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

async function parseResponse<T>(res: Response, method: string, path: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, `${method} ${path} failed: ${res.statusText}`, body);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(
  path: string,
  getToken: GetToken,
  query?: Record<string, string>
): Promise<T> {
  const res = await makeRequest("GET", path, getToken, { query });
  return parseResponse<T>(res, "GET", path);
}

export async function apiPost<T>(
  path: string,
  getToken: GetToken,
  body: unknown
): Promise<T> {
  const res = await makeRequest("POST", path, getToken, { body });
  return parseResponse<T>(res, "POST", path);
}

export async function apiPatch<T>(
  path: string,
  getToken: GetToken,
  body: unknown
): Promise<T> {
  const res = await makeRequest("PATCH", path, getToken, { body });
  return parseResponse<T>(res, "PATCH", path);
}

export async function apiDelete<T>(
  path: string,
  getToken: GetToken
): Promise<T> {
  const res = await makeRequest("DELETE", path, getToken);
  return parseResponse<T>(res, "DELETE", path);
}
