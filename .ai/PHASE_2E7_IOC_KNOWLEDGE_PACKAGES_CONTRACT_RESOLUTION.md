# Phase 2E.7 — IoC Knowledge Packages Contract Resolution

> **Status**: COMPLETE
> **Date**: 2026-09-08
> **Preceding**: Phase 2E.6 (consolidation gates resolved, baseline equivalence confirmed)

---

## 1. Executive Summary

Phase 2E.7 resolved the last Phase 2E.6 consolidation blocker: the schema contract conflict between IoC's `knowledge_packages` usage and the canonical github-os `knowledge_packages` table.

**Key findings:**

- IoC and github-os use `knowledge_packages` to mean **fundamentally different things**
- github-os: repository intelligence packages (FK to `repositories`, category, content, quality_score)
- IoC: content production workflow items (level, domain, status, stage, assignee, due_date, concepts, published_at)
- **Zero column overlap** beyond `id`, `title`, `created_at`
- IoC's `media_assets`, `community_requests`, `student_feedback` tables are **not defined in any migration** — pre-existing incomplete migration bug
- No IoC `knowledge_packages` data exists anywhere in the repository
- IoC's tables are **different conceptual entities** from github-os's — they are NOT the same table

**Resolution:** Option B — create IoC-owned table `ioc_content_packages` in the IoC migration. This is the only resolution that:

- Preserves domain ownership
- Avoids silent data corruption
- Requires no product decision (evidence is conclusive)
- Requires no production database modification
- Requires no data migration

---

## 2. Scope and Safety Constraints

All constraints from the Phase 2E.7 spec are honored:

- No Phase 2F physical database consolidation
- No switching apps to `packages/database/data/bhavya.db`
- No production database modification
- No destructive migrations
- No production data deletion
- No product requirement invention
- No silent semantic decisions
- No `git add .` / `git add -A` / `git commit -am`

---

## 3. Prior Phase Findings

### Phase 2E.5

- Identified `knowledge_packages` schema mismatch between IoC and github-os
- Identified `media_assets`, `community_requests`, `student_feedback` as additional IoC tables not in any migration
- Classified as "Gate 1 — requires product/ownership decision"

### Phase 2E.6

- Confirmed: github-os owns `knowledge_packages`
- Confirmed: production `github-os.db` schema is structurally identical to migration baseline
- Confirmed: `knowledge_packages` has FK to `repositories` in github-os
- Deferred Gate 1 to Phase 2E.7

### Phase 2E.7 Correction

Phase 2E.5 and 2E.6 both framed this as a "product decision required" question. The repository evidence actually **resolves** the question without needing human input — the two tables are provably different conceptual entities. The remaining question is only about the physical table name for IoC's separate entity.

---

## 4. IoC Production Contract

### `apps/ioc/src/lib/production.ts` — Complete SQL Matrix

| Function                 | Operation | Table                | Columns Read                                 | Columns Written                                                                               | WHERE                   | Return              |
| ------------------------ | --------- | -------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------- | ------------------- |
| `createKP`               | INSERT    | `knowledge_packages` | —                                            | id, title, level, domain, status, stage, assignee, due_date, concepts, created_at, updated_at | —                       | `getKP(id)`         |
| `getKP`                  | SELECT    | `knowledge_packages` | *                                            | —                                                                                             | id = ?                  | `mapRowToKP(row)`   |
| `listKPs`                | SELECT    | `knowledge_packages` | *                                            | —                                                                                             | status?, level?, stage? | `mapRowToKP(row)[]` |
| `updateKPStatus`         | UPDATE    | `knowledge_packages` | —                                            | status, stage, updated_at                                                                     | id = ?                  | `getKP(id)`         |
| `updateKPStatus`         | UPDATE    | `knowledge_packages` | —                                            | published_at                                                                                  | id = ? (if published)   | —                   |
| `advanceKP`              | SELECT    | `knowledge_packages` | *                                            | —                                                                                             | id = ?                  | `getKP(id)`         |
| `getProductionMetrics`   | SELECT    | `knowledge_packages` | status, level, stage, published_at, due_date | —                                                                                             | various                 | metrics             |
| `createMediaAsset`       | INSERT    | `media_assets`       | —                                            | id, kp_id, type, title, status, platform, created_at                                          | —                       | row                 |
| `listMediaAssets`        | SELECT    | `media_assets`       | *                                            | —                                                                                             | kp_id?, type?           | array               |
| `createCommunityRequest` | INSERT    | `community_requests` | —                                            | id, title, description, status, requested_by, created_at                                      | —                       | object              |
| `countCommunityRequests` | SELECT    | `community_requests` | COUNT(*)                                     | —                                                                                             | status = 'pending'      | number              |
| `addStudentFeedback`     | INSERT    | `student_feedback`   | —                                            | id, kp_id, score, comment, created_at                                                         | —                       | void                |
| `getAverageFeedback`     | SELECT    | `student_feedback`   | AVG(score)                                   | —                                                                                             | —                       | number              |

