# BFAOS V2 — Independent Review of the Phase 1/2 Contract Specifications

**Date:** 2026-11-13 · **Reviewer:** an independent agent (read-only; no file modified during the
review) · **Reviewed artefacts:** `T-201-task-contract.md`, `T-202-agent-activity-contract.md`,
`T-203-checkpoint-and-recovery-contract.md`, `schemas/bfaos-task-contract.v1.schema.json`,
`fixtures/*.json` (6), `validate-contracts.py`
**Ground truth used:** `mission-control-repository.ts`, `sqlite-mission-control-repository.ts`,
`003_/004_` Mission Control migrations, `packages/kernel/src/{idempotency,replay,backup,permissions,types}`

## 1. Headline

The review **reproduced the validator output verbatim (21 expectations, exit 0 at review time)** and
confirmed the schema behaviour by direct probing. Its verdict was that the schema work is sound but
**three of ten criteria fail on one root cause**: the specifications describe behaviour the repository
*permits* (CHECK constraints, column shapes) but does not *expose* (APIs, state machines, durable
stores).

**Four blockers** were raised, and **fifteen defects must be addressed before implementation**. This
document records every finding, what was done about it, and what remains founder-gated.

## 2. Criteria verdicts (as returned by the reviewer)

| # | Criterion | Verdict | Disposition after review |
|---|---|---|---|
| 1 | Schema compatibility | CONCERN | **Corrected**: invented `paused` status removed; `task_contract` citation corrected; timestamp claim corrected; the "no column stores a document body" constraint is now stated as a blocker on D-09 |
| 2 | Idempotency coherence | **FAIL** | **Partly corrected, partly escalated**: kernel semantics (TTL, `register` overwrite, `pending` meaning, no attempt counter) are now stated accurately; the unresolved enforcement gap is escalated as a founder decision |
| 3 | Permission enforcement | PASS (qualified) | **Corrected**: kernel `Permissions` is no longer described as an enforcing layer; pre-push gate is no longer described as CI-enforced |
| 4 | Data exposure | CONCERN | **Partly corrected**: the schema now requires a non-empty `assigned`; the validator adds a metadata/evidence credential and learner-identifier guard; prose-only prohibitions are now backed by a validator rule, and CI's gitleaks remains the authoritative scanner |
| 5 | Retry safety | **FAIL** | **Corrected as policy, escalated as blocker**: the class A–D model is restated as review-time policy with **no** enforcement point; `ReplayEngine`'s real behaviour is documented; class-C non-replay is recorded as unimplementable without a new repository method |
| 6 | Versioning | CONCERN | **Corrected**: the schema now accepts any `1.x.y`; the false "minor versions are accepted / 1.0–1.1 only" contradiction is removed; version tests extended (1.2.0, 1.10.0 accepted; 2.0.0 and prereleases rejected) |
| 7 | Recoverability | **FAIL** | **Corrected and escalated**: the `JOB_TRANSITIONS` reality (`stopped`/`failed` terminal; `queued` cannot reach `failed`/`stopped`) is now stated; the resume claim is withdrawn pending `resumeJob`/`failJob` |
| 8 | Backward compatibility | CONCERN | **Corrected**: the artefact-approval side effect (`completeJob` requires every artefact approved; `addVersion` cancels pending approvals) and the `mc_*` production-availability precondition are now stated |
| 9 | No duplication | CONCERN | **Partly corrected**: the third idempotency space (`evidence_records.idempotency_key`) is now named; attempt-count ownership is flagged for a single owner |
| 10 | Test adequacy | **FAIL** | **Corrected**: the schema suite now covers the previously untested invariants (empty assignment, non-date-time, credential/learner values in metadata, budget without `usd`, empty idempotency key, wrong checkpoint store, version policy). **32 expectations, exit 0.** The repository-level tests remain **design, not assertions** |

## 3. Blockers (must be resolved before implementation)

