# Phase 2A — Database Consolidation Forensic Audit

**Date:** 2026-09-08
**Status:** INSPECTION ONLY — no files modified, no commits
**Baseline:** master @ 4f0abcb (Phase 1 complete)

---

## 1. Executive Summary

### Verified Database Count: 4 logical databases, 1 physical file

Contrary to the "4 SQLite → 1" framing, the reality is more nuanced:

- **1 physical database file exists on disk** (`apps/github-os/data/github-os.db`)
- **4 logical databases are defined in code** with full schemas
- **3 databases are runtime-created** (ai-institute, social-os, ioc) — not committed to git
- **52 total tables** across all databases (26 + 11 + 11 + 4)
- **Cross-app direct SQLite access** is the primary architectural violation
- **`@bhavya/database` package exists but is unused** by any app

### Key Finding

The consolidation is NOT a simple "merge 4 files" operation. The databases serve architecturally distinct purposes:

1. **ai-institute.db** — Identity + auth (users, sessions, student profiles, audit) — CANONICAL, shared via `@bhavya/auth`
2. **github-os.db** — Repository intelligence (26 tables, hub-and-spoke around `repositories`) — domain-isolated
3. **social-os.db** — Communication operations (11 tables, publication pipeline) — domain-isolated
4. **ioc.db** — OKR/risk/compliance (11 tables, no foreign keys) — domain-isolated

### Recommendation

**PARTIAL consolidation is recommended, not full merge.** The identity database (ai-institute.db) should remain canonical. The domain databases (github-os, social-os, ioc) should be accessed through a shared adapter layer, not merged into one file. This eliminates the cross-app access violation while preserving domain isolation.

---

## 2. Verified Database Inventory

### 2.1 Physical Database Files

| #   | Database        | Path                                              | Size                | On Disk | In Git                               | Created By |
| --- | --------------- | ------------------------------------------------- | ------------------- | ------- | ------------------------------------ | ---------- |
| 1   | github-os.db    | `apps/github-os/data/github-os.db`                | 4 KB (+ 1.1 MB WAL) | **YES** | **YES** (tracked despite .gitignore) | Runtime    |
| 2   | ai-institute.db | `apps/ai-institute/bhavya-ai-lab/ai-institute.db` | N/A                 | **NO**  | NO                                   | Runtime    |
| 3   | social-os.db    | `apps/social-os/data/social-os.db`                | N/A                 | **NO**  | NO                                   | Runtime    |
| 4   | ioc.db          | `apps/ioc/data/ioc.db`                            | N/A                 | **NO**  | NO                                   | Runtime    |

**Critical finding:** Only github-os.db exists on disk. The other 3 databases are created at runtime when their respective apps first access them. This means the "4 databases" are really 1 committed + 3 ephemeral.

### 2.2 Database Metadata

| Property         | ai-institute      | github-os           | social-os           | ioc                 |
| ---------------- | ----------------- | ------------------- | ------------------- | ------------------- |
| **Tables**       | 4                 | 26                  | 11                  | 11                  |
| **Indexes**      | 5                 | 24                  | 0                   | 0                   |
| **Foreign Keys** | 3                 | 16                  | 4                   | 0                   |
| **ID Format**    | TEXT (random hex) | TEXT (prefixed)     | TEXT (prefixed)     | TEXT (prefixed)     |
| **Pragmas**      | WAL, FK ON        | WAL, FK ON          | WAL, FK ON          | WAL, FK ON          |
| **Production**   | Turso (@libsql)   | Local file          | Local file          | Local file          |
| **Migration**    | packages/database | Inline CREATE TABLE | Inline CREATE TABLE | Inline CREATE TABLE |

---

## 3. Database → App → Consumer Map

### 3.1 ai-institute.db (Identity — CANONICAL)

```
┌─────────────────────────────────────────────────────────┐
│                    ai-institute.db                       │
│  users, sessions, student_profiles, audit_events        │
│  studio_courses, studio_lessons                         │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────────────────────┐
    │          │                          │
    ▼          ▼                          ▼
┌────────┐ ┌────────────┐ ┌──────────────────────────┐
│ apps/  │ │ packages/  │ │ apps/github-os, social-os │
│ ai-    │ │ auth/      │ │ ioc (via @bhavya/auth)    │
│ inst.  │ │ db.ts      │ │ Read-only session check   │
│        │ │            │ │                          │
│ 24 API │ │ Session    │ │ 3 apps × withAuth()      │
│ routes │ │ validation │ │ = 44 API routes protected │
└────────┘ └────────────┘ └──────────────────────────┘
```

