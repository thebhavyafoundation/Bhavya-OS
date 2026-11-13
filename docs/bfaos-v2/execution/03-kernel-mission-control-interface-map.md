# BFAOS V2 — Kernel ↔ Mission Control Interface Map (Priority C)

**Date:** 2026-11-13 · **Base:** `feat/bfaos-kernel-safety` @ `0a9183ac` · **Method:** source inspection only.
Every claim below cites a file and line. No adapter is claimed to exist unless the source proves it.

---

## 1. Kernel modules and exported interfaces

`packages/kernel` v3.1.0 — 30 module directories under `src/` (excluding `__tests__/`). 28 of them
have an `index.ts`; `execution/` and `scenarios/` are plain module directories. Everything the barrel
`src/index.ts` re-exports is public; the two `execution/` modules are **not** re-exported by it, so
`mission-control-mapping.ts` is reachable only by a direct path import.

| Module | Key exported interface | Runtime dependencies | Edge-safe? |
|---|---|---|---|
| `idempotency/` | `Idempotency` (`check`, `register`, `complete`, `fail`, `shouldExecute`, `recordExecution`, `updateExecution`, `getExecution`, `cleanup`) | `node:fs` | **No** |
| `replay/` | `ReplayEngine` (`replay`), `ReplayConfig`, `ReplayResult` | none | Yes |
| `replay/safety.ts` | `classifyAction`, `assertReplaySafe`, `assertReplayAllowed`, `UnsafeReplayError` | none — the file has no imports at all | Yes |
| `checkpoint/` | `createCheckpoint`, `serializeCheckpoint`, `verifyCheckpoint`, `isResumable`, `canonicalize`, `sha256` | `node:crypto` | **No** |
| `contracts/task-contract.ts` | `validateTaskContract`, `classifyContractFields` | `replay/safety` | Yes |
| `execution/result.ts` | `createExecutionResult`, `classifyExecutionOutcome`, `validateExecutionResult`, `EXECUTION_RESULT_POLICY` | `types/` only | Yes |
| `execution/mission-control-mapping.ts` | `jobStatusForResultCode`, `planJobStatusUpdate` | `execution/result` | Yes |
| `permissions/` | `Permissions` (`grant`, `revoke`, `check`) | in-memory, per process | Yes |
| `backup/` | `BackupRecovery` | `node:fs` | **No** |
| `scheduler/`, `coordinator/`, `orchestrator/` | `Scheduler`, `Coordinator`, `EventDrivenOrchestrator` | in-memory | Yes |
| `auth/`, `contracts/`, `events/`, `memory/`, `observability/`, `health/`, `registry/`, `rate-limit/`, `replay/`, `planner/`, `capability-matcher/`, `consensus/`, `api/`, `services/`, `scenarios/`, `runtime/`, `types/`, `logging/`, `monitoring/`, `configuration/`, `boot/`, `self-organizing/` | various | mixed | mixed |

## 2. Mission Control runtime (the application side)

**Routes** — `apps/ai-institute/src/app/os/mission/`:

| Route | Purpose |
|---|---|
| `api/jobs/route.ts`, `api/jobs/[id]/route.ts` | job listing and detail |
| `api/approvals/route.ts` | approval requests |
| `api/artifacts/route.ts` | artefact registry |
| `api/evaluations/route.ts` | evaluation records |
| `api/tasks/route.ts` | task intake |
| `api/_auth.ts` | `requireMissionOperator` — session required, role must be `admin`/`staff` |

**UI** — `os/mission/{page,jobs/[id],approvals,approvals/[id],decisions,evidence,integrations}/page.tsx` plus `components/{evaluation,forms,graph,intake}.tsx`.

**Repositories** (`apps/ai-institute/src/lib/repositories/`, barrel `index.ts`): `UserRepository`, `StudentRepository`, `ProgressRepository`, `SessionRepository`, `KnowledgeRepository`, `EvidenceRepository`, `MissionControlRepository` (+ `evidence-repository.ts` with `eventKey`).

