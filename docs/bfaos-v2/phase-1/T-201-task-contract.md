# BFAOS V2 — T-201 Task Contract Specification

**Status:** specification for founder review — **BLOCKED on D-08 and D-09** (decision writing path and
artefact-body storage; see `INDEPENDENT-REVIEW.md`) · **Date:** 2026-11-13
**Base:** Phase 0 branch `docs/bfaos-v2-phase0` @ `196a96bf` (which carries the D-08/D-09 decision
pack that blocks this specification); comparison baseline `master` @ `98388ddb`
**Artefacts:** `schemas/bfaos-task-contract.v1.schema.json`, `fixtures/*.json`, `validate-contracts.py`
**Reviewed:** an independent review pass is recorded in `INDEPENDENT-REVIEW.md`; its findings are
reflected here, and the ones that remain open are listed as blockers rather than silently dropped.

## 1. Purpose and constraint

A task contract is the **declarative record of one bounded unit of work**: its objective, its limits,
its approval requirement, and the evidence it must produce. It is *intent*, not permission.

**Reused, not created (`VERIFIED` against the repository):**

| Need | Existing home | Evidence |
|---|---|---|
| Contract storage | `mc_artifacts` row of kind `task_contract` (the `kind` column is **free text**, default `document` — the `"task_contract"` union member belongs to the mission-graph node kind, not to `McArtifact.kind`) | `mc_artifacts.kind` (`003_mission_control.ts:30`); `McArtifact.kind: string` (`mission-control-repository.ts:75`) |
| Contract body location | **`mc_artifacts` / `mc_artifact_versions` have no column that stores a document body** (`path`, `hash`, `note` only; `createArtifact` writes `path=""`, `hash=""`). The contract is therefore a **pointer** to a stored payload, and where that payload lives is **D-09** (artefact store, still open) | `003_mission_control.ts:27-57`; `sqlite-mission-control-repository.ts:322-341` |
| Contract reference from a job | **`mc_jobs.task_contract_ids`** (JSON array) | `McJob.taskContractIds: string[]` (`mission-control-repository.ts:63`) |
| Job identity and status | `mc_jobs` | `McJob` interface, `status` CHECK constraint in `003_mission_control.ts` |
| Approval request | `mc_approval_requests` | status ∈ pending/approved/rejected/revision_requested/expired/cancelled |
| Decision trail | `mc_decisions` | append-only, 12 action types |
| Session / attempt | `mc_sessions` | `startSession`, `endSession`, `listSessions` |

**No new table, no schema change, no production write.** The contract is a JSON document stored as a
Mission Control artefact; `mc_jobs.task_contract_ids` already carries its id.

## 2. Schema

`schemas/bfaos-task-contract.v1.schema.json` — JSON Schema draft 2020-12, `additionalProperties: false`
at the top level (unknown fields are rejected, so a typo cannot silently disable a control).

### 2.1 Fields

| Field | Required | Purpose |
|---|---|---|
| `contract_id` | yes | Stable identifier; also the default idempotency key |
| `contract_version` | yes | `1.(0\|1).n` — a new **major** version requires a new schema |
| `job_id` | yes | `mc_jobs.id` this contract governs |
| `title` | no | Human label |
| `objective` | yes | One verifiable statement of the outcome |
| `scope.include` / `scope.exclude` / `scope.paths` / `scope.branches` | scope conditional | In-scope and explicitly out-of-scope surface |
| `dependencies[]` | no | `{ref, kind, note}`; kinds: contract, artifact, job, external, approval |
| `assigned.agent` / `assigned.role` / `assigned.producer` | L3 conditional | Identity, logical role, and the value written to `mc_sessions.producer` |
| `risk_level` | yes | `L0` read-only · `L1` reversible isolated · `L2` shared integration · `L3` production/irreversible |
| `required_approval.level` / `approver_role` / `digest_required` | yes | `none` · `role` · `founder` |
| `allowed_tools[]` | no | `{tool, scope, mode}` — **declaration only** (see §5) |
| `budget` | no | wall clock, CI minutes, tokens, artefact bytes, `usd` (must be `0`) |
| `time_limit` | no | `started_at`, `deadline`, `max_duration_minutes` |
| `retry_policy` | no | `max_attempts` ≤ 5, `backoff`, `retryable_actions`, `on_quota_exhausted: pause_and_report` |
| `checkpoint_policy` | no | `enabled`, `every_n_steps`, `store: mc_artifact_version`, `resume_is_idempotent` |
| `acceptance_criteria[]` | yes | `{id: AC-nn, criterion, verification}` |
| `verification` | yes | `evidence_required`, `checks[]`, `independent_review`, `deployment_required` |
| `evidence[]` | no | `{kind, ref, sha256?, note?}` |
| `rollback` | yes | `instructions`, optional `revert_commit`, `data_migration` flag |
| `idempotency_key` | no | Defaults to `contract_id` |
| `metadata` | no | Non-authoritative annotations; no credentials, no learner data |

### 2.2 Conditional rules (enforced by the schema, verified by mutation tests)