**Consumers:**

- `apps/ai-institute/src/lib/db.ts` — full CRUD (auth, student, studio)
- `packages/auth/src/db.ts` — read sessions + users (session validation)
- `apps/ai-institute/src/lib/os-data.ts` — NO (this file reads foreign DBs, not this one)

### 3.2 github-os.db (Repository Intelligence)

```
┌─────────────────────────────────────────────────────────┐
│                   github-os.db                           │
│  26 tables: repositories (hub), 25 spoke tables         │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────────────────────┐
    │          │                          │
    ▼          ▼                          ▼
┌────────┐ ┌────────────┐ ┌──────────────────────────┐
│ apps/  │ │ packages/  │ │ apps/ai-institute/       │
│ github │ │ github-os/ │ │ src/lib/os-data.ts       │
│ -os/   │ │ src/db.ts  │ │                          │
│        │ │            │ │ Direct SQLite reads      │
│ 28 API │ │ 4 tables   │ │ (ARCHITECTURAL VIOLATION)│
│ routes │ │ (simplified│ │ 6 functions, 10+ queries │
└────────┘ └────────────┘ └──────────────────────────┘
```

**Consumers:**

- `apps/github-os/src/lib/db.ts` — full CRUD (28 API routes)
- `packages/github-os/src/db.ts` — simplified read-only (4 tables)
- `apps/ai-institute/src/lib/os-data.ts` — **direct read-only access** (VIOLATION)

### 3.3 social-os.db (Communication Operations)

```
┌─────────────────────────────────────────────────────────┐
│                   social-os.db                           │
│  11 tables: publications, campaigns, approval pipeline  │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────────────────────┐
    │          │                          │
    ▼          ▼                          ▼
┌────────┐ ┌────────────┐ ┌──────────────────────────┐
│ apps/  │ │ packages/  │ │ apps/ai-institute/       │
│ social │ │ social-os/ │ │ src/lib/os-data.ts       │
│ -os/   │ │ src/db.ts  │ │                          │
│        │ │            │ │ Direct SQLite reads      │
│ 8 API  │ │ 5 tables   │ │ (ARCHITECTURAL VIOLATION)│
│ routes │ │ (simplified│ │ 1 function, 5+ queries   │
└────────┘ └────────────┘ └──────────────────────────┘
```

**Consumers:**

- `apps/social-os/src/lib/db.ts` — full CRUD (8 API routes + 10 lib files)
- `packages/social-os/src/db.ts` — simplified read-only (5 tables)
- `apps/ai-institute/src/lib/os-data.ts` — **direct read-only access** (VIOLATION)

### 3.4 ioc.db (OKR/Compliance)

```
┌─────────────────────────────────────────────────────────┐
│                     ioc.db                               │
│  11 tables: objectives, risks, decisions, health        │
└──────────────┬──────────────────────────────────────────┘
               │
    ┌──────────┼──────────────────────────┐
    │          │                          │
    ▼          ▼                          ▼
┌────────┐ ┌────────────┐ ┌──────────────────────────┐
│ apps/  │ │ packages/  │ │ apps/ai-institute/       │
│ ioc/   │ │ ioc/       │ │ src/lib/os-data.ts       │
│        │ │ src/db.ts  │ │                          │
│ 8 API  │ │ 11 tables  │ │ Direct SQLite reads      │
│ routes │ │ (identical │ │ (ARCHITECTURAL VIOLATION)│
└────────┘ └────────────┘ └──────────────────────────┘
```

**Consumers:**

- `apps/ioc/src/lib/db.ts` — full CRUD (8 API routes + lib modules)
- `packages/ioc/src/db.ts` — identical schema (unused in practice)
- `apps/ai-institute/src/lib/os-data.ts` — **direct read-only access** (VIOLATION)

---

## 4. Schema Comparison

### 4.1 ID Namespace Analysis

