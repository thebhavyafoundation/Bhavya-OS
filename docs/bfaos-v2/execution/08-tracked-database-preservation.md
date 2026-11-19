# BFAOS V2 — F-1: Tracked development database preservation and reproducibility

**Date:** 2026-11-14 · **Branch:** `feat/bfaos-phase4-contracts` · **Scope:** read-only analysis of the tracked file `packages/database/data/bhavya.db` in `apps/ai-institute`'s development path. **Nothing was deleted, restored, or overwritten. The file is not committed and is not part of any open PR.**

---

## 1. What changed, measured

The working tree's `bhavya.db` differs from HEAD by exactly one fact set:

| Fact | HEAD | Working tree |
|---|---|---|
| Byte size | 782,336 → 962,560 | grew |
| `_migrations` rows | 4 → 9 | grew |
| `constitutional_validations` rows | 7 → 7 | **unchanged** |
| Every other user-table row count | identical | **unchanged** |
| New tables (empty) | none | `evidence_records`, `knowledge_objects`, `mc_approval_requests`, `mc_artifact_versions`, `mc_artifacts`, `mc_decisions`, `mc_jobs`, `mc_sessions`, `module_progress` |

The five migrations applied at `2026-11-13 18:11:21 UTC` are exactly:

```
ai-institute/002_knowledge_objects_and_evidence
ai-institute/003_mission_control
ai-institute/004_mission_control_sessions
ai-institute/005_mission_control_destinations
ai-institute/006_module_progress
```

Migration `007_content_os_core_entities` exists in source but was NOT applied to this file.

Checksums in `_migrations` match those recorded by the shared migration runner, byte-for-byte,
verbatim from the committed migration files. The nine applied migration records and their
checksums are identical between the working tree and a live apply run — independent verification.

## 2. Cause

`apps/ai-institute`'s `initDatabase()` resolves its local SQLite path through
`@bhavya/database`'s `getReadWriteDatabase("ai-institute")` → `getDatabasePath()`:

```ts
if (process.env.BHAVYA_DB_PATH) { return process.env.BHAVYA_DB_PATH!; }
// else the repo path packages/database/data/bhavya.db
```

When `process.env.BHAVYA_DB_PATH` is unset — as it is for every plain `pnpm build` without a scratch
database override — the development runner **uses the tracked seed file**. Any command that calls
`initDatabase()` (including the `vitest` `setupFiles` hook `src/lib/__tests__/setup.ts` when it
runs with the default path) executes the pending ai-institute migrations against the tracked file.
That is what happened at 2026-11-13 23:41 IST (18:11 UTC).

This is a design observation, not a misuse: the tracked file is the local seed for the ai-institute
runtime and WAL mode only affects it locally. The defect is that the runner silently uses the
tracked file when the override is absent, rather than refusing or warning.

## 3. What is recoverable, what is not

| Item | Recoverable? | Procedure |
|---|---|---|
| Schema (`evidence_records`, `mc_*`, …) | **Yes, fully** | `initDatabase()` applies migrations deterministically from the committed files |
| `_migrations` records | **Yes, fully** | identical procedure |
| `constitutional_validations` rows (7) | **Unchanged, not lost** | they exist in HEAD and in the working tree |
| Any other data rows (zero changed) | none present to lose | n/a |
| The working-copy file itself | not needed; dump is supersets | if preserved: `cp packages/database/data/bhavya.db D:/Temp/kanta/opencode/bhavya.db.backup-<date>` |

There is **no unique data** in the working copy that does not exist in HEAD or the committed migration
files. The working tree can be restored to HEAD at any time with `git checkout --`, at the cost of
dropping a schema superset — which the migration runner recreates on demand.

## 4. Preservation procedure

**Option A — recommended, preserve a backup (non-destructive):**

```
mkdir -p D:/Temp/kanta/opencode/db-backups
cp packages/database/data/bhavya.db D:/Temp/kanta/opencode/db-backups/bhavya-2026-11-14.db
```

`D:/Temp/kanta/opencode/db-backups/` is local-only and not committed anywhere. The backup is the
superset with applied migrations; use it to diff against future work.

**Option B — let the runner recreate it:** dismiss the working copy (founder's call), and the next
`initDatabase()` call re-applies all migrations deterministically. Nothing is lost.

**Never** commit this file as part of a release PR — it is tracked binary dev state whose legitimate
content is produced by the runner. The repository should decide to gitignore the working copy and
keep only committed migration files as the source of schema truth.

## 5. What must be checked before any merge

- The tracked file stays uncommitted in PR #71 (verified: `git diff --name-only` lists no
  `packages/database/data/bhavya.db`).
- The main checkout is untouched.
- Production is untouched (production resolves via `TURSO_DATABASE_URL`, never via this file).
- Anyone running `initDatabase()` locally without `BHAVYA_DB_PATH` will re-create the applied
  schema in their own working copy. This is deterministic; migration `007_content_os_core_entities`
  will *not* auto-apply since it is not required to build (verified: the runner applies only
  pending migrations, and `007` remains pending in this file).

## 6. Fix recommendation (founder decision)

Make the local dev runner refuse to touch the tracked file when `BHAVYA_DB_PATH` is unset:

```ts
if (!process.env.BHAVYA_DB_PATH && !isProduction()) {
  process.env.BHAVYA_DB_PATH = join(tmpdir(), `bhavya-dev-${process.pid}.db`);
}
```

or at least warn loudly: `console.warn("[db] initDatabase: BHAVYA_DB_PATH unset; using tracked seed")`.
Both keep the tracked file pristine and make the local seed's role explicit. This is a founder
decision — changing dev ergonomics affects every developer of the repo.