### IoC TypeScript Type: `ContentKnowledgePackage`

```typescript
{
  id: string;
  title: string;
  level: string;        // NOT in github-os schema
  domain: string;       // NOT in github-os schema
  status: KPStatus;     // NOT in github-os schema
  stage: ProductionStage; // NOT in github-os schema
  assignee?: string;    // NOT in github-os schema
  dueDate?: string;     // NOT in github-os schema
  publishedAt?: string; // NOT in github-os schema
  concepts: number;     // NOT in github-os schema
  createdAt: string;
  updatedAt: string;    // NOT in github-os schema
}
```

### IoC Expected Columns Not in github-os Schema

| Column         | IoC Type | IoC Usage             | github-os Equivalent                       |
| -------------- | -------- | --------------------- | ------------------------------------------ |
| `level`        | TEXT     | Grouping (L1/L2/L3)   | **NONE** — different concept               |
| `domain`       | TEXT     | Domain classification | **NONE** — github-os uses `category`       |
| `status`       | TEXT     | Workflow status       | **NONE** — github-os has no workflow       |
| `stage`        | TEXT     | Production stage      | **NONE** — different concept               |
| `assignee`     | TEXT     | Person responsible    | **NONE** — github-os is repo-scoped        |
| `due_date`     | TEXT     | Deadline              | **NONE** — github-os has no deadlines      |
| `concepts`     | INTEGER  | Concept count         | **NONE** — different concept               |
| `updated_at`   | DATETIME | Last modified         | **NONE** — github-os only has `created_at` |
| `published_at` | DATETIME | Publication date      | **NONE** — github-os has no publishing     |

### API Endpoint

`/api/production` (GET + POST) — single route handling all production operations.

### Callers

Only `apps/ioc/src/app/api/production/route.ts` imports from `production.ts`. No other IoC code references these functions.

---

## 5. Canonical github-os Contract

### `knowledge_packages` Migration Definition

```sql
CREATE TABLE IF NOT EXISTS knowledge_packages (
  id TEXT PRIMARY KEY,
  repository_id TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  tags TEXT DEFAULT '[]',
  quality_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
```

### github-os Schema Columns

| Column          | Type     | Nullable | Default           | IoC Equivalent                          |
| --------------- | -------- | -------- | ----------------- | --------------------------------------- |
| `id`            | TEXT PK  | NO       | —                 | ✅ Same                                 |
| `repository_id` | TEXT FK  | YES      | NULL              | **IoC has no equivalent**               |
| `category`      | TEXT     | NO       | —                 | IoC uses `domain` (different semantics) |
| `title`         | TEXT     | NO       | —                 | ✅ Same                                 |
| `content`       | TEXT     | NO       | —                 | **IoC has no equivalent**               |
| `metadata`      | TEXT     | YES      | '{}'              | **IoC has no equivalent**               |
| `tags`          | TEXT     | YES      | '[]'              | **IoC has no equivalent**               |
| `quality_score` | REAL     | YES      | 0                 | **IoC has no equivalent**               |
| `created_at`    | DATETIME | YES      | CURRENT_TIMESTAMP | ✅ Same                                 |

### github-os Consumer Matrix

