# BFAOS V2 — Phase 4 Execution Log

**Date:** 2026-11-13 · **Branch:** `feat/bfaos-phase4-contracts` (based on `feat/bfaos-kernel-safety` @ `0a9183ac`)
**Rule applied:** one coherent objective per commit; unrelated work never combined.

---

## T-200 — Idempotency reload defect (Priority A)

| Field | Value |
|---|---|
| Objective | Fix the filesystem-store reload-path TTL defect found and pinned in Phase 3 |
| Defect proof | Two tests failed **before** the change: a reloaded key never expired (`already_in_progress` instead of `key_not_found`), and a legacy ISO-string entry never expired. The persisted `expiresAt` is an ISO string, while the comparison was `new Date() > entry.expiresAt` — the string coerces to `NaN`, so the comparison was always false |
| Implementation | One normalisation helper (`toMillis` / `toDate`) used by `check()`, `cleanup()` and `loadAll()`; persisted entries are restored as `Date` values on load; an unparseable expiry yields "no expiry known", so a corrupt field can never cause a duplicate execution |
| Files changed | `packages/kernel/src/idempotency/index.ts` · `packages/kernel/src/__tests__/idempotency-expiry.spec.ts` (new) · `packages/kernel/src/__tests__/idempotency.spec.ts` (one characterisation test updated to the corrected behaviour) |
| Commit | `4d54526fb61554b9ca0c0fd1424904beaaa5dfaf` |
| Tests | 7 new cases: same-process expiry · **reload expiry (the defect)** · non-expired reload · the one-hour default TTL read from the persisted record · a corrupt expiry retained (fail-safe) · a legacy ISO-string entry expiring normally · concurrent calls not throwing |
| Result | **102/102** kernel specifications pass across 7 files |
| Semantics | Unchanged apart from expiry: the `>` comparison is preserved, no attempt counter was introduced, the retry system was not redesigned, and neither the persistence format nor any schema changed |

## T-201 — Structured execution-result contract (Priority D)

| Field | Value |
|---|---|
| Objective | A small, versioned, typed contract for the outcome of one execution attempt |
| Implementation | `packages/kernel/src/execution/result.ts` — ten stable codes (success, retryable failure, permanent failure, policy denied, approval required, quota paused, cancelled, timeout, interrupted, unknown failure), a single policy table, constructors that derive every flag from it, fail-closed classification, validation that rejects a result whose flags disagree with its code, and an explicit mapping onto the **existing** kernel `ExecutionState` so this is not a second status vocabulary |
| Files changed | `packages/kernel/src/execution/result.ts` (new) · `packages/kernel/src/__tests__/execution-result.spec.ts` (new) · `packages/kernel/src/index.ts` (additive exports only) |
| Commit | `d631c6041a35ce84db8da26e8f17a0961955ceff` |
| Tests | 19 cases at the time of the commit: policy per code · state mapping · flag derivation · metadata · fail-closed classification · negative validation · version boundaries · **mutation** tests (a flipped flag and a changed code are both rejected). Two cases were added later by the review fixes, making 21 |
| Result | 102/102 pass. Mission Control job states and the database schema are untouched; **D-08 remains unresolved** |

## T-202 — Kernel ↔ Mission Control interface map (Priority C)

| Field | Value |
|---|---|
| Deliverable | `docs/bfaos-v2/execution/03-kernel-mission-control-interface-map.md` — kernel modules and exports, Mission Control routes / services / repositories / persistence boundary, a module-to-consumer matrix, **eight compatibility mismatches**, error propagation and retry behaviour, authentication and authorisation boundaries, an interface contract proposal, an eight-item migration risk register, and a table of what is defined versus actually enforced |
| Code | `packages/kernel/src/execution/mission-control-mapping.ts` — a **pure** mapping whose transition table is *supplied by the caller*, so Mission Control keeps sole authority over its own rules and the kernel holds no second copy; 8 tests |
| Files changed | `packages/kernel/src/execution/mission-control-mapping.ts` (new) · `packages/kernel/src/__tests__/mission-control-mapping.spec.ts` (new) · the map document |
| Commit | `3f71e53b875b8c82b542cf74fe3b71137dc89636` |
| Headline findings | **No application depends on the kernel** (`git grep '"@bhavya/kernel"' -- 'apps/*/package.json'` is empty) and the kernel's `node:fs` / `node:crypto` modules cannot run on the Cloudflare edge runtime — so **any wiring must be Node-side** (CI runner or Node service), never inside the edge application. `stopped` and `failed` are terminal in Mission Control while the kernel treats them as resumable, and `queued → failed` is not a legal transition, so several kernel outcomes have **no legal job status today**. These are reported, not worked around |
| Result | The mapping reports an impermissible transition instead of performing or rewriting it |

