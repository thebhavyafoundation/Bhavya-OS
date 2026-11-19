# BFAOS V2 — 09 Security and Data Model

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. Security boundaries (verified)

| Boundary | Current enforcement | Evidence |
|---|---|---|
| Read-only inspection | `plan` agent denies `edit`/`bash`/`task` | `opencode.json` |
| Secret access | deny-list for `.env*`, `auth.json`, `mcp-auth.json`, `.git-credentials`, `.npmrc`, `credentials*`, `*.pem`, `*.key` | user `opencode.jsonc` |
| Destructive operations | `ask` for `git push/reset --hard/clean/checkout --/rm/rm -rf/Remove-Item` | user `opencode.jsonc` |
| Repository writes | pre-commit (lint-staged), commit-msg (commitlint), pre-push (wrapper + platform-contract + secret scan + review record) | `.husky/` |
| CI token scope | explicit `permissions:` in 6 of 9 workflows; 3 inherit the repository default | workflow files |
| Production credentials | held only by the deploy job, after a verified bundle | `deploy-cloudflare.yml` |
| Preview isolation | separate worker + separate wrangler config; no production secrets | `opennext-preview.yml` |
| Application secrets | env-var names only; no values in repository | `apps/ai-institute/.env.example` |
| Transport security | HSTS (2 years, preload), `x-frame-options: DENY`, `nosniff`, `referrer-policy`, `permissions-policy` disabling camera/microphone/geolocation | production response headers |
| Content security | enforced CSP + a report-only variant that additionally allows the B2 host | production response headers; `src/middleware.ts` |
| Route protection | middleware requires a session cookie on `/app`, `/dashboard`, `/os`, `/studio`, `/onboarding`, `/api/studio`; CSRF origin/referer checks on mutating `/api/*` | `src/middleware.ts` |
| API authorisation | session lookup + expiry check in `api-auth.requireAuth`; role gate for Mission Control operators | `src/lib/api-auth.ts`, `src/app/os/mission/api/_auth.ts` |
| Public surface hygiene | `X-Robots-Tag: noindex, nofollow` on API, app, studio, dashboard, profile, login, register, onboarding, forbidden and non-public `/os` routes | `src/middleware.ts` |

**Assessment:** the security posture is materially better than the average monorepo, and it is enforced
by configuration and code rather than by convention.

## 2. Data classification

| Class | Examples | Current handling |
|---|---|---|
| **Public** | curriculum content, manifests, diagrams, governance pages, documentation | tracked in a public repository; served publicly by design |
| **Internal** | agent registry, kernel source, platform packages, workflow definitions | in the public repository (no secrets), but not intended as public API |
| **Confidential** | Turso learner records, session tokens, `profiles` rows, progress data | production database; reachable only through session-validated server code (verified: `/api/auth/me` and `/api/student` → 401) |
| **Sensitive learner data** | child/user accounts, enrolment, progress, assessment responses | Turso; no retention/deletion policy found in the repository; **not audited this phase** (`UNKNOWN`) |
| **Credentials** | `CLOUDFLARE_API_TOKEN`, `VERCEL_TOKEN`, Supabase keys, B2 keys, MCP bearer tokens | Worker secrets and local stores; denied to the agent read layer; never printed in any BFAOS report |
| **Institutional governance** | constitution, governance manual draft, donor/financial records | `docs/constitution/`; **note:** `content/financials/` holds four tracked financial JSON files in a **public** repository — worth a founder decision on whether that is intended |

**Gap (G-11):** `content/financials/FIN-2026-Q*.json` and `content/transparency.mdx` are tracked in a
public repository. This was not evaluated this phase; it is flagged for founder review because the
directive forbids public disclosure of private institutional information.

## 3. Learner-data posture

- **Verified live:** unauthenticated access to learner endpoints returns 401; protected pages redirect;
  the session cookie is `httpOnly`, `secure` in production, `sameSite: strict`, 7-day lifetime.
- **Verified in source:** progress writes are batched through API routes rather than fired per scroll
  event (`/api/student/progress`), matching the blueprint's low-bandwidth principle.
- **Unknown:** retention and deletion policy for learner records; whether `profiles`/progress data can
  be exported or erased on request; whether any learner identifier reaches logs or analytics.

