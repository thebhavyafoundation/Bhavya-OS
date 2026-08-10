# BHAVYA CAPABILITY INVENTORY

**Date:** 2026-08-09
**Last updated:** 2026-08-10
**Scope:** 9 apps in `apps/` directory (1 canonical, 1 dev tool, 7 migrating)
**Purpose:** Map every capability to its source app for migration into canonical `apps/ai-institute`

---

## SUMMARY

| Metric                           | Count                                       |
| -------------------------------- | ------------------------------------------- |
| Total apps                       | 9 (1 canonical, 1 dev tool, 7 migrating)    |
| Archived apps                    | 14 (in `archive/apps/`)                     |
| Total pages/routes               | ~100 (across 9 apps)                        |
| Packages                         | 65                                          |
| Apps using `@bhavya/platform-ui` | 3 (github-os, social-os, design-system)     |
| Apps with authentication         | 2 (ai-institute, github-os via middleware)  |
| Apps with SQLite                 | 4 (ai-institute, github-os, ioc, social-os) |

---

## APP-BY-APP CAPABILITY MAP

### 1. ai-institute (CANONICAL — 41 pages, 11 components)

**Role:** Becomes Bhavya Foundation Web
**Auth:** Custom session-based (api-auth.ts, bcryptjs)
**Database:** SQLite (better-sqlite3), libsql
**Uses platform-ui:** Yes (dependency)

**Capabilities:**

- `/` — Landing page with hero, stats, principles
- `/courses` — Academy course listing
- `/courses/[id]` — Course detail with modules
- `/courses/[id]/lessons/[id]` — Lesson player
- `/courses/foundations` — Foundations course hub
- `/courses/foundations/lab` — Hands-on lab environment
- `/courses/foundations/check` — Knowledge check
- `/courses/foundations/project` — Capstone project
- `/schools` — School integration
- `/learning-paths` — Learning path browser
- `/knowledge-graph` — Knowledge graph visualization
- `/dashboard` — Student dashboard
- `/profile` — User profile
- `/portfolio` — Student portfolio
- `/projects` — Project showcase
- `/projects/[id]` — Project detail
- `/research` — Research portal
- `/mentor` — Mentor matching
- `/onboarding` — Student onboarding
- `/assessment` — Assessment engine
- `/concepts` — Concept browser
- `/programs` — Program management
- `/playground` — Interactive playground
- `/missions/forest` — Forest mission dashboard
- `/missions/heritage` — Heritage mission dashboard
- `/library` — Digital library
- `/transparency` — Transparency portal
- `/community/volunteer` — Volunteer portal
- `/impact` — Impact tracking
- `/impact/[id]` — Impact detail
- `/about` — About page
- `/mission` — Mission statement
- `/faq` — FAQ
- `/contributing` — Contributing guide
- `/press` — Press/media
- `/privacy` — Privacy policy
- `/terms` — Terms of service
- `/login` — Sign in
- `/register` — Sign up
- `/api/*` — 12 API routes (auth, forest, heritage, library, transparency, volunteers)

---

### 2. website (20 pages, 31 components) — MIGRATE

**Role:** Public foundation website
**Auth:** None
**Database:** None
**Key capabilities to extract:**

- Hero section with cinematic design, particles, parallax
- Mission pages (forest, heritage, knowledge)
- Knowledge packages showcase
- Statistics dashboard
- Principles section
- Trust/transparency section
- Donation page
- About page
- Nature/community/programs pages
- Resources, accessibility pages
- Press page
- Privacy/terms pages

**Unique value:** 31 custom components, GSAP animations, Lenis smooth scroll, extensive motion system

---

### 3. github-os (22 pages, 3 components) — MIGRATE → /os/projects

**Role:** Repository intelligence platform
**Auth:** None (uses platform-ui Avatar)
**Database:** SQLite (better-sqlite3)
**Uses platform-ui:** YES (Card, Badge, Skeleton, Breadcrumb, AppLayout, Avatar)
**Capabilities:**

- Repo listing/detail with fitness scores
- Architecture advisor
- Debt analysis
- Health checks
- Learning mode
- Memory/knowledge graph
- Blueprints/planning
- Reviews
- Student mode
- Timeline
- Comparisons
- Elite repos
- Patterns
- Search

---

### 4. dashboard (12 pages, 0 components) — MIGRATE → /os/dashboard

**Role:** Operational intelligence dashboard
**Auth:** None
**Database:** None (uses @bhavya/content-core, @bhavya/intelligence)
**Capabilities:**

- Governance overview
- Impact analysis/trends
- Lifecycle management
- Memory/playbooks
- Predictive analytics
- Reports
- Resilience metrics
- Stewardship
- Succession planning

---

### 5. admin (5 pages, 8 components) — MIGRATE → /os/admin

**Role:** Platform administration
**Auth:** None
**Database:** None (uses @bhavya/mission-runtime, @bhavya/sdk)
**Capabilities:**

- Overview cards
- Activity feed
- System health
- User management
- Content management
- Releases
- Audit log

---

### 6. knowledge-studio (9 pages, 1 component) — MIGRATE → /os/knowledge-studio

**Role:** Knowledge-to-asset pipeline
**Auth:** NextAuth.js (full auth system)
**Database:** SQLite, Prisma, bcryptjs
**Capabilities:**

- KO ingestion
- BEE pipeline orchestration
- Artifact management
- Versioning with compare/reproduce
- Search
- Packages

---

