# BFAOS V2 — T-203 Checkpoint and Recovery Contract

**Status:** specification for founder review · **Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. Existing mechanisms (verified, reused)

| Mechanism | Location | What it gives |
|---|---|---|
| `Idempotency` | `packages/kernel/src/idempotency/index.ts` | `check()`, `register(key, executionId)`, `complete(key, result?)`, `fail(key, error?)`, `shouldExecute()`, `recordExecution()`, `updateExecution()`, `getExecution()` |
| `ReplayEngine` | `packages/kernel/src/replay/index.ts` | `ReplayConfig`, `ReplayResult`, deterministic replay of a recorded execution |
| `BackupRecovery` | `packages/kernel/src/backup/index.ts` | `BackupConfig`, `Backup`, `RecoveryResult` |
| Artefact lineage | `mc_artifact_versions(id, artifact_id, version, path, hash, producer, parent_version?, human_replacement, session_id)` | immutable version chain with a **content hash** and the producing session |
| Job ↔ session ↔ artefact | `mc_jobs.session_id`, `mc_sessions.job_id`, `mc_artifact_versions.session_id` | a job owns attempts; an attempt owns artefact versions |
| Idempotency key | contract `idempotency_key` (T-201), default `contract_id` | one key per logical command |
| Decision log | `mc_decisions` (append-only) | `pause`, `resume`, `retry`, `abort`, `takeover` actions already exist |

**No new ledger, no new table, no new checkpoint store.** A checkpoint is an **artefact version** whose
`path` points at the checkpoint payload and whose `hash` is the SHA-256 of that payload — both columns
already exist.

## 2. Checkpoint payload

Stored as a JSON document (the artefact payload), referenced by an `mc_artifact_versions` row:

```json
{
  "checkpoint_version": "1.0.0",
  "job_id": "job-…",
  "session_id": "mc_sessions…",
  "attempt": 2,
  "producer": "opencode:engineering-agent:attempt-2",
  "idempotency_key": "bfaos-task-…",
  "completed_steps": ["plan", "implement", "test-local"],
  "current_step": "verify-remote",
  "artifacts": [
    { "artifact_id": "…", "version": 3, "path": "b2://…/evidence.json", "hash": "<sha256>" }
  ],
  "branch": "chore/…",
  "commit_sha": "<40-hex>",
  "test_results": [
    { "suite": "pnpm platform:check", "result": "pass", "evidence_artifact_id": "…" }
  ],
  "pending_approvals": ["mc_approval_requests…"],
  "recovery": {
    "resume_at": "verify-remote",
    "instructions": "…",
    "do_not_replay": ["deploy", "publish", "merge"],
    "inspect_before_replay": ["vercel deploy", "wrangler deploy"]
  }
}
```

| Field | Maps to | Purpose |
|---|---|---|
| `job_id`, `session_id`, `attempt` | `mc_sessions` / job linkage | resume identity |
| `idempotency_key` | kernel `Idempotency` | prevents duplicate side effects |
| `completed_steps`, `current_step` | — | where the attempt stopped |
| `artifacts[]` | `mc_artifact_versions` | artefact lineage already carries `path` + `hash` |
| `branch`, `commit_sha` | — | exact code state of the attempt |
| `test_results[]` | `mc_artifacts` of kind evidence | what had already passed (so it is not re-run blindly) |
| `pending_approvals[]` | `mc_approval_requests` | approvals still outstanding |
| `recovery.do_not_replay` / `inspect_before_replay` | — | the safety classification (§3) |

## 3. Replay safety classification

**The invariant (non-negotiable):**

> A non-idempotent external action is never replayed merely because a previous execution did not
> record its result. Before any such action is repeated, the agent must **inspect the external
> system's actual state** and confirm the effect did not happen; if the state cannot be inspected, the
> action is not replayed — it is escalated.

| Class | Examples | Rule |
|---|---|---|
| **A — freely replayable** | read, search, lint, typecheck, test, build, formatting, dry-run | may be re-executed; must still be idempotent in effect |
| **B — replayable with verification** | write a branch, create a PR, upload an artefact | verify current state first; skip if already done |
| **C — never replayed automatically** | production deploy, preview promotion, merge, publish, data migration, credential change, notification to a person, payment | **inspect, then escalate.** The decision to act again is a human's (or a pre-authorised rule's) |
| **D — one-shot, non-repeatable** | an approval consumption, a quota-consuming retry, a destructive deletion | never replayed; recorded once in `mc_decisions` |

**How "inspect" works for class C:** each class-C action names the observable that proves whether it
already happened — e.g. "Cloudflare deployment list contains a deployment whose source commit equals
`commit_sha`" (deploy), "PR #n is merged" (merge), "`mc_approval_requests` row is `approved`"
(approval). If the check cannot be made, the action is not replayed.

**How this is enforced in practice (no new machinery):**
1. `Idempotency.register(key, executionId)` before the action; `complete(key)` after success;
   `fail(key, error)` after failure. On resume, `shouldExecute(key)` decides whether the action still
   needs to run *in this system*.
2. For class C, the idempotency record is **not** sufficient — the external state check is
   authoritative. This is why the payload carries `inspect_before_replay`.
