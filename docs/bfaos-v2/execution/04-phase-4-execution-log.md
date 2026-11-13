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
| Tests | 28 cases: policy per code · state mapping · flag derivation · metadata · fail-closed classification · negative validation · version boundaries · **mutation** tests (a flipped flag and a changed code are both rejected) |
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
| Result | Specification typecheck clean · main typecheck clean · lint at the pre-existing baseline (0 errors, 29 warnings) · `pnpm antislop` PASS |

## Phase 4 state

All four tasks are complete and separately committed. An independent review of the Phase 4 commits was
commissioned.

**No control is wired into a production caller.** The replay guard, the contract validator, the
checkpoint contract and the execution-result contract are all available and tested, but nothing in the
deployed application calls them. Wiring is blocked on **D-08** (job status vocabulary) and **D-09**
(artefact storage), and the interface map records why each wiring must be Node-side.

## Next tasks (not started in this window)

- **§6 follow-ups** — migrate the seven legacy kernel harnesses into executable specifications (only
  where their assertions can be preserved); converge the duplicated `sha256` / `canonicalize` helpers
  into `@bhavya/shared`; add a `src/__tests__/README.md` recording that the harnesses are not coverage.
- **§7 product quality** — the accessible skip link, the favicon and the `Cache-Control` policy in
  `apps/ai-institute`, each with a focused regression test. These are application changes in the
  canonical production app and deserve their own increment.
- **Open product findings from Phase 0** — no skip link, a 404 favicon, a one-year CDN cache policy,
  and no tests in seven of the eight applications.