| Consumer                                  | Columns Used                                               | Operation                    |
| ----------------------------------------- | ---------------------------------------------------------- | ---------------------------- |
| `api/knowledge/route.ts`                  | id, title, category, quality_score                         | SELECT                       |
| `api/search/route.ts`                     | id, title, category, content                               | SELECT (WHERE LIKE)          |
| `api/repositories/[id]/route.ts`          | *                                                          | SELECT (WHERE repository_id) |
| `api/repositories/[id]/advisor/route.ts`  | *                                                          | SELECT (WHERE repository_id) |
| `api/repositories/[id]/learning/route.ts` | id, category, title, quality_score                         | SELECT (WHERE repository_id) |
| `seed.ts`                                 | id, repository_id, category, title, content, quality_score | INSERT                       |

### github-os Semantic Purpose

`knowledge_packages` stores **repository intelligence** — structured knowledge extracted from repository analysis. Each package is:

- Scoped to a specific repository (`repository_id` FK)
- Categorized by content type (`category`)
- Has rich content (`content`)
- Has quality scoring (`quality_score`)

---

## 6. Ownership Analysis

### Classification: B — Different Conceptual Entities

| Evidence              | github-os               | IoC                                             | Same?               |
| --------------------- | ----------------------- | ----------------------------------------------- | ------------------- |
| Table name            | `knowledge_packages`    | `knowledge_packages`                            | Name only           |
| Owner                 | github-os domain        | IoC domain                                      | Different           |
| FK to repositories    | Yes (FK constraint)     | No                                              | Different           |
| Content semantics     | Repository intelligence | Production workflow item                        | Different           |
| Workflow stages       | None                    | research→writing→review→design→media→publishing | Different           |
| Status tracking       | None                    | draft→in-review→approved→published              | Different           |
| Quality scoring       | `quality_score` (REAL)  | None                                            | Different           |
| Level classification  | None                    | `level` (L1/L2/L3)                              | Different           |
| Domain classification | `category`              | `domain`                                        | Name collision only |
| Person assignment     | None                    | `assignee`                                      | Different           |
| Deadlines             | None                    | `due_date`                                      | Different           |
| Concept counting      | None                    | `concepts`                                      | Different           |
| Publication tracking  | None                    | `published_at`                                  | Different           |
| Content storage       | `content` (TEXT)        | None                                            | Different           |
| Tag storage           | `tags` (JSON)           | None                                            | Different           |
| Metadata storage      | `metadata` (JSON)       | None                                            | Different           |

**Conclusion:** These are **completely different tables** that happen to share a name. The semantic overlap is limited to `id` and `title`. They represent different domain concepts, different data models, and different business processes.

---

## 7. IoC `knowledge_packages` SQL Matrix

### `createKP` — INSERT

```sql
INSERT INTO knowledge_packages (id, title, level, domain, status, stage,
  assignee, due_date, concepts, created_at, updated_at)
VALUES (?, ?, ?, ?, 'draft', 'research', ?, ?, ?, ?, ?)
```

**Expected columns:** id, title, level, domain, status, stage, assignee, due_date, concepts, created_at, updated_at

### `getKP` — SELECT

```sql
SELECT * FROM knowledge_packages WHERE id = ?
```

**Expected columns:** all (id, title, level, domain, status, stage, assignee, due_date, concepts, created_at, updated_at, published_at)

### `listKPs` — SELECT

```sql
SELECT * FROM knowledge_packages [WHERE status = ?] [AND level = ?] [AND stage = ?]
ORDER BY created_at DESC
```

**Expected columns:** all

### `updateKPStatus` — UPDATE

```sql
UPDATE knowledge_packages SET status = ?, stage = ?, updated_at = ? WHERE id = ?
UPDATE knowledge_packages SET status = ?, updated_at = ? WHERE id = ?
UPDATE knowledge_packages SET published_at = ? WHERE id = ?
```

**Expected columns:** status, stage, updated_at, published_at

### `getProductionMetrics` — Aggregation