**Persistence boundary** — `apps/ai-institute/src/lib/db.ts`: `getAsyncDb()` dynamically imports the Turso/libSQL client in production and better-sqlite3 locally; the local branch also runs the migration runner, the production branch applies `BASELINE_SCHEMA` only. **The `mc_*` tables are therefore not guaranteed to exist in production** (Phase 1-B/1-C finding S24).

**Job state machine** — `sqlite-mission-control-repository.ts:33-42`:

```
queued            → running | cancelled
running           → awaiting_approval | stopped | failed | cancelled
awaiting_approval → revising | completed | stopped
revising          → awaiting_approval | stopped
completed | stopped | failed | cancelled → (terminal)
```

`transitionJob` throws `Invalid job transition` for anything else (`:257-259`).

**Decision writer** — three fixed-action writers only (`:291` `abort`/job, `:756` approve/reject/request_revision, `:953` `approve_integration`). `endSession` writes no decision. There is **no writer for `pause`, `resume`, `retry` or `takeover`** although the schema permits them (`003_mission_control.ts:80`).

## 3. Module-to-consumer matrix

The columns below state who **actually imports** each module today, not who could.

| Kernel module | Runtime consumers (source-proven) | Type-only consumers | Application consumers | Mission Control counterpart |
|---|---|---|---|---|
| `idempotency/` | **none** | none | **none** | `evidence_records.idempotency_key` (DB-backed, already wired — a *different* mechanism, see C6) |
| `replay/`, `replay/safety` | **none** | none | **none** | — |
| `checkpoint/`, `contracts/`, `execution/` | **none** | none | **none** | `mc_artifacts` / `mc_artifact_versions` (pointers only) |
| `permissions/` | **none** | none | **none** | `requireMissionOperator` role gate |
| `types/` (ExecutionState, ExecutionRecord, ExecutionContext) | none | `memory-engine`, `planner-engine`, `scheduler-engine`, `workflow-engine` | **none** | `McJobStatus` / `McJob` / `McSession` |
| `scheduler/`, `coordinator/`, `orchestrator/` | **none** | none | **none** | `mc_jobs` / `mc_sessions` |

**How this was checked (`VERIFIED`).** `git grep -ln 'Idempotency\|createCheckpoint\|validateTaskContract\|createExecutionResult\|ExecutionResult\|ReplayEngine\|classifyAction\|verifyCheckpoint' -- 'packages/*' 'apps/*' ':!packages/kernel'` returns
**kernel files only**. The hits for `Idempotency` and `Permissions` under `apps/` are unrelated
symbols of the same name — an application-local evidence store and a user-roles component — and
neither application depends on the kernel.

**Package-level dependency ≠ import (`VERIFIED`).** Six sibling packages list `@bhavya/kernel` in
their `package.json`, but:

- `packages/cli` — depends on the kernel, **zero imports** of it.
- `packages/knowledge-engine` — depends on the kernel, **zero imports** of it.
- `packages/search-engine` — depends on the kernel, **zero imports** of it.
- `packages/memory-engine`, `planner-engine`, `scheduler-engine`, `workflow-engine` — import **types
  only** (`import type { MemoryEntry, MemoryType }`, `{ Goal, Plan, Task, AgentId }`,
  `{ Task, TaskId }`, `{ Workflow, WorkflowId, WorkflowStep }`).
- `packages/shared` — **does not depend on `@bhavya/kernel` at all**; the only mention is a comment at
  `packages/shared/src/types.ts:7`.

**Structural fact (`VERIFIED`):** `git grep '"@bhavya/kernel"' -- 'apps/*/package.json'` returns
**nothing** — no application depends on the kernel. The kernel is currently a library layer with no
runtime consumer at all; every one of the modules above is exercised only by its own specifications.
That is why the wiring proposals in §7 are proposals and not connections.

