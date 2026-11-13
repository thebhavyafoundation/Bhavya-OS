# BFAOS V2 — 11 Risk Register

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

Severity: **Critical** · **High** · **Medium** · **Low**. Status: `OPEN` · `MITIGATED` · `ACCEPTED` ·
`PROPOSED` (fix drafted, awaiting founder approval).

| ID | Risk | Severity | Evidence | Impact | Mitigation / owner |
|---|---|---|---|---|---|
| **R-01** | **Supabase authentication is unavailable** — both projects paused; the declared architecture says Supabase is the authentication provider while the running path uses Turso-backed `api-auth` sessions | High | Supabase MCP `list_projects` → both `INACTIVE`; `PLATFORM-TRUTH.md:6`; `src/lib/auth.ts` vs `src/lib/api-auth.ts` | Learner sign-in may fail without warning; the architecture record misleads every future agent | **Founder decision D-03** (restore + keep-warm vs migrate). Interim: document the real path (T-104) and add a liveness check |
| **R-02** | **Unprotected production branch** — branch protection on `master` unverifiable; that branch auto-deploys to production | High | REST `/branches/master/protection` → 403 | Any write-access holder can ship straight to production | Founder/admin sets protection with required checks (T-103 evidence supports it) |
| **R-03** | **Three workflows inherit the default token scope**, one holding production Cloudflare credentials | High | workflow files (`deploy-cloudflare.yml`, `deploy.yml`, `opennext-build-verify.yml`) | A compromised dependency in those workflows inherits more token scope than needed | **PR #63** (draft) contains the exact fix; founder hold can be released — it is orthogonal to the Vercel issue that triggered the hold |
| **R-04** | **Unproven autonomous execution** — no demonstration that OpenCode can run headless in a runner with a free provider | High | no such workflow exists | The entire Phase 4 capability is blocked | **T-301** — one bounded read-only proof; founder to confirm no billing can be enabled |
| **R-05** | **Mission Control may be dormant** — reachable, guarded, schema-complete, but no evidence of a real job/approval record | Medium–High | API 401 live; no local read path to production DB | V2 would extend a system nobody uses | **T-102** (read-only production query) |
| **R-06** | **Kernel is application-orphaned** — 28 modules, 11 library consumers, zero app consumers | Medium | `git grep '@bhavya/kernel'` | Orchestration capability is unproven in production; a second orchestrator may get written by mistake | Blueprint decision: adopt the kernel, not replace it; **T-202/T-203** wire it to Mission Control first |
| **R-07** | **Four competing agent registries**, one stale and generated | Medium | `.ai/agents/registry.yaml`, `registry/agents.json` (2026-09-17), `platform/agents/`, `platform/ai-runtime/` | Agents and humans get different pictures of the organisation | **T-101** |
| **R-08** | **Two audit stores** with no declared authority | Medium | `mc_decisions` vs `audit-repository.ts` | Audit history can disagree with itself | **T-402** |
| **R-09** | **15 stale pull requests**, several based on pre-`master` SHAs | Medium | GitHub PR list | Merging one can revert newer work | **T-103** |
| **R-10** | **Public financial content** — `content/financials/` holds four tracked financial JSON files in a public repository | Medium | `git ls-files content/financials` | Possible institutional disclosure | Founder review (new finding this phase) |
| **R-11** | **No documented learner-data retention or deletion policy** | Medium | no policy found in `docs/` | Safeguarding exposure; unknown ability to erase a learner's record | **T-803** |
| **R-12** | **Production deploy has no environment protection and no concurrency control** | Medium | `deploy-cloudflare.yml` | Overlapping deploys; approval is procedural, not enforced | Add `environment: production` + `concurrency` — L2, founder approval |
| **R-13** | **`pages.yml` can publish publicly from a feature branch** | Medium | workflow trigger | unintended public publication | Founder decision on intent; restrict trigger (L2) |
| **R-14** | **CSP allows `'unsafe-inline'` and `'unsafe-eval'`** | Medium | production `content-security-policy` | Reduced XSS containment | Move to the report-only variant first, then tighten |
| **R-15** | **Undocumented one-year CDN cache** on `/` and `/curriculum` | Medium | `Cache-Control: s-maxage=31536000` | Content corrections may remain invisible for a year | **T-703** |
| **R-16** | **Verification asymmetry** — 35 test files in one app, 0 in seven others; 13/67 packages testable | Medium | test-file census | A green CI run evidences only the canonical app | **T-704/T-705** |
| **R-17** | **Vercel preview unusable** — a third defect (symlinked deployment package) remains after two drafted repairs | Low–Medium | `docs/verification/2026-11-13-vercel-output-directory-repair-phase-1d.md` | Noise on every PR; but the canonical Cloudflare preview already replaces it | Keep Vercel non-canonical; either finish the repairs or formally retire the path |
| **R-18** | **Vercel team scope missing in the MCP** (403) while the CLI holds it | Low | MCP error text | Tooling inconsistency | Use the CLI for team-scoped reads |
| **R-19** | **Ruflo endpoint expired** (410) with preserved experimental work | Low | RPC probe | Dead integration that could be mistaken for a working capability | Keep isolated; do not revive without evidence of value |
| **R-20** | **B2 unverified** — configured, but no confirmed bucket or key access; not on the live path | Low | `.env.example` names only | Artifact plan has no proven destination | Verify bucket access before Phase 2 artefact work |
| **R-21** | **Homepage accessibility gaps** — no skip link; `<h1>` renders "Building forGenerations."; favicon 404 | Low–Medium | `02-production-truth.md` F-P1..F-P3 | Keyboard/screen-reader friction | **T-701** |
| **R-22** | **Qdrant dependency unused/unknown** | Low | env names present, no live evidence | Unnecessary dependency or hidden service | Decide use-or-remove in **T-501** |
| **R-23** | **Agent context is ephemeral** — session state lives only in the local session | Low | architecture | Long-running work cannot resume after interruption | Checkpoints (**T-203**) |
| **R-24** | **`mc_jobs.status` lacks `blocked`/`quota_paused`** values | Low | schema CHECK constraint | The blueprint's lifecycle cannot be expressed exactly | **D-08** — reuse existing vocabulary or extend the constraint by migration |
| **R-25** | **Turso backup retention is 1 day on the free plan, unverified for this account** | Medium | Turso pricing | A mistake found late may be unrecoverable | **T-801** verification drill |

## Concentration of risk

Three of the top five risks (R-01, R-02, R-03) are **provider/governance configuration**, not code.
They are cheap to fix and are blocked only on founder-held access or decisions. The two highest-value
*engineering* unknowns (R-04, R-05) are both answerable with **read-only** evidence gathering.