| ID | Blocker | Status |
|---|---|---|
| **S1** | The audit trail the specifications depend on is **not writable** through the repository API: `mc_decisions` permits `pause`/`resume`/`retry`/`takeover`, but `stopJob` writes a fixed `'abort'`/`'job'`, `decide()` accepts only approve/reject/request_revision, `endSession` writes **no** decision, and the interface exposes no `recordDecision`/`pauseJob`/`resumeJob`/`failJob` | **Escalated (founder-gated)**: requires a production code change, which this phase does not authorise. The specifications now state the dependency explicitly. |
| **S2** | Kernel idempotency semantics contradict T-203: an abandoned attempt is not representable (`status ∈ {pending, completed, failed}`), and `shouldExecute` returns `proceed:false` for `pending` — the opposite of the claim | **Corrected in the specification** (the claim was false); the design consequence is escalated with S3 |
| **S3** | `max_attempts` is unenforceable by the named mechanism: `Idempotency` records no attempt count, and `fail()` makes `shouldExecute` proceed unconditionally | **Escalated**: either the kernel gains an explicit abandoned status and an attempt counter, or the contract's limit is enforced by the orchestrator that owns `ExecutionContext.retryCount`/`maxRetries` |
| **S4** | The replay classification is a policy document with no enforcement point, and the one existing replay mechanism is unsafe by default: `ReplayEngine.replay` re-emits every recorded event, silently skips failing handlers, forces state back to `running`, never consults `shouldExecute` and is unaware of classes A–D | **Corrected in the specification** (the "no new machinery" claim was false); the requirement for a gate that consults `do_not_replay`/`inspect_before_replay` before any tool call is recorded as an implementation prerequisite |

**Also blocking implementation (found by the reviewer, recorded):**
**S7** — neither `mc_artifacts` nor `mc_artifact_versions` has a column that stores a document body
(`createArtifact` writes `path=""`, `hash=""`); therefore "the contract is stored as an artefact" and
"a checkpoint is an artefact version" are **pointers**, and the payload's home depends on **D-09**
(artefact store, still open). T-201 and T-203 are therefore **BLOCKED on D-08 and D-09**.
**S12** — `createArtifact` has no idempotency parameter and bypasses the idempotent `addVersion`, so a
retried contract write would create a duplicate artefact row.
**S13** — storing a contract as an artefact changes job-completion semantics: `completeJob` refuses to
complete while any artefact is not approved/integrated/archived, and `addVersion` cancels pending
approval requests — so contracts would need their own approval round and would pollute review queues.

## 4. Corrections applied in this phase (artefacts only)