| # | Mismatch | Evidence | Consequence |
|---|---|---|---|
| C1 | **Runtime incompatibility**: the kernel's `idempotency/`, `backup/` and `checkpoint/` import `node:fs` / `node:crypto`; the canonical application runs on Cloudflare Workers (workerd), where those are unavailable | `idempotency/index.ts:14`, `backup/index.ts:4` and `:12`, `checkpoint/index.ts:22` | Any kernel wiring must live in a **Node** context (CI runner or a Node service), **never inside the edge application** |
| C2 | **Vocabulary gap**: the kernel can express `interrupted`, `quota_paused`, `approval_required`; Mission Control's job statuses have no equivalent | `EXECUTION_RESULT_POLICY` vs `McJobStatus` | The kernel's resumability has no counterpart in the job status; the mapping reports it rather than hiding it (`mission-control-mapping.spec.ts`) |
| C3 | **Terminal-state gap**: `stopped` and `failed` are terminal in Mission Control, but the kernel treats both as resumable/retryable | `sqlite-mission-control-repository.ts:39-41` vs `EXECUTION_RESULT_POLICY` | A paused or interrupted job cannot be resumed through the job status alone; a resume path needs D-08 |
| C4 | **Invalid transition**: a job blocked before dispatch is `queued`, and `queued → failed` is not permitted | `sqlite-mission-control-repository.ts:34` | Blocked-before-dispatch work has no valid terminal target; the mapping reports the mismatch |
| C5 | **Persistence gap**: the `mc_*` tables may not exist in the production database; production applies `BASELINE_SCHEMA` only | `db.ts:120-127` (local migrations at `:135`) | Mission Control behaviour in production is unverified (Phase 1-C finding S24) |
| C6 | **Two idempotency mechanisms**: the kernel's filesystem store and the DB-backed `evidence_records.idempotency_key` | `idempotency/index.ts:104` (`.kernel/idempotency` store directory) vs `evidence-repository.ts` | The durable one is the DB-backed one; the kernel store does not survive a fresh runner |
| C7 | **Two audit stores**: `mc_decisions` (append-only) and `audit-repository.ts` | `sqlite-mission-control-repository.ts:291,756,953` vs `apps/ai-institute/src/lib/audit-repository.ts:61` | Audit history can disagree with itself |
| C8 | **Decision actions unwritable**: the schema permits `pause`/`resume`/`retry`/`takeover`; no writer exists | `003_mission_control.ts:80` vs the three writers | The BFAOS lifecycle cannot be recorded today (D-08) |

## 5. Error propagation, retry and idempotency enforcement

- **Kernel**: `Idempotency.shouldExecute` is the only duplicate guard; it refuses a `pending` or
  `completed` key and allows a `failed` one, **without an attempt cap**. A persisted entry that cannot
  be interpreted blocks its key rather than permitting a duplicate execution.
- **Replay engine**: `ReplayEngine.replay` **does consult the idempotency store** — it reads the
  original execution record (`replay/index.ts:59`) and writes the state back (`:98`; `resume` at
  `:127` and `:141`). What it does **not** consult is the *duplicate guard* — neither `shouldExecute`
  nor `check` — so a replay is not itself prevented from repeating work. It also swallows handler
  failures (`replay/index.ts:92-94`, `catch { // Skip failed events }`), so a failed handler is
  invisible in the result.
- **Mission Control**: `transitionJob` throws on an invalid transition; the API routes convert repository errors into JSON responses. There is no retry envelope and no error classification.
- **Enforcement opportunities (proposals, not implemented):**
  1. `assertReplayAllowed(actions, externalState)` before any replay, and before any class-C tool call (the guard exists; no caller uses it).
  2. `validateTaskContract` as an intake gate for `api/tasks/route.ts` (the validator exists; it is not wired).
  3. `createExecutionResult` + `validateExecutionResult` as the standard envelope between an executor and Mission Control.
  4. `planJobStatusUpdate` as the single place that decides whether a status change is legal.

## 6. Authentication and authorization boundaries

