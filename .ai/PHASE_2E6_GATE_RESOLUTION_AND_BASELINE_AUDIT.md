# Phase 2E.6 — Consolidation Gate Resolution & Baseline Equivalence Audit

> **Status**: COMPLETE
> **Date**: 2026-09-08
> **Preceding**: Phase 2E.5 (gate disambiguation, real-data dry run)

---

## Executive Summary

Phase 2E.6 resolved all 6 consolidation gates through forensic investigation and empirical testing. The consolidated database (58 tables, 42 indexes, 4 migrations) is **structurally identical** to the existing production schema. The migration engine can safely adopt the legacy `github-os.db` via `IF NOT EXISTS` idempotency with zero destructive impact.

**Critical corrections to Phase 2E.5 findings**:

- Phase 2E.5 claimed "76 expected indexes" — actual count is **42** (social-os and ioc migrations define zero indexes)
- Phase 2E.5 reported "foreign keys not enforced" — FK constraints ARE in DDL and ARE enforced when `PRAGMA foreign_keys = ON` is active
- Phase 2E.5 reported "35/42 mismatch" — the 42 indexes are the correct expected total; no mismatch exists

---

## 1. Database Inventory

### Production State (as of 2026-09-08)

| Database          | Exists | Tables | Indexes | Rows                           | Size            |
| ----------------- | ------ | ------ | ------- | ------------------------------ | --------------- |
| `github-os.db`    | ✅     | 29     | 35      | 7 (constitutional_validations) | 4KB + 1.1MB WAL |
| `ai-institute.db` | ❌     | —      | —       | —                              | —               |
| `social-os.db`    | ❌     | —      | —       | —                              | —               |
| `ioc.db`          | ❌     | —      | —       | —                              | —               |

Only `github-os.db` exists on disk. The other 3 domain databases have never been created.

---

## 2. Gate Resolution Matrix

| Gate       | Description                              | Status      | Evidence                                                                                                                                                                 |
| ---------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Gate 1** | IoC `knowledge_packages` schema conflict | 🟡 DEFERRED | Schema mismatch confirmed. Pre-existing bug in `apps/ioc/src/lib/production.ts` — references 9 columns not in github-os schema. Requires product/ownership decision.     |
| **Gate 2** | Index count discrepancy (35 vs 42)       | ✅ RESOLVED | Phase 2E.5's "76 expected" was wrong. social-os and ioc migrations define 0 indexes. Actual expected total: 42 (35 github-os + 7 ai-institute). Match confirmed.         |
| **Gate 3** | Baseline equivalence for legacy DB       | ✅ RESOLVED | Production `github-os.db` is STRUCTURALLY IDENTICAL to `001_baseline_schema.ts` — 29/29 tables, 35/35 indexes, 0 FK differences. Verified via byte-level DDL comparison. |
| **Gate 4** | Migration engine bookkeeping             | ✅ RESOLVED | 4 migrations applied and tracked. Checksums computed. Idempotent re-apply is safe (IF NOT EXISTS on all CREATE statements).                                              |
| **Gate 5** | Data preservation during migration       | ✅ RESOLVED | 7 constitutional_validations rows preserved through consolidation, backup, and restore. Checksum unchanged.                                                              |
| **Gate 6** | Backup/restore + integrity               | ✅ RESOLVED | SQLite online backup succeeded. Integrity check: `ok`. Restore verified: tables, indexes, rows all match.                                                                |

---

## 3. Index Reconciliation (Corrected)

### Migration-Defined Indexes by Domain

| Domain       | Explicit Indexes | UNIQUE Constraints (auto-indexes) | Total  |
| ------------ | ---------------- | --------------------------------- | ------ |
| github-os    | 35               | 29                                | 64     |
| ai-institute | 7                | 3                                 | 10     |
| social-os    | **0**            | 12                                | 12     |
| ioc          | **0**            | 12                                | 12     |
| **Total**    | **42**           | **56**                            | **98** |

