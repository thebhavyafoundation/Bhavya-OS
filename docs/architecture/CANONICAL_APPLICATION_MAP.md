# CANONICAL APPLICATION MAP

**Date:** 2026-08-09
**Last updated:** 2026-08-10
**Canonical App:** `apps/ai-institute` → **Bhavya Foundation Web**
**Canonical Package:** `@bhavya/ai-institute`
**Status:** Product consolidation plan approved — 9 apps → 1 canonical + 1 dev tool

---

## ARCHITECTURE

```
                         BHAVYA FOUNDATION
                               │
                               ▼
                    ONE CANONICAL WEB APP
                    (apps/ai-institute)
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
       ▼                       ▼                        ▼
   PUBLIC WEB              BHAVYA OS               ACADEMY
       │                       │                        │
       ├── /about              ├── /os/admin            ├── /courses
       ├── /missions           ├── /os/knowledge-studio ├── /courses/[id]
       │   ├── /forest         ├── /os/lesson-studio    ├── /courses/[id]/lessons/[id]
       │   ├── /heritage       ├── /os/video-studio     ├── /labs
       │   └── /knowledge      ├── /os/intelligence     ├── /assessments
       ├── /research           ├── /os/ioc              └── /progress
       ├── /library            ├── /os/projects
       ├── /transparency       └── /os/design-system
       ├── /community
       │   ├── /volunteer
       │   └── /social
       ├── /impact
       └── /donate
```

---

## LEGACY APP → CANONICAL ROUTE MAPPING

### CANONICAL (1)

| Legacy App     | Canonical Route | Package             | Status        | Notes                         |
| -------------- | --------------- | ------------------- | ------------- | ----------------------------- |
| `ai-institute` | `/` (root)      | `apps/ai-institute` | **CANONICAL** | Becomes Bhavya Foundation Web |

---

### PUBLIC WEB (migrate from `website`)

| Legacy App | Canonical Route | Package            | Status    | Notes                               |
| ---------- | --------------- | ------------------ | --------- | ----------------------------------- |
| `website`  | `/about`        | Extract components | MIGRATING | Hero, mission, principles, donation |
| `website`  | `/missions`     | Extract components | MIGRATING | Mission pages                       |
| `website`  | `/press`        | Extract components | MIGRATING | Press/media                         |
| `website`  | `/privacy`      | Extract components | MIGRATING | Privacy policy                      |
| `website`  | `/terms`        | Extract components | MIGRATING | Terms of service                    |
| `website`  | `/donate`       | Extract components | MIGRATING | Donation page                       |

---

### MISSIONS (migrate from mission apps)

| Legacy App  | Canonical Route       | Package                         | Status    | Notes                                           |
| ----------- | --------------------- | ------------------------------- | --------- | ----------------------------------------------- |
| `forest`    | `/missions/forest`    | `packages/forest`               | MIGRATING | Forest restoration missions, sites, plantings   |
| `heritage`  | `/missions/heritage`  | `packages/heritage`             | MIGRATING | Heritage preservation missions                  |
| `knowledge` | `/missions/knowledge` | Merge into `packages/knowledge` | MIGRATING | Knowledge mission (merge with knowledge-studio) |

---

### LEARN (already partially in ai-institute)

| Legacy App     | Canonical Route              | Package             | Status    | Notes                              |
| -------------- | ---------------------------- | ------------------- | --------- | ---------------------------------- |
| `ai-institute` | `/courses`                   | `apps/ai-institute` | EXISTS    | Academy courses                    |
| `ai-institute` | `/courses/[id]`              | `apps/ai-institute` | EXISTS    | Course detail                      |
| `ai-institute` | `/courses/[id]/lessons/[id]` | `apps/ai-institute` | EXISTS    | Lesson player                      |
| `library`      | `/library`                   | `packages/library`  | MIGRATING | Digital library browse/search/read |
| `research`     | `/research`                  | `packages/research` | MIGRATING | Research projects/sources/evidence |

---

### BHAVYA OS (internal tooling)

| Legacy App                    | Canonical Route        | Package                     | Status    | Notes                         |
| ----------------------------- | ---------------------- | --------------------------- | --------- | ----------------------------- |
| `admin`                       | `/os/admin`            | `packages/admin`            | MIGRATING | Platform operations dashboard |
| `knowledge-studio`            | `/os/knowledge-studio` | `packages/knowledge-studio` | MIGRATING | Knowledge ingestion pipeline  |
| `lesson-studio`               | `/os/lesson-studio`    | `packages/lesson-studio`    | MIGRATING | Lesson creation via runtime   |
| `bhavya-intelligence-network` | `/os/intelligence`     | `packages/intelligence`     | MIGRATING | Autonomous intelligence loop  |
| `ioc`                         | `/os/ioc`              | `packages/ioc`              | MIGRATING | Institution Operations Center |
| `github-os`                   | `/os/projects`         | `packages/github-os`        | MIGRATING | Repository analysis           |
| `design-system`               | `/os/design-system`    | `packages/design-system`    | MIGRATING | Design reference (dev tool)   |