3. `mc_decisions` records `retry` / `abort` / `takeover` so the history of what was attempted and why
   is append-only.

**Anti-pattern this replaces:** an agent that lost context re-issues the whole task and re-deploys
because the previous run never wrote a "done" marker. The checkpoint is not the authority on whether a
deploy happened — **the provider is**.

## 4. Scenarios

### 4.1 Safe resume
*Trigger:* the runner died after a local test passed, before pushing.
*Action:* checkpoint (attempt 1) holds `completed_steps: [plan, implement, test-local]`,
`current_step: verify-remote`, `commit_sha`. The new attempt (attempt 2) creates a **new**
`mc_sessions` row, reuses `idempotency_key`, calls `Idempotency.check()` → the earlier attempt failed
or is abandoned → `shouldExecute` true for the remaining step → execution continues from
`current_step`. Test results already recorded are not re-run unless the code changed.
*Class of actions:* A and B only.

### 4.2 Failed resume
*Trigger:* the attempt failed on a class-A step (a test), and the retry budget is not exhausted.
*Action:* `mc_sessions` row 1 → `failed`; `mc_decisions(action='retry', reason=…)`; new session row 2
with the same `idempotency_key`; `max_attempts` from the contract bounds the loop; on exhaustion the
job is marked failed/paused and **no further automatic attempt occurs**.
*Rule:* a failed task must never create an endless retry loop; the contract's `max_attempts` (≤ 5) and
`on_quota_exhausted: pause_and_report` are the limits.

### 4.3 Class-C resume (the dangerous one)
*Trigger:* the runner died immediately after a production deploy started, so no result was recorded.
*Action:* **the agent must not re-deploy.** It inspects the provider (Cloudflare deployment list for
the exact commit), determines whether the deploy happened, records the finding in `mc_decisions`, and
either continues (deploy happened) or **escalates** to the founder (state unknown). Re-running the
deploy without that check is the exact failure this section exists to prevent.

### 4.4 Manual takeover
*Trigger:* the founder or an operator decides to complete a job by hand.
*Action:* `mc_decisions(action='takeover', actor=…, instruction=…)`; the job is marked
`stopped` (per D-08 vocabulary) with a decision explaining why; no further automatic attempt is made
for that job.

### 4.5 Quota exhaustion mid-task
*Trigger:* a provider quota is exhausted (model provider, CI minutes, Turso rows, B2 storage).
*Action:* the attempt ends with a recorded failure, `mc_decisions(action='pause', reason='quota')`, the
checkpoint preserves the artefact references, and the job waits. **No paid fallback, no automatic
plan change, no silent degradation.** Recovery resumes when a permitted window opens.

## 5. Dry-run tests prepared (mocked repository / local fixtures only)

| Test | Assertion |
|---|---|
| T-203-A | a checkpoint payload validates against its shape and its `artifacts[]` hashes match the referenced artefact versions |
| T-203-B | `Idempotency` sequence `check → register → complete` prevents a second execution of the same key |
| T-203-C | `fail()` then `check()` allows exactly one further attempt, up to `max_attempts` |
| T-203-D | safe resume continues at `current_step` and does **not** re-run completed class-A steps |
| T-203-E | a class-C action with an unknown external state is **not** replayed and produces an escalation record |
| T-203-F | a class-C action whose external state proves it already happened is **not** replayed |
| T-203-G | manual takeover records `takeover` and stops automatic attempts |
| T-203-H | quota exhaustion records `pause` and preserves artefact references |

**Status: specification and fixture design only.** The mocked tests are described here; they are not
added to the application in this phase, because Phase 1/2 is documentation-and-isolated-verification
work and the directive forbids behaviour changes. The natural future home is a new test file beside
`apps/ai-institute/src/lib/__tests__/mission-control.test.ts`, and the kernel unit tests under
`packages/kernel/src/__tests__/`.

## 6. Gaps

1. **No checkpoint artefact kind exists** in the enumerated kinds (`job`, `task_contract`, `artifact`,
   `version`, `approval`, `decision`, `session`). `mc_artifacts.kind` is free text (default
   `document`), so a checkpoint can use `kind='checkpoint'` **without a schema change**; the enumerated
   union in the TypeScript interface is a typing choice, not a database constraint. **Confirm before
   implementation** (adds a member to the union — a small, reversible code change).
2. **The kernel `Idempotency` store is not yet the same store as Mission Control.** Until they are
   connected, the two idempotency mechanisms coexist. The V2 decision is to make the contract's
   `idempotency_key` the join point, not to merge the stores.
3. **`mc_sessions` has no attempt column** (T-202) — attempt identity is ordinal.
4. **Checkpoint payload size** is unbounded in principle; the artefact `hash` and a size ceiling in the
   contract budget are the controls.
5. **No automatic watchdog** exists to notice a `running` session that never ends — the recovery
   procedure is currently operator-driven.

## 7. Founder decisions referenced

- **D-08** — pause/stopped vocabulary interacts with this contract.
- **D-09** — where checkpoint artefacts physically live (B2 vs GitHub Actions artefacts) determines
  the `path` values written into `mc_artifact_versions`.