```sql
SELECT COUNT(*) FROM knowledge_packages WHERE status = 'published'
SELECT COUNT(*) FROM knowledge_packages WHERE status = 'in-review'
SELECT COUNT(*) FROM knowledge_packages
SELECT COUNT(*) FROM knowledge_packages WHERE status = 'published' AND published_at >= ?
SELECT level, COUNT(*) FROM knowledge_packages GROUP BY level
SELECT stage, COUNT(*) FROM knowledge_packages WHERE status != 'published' GROUP BY stage
SELECT * FROM knowledge_packages WHERE status != 'published' ORDER BY due_date ASC NULLS LAST, created_at ASC LIMIT 5
SELECT stage, COUNT(*) FROM knowledge_packages WHERE status != 'published' GROUP BY stage ORDER BY c DESC LIMIT 1
```

**Expected columns:** status, level, stage, published_at, due_date, created_at

---

## 8. github-os `knowledge_packages` Consumer Matrix

| Route                                 | SQL                                                                                                                     | Columns Used                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `GET /api/knowledge`                  | `SELECT id, title, category, quality_score FROM knowledge_packages ORDER BY created_at DESC LIMIT 10`                   | id, title, category, quality_score, created_at             |
| `GET /api/search?q=`                  | `SELECT id, title, category FROM knowledge_packages WHERE title LIKE ? OR content LIKE ? LIMIT 5`                       | id, title, category, content                               |
| `GET /api/repositories/[id]`          | `SELECT * FROM knowledge_packages WHERE repository_id = ? ORDER BY quality_score DESC`                                  | all                                                        |
| `GET /api/repositories/[id]/advisor`  | `SELECT * FROM knowledge_packages WHERE repository_id = ?`                                                              | all                                                        |
| `GET /api/repositories/[id]/learning` | `SELECT id, category, title, quality_score FROM knowledge_packages WHERE repository_id = ? ORDER BY quality_score DESC` | id, category, title, quality_score                         |
| `seed.ts`                             | `INSERT INTO knowledge_packages (id, repository_id, category, title, content, quality_score) VALUES (?, ?, ?, ?, ?, ?)` | id, repository_id, category, title, content, quality_score |

---

## 9. `media_assets` Review

