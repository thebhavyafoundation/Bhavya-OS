# BFAOS V2 — 02 Production Truth

**Date:** 2026-11-13 · **Target:** `https://bhavya-foundation.thebhavyafoundation.workers.dev`
**Method:** direct HTTP requests and a real browser session against the deployed Workers. No local
build, no local server, no synthetic fixtures. A 200 response is never treated as proof of
correctness on its own.

## 1. Deployment identity

| Item | Value | Evidence |
|---|---|---|
| Production Worker | `bhavya-foundation` | `apps/ai-institute/wrangler.json` → `"name"`; Cloudflare deployments API |
| Latest production deployment | `953f06bb-1ab3-45bb-a4b7-902a2bc6d039`, 2026-10-30T16:14:27Z | Cloudflare API (read-only) |
| Production source SHA | `98388ddb` | the workflow that produced `953f06bb` ran from that commit; the bundle contains the manifest-serving fix verified live |
| Preview Worker | `bhavya-foundation-preview` | `wrangler.preview.json`; Cloudflare API |
| Latest preview deployment | `d66e76f3-08a8-4ff4-97c3-d3ff39dafd6f`, 2026-11-13T05:09:57Z | Cloudflare API |
| Preview source | PR #62 candidate `6d40870e` | preview was produced by the PR #62 run `43369824289` |
| Production deploy trigger | `push` to `master`, **no path filter** | `.github/workflows/deploy-cloudflare.yml` |
| Canonical build gate | `opennext-build-verify.yml` (PR-scoped, no deploy) | workflow file |

## 2. Live route behaviour (production)

Every request was a real GET against the deployed worker (`VERIFIED`).

| Route | Status | Bytes | Reading |
|---|---|---|---|
| `/` | 200 | 64,547 | homepage renders |
| `/curriculum` | 200 | 245,993 | curriculum renders with 30 level references |
| `/learning-paths` | 200 | 50,263 | 40 outbound links; **no "program" terminology** |
| `/knowledge` | 200 | 53,047 | knowledge hub renders |
| `/governance` | 200 | 56,237 | governance page renders (diagram block resolves) |
| `/login`, `/register` | 200 | 22,271 / 22,162 | auth entry points render |
| `/dashboard` | 200 | 22,358 | shell renders; content is session-gated |
| `/donate` | 200 | 33,129 | donation page renders |
| `/os` | 200 | 29,288 | OS surface renders (public) |
| `/api/health` | 200 | 161 | `{"status":"healthy","environment":"production",...}` |
| `/api/auth/me` | **401** | — | unauthenticated correctly rejected |
| `/api/student` | **401** | — | unauthenticated correctly rejected |
| `/diagrams/curriculum/curriculum-learning-pathway.svg` | 200 | 5,533 | static asset delivered from the Worker |
| `/robots.txt` | 200 | 260 | present |
| `/manifest.webmanifest` | **404** | — | **no web app manifest** — minor gap for installability and mobile polish |

## 3. Browser-level production verification

Desktop viewport 1536×864 and mobile viewport 375×812 (`VERIFIED` via a real browser session).

| Check | Desktop | Mobile |
|---|---|---|
| Document title | "Bhavya Foundation — For People. For Nature. For Generations." | same |
| `lang` attribute | `en` | same |
| `<h1>` count | 1 ("Building forGenerations.") | same |
| Total headings (h1–h3) | 21 | same |
| Images | 8 | 8 |
| **Broken images (`naturalWidth === 0`)** | **0** | **0** |
| **Horizontal overflow** | **0 px** | **0 px** (`scrollWidth` 367 ≤ `innerWidth` 375) |
| Elements exceeding viewport | none | none |
| `<main>` landmarks | 2 | 2 |
| `<nav>` landmarks | 7 | 7 |
| `<footer>` | 1 | 1 |
| Form controls without a label | 0 (no forms on homepage) | 0 |
| Console errors | **1** — `favicon.ico` 404 | same |
| Skip-to-content link | **not detected** | not detected |

