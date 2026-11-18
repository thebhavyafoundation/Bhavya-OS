# BFAOS V2 — Database Preservation Report (current state: 2026-11-18)

**File:** `packages/database/data/bhavya.db` · **Branch:** `feat/bfaos-phase4-contracts` · **Status:** Preserved, unmodified

## 1. Current state (measured, read-only)

| Fact | Value |
|---|---|
| Tracked in git | Yes (`git ls-files` lists it) |
| Modified in working tree | No (`git status --porcelain` empty for this file) |
| Size on disk | 782,336 bytes |
| Last modified | 2026-11-14 01:53:27 |
| Part of any open PR | No |
| Committed state | Matches HEAD (working tree == HEAD) |

## 2. Migration ledger (read-only query)

Four baseline migrations applied, all at `2026-09-08 21:56:06`:

| id | name | checksum |
|---|---|---|
| ai-institute/001_baseline_schema | Baseline schema — users, sessions, student_profiles, audit_events | 7bcaa37e1af7f28e |
| github-os/001_baseline_schema | Baseline schema — 26 tables for repository intelligence | f42010c9905a26ee |
| ioc/001_baseline_schema | Baseline schema — 16 tables for OKR/risk/compliance/production | 6f2879855e49c84e |
| social-os/001_baseline_schema | Baseline schema — 11 tables for communication operations | 5d0db75990f8499d |

## 3. Source migrations (on disk, not applied unless run)

**ai-institute (7 files):** 001 baseline, 002 knowledge objects, 003 mission control, 004 mission control sessions, 005 mission control destinations, 006 module progress, 007 content OS core entities (007 NOT applied to dev db).

**ioc (2 files):** 001 baseline (applied), 002 add FK indexes (NOT applied to dev db).

Note: `ai-institute/007_content_os_core_entities` is an ai-institute migration, not IOC. IOC has exactly 2 migrations.

## 4. Schema-only differences

None measured against HEAD — the working-tree file matches HEAD (4 baseline rows). No migrations have been applied to this file since it was committed.

## 5. Reproducibility

The database can be recreated from source:
1. Apply `packages/database/migrations/*/001_*` baseline migrations (all four apps)
2. Optionally apply additional migrations per app via the governed procedure (`apps/ioc/docs/migration-procedure.md`)
3. Tests must run with a scratch `BHAVYA_DB_PATH`, never against this tracked file

## 6. Backup options (from F-1, Phase 4.3)

| Option | Description |
|---|---|
| Option A | Backup to `D:/Temp/kanta/opencode/db-backups/` (documented procedure) |
| Option B | Dismiss — the runner recreates the schema from source migrations |

## 7. Recommended founder disposition

**Preserve as-is.** Do not restore, delete, commit, or reset. Do not run migrations against it. Tests use a scratch `BHAVYA_DB_PATH`. The file is tracked, unmodified, and safe. Founder to confirm final disposition (revert OK — runner recreates schema from source; backup procedure documented).

**Boundaries honored:** no production database access or writes, no schema migrations in production, no modifications to the file.