| Boundary | Mechanism | Evidence |
|---|---|---|
| Route access | session cookie required, role must be `admin`/`staff` | `os/mission/api/_auth.ts` |
| Other API routes | `requireAuth` from `lib/api-auth` (Turso sessions) | `lib/api-auth.ts:128` |
| Role vocabulary | `roleIsAllowed(user.role, [...])` | `lib/roles.ts` |
| Data protection | `src/lib/db.ts` binds to Turso in production, better-sqlite3 locally | `db.ts:120-135` |
| Kernel authorisation | `Permissions` is in-memory, per-process, grant-only, with no deny semantics | `permissions/index.ts` |
| OpenCode agent permissions | one global deny-list plus a read-only `plan` agent; `bhavya` and `build` have **no** permission block | user \`opencode.jsonc\`, repo \`opencode.json\` |

## 7. Interface contract proposal

**Proposal only — nothing is wired into a production caller.**

1. **Execution → Mission Control**: an executor produces an `ExecutionResult`; the caller converts it with `jobStatusForResultCode` and asks `planJobStatusUpdate` whether the move is legal. The Mission Control transition table is supplied by the caller, so there is never a second copy of it in the kernel.
2. **Intake**: `api/tasks/route.ts` validates an incoming task contract with `validateTaskContract` after schema validation, and rejects it on any policy error. Unclassified tools require founder review.
3. **Idempotency**: the contract's `idempotencyKey` is presented to the **DB-backed** `evidence_records.idempotency_key` mechanism; the kernel filesystem store remains a local-runner convenience.
4. **Replay**: a checkpoint's `doNotReplay` and `inspectBeforeReplay` lists are cross-validated by `verifyCheckpoint`; before any replay, `assertReplayAllowed` must be called with the caller's knowledge of external state.
5. **Audit**: one authority — `mc_decisions` — with the missing writer added as a small repository method (D-08).
6. **Placement**: because of C1, all of the above must execute in a Node context (CI runner or Node service). The Cloudflare application must not import the kernel barrel.

## 8. Compatibility and migration risk register

| ID | Risk | Severity | Trigger | Mitigation | Status |
|---|---|---|---|---|---|
| MR1 | Wiring the kernel into the edge application breaks the build or the runtime | **High** | C1 | Keep kernel usage Node-side; never import the kernel barrel from `apps/*` | Open |
| MR2 | A job status update throws `Invalid job transition` and breaks the executor | **High** | C2/C3/C4 | `planJobStatusUpdate` before every write; decide the vocabulary (D-08) | Open |
| MR3 | Mission Control tables do not exist in production, so a wired executor writes to a missing table | **High** | C5 | Verify production schema before any wiring (T-102) | Open |
| MR4 | Two idempotency mechanisms produce divergent duplicate decisions | Medium (prospective — no runtime consumer of the kernel store exists today) | C6 | Choose the DB-backed one as authoritative | Open |
| MR5 | Two audit stores produce contradictory history | Medium | C7 | One authority (D-08 scope) | Open |
| MR6 | The replay guard is never called, so replay still repeats side effects | Medium | C8 | Call `assertReplayAllowed` at the replay site; until then, treat replay as observation-only | Open |
| MR7 | The kernel's public API grows with generic names (`sha256`, `canonicalize`) and collides with a consumer's own | Low | Phase 3 | Converge on `@bhavya/shared` (Phase 4 follow-up) | Open |
| MR8 | The legacy kernel harnesses stay unexecuted and someone reads them as coverage | Low | Phase 3 | `README` in `src/__tests__`; migration task | Partly resolved — four harnesses migrated, three documented as not coverage |
| MR9 | A duplicated type drifts from its original | Low | The Mission Control job-status union is re-declared in `execution/mission-control-mapping.ts` because the kernel cannot import the application | Keep the two in step; the mapping's transition table is caller-supplied precisely so it is not duplicated | Open |

## 9. What is defined versus actually enforced

| Element | Defined | Enforced |
|---|---|---|
| Execution result codes and policy | yes | by constructors only — no executor uses them yet; the policy table is frozen so it cannot be edited at runtime |
| Task contract policy | yes | by the validator only — `api/tasks/route.ts` does not call it |
| Checkpoint integrity and resume gate | yes | by `verifyCheckpoint` only — nothing writes checkpoints |
| Replay safety classification | yes | by the guard only — `ReplayEngine.replay` does not call it, and it consults the idempotency *store* but not the duplicate *guard* |
| Kernel ↔ Mission Control mapping | yes (pure, table injected) | by nothing — no caller |
| Idempotency duplicate guard | yes | by `Idempotency.shouldExecute` (real, with correct expiry, and fail-closed on an unreadable entry) |
