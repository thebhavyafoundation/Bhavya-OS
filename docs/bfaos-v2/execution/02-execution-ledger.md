# BFAOS V2 — Execution Ledger

**Date:** 2026-11-13 · **Branch:** `feat/bfaos-kernel-safety` (based on the Phase 1 branch `2c359d13`)
· **Rule:** a new task never starts on top of an unverified or failing task.

---

## T-000 — Phase 0/1/2 inheritance (checkpoint)

| Field | Value |
|---|---|
| Objective | Resume from the completed Phase 0 and Phase 1/2 preparation |
| Start checkpoint | Phase 1 branch `2c359d13`; master `98388ddb`; PRs #66 and #67 draft and unmerged |
| Preservation | main checkout `feat/visual-learning-batch` @ `6d40870e` untouched; 184 untracked files; 5 stashes; 14 worktrees (13 pre-existing + this task's) |

---

## T-100 — Priority Zero: reconcile GAP A–D against the real source

| Field | Value |
|---|---|
| Objective | Establish what the code actually does, rather than what the Phase 1 documents claimed |
| Branch / commit | `feat/bfaos-kernel-safety` @ `2c359d13` (read-only investigation) |
| Files changed | none (investigation only) |
| Checks | source inspection of `packages/kernel/src/{idempotency,replay,types,backup}`, `packages/kernel/package.json`, `turbo.json`, `.npmrc`, `apps/ai-institute/src/lib/repositories/*` |
| Result | **GAP A confirmed** (decision log has three fixed-action writers, no general writer) · **GAP B confirmed** (overwrite on re-register, 1 h TTL, no attempt counter, filesystem store, no locking) · **GAP C confirmed** (`ReplayEngine.replay` re-emits every recorded event, swallows failures, forces `running`, never consults idempotency) · **GAP D confirmed** (no MC column stores a document body) · **GAP E discovered** (the kernel's `test` script was an `echo`; its 7 test files never ran) |
| Evidence | `docs/bfaos-v2/execution/01-verified-gaps.md` |
| Remaining risk | GAP A remains unimplementable until D-08 is decided; GAP C's guard exists but no production caller uses it yet |
| Next | T-101 |

---

## T-101 — Kernel safety: executable coverage + fail-closed replay guard + checkpoint contract

| Field | Value |
|---|---|
| Objective | Turn the verified gaps into executable guarantees without changing shared behaviour, schema, authentication or deployment |
| Start checkpoint | `2c359d13` |
| Branch / commit | `feat/bfaos-kernel-safety` (commit recorded below) |
| Files changed | `packages/kernel/src/replay/safety.ts` (new) · `packages/kernel/src/checkpoint/index.ts` (new) · `packages/kernel/src/__tests__/idempotency.spec.ts` (new) · `packages/kernel/src/__tests__/replay-safety.spec.ts` (new) · `packages/kernel/src/__tests__/checkpoint.spec.ts` (new) · `packages/kernel/vitest.config.ts` (new) · `packages/kernel/src/index.ts` (additive exports) · `packages/kernel/package.json` (test script) · `docs/bfaos-v2/execution/*` |
| Tests run | `pnpm --filter @bhavya/kernel test` · `pnpm --filter @bhavya/kernel typecheck` · `pnpm --filter @bhavya/kernel lint` · `pnpm wrapper:check` · `pnpm platform:check` · `git diff --check` · credential scan over `packages/kernel/src` |
| Test results | **32/32 kernel specifications pass** (idempotency 10, replay-safety 12, checkpoint 10) · typecheck clean · lint 0 errors / 29 warnings, **none in the new files** · `wrapper:check` PASS · `platform:check` PASS (4/4) · `diff --check` clean · credential scan 0 hits |
| Defect found by the tests | The first guard implementation refused idempotent actions when external state was unknown — a real fail-closed defect, caught by the suite and corrected before commit (the guard now blocks only actions that actually require external-state evidence) |
| Independent review | requested — see `docs/bfaos-v2/execution/00-executive-status.md` |
| Remaining risk | (a) `vitest` is not a declared dependency of the kernel — resolution currently relies on the workspace root's `node_modules/.bin` being on `PATH`; a fresh CI install must be confirmed; (b) the guard is available but not yet applied by any caller; (c) the seven legacy harness files remain unexecuted (left untouched deliberately) |
| Next | T-102 — the decision-writer and contract-validation work is **founder-gated** (D-08/D-09); the next independent, authorised task is Mission Control-side **contract validation** that does not change the repository interface, plus the Cloudflare-side status read that Phase 0 identified as unverified |

---

## T-102 — Task contract runtime policy validation

| Field | Value |
|---|---|
| Objective | Enforce the contract rules a JSON Schema cannot express, and state honestly how each field is enforced |
| Files changed | `packages/kernel/src/contracts/task-contract.ts` (new) · `packages/kernel/src/__tests__/task-contract.spec.ts` (new) · `packages/kernel/src/index.ts` (additive exports) |
| Tests run | `pnpm --filter @bhavya/kernel test` · `typecheck` · `lint` · `wrapper:check` · `platform:check` · `git diff --check` · credential scan |
| Test results | **46/46 kernel specifications pass** (4 files: idempotency 10, replay-safety 12, checkpoint 10, task-contract 14) · typecheck clean (one TS7053 in the new module was caught and fixed before commit) · lint 0 errors / 29 pre-existing warnings, none in new files · `wrapper:check` PASS · `platform:check` PASS (4/4) · `diff --check` clean · credential scan 0 hits |
| What it enforces | unknown risk/approval levels refused (never defaulted) · L2/L3 must state explicit exclusions · L3 requires an assignment **and** founder approval · founder approval requires an independent review · a declared budget must state zero money · attempt ceiling ≤ 5 and no paid fallback · a contract granting an unsafe tool (deploy/publish/merge/…) requires founder approval · denied tools are separated from allowed tools and listed as do-not-replay · credential-shaped and learner-identifying metadata refused |
| What it honestly reports | `classifyContractFields()` marks each field **validated-at-intake**, **enforced-by-runtime**, **recorded-for-audit**, **advisory-only** or **not-implemented** — currently: budget, time limit, retry policy, checkpoint policy, scope and allowed tools are **advisory only**; nothing meters them yet |
| Independent review | requested (separate reviewer from T-101) |
| Remaining risk | the module is a **policy gate**, not yet wired into any intake path; until a caller uses it, contracts are validated only by the schema and by review |
| Next | apply both reviews, commit, push, open the draft PR; then the next authorised task (Mission Control-side session activity mapping over the existing abstractions) |

---

## Task queue status

| Task | Status |
|---|---|
| T-100 Priority Zero gap reconciliation | **DONE** |
| T-101 Kernel safety (Queue A) | **DONE** (review pending) |
| Queue B — decision writer | **FOUNDER-GATED** (D-08) |
| Queue B — contract validation wired into existing contracts | authorised, next |
| Queue B — session activity mapping | authorised, after T-102 |
| Queue C — kernel ↔ Mission Control interface mapping | authorised, documentation-only |
| Queue D — structured execution result format | authorised |
| T-102 (production Mission Control read) | **BLOCKED** — no read-only credential |
| T-301 (headless OpenCode in CI) | **BLOCKED** — founder confirmation that billing stays disabled |
