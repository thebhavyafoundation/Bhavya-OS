// API Constants — Bhavya Foundation
// Shared constants for API routes, headers, and conventions.

export const API_CONSTANTS = {
  // Route prefixes
  routes: {
    api: "/api",
    os: "/os",
    academy: "/academy",
    studio: "/studio",
    missions: "/missions",
    community: "/community",
    research: "/research",
  },

  // OS sub-routes
  osRoutes: {
    admin: "/os/admin",
    docs: "/os/docs",
    github: "/os/github",
    intelligence: "/os/intelligence",
    ioc: "/os/ioc",
    social: "/os/social",
    knowledge: "/os/knowledge",
  },

  // Headers
  headers: {
    contentType: "Content-Type",
    authorization: "Authorization",
    xRequestId: "X-Request-ID",
    xCorrelationId: "X-Correlation-ID",
    xGitSha: "X-Git-Sha",
    xDeploymentId: "X-Deployment-Id",
  },

  // Content types
  contentTypes: {
    json: "application/json",
    formData: "multipart/form-data",
    text: "text/plain",
    html: "text/html",
    eventStream: "text/event-stream",
  },

  // Status codes
  status: {
    ok: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    unprocessable: 422,
    tooManyRequests: 429,
    internalError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    defaultOffset: 0,
  },

  // Cache control
  cache: {
    noStore: "no-store",
    noCache: "no-cache",
    maxAge: (seconds: number) => `max-age=${seconds}`,
    staleWhileRevalidate: (seconds: number) =>
      `stale-while-revalidate=${seconds}`,
  },

  // Rate limiting
  rateLimit: {
    defaultWindowMs: 60_000, // 1 minute
    defaultMaxRequests: 100,
    headerLimit: "X-RateLimit-Limit",
    headerRemaining: "X-RateLimit-Remaining",
    headerReset: "X-RateLimit-Reset",
  },
} as const;

export type ApiConstants = typeof API_CONSTANTS;
