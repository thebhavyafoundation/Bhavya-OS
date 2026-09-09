# Phase 2I — Hard Autonomous Remediation: Completion Report

**Date:** 2026-09-09
**Status:** COMPLETE — 8/8 tasks done
**Commits:** `3c3a66e`, `2680d34`, `3f6dbb2`, `f8b4faa`, `df5338e`

---

## T01: Remove dead SqliteRepository class ✅

- Removed `SqliteRepository` class and `Repository` interface from `packages/database/src/index.ts`
- Deleted `packages/database/src/repository.ts`
- Verified: zero imports across codebase, typecheck passes

## T02: Eliminate direct `new Database()` in auth ✅

- Refactored `packages/auth/src/db.ts` to always use `getAdaptedDatabase("ai-institute")`
- Removed `AUTH_DATABASE_PATH` branch (dead env var, zero references)
- Removed `better-sqlite3` direct dependency from auth package
- Auth now gets WAL, FK enforcement, busy_timeout from registry

## T03: Reconcile legacy ai-institute.db ✅

- Inspected legacy `apps/ai-institute/bhavya-ai-lab/ai-institute.db`
- Contains only QA test data: 7 qa-* users, 33 test sessions, 1 student profile, 35 login audit events
- **Decision: no migration needed** — all test data, no real institutional content

## T04: Fix db-seed.ts ✅

- Removed references to nonexistent tables: `courses`, `lessons`, `progress`
- Fixed `student_profiles` INSERT to include all 24 required columns
- Script now only seeds: users, sessions, student_profiles

## T05: Remove migrateLegacy export ✅

- Removed deprecated `migrateLegacy` function from `packages/database/src/migrate.ts`
- Removed from public API surface in `packages/database/src/index.ts`
- Verified: zero consumers across codebase

## T06: Studio table verification ✅

- Target: canonical `bhavya.db` via `getAdaptedDatabase("ai-institute")`
- Idempotent: `CREATE TABLE IF NOT EXISTS`
- FK: `studio_lessons.course_id → studio_courses.id ON DELETE SET NULL`
- Bypasses migrations: intentional (documented in AGENTS.md)
- **No changes needed**

## T07: Database tests ✅

- Created `packages/database/src/__tests__/database.test.ts` with 10 tests
- Tests: connection, WAL, FK enforcement, schema ops, constraints, transactions, checksums
- All 10 tests passing
- Also fixed dangling `repository` export in `package.json`

## T08: Adversarial re-audit ✅

| Check                    | Result                                          |
| ------------------------ | ----------------------------------------------- |
| `new Database()` in apps | **0** (was 1 in auth)                           |
| Dead exports in index.ts | **0** (removed SqliteRepository, migrateLegacy) |
| Typecheck (database)     | **PASS**                                        |
| Typecheck (auth)         | **PASS**                                        |
| Database tests           | **10/10 PASS**                                  |
| Integrity check          | **OK**                                          |
| Canonical DB tables      | **63**                                          |
| Canonical DB indexes     | **51**                                          |
| Export surface           | **Clean**                                       |

---

## Summary

All 8 remediation tasks completed. The database layer is now cleaner:

- **Dead code removed:** SqliteRepository, Repository interface, migrateLegacy
- **Bypass eliminated:** Auth no longer creates direct Database connections
- **Seed script fixed:** References only existing tables
- **Tests added:** 10 vitest tests for core SQLite operations
- **Export surface clean:** No dead or dangling exports

Remaining items (not in scope for T01–T08):

- Legacy `ai-institute.db` file left in place (QA test data, harmless)
- `github-os` pre-existing broken `./db` imports (not introduced by our changes)
- `git push` still timing out (network issue)