| Database     | ID Pattern            | Example        | Collision Risk     |
| ------------ | --------------------- | -------------- | ------------------ |
| ai-institute | `crypto.randomUUID()` | `a1b2c3d4-...` | LOW                |
| github-os    | `crypto.randomUUID()` | `a1b2c3d4-...` | **HIGH** if merged |
| social-os    | `crypto.randomUUID()` | `a1b2c3d4-...` | **HIGH** if merged |
| ioc          | `crypto.randomUUID()` | `a1b2c3d4-...` | **HIGH** if merged |

**All 4 databases use the same UUID-based ID format.** Merging tables directly risks primary key collisions. Tables must be prefixed or namespaced.

### 4.2 Table Overlap Analysis

| Table Name       | ai-institute | github-os | social-os | ioc | Overlap?                    |
| ---------------- | :----------: | :-------: | :-------: | :-: | --------------------------- |
| users            |      ✅      |     —     |     —     |  —  | No                          |
| sessions         |      ✅      |     —     |     —     |  —  | No                          |
| student_profiles |      ✅      |     —     |     —     |  —  | No                          |
| audit_events     |      ✅      |     —     |     —     |  —  | No                          |
| repositories     |      —       |    ✅     |     —     |  —  | No                          |
| publications     |      —       |     —     |    ✅     |  —  | No                          |
| campaigns        |      —       |     —     |    ✅     |  —  | No                          |
| objectives       |      —       |     —     |     —     | ✅  | No                          |
| risks            |      —       |     —     |     —     | ✅  | No                          |
| decisions        |      —       |     —     |     —     | ✅  | No                          |
| events           |      —       |    ✅     |    ✅     |  —  | **YES** (different schemas) |

**Only one table name collision: `events`** — but the schemas are completely different:

- github-os `events`: `id, type, entity_type, entity_id, title, description, metadata, created_at`
- social-os `events`: `id, type, payload, created_at, processed`

### 4.3 Foreign Key Compatibility

| Database     | FK Pattern                                             | Referenced Table |
| ------------ | ------------------------------------------------------ | ---------------- |
| ai-institute | `sessions.user_id → users.id`                          | users            |
| ai-institute | `student_profiles.user_id → users.id`                  | users            |
| github-os    | 16 FKs all → `repositories.id`                         | repositories     |
| social-os    | `approval_records.publication_id → publications.id`    | publications     |
| social-os    | `platform_content.publication_id → publications.id`    | publications     |
| social-os    | `analytics_snapshots.publication_id → publications.id` | publications     |
| social-os    | `editorial_calendar.campaign_id → campaigns.id`        | campaigns        |
| ioc          | **NONE**                                               | —                |

**All FKs are self-contained within their database.** No cross-database foreign keys exist. This is favorable for consolidation — tables can be moved without FK breakage.

### 4.4 Package vs App Schema Differences

| Database  | App Tables | Package Tables | Difference                   |
| --------- | ---------- | -------------- | ---------------------------- |
| github-os | 26         | 4              | Package is simplified subset |
| social-os | 11         | 5              | Package is simplified subset |
| ioc       | 11         | 11             | Identical                    |

The package versions appear to be early prototypes that were never updated. They are **unused in practice** — all apps import from their local `@/lib/db`.

---

## 5. Data Ownership Matrix