| Rule | Effect |
|---|---|
| `risk_level` ∈ {L2, L3} | `scope` is required and `scope.exclude` must be non-empty |
| `risk_level` = L3 | `assigned` is required and `required_approval.level` must be `founder` |
| `required_approval.level` = `founder` | `verification.independent_review` must be `agent`, `ci` or `human` |
| `budget.usd` | Only `0` is permitted (zero-budget invariant) |
| `retry_policy.max_attempts` | ≤ 5; `on_quota_exhausted` is fixed to `pause_and_report` |
| `checkpoint_policy.store` | Fixed to `mc_artifact_version` — no new checkpoint store |
| `contract_version` | `^1\.(0\|1)\.\d+$` — a 2.x contract is rejected by this schema |

## 3. Fixtures and validation

`validate-contracts.py` (isolated; reads only files beside it; no network, no database).

| Fixture | Expectation | Result |
|---|---|---|
| `valid-L0-readonly.json` | accepted | PASS |
| `valid-L2-shared-change.json` | accepted | PASS |
| `valid-L3-production.json` | accepted | PASS |
| `boundary-limits.json` | accepted (all documented bounds) | PASS |
| `invalid-missing-required.json` | rejected | PASS |
| `invalid-enum-and-version.json` | rejected | PASS |
| version compatibility 1.0.0 / 1.1.0 / 1.2.0 / 1.10.0 / 2.0.0 / 1.0.0-rc1 | accepted / accepted / accepted / accepted / rejected / rejected | PASS |
| minimal required-only contract | accepted (backward compatible) | PASS |
| 18 rule mutations (unknown risk level, L2 without exclusions, L3 without assignment, L3 with empty assignment, L3 without founder approval, founder approval without independent review, non-zero USD, budget without `usd`, attempts above limit, unknown version, non-date-time value, empty idempotency key, wrong checkpoint store, credential in `metadata`, learner id in `metadata`, unknown property) | each rejected; role-only assignment and both valid baselines accepted | PASS |

**Total: 32 expectations satisfied, exit code 0.** Re-run with
`python docs/bfaos-v2/phase-1/validate-contracts.py`.

**Two rules are enforced by the validator rather than by the schema** (because JSON Schema 2020-12
cannot express them): RFC-3339 timestamp validity (the schema's `format` is advisory without a
format-assertion vocabulary, and the optional jsonschema format dependency is not installed here), and
the prohibition on credential-shaped or learner-identifying values in `metadata` and `evidence[].ref`.
CI's `secret-scan` (gitleaks) remains the authoritative scanner.

## 4. What the contract deliberately does **not** do

| Not done | Why |
|---|---|
| Introduce a new job status | `mc_jobs.status` is unchanged (see `D-08-job-status-vocabulary.md`) |
| Write to production | Contracts are stored as artefacts only when a job is actually created |
| Extend the Mission Control schema | The contract rides existing columns and an existing artefact kind |
| Assume kernel enforcement | A JSON Schema cannot enforce a permission |
| Assume the agent may widen its own scope | `allowed_tools` is a declaration; the enforcing layer is OpenCode permissions + kernel `Permissions` |

## 5. Enforcement layering (explicit)

| Layer | Enforces | Reality |
|---|---|---|
| Schema | shape, required fields, conditional rules, zero-budget | **implemented and verified** in this deliverable |
| Repository | artefact persistence, job linkage | **already exists** (`createArtifact`, `mc_jobs.task_contract_ids`) |
| Pre-push gate | secret scan, platform contract, review record with ultra mode for security-sensitive paths | **already exists**, but it is a **local Husky hook** — no CI workflow invokes it, so it is bypassable with `--no-verify` |
| OpenCode permissions | actual tool access (global deny-list + `plan` read-only agent) | **already exists** |
| Kernel `Permissions` | programmatic capability checks | **in-memory, per-process, grant-only, no deny semantics** (`check()` returns true for any `resource='*'` grant) — implemented, but **not** a contract enforcer: `allowed_tools[].mode:"deny"` has no implementation |
| Human approval | founder decision recorded in `mc_approval_requests` / `mc_decisions` | **already exists**, but see `INDEPENDENT-REVIEW.md` (S1): the `pause`/`resume`/`retry`/`takeover` decision actions have **no writer** in the repository API |

**The contract is a declaration that reviewers and the approval workflow can check. It is not, by
itself, a capability grant.** An agent must never widen its own `allowed_tools`; a widened contract
requires a new approval against a new digest.

## 6. Known gaps in this specification

1. **No programmatic enforcement.** A contract can be validated but not yet *enforced* by the kernel.
   Wiring kernel `Permissions` to the contract is a Phase 2 implementation task (T-202/T-203) that
   this specification deliberately does not perform.
2. **`retryable_actions` is a free-text list.** The schema cannot forbid a value such as `deploy`; the
   prohibition is policy plus reviewer scrutiny plus the non-replay invariant in T-203.
3. **No schema for approval or evidence artefacts** — they are validated by the repository's own
   interfaces (`mc_approval_requests`, `mc_artifact_versions`).
4. **Budget fields are declarative.** Nothing meters tokens or CI minutes yet; the numbers are a
   contract the operator must honour.
5. **`metadata` accepts arbitrary scalars.** It is excluded from any authorisation decision, but a
   future version should restrict it further once the usage pattern is known.

## 7. Founder decisions referenced

- **D-07** (canonical agent registry) — `assigned.role` must name a role that exists in the canonical
  registry; the T-101 evidence shows `.ai/agents/registry.yaml` is already that source.
- **D-08** (job status vocabulary) — this contract deliberately uses **no** new status values.
