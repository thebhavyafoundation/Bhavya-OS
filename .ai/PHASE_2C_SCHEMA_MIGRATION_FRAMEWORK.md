# Phase 2C: Schema Migration Framework

**Commit:** `feat(database): establish schema migration framework`
**Status:** COMPLETE
**Date:** 2026-09-09

---

## What Was Built

A canonical schema migration engine in `@bhavya/database` that provides:

- Named database migration support (ai-institute, github-os, social-os, ioc)
- File-based migration discovery from `packages/database/migrations/<dbName>/`
- Sequence-number ordering (`001_baseline_schema.ts`, `002_add_column.ts`)
- SHA-256 checksum verification (truncated to 16 chars) — detects post-apply drift
- Transactional execution via better-sqlite3 `db.transaction()`
- Rollback support (last migration only)
- Destructive migration flag for explicit opt-in
- Migration status inspection
- CLI entry point for `pnpm db:migrate` / `pnpm db:migrate:status`

## Files Created

| File                                                               | Purpose                                                              |
| ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `packages/database/src/migrate.ts`                                 | Migration engine (rewritten)                                         |
| `packages/database/src/cli.ts`                                     | CLI entry point                                                      |
| `packages/database/src/test-migrate.ts`                            | Test suite (22 tests, all passing)                                   |
| `packages/database/migrations/ai-institute/001_baseline_schema.ts` | Baseline: 4 tables (users, sessions, student_profiles, audit_events) |
| `packages/database/migrations/github-os/001_baseline_schema.ts`    | Baseline: 26 tables (repository intelligence)                        |
| `packages/database/migrations/social-os/001_baseline_schema.ts`    | Baseline: 11 tables (communication operations)                       |
| `packages/database/migrations/ioc/001_baseline_schema.ts`          | Baseline: 11 tables (OKR/risk/compliance)                            |

## Files Modified

| File                             | Change                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `packages/database/src/index.ts` | Added exports: `migrate`, `rollback`, `getMigrationStatus`, `computeChecksum`, `migrateLegacy` |
| `packages/database/package.json` | Added `db:migrate` and `db:migrate:status` scripts, `tsx` devDependency                        |

## Design Decisions

1. **Migrations live in `packages/database/`** — single source of truth, not in app code
2. **Sequence-number ordering** — deterministic, filesystem-independent (`001_`, `002_`, etc.)
3. **Checksum via SHA-256** — detects post-apply modification; truncated to 16 chars for readability
4. **Named database routing** — `DatabaseName` type → `getReadWriteDatabase()` via registry
5. **Transactional execution** — each migration runs in a SQLite transaction for atomicity
6. **`destructive` flag** — migrations with `destructive: true` require explicit opt-in
7. **Legacy `migrateLegacy()`** — backward-compatible for existing ai-institute migration array

## Verification

- **Typecheck:** `pnpm --filter @bhavya/database typecheck` — passes (no errors)
- **Tests:** 22/22 passing (fresh DB init, pending detection, deterministic order, idempotent re-run, checksum verification, destructive flag, rollback)
- **No data modification:** All 4 baseline migrations use `CREATE TABLE IF NOT EXISTS` — safe for existing databases

## Architectural Violations Found

28 total violations across 5 categories:

| Category                                            | Count | Status                |
| --------------------------------------------------- | ----- | --------------------- |
| Direct `new Database()` outside packages/database   | 2     | NEW                   |
| Duplicate migration runners                         | 10    | NEW                   |
| Hardcoded .db paths                                 | 6     | NEW                   |
| Direct better-sqlite3 imports                       | 5     | 2 NEW, 3 PRE-EXISTING |
| Inline schema creation (CREATE TABLE IF NOT EXISTS) | 5     | PRE-EXISTING          |

**Worst offender:** `apps/ai-institute/src/lib/sqlite.ts` — complete parallel database adapter + migration engine introduced in the same commit that added the framework.

**Key risk:** Schema drift between migration files and inline app schemas in github-os (28 tables), social-os (13 tables), ioc (12+4 tables).

## Constraints Respected

- No actual 4-database → 1-database data consolidation performed
- No production data moved or deleted
- No existing database schemas altered
- All baseline migrations are additive (`CREATE TABLE IF NOT EXISTS`)

## Next Phase

**Phase 2D: Migrate app-level database code to use @bhavya/database** — Refactor ai-institute, social-os, github-os, ioc apps to remove duplicate database adapters, inline schema creation, and hardcoded paths. Wire apps to use `migrate(dbName)` from `@bhavya/database` instead of local migration engines.
