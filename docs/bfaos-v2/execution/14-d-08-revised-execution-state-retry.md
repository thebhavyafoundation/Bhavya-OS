# BFAOS V2 — D-08 Decision Brief: Execution State and Retry Policy (REVISED)

**Date:** 2026-11-18 · **Branch:** `feat/phase45-preview-concurrency` · **Owner:** Founder · **Status:** REVISED — not approved for implementation

**Important:** The earlier six-state vocabulary proposal is NOT founder-approved and is superseded by this brief. Nothing in this brief is implemented.

---

## 1. The decision

Kernel integration with Mission Control requires a job-status vocabulary and transition table (D-08) plus an artefact store / checkpoint persistence (D-09). Neither is approved for implementation. This brief revises the execution-state and retry-policy proposal based on the **actual code present in the repository**, not on the earlier six-state proposal.

## 2. Existing verified state vocabulary (from source inspection)

The repository does NOT have a single job-status vocabulary. It has **four distinct, layer-specific vocabularies** that must not be collapsed:

| Layer | Type | States | Source |
|---|---|---|---|
| Execution (runtime) | `ExecutionState` | `initializing`, `running`, `paused`, `completed`, `failed`, `cancelled`, `retrying` | `packages/shared/src/types.ts:60`, `packages/kernel/src/types/index.ts` |
| Workflow (job) | `WorkflowStatus` | `draft`, `active`, `paused`, `completed`, `failed`, `cancelled` | `packages/shared/src/types.ts:250` |
| Step / attempt | `StepStatus` | `pending`, `running`, `completed`, `failed`, `skipped`, `cancelled` | `packages/shared/src/types.ts:263` |
| Task / attempt | `TaskStatus` | `pending`, `queued`, `running`, `completed`, `failed`, `cancelled` | `packages/shared/src/types.ts:515` |
| Event / attempt | `EventStatus` | `pending`, `processing`, `completed`, `failed`, `retrying` | `packages/shared/src/types.ts:97` |
| Artifact | `ArtifactStatus` | `draft`, `review`, `approved`, `rejected`, `revision_requested`, `revising`, `verified`, `integrating`, `integrated`, `superseded`, `archived` | `packages/shared/src/types.ts:1228` |

**Distinction required (§1.7):** execution state (runtime lifecycle), job state (workflow level), attempt state (individual step/task/event), and operational pause/recovery reason (human control) are four different concepts. The earlier six-state proposal collapsed them; this brief does not.

### Mission Control domain (ADR pending)

`@bhavya/shared` Mission Control section (types.ts:1211+) defines:
- `MissionArtifact` with `ArtifactStatus` (12 states)
- `HumanDecision` with `DecisionAction`: `approve`, `reject`, `approve_with_modification`, `request_revision`, `regenerate`, `upload_replacement`, `pause`, `resume`, `retry`, `abort`, `takeover`, `approve_integration`
- `IntegrationRecord` with status: `pending`, `integrating`, `integrated`, `failed`

There is **no `Job` type and no job-status transition table** in the codebase. The Mission Control domain model is marked "ADR pending".

## 3. Current retry and idempotency semantics (code references)

### Idempotency (`packages/kernel/src/idempotency/index.ts`)

- Key statuses: `pending`, `completed`, `failed` (3 states — separate from ExecutionState)
- TTL default: 1 hour (`ttlMs ?? 3600000`)
- File-based storage: `.kernel/idempotency/{keys.json, records.json}`
- `shouldExecute(key)`:
  - `key_not_found` → proceed
  - `completed` → do NOT proceed (`already_completed`)
  - `failed` → proceed (`retry_after_failure`)
  - `pending` → do NOT proceed (`already_in_progress`)
- `register()` sets `status: "pending"`; `complete()` / `fail()` mark terminal
- **No retry counting, no max-attempt enforcement, no exponential backoff** in the idempotency layer

### Retry (`packages/shared/src/types.ts`)

- `RetryPolicy`: `maxAttempts`, `maxRetries`, `backoffMs`, `backoffMultiplier`, `initialDelay` — defined as a type but no visible enforcement logic in the kernel
- `ExecutionContext`: `retryCount: number`, `maxRetries: number`, `state: ExecutionState`
- `WorkflowStep.retryPolicy: RetryPolicy`, `onError: "fail" | "skip" | "retry" | "continue"`

### Replay / resume (`packages/kernel/src/replay/index.ts`)

- `replay(executionId)`: restores context, **increments `retryCount + 1`**, replays events, sets state to `"running"`
- `resume(executionId)`: sets state to `"running"` **without** incrementing `retryCount`
- Neither checks whether the execution is in a terminal state before resuming
- Replay skips failed events (try/catch, no error propagation)

## 4. Failure scenarios and expected handling

