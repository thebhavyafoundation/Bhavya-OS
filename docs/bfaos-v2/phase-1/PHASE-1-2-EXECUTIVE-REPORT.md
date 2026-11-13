# BFAOS V2 — Phase 1/2 Executive Report

**Date:** 2026-11-13 · **Branch:** `docs/bfaos-v2-phase1-reconciliation` (based on the Phase 0 branch
`docs/bfaos-v2-phase0` @ `196a96bf`) · **Base for comparison:** `master` @ `98388ddb`
**Mode:** documentation, read-only investigation and isolated (non-production) contract verification.
**No production change, no merge, no deployment, no provider mutation.**

## A. Repository preservation and base SHA

| Item | Value |
|---|---|
| Main checkout (frozen PR #62) | `feat/visual-learning-batch` @ `6d40870e9ebde3f3a9e5f077b1b905c3ff397a26` — never switched or modified |
| `origin/master` | `98388ddbe64a9e969e9afb30367ac65f7edd6566` — unchanged |
| Phase 0 branch | `docs/bfaos-v2-phase0` @ `196a96bfcd9f7d28364ca53def44d01fea71d7cd` — unmodified |
| Tracked working tree | clean |
| Untracked files | 184 (181 pre-existing + 3 Phase 1 evidence reports) |
| Stashes / worktrees | 5 / 13 → 14 (this phase added `D:\Bhavya-OS-wt\bfaos-v2-phase1`) |
| PRs #61–#66 | untouched — no merge, close, retarget, rebase, edit, label or comment |
| Isolation | fresh worktree on `docs/bfaos-v2-phase1-reconciliation` based on the Phase 0 branch |

## B. T-101 registry findings and D-07 options

**The authority question is already answered by the code.** `scripts/generate-registry.js:134-137` states
*"Agents live in the canonical `.ai/agents/registry.yaml`"*, and three runtime consumers read that file
(`packages/runtime/cli/bhavya.mjs:103`, `packages/runtime/cli/orchestrator.mjs:18`,
`packages/cli/src/commands/create.ts:85`). `registry/agents.json` is a **generated projection** of it.

**The real defect is silent drift, not ambiguity:** `pnpm registry:check` exists, but **CI never runs
it**, so `registry/agents.json` has been frozen at `2026-09-17` while the inventory changed.

**Sharper finding — the canonical *skills* list is inverted.** `AGENTS.md:45` names `skills-lock.json` as
the canonical skill list, but that file enumerates ~130 **Google** skills that are **not installed** here
and contains **none** of the 20 tracked `bhavya-*` skills.

Two options are prepared (full detail in `T-101-agent-registry-reconciliation.md`):
**A** — declare `.ai/agents/registry.yaml` canonical, add `registry:check` to CI, regenerate the
projection, and correct the `AGENTS.md` skills pointer. **B** — publish an explicit precedence table and
change nothing. Neither was applied; both need **D-07**.

## C. T-103 pull-request disposition matrix

**21 open PRs** (two more than Phase 0 recorded — that page was size-limited). Full matrix in
`T-103-pull-request-disposition.md`.

| Disposition | Count | PRs |
|---|---|---|
| Keep and review | 4 | #61, #62, #63, #66 |
| Rebase required | 5 | #26, #29, #31, #37, #60 |
| Candidate for closure (superseded) | 9 | #27, #35, #45, #46, #48, #49, #51, #52, (+#31 partly) |
| Founder decision required | 3 | #42, #53, #64/#65 (D-02) |

Verified supersession evidence, for example: master already contains `"use client"` in the PR #27
target file, `.husky/pre-push` + `scripts/pre-push-gate.mjs` + the Ponytail wrapper (PRs #51, #52),
`apps/ai-institute/open-next.config.ts` (PR #45), and the materialise-conditional-exports script
(PRs #46, #48, #49). **Unrepresented value** exists in PR #37 (database-layer fixes + an incident
document) and PR #26 (four design documents). PRs #48 and #49 depend on PR #46; PR #29 conflicts with
PR #63 on `deploy.yml`; PR #42 overlaps PR #62's curriculum surface. Every merge to `master` triggers a
production deploy — merge discipline is therefore a founder decision, recorded as such.

## D. T-104 authentication architecture truth

Two stacks coexist. **Stack A (live):** Turso-backed `api-auth` — password verification, session row,
`session-token` cookie (`HttpOnly`, `Secure` in production, `SameSite=Strict`, 7 days), expiry check on
every read, server-side `roleIsAllowed` gates. **Stack B (declared):** Supabase `getUser()` +
`profiles`, used by `/api/certificates` and `/api/student/progress` plus the OAuth callback.

**Public behaviour verified:** `/login`, `/register` → 200; `/api/auth/me`, `/api/student` → 401;
`/os/mission*` pages → 307; Mission Control APIs → 401; `/api/health` → 200.
**Classified:** stack A proven operational in code, tests and live guards (a live credentialed login was
**not** performed — no credential was used, no learner record read); stack B **secondary and currently
unavailable** because the configured Supabase project is paused; the development stub (`test-token`,
fixed credentials) can never produce a server-side session and remains a latent client-side defect.
`PLATFORM-TRUTH.md` does not describe the running system — the correction is **D-03** (founder-owned).

## E. T-201 task contract schema and fixtures

`schemas/bfaos-task-contract.v1.schema.json` (JSON Schema 2020-12, `additionalProperties:false`,
three conditional rule groups) plus **six fixtures** and an isolated validator.

**Reuse, not creation:** the contract is stored as a Mission Control artefact of kind **`task_contract`**
(kind already exists in the repository) and referenced by **`mc_jobs.task_contract_ids`** (column
already exists). No new table, no schema change, no production write.

**Validation result: 32 expectations satisfied, exit 0** — valid L0/L2/L3 fixtures accepted, boundary
fixture accepted, two invalid fixtures rejected, version compatibility (1.0.0 / 1.1.0 / 1.2.0 / 1.10.0
accepted; 2.0.0 and `1.0.0-rc1` rejected), minimal-required-only contract accepted, and **eighteen
per-rule mutations each rejected** (including the ones the independent review found untested: empty
assignment, non-date-time value, credential and learner-id values in `metadata`, budget without `usd`,
empty idempotency key, wrong checkpoint store).

**Honest limitation:** the schema *declares*; it does not *enforce*. Enforcement remains OpenCode
permissions + the pre-push gate + human approval. Two rules are enforced by the validator rather than
the schema (RFC-3339 timestamps, credential/learner-value guard) because JSON Schema 2020-12 cannot
express them. This is stated in the spec.

## F. T-202 activity contract

`mc_sessions` is used as the **execution-attempt** store, not a conversation store: one row per attempt,
`producer` formatted `runtime:instance[:detail]`, attempt identity as the ordinal of
`listSessions(jobId)`, failure reason in `mc_decisions(action='abort')` because the table has no reason
column, checkpoint reference through `mc_artifact_versions.session_id`. **No duplicate session store.**
Gap noted: the checkpoint artefact kind is not yet in the enumerated artefact-kind union (a typing
choice, not a database constraint — confirm before implementation).

## G. T-203 checkpoint and recovery contract

A checkpoint is an `mc_artifact_versions` row (`path` + `hash` already exist) whose payload carries job,
session, attempt, completed/current steps, artefact references, branch and commit SHA, test results,
pending approvals, recovery instructions and idempotency keys.

**The invariant is stated prominently:** a non-idempotent external action is **never** replayed merely
because a previous execution did not record its result — the provider's actual state is the authority;
if the state cannot be inspected, the action is escalated. Actions are classified A (freely replayable),
B (replayable after verification), C (never replayed automatically — deploy, publish, merge, migration,
credential change, payment) and D (one-shot). Scenarios specified: safe resume, failed resume, class-C
resume, manual takeover, quota exhaustion.

## H. D-08 status mapping proposal

**Proposal only; no CHECK constraint extended, no status invented in code.** The blueprint's `BLOCKED`
maps to `mc_jobs.status='failed'` + `mc_decisions(action='pause', reason='blocked: …')`; `QUOTA_PAUSED`
maps to `status='stopped'` + `pause` with a `quota:` reason. Two worked examples are included. The
state lives in the indexed column; the reason lives in the append-only log. **Awaiting founder
acceptance.**

## I. Independent review findings

An independent agent reviewed the three contract specifications against the repository ground truth
without modifying anything. Its full report is recorded in `INDEPENDENT-REVIEW.md`.

**Verdict (as returned):** criteria 3 (permission enforcement) passed with a qualification; criteria 1,
4, 6, 8 and 9 returned **CONCERN**; criteria **2 (idempotency), 5 (retry safety), 7
(recoverability) and 10 (test adequacy) FAILED**. Root cause identified by the reviewer: *"the
specifications describe behaviour that the repository permits but does not expose."*

**Corrections applied to the artefacts (the review was not ignored):**

| Correction | Artefact |
|---|---|
| `contract_version` relaxed to any `1.x.y`; the false "minor versions accepted / 1.0–1.1 only" contradiction removed | schema |
| `assigned` now requires at least one of `agent`/`role`/`producer` (the L3 rule was vacuous) | schema |
| `budget` must state `usd`; `idempotency_key` must be non-empty | schema |
| RFC-3339 timestamp enforcement added (the schema's `format` is advisory) | validator |
| Credential/learner-value guard added over `metadata` and `evidence[].ref`; pattern set extended to `sk_live_`, `sk_proj_`, `gh[pousr]_`, `github_pat_`, `xox*-`, JWT, AWS session keys | validator |
| Eighteen rule mutations now proven, including the ones the reviewer found untested | validator |
| Invented `paused` status removed; D-08 alignment enforced | T-203 |
| `task_contract` citation corrected (the enumerated kind belongs to the mission-graph node union, not to `McArtifact.kind`) and the **absence of any document-body column** stated | T-201 |
| Kernel `Permissions` and the pre-push gate no longer described as enforcing layers | T-201 |
| `mc_sessions.started_at` format corrected (SQLite local-time string, not ISO-8601 UTC) | T-202 |
| Kernel `Idempotency` semantics stated accurately (TTL, `register` overwrite, `pending` meaning, no attempt counter) and `ReplayEngine` no longer called deterministic | T-203 |
| `JOB_TRANSITIONS` reality added: `stopped`/`failed` are terminal, `queued` cannot reach `failed`/`stopped` | D-08 |

**Four blockers remain open and are founder-gated** (they need production code changes this phase does
not authorise):

| ID | Blocker |
|---|---|
| **S1** | The decision log cannot be written: `mc_decisions` permits `pause`/`resume`/`retry`/`takeover`, but the repository exposes no writer for them and `endSession` writes no decision at all |
| **S2/S3** | Kernel idempotency semantics contradict the specification, and `max_attempts` is not enforceable by the named mechanism |
| **S4** | The replay classification has no enforcement point, and the existing `ReplayEngine` re-emits recorded actions by default |
| **S7/S12/S13** | No column stores a contract or checkpoint body (`path`/`hash` are pointers only); `createArtifact` is not idempotent; storing contracts as artefacts changes job-completion semantics |

**Consequence:** T-201 and T-203 are marked **BLOCKED on D-08 and D-09** in their headers, and the
D-08 mapping is marked **contingent** on a `failJob`/`resumeJob` decision path.

## J. Checks and test evidence

| Check | Command / method | Result |
|---|---|---|
| Contract schema + fixtures | `python docs/bfaos-v2/phase-1/validate-contracts.py` | **32/32 expectations, exit 0** — 3 valid fixtures + boundary accepted, 2 invalid rejected, 6 version-policy cases, minimal contract accepted |
| Rule-by-rule mutation coverage | same | **18 mutations each rejected**; role-only assignment and both valid baselines accepted |
| JSON parsing | all 7 JSON artefacts | all parse |
| Markdown structure | `check-markdown.py` (22 files) | **0 structural issues** (one H1 each, table columns consistent, trailing newline, no tabs) |
| Link / path validation | `check-doc-links.py` | 0 broken links, 0 credential-shaped hits; 6 paths adjudicated (§K) |
| UTF-8 integrity | scan for replacement characters | 0 across 21 documents |
| CI on the branch | GitHub Actions | see the delivery section below |

## K. Document accuracy notes (adjudicated findings)

| Flagged path | Adjudication |
|---|---|
| `docs/verification/2026-11-13-vercel-*-phase-1*.md` (3 refs) | **Cross-references to evidence that exists only as untracked files in the founder's main checkout** — not in the repository. Recommend committing them (founder decision). |
| `_config/project-governance.md` (4 refs) | **Exists on the PR #62 branch, not on `master`** — the governance file this programme cites is itself part of the frozen PR. Phase 0 documents cite it accurately for the PR #62 tree; the correction belongs with the PR #62 merge. |
| `docs/releases/opennext-libsql-incident.md` (2 refs) | **Intentional** — the path is cited as absent from `master` because PR #37 adds it. |

**8 references in total; none is a broken link** (0 broken relative links, 0 credential-shaped hits).

## L. Remaining founder decisions and blocked tasks

| Decision | Status |
|---|---|
| **D-07** (agent registry authority, now split into D-07.1…D-07.5) | open — options prepared, nothing applied |
| **D-02** (Vercel merge-or-retire, incl. PRs #64/#65) | open |
| **D-03** (Supabase continuity + the authentication-architecture truth) | open — evidence supplied by T-104 |
| **D-08** (job status vocabulary) | open — mapping proposed, nothing applied |
| **D-01, D-04, D-05, D-06, D-09, D-10** | open — carried from Phase 0 |
| **T-102** (read production Mission Control data) | **BLOCKED** — no read-only credential |
| **T-301** (headless OpenCode in CI) | **BLOCKED** — founder confirmation that billing stays disabled |
| **T-301/T-302 implementation** | not started — requires approval |
| **PR dispositions** (#26–#60) | awaiting founder decision; no PR was touched |

**Next authorised step (documentation/verification only):** founder decisions D-07.1–D-07.5 and D-08 can
be applied as documentation once accepted; T-201/T-202/T-203 implementation (mocked-repository tests and
the kernel/Mission Control wiring) needs explicit approval because it changes application code. The
Phase 1/2 preparation work itself is complete.
