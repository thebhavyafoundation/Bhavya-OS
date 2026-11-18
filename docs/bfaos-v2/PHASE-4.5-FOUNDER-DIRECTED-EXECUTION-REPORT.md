# BFAOS V2 — Phase 4.5: Founder-Directed Bounded Execution — Completion Report

**Date:** 2026-11-18 · **Branch:** `feat/phase45-preview-concurrency` · **Commit:** `e9dff89573c464142020d7792eb9f7d8b12d76a0` · **Status:** Complete

---

## 1. Founder decisions and exact scope

| Decision | Status | Scope in this phase |
|---|---|---|
| D-08 | **REVISE** — not approved for implementation | Revised decision brief created (no implementation) |
| D-09 | **INVESTIGATE** — no storage implementation authorized | Architecture investigation brief created (no schema/data changes) |
| Preview deployment concurrency | **APPROVED** (preview only) | Serialization + build-identity verification implemented |

**Hard boundary honored:** No PR merged, no production-triggering branch pushed, no production deployment initiated.

---

## 2. Starting-state inventory and evidence freshness

| Item | Value | Freshness |
|---|---|---|
| Protected checkout | `feat/visual-learning-batch @ 6d40870e` (PR #62's branch) | freshly verified via local git |
| Local `master` | `5f61a802` (behind remote, untouched) | freshly verified |
| Remote `origin/master` | `98388ddb` | freshly verified via `git ls-remote` |
| PR #69 `feat/bfaos-phase4-contracts` | `f82bda53` | freshly verified |
| PR #70 `feat/bfaos-phase4-test-harnesses` | `735f3c6c` | freshly verified |
| PR #71 `feat/bhavya-product-quality` | `97e6b632` | freshly verified |
| All worktrees | clean (only `.husky/_/` artifact) | freshly verified |
| Stashes | 5 stashes preserved (WIP + lint-staged backups) | freshly verified |
| Production worker `bhavya-foundation` | `953f06bb` (2026-10-30) | previously reported (Nov 15), **not reverified** — GitHub/Cloudflare API tooling unavailable in this session |
| Preview worker | overwritten on every deployment | previously reported (Nov 15 re-check: `/api/build-identity` returns 404) — **not reverified** — remote tooling unavailable |

**Missing capability:** GitHub and Cloudflare API tools are no longer available in this session; remote CI status, PR comments, and live deployment checks could not be re-completed. These are marked "not reverified / blocked-unavailable" above. No remote status was invented or simulated.

---

## 3. D-08 revised options and recommendation — explicitly not implemented

**Deliverable:** `docs/bfaos-v2/execution/14-d-08-revised-execution-state-retry.md`

**Key findings:**
- The repository has **four distinct vocabularies**, not one: `ExecutionState` (7 states), `WorkflowStatus` (6), `StepStatus` (6), `TaskStatus` (6), `EventStatus` (5), plus `ArtifactStatus` (12). The earlier six-state proposal collapsed them; this brief does not.
- Mission Control domain model is ADR-pending; there is **no `Job` type or job-status transition table** in the codebase.
- Current retry/idempotency: idempotency keys have 3 statuses (`pending`/`completed`/`failed`), 1-hour TTL, file-based storage in `.kernel/idempotency/`, **no max-attempt enforcement**, **no backoff**, **no TTL-based recovery**. `shouldExecute()` allows infinite retry of `failed` keys and blocks forever on `pending` keys left by a dead runner.
- `ReplayEngine.replay()` increments `retryCount` but has no terminal-state guard (can replay a `completed` execution). `resume()` sets `running` without incrementing `retryCount`.

**Alternatives:**
- **Option A (minimum-change, recommended):** Use existing `ExecutionState` + `DecisionAction`; add max-attempt guard using `ExecutionContext.maxRetries` and TTL-based recovery for expired `pending` keys. No state-value changes, no new tables.
- **Option B (unified `JobStatus`):** New vocabulary + explicit transition table owned by Mission Control. Higher risk, no owner (Mission Control ADR-pending).

**Recommendation:** Option A (minimum-change). Evidence supports it: the gap is enforcement, not vocabulary.

**Not implemented.** No production logic, database schema, persisted state, or runtime behaviour modified.

---

## 4. D-09 architecture findings and recommendation — explicitly not implemented

**Deliverable:** `docs/bfaos-v2/execution/15-d-09-database-checkpoint-investigation.md`

**Key findings:**
- All four app domains (`ai-institute`, `github-os`, `social-os`, `ioc`) resolve to the **same SQLite file** `packages/database/data/bhavya.db` in development (`packages/database/src/registry.ts`). Only `ai-institute` has a production override via `TURSO_DATABASE_URL` (→ Turso/`@libsql/client`).
- Migration runner (`migrate.ts`): per-directory migrations, `_migrations` ledger (`id`, `name`, `checksum`, `applied_at`), SHA-256 checksum drift detection, transactional per-migration apply.
- **Current dev-db state** (read-only): 4 baseline rows, all applied 2026-09-08. `ioc/002` and `ai-institute/002–007` exist in source but not applied.
- **Checkpoint gaps:** No database table for checkpoints, no retention policy, no recovery procedure, idempotency is file-based (`.kernel/idempotency/`) — a potential second source of truth if checkpoints go in the DB.

**Recommendation (if D-09 approved):** New `_checkpoints` table in `bhavya.db` via a new migration (`ioc/003_checkpoints`), following the existing `migrate()` runner: SHA-256 payload checksum, version gate, transactional write, WAL mode + `busy_timeout=5000` (already configured). Reuses tested infra, zero new cost, single database.

**Not implemented.** No schema edits, no migrations, no database writes, `bhavya.db` preserved byte-for-byte (782,336 bytes, unmodified working tree).

---

## 5. Preview concurrency design and changed files

**Design:**
- Single shared concurrency group `opennext-preview-shared-worker` across the only workflow that deploys to `bhavya-foundation-preview` (`opennext-preview.yml`), replacing the per-PR group that allowed concurrent PR deployments to overwrite each other.
- `cancel-in-progress: false` — never interrupt an in-progress deployment of the shared worker; pending deployments queue sequentially.
- Deploy job declares `outputs` (url, commit); `Record preview URL` step given `id: record-preview`.
- New `verify-preview-identity` job (`needs: deploy`, `if: always()`): queries `GET /api/build-identity`, retries 10× for transient propagation delay, fails on 404/non-200/malformed/missing-commit/commit-mismatch. Never reports success based only on a successful deployment command.

**Changed files:**
| File | Change |
|---|---|
| `.github/workflows/opennext-preview.yml` | shared concurrency group, no cancel, deploy outputs, verify-preview-identity job |
| `scripts/validate-preview-concurrency.mjs` | static validation that all preview-deploy workflows use the shared group |
| `apps/ai-institute/src/lib/__tests__/preview-concurrency.test.ts` | vitest test wrapping the validation script |
| `docs/bfaos-v2/execution/14-d-08-...md` | D-08 revised brief |
| `docs/bfaos-v2/execution/15-d-09-...md` | D-09 investigation brief |
| `docs/bfaos-v2/execution/16-pr69-pr70-dependency-reconciliation.md` | #69/#70 dependency report |

**Safety:** Preview target only (`bhavya-foundation-preview`). Production worker, triggers, secrets, and workflows untouched. No `opennext-build-verify.yml` / `deploy-cloudflare.yml` / `deploy.yml` changes.

---

## 6. Preview deployment and identity verification evidence — blocker documented

**Local validation (VERIFIED):**
- Workflow YAML parses (validated programmatically).
- Concurrency group = `opennext-preview-shared-worker`, `cancel-in-progress: false`.
- `scripts/validate-preview-concurrency.mjs`: **PASS** (1 preview-deploy workflow, shared group, no cancel).
- Vitest `preview-concurrency.test.ts`: **1/1 pass**.
- tsc typecheck: **not runnable** — the isolated worktree has no `node_modules/@types` (environmental, not a code defect); the vitest test exercises the validation code path and passes.

**Remote verification — BLOCKED:**
- GitHub Actions remote run, preview deployment, and `GET /api/build-identity` verification could not be completed: GitHub/Cloudflare API tooling unavailable in this session.
- The identity endpoint was last verified live on 2026-11-15 (returned commit `1d727b7b`, the merge ref of #71 into master), but a re-check on 2026-11-18 returned HTTP 404 — another deployment had overwritten the shared preview. This is precisely the risk the serialization addresses, but it **cannot be re-verified remotely in this session**.
- Per the phase requirements: if preview credentials/workflow permissions/GitHub access are unavailable, complete local validation and report the remote blocker. **Done.**

**Preview identity verification cannot be claimed as passed** without a live preview deployment. The mechanism is implemented and statically validated; remote execution requires founder to trigger the preview workflow.

---

## 7. Public/private cache-policy observations

No changes were made to cache policy in this phase. The R-15 policy from Phase 4.3 remains in effect on PR #71's branch (`revalidate = 300`, `expireTime = 900` → `s-maxage=300, stale-while-revalidate=600`), verified live on 2026-11-15:
- `/`: `Cache-Control: s-maxage=300, stale-while-revalidate=600`, `x-nextjs-cache: MISS`
- `/api/health`: `private, no-store`
- `/dashboard`: 307 → sign-in
- `/os`: `private, no-cache, no-store, max-age=0, must-revalidate`

Nothing caches the ISR response today (no KV/R2/D1 binding on the worker), so the cache policy has no runtime effect until a cache binding/rule is deliberately enabled.

---

## 8. PR #69/#70 dependency findings

**Deliverable:** `docs/bfaos-v2/execution/16-pr69-pr70-dependency-reconciliation.md`

| Finding | Evidence |
|---|---|
| #70 is based on an **older #69 head** | merge-base(#70 HEAD `735f3c6c`, #69 HEAD `f82bda53`) = `ad50a57e`, which is #70's second parent |
| #69 has 8 commits NOT in #70 | `7bb43373` → `f82bda53`, all `docs/bfaos-v2/execution/*.md` |
| #70's diff is 10 files, all in `packages/kernel/src/__tests__/` | verified via `git diff` |
| No textual conflict | #69's missing commits touch docs; #70 touches kernel tests |
| #70 must merge after #69 | #70's branch needs #69's newer commits incorporated first |

**No action taken:** no rebase, force-push, retarget, merge, or close of either PR. PR #62 (`feat/visual-learning-batch`, protected checkout) untouched.

---

## 9. Tests, commands, results, and exact commit SHAs

| Command | Result |
|---|---|
| `scripts/validate-preview-concurrency.mjs` | PASS |
| `vitest run apps/ai-institute/src/lib/__tests__/preview-concurrency.test.ts` | 1/1 pass |
| YAML syntax validation of `opennext-preview.yml` | VALID |
| markdown structure check (`check-markdown.py` on `docs/bfaos-v2/execution/`) | 3 files, 0 structural issues |
| `pnpm antislop` | PASS |

**Commit SHA:** `e9dff89573c464142020d7792eb9f7d8b12d76a0` (tree `d054e536821de97ea6cdd13f050279b8cf82158e`), pushed to origin as `feat/phase45-preview-concurrency`.

---

## 10. Independent review status and findings

**Independent review was not obtained.** The subagent review capability hit the free model-provider usage limit (as in Phase 4.3/4.4). The §5 verification was performed inline by the author — this is **not** labeled as an independent review.

Findings preserved: medium/low findings are documented in the D-08/D-09 briefs (unresolved questions, trade-offs, risks). No critical/high findings from code review (none were found; the only blocker is the remote verification limitation, documented in §6).

---

## 11. Files changed and files deliberately left untouched

**Changed (6 staged files):**
1. `.github/workflows/opennext-preview.yml`
2. `scripts/validate-preview-concurrency.mjs`
3. `apps/ai-institute/src/lib/__tests__/preview-concurrency.test.ts`
4. `docs/bfaos-v2/execution/14-d-08-revised-execution-state-retry.md`
5. `docs/bfaos-v2/execution/15-d-09-database-checkpoint-investigation.md`
6. `docs/bfaos-v2/execution/16-pr69-pr70-dependency-reconciliation.md`

**Deliberately untouched:**
- `packages/database/data/bhavya.db` — preserved byte-for-byte (782,336 bytes, unmodified working tree)
- Production worker configuration, deploy-cloudflare.yml, deploy.yml — untouched
- PR #62 (`feat/visual-learning-batch` protected checkout) — untouched
- All other PRs (#63–#71) — no modifications
- Stashes, untracked files, other worktrees — preserved
- No database file, secret, token, environment file, or user evidence staged (explicit file staging only, no `git add .`)

---

## 12. Production-safety attestation

- ✅ No PR merged
- ✅ No production-triggering branch pushed
- ✅ No production deployment initiated
- ✅ No production database accessed
- ✅ No schema migration or database write performed
- ✅ No authentication, authorization, or learner-data changes
- ✅ No credential, secret, permission, or billing changes
- ✅ No paid services
- ✅ No destructive Git operations, force push, or history rewrite
- ✅ No modifications to protected worktrees or `.opencode/`

---

## 13. Remaining risks, founder decisions needed, and proposed next bounded phase

**Remaining risks:**
1. **Remote preview verification uncompleted** — GitHub/Cloudflare API tooling unavailable; `verify-preview-identity` job untested against a live preview. The preview identity endpoint was last verified live on 2026-11-15, then returned 404 on 2026-11-18 (preview overwritten by another deployment).
2. **Independent review not obtained** — inline review only, not labeled independent.
3. **#70 depends on #69** — #70's branch is based on an older #69 head; must merge after #69.
4. **tsc typecheck not run** in isolated worktree (no `@types`) — environmental.

**Founder decisions needed:**
- Approve or revise the D-08 minimum-change recommendation (Option A) before any kernel→Mission Control wiring.
- Approve or revise the D-09 `_checkpoints` table recommendation before any checkpoint implementation.
- Trigger the preview workflow to exercise `verify-preview-identity` against a live preview (remote verification).
- Confirm merge order: #62 first (CI font-flake repair), then #63, #64/#65, #66→#67→#68→#69, #70, #71.

**Proposed next bounded phase:** Remote preview verification — run `opennext-preview.yml` on `feat/phase45-preview-concurrency`, query `/api/build-identity`, confirm it reports commit `e9dff895` (or the merge ref) with `Cache-Control: no-store`, and verify public/private cache headers. This requires GitHub Actions access and is preview-only.
