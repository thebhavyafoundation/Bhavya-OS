/**
 * @bhavya/product-hunt-client — typed access to Product Hunt API v2 via the
 * Bhavya `ph-proxy` Cloudflare Worker.
 *
 * Security model: this client holds NO credentials. The Worker owns
 * PH_CLIENT_ID / PH_CLIENT_SECRET as Worker secrets and attaches the OAuth
 * bearer token server-side. Agents and apps only send GraphQL documents.
 *
 * Endpoint contract (Worker): `POST {proxyUrl}` with JSON `{ query, variables? }`.
 *
 * @example
 * ```ts
 * import { productHuntQuery } from "@bhavya/product-hunt-client";
 *
 * const result = await productHuntQuery<{ posts: { edges: Array<{ node: { id: string; name: string } }> } }>(
 *   `query { posts(first: 5, order: NEWEST) { edges { node { id name } } } }`
 * );
 * console.log(result.data?.posts.edges.map((e) => e.node.name));
 * ```
 *
 * @see docs/product-hunt-integration.md — setup, architecture, and AI-agent usage patterns.
 * @see https://api.producthunt.com/v2/docs — Product Hunt API v2 documentation.
 */

/**
 * Default ph-proxy endpoint.
 *
 * NOTE: workers.dev URLs are `<worker>.<account-subdomain>.workers.dev`.
 * The account subdomain is currently `thebhavyafoundation`. After the first
 * deploy, `curl` the health check and correct this constant in one line if the
 * deployed URL differs.
 */
export const PH_PROXY_URL =
  "https://ph-proxy.thebhavyafoundation.workers.dev/graphql";

/** A GraphQL error object returned by Product Hunt (GraphQL spec shape). */
export interface ProductHuntGraphQLError {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
}

/** Standard GraphQL response envelope. */
export interface ProductHuntResponse<TData> {
  data?: TData;
  errors?: ProductHuntGraphQLError[];
}

/** Per-call overrides for {@link productHuntQuery}. */
export interface ProductHuntQueryOptions {
  /**
   * Override the proxy endpoint (e.g. a custom domain, `wrangler dev` at
   * `http://localhost:8787/graphql`, or a staging worker).
   */
  proxyUrl?: string;
  /**
   * Value for `Authorization: Bearer <token>`. Only needed when the Worker has
   * the optional `PH_PROXY_TOKEN` secret configured. Never a Product Hunt
   * credential — those never leave the Worker.
   */
  proxyToken?: string;
  /** Optional abort signal for timeouts/cancellation. */
  signal?: AbortSignal;
}

/** Thrown on network failures or non-2xx HTTP responses from the proxy. */
export class ProductHuntProxyError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProductHuntProxyError";
    this.status = status;
  }
}

/**
 * Execute a Product Hunt GraphQL query through the Bhavya `ph-proxy` Worker.
 *
 * Behavior:
 * - Network errors and non-2xx HTTP responses throw {@link ProductHuntProxyError}.
 * - GraphQL-level failures return normally with `errors` populated — callers
 *   (especially AI agents) must check `result.errors` before reading `data`.
 * - Rate-limit headers from Product Hunt are surfaced by the Worker; the proxy
 *   enforces 6250 complexity points / 15 minutes per application.
 *
 * @param query - GraphQL document (e.g. `query { posts(first: 10) { ... } }`).
 * @param variables - Optional variables map; sent only when defined.
 * @param options - Optional endpoint/auth/abort overrides.
 * @returns The GraphQL response envelope (`data` and/or `errors`).
 * @throws {ProductHuntProxyError} On network failure or non-2xx status.
 *
 * @example Single post by ID
 * ```ts
 * const res = await productHuntQuery<{ post: { name: string; votesCount: number } | null }>(
 *   `query ($id: ID!) { post(id: $id) { name tagline votesCount url } }`,
 *   { id: "12345" }
 * );
 * ```
 */
export async function productHuntQuery<TData = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options: ProductHuntQueryOptions = {},
): Promise<ProductHuntResponse<TData>> {
  if (typeof query !== "string" || query.trim() === "") {
    throw new ProductHuntProxyError(
      "productHuntQuery: query must be a non-empty string",
    );
  }

  const url = options.proxyUrl ?? PH_PROXY_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.proxyToken) {
    headers.Authorization = `Bearer ${options.proxyToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body:
      variables !== undefined
        ? JSON.stringify({ query, variables })
        : JSON.stringify({ query }),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new ProductHuntProxyError(
      `ph-proxy responded with HTTP ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as ProductHuntResponse<TData>;
}
