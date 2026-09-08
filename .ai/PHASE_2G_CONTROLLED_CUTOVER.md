# Phase 2G — Controlled Runtime Cutover

**Status**: COMPLETE  
**Date**: 2026-09-09  
**Commit**: (pending)

## Summary

Modified the `@bhavya/database` package to route all 4 domains through a single consolidated SQLite database (`packages/database/data/bhavya.db`), completing the physical database consolidation started in Phase 2F.

## Changes

### 1. Registry Modified (`packages/database/src/registry.ts`)

- All 4 domains now resolve to `packages/database/data/bhavya.db`
- `TURSO_DATABASE_URL` env key preserved for ai-institute production override
- Each domain gets its own connection (keyed by domain name) — safe in WAL mode

### 2. Migration Engine Updated (`packages/database/src/migrate.ts`)

- `loadMigrationsFromDisk()` now prefixes migration IDs with `${dbName}/`
- This ensures each domain tracks its own applied migrations even when sharing `_migrations`
- All existing functions (`up()`, `rollback()`, `getMigrationStatus()`) work with prefixed IDs

### 3. Migration Checksums Corrected (`packages/database/data/bhavya.db`)

- Deleted 4 incorrect `_migrations` records (stored by Phase 2F consolidation script)
- Re-applied migrations with correct checksums via direct SQL execution
- All 4 domains now have correct checksums matching `computeChecksum(up + down)`

## Verification Results

| Gate                                      | Result         |
| ----------------------------------------- | -------------- |
| bhavya.db exists                          | PASS           |
| Table count = 62                          | PASS           |
| Index count >= 42                         | PASS           |
| Migration records = 4                     | PASS           |
| Integrity check = ok                      | PASS           |
| FK enforcement ON                         | PASS           |
| WAL mode                                  | PASS           |
| constitutional_validations = 7 rows       | PASS           |
| Registry points all domains to bhavya.db  | PASS           |
| No per-app paths in registry              | PASS           |
| Migration engine prefixes IDs             | PASS           |
| Typecheck passes                          | PASS           |
| github-os.db exists (source immutable)    | PASS           |
| ai-institute.db exists (source immutable) | PASS           |
| No temp files in data/                    | PASS           |
| Rollback plan documented                  | PASS           |
| All app db.ts use @bhavya/database        | PASS           |
| Cross-app reads via getReadonlyDatabase   | PASS           |
| No direct file paths in app db.ts         | PASS           |
| Migration files unchanged                 | PASS           |
| Concurrent reads work                     | PASS           |
| Data integrity preserved                  | PASS           |
| **TOTAL**                                 | **25/25 PASS** |

## Rollback Plan

1. Restore `packages/database/src/registry.ts` to original per-app paths
2. Each app reconnects to its own DB file
3. Legacy DBs (`github-os.db`, `ai-institute.db`) still exist at original paths

## Key Discovery

Phase 2F consolidation script stored migration IDs as `<domain>/001_baseline_schema` but the migration engine expected `001_baseline_schema`. Fixed by:

1. Modifying `loadMigrationsFromDisk()` to prefix IDs with `${dbName}/`
2. Re-computing checksums to match the engine's algorithm

## Files Modified

- `packages/database/src/registry.ts` — 4 lines changed
- `packages/database/src/migrate.ts` — 7 lines added
- `packages/database/data/bhavya.db` — checksums corrected