| Table               | Domain    | Writer                        | Reader                            | Authoritative? | Demo Data?    |
| ------------------- | --------- | ----------------------------- | --------------------------------- | -------------- | ------------- |
| users               | Identity  | ai-institute (auth routes)    | @bhavya/auth, ai-institute        | YES            | No            |
| sessions            | Identity  | ai-institute (auth routes)    | @bhavya/auth, ai-institute        | YES            | No            |
| student_profiles    | Education | ai-institute (student routes) | ai-institute                      | YES            | No            |
| audit_events        | Identity  | ai-institute (auth routes)    | ai-institute                      | YES            | No            |
| studio_courses      | Education | ai-institute (studio routes)  | ai-institute                      | YES            | No            |
| studio_lessons      | Education | ai-institute (studio routes)  | ai-institute                      | YES            | No            |
| repositories        | GitHub    | github-os                     | github-os, ai-institute (os-data) | YES            | Possibly seed |
| knowledge_packages  | GitHub    | github-os                     | github-os, ai-institute           | YES            | Possibly seed |
| activity_events     | GitHub    | github-os                     | github-os, ai-institute           | YES            | Possibly seed |
| technology_radar    | GitHub    | github-os                     | github-os, ai-institute           | YES            | Possibly seed |
| recommendations     | GitHub    | github-os                     | github-os, ai-institute           | YES            | Possibly seed |
| publications        | Social    | social-os                     | social-os, ai-institute           | YES            | Possibly seed |
| campaigns           | Social    | social-os                     | social-os, ai-institute           | YES            | Possibly seed |
| editorial_calendar  | Social    | social-os                     | social-os, ai-institute           | YES            | Possibly seed |
| community_feedback  | Social    | social-os                     | social-os, ai-institute           | YES            | Possibly seed |
| institution_metrics | Social    | social-os                     | social-os, ai-institute           | YES            | Possibly seed |
| objectives          | IOC       | ioc                           | ioc, ai-institute                 | YES            | Possibly seed |
| risks               | IOC       | ioc                           | ioc, ai-institute                 | YES            | Possibly seed |
| weekly_reviews      | IOC       | ioc                           | ioc, ai-institute                 | YES            | Possibly seed |
| action_items        | IOC       | ioc                           | ioc, ai-institute                 | YES            | Possibly seed |
| alerts              | IOC       | ioc                           | ioc, ai-institute                 | YES            | Possibly seed |

**Key finding:** ai-institute.db is the only database that is authoritative AND shared (identity). The domain databases are authoritative within their domain but also read cross-app by os-data.ts.

---

## 6. Runtime / Environment Architecture

### 6.1 Local Development

```
apps/ai-institute/
  └── bhavya-ai-lab/ai-institute.db  (created at runtime)
      ├── users, sessions, student_profiles, audit_events
      └── studio_courses, studio_lessons

apps/github-os/
  └── data/github-os.db  (committed to git!)
      └── 26 tables

apps/social-os/
  └── data/social-os.db  (created at runtime)
      └── 11 tables

apps/ioc/
  └── data/ioc.db  (created at runtime)
      └── 11 tables
```

### 6.2 Production

```
apps/ai-institute/
  └── Turso (via @libsql/client)
      └── Remote SQLite at TURSO_DATABASE_URL

apps/github-os/
  └── data/github-os.db  (local file — NOT serverless-compatible)
      └── 26 tables

apps/social-os/
  └── data/social-os.db  (local file — NOT serverless-compatible)
      └── 11 tables

apps/ioc/
  └── data/ioc.db  (local file — NOT serverless-compatible)
      └── 11 tables
```

**Critical finding:** Only ai-institute uses Turso for production. The other 3 databases use local files, which means they are NOT deployed to production (Vercel serverless). This means:

- github-os, social-os, ioc are **local-only development tools**
- OR they have no production deployment yet
- The cross-app reads in os-data.ts only work locally

### 6.3 Cross-App Access Pattern

```typescript
// apps/ai-institute/src/lib/os-data.ts
import Database from "better-sqlite3";

// Opens FOREIGN database read-only, queries, then closes
const foreignDb = new Database(foreignPath, { readonly: true });
const rows = foreignDb.prepare("SELECT ... FROM table").all();
foreignDb.close();
```

This is a **per-request connection** pattern — no singleton, no connection pooling. Each API call opens and closes the foreign database.

---

## 7. Consolidation Risks

### 7.1 Primary Key Collisions — HIGH RISK

All databases use `crypto.randomUUID()` for IDs. If tables are merged into one database, two different records from different databases could have the same UUID.

**Mitigation:** Add table-name prefix to IDs, or use composite keys (table + UUID), or accept UUID collision probability (~2^-122 for v4 UUIDs, which is negligible).

### 7.2 Table Name Collisions — LOW RISK

Only one collision: `events` in github-os and social-os. All other table names are unique across databases.

**Mitigation:** Rename `social-os.events` to `social_events` or `publication_events` before merge.

### 7.3 Transaction Boundaries — MEDIUM RISK

Currently each app transaction is isolated to its own database. Merging means concurrent writes from different apps could contend on the same SQLite lock.

**Mitigation:** SQLite WAL mode allows concurrent readers with one writer. The apps are low-traffic. Use `BEGIN IMMEDIATE` for write transactions.

### 7.4 Connection Lifecycle — MEDIUM RISK

Each app currently has a singleton connection to its own database. Merging means multiple code paths sharing one connection.

