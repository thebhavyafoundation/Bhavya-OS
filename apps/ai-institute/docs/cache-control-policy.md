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

- `/api/**` — no API route produces a response appropriate for a shared cache;
- the private prefixes derived from `isProtectedRoute` in the middleware: `/app`, `/dashboard`,
  `/studio`, `/onboarding`, `/account`, `/profile`, `/settings`;
- `/os/admin`, `/os/mission`, `/os/operations`, `/os/governance`, `/os/finance`, `/os/projects`,
  `/os/coach`, `/os/approvals`, `/os/inventory` — administrative Mission Control surfaces.

The policy is **fail-closed for the private surface** and **deliberately silent** everywhere else:
public pages keep the framework default and this module does not claim them.

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
