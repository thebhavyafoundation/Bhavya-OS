# Incident: Homepage "Page Unresponsive" — client storage health-check loop

- **Date opened:** 2026-10-28
- **Status:** ROOT CAUSE CONFIRMED — fix implemented and locally verified
  (targeted vitest 7/7 pass, `tsc --noEmit` clean, `eslint` 0 errors on
  changed files); **awaiting remote CI + preview deployment for runtime
  verification** (authorization gate)
- **Severity:** High (every visitor, every page; main-thread saturation on low-end devices)
- **Production state at investigation:** worker `bhavya-foundation` deployment `db57b7f5-aacb-4d57-ba01-6ece01230a18`, Cloudflare version `9a75f269` (v46), built from commit `5f61a802` (master, PR #58), deploy run #61 succeeded 2026-10-22T17:42Z, deployed 2026-10-22T17:46Z.

## Symptom

Chrome reported "Page Unresponsive" on the deployed homepage
(`https://bhavya-foundation.thebhavyafoundation.workers.dev/`) while a
navigation dropdown was open over the hero. Earlier reports also counted
hundreds-to-thousands of console errors with inconsistently quoted numbers.

## Root cause (confirmed with live runtime evidence, 2026-10-28)

`StorageProvider` in `apps/ai-institute/src/lib/providers/AppProviders.tsx`
is mounted globally (root layout `AppProviders`) on every page. Three defects
compose into an infinite loop:

1. `useStorage()` (`apps/ai-institute/src/lib/storage/index.ts`) constructs a
   new `B2StorageProvider` and returns a **new object literal on every call**
   (no memoization). Its identity therefore changes on every render.
2. `StorageProvider`'s `useEffect` declares `[storage]` as its dependency, so
   the effect re-runs after **every** render.
3. The effect always calls `setHealth({ healthy, latencyMs })` with a **new
   object**, which always changes state, which always re-renders.

The loop body also performs `storage.health()` → `list("")` →
`ListObjectsV2Command` signed by the AWS SDK **in the browser**, targeting the
placeholder bucket `https://your-b2-bucket-name.backblazeb2.com/...` (client
bundles only inline `NEXT_PUBLIC_*` env vars, so `S3_*` values are always
undefined in the browser and the placeholder fallbacks always win). The
request is blocked synchronously by the site's own CSP
(`connect-src 'self' ... https://f002.backblazeb2.com`), producing three
console errors per attempt (CSP violation, Fetch failed, "B2 health
check failed"), then `setHealth(new object)` restarts the cycle.

### Measured evidence (OpenCode in-app Chromium against production, 2026-10-28)

- 33 CSP-blocked `?list-type=2` requests in a 0.5 s window
  (~70 cycles/second, ~4,200/minute), each re-rendering the entire app tree.
- Console error counter: 0 at load → 100 (tool cap) within seconds; real
  count unbounded. Console excerpt:
  `Connecting to 'https://your-b2-bucket-name.backblazeb2.com/?list-type=2&max-keys=1000&prefix=' violates the following Content Security Policy directive: "connect-src 'self'".`
  from chunk `/_next/static/chunks/6806-*.js`, followed by
  `B2 health check failed: TypeError: Failed to fetch`.
- The loop starts at hydration on every page and never stops; the navigation
  dropdown was incidental context, not a cause. On a low-end (i3/8 GB) device
  the constant full-tree re-render saturates the main thread →
  "Page Unresponsive".

### Contributing defects (same class, fixed in the same change)

- `useAuth()` (`apps/ai-institute/src/lib/auth/index.ts`) also returns a new
  `Authenticator` (and a new `SupabaseStrategy`) on every render, so
  `AuthProvider`'s `[authenticator]` effect re-runs continuously. For a
  visitor with a stored session this yields an endless
  `validate()` → `setUser(new object)` → re-render loop (server round trip
  per cycle). Visitors without a stored session were unaffected because
  `setIsLoading(false)` is a boolean and React bailed out.
- `isConfigured` was computed as truthy for placeholder credentials
  (`your_b2_account_id`, `your_b2_application_key`, `your-b2-bucket-name`),
  so the provider reported storage as configured when it was not.

## Non-causes verified during investigation

- `.home-hero-accent` glow (blurred/glowing hero accent) exists only as
  **uncommitted local work** and is **not** in the deployed bundle
  (production HTML contains no `home-hero-accent`).
- `Preloader` is session-gated, skips entirely under `prefers-reduced-motion`,
  and clears its interval; its overlay lifts after ~2 s.
- `VelocityMarquee`'s RAF leak was already fixed (cancels the latest frame id).
  `VelocityMarquee`/`ParticleField` are not used on the homepage.

## Historical-claim corrections recorded during provenance work

- PR #58 squash commit is `5f61a802` (not `7f1ed64c`, which is PR #56).
- Cloudflare deployment version `e8773b05` is historical; the current
  production version is `9a75f269` (v46).
- The hero CTA on production reads "Explore Bhavya" / "See the pathway";
  the "See the curriculum" claim does not match the deployed markup.

## Related security/architecture findings (not fixed here, tracked)

- The client bundle ships `@aws-sdk/client-s3` and a placeholder-configured
  `S3Client` to every visitor. No real credentials can leak (Next.js inlines
  only `NEXT_PUBLIC_*`), but the browser must never call B2 directly: the
  CSP blocks it by design. Long-term: server-mediated storage API or curated
  public manifests; keep privileged B2 modules out of client graphs.
- `getSignedUrl()` returns `sig=PLACEHOLDER_SIGNATURE` — a fake signature
  that no gateway validates. Treat as "unsigned URL", not a security control.
- `tests/security/b2-boundary.test.ts` (untracked) asserts a client/B2
  boundary but only scans `.tsx` files (missing the `.ts` leak path used
  here) and lives outside vitest's include pattern (`src/**/*.test.ts`), so
  it has never run in CI.

## Fix implemented (2026-10-28, local working tree)

| File                                                                        | Change                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/ai-institute/src/lib/storage/config-gate.ts`                          | **new** — dependency-free `isStorageConfigured()`; placeholder tokens (`your_b2_account_id`, `your_b2_application_key`, `your-b2-bucket-name`, `your-bucket-name`) mean "not configured" |
| `apps/ai-institute/src/lib/storage/index.ts`                                | `useStorage()` memoized (`useMemo`, `[]` — provider/config derive from module constants); exports the gate                                                                               |
| `apps/ai-institute/src/lib/providers/AppProviders.tsx`                      | `StorageProvider` effect: no network attempt when unconfigured; probe runs once per mount; state writes cancellation-guarded                                                             |
| `apps/ai-institute/src/lib/auth/index.ts`                                   | `useAuth()` memoized (same defect class; stops the stored-session validate loop)                                                                                                         |
| `apps/ai-institute/tests/performance/playwright.config.ts`                  | `baseURL` env-driven (`BASE_URL`), defaulting to the deployed Cloudflare URL — no localhost prerequisite for remote runs                                                                 |
| `apps/ai-institute/tests/performance/performance.spec.ts`, `run-verify.mjs` | `emulateMedia` moved from `BrowserContext` (nonexistent) to `Page` (correct Playwright API)                                                                                              |

Local verification evidence (control-center laptop, light checks only):
`vitest run src/lib/storage/__tests__/config-gate.test.ts` → 7/7 pass;
`pnpm exec tsc --noEmit` → clean; `pnpm exec eslint <changed files>` →
0 errors (9 pre-existing unused-import warnings, present on master too).

## Regression coverage added

- `apps/ai-institute/src/lib/storage/__tests__/config-gate.test.ts`
  (runs under the existing vitest include pattern):
  - placeholder/missing env ⇒ `isStorageConfigured() === false`;
  - real-looking values ⇒ `true`;
  - static source guard: the `StorageProvider` health effect is gated on
    `isStorageConfigured()` and `useStorage()` is memoized.