### 7. lesson-studio (15 pages, 3 components) — MIGRATE → /os/lesson-studio

**Role:** Lesson content creation
**Auth:** None
**Database:** Runtime API client (port 3100)
**Capabilities:**

- Courses/lessons CRUD
- Knowledge browser with KO editor
- Assessment/guide/workbook builders
- Visual spec animation
- Publishing
- Provenance tracking
- Quality gates

---

### 8. bhavya-ai-lab (18 pages, 5 components) — MIGRATE → /os/ai-lab

**Role:** Central knowledge hub
**Auth:** None
**Database:** File-system data
**Capabilities:**

- KO browser
- Course/lesson viewer
- Forest/heritage/governance data
- Memory/observability
- Playbooks
- Runtime stats
- API explorer
- Search
- Video generation
- Volunteer data

---

### 9. research (3 pages, 1 component) — MIGRATE → /research

**Role:** Research lifecycle
**Auth:** None
**Database:** @bhavya/content-core
**Capabilities:**

- Project management (idea → publication)
- Evidence tracking
- Source management
- Reviews
- Project advancement

---

### 10. library (6 pages, 2 components) — MIGRATE → /library

**Role:** Digital library
**Auth:** None
**Database:** @bhavya/content-core
**Capabilities:**

- Browse
- Collections
- Read documents
- Search

---

### 11. transparency (5 pages, 0 components) — MIGRATE → /transparency

**Role:** Public transparency portal
**Auth:** None
**Database:** None (static + API routes)
**Capabilities:**

- Financial disclosures
- Governance docs
- Project updates
- Policies

---

### 12. forest (8 pages, 1 component) — MIGRATE → /missions/forest

**Role:** Forest restoration missions
**Auth:** None
**Database:** @bhavya/content-core, @bhavya/maps, @bhavya/mission-runtime
**Capabilities:**

- Mission CRUD
- Site management
- Planting campaigns
- Impact reports
- Monitoring
- Survey tracking

---

### 13. heritage (7 pages, 1 component) — MIGRATE → /missions/heritage

**Role:** Heritage preservation missions
**Auth:** None
**Database:** @bhavya/content-core
**Capabilities:**

- Asset management
- Assessments
- Conservation plans
- Impact tracking
- Mission CRUD

---

### 14. volunteer (8 pages, 1 component) — MIGRATE → /community/volunteer

**Role:** Volunteer management
**Auth:** None
**Database:** @bhavya/content-core
**Capabilities:**

- Volunteer CRUD
- Assignments
- Participation tracking
- Skills
- Training
- Recognition

---

### 15. ioc (10 pages, 1 component) — MIGRATE → /os/ioc

**Role:** Institution Operations Center
**Auth:** None
**Database:** SQLite (better-sqlite3), uuid
**Capabilities:**

- Dashboard
- Actions/events
- Health monitoring
- OKR tracking
- Production monitoring
- Reviews
- Risks

---

### 16. knowledge (9 pages, 5 components) — MIGRATE → /os/knowledge

**Role:** Institutional knowledge platform
**Auth:** None
**Database:** @bhavya/content-core, @bhavya/intelligence
**Capabilities:**

- Document management
- Collections
- Entities
- Knowledge graph
- Relationships
- Search
- Analytics
- Recommendations

---

### 17. social-os (3 pages, 0 components) — MIGRATE → /community/social

**Role:** Institutional communication
**Auth:** None
**Database:** SQLite, @bhavya/events, @bhavya/platform
**Capabilities:**

- CEO dashboard
- Campaign engine
- Editorial calendar
- Community intelligence
- Constitutional compliance
- Analytics

---

### 18. docs (8 pages, 2 components) — MIGRATE → /docs

**Role:** Platform documentation
**Auth:** None
**Database:** @bhavya/mission-runtime, @bhavya/sdk
**Capabilities:**

- Governance docs
- Policies
- ADRs
- Standards
- Releases
- Knowledge graph
- Search

---

### 19. design-system (7 pages, 1 component) — MIGRATE → /os/design-system

**Role:** Design system reference
**Auth:** None
**Database:** None (static reference)
**Capabilities:**

- Tokens reference
- Components reference
- Icons reference
- Typography reference
- Patterns reference
- Playground

---

### 20-23. SHELL APPS (archive — no migration needed)

| App                         | Pages | Notes                                   |
| --------------------------- | ----- | --------------------------------------- |
| bhavya-intelligence-network | 1     | Shell, functionality → /os/intelligence |
| capability-center           | 1     | Shell, merges into intelligence network |
| github-intelligence-lab     | 1     | Shell, merges into intelligence network |
| open-source-intelligence    | 1     | Shell, merges into intelligence network |

---

## MIGRATION PRIORITY

### Wave 1: Foundation/Public (from website)

- Hero, about, mission, donate, press, privacy, terms
- Motion system (GSAP, Lenis, particles)

### Wave 2: Learning (from bhavya-ai-lab, lesson-studio)

- KO browser, lesson viewer, video generation
- Assessment/guide/workbook builders

### Wave 3: Knowledge (from knowledge, knowledge-studio)

- Document management, collections, entities
- Knowledge graph, relationships

### Wave 4: Operations (from admin, dashboard, ioc)

- Admin dashboard, system health
- Impact analysis, governance

### Wave 5: Intelligence (from github-os, research)

- Repository analysis, fitness scores
- Research lifecycle

### Wave 6: Community (from volunteer, social-os, library, forest, heritage)

- Volunteer management
- Campaign engine
- Mission dashboards