## T-203 — Specification typechecking and runner proof

| Field | Value |
|---|---|
| Objective | Make "typecheck clean" mean something for the specifications, and prove the runner fails on a broken test |
| Implementation | `packages/kernel/tsconfig.spec.json` (isolated, `include: ["src/**/*.spec.ts"]`) and a `typecheck:spec` script. The seven legacy harness files are deliberately excluded: they were never typechecked and do not typecheck today, so including them would report pre-existing debt rather than this change's state |
| Files changed | `packages/kernel/tsconfig.spec.json` (new) · `packages/kernel/package.json` · three specification files (two typing slips the new configuration exposed) |
| Commit | `816b881fcdbba82139f5b1819c2e0b54c5a988f0` |
| Runner proof | A deliberate failure was injected into a specification: the suite reported **1 failed, 102 passed, exit 1**; after restoring, **102/102 pass** |
| Result | Specification typecheck clean · main typecheck clean · lint at the pre-existing baseline (0 errors, 29 warnings) |

> **Correction.** The `pnpm antislop` PASS recorded against this task was **false at commit
> `28bad837`**: the gate reported two `wall-of-comments` findings in `execution/result.ts` and
> `execution/mission-control-mapping.ts`, which would have failed the `lint-and-typecheck` CI job.
> The two module headers were restructured in `f5343c21` and `650dc40c`, after which the gate passes.
> The claim was recorded before the gate was re-run at that commit.

## Independent review and its resolutions

An independent reviewer examined `4d54526f`, `d631c604`, `3f71e53b` and `816b881f` (plus the
documentation commit `28bad837`), ran the verification commands itself, and returned the verdict
**CONCERNS**: one HIGH, four MEDIUM and ten LOW findings, and an explicit confirmation that the
idempotency defect is genuinely fixed, that nothing is wired into a production caller, and that no
schema, database, authentication, deployment or provider surface was touched.

Every HIGH and MEDIUM finding is resolved. The LOW findings are resolved or explicitly classified
below.

| # | Severity | Finding | Resolution |
|---|---|---|---|
| H1 | HIGH | `pnpm antislop` failed at the reviewed commit — the branch as submitted was CI-red, and the ledger claimed the opposite | **Resolved.** The two module headers were restructured in `f5343c21` and `650dc40c`; the gate passes. The false claim is corrected above and the correction is recorded rather than quietly overwritten |
| M1 | MEDIUM | The fix introduced a **new** silent data-loss path: a `null` entry in `keys.json` threw inside the loader's `try`, aborting the whole load and dropping every key after it, so a completed job could run again | **Resolved** in `c5a90e0b`. Each entry is judged on its own; an entry that cannot be interpreted is kept verbatim on disk and its key is blocked (`corrupt_entry`). Five new cases fail against the previous implementation and pass now |
| M2 | MEDIUM | The exported policy tables were mutable, so a consumer could edit them — and because the constructor and the validator read the same table, they would then agree about a policy that no longer existed | **Resolved** in `3e650a73`. The tables and their entries are frozen, and a test proves a mutation attempt cannot change the policy |
| M3 | MEDIUM | The interface map's consumer matrix was not source-accurate: it listed eight packages as consumers of the kernel modules, but those modules have **zero** external consumers. `packages/cli`, `knowledge-engine` and `search-engine` depend on the kernel without importing it; `packages/shared` does not depend on it at all; the four engines import types only | **Resolved.** §3 now states who imports what, separates runtime consumers from type-only consumers, and records the evidence for each. The risk register's MR4 is re-rated as prospective rather than present |
| M4 | MEDIUM | The map claimed the replay engine "never consults the idempotency store" — it does (`replay/index.ts:59`, `:98`, `:127`, `:141`). What it does not consult is the duplicate *guard* | **Resolved.** §5 now states precisely what the replay engine does and does not consult, with the line references |
| L1 | LOW | Wrong line citations for the `node:fs` / `node:crypto` imports | **Resolved** — `backup/index.ts:4` and `:12`, `checkpoint/index.ts:22` |
| L2 | LOW | A citation made stale by this branch's own change (`idempotency/index.ts:30`) | **Resolved** — now `idempotency/index.ts:104`, verified against the file |
| L3 | LOW | "28 modules" under-counted the directories, and the map implied the barrel exports everything | **Resolved** — 30 module directories, 28 with an `index.ts`, and the two `execution/` modules are named as not re-exported |
| L4 | LOW | The test count for the execution-result contract was wrong (stated 28, actual 19) | **Resolved** above, in the T-201 row |
| L5 | LOW | A self-referential row (`replay/safety.ts` described as importing `replay/safety`) | **Resolved** — the row now states the file has no imports at all |
| L6 | LOW | `typecheck:spec` was not enforced by CI, so a clean typecheck said nothing about the specifications unless a developer remembered to run the extra script | **Resolved** in `3e650a73`. The kernel's `typecheck` script now runs the specification configuration as well, so the repository's own typecheck covers them. Proved by injecting a type error into a specification: the typecheck failed, and passed again once removed |
| L7 | LOW | A timeout mapped onto a terminal execution state although its policy allows another attempt, so a consumer reading only the state could not tell a retryable outcome from a finished one | **Resolved** in `3e650a73`. A timeout maps onto `retrying`, a retryable outcome never maps onto a terminal state, and a test asserts the invariant |
| L8 | LOW | The Mission Control job-status union is re-declared in the kernel, with nothing to stop it drifting | **Resolved.** The union and the transition table now live in one fixture, and a drift guard compares them with the application's own source. The guard is proven: a deliberate change to the fixture fails the specification |
| L9 | LOW | Gaps in the specification coverage: the exact expiry instant, `cleanup()` after a reload, a corrupt entry, a numeric expiry, and a concurrency case that asserted little | **Resolved** in `c5a90e0b` — ten new cases cover all five |
| L10 | LOW | The transition table was copied into the specification file, where it could drift unnoticed | **Resolved** with L8 — the copy lives in one fixture and the drift guard compares it with the application |

