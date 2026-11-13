# BFAOS V2 — Verified Implementation Gaps (Priority Zero)

**Date:** 2026-11-13 · **Investigated against:** `master` @ `98388ddb` and the Phase 1 branch
`2c359d13` · **Method:** source inspection only — no production access, no writes.

Every statement below cites a file and line. "Gap confirmed" means the behaviour was read in the
source, not inferred.

---

## GAP A — The decision log has no general writer · **CONFIRMED**

`mc_decisions` accepts twelve actions (`003_mission_control.ts:80`): `approve`, `reject`,
`approve_with_modification`, `request_revision`, `regenerate`, `upload_replacement`, `pause`,
`resume`, `retry`, `abort`, `takeover`, `approve_integration`.

Every write to that table in the repository is a **fixed** action:

| Writer | Action written | Location |
|---|---|---|
| `stopJob` | `abort` / `target_kind='job'` | `sqlite-mission-control-repository.ts:291` |
| `decide()` | `approve` \| `reject` \| `request_revision` (requires an existing approval request) | `…:756` |
| `completeIntegration` | `approve_integration` | `…:953` |

**`pause`, `resume`, `retry` and `takeover` are permitted by the schema and unwritable by the code.**
`endSession(id, "failed")` writes **no** decision at all (`…:994-1004`). The repository interface
(`mission-control-repository.ts:132-299`) exposes no `recordDecision`, `pauseJob`, `resumeJob` or
`failJob`.

**Consequence:** every BFAOS design that records "blocked", "quota-paused", "retried" or "taken over"
through `mc_decisions` is currently unimplementable.

**Disposition: proposal only (founder-gated).** A general writer is a shared repository API change
(`apps/ai-institute`), and the status vocabulary it would express is **D-08**, still open. Not
implemented in this task.

---

## GAP B — Kernel idempotency semantics · **CONFIRMED, CHARACTERISED**

Source: `packages/kernel/src/idempotency/index.ts`.

| Property | Verified behaviour | Location |
|---|---|---|
| Key uniqueness | A `Map` plus `keys.json`; `register` **overwrites** an existing key with no guard | L23-26, L101-110 |
| TTL | Default `3_600_000` ms (1 hour); `check()` **deletes** an expired key and reports `exists:false` | L19, L88-91 |
| Duplicate prevention | `shouldExecute` → `completed` ⇒ refuse (`already_completed`); `pending` ⇒ refuse (`already_in_progress`); `failed` ⇒ allow (`retry_after_failure`); unknown ⇒ allow (`unknown_status`) | L135-152 |
| Concurrent duplicate | A second `register` replaces the first; the in-flight execution's id is lost | L101-110 |
| Re-registration | Overwrites unconditionally — no "already registered" guard | L101-110 |
| Failure handling | `fail()` sets `status='failed'`, `result={error}`, `completedAt` | L124-132 |
| Attempt accounting | **None in the store.** Attempt counting lives in `ExecutionContext.retryCount` (`types/index.ts:90-91`), incremented by the replay engine | L100-152 |
| Persistence | Filesystem map under `<root>/.kernel/idempotency/{keys,records}.json`, rewritten wholesale on every mutation, **no locking and no atomic write** | L26-31, L66-78 |
| Durability across runners | A fresh checkout (a new CI runner) starts with an empty store — the record does not survive | L40-64 |

**Consequence:** `max_attempts` is not enforceable by this mechanism, an abandoned attempt is not a
representable state (`pending` only), and the TTL can silently re-open a *completed* key after an hour.

**Disposition:** characterised and now pinned by executable tests (`packages/kernel/src/__tests__/idempotency.spec.ts`,
10 cases). A behavioural change to the store (explicit `abandoned` status, attempt counter, TTL
policy) would alter shared kernel semantics and is **not** made unilaterally.

---

## GAP C — Replay safety · **CONFIRMED — HIGHEST RISK**

Source: `packages/kernel/src/replay/index.ts`.

`ReplayEngine.replay` (L55-107):

1. restores the context and **forces `state: "running"`** (L67-75);
2. filters the event history to the execution (L78-81);
3. **re-emits every recorded event** through `events.emit` (L85-95), swallowing handler failures
   (`catch {}` — L92-94);
4. writes an execution record and a memory entry (L98-107).

It **never consults** the idempotency ledger, has **no notion** of which events carried an external
side effect, and does not compare any snapshot or hash. A recorded `deploy.completed` event is
therefore re-emitted, and any handler bound to that event type re-executes the deploy.

**Consequence:** replay is safe for observation, unsafe for command execution.

**Disposition: partially closed.** The engine's behaviour is unchanged (it is shared and its callers
are not in scope), but a **fail-closed guard** now exists and is tested:
`packages/kernel/src/replay/safety.ts` classifies actions (`idempotent` / `verifiable` / `unsafe`,
unknown ⇒ unsafe) and refuses replays that include unsafe actions, verifiable actions without
evidence, or any action whose external state is unknown. The hazard itself is pinned by a test that
proves the engine re-emits a recorded deploy event.

**Residual:** the guard must actually be *called* by a caller before replaying. No production caller
was changed (out of scope), so the guarantee is available but not yet applied.

---

## GAP D — Checkpoint persistence · **CONFIRMED**

`mc_artifacts` (`003_mission_control.ts:27-38`) and `mc_artifact_versions` (`:44-57`) have **no
column that stores a document body** — only `path`, `hash`, `note`, `version`, `session_id`,
`parent_version`, `human_replacement`. `createArtifact` writes `path=""` and `hash=""`
(`sqlite-mission-control-repository.ts:322-341`).

**Consequence:** a checkpoint or task contract cannot be *stored* in Mission Control as a body; only
pointed at. Where the pointed-at payload lives is **D-09** (artefact store), which is open, and the
store itself is unverified (B2 access was never proven).

**Disposition: contract defined, storage not chosen.** `packages/kernel/src/checkpoint/index.ts`
defines the payload, the canonical serialisation, the SHA-256 integrity contract and the version
gate — with no schema change and no new storage backend. Ten tests pin the fail-closed behaviour.
Writing it into Mission Control remains blocked on **D-08/D-09**.

---

## GAP E — The kernel's tests never ran · **CONFIRMED, CLOSED**

`packages/kernel/package.json` declared:

```json
"test": "echo \"Kernel tests are custom harnesses — no vitest test blocks\""
```

`turbo test` therefore executed a no-op for the kernel. The package's seven `src/__tests__/*.test.ts`
files export **classes** with a bespoke harness, so they were never executed by any command — and
vitest, if pointed at them, would fail them with "no test suite found".

**Disposition: closed in this task.** The kernel now has `vitest run --passWithNoTests`, a
`vitest.config.ts` that collects only `src/**/*.spec.ts` (so the legacy harness files are left
untouched), and **32 executable specifications** covering idempotency behaviour, replay safety and
checkpoint integrity.

---

## Dependency note for the next task

The kernel's specs import `vitest`, which is **not** a declared dependency of `packages/kernel` — it is
declared by `apps/ai-institute`, `apps/github-os` and `apps/social-os` only, and the root
`package.json` does not declare it. Resolution currently works because pnpm puts the workspace root's
`node_modules/.bin` on `PATH` for package scripts. This is verified to work locally; whether it is
guaranteed in a fresh CI install is under independent review, and the minimal fix (a kernel
devDependency, which changes the lockfile) is **founder-gated** until confirmed.
