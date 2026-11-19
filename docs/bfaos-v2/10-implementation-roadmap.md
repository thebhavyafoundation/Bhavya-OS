# BFAOS V2 — 10 Implementation Roadmap

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

Ordered by dependency and value. **Phase 1 (reconciliation) and the first three Phase 2 tasks are
documentation- or verification-only and carry no production risk.** Everything at risk level L2/L3 is
marked as requiring explicit founder authorisation and is *not* executed by this phase.

Status legend: `READY` (can start under current authority) · `FOUNDER-GATED` (needs an explicit decision
or credential) · `BLOCKED` (needs an unknown resolved first).

---

## Phase 1 — Architecture reconciliation (documentation only)

| ID | Objective | Depends on | Files / packages | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|---|---|
| **T-101** | Publish the canonical capability map; designate one authoritative agent registry and mark the other three as descriptive-only (or retire them) | Phase 0 | `.ai/agents/registry.yaml`, `registry/agents.json`, `platform/agents/`, `platform/ai-runtime/`, `scripts/generate-registry.js` | L1 | none (docs) | exactly one registry is named authoritative; consumers can find it from `AGENTS.md` | `pnpm wrapper:check` + `pnpm platform:check` pass; doc links resolve | revert the commit; no code changed |
| **T-102** | Determine whether Mission Control holds live data: read-only query of the production Turso database for `mc_jobs` / `mc_decisions` / `mc_approval_requests` counts and latest timestamps | production read credential | `packages/database`, `apps/ai-institute/src/lib/db.ts` | L0 read-only (credential access = founder action) | **founder provides read-only access** | counts + latest row timestamps recorded in `03-existing-architecture.md`; zero writes performed | query log shows SELECT-only; row counts captured | n/a (read-only) |
| **T-103** | Classify all 20 open PRs as merge / supersede / close, and quarantine any whose base has diverged from `master` | Phase 0 | GitHub PR metadata | L0 classification; L3 for any merge | classification needs none; **merges need founder approval** | every open PR has a recorded disposition and a named rationale | disposition table in `11-risk-register.md`; `git merge-base` divergence computed per PR | n/a (no merges performed) |
| **T-104** | Reconcile the declared-vs-running authentication architecture: document that `api-auth` (Turso sessions) is the live learner path and Supabase is a secondary/legacy path | Phase 0 | `docs/architecture/`, `PLATFORM-TRUTH.md` | L1 (docs) | none | the architecture document states one truth, matching observed behaviour | doc review + live 401 evidence | revert |

## Phase 2 — Execution foundation (first three tasks only)

| ID | Objective | Depends on | Files / packages | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|---|---|
| **T-201** | Define the **task contract schema** as a JSON payload carried in `mc_jobs.task_contract_ids` + `mc_artifacts(kind='contract')` — covering objective, scope, dependencies, risk level, approval requirement, budget, deadline, checkpoint, evidence requirement. **No new table.** | T-102 (data shape), T-101 | `packages/database/migrations/ai-institute/` (contract artefact kind only), `packages/kernel/src/contracts` | L1 | none | contract schema documented; a contract round-trips through the existing MC repository; no schema change to `mc_*` | unit test in `apps/ai-institute/src/lib/__tests__/mission-control.test.ts` passes in CI | revert the commit |
| **T-202** | Define the **agent activity record**: map `mc_sessions.producer` / `status` / timestamps to the running agent and attempt, so Mission Control can show who is doing what | T-201 | `mc_sessions`, kernel `coordinator` | L1 | none | a session row can be written and read back through the existing repository; Mission Control shows the producer | CI test + manual read-back in preview | revert |
| **T-203** | Specify the **checkpoint payload and resume contract** as a `mc_artifact_versions` row of kind `checkpoint`, with the kernel `ReplayEngine` as the resume mechanism, and an explicit "never replay a non-idempotent action" rule | T-201 | `mc_artifact_versions`, `packages/kernel/src/replay` | L1 | none | checkpoint write/read/resume is specified and dry-run in a test | unit test; documented resume procedure | revert |

**Then STOP at the next approval boundary** (T-301/T-302 and D-03/D-04).

## Phase 3 — Prove the execution adapter (founder-gated)

| ID | Objective | Depends on | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|---|
| **T-301** | **Prove headless OpenCode inside a GitHub Actions runner on a free provider** — one bounded read-only task, no payment method, no secrets | free provider access in CI | L1 (new workflow, no production effect) | **founder: confirm no billing may be enabled** | the runner completes a trivial read-only task and emits a structured result; Actions minutes consumed are within the free allowance | workflow run log; no `secrets.` additions beyond what already exists | delete the workflow; no state |
| **T-302** | Define the execution-adapter interface (input contract → worktree → checks → evidence → draft PR → job row update) | T-301 | L1–L2 | founder approval of the adapter design | interface documented and reviewed; no implementation yet | design review | n/a |

