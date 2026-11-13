# BFAOS V2 — 03 Existing Architecture

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

Each capability is classified with evidence. **Source-code existence is never treated as working
capability.**

Legend: `IMPLEMENTED` · `TESTED` · `INTEGRATED` (imported by a real consumer) · `PRODUCTION-USED` ·
`PARTIAL` · `ORPHANED` (no consumer) · `DUPLICATED` · `UNKNOWN`

---

## 1. Application runtime

| Component | Classification | Evidence |
|---|---|---|
| `apps/ai-institute` (canonical app) | IMPLEMENTED · TESTED · INTEGRATED · PRODUCTION-USED | live at the production worker; 35 test files; deployed by `deploy-cloudflare.yml` |
| `apps/admin`, `github-os`, `ioc`, `social-os`, `docs`, `design-system`, `bhavya-intelligence-network` | IMPLEMENTED (some) · UNTESTED · ORPHANED from the canonical deploy path | 0 test files each; none is a production deploy target; `deploy.yml` targets a nonexistent `main` branch |
| Cloudflare/OpenNext deployment | IMPLEMENTED · TESTED · INTEGRATED · PRODUCTION-USED | `opennext-build-verify.yml` green on candidate commits; production deploys green |
| Turso application data | INTEGRATED · PRODUCTION-USED (inferred) · PARTIAL verification | `apps/ai-institute/src/lib/db.ts` → `getAsyncDb()` dynamically imports the Turso/libSQL client in production and applies an idempotent baseline schema on first init; local mode uses better-sqlite3 |
| SQLite local mode | IMPLEMENTED · TESTED | `packages/database/data/bhavya.db`; `getAsyncDb()` local branch |
| Supabase authentication | INTEGRATED but **provider inactive** · PARTIAL | `apps/ai-institute/src/lib/auth.ts` → `supabase.auth.getUser()`; both Supabase projects report `INACTIVE` (Phase 1-B/C) |
| Session/credential auth (`api-auth`) | IMPLEMENTED · INTEGRATED · PRODUCTION-USED | `/api/auth/login` → `findUserByEmail` → `verifyPassword` → `createSession` → httpOnly `session-token` cookie; 401 enforced live |
| Backblaze B2 asset store | CONFIGURED · NOT ON THE LIVE PATH | production HTML contains 0 `backblazeb2.com` references; all homepage assets are served from Worker static assets |
| Vercel | OPTIONAL / NON-CANONICAL · currently failing | see `docs/verification/2026-11-13-vercel-*`; two repairs staged as draft PRs #64 and #65, one further defect open |

## 2. Mission Control (the job/approval system)

**This is the single most important finding of Phase 0: Mission Control is a real, production-reachable
system, not a schema sketch.**

| Element | Classification | Evidence |
|---|---|---|
| Schema — `mc_jobs`, `mc_artifacts`, `mc_artifact_versions`, `mc_approval_requests`, `mc_decisions`, `mc_sessions`, `mc_destinations` | IMPLEMENTED | migrations `003_`, `004_`, `005_` in `packages/database/migrations/ai-institute/` |
| Repository interface | IMPLEMENTED · TESTED | `apps/ai-institute/src/lib/repositories/mission-control-repository.ts` — typed `McJob`, `McArtifact`, `McArtifactVersion`, `McApprovalRequest`, `McDecision`, `McSession`, `McEvidenceRow`, `MissionNode/Edge/Graph` |
| Adapter | IMPLEMENTED · TESTED | `sqlite-mission-control-repository.ts` (async adapter, local + Turso via `getAsyncDb()`); `apps/ai-institute/src/lib/__tests__/mission-control.test.ts` |
| **HTTP API** | IMPLEMENTED · INTEGRATED · PRODUCTION-REACHABLE | `apps/ai-institute/src/app/os/mission/api/{jobs,jobs/[id],approvals,artifacts,evaluations,tasks}/route.ts` — live responses: pages **307** (auth redirect), APIs **401** unauthenticated |
| **UI** | IMPLEMENTED · INTEGRATED | `os/mission/page.tsx`, `jobs/[id]`, `approvals`, `approvals/[id]`, `decisions`, `integrations` |
| **Authorisation** | IMPLEMENTED · ENFORCED | `os/mission/api/_auth.ts` → `requireMissionOperator()` → `requireAuth()` + `roleIsAllowed(role, ["admin","staff"])` → 401 / 403 |
| Job states available | IMPLEMENTED | `mc_jobs.status` ∈ `queued, running, awaiting_approval, revising, completed, stopped, failed, cancelled` |
| Approval states | IMPLEMENTED | `mc_approval_requests.status` ∈ `pending, approved, rejected, revision_requested, expired, cancelled` |
| Append-only decision log | IMPLEMENTED | `mc_decisions.action` ∈ `approve, reject, approve_with_modification, request_revision, regenerate, upload_replacement, pause, resume, retry, abort, takeover, approve_integration`; schema comment states "never updated or deleted" |
| **Production use** | **UNKNOWN** | no telemetry, no record of a real job/approval, and no read-only path to the production database. The system is *reachable and guarded*; whether it is *used* is unverified |
| Second audit store | DUPLICATED | `apps/ai-institute/src/lib/audit-repository.ts::recordAuditEvent` coexists with `mc_decisions` — two audit truths |

