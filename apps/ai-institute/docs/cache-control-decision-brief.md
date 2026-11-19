# Public content Cache-Control — decision brief (R-15 / T-703)

**Date:** 2026-11-13 · **Applies to:** prerendered public content pages in `apps/ai-institute`
**Owner:** founder (risk R-15). Nothing in this document changes the site.

---

## 1. What production serves today (measured)

| Route | `Cache-Control` (observed on `https://bhavya-foundation.thebhavyafoundation.workers.dev`) |
|---|---|
| `/` | `s-maxage=31536000` |
| `/curriculum` | `s-maxage=31536000` |
| `/about`, `/faq`, `/transparency` | `s-maxage=31536000` |
| `/login` | `s-maxage=31536000` |
| `/dashboard`, `/app`, `/studio`, `/onboarding` | `307 Temporary Redirect` to sign-in |
| `/os` and authenticated surfaces | `private, no-cache, no-store, max-age=0, must-revalidate` (unchanged) |
| `/api/health` | `private, no-store` (middleware policy, added in the current increment) |
| `/_next/static/**` | hashed assets; immutable for a year (explicit in `next.config.mjs`) |

`s-maxage=31536000` is Next.js's default for prerendered pages with no `revalidate`. It is a
**shared-cache** directive: the browser must still revalidate (no `max-age` is set for browsers),
but the CDN edge may hold and serve the HTML for a year.

## 2. The problem

A content correction — a typo, a retracted claim, a legal page edit, a policy update — can remain
invisible to visitors for a year because the edge serves the cached page. The risk register
records this as **R-15 (Medium; "content corrections may remain invisible for a year")**.

The one-year cache is not a leak of anything private: authenticated routes redirect or are
`private, no-store`. The cost of the current behaviour is staleness, nothing more.

## 3. The two options

### Option A — retain `s-maxage=31536000`

| | |
|---|---|
| Affected pages | every prerendered public HTML page |
| Freshness | corrections visible within **up to one year** (in practice, until Cloudflare's edge entry expires or is purged) |
| CDN / performance | origin or Worker fetches happen **once a year per cache key**; fastest possible response |
| Deploys | a new deployment does **not** invalidate the edge cache key automatically; stale content persists until expiry or purge |
| Rollback | nothing to roll back — this is the current state |

### Option B — revalidate ≈ 300 seconds, stale-while-revalidate ≈ 600

```
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=600
```

| | |
|---|---|
| Affected pages | same prerendered public HTML pages |
| Freshness | corrections visible within **~5 minutes** (edge revalidate) and **~10 minutes** worst case while a stale copy is shown while refreshing |
| CDN / performance | one origin fetch per 5 minutes per cache key; still edge-served for the rest; `stale-while-revalidate` absorbs bursts |
| Deploys | a new deploy does **not** invalidate the cache either (same caveat as Option A), but the staleness window drops from a year to 5–10 minutes |
| Security | public pages remain public; no authenticated content is cached (unchanged) |
| Rollback | change `revalidate` back (or remove the export) and redeploy; the value takes effect on the next request burst after TTL expiry |

**Recommendation:** Option B. It removes the dominant failure mode of R-15 (a year of invisible
corrections) at a cost of a handful of origin/Worker fetches per minute per hot path — negligible
on free-tier Worker quotas for a content site.

### Known trade-offs of Option B

- A few more origin/Worker requests (mitigated by SWR).
- Prerendering value diminishes slightly: edge still serves stale HTML while revalidating.
- A deploy alone does not flush the edge; if an emergency correction is needed **before** the 5-minute window, Cloudflare's cache purge for the URL is the lever (a founder/ops action).
- `s-maxage` is honored by Cloudflare's edge cache; behaviour on other CDNs is out of scope.

## 4. Implementation (if approved)

For each prerendered public route, add:

```ts
export const revalidate = 300;
```

(or the equivalent Next.js ISR configuration for the app directory). Verify on a preview deployment with:

```
curl -sI https://bhavya-foundation-preview.thebhavyafoundation.workers.dev/
expect: cache-control: public, max-age=0, s-maxage=300, stale-while-revalidate=600 (Option B)
```

and spot-check two content pages (`/about`, `/curriculum`) the same way. Until that verification is
green, the file must not merge.

## 5. Security implications

- Option B does not change authentication, sessions, or cookies.
- Option B must not be applied to any route that renders session-specific data; those routes are
  already `private, no-store` via the middleware policy and must stay that way.
- `Cache-Control` values for public pages are `public` only because the content is already public;
  no personalization belongs in those HTML files.

## 6. Rollback

Revert the `revalidate` exports (or remove them) and redeploy. The edge drops the entries as they
expire; worst case 10 minutes of stale-while-revalidate window.

## 7. Verification plan

1. Merge into preview (`bhavya-foundation-preview`).
2. `curl -sI` the four content pages; assert the exact header.
3. Publish a minor content change on preview; confirm it appears live within ~10 minutes.
4. `/login` must remain unchanged until its freshness trade-off is separately accepted (or moved to the same policy deliberately, since it is also prerendered static).
