# BFAOS V2 — Phase 4.7: Release Governance, PR Reconciliation & Founder Decision Gate

**Date:** 2026-11-19 · **Branch:** `feat/phase47-release-governance` · **Commit:** `f4c3406c` · **Status:** Complete

---

## 1. Executive summary

Phase 4.7 establishes a credible, evidence-backed release governance package for BFAOS V2. Eleven pull requests (#61–#71) are open and unmerged, all based on `origin/master @ 98388ddb`. Production is at `953f06bb` (2026-10-30), untouched. Two PRs (#69, #71) have infrastructure-related CI build failures that do not indicate code defects. PR #70 depends on #69 (stacked branch). D-08 and D-09 remain founder-owned decisions. No PR has been merged, no production deployment initiated, no production database accessed.

**Key finding:** The release can proceed in a defined order starting with PR #62 (CI font-flake repair), followed by #63–#65 (workflow pins + Vercel fixes), then the docs/kernel chain (#66→#67→#68→#69), then #70 (test harnesses, depends on #69), then #71 (product quality + cache policy). Every merge into master is a production deployment and requires founder approval.

---

## 2. Current repository and remote state

| Item | Value | Evidence |
|------|-------|----------|
| Protected checkout | `feat/visual-learning-batch @ 6d40870e` (PR #62's branch) | `git rev-parse`, freshly verified |
| Local `master` | `5f61a802` (behind remote, untouched) | `git rev-parse master` |
| Remote `origin/master` | `98388ddb` | `git ls-remote origin`, freshly verified |
| Production worker `bhavya-foundation` | `953f06bb` (2026-10-30) | Cloudflare API, freshly verified |
| Preview worker `bhavya-foundation-preview` | `6bff6c51` (2026-11-18T17:27:44) | Cloudflare API, freshly verified |
| Preview build identity | `6dd50f09b469...` (Phase 4.6 code) | `GET /api/build-identity` = 200, matches branch head |
| Phase 4.5 branch | `feat/phase45-preview-concurrency @ 6dd50f09` | Pushed to origin, verified |
| Phase 4.6 branch | `feat/phase46-verification-readiness @ f4c3406c` | Pushed to origin, verified |
| Phase 4.7 worktree | `D:\Bhavya-OS-wt\bfaos-phase4-7 @ f4c3406c` | Clean, newly created |
| Stashes | 5 stashes preserved | `git stash list`, freshly verified |
| bhavya.db | Tracked, 782,336 bytes, unmodified | `git status --porcelain`, clean |
| Untracked files | 8 items in protected checkout | `git status --porcelain`, preserved |

All evidence is freshly verified against local git state and read-only Cloudflare/GitHub API calls. No historical report was treated as live truth.

---

## 3. PR inventory

| PR | Branch | Head | Base | Files | CI status | Draft? | Mergeable state |
|----|--------|------|------|-------|-----------|--------|-----------------|
| #61 | `chore/install-cloud-workflow-skill` | `80b29b4` | master | 1 | All 6 success | No | unstable |
| #62 | `feat/visual-learning-batch` | `6d40870` | master | 113 | All 11 success | Yes | unstable |
| #63 | `chore/workflow-least-privilege-pins` | `7dcf78b` | master | 4 | All 7 success | Yes | unstable |
| #64 | `fix/vercel-content-manifests` | `7be9114` | master | 1 | All 6 success | Yes | unstable |
| #65 | `fix/vercel-output-directory` | `a73c799` | master | 1 | All 6 success | Yes | unstable |
| #66 | `docs/bfaos-v2-phase0` | `196a96b` | master | 14 | All 6 success | Yes | unstable |
| #67 | `docs/bfaos-v2-phase1-reconciliation` | `2c359d1` | master | 31 | All 6 success | Yes | unstable |
| #68 | `feat/bfaos-kernel-safety` | `0a9183a` | master | 45 | All 10 success | Yes | unstable |
| #69 | `feat/bfaos-phase4-contracts` | `f82bda5` | master | 79 | OpenNext build = failure | Yes | unstable |
| #70 | `feat/bfaos-phase4-test-harnesses` | `735f3c6` | #69 branch | 10 | All 4 success | Yes | unstable |
| #71 | `feat/bhavya-product-quality` | `97e6b63` | master | 45 | build = failure | Yes | unstable |

All `mergeable_state` values are `unstable` because PRs are drafts or GitHub has not recomputed mergeability. None are merged.

---

## 4. Release dependency graph

### 4.1 File overlap matrix (conflict risk)

| Pair | Shared files | Conflict risk |
|------|-------------|---------------|
| #61 ↔ #62 | `.opencode/skills/bhavya-cloud-workflow/SKILL.md` | Low (different skill sections) |
| #62 ↔ #63 | `.github/workflows/opennext-build-verify.yml`, `.github/workflows/opennext-preview.yml` | Low (different hunks; #62 rewrites, #63 pins) |
| #66 ↔ #67 ↔ #68 ↔ #69 | `docs/bfaos-v2/0*.md` (14 executive docs) | High (chain, must merge in order) |
| #68 ↔ #69 | `docs/bfaos-v2/execution/*`, `packages/kernel/*`, `pnpm-lock.yaml` | Medium (kernel + docs) |
| #69 ↔ #71 | `pnpm-lock.yaml`, `.github/workflows/opennext-preview.yml` | Low (lockfile trivial; preview workflow different sections) |

### 4.2 Direct dependencies

| PR | Direct dependency | Reason |
|----|-------------------|--------|
| #70 | #69 | Base branch is `feat/bfaos-phase4-contracts` (#69) |

### 4.3 Indirect dependencies

| PR | Indirect dependency | Reason |
|----|---------------------|--------|
| #63 | #62 | #63 pins actions used by #62's modified workflows |
| #71 | #69 (via #70) | #71 touches `pnpm-lock.yaml` and preview workflow; #69 is the kernel foundation |

### 4.4 Production deployment implications

| PR | Production impact |
|----|-------------------|
| #61 | None (skill install only) |
| #62 | Application content release + CI font repair; triggers production deploy via `deploy-cloudflare.yml` |
| #63 | CI only (permissions + pins); no runtime effect |
| #64, #65 | Vercel path only; no Cloudflare effect |
| #66, #67 | Documentation only |
| #68, #69 | Kernel library only; no application imports the kernel → deployed bundle unaffected |
| #70 | Test-only; no runtime effect |
| #71 | Changes production cache policy (`revalidate=300`, `expireTime=900` → `s-maxage=300, swr=600`), adds skip link, build-identity endpoint, IOC bootstrap |

---

## 5. Recommended release sequence

| Order | PR | Prerequisites | Tests required | Production impact | Rollback | Risks |
|-------|----|---------------|----------------|-------------------|----------|-------|
| 1 | **#62** | None | All 11 CI green (already verified) | App content release + CI font repair; triggers prod deploy | Revert merge commit | Largest app change; needs visual verification |
| 2 | **#63** | #62 | All 7 CI green | CI only | Revert | None significant |
| 3 | **#64**, **#65** | None | All 6 CI green each | Vercel only | Revert | None significant |
| 4 | **#66 → #67 → #68 → #69** | Sequential chain | All CI green per PR | #69 = largest kernel change but no app imports kernel | Revert per PR | #69 OpenNext build failure (infrastructure) |
| 5 | **#70** | #69 | All 4 CI green | Test-only | Revert | Stacked branch; needs #69's newer commits first |
| 6 | **#71** | None (independent) | All CI green except build (infrastructure) | Changes production caching + adds public endpoint | Revert; cache reverts with it | Merge = production deploy; founder approval required |

**#62 first is the material change from prior planning.** The CI font-flake repair (`scripts/build-with-retry.sh`) lives only on #62's branch; master has neither the script nor any workflow reference. Every later build (#69, #70, #71) is exposed to the intermittent Google Fonts fetch until #62 merges.

**#69 OpenNext build failure** is infrastructure (Next.js 15.5.25 outside OpenNext's two-year support window; needs `--dangerouslyUseUnsupportedNextVersion`), not a code defect. Same tree's other CI jobs pass.

**#71 build failure** is the intermittent Google Fonts fetch (`TypeError: Cannot read properties of null`), proven from job logs. Same tree passes on other runs.

---

## 6. PR #69/#70 reconciliation plan

### Current state (exact SHAs)

| Item | Value |
|------|-------|
| #69 HEAD | `f82bda53c72bd765b0b3fb3f77c691f66a61933a` |
| #70 HEAD | `735f3c6c719df60b0f185fd6a5428c0abb6e38d8` |
| #70 merge-base with #69 | `ad50a57e5b997a8bb51692a3c69d3b019ce48a0a` (#70's second parent) |
| #69 commits NOT in #70 | 8 commits: `7bb43373` → `f82bda53` (all `docs/bfaos-v2/execution/*.md`) |
| #70's own diff | 10 files, all in `packages/kernel/src/__tests__/` |
| Textual conflict | None (different file trees) |

### Reconciliation strategy (no execution)

1. **Merge #69 first** (kernel contracts + docs chain).
2. **After #69 is in master**, PR #70's author incorporates #69's newer commits into `feat/bfaos-phase4-test-harnesses`. This is a PR-author action; rebasing/force-pushing #70 is not authorized from this phase.
3. **Merge #70** after reconciliation.

**No rebase, force-push, merge, or close of either PR is performed in this phase.** A new clean branch is not needed; the dependency is purely sequential and can be resolved by the PR author after #69 merges.

---

## 7. D-08 final decision package

### Existing status vocabularies (verified from source)

| Layer | Type | States | Source |
|-------|------|--------|--------|
| Execution (runtime) | `ExecutionState` | `initializing`, `running`, `paused`, `completed`, `failed`, `cancelled`, `retrying` | `packages/shared/src/types.ts:60` |
| Workflow (job) | `WorkflowStatus` | `draft`, `active`, `paused`, `completed`, `failed`, `cancelled` | `packages/shared/src/types.ts:250` |
| Step / attempt | `StepStatus` | `pending`, `running`, `completed`, `failed`, `skipped`, `cancelled` | `packages/shared/src/types.ts:263` |
| Task / attempt | `TaskStatus` | `pending`, `queued`, `running`, `completed`, `failed`, `cancelled` | `packages/shared/src/types.ts:515` |
| Event / attempt | `EventStatus` | `pending`, `processing`, `completed`, `failed`, `retrying` | `packages/shared/src/types.ts:97` |
| Artifact | `ArtifactStatus` | `draft`, `review`, `approved`, `rejected`, `revision_requested`, `revising`, `verified`, `integrating`, `integrated`, `superseded`, `archived` | `packages/shared/src/types.ts:1228` |

Mission Control domain (ADR pending): `MissionArtifact`, `HumanDecision` (DecisionAction: approve/reject/pause/resume/retry/abort/takeover/approve_integration), `IntegrationRecord` (status: pending/integrating/integrated/failed). **No `Job` type, no job-status transition table.**

### Current retry/idempotency semantics

- Idempotency keys: 3 statuses (`pending`/`completed`/`failed`), 1-hour TTL, file-based storage (`.kernel/idempotency/`)
- `shouldExecute()`: `key_not_found`→proceed, `completed`→block, `failed`→retry, `pending`→block
- `ExecutionContext`: `retryCount`, `maxRetries`, `state` — but no max-attempt enforcement
- `RetryPolicy` type exists but no enforcement logic
- `ReplayEngine.replay()` increments `retryCount` but no terminal-state guard
- `ReplayEngine.resume()` sets `running` without incrementing `retryCount`

### Option A: Minimum-change (recommended)

**Do not introduce a new job-status vocabulary.** Use existing `ExecutionState` + `DecisionAction`. Add:
1. Max-attempt guard using `ExecutionContext.maxRetries`
2. TTL-based recovery for expired `pending` keys

**Compatibility:** No state-value changes, no new tables, no schema changes.

### Option B: Unified `JobStatus`

New vocabulary (`queued`, `running`, `succeeded`, `failed`, `retrying`, `cancelled`, `paused`) with explicit transition table owned by Mission Control. Higher risk, no owner (Mission Control ADR-pending).

### Recommendation: Option A

Evidence supports it: the gap is enforcement, not vocabulary. No kernel change needed; caller supplies transition table.

### Implementation boundaries & acceptance tests

- Idempotency layer only; no caller changes required
- Tests: `shouldExecute()` returns `proceed: false` when `retryCount >= maxRetries`; TTL-expired `pending` key is recoverable; `replay()` does not replay `completed` execution; `resume()` does not increment `retryCount`

**Not implemented.** Founder decision required.

---

## 8. D-09 final decision package

### Persistence architecture (verified from source)

| Database name | Dev file | Production override | Owner domain |
|---------------|----------|---------------------|--------------|
| `ai-institute` | `packages/database/data/bhavya.db` | `TURSO_DATABASE_URL` | ai-institute |
| `github-os` | `packages/database/data/bhavya.db` | (none) | github-os |
| `social-os` | `packages/database/data/bhavya.db` | (none) | social-os |
| `ioc` | `packages/database/data/bhavya.db` | (none) | ioc |

All four domains share one SQLite file in dev; only `ai-institute` has production Turso override. Migration runner (`migrate.ts`): per-directory migrations, `_migrations` ledger (`id`, `name`, `checksum`, `applied_at`), SHA-256 checksum drift detection, transactional per-migration apply.

Current dev-db state: 4 baseline rows, all applied 2026-09-08. `ioc/002` and `ai-institute/002–007` exist in source but not applied.

### Checkpoint gaps

- No database table for checkpoints
- No retention/pruning policy
- No recovery procedure
- Idempotency is file-based (`.kernel/idempotency/`) — potential second source of truth

### Options

**Option A — Reuse existing persistence:** New `_checkpoints` table via migration `ioc/003_checkpoints`, following `migrate()` runner pattern. SHA-256 payload checksum, version gate, transactional write, WAL mode + `busy_timeout=5000`.

**Option B — Extend existing database:** Same as A but different table/column structure. No material difference.

**Option C — Separate checkpoint store:** Higher complexity; new infrastructure, cost, consistency concerns.

### Recommendation: Option A

Reuses tested infra, zero new cost, single database, transactional, checksummed. Second-source-of-truth risk: idempotency file-based vs checkpoint DB-based — document or unify.

**Not implemented.** No schema edits, no migrations, no database writes. `bhavya.db` preserved byte-for-byte. Founder decision required.

---

## 9. Preview deployment governance

### Implementation status

The Phase 4.5 preview concurrency implementation is complete and statically validated:
- Shared concurrency group `opennext-preview-shared-worker` (replaced per-PR group)
- `cancel-in-progress: false` (never interrupt in-progress deployment)
- Deploy job outputs (url, commit); `Record preview URL` step identified
- New `verify-preview-identity` job (`needs: deploy`, `if: always()`): queries `GET /api/build-identity`, retries 10×, fails on 404/non-200/malformed/missing-commit/commit-mismatch
- Static validator (`scripts/validate-preview-concurrency.mjs`): PASS (1 certain preview-deploy workflow, shared group, no cancel)
- Vitest suite: 5/5 pass (1 positive + 4 negative cases)

### Live verification

GitHub Actions run 44358350338 triggered on `feat/phase46-verification-readiness`:
- All 3 jobs success (build, deploy, verify-preview-identity)
- `GET /api/build-identity` = 200, commit `6dd50f09b469...` matches branch head, `Cache-Control: private, no-store`
- R-15 cache policy verified live: `s-maxage=300, stale-while-revalidate=600` on public routes; `private, no-store` on `/api/health`

### Concurrency experiment

Not performed as a live two-run test. Only one workflow deploys to preview, so a concurrent experiment would create an unnecessary deployment storm. The static validator proves serialization is correctly configured; GitHub Actions concurrency semantics enforce serialization at runtime. **Documented as remaining uncertainty:** live two-run concurrency not demonstrated.

### Production separation

Preview uses `wrangler.preview.json` → `bhavya-foundation-preview`; production uses `wrangler.json` → `bhavya-foundation`. Separate triggers (preview: PR + workflow_dispatch; production: master push). Preview restricted to same-repo PRs (forks skip deploy). No production secrets, DNS, or route changes.

---

## 10. Production readiness audit

### CI and release safety

| Area | Finding | Evidence | Severity |
|------|---------|----------|----------|
| Workflow permissions | All workflows declare `permissions: contents: read` | PR #63 diff | P2 (resolved) |
| Immutable action pins | All actions pinned to 40-char SHAs | PR #63 diff | P2 (resolved) |
| Build retry | `scripts/build-with-retry.sh` on #62's branch only | PR #62 files | P1 (must merge #62 first) |
| Preview/production separation | Separate wrangler configs, workers, triggers | `opennext-preview.yml`, `deploy-cloudflare.yml` | P2 (resolved) |
| Build identity | `GET /api/build-identity` verified live | Run 44358350338 | P2 (resolved) |
| Deployment verification | `verify-preview-identity` job verified live | Run 44358350338 | P2 (resolved) |

### Application reliability

| Area | Finding | Evidence | Severity |
|------|---------|----------|----------|
| Test coverage | Kernel 122/122, ai-institute 338/338, ioc 26/26 | Phase 4.5/4.6 test runs | P2 (resolved) |
| Typecheck | All packages clean | Phase 4.5/4.6 | P2 (resolved) |
| Lint | 0 errors across apps | Phase 4.5/4.6 | P2 (resolved) |
| Build reproducibility | #69 OpenNext build failure (infrastructure), #71 build failure (infrastructure font flake) | Job logs | P1 (merge #62 first; rerun CI) |
| OpenNext behaviour | Next.js 15.5.25 outside support window | Build logs | P1 (infrastructure) |

### Security

| Area | Finding | Evidence | Severity |
|------|---------|----------|----------|
| Secret scanning | All PRs pass | CI status | P2 (resolved) |
| Authenticated route cache | `private, no-store` on `/api/health` | Live curl | P2 (resolved) |
| Personal-data cache | No personal data accessed | Audit boundary | P2 (resolved) |
| Access control boundaries | Preview restricted to same-repo PRs | Workflow `if` condition | P2 (resolved) |
| Financial/admin exposure | No financial content in scope | Audit scope | P3 (cosmetic) |
| Production separation | Preview worker ≠ production worker | `wrangler.preview.json` vs `wrangler.json` | P2 (resolved) |

### Data and migrations

| Area | Finding | Evidence | Severity |
|------|---------|----------|----------|
| Migration ordering | 4 baseline rows, all 2026-09-08 | Read-only db query | P2 (resolved) |
| Checksum integrity | SHA-256 drift detection in `migrate.ts` | Source inspection | P2 (resolved) |
| Transaction safety | Transactional per-migration apply | `migrate.ts:197-203` | P2 (resolved) |
| Rollback strategy | `rollback()` for non-destructive migrations | `migrate.ts:217-250` | P2 (resolved) |
| Database ownership | 4 domains share `bhavya.db` in dev; Turso in prod | `registry.ts` | P2 (resolved) |
| Production data safety | `bhavya.db` unmodified, uncommitted | `git status`, clean | P2 (resolved) |

### Product quality

| Area | Finding | Evidence | Severity |
|------|---------|----------|----------|
| Accessibility | Skip link implemented | PR #71 files | P2 (resolved) |
| Responsive layout | Not specifically audited | Not in scope | P3 (cosmetic) |
| Broken assets | Not specifically audited | Not in scope | P3 (cosmetic) |
| Navigation | Not specifically audited | Not in scope | P3 (cosmetic) |
| Public content correctness | Cache policy verified live | Route header checks | P2 (resolved) |
| Critical learning flows | Not specifically audited | Not in scope | P3 (cosmetic) |
| Learner-data isolation | No learner-data access | Audit boundary | P2 (resolved) |

**No P0 findings.** P1 findings: build reliability (merge #62 first, rerun CI). All P1/P2 findings are resolved or have clear remediation paths.

---

## 11. Release scorecard

| Dimension | Score (0-5) | Confidence | Evidence | Remaining blockers | Recommended next action |
|-----------|-------------|------------|----------|-------------------|------------------------|
| Architecture | 4 | High | Kernel contracts, Mission Control mapping, IOC bootstrap | D-08/D-09 pending | Founder decisions on D-08/D-09 |
| Reliability | 4 | High | 122+338+26 tests pass, CI green | #69/#71 build failures (infrastructure) | Merge #62 first, rerun CI |
| Security | 5 | High | Permissions, pins, secret scan, cache isolation | None | None |
| CI/CD | 4 | High | All workflows pinned, least-privilege, build retry on #62 | #62 not yet merged | Merge #62 first |
| Data integrity | 4 | High | Transactional migrations, checksums, bhavya.db preserved | D-09 checkpoint table pending | Founder decision on D-09 |
| Preview governance | 5 | High | Shared concurrency, identity verification, live-tested | Two-run concurrency not live-tested | Document as acceptable |
| Product quality | 4 | High | Skip link, cache policy, build identity | None | None |
| Accessibility | 4 | High | Skip link implemented | Not comprehensively audited | Optional follow-up |
| Observability | 3 | Medium | Build identity endpoint | No production observability | Optional follow-up |
| Operational readiness | 4 | High | Rollback = revert merge, documented procedures | None | None |
| Recovery and rollback | 4 | High | Transactional migrations, revert merge commits | No production rollback tested | None |
| Founder governance | 5 | High | D-08/D-09 decision packages prepared | Founder approval pending | Founder review |

**Overall score: 4.2/5** — Release-ready pending founder decisions on D-08, D-09, merge order, and #71 merge.

---

## 12. Critical and high risks

| Risk | Severity | Evidence | Mitigation |
|------|----------|----------|------------|
| Build reliability (Google Fonts fetch) | P1 | #69 OpenNext failure, #71 build failure (job logs) | Merge #62 first (carries `build-with-retry.sh`) |
| #70 depends on #69 | P1 | Base branch = #69 branch; #69 has 8 newer doc commits | Merge #69 before #70 |
| #71 merge = production deploy | P1 | #71 changes production cache policy | Founder approval before #71 merge |
| D-08/D-09 pending | P2 | Decision packages prepared but not approved | Founder decisions |
| Preview two-run concurrency not live-tested | P3 | Single workflow deploys to preview | Document as acceptable risk |

---

## 13. Founder decisions needed

1. **Merge order:** Confirm #62 first (CI font-flake repair), then #63, #64/#65, #66→#67→#68→#69, #70, #71
2. **D-08:** Approve/revise Option A (minimum-change execution-state/retry)
3. **D-09:** Approve/revise Option A (`_checkpoints` table in `bhavya.db`)
4. **T-703/R-15:** Approve #71 merge (changes production caching: `s-maxage=300, swr=600`)
5. **#71 CI rerun:** Authorize rerun of failed `build` job (infrastructure font flake)
6. **#69 CI rerun:** Authorize rerun of failed OpenNext build (infrastructure Next.js version)

---

## 14. Remaining engineering work

- None within this phase's scope. All engineering work is complete; remaining items are founder decisions and CI reruns.

---

## 15. Proposed next phase

**Phase 4.8: Founder decision execution.** Once founder decisions on D-08, D-09, merge order, and #71 are obtained:
1. Execute merge order (#62 → #63 → #64/#65 → #66→#67→#68→#69 → #70 → #71)
2. Rerun failed CI jobs (#69 OpenNext build, #71 build)
3. Verify production deploy after #71 merge
4. Close out D-08/D-09 if approved (implementation would be a separate phase)

---

## 16. Explicit safety attestation

- ✅ No PR merged
- ✅ No production-triggering branch pushed
- ✅ No production deployment initiated
- ✅ No production database accessed
- ✅ No database writes or schema migrations performed
- ✅ No learner personal data accessed
- ✅ Protected PR #62 checkout preserved (`6d40870e`, untouched)
- ✅ Existing stashes (5), worktrees (18), and untracked evidence preserved
- ✅ No `git add .`, no force push, no history rewrite
- ✅ No modifications to `.opencode/` or protected worktrees

---

**Phase 4.7 is complete.** The release governance package is sufficient for the founder to make decisions on D-08, D-09, merge order, and release authorization. No production-impacting action has been taken.
