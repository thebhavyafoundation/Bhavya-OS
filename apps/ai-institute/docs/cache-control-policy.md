# Cache-Control policy

**Date:** 2026-11-13 · **Phase:** BFAOS V2 Phase 4 (§7) · **Risk addressed:** R-15 (risk register) · **Decision tracked:** T-703

---

## The problem

`Cache-Control` was never declared anywhere in the application. Measuring production before
this change produced three facts:

| Probe | Result |
|---|---|
| `GET /` | `Cache-Control: s-maxage=31536000` — shared cache may hold the page for a **year** |
| `/curriculum` | same |
| `/login` | same |
| `/about`, `/faq`, `/transparency` | same |
| `/dashboard`, `/app`, `/studio`, `/onboarding` | `307 Temporary Redirect` — private content is not served to a public cache |
| `/os` | `private, no-cache, no-store, max-age=0, must-revalidate` — already safe |

`s-maxage=31536000` is Next.js's default for prerendered pages with no `revalidate`. A content
correction could therefore remain invisible on the site for a year (risk R-15, "Content corrections
may remain invisible for a year").

## What is enforced now

Authenticated, personalised and administrative surfaces carry `Cache-Control: private, no-store`,
set in the middleware (`src/middleware.ts`, policy authority `src/lib/http/cache-policy.ts`):

- `/api/**` - no API route produces a response appropriate for a shared cache;
- the private prefixes derived from `isProtectedRoute` in the middleware: `/app`, `/dashboard`,
  `/studio`, `/onboarding`, `/account`, `/profile`, `/settings`;
- `/os/admin`, `/os/mission`, `/os/operations`, `/os/governance`, `/os/finance`, `/os/projects`,
  `/os/coach`, `/os/approvals`, `/os/inventory` - administrative Mission Control surfaces.

The policy is **fail-closed for the private surface** and **deliberately silent** everywhere else:
public pages keep the framework default and this module does not claim them.

One mechanism subtlety, recorded so the policy is not over-read: Next.js applies middleware
response headers only when a header with that name is absent on the outbound response, and
`Cache-Control` is not in the multi-value allowlist. On any route where Next.js has already set
`Cache-Control` (all prerendered pages serve `s-maxage=31536000`), the middleware's value is
silently ignored; on dynamic responses with no framework-set header, the middleware value is used.
This makes the policy a declaration of intent for dynamic and API surfaces, not a guarantee on
prerendered pages. The authenticated surfaces are safe in practice anyway: they redirect at the
middleware or render dynamically. This caveat is why the public-page TTL fix is phrased as
`export const revalidate = 300` on the content routes, whose header Next.js does honour, rather
than as a middleware override.

`/_next/static/**` — content-hashed assets — is declared explicitly as
`Cache-Control: public, max-age=31536000, immutable` in `next.config.mjs`. These URLs change when
the content changes, so a year-long immutable cache is correct (and is what the framework already
serves); making it explicit avoids depending on an undocumented default.

The policy is enforced by `src/lib/http/__tests__/cache-policy.test.ts`, whose private-path cases
fail a reviewer silently changing the prefix list to something laxer.

## What is deliberately not done, and the decision required

**The one-year shared cache on prerendered public pages is not removed here.** Two reasons:

1. It is a product decision (T-703 / R-15) — the right shared-cache lifetime for a content site is
   a product judgement, not a silent engineering substitution.
2. The fix path depends on rendering internals. An explicit override for prerendered pages applies
   through Next's own `revalidate` or through the middleware's header override; the value has to be
   verified on a deployment — and the preview deployment could not be driven from this environment
   (its GitHub job `Deploy preview to Cloudflare` failed; production still serves
   `953f06bb` from 2026-10-30).

**The recommendation for the founder to consider:** set prerendered public pages to

```
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=600
```

— the browser always revalidates, the CDN caches for five minutes and serves a stale copy for ten
more while revalidating, so a correction is live within minutes rather than a year. The shortest
correct route to apply it is `export const revalidate = 300` on the prerendered public content
routes, verified on a deployed preview (or on production with a single curl before merge).

## Security consequences of the decision above

- Leaving the current year-long shared cache on prerendered public pages keeps the one issue R-15
  names: corrections and retractions remaining hidden for a year. It does **not** expose
  personalised data — authenticated surfaces never serve from that cache (they redirect or emit
  `private, no-store`).
- Setting the shorter TTL does not change authentication behaviour and removes the staleness risk.
- Changing the TTL **requires a deployed verification** (`curl -sI https://<site>/`) to confirm the
  header actually takes effect, because the mechanism differs for static vs dynamic routes.
- Do not cache any route that renders session-specific content (`/account`, `/profile`,
  `/settings`, `/os/*` administrative routes, `/api/**`) — the policy already prevents it.


## Cache semantics - what the header actually means (Phase 4.3)

The header a prerendered page carries is `s-maxage={revalidate}, stale-while-revalidate={expireTime -
revalidate}`. Next.js defaults `expireTime` to one year, so with a 300-second revalidation the
header is `s-maxage=300, stale-while-revalidate=31535700`. That was observed on the preview
deployment before the stale window was bounded.

Measured on the preview deployment (PR #71, R-15 build):

```
HTTP/1.1 200 OK
Cache-Control: s-maxage=300, stale-while-revalidate=31535700
x-nextjs-cache: MISS
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
(no CF-Cache-Status, no Age)
```

Three facts follow.

**1. Nothing caches the response today.** There is no `CF-Cache-Status` and no `Age`, so the edge is
not caching the worker response. The worker's own incremental cache has no binding: the deployed
worker's bindings are `ASSETS`, the storage and database secrets, and `WORKER_SELF_REFERENCE` - no
KV namespace, no R2 bucket, no D1 database. `x-nextjs-cache: MISS` on every request confirms the
incremental cache is not holding anything.

**2. The year-long stale window was therefore inert, but it was a loaded gun.** It could not serve
stale content because nothing cached the content. The moment a cache rule, the regional cache, or an
incremental-cache binding is enabled, a shared cache honouring
`stale-while-revalidate=31535700` may serve a year-old page while it revalidates in the
background - contradicting the approved five-minute freshness.

**3. The stale window is now bounded.** `expireTime: 900` in `next.config.mjs` makes the header
`s-maxage=300, stale-while-revalidate=600`: the shared cache may serve a stale copy for at most ten
minutes, and the edge revalidates inside that window. This matches the approved policy rather than
reinterpreting it, and it leaves the revalidation period the founder approved at exactly 300
seconds.

**Performance consequence:** none today, because nothing caches the response - the header value is
inert in the current deployment. If caching is enabled later, the bounded window means the edge
revalidates at most ten minutes after the entry goes stale, instead of potentially up to a year.
The cost is more origin fetches for content that changes often, which is the intended trade-off
for a site whose corrections must become visible.

**Private surfaces remain isolated**, and this was measured, not assumed:

| Route | Observed header |
|---|---|
| `/api/health` | `Cache-Control: private, no-store` |
| `/dashboard` | `307 Temporary Redirect` to sign-in |
| `/os` | `private, no-cache, no-store, max-age=0, must-revalidate` |

**Cache tags and invalidation.** The adapter's regional cache and tag cache are opt-in and are not
enabled here (`defineCloudflareConfig({})`), and on-demand revalidation is a cache purge, which
is a founder or operator action rather than a code path this repository can exercise. The bounds
above are pinned by `src/lib/http/__tests__/stale-window.test.ts`, which fails if the stale
window grows back or if a route overrides the revalidation period.
