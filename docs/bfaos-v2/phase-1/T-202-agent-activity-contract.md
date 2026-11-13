# BFAOS V2 — T-202 Agent Activity Contract

**Status:** specification for founder review · **Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. What already exists (verified)

| Element | Definition | Evidence |
|---|---|---|
| Session row | `mc_sessions(id, job_id, producer, status ∈ running/completed/failed, started_at, ended_at)` | `003_`/`004_` migrations; `McSession` interface |
| Lifecycle | `startSession(jobId, producer)`, `endSession(id, "completed" \| "failed")`, `listSessions(jobId)` | `mission-control-repository.ts:292-294` |
| Job → session link | `mc_jobs.session_id` and `mc_jobs.queue_job_id` | `McJob` interface; migration `004` `down` block shows both columns |
| Artefact → session link | `mc_artifact_versions.session_id` | `McArtifactVersion.sessionId` |
| Evidence edge | evidence link kind `"produced_by_session"` | `mission-control-repository.ts:339` |
| Artefact kinds | `job`, `task_contract`, `artifact`, `version`, `approval`, `decision`, `session` | `mission-control-repository.ts:323` |

**Conclusion:** the session store, its lifecycle methods, and both linkage columns exist. **T-202 does
not add a session store.** It specifies how the existing fields are *populated* by BFAOS agents.

## 2. Mapping: activity concept → existing field

| Activity concept | Field | Convention | Notes |
|---|---|---|---|
| **Agent identity** | `mc_sessions.producer` (qualified) | `opencode:<agent-name>` for an OpenCode agent; `github-actions:<workflow>:<run-id>` for a runner | `producer` is a free-text column; the convention makes it parseable |
| **Role** | contract `assigned.role` | one of the registry roles | role lives in the contract artefact, not in `mc_sessions` (no column) |
| **Producer (raw)** | `mc_sessions.producer` (raw segment) | the producer string as recorded by the caller | kept verbatim for the runtime that created it |
| **Job relationship** | `mc_sessions.job_id` → `mc_jobs.id` | mandatory | already enforced by the foreign key |
| **Attempt identity** | one `mc_sessions` row per attempt | attempt *n* = the *n*-th `listSessions(jobId)` row ordered by `startedAt` | **no attempt column exists** — ordinal + producer is the identity |
| **Start / end** | `started_at`, `ended_at` | ISO-8601 UTC, set by `startSession` / `endSession` | already implemented |
| **Status** | `mc_sessions.status` | `running` → `completed` \| `failed` | no `paused` value exists (see §5) |
| **Checkpoint reference** | `mc_artifact_versions.session_id` + artefact `path`/`hash` | the checkpoint artefact carries the producing `session_id` | reuse, no new table |
| **Failure reason** | `mc_decisions(action='abort', reason=…)` targeting the session | reason text lives in the append-only decision log | `mc_sessions` has **no** failure-reason column |
| **Evidence references** | `mc_artifacts` + `mc_artifact_versions` linked by `session_id` | edge kind `produced_by_session` | already modelled |

## 3. Distinguishing an OpenCode session from an individual agent task

This is the key modelling question, because `mc_sessions` is a single table with one `producer` column.

**Decision: `mc_sessions` records an *execution attempt*, not a conversation.**

| Level | Recorded as | Identifier |
|---|---|---|
| Human or agent conversation (a "session" in OpenCode's sense) | **not** stored in `mc_sessions` | lives in the OpenCode session store; referenced by id in contract metadata |
| Agent task / execution attempt | **one `mc_sessions` row** | `mc_sessions.id`; `producer` = `opencode:<agent>:<attempt-context>` |
| Tool call inside an attempt | **not** stored | appears in evidence artefacts (logs) referenced by the attempt |

Consequences:

1. **One agent task = one `mc_sessions` row.** A task that retries creates a *new* row; the attempt
   ordinal distinguishes them.
2. **A multi-step task does not create rows per step.** Steps are recorded inside the checkpoint
   payload (T-203), not as sessions.
3. **The conversation id is carried in the contract and in artefact metadata**, so an operator can
   move from a session row back to the originating conversation without the schema knowing what a
   conversation is.

## 4. Producer string format

```
<runtime>:<runtime-instance>[:<detail>]
```

| Example | Meaning |
|---|---|
| `opencode:bhavya` | the default Bhavya agent in OpenCode |
| `opencode:engineering-agent` | a named agent role |
| `github-actions:ci:43390156685` | a GitHub Actions run |
| `opencode:engineering-agent:attempt-2` | a retry of the same agent |

**Rules:** the first segment is always the runtime; segments never contain `:`; the string is stable
and machine-parseable; it never contains a credential, a learner identifier or a URL with a token.

## 5. Gaps and how they are handled without schema change

| Gap | Handling |
|---|---|
| No `attempt` column | attempt ordinal from `listSessions(jobId)` order plus the producer detail segment |
| No `failure_reason` column | failure reason recorded in `mc_decisions` (`action='abort'`, `targetKind='session'`, `targetId=<session id>`, `reason=…`) — the append-only log is the right home for narrative |
| No `paused` session status | a paused attempt is ended as `failed` with `mc_decisions(action='pause')`, or left `running` with a pause decision; the choice is part of D-08 |
| No checkpoint column on the session | checkpoint is an artefact version whose `session_id` points at the session (T-203) |
| No role column | role lives in the contract artefact referenced by `mc_jobs.task_contract_ids` |
| No tool-call record | tool calls are evidence, not state |

## 6. Tests prepared (fixtures and mocks only; no production access)

| Test | Assertion | Method |
|---|---|---|
| T-202-A | a session row round-trips producer/status/timestamps through `startSession`/`endSession` | mocked repository |
| T-202-B | two attempts for one job produce two rows with distinct producers and ordered `startedAt` | mocked repository |
| T-202-C | a failure produces `status='failed'` **and** an `mc_decisions` row with `action='abort'` and a reason | mocked repository |
| T-202-D | an artefact produced by an attempt links back through `session_id` | mocked repository |
| T-202-E | a producer string parses into runtime / instance / detail | pure function test |
| T-202-F | no producer string contains a credential-shaped value | pattern scan over fixtures |

**Status: specification only.** The mocked-repository tests are described here; the repository's
existing test file `apps/ai-institute/src/lib/__tests__/mission-control.test.ts` is the natural home
when implementation is authorised. **No test was added to the application in this phase**, because
Phase 1/2 is documentation-and-isolated-verification only and the directive forbids production
behaviour changes.

## 7. Founder decisions referenced

- **D-07** — `producer` details may reference a role that must exist in the canonical registry.
- **D-08** — the pause representation interacts with the session status vocabulary.