### Verification after the review fixes

| Check | Result |
|---|---|
| `pnpm --filter @bhavya/kernel test` | **119/119** across 9 files |
| `pnpm --filter @bhavya/kernel typecheck` (now including the specifications) | clean |
| `pnpm --filter @bhavya/kernel lint` | 0 errors, 29 warnings — the pre-existing baseline |
| `pnpm antislop` | PASS |
| `git diff --check` | clean |

## Phase 4 state

All four tasks are complete and separately committed, and every HIGH and MEDIUM review finding is
resolved.

**No control is wired into a production caller.** The replay guard, the contract validator, the
checkpoint contract and the execution-result contract are all available and tested, but nothing in the
deployed application calls them. Wiring is blocked on **D-08** (job status vocabulary) and **D-09**
(artefact storage), and the interface map records why each wiring must be Node-side.

## Next tasks

- **§6 follow-ups** — the legacy kernel harnesses were migrated in a separate increment
  (`feat/bfaos-phase4-test-harnesses`): four became executable specifications and the three whose
  assertions no longer match the kernel's API are documented as *not* coverage. Still open:
  converge the duplicated `sha256` / `canonicalize` helpers into `@bhavya/shared`.
- **§7 product quality** — the accessible skip link, the favicon and the `Cache-Control` policy in
  `apps/ai-institute`, each with a focused regression test. These are application changes in the
  canonical production app and deserve their own increment.
- **Open product findings from Phase 0** — no skip link, a 404 favicon, a one-year CDN cache policy,
  and no tests in seven of the eight applications.
- **A latent kernel finding, not yet fixed** — the services in `packages/kernel/src/services` declare
  their public `execute()` as `Promise<{ success, result? }>`, but every implementation returns its
  payload under a *named* field, so `result` is never populated. No repository code consumes these
  services today, so the mismatch is latent rather than live; widening ten public signatures is a
  separate change from the harness migration and is recorded rather than folded in.


## Phase 4.3 - release assurance, preview identity and migration governance (2026-11-15)

Note. The Phase 4 review was planned to be re-run by an independent subagent. That run could not
start: the free usage limit for the model provider was reached. The review below was therefore
performed inline by the author of the work, which is weaker evidence than an independent review.
Every claim is labelled with the evidence behind it.

### Repository state (verified)

- PR #69 (kernel contracts), head 070f094 -> 6f8ec07a (release-dependency document only): all nine
  checks green at the new head, including the OpenNext preview deploy.
- PR #70 (harness migration), head 735f3c6, base feat/bfaos-phase4-contracts: all four checks
  green; the stacked diff is still exactly 10 files with no phantom changes from the base.
- PR #71 (product quality), head 85f6645 -> 0399fffc -> c1424454 -> 97e6b632: test, lint-and-typecheck,
  secret-scan, Platform contract, Build preview bundle, OpenNext build and Deploy preview to
  Cloudflare are green at 97e6b632; `build` failed again with the known transient
  `TypeError: Cannot read properties of null (reading '1')` while every other build of the same
  tree succeeded.
- Local `master` (5f61a802) is behind origin/master (98388dd); the protected checkout is on
  feat/visual-learning-batch with untracked user/agent files, untouched. Production worker
  bhavya-foundation is still 953f06bb (2026-10-30); the preview is overwritten on every deploy.