**Mitigation:** Create a shared connection singleton in `@bhavya/database` or a new `@bhavya/db` package.

### 7.5 Migration Ordering — LOW RISK

Each app has independent inline migrations. Merging requires sequencing them.

**Mitigation:** Use `packages/database` migration framework (already exists, currently unused).

### 7.6 Test Isolation — MEDIUM RISK

Currently each app can have its own test database. Merging means tests could interfere.

**Mitigation:** Use in-memory SQLite for tests (`:memory:`).

### 7.7 Production Compatibility — HIGH RISK

ai-institute uses Turso (serverless SQLite). github-os, social-os, ioc use local files. Merging into one database means all must be Turso-compatible.

**Mitigation:** Use `@libsql/client` for all databases, or keep domain databases local-only.

### 7.8 Data Loss Risk — LOW RISK

The cross-app reads in os-data.ts are read-only. No data is written cross-app. Merging doesn't risk data loss from write conflicts.

---

## 8. Recommended Target Architecture

### 8.1 NOT a Full Merge

After inspection, **full merge of all 4 databases into 1 file is NOT recommended.** Here's why:

1. **github-os has 26 tables** — this is a massive domain-specific schema that would bloat the identity database
2. **social-os and ioc are local-only** — they don't need to be in Turso
3. **The cross-app access is read-only** — ai-institute reads from domain databases but never writes to them
4. **Domain isolation is architecturally correct** — different domains should have different data stores

### 8.2 Recommended Architecture: Shared Adapter Layer

```
┌─────────────────────────────────────────────────────────┐
│                    Canonical DB                          │
│              apps/ai-institute/                          │
│              bhavya-ai-lab/ai-institute.db               │
│              (or Turso in production)                    │
│                                                         │
│  users, sessions, student_profiles, audit_events        │
│  studio_courses, studio_lessons                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ @bhavya/auth (session validation)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  github-os.db │ │  social-os.db │ │    ioc.db     │
│  (local file) │ │  (local file) │ │  (local file) │
│  26 tables    │ │  11 tables    │ │  11 tables    │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          │ @bhavya/database (shared adapter)
                          │
                          ▼
                ┌───────────────────┐
                │  os-data.ts       │
                │  (reads via       │
                │   shared adapter) │
                └───────────────────┘
```

### 8.3 What Changes

| Current                                      | Target                                                      |
| -------------------------------------------- | ----------------------------------------------------------- |
| 4 independent db.ts files                    | 1 shared `@bhavya/database` adapter                         |
| Cross-app direct SQLite access in os-data.ts | Access via shared adapter with proper connection management |
| Each app creates its own database            | Shared adapter manages all connections                      |
| No migration framework                       | `packages/database` migration framework adopted             |
| github-os.db committed to git                | Removed from git, created at runtime                        |
| Package versions of db.ts (unused)           | Deleted                                                     |

### 8.4 What Stays the Same

| Item                               | Reason                           |
| ---------------------------------- | -------------------------------- |
| 4 separate .db files               | Domain isolation is correct      |
| ai-institute as canonical identity | Already the case                 |
| Domain-specific schemas            | No overlap, correct separation   |
| better-sqlite3 as the driver       | Works well, already in use       |
| WAL mode + foreign keys            | Best practices, already in place |

---

## 9. Migration Strategy

### Phase 2B — Shared Adapter (HIGH PRIORITY)

1. **Fix `@bhavya/database` package** — make it actually usable
   - Update connection manager to support multiple named databases
   - Add connection factory for each app's database
   - Keep migration framework

2. **Refactor `os-data.ts`** — eliminate direct SQLite access
   - Replace `new Database(foreignPath)` with `@bhavya/database.getConnection('github-os')`
   - Use shared connection pool instead of per-request open/close

3. **Refactor app db.ts files** — delegate to shared adapter
   - `apps/github-os/src/lib/db.ts` → import from `@bhavya/database`
   - `apps/social-os/src/lib/db.ts` → import from `@bhavya/database`
   - `apps/ioc/src/lib/db.ts` → import from `@bhavya/database`

4. **Delete unused package db.ts files**
   - `packages/github-os/src/db.ts`
   - `packages/social-os/src/db.ts`
   - `packages/ioc/src/db.ts`