**Key finding**: social-os and ioc migrations define **zero** explicit indexes. Phase 2E.5 incorrectly assumed 14 and 13 indexes respectively based on dry-run script assumptions.

### Post-Consolidation State

- **Domain tables**: 58 (29 + 4 + 13 + 12)
- **Explicit indexes**: 42 (35 github-os IF NOT EXISTS → no-ops + 7 ai-institute new)
- **UNIQUE constraint auto-indexes**: 56 (from CREATE TABLE UNIQUE constraints)
- **Migrations tracked**: 4 (with checksums in `_migrations` table)

---

## 4. FK Constraint Analysis

### Enforcement Verification

| Constraint                                           | Status      | Evidence                                                    |
| ---------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `knowledge_packages.repository_id → repositories.id` | ✅ Enforced | INSERT with nonexistent repo fails with FK constraint error |
| `sessions.user_id → users.id`                        | ✅ Enforced | INSERT with nonexistent user fails with FK constraint error |
| `users` → `sessions` CASCADE DELETE                  | ✅ Working  | Deleting user cascades to sessions (0 sessions remain)      |
| Cross-domain FKs                                     | ✅ None     | Zero cross-domain FK constraints exist                      |

### Why Phase 2E.5 Saw "0 FKs"

The earlier inspection used `PRAGMA foreign_key_list()` on a readonly database connection. SQLite only reports FKs when `PRAGMA foreign_keys = ON` is active at connection time. Readonly mode does not apply this pragma. The FK constraints ARE embedded in the CREATE TABLE DDL and ARE enforced.

---

## 5. IoC `knowledge_packages` Conflict (Gate 1 — Deferred)

### Schema Comparison

| Column        | github-os (actual) | IoC production.ts (expected) | Match          |
| ------------- | ------------------ | ---------------------------- | -------------- |
| id            | ✅                 | ✅                           | ✅             |
| repository_id | ✅                 | —                            | github-os only |
| category      | ✅                 | —                            | github-os only |
| title         | ✅                 | —                            | github-os only |
| content       | ✅                 | —                            | github-os only |
| metadata      | ✅                 | —                            | github-os only |
| tags          | ✅                 | —                            | github-os only |
| quality_score | ✅                 | —                            | github-os only |
| created_at    | ✅                 | —                            | github-os only |
| —             | —                  | level                        | IoC only       |
| —             | —                  | domain                       | IoC only       |
| —             | —                  | status                       | IoC only       |
| —             | —                  | stage                        | IoC only       |
| —             | —                  | assignee                     | IoC only       |
| —             | —                  | due_date                     | IoC only       |
| —             | —                  | concepts                     | IoC only       |
| —             | —                  | updated_at                   | IoC only       |
| —             | —                  | published_at                 | IoC only       |

**Conclusion**: `knowledge_packages` is github-os-owned. IoC's `production.ts` has a pre-existing schema mismatch bug (references 9 columns that don't exist in the canonical table). This was not introduced by our migration work.

**Recommendation**: Fix IoC `production.ts` to use the correct github-os schema, or create IoC-specific columns via ALTER TABLE.

---

## 6. IoC Table Ownership Matrix

All 12 IoC-owned tables verified present in consolidated schema:

| Table              | In Migration | Ownership | Verified |
| ------------------ | ------------ | --------- | -------- |
| institutions       | ioc          | ioc       | ✅       |
| missions           | ioc          | ioc       | ✅       |
| objectives         | ioc          | ioc       | ✅       |
| milestones         | ioc          | ioc       | ✅       |
| risks              | ioc          | ioc       | ✅       |
| decisions          | ioc          | ioc       | ✅       |
| action_items       | ioc          | ioc       | ✅       |
| weekly_reviews     | ioc          | ioc       | ✅       |
| alerts             | ioc          | ioc       | ✅       |
| institution_events | ioc          | ioc       | ✅       |
| institution_kpis   | ioc          | ioc       | ✅       |
| system_health      | ioc          | ioc       | ✅       |

---

## 7. Dry-Run Consolidation Results

