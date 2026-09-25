# Mission Control — Domain Model (2026-09-18)

Reuse-first verdicts. Canonical locations per bhavya-architecture/bhavya-data-model (all shared types → `packages/shared/src/types.ts`).

## Reuse (extend, don't duplicate)

- **Event** — EXISTS (`BhavyaEvent` + bus + JSONL + IOC table). EXTEND: fix README-vs-envelope drift; add `mission-control` event namespace (job/agent/artifact/approval/human/integration types from §16 list, only as emitted). Source of truth: emitted envelope; JSONL/SQLite are append-only sinks; UI reads projections.
- **Agent** — EXISTS as doc profiles + thin engine record. EXTEND agent-engine: read `registry.yaml`, fill capabilities/permissions, bind `status`. No new agent system.
- **Artifact** — EXISTS as type. EXTEND with store + versions (below).
- **Approval** — EXISTS narrowly (bee engine, in-memory). EXTEND into persisted global gate (below).
- **Source/Evidence** — EXISTS (`Source`, `Evidence`, `Citation`, `ExternalResourceRef`, impact evidence). Reuse shapes; evidence inspector is a projection joining them.
- **Repository/Commit/PullRequest/CIRun/Deployment** — EXISTS as read shapes (github-os DB, os-data, git). Projections only — never new stores, never fabricated state.
- **Capability** — EXISTS (`capability-registry` scoring, KP schemas). Reuse for ADOPT..REJECT records.

## Build native (minimal, justified)

- **Job** — extend `workflows` Job/JobQueue with persistence (SQLite via `@bhavya/database`), link to `.ai/tasks` contracts, retries, worker assignment. Lifecycle: queued→running→(paused)→(completed|failed|cancelled)+attempts. Audit: every transition is an event.
- **JobStep** — new child rows (planner topo nodes persisted). Lifecycle mirrors Job.
- **Department** — NO new system: enum/label (`intelligence,research,knowledge,content,design,engineering,distribution,governance`) attached to jobs/agents/routes. Grouping is a projection.
- **Session** — new minimal agent-session record (id, agent, job, status, started/ended, event cursor). Auth sessions untouched and separate.
- **ToolExecution** — event-sourced only (`agent.tool_used` with arg-shapes, never secret values). No table v1.
- **ArtifactVersion + lineage** — new registry: artifact (id, kind, title, source, owner) + versions (n, path/hash, producer, parent, human_replacement bool, status). Minimal lifecycle: DRAFT→REVIEW→APPROVED|REJECTED→REVISION_REQUESTED→REVISING→VERIFIED→INTEGRATING→INTEGRATED; terminal SUPERSEDED/ARCHIVED.
- **Decision/HumanAction** — new audit log (who, action, target, reason, instruction, timestamp). Every approve/reject/revise/regenerate/upload/pause/resume/retry/abort/takeover lands here. This log IS the institutional learning substrate (§22: observations never rewrite the Constitution).
- **Integration** — new record (kind: pr|content|route|publish, target, status, verifier, decision ref). Small table, created only by approved flows.

## Persist vs project

Persist: jobs, steps, sessions, artifact registry, decisions, integrations, approvals. Project (derive): departments, tool executions, evidence views, repo/CI state, timelines, graphs. Rule: persist only what humans must audit or resume; everything else is an event-sourced projection.

## Approval gates (fatigue-aware)

Require approval: public publishing, production deploy, destructive ops, external comms, constitutional changes, curriculum changes, new risky deps, security-sensitive ops. Auto-allowed: internal drafts, reads, local validation, retries of approved work.Interrupt/resume vocabulary borrowed (DISTILL) from AG-UI/Inngest patterns; execution permissions stay with OpenCode's model, Mission Control adds the product-decision layer (§6).