| Scenario | Current behaviour | Gap |
|---|---|---|
| Transient failure (network) | Event retried per `RetryPolicy`; idempotency key stays `pending` (`already_in_progress` blocks re-execution) | No backoff enforcement visible; `already_in_progress` can permanently block if the runner dies mid-execution |
| Permanent failure | Idempotency key marked `failed`; `shouldExecute` allows `retry_after_failure` | No max-attempt enforcement; infinite retry loop possible if caller keeps calling `shouldExecute` |
| Process interruption mid-execution | Key left `pending`; no recovery path | `already_in_progress` blocks forever; no TTL-based forced recovery on the key (TTL only expires, doesn't auto-resume) |
| Replay after failure | `replay()` increments `retryCount`, sets `running`, replays events | No terminal-state guard; can replay a `completed` execution |
| Resume after pause | `resume()` sets `running` without incrementing `retryCount` | `pause`/`resume` are human `DecisionAction`s; no explicit link to execution state transitions |
| Cancellation | `cancelled` is a valid ExecutionState/WorkflowStatus/TaskStatus | No cancellation propagation logic traced |

## 5. Transition ownership

| Transition | Owning layer |
|---|---|
| `queued → running` | Scheduler / runtime adapter (not traced in kernel) |
| `running → completed` | Runtime adapter / orchestrator |
| `running → failed` | Runtime adapter / orchestrator |
| `failed → retrying` | Retry policy + caller (not enforced) |
| `retrying → running` | ReplayEngine.replay() (increments retryCount) |
| `paused → running` | ReplayEngine.resume() / human `resume` decision |
| `running → cancelled` | Human `abort`/`takeover` decision (not traced) |
| Quota/policy pause | Human `pause` decision (not tied to execution state) |

The kernel's `ReplayEngine` and `Idempotency` are **infrastructure primitives**; the actual transition decisions live in the scheduler/orchestrator/runtime adapter, which were not fully traced in this investigation.

## 6. Alternatives

### Option A: Minimum-change (recommended if evidence supports)

**Do not introduce a new job-status vocabulary.** Use the existing `ExecutionState` (7 states) for execution lifecycle and `DecisionAction` (pause/resume/retry/abort/takeover) for human control, both already in `@bhavya/shared`. Add only:
1. A **retry-attempt guard** in the idempotency layer: max-attempt enforcement using `ExecutionContext.maxRetries`, so a failed key stops being retried after N attempts.
2. A **TTL-based recovery**: when an idempotency key is `pending` beyond its TTL, treat it as recoverable (not permanently blocked).

**Compatibility:** No existing state values change. No new tables. Callers using `shouldExecute()` get the same behavior plus max-attempt cutoff.

### Option B: Unified job-status vocabulary

Introduce a single `JobStatus` (e.g. `queued`, `running`, `succeeded`, `failed`, `retrying`, `cancelled`, `paused`) with an explicit transition table owned by Mission Control. Map each layer's existing status to `JobStatus` at the integration boundary.

**Compatibility:** Requires every caller (scheduler, orchestrator, runtime adapter, Mission Control) to adopt `JobStatus`. Higher risk, larger blast radius. The Mission Control domain model is ADR-pending, so this table has no home yet.

## 7. Recommendation

**Option A (minimum-change).** Evidence supports it because:
- The kernel already has `ExecutionState` (7 states) and `RetryPolicy` — the vocabulary exists, it's just not enforced.
- The gap is **enforcement** (max-attempt, TTL recovery), not vocabulary.
- Introducing a new `JobStatus` (Option B) while Mission Control is ADR-pending would create a second vocabulary with no owner.

**Retry limits:** Use `ExecutionContext.maxRetries` as the attempt cap. When `retryCount >= maxRetries`, a failed key transitions to a terminal "no-more-retries" state (rejected by `shouldExecute`).

**Attempt identity:** The idempotency key + `executionId` + `retryCount` uniquely identifies an attempt.

**Idempotency retention:** Keys expire after TTL (default 1h). Expired `pending` keys are recoverable; expired `completed`/`failed` keys are terminal records.

**Recovery semantics:** `pending` + TTL-exceeded → recoverable (re-register). `failed` + attempt cap reached → terminal. `completed` → always terminal.

## 8. Compatibility implications

- Existing records using `pending`/`completed`/`failed` idempotency statuses: unchanged.
- Existing `ExecutionState` values: unchanged.
- Callers of `shouldExecute()`: gain max-attempt cutoff; callers that previously relied on infinite retry of `failed` keys will see retries stop at `maxRetries`.
- No schema, database, or persisted-state changes required for Option A.

## 9. Required tests and rollout/rollback

**Tests (exploratory, no runtime contract change):**
- `shouldExecute()` returns `proceed: false` when `retryCount >= maxRetries` on a `failed` key
- TTL-exceeded `pending` key is treated as recoverable
- `replay()` does not replay a `completed` execution (terminal-state guard)
- `resume()` does not increment `retryCount`

**Rollout:** Add enforcement in the idempotency layer only; no caller changes required for Option A.

**Rollback:** Remove the max-attempt/TTL checks; revert to current behavior.

## 10. Unresolved questions and trade-offs

- The scheduler/orchestrator/runtime adapter were not fully traced; transition ownership for `queued → running` is unconfirmed.
- Whether `maxRetries` is populated by callers is unverified.
- No persisted job/attempt store exists (D-09 is the separate decision for persistence).
- Trade-off: Option A defers a unified `JobStatus` until Mission Control is ADR-approved; Option B addresses it now but has no owner and higher risk.

## 11. Boundary reminder

**Not implemented.** No production logic, database schema, persisted state values, or runtime behaviour is modified by this brief. Implementation awaits founder approval of D-08 (and D-09 for persistence).