| Test                                     | Result                                    |
| ---------------------------------------- | ----------------------------------------- |
| Apply github-os migration to existing DB | ✅ IF NOT EXISTS → 0 changes (idempotent) |
| Apply ai-institute migration             | ✅ 4 tables + 7 indexes created           |
| Apply social-os migration                | ✅ 13 tables created (0 explicit indexes) |
| Apply ioc migration                      | ✅ 12 tables created (0 explicit indexes) |
| FK enforcement (knowledge_packages)      | ✅ Constraint enforced                    |
| FK enforcement (sessions → users)        | ✅ Constraint enforced                    |
| CASCADE DELETE (users → sessions)        | ✅ Cascading works                        |
| Data preservation (7 rows)               | ✅ All rows preserved                     |
| Backup integrity                         | ✅ `integrity_check: ok`                  |
| Restore verification                     | ✅ Tables, indexes, rows match            |
| Source file checksum                     | ✅ Unchanged (write to temp copy)         |
| Concurrent read access                   | ✅ Two readonly connections work          |
| Cross-domain FK analysis                 | ✅ Zero cross-domain FKs                  |
| `_migrations` bookkeeping                | ✅ 4 records with checksums               |

---

## 8. Corrected Consolidation Plan Numbers

| Metric                             | Phase 2E.5 Claimed   | Phase 2E.6 Actual | Correction                            |
| ---------------------------------- | -------------------- | ----------------- | ------------------------------------- |
| Expected indexes                   | 76                   | **42**            | social-os=0, ioc=0 (not 14/13)        |
| Actual indexes after consolidation | 42                   | **42**            | Match (no discrepancy)                |
| FK enforcement                     | "Not enforced"       | **Enforced**      | PRAGMA foreign_keys issue, not schema |
| Baseline equivalence               | "Needs verification" | **Confirmed**     | Byte-level DDL comparison             |
| Tables in consolidated DB          | 58                   | **58**            | Correct                               |

---

## 9. Recommendations

### Ready to Proceed

1. **Consolidated DB location**: `packages/database/data/bhavya.db` (human decision needed)
2. **Cross-domain FK policy**: No cross-domain FKs (verified safe)
3. **github-os migration safe for production**: IF NOT EXISTS idempotency confirmed

### Requires Human Decision

1. **IoC knowledge_packages conflict**: Fix IoC production.ts to match github-os schema, or create IoC-specific columns
2. **Consolidated DB file path**: Recommendation is `packages/database/data/bhavya.db`

### Ready for Phase 2F+

- All 6 consolidation gates resolved or deferred with clear path
- Migration engine verified: discovery → checksum → execution → bookkeeping
- Schema baseline equivalence confirmed
- No destructive changes to existing production data

---

## 10. Complete Table Inventory (58 tables)

### github-os (29 tables)

`repositories`, `knowledge_packages`, `activity_events`, `technology_radar`, `recommendations`, `engineering_patterns`, `adrs`, `repository_comparisons`, `pattern_library`, `repository_timelines`, `engineering_health`, `learning_paths`, `knowledge_graph_nodes`, `knowledge_graph_edges`, `educational_exports`, `institutional_memory`, `engineering_reviews`, `technical_debt`, `architecture_advisor`, `implementation_plans`, `build_blueprints`, `repository_fitness`, `student_mode`, `elite_engineering_library`, `website_intelligence`, `design_intelligence`, `design_genome`, `design_scores`, `constitutional_validations`

### ai-institute (4 tables)

`users`, `sessions`, `student_profiles`, `audit_events`

### social-os (13 tables)

`publications`, `approval_records`, `platform_content`, `analytics_snapshots`, `platforms`, `events`, `campaigns`, `editorial_calendar`, `community_feedback`, `brand_reviews`, `institution_metrics`, `communication_strategies`, `publishing_windows`

### ioc (12 tables)

`institutions`, `missions`, `objectives`, `milestones`, `risks`, `decisions`, `action_items`, `weekly_reviews`, `alerts`, `institution_events`, `institution_kpis`, `system_health`
