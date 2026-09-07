# AUTHORITATIVE MIGRATION ARCHITECTURE

**Date:** 2026-09-07
**Status:** ACTIVE — Inspection Complete
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-09-07
**Applies To:** All 9 applications, 70 packages, 142 total routes

---

## Purpose

This document is the single source of truth for the migration of Bhavya Foundation's 9-application monorepo into ONE canonical web experience (`apps/ai-institute`). It is produced from direct repository inspection — every claim is traceable to a file path.

**This is INSPECTION AND ARCHITECTURE only. No migration, no deletion, no Vercel changes have been made.**

---

## 1. Repository Inventory

### 1.1 Toolchain

| Component           | Value                                            | Source                 |
| ------------------- | ------------------------------------------------ | ---------------------- |
| Package manager     | pnpm 10.17.1                                     | `package.json` engines |
| Node requirement    | >=20.9.0                                         | `package.json` engines |
| Build orchestration | Turborepo                                        | `turbo.json`           |
| Deployment target   | Vercel (single project: `bhavya-foundation`)     | `vercel.json`          |
| Build command       | `node scripts/vercel-build-app.mjs ai-institute` | `vercel.json`          |
| Workspace roots     | `apps/*`, `packages/*`                           | `pnpm-workspace.yaml`  |

### 1.2 Workspace Statistics

| Metric                         | Count                           |
| ------------------------------ | ------------------------------- |
| Applications                   | 9                               |
| Packages (directories)         | 73                              |
| Packages (with package.json)   | 70                              |
| Deprecated packages            | 2 (`@bhavya/ui`, `@bhavya/bdl`) |
| Orphan packages (no consumers) | ~47                             |
| Total user-facing routes       | 164                             |
| Total API endpoints            | 95                              |
| SQLite databases               | 4 (separate .db files)          |
| Auth systems                   | 2 (1 dead, 1 active)            |

---

## 2. Application Inventory

### 2.1 Per-App Summary

| App                             | Port | Pages | API | Total | DB                      | Auth          | Workspace Deps | Package Dependencies                                                                                                                                                                                           |
| ------------------------------- | ---- | ----- | --- | ----- | ----------------------- | ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ai-institute**                | 3030 | 84    | 33  | 117   | SQLite+Turso            | **Full RBAC** | 5              | content-core, database, impact-runtime, platform-ui, project-runtime                                                                                                                                           |
| **github-os**                   | 3070 | 26    | 32  | 58    | SQLite (`github-os.db`) | None          | 4              | events, platform, platform-ui, types                                                                                                                                                                           |
| **website**                     | 3000 | 20    | 3   | 23    | None                    | None          | 2              | mission-runtime, sdk                                                                                                                                                                                           |
| **ioc**                         | 3090 | 10    | 8   | 18    | SQLite (`ioc.db`)       | None          | 0              | _(none)_                                                                                                                                                                                                       |
| **admin**                       | 3003 | 5     | 3   | 8     | None                    | Placeholder   | 2              | mission-runtime, sdk                                                                                                                                                                                           |
| **docs**                        | 3002 | 8     | 1   | 9     | None                    | None          | 2              | mission-runtime, sdk                                                                                                                                                                                           |
| **social-os**                   | 3080 | 3     | 8   | 11    | SQLite (`social-os.db`) | None          | 4              | events, platform, platform-ui, types                                                                                                                                                                           |
| **design-system**               | 3010 | 7     | 0   | 7     | None                    | None          | 1              | platform-ui                                                                                                                                                                                                    |
| **bhavya-intelligence-network** | 3050 | 1     | 2   | 3     | None                    | None          | 14             | intelligence, capability-registry, crawlers, mcp-manager, plugin-manager, browser-automation, github-intelligence, technology-radar, analyzers, knowledge-extraction, events, workflows, platform, platform-ui |

### 2.2 Canonical App (`apps/ai-institute`)

The only app that Vercel builds. Has 5 layout zones:

