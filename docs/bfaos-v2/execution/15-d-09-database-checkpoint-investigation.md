# BFAOS V2 — D-09 Decision Brief: Database and Checkpoint Architecture (INVESTIGATION)

**Date:** 2026-11-18 · **Branch:** `feat/phase45-preview-concurrency` · **Owner:** Founder · **Status:** INVESTIGATION — no storage implementation authorized

**Prohibited:** schema edits, migration creation or execution, database writes, production database access, learner-data access, changes to database configuration, or modification of the tracked `bhavya.db` file. Nothing in this brief is implemented.

---

## 1. Database ownership and environment matrix

| Database name | Dev file | Production override (env) | Owner domain |
|---|---|---|---|
| `ai-institute` | `packages/database/data/bhavya.db` | `TURSO_DATABASE_URL` | ai-institute app |
| `github-os` | `packages/database/data/bhavya.db` | (none) | github-os app |
| `social-os` | `packages/database/data/bhavya.db` | (none) | social-os app |
| `ioc` | `packages/database/data/bhavya.db` | (none) | ioc app |

**Source:** `packages/database/src/registry.ts` — all four domains resolve to the same SQLite file `packages/database/data/bhavya.db` in development. Only `ai-institute` has a production override via `TURSO_DATABASE_URL`.

**Env selection:** `packages/database/src/async-adapter.ts:153` — `initAsyncAdapter()` uses `@libsql/client` (Turso) when `TURSO_DATABASE_URL` is set, otherwise wraps `better-sqlite3` (local SQLite). Production = Turso; dev/test = local SQLite.

## 2. Evidence-backed call paths (application → persistence)

```
App/repository
  → getReadWriteDatabase(name)           [packages/database/src/registry.ts:113]
    → getNamedDatabase(name, config)     [packages/database/src/sqlite.ts:35]
      → new better-sqlite3(path)         [WAL mode, busy_timeout=5000, foreign_keys=ON]
      → singleton per name (_connections Map)
  → db.exec(migration.up) + INSERT _migrations   [packages/database/src/migrate.ts:197-203]
    (transactional per migration)
```

For async repository access:
```
Repository
  → getAsyncAdapter()                    [packages/database/src/async-adapter.ts:176]
    → LocalAdapter (better-sqlite3 wrapped async)   [dev]
    → TursoAdapter (@libsql/client)              [production, TURSO_DATABASE_URL set]
```

All four domains share ONE `_migrations` table in bhavya.db, with migration IDs prefixed by domain (`ai-institute/001_baseline_schema`, etc.) for shared-DB uniqueness (`migrate.ts:126-129`).

## 3. Existing schema and migration mechanisms relevant to checkpoints

**Migration runner** (`packages/database/src/migrate.ts`):
- `Migration` interface: `id`, `name`, `up`, `down`, optional `destructive`
- `MigrationRecord`: `id`, `name`, `checksum`, `applied_at`
- `computeChecksum(migration)`: SHA-256 of `up + down`, truncated to 16 hex chars
- `migrate(dbName)`: discovers migrations from `packages/database/migrations/<dbName>/`, skips applied, detects checksum drift (throws), executes each in a transaction (`db.exec(up) + INSERT _migrations`)
- `rollback(dbName)`: rolls back last migration (not destructive)
- `getMigrationStatus(dbName)`: applied + pending

**Ledger** (`_migrations` table): `id TEXT PRIMARY KEY, name TEXT NOT NULL, checksum TEXT NOT NULL, applied_at TEXT DEFAULT (datetime('now'))`

**Current dev-db state** (read-only query, 2026-11-18): 4 rows — `ai-institute/001`, `github-os/001`, `ioc/001`, `social-os/001`, all applied 2026-09-08. `ioc/002` and `ai-institute/002`–`007` exist in source but are NOT applied.

**Source migrations:** 7 ai-institute files + 2 ioc files in `packages/database/migrations/<domain>/`.

## 4. Current checkpoint / artifact capabilities and gaps

**What exists:**
- `packages/kernel/src/idempotency/index.ts` — idempotency keys + execution records (file-based in `.kernel/idempotency/`, NOT in the database)
- `packages/kernel/src/replay/index.ts` — replay/resume of executions
- `MigrationRecord.checksum` — SHA-256 integrity per migration
- `IntegrationRecord` (@bhavya/shared:1305) — approved integration record with status `pending|integrating|integrated|failed`
- `HumanDecision` (@bhavya/shared:1284) — append-only audit of human decisions