| Change | Artefact | Effect |
|---|---|---|
| `contract_version` pattern relaxed to `^1\.\d+\.\d+$` | schema | any 1.x.y accepted; contradiction with "major version 1" removed |
| `assigned` requires at least one of `agent`/`role`/`producer` (`anyOf` + `minProperties`) | schema | the L3-assignment invariant is no longer vacuous |
| `budget` requires `usd` | schema | a declared budget must state zero |
| `idempotency_key` `minLength: 1` | schema | empty key rejected |
| Format assertion + explicit RFC-3339 guard | validator | `started_at`/`deadline` are actually validated (the schema's `format` is advisory) |
| Credential/learner guard over `metadata` and `evidence[].ref` | validator | prose prohibitions are now enforced; pattern set extended to cover `sk_live_`, `sk_proj_`, `gh[pousr]_`, `github_pat_`, `xox*-`, JWT, AWS session keys |
| Version policy tests extended | validator | 1.2.0 and 1.10.0 accepted; 2.0.0 and `1.0.0-rc1` rejected |
| Nine further rule mutations | validator | empty assignment, role-only assignment, budget without `usd`, non-date-time, empty idempotency key, wrong checkpoint store, credential in metadata, learner id in metadata — each now proven |
| Factual corrections to T-201/T-202/T-203/D-08 | documents | `paused` status removed; `task_contract` citation corrected; timestamp format claim corrected; `ReplayEngine` and kernel `Idempotency` behaviour described accurately; `JOB_TRANSITIONS` reality stated; enforcement layers no longer overstated; artefact-approval and `mc_*` availability preconditions recorded |

**Validation after corrections: `python docs/bfaos-v2/phase-1/validate-contracts.py` → 32 expectations
satisfied, exit 0.**

## 5. Remaining findings recorded, not actioned (with reasons)

| ID | Finding | Why not actioned here |
|---|---|---|
| S9 | `Idempotency` TTL defaults to 1 h and deletes expired keys, so a long contract re-opens a completed key; `register()` overwrites without a guard | Requires kernel change — founder-gated. Recorded as a design constraint: the TTL must exceed the contract's `max_duration_minutes` |
| S10 | The kernel idempotency store is a per-checkout filesystem map (`.kernel/idempotency/*.json`, no locking) and does not survive a fresh CI runner | Points the durable choice at `evidence_records.idempotency_key` (S11) — a design decision for implementation |
| S11 | A third idempotency space already exists, DB-backed and already wired (`evidence_records.idempotency_key`, used by `createJob` and `addVersion`), and the specifications ignored it | Recorded as the recommended durable choice; changing behaviour is implementation |
| S14→fixed | "L3 requires an assignment" was vacuous | **Fixed** in the schema and proven by two new mutations |
| S15→fixed | `format` was not enforced | **Fixed** in the validator; the schema keeps the advisory annotation |
| S16→partly fixed | Credential scanner missed 9 of 10 realistic shapes; the schema permitted credentials and learner ids in `metadata` | **Partly fixed** (validator guard + pattern set). The authoritative scanner remains CI's `secret-scan` (gitleaks); the schema cannot express the prohibition |
| S17 | The checkpoint payload has no schema, no validator, no size bound, and `b2://` path values are an invention | Recorded as a required follow-up artefact (a checkpoint JSON Schema) — deliberately not invented here, because its storage home is D-09-blocked |
| S18 | `mc_sessions.started_at` is SQLite `datetime('now')` (space-separated, parsed as **local** time by JavaScript — a measured 5½-hour shift on this machine), while `ended_at` is ISO-8601 | Corrected in T-202; the one-line fix (write an explicit ISO-8601 UTC string) is an application change — not authorised here |
| S19 | `mc_jobs.session_id` is a single mutable pointer overwritten by every `startSession`; the job points only at the latest attempt | Recorded in T-202; it is why attempt identity is ordinal |
| S20 | Attempt identity is an ordinal over a mutable list, with no uniqueness constraint | Recorded; accepted as a limitation of the existing schema |
| S22 | `required_approval.digest_required` defaults to true but no digest concept exists in `mc_approval_requests` | Recorded; the flag is documentation until a digest column exists |
| S23 | `allowed_tools[].mode:"deny"` has no enforcer: kernel `Permissions` is in-memory, per-process and grant-only (no deny semantics, `resource='*'` matches everything) | Corrected in T-201 §5 (no longer listed as an enforcing layer) |
| S24 | `mc_*` tables are absent from the production Turso baseline — `initDatabase()` applies only `BASELINE_SCHEMA` in production; the migration runner runs only locally | Recorded as a hard precondition in all three specifications |
| S25 | The pre-push gate is a local Husky hook; no CI workflow invokes it, so it is bypassable with `--no-verify` | Corrected in T-201 §5 |
| S26 | `mission-control.test.ts` already covers part of T-202-A/T-202-D and the `addVersion` idempotency case | Corrected in T-202/T-203 (the remaining tests are genuinely uncovered) |
| S27 | Fixture expectation is encoded in the filename, not in the fixture | Accepted as a convention; the validator prints the expectation it applied |
| S28 | No concurrency control between attempts: `startSession` checks nothing and `mc_jobs` has no lease column | Recorded as an implementation requirement (no concurrent attempts per job) |
| S29 | Programme-internal contradiction on checkpoint storage (architecture doc says "add a checkpoint table" in one place and "checkpoint row in mc_sessions" in another, while T-203 says artefact version) | Recorded; T-203's choice (artefact version, no new table) is the one adopted here, and the parent architecture text is left for the Phase 1 correction pass |
| S30 | The kernel API surface was cited without the semantics that decide replay (TTL, `register` overwrite, `pending` semantics, `cleanup`) | Corrected in T-203 §1 |
| S1–S4, S7, S12, S13 | See §3 | Founder-gated (production code changes) |

## 6. What the reviewer independently confirmed as accurate

- The validator genuinely passes and the claim "21 expectations satisfied, exit code 0" was accurate at
  review time (reproduced verbatim).
- The `additionalProperties:false` + conditional `if/then` mechanism behaves as the fixtures claim:
  no spurious `additionalProperties` collisions, no vacuous triggering, nested unknowns rejected.
- Every Mission Control column, enum, foreign key and CHECK constraint the specifications relied on
  exists as described — including `mc_jobs.task_contract_ids`, the eight-value `mc_jobs.status`
  CHECK, the three-value `mc_sessions.status` CHECK, `mc_artifact_versions.session_id` and the twelve
  `mc_decisions` actions.
- No second scheduler, ledger, audit log, permission engine or session store is introduced.
- The application source was not modified; the tests are described, not added.
