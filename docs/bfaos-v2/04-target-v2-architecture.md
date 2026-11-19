# BFAOS V2 — 04 Target Architecture and Current-to-Target Mapping

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

The blueprint's target architecture is treated as a **hypothesis to validate against the repository**,
not as permission to create systems. This document records the validation result and the resulting
reuse / integrate / repair / defer / retire decisions.

## 1. Validation of the target architecture

| Blueprint layer | Validation result | Decision |
|---|---|---|
| **Mission Control** (founder interface, jobs, approvals, audit) | **Already exists and is production-reachable** — API, UI, schema, role gates | **EXTEND**, do not create |
| **Governance & approvals** | Exists as `mc_approval_requests` + `mc_decisions` + `AGENTS.md` human gates | **EXTEND** |
| **BFAOS orchestrator** | `packages/kernel` implements orchestrator/coordinator/scheduler/idempotency/permissions/replay — but no app consumes it | **ADOPT the kernel** (do not write a new orchestrator) |
| **Agent system** (roles, registry, tools, delegation) | 4 overlapping descriptive registries; only `opencode.json` is executable | **CONSOLIDATE to one registry**, keep OpenCode as the runtime |
| **Task engine** (scheduling, queue, checkpoints, retry) | `mc_jobs` + `mc_sessions` + kernel `Scheduler`/`Idempotency`/`ReplayEngine` | **EXTEND existing**, no second ledger |
| **Knowledge** (memory, docs, evidence, search) | `packages/knowledge-*`, `packages/memory-engine`, `docs/` (786 files), `packages/content-*` | **EXTEND**; no new vector store |
| **Execution adapters** (OpenCode, GitHub Actions, integrations) | GitHub Actions proven; OpenCode headless execution in Actions **not yet demonstrated** | **PROVE** before automating; do not assume |
| **Founder interface (Slack)** | Not integrated at all | **DEFER** behind a working read-only status path |
| **D1 job ledger** | 0 databases; would duplicate Turso Mission Control | **REJECT** |
| **Hermes agent runtime** | Not installed; no demonstrated unique capability | **REJECT for now**; re-evaluate only on evidence |
| **Ruflo orchestration** | Endpoint 410; model quality inadequate; cancellation unreliable | **REJECT for now**; keep preserved |

## 2. Target architecture as validated

```
                 FOUNDER (phone or desktop)
                          |
              GitHub PR / Issue  (existing authority channel)
                          |
        +-----------------+------------------+
        |                                    |
   MISSION CONTROL (existing)          CI (existing)
   /os/mission  API + UI                ci.yml, opennext-*.yml
   mc_jobs / mc_sessions                    |
   mc_approvals / mc_decisions       Vercel optional (non-canonical)
        |                                 Cloudflare preview worker
        |  job / approval / decision         |
        v                                      v
   TURSO (existing)  ------------------>  CANONICAL APP
   getAsyncDb()                            ai-institute @ Cloudflare/OpenNext
        |                                      |
        |  execute / checkpoint / evidence     |  read-only status
        v                                      v
   packages/kernel (existing)            FOUNDER (same Mission Control surface)
   orchestrator / coordinator / scheduler
   idempotency / permissions / replay / backup
        |
        v
   EXECUTION ADAPTERS
   GitHub Actions (ephemeral runner)  |  OpenCode headless (to be proven)
        |
        v
   ARTIFACTS  ->  B2 (private, verified)  |  GitHub Actions artefacts (7-14 d)
        |
        v
   AUDIT  ->  mc_decisions (append-only)  |  docs/bfaos-v2/ (durable narrative)
```

**What is deliberately absent:** no D1, no second job ledger, no second scheduler, no second
permission engine, no second audit log, no Slack as a shell, no Hermes, no Ruflo.

## 3. Capability-by-capability mapping

