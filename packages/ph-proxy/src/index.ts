/**
 * ph-proxy — Cloudflare Worker proxy for Product Hunt API v2.
 *
 * Responsibilities:
 *  1. Obtain a client-only OAuth token (grant_type=client_credentials, scope=public)
 *     using PH_CLIENT_ID / PH_CLIENT_SECRET stored as Worker secrets — the repo and
 *     calling agents never see them.
 *  2. Accept POST /graphql with JSON `{ query, variables? }` and forward it to
 *     https://api.producthunt.com/v2/api/graphql with `Authorization: Bearer <token>`.
 *  3. Optionally gate callers with PH_PROXY_TOKEN (Authorization: Bearer <token>)
 *     so strangers cannot consume the Product Hunt rate limit through this proxy.
 *
 * Public data only — client-only tokens cannot reach user-context endpoints.
 * Docs: https://api.producthunt.com/v2/docs
 */

export interface Env {
  /** Product Hunt application API key (client_id). Worker secret. */
  PH_CLIENT_ID: string;
  /** Product Hunt application secret (client_secret). Worker secret. */
  PH_CLIENT_SECRET: string;
  /**
   * Optional shared token callers must present as `Authorization: Bearer <token>`.
   * When unset, the proxy is open (public data only). Worker secret.
   */
  PH_PROXY_TOKEN?: string;
}

interface PhTokenResponse {
  access_token: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
}

interface CachedToken {
  token: string;
  expiresAt: number | null;
}

interface GraphQLRequestBody {
  query?: unknown;
  variables?: unknown;
}

const PH_TOKEN_URL = "https://api.producthunt.com/v2/oauth/token";
const PH_GRAPHQL_URL = "https://api.producthunt.com/v2/api/graphql";

/** Clock-skew buffer before a token is proactively refreshed (seconds). */
const TOKEN_REFRESH_BUFFER_SECONDS = 60;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/** Product Hunt rate-limit headers forwarded to callers verbatim. */
const RATE_LIMIT_HEADERS = [
  "x-rate-limit-limit",
  "x-rate-limit-remaining",
  "x-rate-limit-reset",
] as const;

/**
 * Module-scope token cache. Cloudflare isolates are short-lived, so this is a
 * small, per-isolate cache — never a durable store.
 */
let cachedToken: CachedToken | null = null;

function invalidateToken(): void {
  cachedToken = null;
}

function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

/**
 * Fetch (and cache) a Product Hunt client-only token.
 *
 * POST https://api.producthunt.com/v2/oauth/token
 * body: { client_id, client_secret, grant_type: "client_credentials", scope: "public" }
 *
 * The docs' example response omits `expires_in`; when absent we cache until the
 * upstream rejects the token (401), then refresh once.
 */
export async function getClientToken(env: Env): Promise<string> {
  if (!env.PH_CLIENT_ID || !env.PH_CLIENT_SECRET) {
    throw new Error(
      "ph-proxy: PH_CLIENT_ID / PH_CLIENT_SECRET are not configured",
    );
  }

  if (
    cachedToken &&
    (cachedToken.expiresAt === null || Date.now() < cachedToken.expiresAt)
  ) {
    return cachedToken.token;
  }

  const response = await fetch(PH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.PH_CLIENT_ID,
      client_secret: env.PH_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    }),
  });

  if (!response.ok) {
    // Status only — never echo upstream bodies or credentials into errors.
    throw new Error(
      `ph-proxy: Product Hunt token request failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as PhTokenResponse;
  if (!payload.access_token) {
    throw new Error(
      "ph-proxy: Product Hunt token response missing access_token",
    );
  }

  const ttlSeconds =
    typeof payload.expires_in === "number" ? payload.expires_in : null;
  cachedToken = {
    token: payload.access_token,
    expiresAt:
      ttlSeconds === null
        ? null
        : Date.now() +
          Math.max(ttlSeconds - TOKEN_REFRESH_BUFFER_SECONDS, 0) * 1000,
  };
  return cachedToken.token;
}

async function forwardGraphQL(request: Request, env: Env): Promise<Response> {
  if (env.PH_PROXY_TOKEN) {
    const authorization = request.headers.get("Authorization");
    if (authorization !== `Bearer ${env.PH_PROXY_TOKEN}`) {
      return json(
        { error: "Unauthorized — send Authorization: Bearer <PH_PROXY_TOKEN>" },
        401,
      );
    }
  }

  let body: GraphQLRequestBody;
  try {
    body = (await request.json()) as GraphQLRequestBody;
  } catch {
    return json(
      { error: "Request body must be JSON: { query, variables? }" },
      400,
    );
  }

  if (typeof body.query !== "string" || body.query.trim() === "") {
    return json(
      { error: "Missing required field: query (non-empty string)" },
      400,
    );
  }

  const upstreamBody =
    body.variables !== undefined
      ? JSON.stringify({ query: body.query, variables: body.variables })
      : JSON.stringify({ query: body.query });

  const send = async (): Promise<Response> => {
    const token = await getClientToken(env);
    return fetch(PH_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: upstreamBody,
    });
  };

  let upstream = await send();
  if (upstream.status === 401) {
    // Token revoked or stale: refresh once, then give up.
    invalidateToken();
    upstream = await send();
  }

  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    ...CORS_HEADERS,
  };
  for (const header of RATE_LIMIT_HEADERS) {
    const value = upstream.headers.get(header);
    if (value !== null) forwardHeaders[header] = value;
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: forwardHeaders,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (
      request.method === "GET" &&
      (url.pathname === "/" || url.pathname === "/healthz")
    ) {
      return json({
        ok: true,
        service: "ph-proxy",
        endpoints: ["POST /graphql"],
      });
    }

    if (url.pathname === "/graphql") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed — use POST /graphql" }, 405, {
          Allow: "POST, OPTIONS",
        });
      }
      try {
        return await forwardGraphQL(request, env);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "ph-proxy: upstream failure";
        return json({ error: message }, 502);
      }
    }

    return json({ error: "Not found — try POST /graphql" }, 404);
  },
} satisfies ExportedHandler<Env>;