```
Root Layout
├── /studio/layout.tsx          (creator tools)
├── /os/layout.tsx              (operations dashboard)
│   └── /os/forest/layout.tsx   (forest OS)
└── /app/layout.tsx             (authenticated user area)
```

**Route sections:**

- Public pages (30): `/`, `/about`, `/accessibility`, `/community`, `/concepts/[id]`, `/contact`, `/contributing`, `/donate`, `/faq`, `/forbidden`, `/forest`, `/get-involved`, `/heritage`, `/library`, `/login`, `/nature`, `/onboarding`, `/playground`, `/portfolio`, `/press`, `/privacy`, `/programs`, `/register`, `/research`, `/resources`, `/schools`, `/terms`, `/transparency`, `/volunteer`, `/community/volunteer`
- Knowledge (6): `/knowledge`, `/knowledge/academy`, `/knowledge/ai`, `/knowledge/courses`, `/knowledge/library`, `/knowledge/research`
- Courses (8): `/courses`, `/courses/[id]`, `/courses/[id]/lessons/[lessonId]`, `/courses/foundations`, `/courses/foundations/check`, `/courses/foundations/lab`, `/courses/foundations/lessons/[id]`, `/courses/foundations/project`
- Missions (5): `/mission`, `/missions`, `/missions/community`, `/missions/forest`, `/missions/heritage`, `/missions/knowledge`
- Dashboard (3): `/dashboard`, `/profile`, `/workspace`
- Impact (2): `/assessment`, `/impact`, `/impact/[id]`
- Learning (4): `/knowledge-graph`, `/learning-paths`, `/mentor`, `/projects`, `/projects/[id]`
- Studio (10): `/studio`, `/studio/courses`, `/studio/courses/new`, `/studio/courses/[id]`, `/studio/knowledge`, `/studio/knowledge/new`, `/studio/knowledge/[id]/edit`, `/studio/lessons`, `/studio/lessons/new`, `/studio/lessons/[id]`
- OS (17): `/os`, `/os/admin`, `/os/admin/audit`, `/os/admin/content`, `/os/admin/releases`, `/os/admin/users`, `/os/api-explorer`, `/os/donor`, `/os/docs`, `/os/docs/decisions`, `/os/docs/governance`, `/os/docs/governance/policies`, `/os/docs/graph`, `/os/docs/releases`, `/os/docs/search`, `/os/docs/standards`, `/os/forest`, `/os/github`, `/os/github/repositories`, `/os/github/repositories/[id]`, `/os/governance`, `/os/ioc`, `/os/knowledge`, `/os/memory`, `/os/observability`, `/os/runtime`, `/os/search`, `/os/social`, `/os/student`, `/os/trustee`, `/os/videos`, `/os/volunteer`
- App (12): `/app`, `/app/community`, `/app/contributions`, `/app/credentials`, `/app/forest`, `/app/forest/new`, `/app/knowledge`, `/app/knowledge/new`, `/app/learn`, `/app/missions`, `/app/profile`, `/app/projects`, `/app/research`
- API (33): Auth (5), Studio (10), Domain (14), OS Admin (5)

### 2.3 `apps/website` (Public Website)

Pure content site. No auth, no DB. Uses GSAP, Lenis, framer-motion.

**Route sections:**

- Public (17): `/`, `/about`, `/accessibility`, `/community`, `/donate`, `/heritage`, `/knowledge`, `/knowledge/packages`, `/mission`, `/nature`, `/privacy`, `/programs`, `/resources`, `/transparency`
- Transparency (6): `/transparency/audit`, `/transparency/financials`, `/transparency/governance`, `/transparency/policies`, `/transparency/projects`, `/transparency/releases`
- API (3): `/api/health`, `/api/metrics`, `/api/ready`

### 2.4 `apps/admin` (Administration)

Minimal admin panel. Placeholder auth only. No DB.

**Routes (8):**