**Correction to prior reporting:** an earlier Phase 0 report of mine concluded Mission Control had no
HTTP surface. That search was scoped to `app/api/` and missed the `app/os/mission/` route group. The
conclusion was wrong; this document supersedes it.

## 3. Kernel (`packages/kernel`)

28 modules: `api, auth, backup, boot, capability-matcher, configuration, consensus, contracts,
coordinator, events, health, idempotency, logging, memory, monitoring, observability, orchestrator,
permissions, planner, rate-limit, registry, replay, runtime, scenarios, scheduler, self-organizing,
services, types` + `__tests__`.

| Capability | Classification | Evidence |
|---|---|---|
| `EventDrivenOrchestrator`, `Coordinator`, `Scheduler` | IMPLEMENTED · TESTED (partially) · INTEGRATED (library) · ORPHANED from any application | exported at `packages/kernel/src/index.ts:92,63,31`; 7 test files in the package; **no `apps/**` file imports `@bhavya/kernel`** |
| `Idempotency` | IMPLEMENTED · INTEGRATED (library) | `index.ts:49`; class exported from `idempotency/index.ts` |
| `Permissions` | IMPLEMENTED · INTEGRATED (library) | `index.ts:27` |
| `ReplayEngine` | IMPLEMENTED · INTEGRATED (library) | `index.ts:71` |
| `Backup`, `RateLimit`, `Contracts`, `Consensus`, `CapabilityMatcher`, `Observability`, `Health` | IMPLEMENTED · INTEGRATED (library) | exported from the same barrel |
| Consumer set | 11 packages: `cli`, `knowledge-engine`, `memory-engine`, `planner-engine`, `scheduler-engine`, `search-engine`, `shared`, `workflow-engine` (+ package manifests) | `git grep '@bhavya/kernel'` |

**Assessment:** the kernel is a **substantial, real library that no application currently uses**. It is
the natural home for BFAOS orchestration, but its production behaviour is unproven because nothing
exercises it in a deployed path.

## 4. Runtimes and agent organisation

| Component | Classification | Evidence |
|---|---|---|
| `packages/mission-runtime@0.6.0` | IMPLEMENTED · INTEGRATED (12 consumer files) · UNTESTED (no `test` script) | exports `GatewayClient`, `RegistryReader`, `MemoryReader`, `createEvent`, `log`, `AuthService` |
| `packages/runtime@0.1.0` | IMPLEMENTED · INTEGRATED (4 consumers) · TESTED (`test`, `validate`, `serve`) | — |
| `packages/bee@0.1.0` | IMPLEMENTED · **ORPHANED** | 0 consumer files |
| `platform/agents/` | IMPLEMENTED as documentation only (8 role directories, 0 TS files) | backend-engineer, chief-architect, design-system, devops-engineer, documentation, frontend-engineer, project-manager, qa-engineer |
| `platform/ai-runtime/` | IMPLEMENTED as documentation only (171 files, 0 TS files, no `package.json`) | role/content directories (ai-product-manager, executive-command, content-factory, …) |
| `.ai/agents/registry.yaml` | IMPLEMENTED · DUPLICATED | 9 roles with capabilities/loads/max_files |
| `registry/agents.json` | IMPLEMENTED · **STALE** · DUPLICATED | header says "GENERATED ONLY", `generated_at: 2026-09-17` — predates 11 of the 20 tracked skills |
| `registry/` overall | 240 tracked files — the registry system is the largest documentation surface in the repo | `git ls-files registry` |
| OpenCode agents (`opencode.json`) | IMPLEMENTED · OPERATIONAL | `bhavya` (primary, 150 steps), `build` (primary), `plan` (read-only: `edit/bash/task` = deny) |