**What is MISSING (checkpoint gaps):**
- No database table for checkpoints (payload + integrity + version)
- No checkpoint retention / pruning policy
- No checkpoint recovery procedure in code
- Idempotency records are file-based (`.kernel/idempotency/`), not in the shared database — a potential second source of truth
- No `checkpoint` or `execution_checkpoint` table in any migration directory

## 5. Options that reuse existing persistence (no schema changes)

### Option 5a: Reuse `_migrations` table pattern — new migration directory + table via governed procedure

Add a `_checkpoints` table through a NEW migration (e.g. `ioc/003_checkpoints`) following the existing migration runner. This reuses:
- The `migrate()` runner (transactional, checksummed)
- The `_migrations` ledger pattern
- `computeChecksum` for integrity

**Status:** Requires a schema change (new table + migration). **Unapproved** under D-09 (no migrations authorized). Documented here as the path if founder approves D-09.

### Option 5b: Reuse `IntegrationRecord` + `HumanDecision` (shared types, no new table)

Store checkpoints as `IntegrationRecord` (status `integrating` → `integrated`/`failed`) keyed by execution, with `HumanDecision` for recovery approvals. These are TypeScript types only — no table, no persistence.

**Status:** Types exist but no persistence layer. Would still need a table. **Unapproved.**

## 6. Options requiring schema changes (clearly labelled UNAPPROVED)

| Option | Change | Approval status |
|---|---|---|
| New `_checkpoints` table via migration | Schema change + migration file | UNAPPROVED (D-09 prohibits migrations) |
| Checkpoint column added to existing table | Schema change | UNAPPROVED |
| Separate checkpoint database/file | New infra + config | UNAPPROVED |

No schema change may be made without founder approval of D-09.

## 7. Recommended direction and rationale

**Recommendation:** If D-09 is approved, implement checkpoints as a **new `_checkpoints` table in `bhavya.db`** via a new migration (e.g. `ioc/003_checkpoints`), following the existing `migrate()` runner pattern:
- Table: `id TEXT PRIMARY KEY, execution_id TEXT, payload TEXT, checksum TEXT, version INTEGER, created_at TEXT, recovered_at TEXT`
- Integrity: `checksum` = SHA-256 of payload (mirrors `computeChecksum`)
- Version gate: store schema version, reject mismatches on read
- Transactional: checkpoint write + execution record update in one transaction
- Concurrency: `busy_timeout=5000` + WAL mode (already configured in `sqlite.ts`)

**Rationale:** Reuses the existing, tested migration infrastructure; single database (no second source of truth); zero new cost (SQLite already used); transactional and checksummed (integrity); WAL mode supports concurrent readers.

**Second-source-of-truth risk:** The idempotency layer currently stores keys/records in `.kernel/idempotency/` files, NOT in bhavya.db. If checkpoints go in bhavya.db but idempotency stays file-based, there are two persistence locations. **Mitigation:** either migrate idempotency into bhavya.db (larger change) or document the split explicitly.

## 8. Data-integrity, security, recovery, backup, operational risks

| Risk | Assessment | Mitigation |
|---|---|---|
| Checkpoint integrity (tampering) | Medium | SHA-256 checksum on write, verify on read (mirrors migration checksum) |
| Schema version drift | Medium | Version column on checkpoint; version-gate read (reject mismatches) |
| Concurrent writes | Low | WAL mode + `busy_timeout=5000` (already configured) |
| Partial state on failure | Low | Transactional write (checkpoint + ledger together, like migrations) |
| Retention / unbounded growth | Medium | No retention policy exists; needs pruning rule |
| Access control | Medium | No checkpoint-specific ACL; inherits DB-level access |
| Production data exposure | Low | bhavya.db is dev artifact; production uses Turso (separate) |
| Second source of truth | Medium | Idempotency file-based vs checkpoint DB-based — document or unify |
| Recovery ownership | High | No recovery procedure traced; owner undefined |

## 9. Evidence required before any future implementation decision

1. Confirm whether production persistence uses Turso (`TURSO_DATABASE_URL`) or SQLite for each domain in production deployment.
2. Identify the owner of recovery operations (who restores a checkpoint, under what conditions).
3. Define checkpoint retention period and pruning procedure.
4. Decide whether to unify idempotency (file-based) and checkpoints (DB-based) persistence.
5. Founder approval of D-09 (schema/migration) before any checkpoint table is created.

## 10. Boundary reminder

**Not implemented.** No schema edits, no migrations, no database writes, no production access, no learner-data access, no changes to `bhavya.db`. `bhavya.db` is preserved byte-for-byte (782,336 bytes, 4 baseline migrations, unmodified working tree).