---

### COMMUNITY

| Legacy App  | Canonical Route        | Package              | Status    | Notes                       |
| ----------- | ---------------------- | -------------------- | --------- | --------------------------- |
| `volunteer` | `/community/volunteer` | `packages/volunteer` | MIGRATING | Volunteer management        |
| `social-os` | `/community/social`    | `packages/social-os` | MIGRATING | Institutional communication |

---

### PUBLIC DATA

| Legacy App     | Canonical Route | Package                 | Status    | Notes                                              |
| -------------- | --------------- | ----------------------- | --------- | -------------------------------------------------- |
| `transparency` | `/transparency` | `packages/transparency` | MIGRATING | Public transparency portal                         |
| `dashboard`    | `/dashboard`    | `packages/dashboard`    | MIGRATING | Analytics/metrics (already exists in ai-institute) |

---

### DOCS

| Legacy App | Canonical Route | Package         | Status    | Notes                       |
| ---------- | --------------- | --------------- | --------- | --------------------------- |
| `docs`     | `/docs`         | `packages/docs` | MIGRATING | Institutional documentation |

---

### DUPLICATE → CONSOLIDATE (do not migrate as separate routes)

| Legacy App                 | Consolidation Target                     | Status        | Notes                                            |
| -------------------------- | ---------------------------------------- | ------------- | ------------------------------------------------ |
| `knowledge`                | Merge into `knowledge-studio`            | CONSOLIDATING | Overlaps with knowledge-studio and bhavya-ai-lab |
| `capability-center`        | Merge into `bhavya-intelligence-network` | CONSOLIDATING | Overlaps with intelligence network               |
| `github-intelligence-lab`  | Merge into `bhavya-intelligence-network` | CONSOLIDATING | Overlaps with intelligence network               |
| `open-source-intelligence` | Merge into `bhavya-intelligence-network` | CONSOLIDATING | Overlaps with intelligence network               |

---

### SHELL → ARCHIVE (no migration needed)

| Legacy App                    | Status    | Notes                                          |
| ----------------------------- | --------- | ---------------------------------------------- |
| `bhavya-intelligence-network` | ARCHIVING | Functionality moves to `/os/intelligence`      |
| `capability-center`           | ARCHIVING | Functionality merges into intelligence network |
| `github-intelligence-lab`     | ARCHIVING | Functionality merges into intelligence network |
| `open-source-intelligence`    | ARCHIVING | Functionality merges into intelligence network |

---

### VERCEL PROJECTS → DELETE (after migration)

| Vercel Project                | Disposition | Notes                    |
| ----------------------------- | ----------- | ------------------------ |
| `bhavya-foundation-website`   | DELETE      | Duplicate of `website`   |
| `bhavya-foundation-dashboard` | DELETE      | Duplicate of `dashboard` |

---

## MIGRATION PRIORITY

### Phase 1: Core Platform (HIGH)

1. `website` → `/about`, `/missions`, `/donate`
2. `forest` → `/missions/forest`
3. `heritage` → `/missions/heritage`
4. `library` → `/library`
5. `research` → `/research`
6. `transparency` → `/transparency`

### Phase 2: Bhavya OS (MEDIUM)

7. `admin` → `/os/admin`
8. `knowledge-studio` → `/os/knowledge-studio`
9. `lesson-studio` → `/os/lesson-studio`
10. `bhavya-intelligence-network` → `/os/intelligence`
11. `ioc` → `/os/ioc`
12. `github-os` → `/os/projects`
13. `design-system` → `/os/design-system`

### Phase 3: Community (LOW)

14. `volunteer` → `/community/volunteer`
15. `social-os` → `/community/social`

### Phase 4: Docs (LOW)

16. `docs` → `/docs`

---

## DEPENDENCIES

Before migration, audit:

- [ ] Environment variables for each app
- [ ] Database connections (SQLite/Turso/Postgres)
- [ ] Authentication configuration
- [ ] API routes and their dependencies
- [ ] External service connections
- [ ] File system dependencies
- [ ] Cron jobs and webhooks