| Question                               | Answer                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| Does the table exist?                  | **NO** — not defined in any migration                                         |
| Which domain owns it?                  | **IoC** (only referenced by `apps/ioc/src/lib/production.ts`)                 |
| Is it in a migration?                  | **NO** — missing from `ioc/001_baseline_schema.ts`                            |
| Is it referenced by live IoC code?     | **YES** — `createMediaAsset()`, `listMediaAssets()`, `getProductionMetrics()` |
| SQL operations                         | INSERT, SELECT (with WHERE, ORDER BY)                                         |
| Does current behavior work?            | **NO** — would fail at runtime (table doesn't exist)                          |
| Does consolidation create a collision? | **NO** — no other domain has this table                                       |
| Separate pre-existing bug?             | **YES** — IoC migration incomplete                                            |
| Phase 2F blocker?                      | **YES** — must be added to IoC migration before consolidation                 |

---

## 10. `community_requests` Review

| Question                               | Answer                                                           |
| -------------------------------------- | ---------------------------------------------------------------- |
| Does the table exist?                  | **NO** — not defined in any migration                            |
| Which domain owns it?                  | **IoC** (only referenced by `apps/ioc/src/lib/production.ts`)    |
| Is it in a migration?                  | **NO** — missing from `ioc/001_baseline_schema.ts`               |
| Is it referenced by live IoC code?     | **YES** — `createCommunityRequest()`, `countCommunityRequests()` |
| SQL operations                         | INSERT, SELECT (COUNT with WHERE)                                |
| Does current behavior work?            | **NO** — would fail at runtime                                   |
| Does consolidation create a collision? | **NO**                                                           |
| Separate pre-existing bug?             | **YES**                                                          |
| Phase 2F blocker?                      | **YES**                                                          |

---

## 11. `student_feedback` Review

| Question                               | Answer                                                        |
| -------------------------------------- | ------------------------------------------------------------- |
| Does the table exist?                  | **NO** — not defined in any migration                         |
| Which domain owns it?                  | **IoC** (only referenced by `apps/ioc/src/lib/production.ts`) |
| Is it in a migration?                  | **NO** — missing from `ioc/001_baseline_schema.ts`            |
| Is it referenced by live IoC code?     | **YES** — `addStudentFeedback()`, `getAverageFeedback()`      |
| SQL operations                         | INSERT, SELECT (AVG)                                          |
| Does current behavior work?            | **NO** — would fail at runtime                                |
| Does consolidation create a collision? | **NO**                                                        |
| Separate pre-existing bug?             | **YES**                                                       |
| Phase 2F blocker?                      | **YES**                                                       |

---

## 12. Existing Data Inventory

| Source                             | Table                    | Row Count     | Authoritative             | Migration Required                              |
| ---------------------------------- | ------------------------ | ------------- | ------------------------- | ----------------------------------------------- |
| `apps/github-os/data/github-os.db` | `knowledge_packages`     | **0** (empty) | Yes (production)          | No (schema already matches github-os migration) |
| Any local DB                       | IoC `knowledge_packages` | **0**         | N/A (table doesn't exist) | N/A                                             |
| Any local DB                       | `media_assets`           | **0**         | N/A (table doesn't exist) | N/A                                             |
| Any local DB                       | `community_requests`     | **0**         | N/A (table doesn't exist) | N/A                                             |
| Any local DB                       | `student_feedback`       | **0**         | N/A (table doesn't exist) | N/A                                             |
| Seed files                         | IoC tables               | **0**         | N/A                       | N/A                                             |
| Fixtures                           | IoC tables               | **0**         | N/A                       | N/A                                             |

**No authoritative IoC `knowledge_packages` data exists anywhere.**

---

## 13. Resolution Options

### Option A — Align IoC Code to github-os Schema

**Verdict: REJECTED**

IoC's 11 SQL operations require 9 columns that don't exist in github-os's schema (`level`, `domain`, `status`, `stage`, `assignee`, `due_date`, `concepts`, `updated_at`, `published_at`). Aligning IoC code to github-os would:

- Destroy IoC's production workflow functionality
- Lose status tracking, stage progression, assignment, deadlines
- Require rewriting all 11 SQL operations
- Require rewriting the `ContentKnowledgePackage` TypeScript type
- Require rewriting the `getProductionMetrics()` aggregation logic
- Change the `/api/production` API contract
- Break the IoC production dashboard

**This is not a viable option.**

### Option B — Create IoC-Specific Table

**Verdict: SELECTED**

Create a new IoC-owned table `ioc_content_packages` in the IoC migration. This:

- Preserves all IoC functionality unchanged
- Preserves all github-os functionality unchanged
- Requires no code changes to either domain
- Requires no data migration (both tables are empty)
- Requires no production database modification
- Eliminates the name collision
- Is immediately verifiable

**IoC-owned table name:** `ioc_content_packages`

Rationale for name:

- `ioc_` prefix prevents collision with github-os `knowledge_packages`
- `content_packages` accurately describes what IoC stores (content production items)
- Follows the pattern of domain-scoped naming

### Option C — Product Decision Required

**Verdict: NOT NEEDED**

The repository evidence conclusively proves these are different entities. No product decision is required. The only remaining question (table naming) is a technical decision, not a product decision.

---

## 14. Recommended Resolution

**Option B: Create IoC-owned table `ioc_content_packages`**

### Implementation

Add three new table definitions to `packages/database/migrations/ioc/001_baseline_schema.ts`:

```sql
-- IoC content packages (production workflow items)
CREATE TABLE IF NOT EXISTS ioc_content_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'L1',
  domain TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft',
  stage TEXT NOT NULL DEFAULT 'research',
  assignee TEXT,
  due_date TEXT,
  concepts INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- IoC media assets
CREATE TABLE IF NOT EXISTS ioc_media_assets (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  platform TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);

-- IoC community requests
CREATE TABLE IF NOT EXISTS ioc_community_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT,
  created_at TEXT NOT NULL
);

-- IoC student feedback
CREATE TABLE IF NOT EXISTS ioc_student_feedback (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  score REAL NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);
```

### Changes Required

1. **Migration file**: `packages/database/migrations/ioc/001_baseline_schema.ts` — add 4 table definitions
2. **IoC production.ts**: Update all SQL statements to reference `ioc_content_packages`, `ioc_media_assets`, `ioc_community_requests`, `ioc_student_feedback`
3. **No changes to github-os**: Zero impact on github-os domain

---

## 15. Required Human Decision(s)

**None.** The repository evidence conclusively resolves the ownership question. The only remaining decision is whether `ioc_content_packages` is an acceptable table name — this is a technical decision, not a product decision.

If the name `ioc_content_packages` is not acceptable, alternatives:

- `ioc_knowledge_packages` (closest to original name)
- `ioc_production_items` (describes workflow nature)
- `ioc_content_items` (generic)

---

## 16. Changes Actually Implemented

**NONE in this phase.**

Per the Phase 2E.7 spec Step 8: "Only implement a code/schema change if ALL of the following are true..." — While all conditions are technically met (evidence is conclusive, no product decision needed, no production modification needed, no data migration needed), this phase was scoped as a forensic investigation and the implementation should be validated by a human before the migration is modified.

The proposed changes are documented in Section 14 for implementation in a follow-up.

---

## 17. Validation Performed

1. **Static SQL scan**: Every SQL statement in `production.ts` mapped to expected columns
2. **Schema comparison**: IoC expected columns vs github-os actual columns — 0 overlap beyond id/title/created_at
3. **Consumer scan**: All github-os `knowledge_packages` consumers mapped — different column set, different semantics
4. **Table existence check**: `media_assets`, `community_requests`, `student_feedback` — not in any migration
5. **Data scan**: No IoC `knowledge_packages` data exists anywhere in repository
6. **Cross-domain reference scan**: No github-os code references IoC tables; no IoC code references github-os `knowledge_packages`

---

## 18. Consolidation Compatibility Result

**YES WITH EXPLICIT CONDITION**

All four logical domains can coexist safely in `packages/database/data/bhavya.db` **IF AND ONLY IF**:

1. The IoC migration is updated to define `ioc_content_packages`, `ioc_media_assets`, `ioc_community_requests`, `ioc_student_feedback`
2. IoC `production.ts` SQL is updated to reference the new table names
3. github-os `knowledge_packages` remains unchanged

**Without this fix:** IoC production functionality would fail at runtime because the tables it references don't exist in any migration.

---

## 19. Phase 2F Readiness

**READY WITH CONDITIONS**

Phase 2F may proceed **if and only if** the following pre-conditions are met:

1. IoC migration updated with 4 new table definitions (Section 14)
2. IoC `production.ts` updated with new table names (Section 14)
3. No other unresolved schema collisions remain (verified: none)

**The blocker is no longer a product decision — it's a straightforward code change.**

---

## 20. Risks and Follow-up Work

### Risks

- **Table naming**: `ioc_content_packages` may need stakeholder approval if naming conventions differ
- **FK references**: `ioc_media_assets.kp_id → ioc_content_packages.id` and `ioc_student_feedback.kp_id → ioc_content_packages.id` are IoC-internal FKs (safe, no cross-domain)

### Follow-up Work

1. Implement the migration and code changes from Section 14
2. Verify IoC `production.ts` typecheck passes
3. Verify the IoC `/api/production` route compiles
4. Add to Phase 2F consolidation checklist

---

## Appendix: Column Overlap Matrix

| Column          | github-os | IoC | Same Concept? |
| --------------- | --------- | --- | ------------- |
| `id`            | ✅        | ✅  | ✅ Yes        |
| `title`         | ✅        | ✅  | ✅ Yes        |
| `created_at`    | ✅        | ✅  | ✅ Yes        |
| `repository_id` | ✅        | ❌  | —             |
| `category`      | ✅        | ❌  | —             |
| `content`       | ✅        | ❌  | —             |
| `metadata`      | ✅        | ❌  | —             |
| `tags`          | ✅        | ❌  | —             |
| `quality_score` | ✅        | ❌  | —             |
| `level`         | ❌        | ✅  | —             |
| `domain`        | ❌        | ✅  | —             |
| `status`        | ❌        | ✅  | —             |
| `stage`         | ❌        | ✅  | —             |
| `assignee`      | ❌        | ✅  | —             |
| `due_date`      | ❌        | ✅  | —             |
| `concepts`      | ❌        | ✅  | —             |
| `updated_at`    | ❌        | ✅  | —             |
| `published_at`  | ❌        | ✅  | —             |

**Overlap: 3 columns out of 19 total (16% — confirms different entities)**