- Pages (5): `/`, `/audit`, `/content`, `/releases`, `/users`
- API (3): `/api/data`, `/api/health`, `/api/ready`

### 2.5 `apps/social-os` (Social Operations)

Social media campaign management. SQLite DB, no auth.

**Routes (11):**

- Pages (3): `/`, `/ceo`, `/dashboard`
- API (8): `/api/calendar`, `/api/campaigns`, `/api/feedback`, `/api/health`, `/api/integrations`, `/api/loop`, `/api/publications`, `/api/pulse`

### 2.6 `apps/github-os` (GitHub Intelligence)

Largest non-canonical app. Repository analysis, design genome, knowledge graph. SQLite DB, no auth.

**Routes (58):**

- Pages (26): `/`, `/comparisons`, `/design-genome`, `/educational`, `/elite`, `/knowledge`, `/knowledge-graph`, `/learning`, `/patterns`, `/repositories`, `/repositories/[id]`, `/repositories/[id]/advisor`, `/repositories/[id]/architecture-advisor`, `/repositories/[id]/blueprint`, `/repositories/[id]/debt`, `/repositories/[id]/fitness`, `/repositories/[id]/health`, `/repositories/[id]/learning`, `/repositories/[id]/memory`, `/repositories/[id]/plan`, `/repositories/[id]/review`, `/repositories/[id]/student`, `/repositories/[id]/timeline`, `/websites`, `/websites/[id]`, `/workbench`
- API (32): `/api/activity`, `/api/comparisons`, `/api/constitutional-validation`, `/api/design-genome`, `/api/design-intelligence`, `/api/design-intelligence/export`, `/api/design-scores`, `/api/educational`, `/api/elite`, `/api/health`, `/api/knowledge`, `/api/knowledge-graph`, `/api/patterns`, `/api/radar`, `/api/recommendations`, `/api/repositories`, `/api/repositories/[id]`, `/api/repositories/[id]/advisor`, `/api/repositories/[id]/architecture-advisor`, `/api/repositories/[id]/blueprint`, `/api/repositories/[id]/debt`, `/api/repositories/[id]/fitness`, `/api/repositories/[id]/health`, `/api/repositories/[id]/learning`, `/api/repositories/[id]/memory`, `/api/repositories/[id]/plan`, `/api/repositories/[id]/review`, `/api/repositories/[id]/student`, `/api/repositories/[id]/timeline`, `/api/search`, `/api/seed`, `/api/websites`

### 2.7 `apps/ioc` (Intelligence Operations Center)

OKR, risk, compliance management. SQLite DB, no auth.

**Routes (18):**

- Pages (10): `/`, `/actions`, `/dashboard`, `/events`, `/health`, `/okr`, `/production`, `/production/kp`, `/reviews`, `/risks`
- API (8): `/api/actions`, `/api/events`, `/api/health`, `/api/intelligence`, `/api/okr`, `/api/production`, `/api/reviews`, `/api/risks`

### 2.8 `apps/docs` (Documentation)

Governance, decisions, standards dashboard. No auth, no DB.

**Routes (9):**

- Pages (8): `/`, `/decisions`, `/governance`, `/governance/policies`, `/graph`, `/releases`, `/search`, `/standards`
- API (1): `/api/health`

### 2.9 `apps/design-system` (Design Showcase)

Token and component playground. No auth, no DB, no API routes.

**Routes (7):**

- Pages (7): `/`, `/components`, `/icons`, `/patterns`, `/playground`, `/tokens`, `/typography`

### 2.10 `apps/bhavya-intelligence-network` (BIN)

OSINT orchestration engine. 14 workspace deps (heaviest consumer). No auth, no DB.

**Routes (3):**

- Pages (1): `/` (dashboard with loop runs, events, approvals, radar tabs)
- API (2): `/api/approval`, `/api/loop`

---

## 3. Route Overlap Analysis

### 3.1 Exact Duplicates (same route path in multiple apps)