**Assessment:** four overlapping descriptions of "the agents" exist. Only `opencode.json` is
executable. The rest are descriptive documents that drift.

## 5. Knowledge, memory, search

| Capability | Classification | Evidence |
|---|---|---|
| `packages/knowledge-engine`, `knowledge-graph`, `knowledge-extraction`, `search-engine`, `memory-engine` | IMPLEMENTED · INTEGRATED (library) · TESTED (kernel consumers) | these are the packages that consume the kernel |
| `packages/content-engine`, `content-core`, `content-board` | IMPLEMENTED · INTEGRATED | `content-core` has a `test` script |
| `docs/` institutional record | IMPLEMENTED · PRODUCTION-USED (public) | 786 files incl. `constitution`, `decisions`, `adr`, `governance`, `security`, `standards`, `verification` |
| Qdrant / vector store | CONFIGURED (env names present) · UNKNOWN whether in use | `QDRANT_API_KEY`, `QDRANT_COLLECTION` appear in tracked code; no evidence of a live collection |

## 6. Execution and integration adapters

| Capability | Classification | Evidence |
|---|---|---|
| GitHub Actions | IMPLEMENTED · TESTED · PRODUCTION-USED | 9 workflows; CI green on candidate commits; production deploy on `master` |
| Cloudflare API | IMPLEMENTED · TESTED · PRODUCTION-USED | read-only API access verified; workers + deployments enumerated |
| Turso client | IMPLEMENTED · INTEGRATED · runtime verification BLOCKED locally | no local credentials; credentials are Worker secrets |
| OpenCode automation | IMPLEMENTED · OPERATIONAL | 1.18.33; 11 repo MCP servers + 2 user-scoped; 24 skills on disk; headless execution in Actions is **not yet demonstrated** (`UNKNOWN`) |
| Ruflo orchestration | **BLOCKED** · preserved | endpoint returns HTTP 410 Gone; MCP namespace absent; branch `chore/ruflo-endpoint-recovery` and its worktree preserved intact |
| Hermes | **NOT INSTALLED** | no executable, no runtime, no models |
| D1 | **NOT USED** | Cloudflare account has 0 databases |
| Slack / Notion / Google Drive / Dropbox | **NOT INTEGRALLED** | no MCP server, no credential, no declaration; `packages/notifications` mentions Slack only in passing |

## 7. Duplicate-capability register (source of the "one authority per responsibility" work)

| Capability | Competing implementations | Canonical choice for V2 |
|---|---|---|
| Agent registry | `.ai/agents/registry.yaml`, `registry/agents.json`, `platform/agents/`, `platform/ai-runtime/` | **one** registry file, generated from source of truth |
| Orchestration | `packages/kernel` orchestrator/coordinator/scheduler, `packages/mission-runtime`, `packages/runtime` | **kernel** for orchestration; mission-runtime for app-facing services |
| Audit trail | `mc_decisions` (append-only), `audit-repository.ts` | **`mc_decisions`** |
| Task/job state | `mc_jobs`, `packages/api` + `packages/tasks` | **`mc_jobs`** |
| Session identity | `packages/security` `Authenticator`, `packages/mission-runtime` `AuthService`, `apps/ai-institute/src/lib/auth.ts`, `src/lib/api-auth.ts` | **two**: app auth (api-auth) and kernel auth (security) — reconcile, do not merge |
| Deployment authority | Cloudflare/OpenNext (canonical), Vercel (optional), GitHub Pages (secondary) | **Cloudflare/OpenNext only** |

## 8. The single most load-bearing unknown

Whether Mission Control currently holds **any** job, approval, or decision record in the production
Turso database. That single answer determines whether V2 Phase 2 extends a working system or
activates a dormant one. It is answerable only with read-only access to the production database, which
this phase could not obtain (no local credential; production secrets are Worker-side).
