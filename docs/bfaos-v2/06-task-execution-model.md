# BFAOS V2 — 06 Task Execution Model

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. Lifecycle reconciliation

The blueprint proposes: `IDEA → INTAKE → CLASSIFICATION → RISK ASSESSMENT → TASK PLAN → APPROVAL GATE →
ASSIGNMENT → EXECUTION → VALIDATION → INDEPENDENT REVIEW → COMPLETION → AUDIT RECORD`.

The existing schema already encodes most of this. **Reconciliation, not duplication:**

| Blueprint stage | Existing home | Status |
|---|---|---|
| IDEA / INTAKE | `mc_jobs` (`title`, `department`, `task_contract_ids`) | exists; no creation path yet |
| CLASSIFICATION | `mc_jobs.department`, `mc_artifacts.source` | exists (free-form) |
| RISK ASSESSMENT | `mc_artifacts.status` ∈ draft/review/approved/… | partially exists; no explicit risk field |
| TASK PLAN | `mc_artifact_versions` + `mc_jobs.task_contract_ids` | exists |
| APPROVAL GATE | `mc_approval_requests` (pending/approved/rejected/…) + `mc_decisions` | **exists and role-gated in the app** |
| ASSIGNMENT | `mc_sessions.producer` | exists; no dispatcher |
| EXECUTION | `mc_sessions` (running/completed/failed) | exists; no runner |
| VALIDATION | `mc_artifacts.status='verified'` | exists |
| INDEPENDENT REVIEW | `mc_decisions.action='approve'` + actor | exists; no independence rule |
| COMPLETION | `mc_jobs.status='completed'` | exists |
| AUDIT RECORD | `mc_decisions` (append-only) | exists — **and duplicated** by `audit-repository.ts` |

**Net finding: the lifecycle already exists as data.** What is missing is (a) a **creator** for job
rows, (b) a **dispatcher**, (c) a **validator**, (d) a **reporter** — not new tables.

### Required schema reconciliation (do not add tables yet)

| Blueprint need | Existing vocabulary | Decision |
|---|---|---|
| `BLOCKED` job | `mc_jobs.status` has no `blocked` | reuse `failed` + `mc_decisions.action='pause'` with a reason, **or** extend the CHECK constraint in a migration — founder-level architectural decision (see `12-founder-decisions.md`, D-08) |
| `QUOTA_PAUSED` job | no quota-specific value | same decision as above; `mc_decisions` has `pause`/`resume` |
| `AWAITING_APPROVAL` | `awaiting_approval` exists | **use it** |
| `PROPOSED` | `queued` + artifact `draft` | **use them** |

## 2. Risk levels and authority

The blueprint's four levels align with existing governance. Recommended mapping:

| Level | Meaning | Authority | Enforcement today |
|---|---|---|---|
| **L0 — read-only** | inspect, research, document, diagnose | autonomous | OpenCode `plan` agent denies `edit`/`bash`/`task`; user-scope deny-list for secrets; `git push`/`rm -rf` require `ask` |
| **L1 — reversible isolated change** | docs, tests, small internal code, isolated branch | autonomous when the task authorises it | isolated worktree per task; no push to `master` |
| **L2 — shared integration change** | shared packages, workflows, auth, data access, deployment config | explicit scope authorisation + independent verification | pre-push gate with **ultra** review mode for security-sensitive paths (already enforced) |
| **L3 — production or irreversible** | production deploy, merges that trigger production, migrations, credentials, permissions, deletion, spend | **explicit founder approval, never inferred from a previous approval** | `deploy-cloudflare.yml` triggers on `master` push → treat merge as L3; `_config/project-governance.md` human gates |

**Non-negotiable rule:** a previous approval never authorises a materially changed action. The
approval must name the exact target, content digest and consequences (as already practised in the
Phase 1-A/1-B reviews).

## 3. Task record: what a BFAOS task must carry

Mapped onto existing columns wherever one exists:

| Field | Column / home |
|---|---|
| Unique ID | `mc_jobs.id` (PK) |
| Objective | `mc_jobs.title` + `task_contract_ids` |
| Owner / agent | `mc_jobs.agent` + `mc_sessions.producer` |
| Scope | `task_contract` payload |
| Dependencies | `task_contract_ids` (already JSON) |
| Risk classification | **missing** — propose a field in the contract payload, not a new table |
| Approval requirement | `mc_approval_requests` presence |
| Budget / quota | **missing** — contract payload |
| Deadline / window | **missing** — contract payload |
| Checkpoint state | `mc_sessions` + kernel `replay` |
| Artifacts | `mc_artifacts` + `mc_artifact_versions` |
| Test evidence | `mc_artifacts.source='evidence'` + artefact version payload |
| Final disposition | `mc_jobs.status` + `mc_decisions` |
| Idempotency key | `mc_jobs.id` (client-supplied) + kernel `Idempotency` |
| Retry count | `mc_sessions` rows (one per attempt) |
| Failure classification | `mc_sessions.status='failed'` + `mc_decisions.action='abort'` |

## 4. Checkpointing and recovery

**Existing mechanisms to reuse:** `mc_sessions` (attempt-level rows with `producer`, `status`,
`started_at`, `ended_at`); kernel `ReplayEngine`; kernel `Backup`; `mc_artifact_versions` (immutable
lineage).

**Checkpoint payload to record per the blueprint:** last completed task, current step, artifact
references, branch + SHA, pending verification, retry count, failure classification, recovery
instructions. Store as a `mc_artifact_versions` row of kind `checkpoint` rather than a new table.

**Recovery rules:**
- Recovery is **idempotent**: resume by `(job_id, attempt)`, never by re-running a recorded side effect.
- A non-idempotent external action (deploy, publish, merge) is **never** replayed from a checkpoint;
  it is re-approved or confirmed by inspection.
- The **"did it already happen?"** check precedes every replay — the discipline already applied in the
  Phase 1-B and 1-D investigations (inspect before acting).

## 5. Budget and quota behaviour (₹0)

| Limit | Source of truth | Behaviour on exhaustion |
|---|---|---|
| Cloudflare Workers free: 100k requests/day, 10 ms CPU/request | Cloudflare docs (verified 2026-11-13) | `QUOTA_PAUSED` — no silent degradation, no plan upgrade |
| GitHub Actions: 2,000 minutes/month, 500 MB artefacts (Free; public repo minutes free) | GitHub docs (verified 2026-11-13) | pause the queue; report; never enable billing |
| Turso free: 100 DBs, 5 GB, 500M rows read/mo, 10M written/mo | Turso pricing (verified 2026-11-13) | reduce job frequency; batch progress writes (already a product principle) |
| Backblaze B2: first 10 GB free, egress free to 3× stored | Backblaze pricing (verified 2026-11-13) | alert ~7 GB, pause uploads ~9 GB, target ≤8 GB — **policy from the master directive, not yet re-verified against the current account** |
| Model providers | free-tier session model; no local runtime | pause, checkpoint, notify — **never** auto-switch to a paid provider |

**Hard rule:** no automatic provider fallback to a paid model, and no billing-enabling action without
founder approval.

## 6. Execution adapters — what exists and what must be proven

| Adapter | State | Proof needed |
|---|---|---|
| GitHub Actions (build, test, deploy) | PROVEN | none |
| Cloudflare/OpenNext preview worker | PROVEN | none |
| OpenCode headless in a runner | **UNPROVEN** | one bounded task in CI, with a free provider and no card |
| Cloudflare API (read) | PROVEN | none |
| Cloudflare API (write) | available, unexercised | founder approval for any write |
| Turso (read/write) | INTEGRATED, unverified locally | read-only production query approval |
| B2 | CONFIGURED, unverified | bucket-scoped key + private-bucket confirmation |
| Ruflo | BLOCKED (410) | endpoint recovery (not required) |
| Hermes | NOT INSTALLED | do not install without a demonstrated capability gap |

## 7. The first execution loop, concretely

The smallest useful BFAOS loop, using only existing components:

```
1. Founder opens a GitHub issue (or a Mission Control job row).
2. An agent (OpenCode, L0/L1) classifies risk and writes a task contract.
3. The contract is recorded as mc_jobs + mc_artifacts(kind='contract') + mc_decisions(action='request_revision'|'approve').
4. If L2/L3 → mc_approval_requests(pending) → founder decision → mc_decisions(approve|reject).
5. An isolated worktree is created; the agent implements.
6. Checks run locally-light and remotely-heavy (GitHub Actions).
7. Evidence is attached as mc_artifacts(kind='evidence') + version rows.
8. An independent reviewer (different agent, or CI) verifies.
9. mc_jobs.status='completed'; mc_decisions records the outcome.
10. A draft PR is prepared for the founder. Merging remains founder-only.
```

Every step already has a home in the existing schema. **This loop requires no new system — only
wiring, contracts and a runner.**