## Phase 4 — Mission Control integration (founder-gated)

| ID | Objective | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|
| **T-401** | Add read-only status panels to the existing `/os/mission` pages: CI status of the candidate commit, Cloudflare deployment status, provider quota snapshot | L2 (shared app) | founder | panels render for an operator and expose no mutation | preview build + operator smoke test | revert |
| **T-402** | Surface `mc_decisions` as the single audit view and route `audit-repository.ts` writes into it | L2 (data model) | founder + architecture decision | one audit query answers "what changed, under what authorisation" | query equivalence test | revert; both stores remain readable |
| **T-403** | Implement the **founder status report** generator (daily/weekly summary of jobs, approvals, failures, quotas) from existing tables | L2 | founder | report content matches the schema; no new store | generated report reviewed against live data | revert |

## Phase 5 — Knowledge and model routing (founder-gated)

| ID | Objective | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|
| **T-501** | Consolidate retrieval onto `packages/knowledge-engine` + `search-engine` + `docs/`; decide the Qdrant question (use or remove the env dependency) | L1–L2 | founder | one retrieval entry point; no duplicate index | retrieval test on known documents | revert |
| **T-502** | Write the **model routing policy**: free-tier providers only, task→model mapping, quota-aware fallback that pauses rather than pays, explicit reporting of model failures | L1 (docs) | founder confirms provider limits | policy states the no-paid-fallback rule and the pause behaviour | policy reviewed against `08-integration-map.md` quota table | n/a |
| **T-503** | Demonstrate one end-to-end autonomous task: intake → classification → plan → approval gate → execution in CI → evidence → draft PR | L1–L2 | founder | draft PR produced by an agent, unmerged, with evidence attached | PR + evidence review | close the PR; job row marked cancelled |

## Phase 6 — Founder interface (founder-gated, requires OAuth)

| ID | Objective | Risk | Permission | Acceptance criteria | Verification | Rollback |
|---|---|---|---|---|---|---|
| **T-601** | Connect Slack **notification only** (status, approvals, failures) — no command execution | L2 + external service | founder OAuth + app scopes | notifications arrive; no command path exists | end-to-end notification test | revoke scopes |
| **T-602** | Only then: Slack **commands** that create Mission Control jobs, with signature verification, replay protection and an identity allowlist | L2 + external service | founder | commands create jobs; unauthorised requests rejected | negative tests for signature, replay, identity | disable the app |

## Phase 7 — Product excellence (ongoing, evidence-led)

Prioritised by learner impact, not novelty:

| ID | Objective | Evidence of need | Risk | Permission |
|---|---|---|---|---|
| **T-701** | Add a skip-to-content link and a favicon (WCAG 2.4.1 bypass; the only console error on the homepage) | `02-production-truth.md` F-P1/F-P2 | L1 | none beyond normal review |
| **T-702** | Review `/learning-paths` — it exposes no "program" framing while the curriculum route does; align vocabulary with the curriculum hierarchy | live probe showed 40 links, no program terminology | L1 | none (copy change needs educational review) |
| **T-703** | Audit `Cache-Control` policy for content pages and document it | `s-maxage=31536000` on `/` and `/curriculum` | L1–L2 | founder |
| **T-704** | Add tests for the seven untested applications (starting with `admin`, which holds operational views) | 0 test files in 7 of 8 apps | L1 | none |
| **T-705** | Extend tests into the 54 packages without a `test` script, prioritising those on the production import path | 13/67 packages testable | L1 | none |

## Phase 8 — Operational maturity (founder-gated)

| ID | Objective | Risk | Permission |
|---|---|---|---|
| **T-801** | Recovery drill: restore from Turso PITR and verify a full production rebuild path | L3 | founder |
| **T-802** | Scheduled quota monitoring and a documented `QUOTA_PAUSED` procedure | L2 | founder |
| **T-803** | Backup/retention policy for learner data and institutional artefacts | L2 + policy | founder + governance |
| **T-804** | Independent audit of the BFAOS permission model before any autonomy is claimed | L2 | founder |

## Sequencing rationale

T-101→T-104 (read-only, zero risk) → T-201→T-203 (schema-shaped, no new tables) → **T-301/T-302**
(the one unknown that gates everything) → T-401→T-403 (founder visibility) → T-501→T-503 (knowledge
and one autonomous task) → T-601/T-602 (Slack, only after read-only notifications prove out) →
T-701+ (product, running in parallel) → T-801+ (maturity, after the above work).

**No task above creates a second scheduler, ledger, permission engine, audit log or agent runtime.**