**Requirement before any persistent new learner-data surface:** a stated retention period, a deletion
path, and synthetic data in all tests.

## 4. Auditability

| Property | State |
|---|---|
| Append-only decision log | `mc_decisions` — schema comment "Human decisions — append-only audit log. Never updated or deleted"; 12 action types |
| Session-level audit | `audit-repository.ts::recordAuditEvent` used by the auth routes |
| PR-level audit | GitHub PR timeline, review state, required-check results, commit identity |
| Execution audit | `mc_sessions` (producer, status, timestamps), `mc_jobs.created_by` |
| Artefact lineage | `mc_artifact_versions` (version, session_id) |
| **Conflict** | **Two audit stores without a declared authority** (`mc_decisions` vs `audit-repository.ts`) |
| Missing | no single place answers "what did an agent do, under which authorisation, producing which artefact, with which test evidence, and what was the outcome" — this is exactly the V2 audit requirement, and it can be built from existing tables |

**Decision (`03-existing-architecture.md`):** `mc_decisions` is the canonical audit store; the
application audit helper becomes a writer **into** it, not a parallel system.

## 5. Asset licensing and provenance

- Third-party skills are individually licensed and pinned: `icm-architect` (MIT, commit pinned),
  `impeccable` (Apache-2.0, v4.4.0), `ponytail` (MIT, commit pinned), `diagram-design` (MIT, pinned).
- Two third-party skills remain **laptop-only** with unverified licences (`apple-design`,
  `design-taste-frontend`); their Bhavya wrappers deliberately refuse to load them.
- The wrapper registry (`scripts/check-skill-wrappers.mjs`) enforces the platform-context marker and
  refuses unverified skills — `pnpm wrapper:check` PASS with 19 wrappers.

## 6. Recovery and backup

| Asset | Backup path | Status |
|---|---|---|
| Source | GitHub (public, 662 commits, 2 authors active in 30 days) | healthy |
| Production database | Turso, 1-day point-in-time restore on the free plan | **UNKNOWN whether backups exist for this account** |
| Build artefacts | GitHub Actions artefacts, 7-day retention (CI) / 14-day (assets) | healthy but short-lived |
| Large assets | B2 (configured; not on the live path) | no verified bucket access |
| Documentation and evidence | `docs/` in GitHub | healthy |
| Agent context | local session only | **ephemeral — must be checkpointed into `mc_sessions`/artefacts** |

**Gap (G-12):** the only production backup evidence is the free-tier 1-day PITR window, and even that
is unverified for this account. With 1-day retention, a mistake discovered tomorrow may be
unrecoverable next week. Founder decision required on a verification read (and, if desired, a longer
retention plan — which would cost money and therefore needs approval).

## 7. Ranked security findings

| # | Finding | Severity | Status |
|---|---|---|---|
| S1 | Supabase (the declared authentication provider) has **both projects paused**; the running path silently differs from the declared architecture, and no alerting exists | **High** | open — founder decision D-03 |
| S2 | Branch protection on `master` unverifiable (403) on the branch that auto-deploys to production | **High** | open — founder action |
| S3 | Three workflows inherit the repository-default token scope; one of them holds production credentials | **High** | drafted as PR #63 (founder hold) |
| S4 | Two audit stores with no declared authority | Medium | open |
| S5 | `pages.yml` can publish publicly from a feature branch | Medium | open |
| S6 | Production deploy has no environment protection and no concurrency control | Medium | open |
| S7 | Financial JSON tracked in a public repository | Medium | **new in this phase** — founder review |
| S8 | CSP still permits `'unsafe-inline'` and `'unsafe-eval'` for scripts | Low–Medium | improvement; report-only variant is the safe route |
| S9 | No documented retention/deletion policy for learner data | Medium | open |
| S10 | Homepage has no skip link and a 404 favicon (accessibility/polish) | Low | open |
| S11 | `Cache-Control: s-maxage=31536000` undocumented | Low–Medium | open |
| S12 | Stale agent registry advertises an outdated inventory | Low | open |
| S13 | 15 stale PRs could revert newer work if merged | Medium | open |