**Findings:**
- **F-P1 (low)** — missing `favicon.ico` produces the only console error on the homepage.
- **F-P2 (medium, accessibility)** — no skip link on the homepage. WCAG 2.4.1 (Bypass Blocks) expects
  a means to skip repeated navigation; with 7 navigation landmarks and 61 homepage links this
  measurably affects keyboard and screen-reader users.
- **F-P3 (low, copy)** — the homepage `<h1>` renders as "Building forGenerations." (missing word
  separation), which reads incorrectly to screen readers.
- **F-P4 (medium)** — `Cache-Control: s-maxage=31536000` (one year) is applied to `/` and `/curriculum`.
  Content corrections can remain invisible at the edge for a year unless explicitly purged. The intent
  is presumably static-page caching, but the policy is not documented anywhere in the repository.
- **F-P5 (low)** — no `/manifest.webmanifest`, so no installable/PWA behaviour on mobile.

## 4. Security headers (production, verified from the response)

| Header | Value |
|---|---|
| `content-security-policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; co…` (enforced) |
| `content-security-policy-report-only` | same policy with `https://f002.backblazeb2.com` allowed |
| `strict-transport-security` | `max-age=63072000; includeSubDomains; preload` |
| `x-content-type-options` | `nosniff` |
| `x-frame-options` | `DENY` |
| `referrer-policy` | `strict-origin-when-cross-origin` |
| `permissions-policy` | `camera=(), microphone=(), geolocation=()` |
| `server` | `cloudflare` |

These are emitted by `apps/ai-institute/src/middleware.ts` (`VERIFIED` in source). The enforced CSP's
`connect-src 'self'` is the reason the historical B2 client-side requests were blocked — the
storage-health fix now gates that path instead of relying on CSP.

**Observation (not a defect):** the enforced policy still permits `'unsafe-inline'` and
`'unsafe-eval'` for scripts, which weakens CSP's value against XSS. The report-only variant exists
as a staging ground. Tightening is a security-hardening task, not a V2 foundation requirement.

## 5. Preview worker verified independently

| Route | Status | Bytes |
|---|---|---|
| `/` | 200 | 102,657 |
| `/api/health` | 200 | 161 |
| `/curriculum` | 200 | 246,635 |
| `/login` | 200 | 22,271 |
| `/diagrams/curriculum/curriculum-learning-pathway.svg` | 200 | 6,440 |

**Conclusion (`VERIFIED`):** the Cloudflare preview path is fully functional and can carry the
canonical preview role. The Vercel path is therefore **not** required for preview verification — the
dependency asserted in the master directive is satisfied.

## 6. Deployment architecture (verified)

```
push to master  ──►  deploy-cloudflare.yml
                      build job   (no credentials): checkout → pnpm install → next build →
                                    materialise conditional exports → opennextjs-cloudflare build
                                    → upload artifact "cloudflare-opennext-bundle"
                      deploy job  (needs: build, holds CLOUDFLARE_API_TOKEN + ACCOUNT_ID):
                                    download artifact → opennextjs-cloudflare deploy
                                    → Worker "bhavya-foundation"

pull_request     ──►  ci.yml                (lint/typecheck, test, secret-scan, contract, build)
                └──►  opennext-build-verify.yml  (production-equivalent build, no deploy)
                └──►  opennext-preview.yml   → Worker "bhavya-foundation-preview"
```

**Boundary properties (`VERIFIED` from source):** production credentials exist only in the deploy
job; the build job holds none; the deploy job cannot start without a verified bundle; preview never
targets the production worker; preview uses a separate `wrangler.preview.json`.

## 7. Unverified assumptions, stated plainly

| Assumption | Status | Why |
|---|---|---|
| Production Worker `953f06bb` runs exactly `98388ddb` | `INFERRED` | the deploy workflow ran from that commit and the live site serves the manifest fix, but the deployed bundle's embedded commit metadata was not read |
| The production Turso database contains learner records and Mission Control tables | `UNKNOWN` | no read-only database path exists locally; production secrets are Worker-side |
| No learner data is exposed in any public asset | `UNKNOWN` | no data audit was performed in this phase |
| `Cache-Control: s-maxage=31536000` is intentional | `UNKNOWN` | not documented in the repository |
| Deployment `953f06bb` is the only production deployment that matters | `INFERRED` | 47 production deployments exist; the current one is the live version |