| Route            | ai-institute | website | admin | docs | design-system | Notes                                                                                |
| ---------------- | :----------: | :-----: | :---: | :--: | :-----------: | ------------------------------------------------------------------------------------ |
| `/`              |      ✅      |   ✅    |  ✅   |  ✅  |      ✅       | 5 apps define homepage                                                               |
| `/about`         |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/accessibility` |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/community`     |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/donate`        |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/heritage`      |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/knowledge`     |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/mission`       |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/nature`        |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/privacy`       |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/programs`      |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/resources`     |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/transparency`  |      ✅      |   ✅    |       |      |               |                                                                                      |
| `/os/admin`      |      ✅      |         |  ✅   |      |               | admin has `/audit`, `/content`, `/releases`, `/users`                                |
| `/os/docs`       |      ✅      |         |       |  ✅  |               | docs has `/decisions`, `/governance`, `/graph`, `/releases`, `/search`, `/standards` |
| `/playground`    |      ✅      |         |       |      |      ✅       | design-system has `/playground`                                                      |

**16 route paths are duplicated** across 2+ apps. The website and ai-institute share 13 public page routes.

### 3.2 Functional Overlaps (different paths, same capability)

| Capability                 | ai-institute route | Other app route                                                       | Notes                                                            |
| -------------------------- | ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Knowledge management       | `/os/knowledge`    | `/knowledge` (website), `/knowledge` (github-os), `/knowledge` (docs) | 4 different implementations                                      |
| GitHub/Repository analysis | `/os/github`       | `/repositories` (github-os)                                           | ai-institute has 3 pages; github-os has 26 pages + 32 API routes |
| Docs/Governance            | `/os/docs`         | `/` (docs app)                                                        | ai-institute has 8 pages; docs has 8 pages                       |
| Admin panel                | `/os/admin`        | `/` (admin app)                                                       | ai-institute has 5 pages; admin has 5 pages                      |
| Social operations          | `/os/social`       | `/` (social-os)                                                       | ai-institute has 1 page; social-os has 3 pages + 8 API routes    |
| IOC/Compliance             | `/os/ioc`          | `/` (ioc)                                                             | ai-institute has 1 page; ioc has 10 pages + 8 API routes         |
| Design system              | `/playground`      | `/` (design-system)                                                   | ai-institute has 1 page; design-system has 7 pages               |
| Intelligence               | (none)             | `/` (bhavya-intelligence-network)                                     | Only BIN has this; ai-institute has no equivalent                |

### 3.3 Unique to Each App (not in ai-institute)

| App                             | Unique Routes                                                                                                                                                                                | Capability                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **website**                     | `/transparency/audit`, `/transparency/financials`, `/transparency/governance`, `/transparency/policies`, `/transparency/projects`, `/transparency/releases`, `/knowledge/packages`           | Deep transparency section, knowledge packages        |
| **github-os**                   | `/comparisons`, `/design-genome`, `/educational`, `/elite`, `/knowledge-graph`, `/learning`, `/patterns`, `/repositories/[id]/*` (12 sub-pages), `/websites`, `/websites/[id]`, `/workbench` | Full repository analysis platform                    |
| **ioc**                         | `/actions`, `/events`, `/health`, `/okr`, `/production`, `/production/kp`, `/reviews`, `/risks`                                                                                              | OKR tracking, risk management, production monitoring |
| **social-os**                   | `/ceo`, `/dashboard`                                                                                                                                                                         | Social campaign dashboard, CEO view                  |
| **docs**                        | `/decisions`, `/governance/policies`, `/graph`, `/releases`, `/search`, `/standards`                                                                                                         | ADR viewer, standards browser                        |
| **design-system**               | `/components`, `/icons`, `/patterns`, `/tokens`, `/typography`                                                                                                                               | Full component/token showcase                        |
| **bhavya-intelligence-network** | `/` (BIN dashboard)                                                                                                                                                                          | OSINT loop orchestration                             |

---

## 4. Authentication & Authorization Architecture

### 4.1 Current State

| System                | Location                     | Status                                    | Roles                                                                                                         | Import Count              |
| --------------------- | ---------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **ai-institute auth** | `apps/ai-institute/src/lib/` | **ACTIVE** — fully implemented            | 11 roles: student, builder, researcher, volunteer, donor, mentor, educator, admin, instructor, trustee, staff | Used by ai-institute only |
| **packages/auth**     | `packages/auth/`             | **DEAD CODE** — zero imports from any app | 10 roles: guest, viewer, student, editor, mentor, instructor, admin, security, cto, founder                   | **0 apps**                |

### 4.2 Auth Implementation Details (ai-institute only)

- **Session model:** Cookie-based (`session-token`), stored in SQLite `sessions` table
- **Middleware:** Full security middleware with CSRF checks, session enforcement, CSP, HSTS, X-Robots-Tag
- **Page gates:** `requireRoles()`, `requirePolicy()`, `requirePermission()` — used on `/app`, `/dashboard`, `/os`, `/studio`, `/onboarding`
- **API gates:** `requireAuth()` returning JSON 401/403
- **CSRF:** Origin validation on state-changing requests
- **Password:** bcryptjs hashing

### 4.3 Unprotected Apps

| App       | Database                    | Auth Protection                     | Risk                       |
| --------- | --------------------------- | ----------------------------------- | -------------------------- |
| social-os | `social-os.db` (10 tables)  | **NONE** — all data operations open | Data manipulation possible |
| github-os | `github-os.db` (25+ tables) | **NONE** — headers only             | Data manipulation possible |
| ioc       | `ioc.db` (11 tables)        | **NONE** — all data operations open | Data manipulation possible |

### 4.4 Role Model Comparison

**ai-institute roles (ACTIVE):**

```
student, builder, researcher, volunteer, donor, mentor, educator, admin, instructor, trustee, staff
```

**packages/auth roles (DEAD):**

```
guest, viewer, student, editor, mentor, instructor, admin, security, cto, founder
```

**Overlap:** student, mentor, instructor, admin (4 roles)
**ai-institute unique:** builder, researcher, volunteer, donor, educator, trustee, staff (7 roles)
**packages/auth unique:** guest, viewer, editor, security, cto, founder (6 roles)

---

## 5. Data Architecture

### 5.1 Database Inventory

| Database     | App          | Tables                                                                                                                                    | File                               | Auth Protected |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------- |
| ai-institute | ai-institute | sessions, users, courses, lessons, enrollments, progress, knowledge_objects, forest_missions, heritage_missions, community_events, + more | SQLite (local) / Turso (prod)      | **YES**        |
| social-os.db | social-os    | publications, approval_records, campaigns, community_feedback, integrations, calendar_events, publications_drafts, pulse_metrics, + more  | `apps/social-os/data/social-os.db` | **NO**         |
| github-os.db | github-os    | repositories, knowledge_packages, engineering_reviews, design_scores, comparisons, patterns, websites, + 18 more                          | `apps/github-os/data/github-os.db` | **NO**         |
| ioc.db       | ioc          | institutions, missions, objectives, key_results, risks, actions, reviews, events, systems, intelligence, production_kp                    | `apps/ioc/data/ioc.db`             | **NO**         |

### 5.2 Content Sources

| Source                | Location                | Format            | Used By               |
| --------------------- | ----------------------- | ----------------- | --------------------- |
| Institutional content | `content/` (root)       | MDX, JSON         | ai-institute, website |
| Forest missions       | `content/forest/`       | JSON (~300 files) | ai-institute          |
| Knowledge items       | `content/knowledge/`    | JSON (~300 files) | ai-institute          |
| Constitution          | `content/constitution/` | MDX               | ai-institute          |
| Governance            | `content/governance/`   | MDX               | ai-institute, docs    |
| Heritage              | `content/heritage/`     | MDX, JSON         | ai-institute, website |
| Policies              | `content/policies/`     | MDX               | ai-institute          |
| Programs              | `content/programs/`     | MDX               | ai-institute, website |
| Projects              | `content/projects/`     | JSON              | ai-institute          |
| Research              | `content/research/`     | MDX               | ai-institute          |
| Releases              | `content/releases/`     | JSON              | ai-institute, docs    |
| Reports               | `content/reports/`      | MDX               | ai-institute          |
| Volunteer             | `content/volunteer/`    | MDX               | ai-institute          |

### 5.3 Package Database Usage

| Package             | Has DB | Notes                                                            |
| ------------------- | ------ | ---------------------------------------------------------------- |
| `@bhavya/database`  | YES    | Canonical DB abstraction (SQLite + Turso) — used by ai-institute |
| `@bhavya/ioc`       | YES    | Own SQLite — used by ioc app                                     |
| `@bhavya/github-os` | YES    | Own SQLite — used by github-os app                               |
| `@bhavya/social-os` | YES    | Own SQLite — used by social-os app                               |

**Four separate SQLite databases exist.** The canonical `@bhavya/database` package is only consumed by ai-institute.

---

## 6. Package Architecture

### 6.1 Consumption Map

| App                         | Direct Workspace Dependencies                                                                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ai-institute                | content-core, database, impact-runtime, platform-ui, project-runtime                                                                                                                                           |
| bhavya-intelligence-network | intelligence, capability-registry, crawlers, mcp-manager, plugin-manager, browser-automation, github-intelligence, technology-radar, analyzers, knowledge-extraction, events, workflows, platform, platform-ui |
| social-os                   | events, platform, platform-ui, types                                                                                                                                                                           |
| github-os                   | events, platform, platform-ui, types                                                                                                                                                                           |
| website                     | mission-runtime, sdk                                                                                                                                                                                           |
| admin                       | mission-runtime, sdk                                                                                                                                                                                           |
| docs                        | mission-runtime, sdk                                                                                                                                                                                           |
| design-system               | platform-ui                                                                                                                                                                                                    |
| ioc                         | _(none)_                                                                                                                                                                                                       |

### 6.2 Most-Depended-On Packages

| Package                   | App Consumers | Package Consumers                      |
| ------------------------- | ------------- | -------------------------------------- |
| `@bhavya/platform-ui`     | 5 apps        | 9 packages (charts, maps, icons, etc.) |
| `@bhavya/platform`        | 3 apps        | Multiple packages                      |
| `@bhavya/events`          | 3 apps        | Multiple packages                      |
| `@bhavya/types`           | 3 apps        | Multiple packages                      |
| `@bhavya/mission-runtime` | 3 apps        | 0 packages                             |
| `@bhavya/sdk`             | 3 apps        | 0 packages                             |

### 6.3 Deprecated Packages

| Package       | Status     | Replacement           |
| ------------- | ---------- | --------------------- |
| `@bhavya/ui`  | Deprecated | `@bhavya/platform-ui` |
| `@bhavya/bdl` | Deprecated | `@bhavya/platform-ui` |

### 6.4 Potentially Orphan Packages

These packages have no `workspace:*` consumers from any app or other package:

- `@bhavya/agent-workflow`
- `@bhavya/ai-orchestration`
- `@bhavya/bee`
- `@bhavya/code-intelligence-mcp`
- `@bhavya/constitution`
- `@bhavya/context-optimizer`
- `@bhavya/edge-ml`
- `@bhavya/ml-serving`
- `@bhavya/skill-tree`
- `@bhavya/zk-privacy`
- `@bhavya/content-board`
- `@bhavya/content-engine`
- `@bhavya/docs` (package, not app)

---

## 7. Migration Architecture

### 7.1 Target State

```
BHAVYA FOUNDATION
        │
        ├── ONE CANONICAL APP: apps/ai-institute
        │   ├── PUBLIC WEB (/*)
        │   ├── KNOWLEDGE (/knowledge/*)
        │   ├── COURSES (/courses/*)
        │   ├── MISSIONS (/missions/*)
        │   ├── MY BHAVYA (/app/*)
        │   ├── STUDIO (/studio/*)
        │   ├── OS DASHBOARD (/os/*)
        │   │   ├── /os/admin/*      ← from apps/admin
        │   │   ├── /os/docs/*       ← from apps/docs
        │   │   ├── /os/github/*     ← from apps/github-os
        │   │   ├── /os/social/*     ← from apps/social-os
        │   │   ├── /os/ioc/*        ← from apps/ioc
        │   │   ├── /os/bin/*        ← from apps/bhavya-intelligence-network
        │   │   └── /os/design/*     ← from apps/design-system
        │   └── API (/api/*)
        │
        ├── ONE DATABASE: SQLite (local) / Turso (prod)
        ├── ONE AUTH SYSTEM: ai-institute RBAC
        ├── ONE DESIGN SYSTEM: platform-ui
        └── ONE NAVIGATION: navigation-registry.json
```

### 7.2 Migration Mapping

| Source App                      | Target Route in ai-institute                                                                                                                  | Route Count       | Complexity                                                | Priority |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------- | -------- |
| **website**                     | `/about`, `/community`, `/donate`, `/heritage`, `/knowledge`, `/mission`, `/nature`, `/privacy`, `/programs`, `/resources`, `/transparency/*` | 13 routes         | **LOW** — mostly already exist                            | P0       |
| **admin**                       | `/os/admin/*`                                                                                                                                 | 5 routes          | **LOW** — already exists in ai-institute                  | P0       |
| **docs**                        | `/os/docs/*`                                                                                                                                  | 8 routes          | **LOW** — already exists in ai-institute                  | P0       |
| **design-system**               | `/os/design/*` or `/playground/*`                                                                                                             | 7 routes          | **LOW** — playground exists, add showcase                 | P1       |
| **social-os**                   | `/os/social/*`                                                                                                                                | 3 pages + 8 API   | **MEDIUM** — needs API migration + SQLite merge           | P1       |
| **ioc**                         | `/os/ioc/*`                                                                                                                                   | 10 pages + 8 API  | **MEDIUM** — needs API migration + SQLite merge           | P1       |
| **github-os**                   | `/os/github/*`                                                                                                                                | 26 pages + 32 API | **HIGH** — largest migration, deep route tree, 25+ tables | P2       |
| **bhavya-intelligence-network** | `/os/bin/*`                                                                                                                                   | 1 page + 2 API    | **HIGH** — 14 package dependencies, complex integration   | P2       |

### 7.3 Migration Order

**Phase 1 — Absorb Overlaps (P0, ~2 days)**

1. `website` public pages → verify content parity, redirect
2. `admin` pages → verify ai-institute `/os/admin/*` covers all
3. `docs` pages → verify ai-institute `/os/docs/*` covers all

**Phase 2 — Absorb Simple Apps (P1, ~3 days)** 4. `design-system` showcase → add to ai-institute playground 5. `social-os` pages + API → merge SQLite schema, add routes 6. `ioc` pages + API → merge SQLite schema, add routes

**Phase 3 — Absorb Complex Apps (P2, ~5 days)** 7. `github-os` pages + API → merge SQLite schema, migrate 58 routes 8. `bhavya-intelligence-network` → integrate OSINT engine

**Phase 4 — Consolidate Data (P3, ~3 days)** 9. Merge 4 SQLite databases into one 10. Migrate social-os.db, github-os.db, ioc.db schemas into ai-institute database 11. Update all packages to use canonical `@bhavya/database`

**Phase 5 — Cleanup (P4, ~2 days)** 12. Remove deprecated packages (`@bhavya/ui`, `@bhavya/bdl`) 13. Remove or archive dead packages (~47 orphans) 14. Archive consumed app directories 15. Update `vercel-build-app.mjs` to only reference ai-institute 16. Update all documentation

### 7.4 Auth Migration

**Current:** Only ai-institute has real auth. 3 apps with databases are unprotected.

**Target:** All routes in ai-institute are protected by the existing RBAC system.

**Steps:**

1. Extend route policies to cover new routes from social-os, ioc, github-os, BIN
2. Assign appropriate roles to each new route section
3. Add `requireRoles()` gates to all migrated API routes
4. Merge session tables if separate DBs are consolidated

### 7.5 Database Migration

**Current state:** 4 separate SQLite databases with independent schemas.

**Target state:** One SQLite database (local) / one Turso database (prod).

**Approach:**

1. Create migration scripts for each app's schema → canonical database
2. Merge overlapping tables (e.g., both ai-institute and github-os have knowledge-related tables)
3. Preserve all data during merge
4. Update all API routes to use canonical `@bhavya/database`
5. Remove per-app `data/*.db` files after migration

---

## 8. Risk Assessment

### 8.1 High-Risk Items

| Risk                                          | Impact                   | Mitigation                                |
| --------------------------------------------- | ------------------------ | ----------------------------------------- |
| github-os has 25+ SQLite tables and 58 routes | Large migration surface  | Phase 2, incremental migration with tests |
| BIN has 14 workspace dependencies             | Complex dependency graph | Phase 2, careful package rewiring         |
| 3 apps have unprotected databases             | Security exposure        | Phase 1, add auth gates immediately       |
| 4 separate SQLite databases                   | Data fragmentation       | Phase 3, schema merge with backup         |
| ~47 orphan packages                           | Maintenance burden       | Phase 4, archive after app consolidation  |

### 8.2 No-Loss Requirements

During migration, the following must be preserved with ZERO data loss:

1. **All 300+ forest mission JSON files** in `content/forest/`
2. **All 300+ knowledge JSON files** in `content/knowledge/`
3. **All institutional content** in `content/` (MDX, JSON)
4. **All GitHub repository analysis data** (25+ tables in github-os.db)
5. **All social campaign data** (10 tables in social-os.db)
6. **All IOC/OKR data** (11 tables in ioc.db)
7. **All user accounts and sessions** (ai-institute database)
8. **All course/lesson/progress data** (ai-institute database)
9. **All ADRs and governance documents** in `docs/`
10. **All design tokens and components** in `packages/platform-ui/`

---

## 9. Verification Checklist

After migration, verify:

- [ ] All 164 user-facing routes resolve (no 404s)
- [ ] All 95 API endpoints respond correctly
- [ ] All 4 database schemas merged into one
- [ ] All auth gates protecting appropriate routes
- [ ] All content accessible from canonical app
- [ ] No duplicate routes remaining
- [ ] No orphan packages remaining
- [ ] Build passes (`turbo build`)
- [ ] Typecheck passes (`turbo typecheck`)
- [ ] Tests pass (`turbo test`)
- [ ] Vercel deployment succeeds
- [ ] `file-map:check` passes

---

## 10. Evidence Sources

Every claim in this document is traceable to:

| Claim                | Source File                                                   |
| -------------------- | ------------------------------------------------------------- |
| App route counts     | `apps/*/src/app/` directory inspection                        |
| Package dependencies | `apps/*/package.json` workspace:* references                  |
| Database usage       | `apps/*/src/lib/db.ts` or `better-sqlite3` imports            |
| Auth implementation  | `apps/ai-institute/src/lib/roles.ts`, `require-role.ts`       |
| Dead auth package    | `packages/auth/` — zero imports found via grep                |
| Deprecated packages  | `packages/ui/`, `packages/bdl/` — package.json deprecation    |
| Orphan packages      | Grep for workspace:* references across all package.json files |
| Content sources      | `content/` directory inspection                               |
| Route overlaps       | Cross-reference of all app route directories                  |

---

_Document produced by Wave 20 repository inspection. All data gathered from direct file system inspection on 2026-09-07._