### PR #71 build failures - root causes, both proven from logs

- 37483f4f (20:14Z): TypeError: Cannot read properties of null (reading '1') - the intermittent
  Google Fonts fetch, documented in PR #62's scripts/build-with-retry.sh. Passed unchanged on the
  next push.
- 85f66456 (20:44Z): react/no-children-prop as an **error** in ./src/components/__tests__/skip-link.test.ts.
  Fixed in d4fdb6ef; `npx next lint --dir src` (the rule set the Next build uses) reports 0 errors
  across the app. The app's own eslint does not apply that rule, which is why it was invisible before.
- lint-and-typecheck failed at 0399fffc because the expireTime comment block was fifteen consecutive
  comment lines, rejected by the anti-slop gate. Fixed in c1424454.

### Preview identity (deployed and verified)

The shared preview worker was unverifiable before this work: deployments from different branches
overwrote each other and there was no way to tell which commit was serving.

- GET /api/build-identity now reports the commit and the build time, with Cache-Control: no-store.
  It never caches, discloses nothing beyond the commit and the timestamp, and answers 404 when the
  build recorded nothing (production).
- NEXT_PUBLIC_ variables never reach the server bundle; the value is written into
  src/lib/build-info.generated.ts by apps/ai-institute/scripts/write-build-identity.mjs before the
  build. The preview workflow records GITHUB_SHA, which for a pull_request event is the merge ref.
- Deployed preview verified: HTTP 200 with
  {"commit":"1d727b7be14a14f4105e527cd10d371c9bb9af48",...,"builtAt":"2026-11-15T17:15:44.832Z"},
  and 1d727b7b was confirmed through the GitHub API to be the merge commit of 97e6b632 into
  98388dd, i.e. the current preview serves PR #71's latest code.

### R-15 cache semantics (measured, not assumed)

- Next.js ISR emits s-maxage={revalidate}, stale-while-revalidate={expireTime - revalidate};
  expireTime defaults to one year, yielding stale-while-revalidate=31535700 with revalidate=300.
- Nothing caches the response today: no CF-Cache-Status, no Age, no KV/R2/D1 binding on the
  deployed worker; x-nextjs-cache is MISS.
- expireTime=900 is now pinned in next.config.mjs; the live preview serves
  s-maxage=300, stale-while-revalidate=600 for / with x-nextjs-stale-time=300.
- /api/health is private, no-store; /dashboard redirects to sign-in; /os is private, no-store.
- Three specifications pin the arithmetic and fail when expireTime returns to the Next.js default.

### Migration governance (IOC)

- The ioC mirror now names its source file per migration and is the single list of migrations.
- db-migration-governance.spec.ts fails on missing, extra or mismatched migrations, on ids or
  checksums that the shared runner would not record, and on out-of-order mirrors. Demonstrated by
  planting an unmirrored migration file: the spec failed, then passed once removed.
- Application is atomic and serialised: the ledger is re-read inside an IMMEDIATE transaction, and
  the migration SQL and its ledger row are applied together. Six specifications cover failure
  atomicity, no-op on repeat, second-process serialisation and tampered-checksum refusal.
- apps/ioc/docs/migration-procedure.md records the procedure for adding a migration.
- ai-institute/007_content_os_core_entities is an ai-institute migration, not an IOC one; the pending
  migration sequence on the development database is unchanged, and bhavya.db is unmodified and uncommitted.

### Release decision record (findings preserved)

MEDIUM: (m1) The preview worker belongs to whichever deployment ran last; the build-identity
endpoint is the only reliable way to know. (m2) Nothing caches the ISR pages today, so the cache
policy has no runtime effect until a binding or cache rule is deliberately enabled. (m3) The CI
build still fails intermittently on the Google Fonts fetch; the repair lives in PR #62. (m4) The
independent review of this increment ran inline, not independently.

LOW: (l1) The build-identity endpoint is unauthenticated by design and carries only public facts,
but its presence is now part of the attack surface and should be reviewed with the merge.
(l2) The anti-slop gate counts comment paragraphs as wall-of-comments, which failed the build once;
empty lines are the documented separator.

Verdicts: PR #69 ACCEPT; PR #70 ACCEPT (blocked only by merging after #69); PR #71 ACCEPT WITH
CONCERNS - it must not be described as an unconditional pass; the concerns are (m1)-(m4) and the
fact that merge triggers the production deploy.

### Release order (founder decision; nothing was merged)

#62 (carries the CI font-flake repair) then #63, then #64/#65, then #66 -> #67 -> #68 -> #69,
then #70, then #71. Merging into master is a production deployment; no PR was merged, closed,
retargeted or rebased in this increment.