| Proposed capability | Existing implementation | Missing | Reusable component | Risk / dependency | Recommendation |
|---|---|---|---|---|---|
| Founder mission control surface | `/os/mission` UI + API, role-gated | live status of CI, deployments, health, quotas | Mission Control repository + schema | requires an operator account; no live data confirmed | **Repair/extend**: add read-only status panels on top of existing pages |
| System health | `/api/health`; kernel `health`, `monitoring`, `observability` | aggregated fleet view | kernel health/observability | must not become a second telemetry store | **Reuse kernel**, expose through Mission Control |
| Active jobs | `mc_jobs` + `mc_sessions` | job creation path that writes them | Mission Control schema | production DB contents unknown | **Extend**; verify data first |
| Pending approvals | `mc_approval_requests` + `/os/mission/approvals` | linkage to GitHub PRs | Mission Control | approval identity/dedup rules | **Extend** |
| Agent activity | `registry/agents.json`, `.ai/agents/registry.yaml`, `platform/agents/` | one executable registry; activity recording | OpenCode `opencode.json` | 4 competing registries | **Consolidate to one**; record activity in `mc_sessions` |
| Audit history | `mc_decisions` (append-only) + `audit-repository.ts` | one authority | `mc_decisions` | two audit stores today | **Consolidate onto `mc_decisions`** |
| Artifacts | `mc_artifacts`, `mc_artifact_versions` | B2 object key/checksum columns | Mission Control + B2 | B2 bucket access unverified | **Extend schema** only after B2 access is proven |
| Task intake / classification | none (manual today) | intake + risk classifier | kernel `capability-matcher`, `contracts` | needs a task contract schema | **Design in Phase 2** |
| Autonomous execution | GitHub Actions proven; OpenCode headless unproven | headless OpenCode in a runner | OpenCode 1.18.33, skills | provider quota; model availability | **Prove** with one bounded task before automating |
| Checkpointing | `mc_sessions`; kernel `replay`, `backup` | checkpoint payload store | kernel + Turso | no store chosen | **Reuse**; add a checkpoint table in the existing migration scheme |
| Knowledge retrieval | `packages/knowledge-engine`, `search-engine`, `memory-engine`, `docs/` | unified retrieval entry point | those packages | Qdrant usage unknown | **Reuse**; no new vector DB |
| Model routing | OpenCode providers; free-tier session model | explicit routing policy + fallback | OpenCode | quota; no local model | **Design** after provider inventory |
| Slack notification | none | app + scopes | — | founder OAuth required | **Defer** |
| Deployment status | Cloudflare API access verified | surface it | Cloudflare MCP/API | token scope | **Reuse**; read-only status first |

## 4. Reuse / integrate / repair / defer / retire

**REUSE (build on, do not rebuild)**
Mission Control schema and repository; Turso via `getAsyncDb()`; `packages/kernel`
(orchestrator, idempotency, permissions, replay, backup, rate-limit, contracts); GitHub Actions as the
only execution environment; Cloudflare/OpenNext as the only deployment authority; OpenCode as the only
agent runtime; `docs/` as the institutional record; the existing `bhavya-*` skills.

**INTEGRATE (connect what already exists)**
Mission Control UI/API ↔ CI status; Mission Control ↔ Cloudflare deployment status; kernel ↔
Mission Control repository (so a job row and a kernel run are the same thing); OpenCode headless ↔
GitHub Actions; B2 artifact storage ↔ `mc_artifacts`.

**REPAIR (fix before extending)**
Supabase authentication continuity (both projects inactive); the stale `registry/agents.json`;
duplicate audit stores; the 15 stale pull requests; the missing homepage skip link and favicon;
`Cache-Control` policy; production database observability.

**DEFER (needs founder input or later phases)**
Slack interface; Notion/Drive/Dropbox integration; model routing policy and fallback; automated
deployment promotion (never automatic); capacity planning.

**RETIRE / DO NOT START**
D1 as a job ledger; a second scheduler, permission engine or audit log; Hermes; Ruflo as an
orchestration dependency; Vercel as a canonical path; any "parallel Mission Control".

## 5. Failure and recovery model (target)

| Failure | Existing mechanism | Target behaviour |
|---|---|---|
| Agent session lost | none in BFAOS | checkpoint row in `mc_sessions` (kernel `replay`) resumes by job + attempt |
| Runner dies mid-task | GitHub Actions re-run | job stays `running`; a watchdog marks it `failed` with attempt count; retry is idempotent by `Idempotency` key |
| Duplicate dispatch | none | `Idempotency` key per command; job row PK prevents double-creation |
| Model quota exhausted | none | job → `QUOTA_PAUSED` equivalent (`mc_jobs.status='stopped'` + `mc_decisions.action='pause'`), artifact retained, founder notified |
| Integration unavailable | none | job → `failed` with provider recorded; no silent degradation |
| Database unavailable | Turso | degrade to local SQLite for development only; production writes must fail loudly, never silently fall back |
| Deployment fails | `opennext-build-verify.yml` | production deploy never starts without a verified bundle (already enforced) |

**Gap to close in Phase 2:** `mc_jobs.status` has no `blocked` or `quota_paused` value; the schema's
existing vocabulary must be reconciled with the blueprint's lifecycle rather than duplicated.

## 6. The blueprint's own assumptions, corrected

| Blueprint statement | Verification result |
|---|---|
| "Mission Control foundations" as if incomplete | **More complete than assumed** — API, UI, role gates and schema all exist |
| "Cloudflare D1 — durable job ledger" | Rejected: D1 has 0 databases and would duplicate Turso Mission Control |
| "Hermes — agent runtime" | Not installed; no demonstrated capability beyond OpenCode + kernel |
| "Ruflo — remote orchestration" | Endpoint 410; cancellation unreliable; keep experimental |
| "Slack founder interface" | Requires founder OAuth; not yet a dependency of anything |
| "GitHub Actions ephemeral execution" | Proven for build/deploy; **headless OpenCode in a runner is unproven** — this is the highest-value thing to prove next |
| "Vercel optional, non-canonical" | Confirmed and demonstrated: the Cloudflare preview worker fully replaces it |