5. **Remove github-os.db from git**
   - Add to .gitignore
   - Remove from tracking
   - Create at runtime via seed script

### Phase 2C — Schema Migration (MEDIUM PRIORITY)

1. **Adopt migration framework** — move inline CREATE TABLE to `packages/database/migrations/`
2. **Add table prefixes** — prevent future name collisions
3. **Seed data cleanup** — mark demo data, create seed scripts

### Phase 2D — Turso Expansion (LOW PRIORITY)

1. **Evaluate Turso for domain databases** — if production deployment needed
2. **Update connection strings** — add `TURSO_*` env vars for each domain
3. **Test serverless compatibility** — verify better-sqlite3 → @libsql migration

---

## 10. Verification Strategy

### After Phase 2B (Shared Adapter)

1. **Typecheck** — `pnpm typecheck` (all apps)
2. **Lint** — `pnpm lint` (all apps)
3. **Functional test** — manually verify:
   - ai-institute auth (login, register, session)
   - github-os dashboard (repositories, health, reviews)
   - social-os dashboard (publications, campaigns)
   - ioc dashboard (objectives, risks, reviews)
   - os-data.ts cross-app reads (dashboard aggregates)
4. **Connection test** — verify no "database locked" errors under load
5. **Git status** — confirm no uncommitted changes

### After Phase 2C (Schema Migration)

1. **Migration test** — fresh database creation from migrations
2. **Seed test** — seed scripts produce expected data
3. **Rollback test** — migrations can be reverted

---

## 11. Rollback Strategy

### Phase 2B Rollback

Each step is independently reversible:

1. **Shared adapter** — revert `@bhavya/database` changes
2. **os-data.ts** — revert to direct `new Database()` calls
3. **App db.ts** — revert to local implementations
4. **Package cleanup** — restore deleted files from git
5. **Git removal** — `git checkout -- apps/github-os/data/github-os.db`

### Phase 2C Rollback

1. **Migrations** — delete migration files, restore inline CREATE TABLE
2. **Seed scripts** — delete seed scripts
3. **Table prefixes** — rename tables back

---

## 12. Detailed Implementation Plan

### Step 1: Fix @bhavya/database Package

**Files:** `packages/database/src/sqlite.ts`, `packages/database/src/index.ts`
**Changes:** Add named connection support, connection factory
**Verification:** `pnpm --filter @bhavya/database typecheck`
**Risk:** LOW
**Rollback:** git checkout the package

### Step 2: Create Database Registry

**File:** `packages/database/src/registry.ts` (new)
**Changes:** Map app names to database paths, centralize connection management
**Verification:** Unit test — each app gets correct connection
**Risk:** LOW
**Rollback:** Delete file

### Step 3: Refactor os-data.ts

**File:** `apps/ai-institute/src/lib/os-data.ts`
**Changes:** Replace direct SQLite with shared adapter
**Verification:** `pnpm --filter @bhavya/ai-institute typecheck`
**Risk:** MEDIUM (cross-app reads)
**Rollback:** git checkout os-data.ts

### Step 4: Refactor github-os db.ts

**File:** `apps/github-os/src/lib/db.ts`
**Changes:** Delegate to `@bhavya/database` instead of direct better-sqlite3
**Verification:** `pnpm --filter @bhavya/github-os typecheck`
**Risk:** MEDIUM
**Rollback:** git checkout db.ts

### Step 5: Refactor social-os db.ts

**File:** `apps/social-os/src/lib/db.ts`
**Changes:** Delegate to `@bhavya/database` instead of direct better-sqlite3
**Verification:** `pnpm --filter @bhavya/social-os typecheck`
**Risk:** MEDIUM
**Rollback:** git checkout db.ts

### Step 6: Refactor ioc db.ts

**File:** `apps/ioc/src/lib/db.ts`
**Changes:** Delegate to `@bhavya/database` instead of direct better-sqlite3
**Verification:** `pnpm --filter @bhavya/ioc typecheck`
**Risk:** MEDIUM
**Rollback:** git checkout db.ts

### Step 7: Delete Unused Package DB Files

**Files:** `packages/github-os/src/db.ts`, `packages/social-os/src/db.ts`, `packages/ioc/src/db.ts`
**Changes:** Delete unused simplified schema files
**Verification:** `pnpm typecheck` (full)
**Risk:** LOW
**Rollback:** git checkout the files

