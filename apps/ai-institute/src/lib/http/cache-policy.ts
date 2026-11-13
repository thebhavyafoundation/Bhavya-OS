/**
 * The policy authority for the `Cache-Control` header.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site previously had no explicit cache policy. Two facts were measured in
 * production before this module existed:
 *
 *   - the authenticated surfaces were already safe — they redirect to sign-in,
 *     or they render dynamically with `private, no-cache, no-store, ...`;
 *   - every prerendered page, including /login, was served by the CDN with
 *     `s-maxage=31536000` — shared content could remain stale for a year,
 *     which is risk R-15 in the Phase 0 risk register.
 *
 * The authenticated part is enforced here, fail-closed: any surface that
 * carries or can carry a personalised or sensitive response gets
 * `private, no-store` — it is never written to a shared cache. That default
 * cannot leak, and it matches the behaviour the app already happens to have,
 * so it is verified in production rather than guessed.
 *
 * The public content TTL is intentionally NOT changed here. Whether content
 * pages should stay cacheable for a year, or drop to minutes, is a product
 * decision (risk R-15, decision T-703), and the header value for prerendered
 * pages is only guaranteed once a deploy verifies it — the mechanism used to
 * get it there differs depending on the route's rendering, and remote
 * verification could not be run from this environment. The recommendation is
 * documented in `apps/ai-institute/docs/cache-control-policy.md`.
 *
 * `/:path*` static assets under `/_next/static` are content-hashed, so the
 * immutable year-long policy there is safe and is declared in `next.config.mjs`.
 */

const PRIVATE_PREFIXES = [
  "/app",
  "/dashboard",
  "/studio",
  "/onboarding",
  "/api/studio",
  "/api/student",
  "/api/admin",
  "/api/account",
  "/account",
  "/profile",
  "/settings",
  "/os/admin",
  "/os/mission",
  "/os/operations",
  "/os/governance",
  "/os/finance",
  "/os/projects",
  "/os/coach",
  "/os/approvals",
  "/os/inventory",
  "/api",
] as const;

export type CacheControlDecision = {
  /** The `Cache-Control` value to set on the response. */
  value: string;
  /** Why this route got it. */
  reason: string;
};

const PRIVATE_NO_STORE = "private, no-store";

/**
 * Decide the Cache-Control policy for one path.
 *
 * @param pathname the path without query string
 * @returns the policy, or null when the route keeps the framework's default
 *   and this code deliberately does not claim ownership of it
 */
export function cacheControlFor(pathname: string): CacheControlDecision | null {
  // API routes never carry a public response worth caching in a shared cache.
  if (pathname.startsWith("/api")) {
    return { value: PRIVATE_NO_STORE, reason: "api-route" };
  }

  // Anything under a private prefix is personalised or administrative by
  // definition, so it fails closed into `private, no-store`.
  for (const prefix of PRIVATE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return { value: PRIVATE_NO_STORE, reason: `private-prefix:${prefix}` };
    }
  }

  // Hashed static assets are the framework's concern (declared in
  // next.config.mjs); this module does not duplicate that responsibility.
  if (pathname.startsWith("/_next/static")) {
    return null;
  }

  // Public content keeps the framework's default until the R-15 decision is
  // taken. Explicitly returning null documents the choice rather than
  // accidentally colliding with the prerender header.
  return null;
}
