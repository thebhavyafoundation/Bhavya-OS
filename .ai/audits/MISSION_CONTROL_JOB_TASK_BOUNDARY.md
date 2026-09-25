# Mission Control — Job/Task Boundary + Persistence Decision (2026-09-18)

Verified against code (not docs alone).

## Job vs Task DAG vs Agent vs Session

- **`.ai/tasks` DAG + `packages/runtime/cli/planner.mjs`** = planning structure (static contracts, topo-sort, validation). No runtime, no persistence. KEPT AS-IS as the planning input.
- **`packages/workflows` JobQueue** = execution engine (in-memory, retries, concurrency). KEPT AS-IS; not forked, not persisted here.
- **Mission Control Job (`mc_jobs`)** = persisted auditable envelope: references optional task-contract ids, owns status/approvals/artifacts/decisions. Relationship: Job 1:N task-contract refs; Job never re-implements orchestration. Future binding to JobQueue handlers is deferred, not blocked.
- **Agent** = existing engine record (extended separately to bind registry.yaml). **Session** = minimal MC record (agent+job+status+event cursor); auth sessions untouched.
- **ToolExecution** = event-sourced only in v1 (no table).

## Persistence (canonical, no second database)

- Store: ai-institute SQLite (`getAdaptedDatabase("ai-institute")`, async adapter for new code), new migration `003_mission_control.ts` (tracked `_migrations`, checksum-verified).
- Tables: `mc_jobs`, `mc_artifacts`, `mc_artifact_versions`, `mc_approval_requests`, `mc_decisions`.
- Categories: DURABLE = jobs, transitions, artifact metadata/versions, decisions, revision instructions, provenance, integrations. DERIVED = graphs/summaries/projections. EPHEMERAL = UI-local state only.
- Lifecycle events ALSO appended to existing `evidence_records` (`activity_type LIKE 'mission-control.%'`) — reuses the audit substrate and existing timeline readers.
- Migrations are additive (`CREATE TABLE IF NOT EXISTS`); `down` drops MC tables only.

## RBAC

`/os/mission` + `/os/mission/approvals` → `["admin", "staff"]` in route-policy (exact-match map); dynamic job route enforces `requireRoles(["admin","staff"])` inline + API routes enforce `roleIsAllowed` (401/403 JSON, os/admin convention). Nav registry gains one Operations entry (UX only).

## Phase 4 addendum (real operational flow)

- **Adapter:** `createJobFromEvaluation` (repository) + `POST /os/mission/api/evaluations` — GitHub OS row → job (started) + session (bound) + evaluation artifact v1 with `github-os:repository:{id}` path reference. Idempotent via `evidence_records.idempotency_key = ghos-eval:{repoId}` (stale-record rebuild if rows vanished). No GitHub OS data copied beyond reference facts.
- **Integration gate:** approved → verified → integrating → integrated, each guarded; `completeIntegration` records `approve_integration` with actor. Approved ≠ integrated, enforced in code.
- **Graph UI:** `@xyflow/react@12.11.6` (MIT verified, React 19 peers) installed via filtered add; `MissionGraph` consumes `getMissionGraph()` only, node click navigates to job records, accessible node list fallback. No graph database.
- **Fact panel:** evaluation artifacts resolve the live github-os row by path reference; FACT vs RECOMMENDATION labeled; unavailable states when the row is gone.