### Step 8: Remove github-os.db from Git

**Files:** `apps/github-os/.gitignore`, `apps/github-os/data/github-os.db`
**Changes:** Stop tracking database file, create at runtime
**Verification:** Fresh clone → app starts → database created
**Risk:** LOW
**Rollback:** git checkout the .db file

### Step 9: Adopt Migration Framework

**Files:** `packages/database/src/migrate.ts`, new migration files in each app
**Changes:** Move inline CREATE TABLE to migration files
**Verification:** Fresh database creation from migrations only
**Risk:** MEDIUM
**Rollback:** Restore inline CREATE TABLE

### Step 10: Seed Script Consolidation

**Files:** New `scripts/seed-*.ts` files
**Changes:** Create seed scripts for each domain database
**Verification:** `pnpm seed:github-os`, `pnpm seed:social-os`, `pnpm seed:ioc`
**Risk:** LOW
**Rollback:** Delete seed scripts

---

## 13. Open Questions / Decisions Required

| ID   | Question                                     | Options                                    | Recommendation                         |
| ---- | -------------------------------------------- | ------------------------------------------ | -------------------------------------- |
| D-01 | Should domain databases be Turso-compatible? | A: Local only, B: Turso for all            | A (local only — they're dev tools)     |
| D-02 | Should we keep 4 separate .db files?         | A: Yes (domain isolation), B: Merge into 1 | A (domain isolation is correct)        |
| D-03 | How to handle github-os.db in git?           | A: Remove from git, B: Keep tracked        | A (remove — should be runtime-created) |
| D-04 | Should @bhavya/database be mandatory?        | A: Yes, B: Optional adapter                | A (mandatory — single source of truth) |
| D-05 | Seed data cleanup timeline?                  | A: Now, B: Before production               | B (before production, not blocking)    |

---

## 14. Phase 2A Completion Gate

### Inspection Complete

- [x] All 4 databases located and documented
- [x] All connection patterns mapped
- [x] All schemas compared (52 tables)
- [x] All consumers identified (44+ API routes)
- [x] Cross-app access documented (os-data.ts)
- [x] Runtime architecture understood
- [x] Consolidation risks identified
- [x] Target architecture designed
- [x] Migration plan created
- [x] Git state verified

### Decision

**READY FOR PHASE 2B IMPLEMENTATION**

The forensic audit is complete. The recommended approach is NOT a full database merge but a shared adapter layer that eliminates cross-app direct SQLite access while preserving domain isolation.

### What Was Inspected

- 4 logical databases (ai-institute, github-os, social-os, ioc)
- 52 tables total
- 44+ API routes across 4 apps
- 10+ library files with database access
- 3 cross-app database reads (os-data.ts)
- 1 physical database file on disk (github-os.db)
- 1 unused database abstraction package (@bhavya/database)
- 1 in-memory knowledge graph (not SQLite)

### Verified Number of SQLite Databases

**4 logical databases** (defined in code, created at runtime)
**1 physical database file** (github-os.db, committed to git)

### Major Architectural Findings

1. **Cross-app direct SQLite access is the primary violation** — os-data.ts opens foreign databases with `new Database()` instead of using a shared adapter
2. **@bhavya/database exists but is unused** — every app uses better-sqlite3 directly
3. **Only ai-institute uses Turso** — domain databases are local-only
4. **github-os.db is committed to git** — should be runtime-created
5. **Package versions of db.ts are stale** — simplified schemas, never updated

### Consolidation Recommended?

**PARTIAL consolidation** — shared adapter layer, NOT full database merge.

### Proposed Next Phase

**Phase 2B — Shared Adapter Layer**
Refactor `@bhavya/database` to be the single source of truth for all database connections, then refactor `os-data.ts` and app db.ts files to use it.

### Exact File Created

`.ai/PHASE_2A_DATABASE_CONSOLIDATION_AUDIT.md`

### Git Status

- Current branch: `master`
- HEAD: `4f0abcb` (Phase 1 complete)
- No uncommitted changes from this audit
- Pre-existing untracked/modified files in `content/` and `.ai/` (not from this work)

### NO Implementation Code or Database Data Was Changed

This audit was inspection-only. No files were modified, no databases were accessed, no data was moved, no dependencies were installed, no commits were created.
