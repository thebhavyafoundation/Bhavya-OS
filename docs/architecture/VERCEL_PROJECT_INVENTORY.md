# VERCEL PROJECT INVENTORY

**Date:** 2026-08-09
**Organization:** bhavya-foundation
**Custom Domain:** bhavyafoundation.org
**Total Vercel Projects:** 16
**Total Local Apps:** 23

---

## VERCEL PROJECTS (16)

| #   | Project Name                  | Production URL                                           | Local App            | Pages | Status | Disposition                             |
| --- | ----------------------------- | -------------------------------------------------------- | -------------------- | ----- | ------ | --------------------------------------- |
| 1   | `ai-institute`                | ai-institute-bhavya-foundation.vercel.app                | `apps/ai-institute`  | 36    | Ready  | **CANONICAL**                           |
| 2   | `admin`                       | admin-bhavya-foundation.vercel.app                       | `apps/admin`         | 5     | Ready  | MIGRATE → `/os/admin`                   |
| 3   | `website`                     | website-bhavya-foundation.vercel.app                     | `apps/website`       | 20    | Ready  | MIGRATE → `/about`, `/missions`, etc.   |
| 4   | `bhavya-ai-lab`               | bhavya-ai-lab-bhavya-foundation.vercel.app               | `apps/bhavya-ai-lab` | 18    | Ready  | MIGRATE → `/ai-lab`                     |
| 5   | `dashboard`                   | dashboard-bhavya-foundation.vercel.app                   | `apps/dashboard`     | 12    | Ready  | MIGRATE → `/dashboard` (already exists) |
| 6   | `heritage`                    | heritage-bhavya-foundation.vercel.app                    | `apps/heritage`      | 7     | Ready  | MIGRATE → `/missions/heritage`          |
| 7   | `library`                     | library-bhavya-foundation.vercel.app                     | `apps/library`       | 6     | Ready  | MIGRATE → `/library`                    |
| 8   | `research`                    | research-bhavya-foundation.vercel.app                    | `apps/research`      | 3     | Ready  | MIGRATE → `/research`                   |
| 9   | `design-system`               | design-system-bhavya-foundation.vercel.app               | `apps/design-system` | 7     | Ready  | MIGRATE → `/os/design-system`           |
| 10  | `docs`                        | docs-bhavya-foundation.vercel.app                        | `apps/docs`          | 8     | Ready  | MIGRATE → `/docs`                       |
| 11  | `forest`                      | forest-bhavya-foundation.vercel.app                      | `apps/forest`        | 8     | Ready  | MIGRATE → `/missions/forest`            |
| 12  | `transparency`                | transparency-bhavya-foundation.vercel.app                | `apps/transparency`  | 5     | Ready  | MIGRATE → `/transparency`               |
| 13  | `volunteer`                   | volunteer-bhavya-foundation.vercel.app                   | `apps/volunteer`     | 8     | Ready  | MIGRATE → `/community/volunteer`        |
| 14  | `bhavya-foundation-website`   | bhavya-foundation-website-bhavya-foundation.vercel.app   | NONE                 | -     | Ready  | **DELETE** (duplicate of `website`)     |
| 15  | `bhavya-foundation-dashboard` | bhavya-foundation-dashboard-bhavya-foundation.vercel.app | NONE                 | -     | Ready  | **DELETE** (duplicate of `dashboard`)   |
| 16  | `knowledge`                   | knowledge-woad-six.vercel.app                            | `apps/knowledge`     | 9     | Ready  | MIGRATE → `/knowledge`                  |

---

## LOCAL APPS WITHOUT VERCEL PROJECTS (8)

| #   | Local App                     | Pages | Status | Disposition                       |
| --- | ----------------------------- | ----- | ------ | --------------------------------- |
| 1   | `bhavya-intelligence-network` | 1     | Shell  | ARCHIVE (no unique functionality) |
| 2   | `capability-center`           | 1     | Shell  | ARCHIVE (no unique functionality) |
| 3   | `github-intelligence-lab`     | 1     | Shell  | ARCHIVE (no unique functionality) |
| 4   | `github-os`                   | 22    | Active | MIGRATE → `/os/projects`          |
| 5   | `ioc`                         | 10    | Active | MIGRATE → `/ioc`                  |
| 6   | `knowledge-studio`            | 9     | Active | MIGRATE → `/os/knowledge-studio`  |
| 7   | `lesson-studio`               | 15    | Active | MIGRATE → `/os/lesson-studio`     |
| 8   | `open-source-intelligence`    | 1     | Shell  | ARCHIVE (no unique functionality) |
| 9   | `social-os`                   | 3     | Active | MIGRATE → `/community`            |

---

## SUMMARY

| Category                            | Count              |
| ----------------------------------- | ------------------ |
| **Vercel Projects**                 | 16                 |
| **Local Apps**                      | 23                 |
| **Active Local Apps**               | 19                 |
| **Shell Local Apps**                | 4                  |
| **Apps with Vercel Projects**       | 16                 |
| **Apps without Vercel Projects**    | 8                  |
| **Duplicate Vercel Projects**       | 2 (to DELETE)      |
| **Canonical App**                   | 1 (`ai-institute`) |
| **Unique Functionality to Migrate** | ~15 apps           |
| **Shells to Archive**               | 4                  |

---

## DEPLOYMENT STATUS

All 16 Vercel projects show "Ready" status with production deployments updated within the last 1-10 days.

**Production Traffic:** Unknown — requires Vercel analytics audit.

**Environment Variables:** Each project may have its own env vars. Must be audited before migration.

**Database Dependencies:** `ai-institute` uses SQLite/Turso. Other apps may have different data sources.

**Authentication:** Each project may have its own auth configuration. Must be unified.

---

## NEXT STEPS

1. Audit environment variables for each project
2. Audit database dependencies
3. Audit authentication configuration
4. Audit custom domains and redirects
5. Create CANONICAL_APPLICATION_MAP.md
6. Begin migration
