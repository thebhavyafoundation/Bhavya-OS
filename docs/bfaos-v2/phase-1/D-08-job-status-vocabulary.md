# BFAOS V2 — D-08 Job Status Vocabulary (proposal awaiting founder acceptance)

**Status:** **PROPOSAL — awaiting founder acceptance (D-08).** No production CHECK constraint was
extended, no status was invented in code, and no migration was written.

## 1. The constraint

`mc_jobs.status` has a fixed CHECK constraint (`003_mission_control.ts`):

```
CHECK (status IN ('queued','running','awaiting_approval','revising','completed','stopped','failed','cancelled'))
```

The BFAOS blueprint's lifecycle names two states this vocabulary does not contain: **`BLOCKED`** and
**`QUOTA_PAUSED`**. Extending a CHECK constraint on a production table is a migration with real
downtime and rollback risk, so the recommendation is **not** to extend it.

## 2. Proposed mapping (no schema change)

| Blueprint concept | `mc_jobs.status` | Supporting record | Notes |
|---|---|---|---|
| IDEA / PROPOSED | `queued` | artefact of kind `task_contract` in `draft` | the contract exists, work has not started |
| INTAKE | `queued` | `mc_jobs.created_by` | |
| CLASSIFICATION | `queued` | contract field `risk_level` | |
| RISK ASSESSMENT | `queued` | contract field `required_approval` | |
| TASK PLAN | `queued` | contract artefact + `mc_jobs.task_contract_ids` | |
| AWAITING APPROVAL | **`awaiting_approval`** | `mc_approval_requests` row with `status='pending'` | exact existing match |
| ASSIGNMENT | `queued` (dispatched) or `running` | `mc_sessions` row started, `mc_sessions.producer` | |
| EXECUTION | **`running`** | `mc_sessions.status='running'` | |
| VALIDATION | `running` | artefact `status='verified'` | artefact carries the validation state |
| INDEPENDENT REVIEW | `awaiting_approval` (review) or `revising` (changes requested) | `mc_decisions` action `approve` / `request_revision` | |
| COMPLETION | **`completed`** | `mc_decisions` final action | |
| REVISE | **`revising`** | artefact `status='revision_requested'` | |
| **BLOCKED** | **`failed`** + `mc_decisions(action='pause', reason='blocked: …')` | decision row is the reason of record | see §3 |
| **QUOTA_PAUSED** | **`stopped`** + `mc_decisions(action='pause', reason='quota: …')` | decision row names the provider and the exhausted limit | see §4 |
| STOPPED (manual takeover) | `stopped` + `mc_decisions(action='takeover', …)` | actor recorded | |
| FAILED | **`failed`** + `mc_decisions(action='abort', reason=…)` | | |
| CANCELLED | **`cancelled`** + `mc_decisions(action='abort', reason='cancelled: …')` | | |

**Rule:** the *state* lives in `mc_jobs.status`; the *reason* lives in the append-only `mc_decisions`
log. This keeps the schema untouched and preserves the "never updated or deleted" audit property.

### 2.1 The state machine this proposal must live with (`VERIFIED`)

The repository's `JOB_TRANSITIONS` (`sqlite-mission-control-repository.ts:33-42`) permits:

```
queued  → running | cancelled
running → awaiting_approval | stopped | failed | cancelled
stopped → (terminal)
failed  → (terminal)
```

and `transitionJob` throws `Invalid job transition` for anything else. Consequences for this proposal:

- **`stopped` and `failed` are terminal.** A quota-paused job (`stopped`) cannot be resumed by a
  status change today — the repository exposes no `resumeJob` and no `failJob`.
- **`queued` cannot reach `failed` or `stopped`.** A job blocked before dispatch (the common case for
  "no credential", "waiting for approval") cannot be marked blocked or quota-paused with the current
  transition table.
- Therefore **this mapping is contingent on a small, explicit repository change**: a `failJob` path, a
  `resumeJob` path, and `queued → failed/stopped` transitions — or, alternatively, that blocked and
  quota-paused work is represented by a **pending decision row on a `queued` job** plus a contract
  field, leaving the status untouched.

Both routes are founder-gated because they change production behaviour. **This proposal does not
assume either.**

## 3. Worked example — blocked work

```
mc_jobs
  id          = job-2026-11-14-007
  title       = "Verify production Mission Control rows"
  status      = failed
  agent       = bhavya/research-agent
  task_contract_ids = ["bfaos-task-2026-11-14-007"]
  created_by  = bhavya
  created_at  = 2026-11-14T09:00:00Z
  updated_at  = 2026-11-14T09:03:00Z

mc_decisions (append-only)
  id           = <uuid>
  action       = pause
  target_kind  = job
  target_id    = job-2026-11-14-007
  actor        = bhavya/research-agent
  reason       = "blocked: no read-only production database credential (T-102); cannot inspect mc_jobs"
  instruction  = "Request a read-only Turso credential from the founder, then re-run as attempt 2."
  created_at   = 2026-11-14T09:03:00Z
```

Reading it back: `status='failed'` + a `pause` decision with a `blocked:` reason reconstructs
"BLOCKED" exactly, and the append-only log keeps the full narrative.

## 4. Worked example — quota-paused work

```
mc_jobs
  id     = job-2026-11-14-008
  title  = "Weekly knowledge ingest"
  status = stopped
  agent  = bhavya/knowledge-agent

mc_decisions
  action      = pause
  target_kind = job
  target_id   = job-2026-11-14-008
  actor       = bhavya/knowledge-agent
  reason      = "quota: Turso monthly rows-read allowance reached; no paid tier will be enabled."
  instruction = "Resume when the monthly allowance resets; batch writes are already configured."
```

`stopped` + `pause` + `quota:` reason = **QUOTA_PAUSED** without touching the CHECK constraint, and
without any code path that could silently switch to a paid provider.

## 5. Interaction with the other contracts

| Contract | Interaction |
|---|---|
| T-201 | The contract declares **no** status values; it does not depend on this mapping |
| T-202 | `mc_sessions.status` has only `running`/`completed`/`failed`; a paused attempt is recorded as a session `failed` plus a job-level `pause` decision |
| T-203 | The checkpoint's `pending_approvals` and `recovery.instructions` carry the reason across a resume |

## 6. Alternatives considered

| Alternative | Why not recommended |
|---|---|
| Extend the CHECK constraint with `blocked` and `quota_paused` | production migration on a live table; the information is already expressible; a new value would also need every consumer (UI filters, API queries, kernel mappings) to learn it |
| Keep a second status field elsewhere | creates a second source of truth for job state — precisely what the programme forbids |
| Encode state only in `mc_decisions` and leave `status` coarse | loses the queryability that `mc_jobs.status` provides (indexed: `idx_mc_jobs_status`) |

## 7. Decision requested

**D-08:** adopt the mapping in §2 (state in `mc_jobs.status`, reason in `mc_decisions`), **without**
extending the CHECK constraint — or authorise a migration that adds `blocked` and `quota_paused`.

**Recommendation:** adopt the mapping. It is reversible (documentation plus convention), needs no
migration, and preserves the append-only audit property. **Nothing in this proposal has been applied.**
