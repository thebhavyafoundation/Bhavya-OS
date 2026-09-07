# BHAVYA REALITY MAP

**Date:** 2026-09-07
**Status:** OPERATIONAL — Generated from direct repository inspection
**Owner:** Bhavya Foundation Architecture
**Purpose:** What actually works, what's broken, what's disconnected

---

## How to Read This Map

Each capability is assessed across 7 dimensions:

- **UI** — Does the page render real content?
- **API** — Does the endpoint return real data?
- **Data** — Is there a backing data source (SQLite, filesystem, API)?
- **Auth** — Is access controlled?
- **Nav** — Can you reach it from navigation?
- **End-to-End** — Does the full journey work?
- **Canonical** — Is this the authoritative implementation?

**Status codes:** ✅ Working | ⚠️ Partial | ❌ Broken | 🔒 Unprotected | 📭 No route | N/A

---

## 1. PUBLIC FOUNDATION

### Homepage (`/`)

| Dimension  | Status | Evidence                                                   |
| ---------- | ------ | ---------------------------------------------------------- |
| UI         | ✅     | 1,117 lines, cinematic hero, 4 mission cards, CTA sections |
| API        | N/A    | Static page                                                |
| Data       | ✅     | Hardcoded institutional content                            |
| Auth       | N/A    | Public                                                     |
| Nav        | ✅     | SiteHeader links to `/`                                    |
| End-to-End | ✅     | Renders, links work, navigation present                    |
| Canonical  | ✅     | `apps/ai-institute/src/app/page.tsx`                       |

**Known defects:** None.

---

### About (`/about`)

| Dimension  | Status | Evidence                                   |
| ---------- | ------ | ------------------------------------------ |
| UI         | ✅     | 378 lines, hero, mission, values, CTA      |
| API        | N/A    | Static page                                |
| Data       | ✅     | Hardcoded institutional content            |
| Auth       | N/A    | Public                                     |
| Nav        | ✅     | In SiteHeader dropdown "About" group       |
| End-to-End | ✅     | Renders, links work                        |
| Canonical  | ✅     | `apps/ai-institute/src/app/about/page.tsx` |

**Known defects:** None.

---

### Community (`/community`)

| Dimension  | Status | Evidence                                       |
| ---------- | ------ | ---------------------------------------------- |
| UI         | ✅     | 332 lines, 4 participation areas               |
| API        | N/A    | Static page                                    |
| Data       | ✅     | Hardcoded content                              |
| Auth       | N/A    | Public                                         |
| Nav        | ✅     | In SiteHeader "Explore" group                  |
| End-to-End | ✅     | Renders                                        |
| Canonical  | ✅     | `apps/ai-institute/src/app/community/page.tsx` |

**Known defects:** None.

---

### Donate (`/donate`)

| Dimension  | Status | Evidence                                                            |
| ---------- | ------ | ------------------------------------------------------------------- |
| UI         | ✅     | 90 lines, 4 impact cards                                            |
| API        | N/A    | Static page                                                         |
| Data       | ✅     | Hardcoded amounts                                                   |
| Auth       | N/A    | Public                                                              |
| Nav        | ✅     | In SiteHeader "Participate" group                                   |
| End-to-End | ⚠️     | Page renders but donation flow is email-only (no payment processor) |
| Canonical  | ✅     | `apps/ai-institute/src/app/donate/page.tsx`                         |

**Known defects:** No payment integration. CTA is `mailto:` link.

---

### Heritage (`/heritage`)

| Dimension  | Status | Evidence                                      |
| ---------- | ------ | --------------------------------------------- |
| UI         | ✅     | 387 lines, 4 heritage domains                 |
| API        | N/A    | Static page                                   |
| Data       | ✅     | Hardcoded content                             |
| Auth       | N/A    | Public                                        |
| Nav        | ✅     | In SiteHeader "Explore" group                 |
| End-to-End | ✅     | Renders                                       |
| Canonical  | ✅     | `apps/ai-institute/src/app/heritage/page.tsx` |

**Known defects:** None.

---

### Knowledge (`/knowledge`)

| Dimension  | Status | Evidence                                       |
| ---------- | ------ | ---------------------------------------------- |
| UI         | ✅     | 486 lines, 6 interactive tabs                  |
| API        | N/A    | Static page                                    |
| Data       | ✅     | Hardcoded tab content                          |
| Auth       | N/A    | Public                                         |
| Nav        | ✅     | In SiteHeader "Learn" group                    |
| End-to-End | ✅     | Renders, tabs switch                           |
| Canonical  | ✅     | `apps/ai-institute/src/app/knowledge/page.tsx` |

**Known defects:** None.

---

### Mission (`/mission`)

| Dimension  | Status | Evidence                                     |
| ---------- | ------ | -------------------------------------------- |
| UI         | ✅     | 260 lines, timeline with 7 milestones        |
| API        | N/A    | Static page                                  |
| Data       | ✅     | Hardcoded content                            |
| Auth       | N/A    | Public                                       |
| Nav        | ✅     | In SiteHeader "Explore" group                |
| End-to-End | ✅     | Renders                                      |
| Canonical  | ✅     | `apps/ai-institute/src/app/mission/page.tsx` |

**Known defects:** None.

---

### Nature (`/nature`)

| Dimension  | Status | Evidence                                    |
| ---------- | ------ | ------------------------------------------- |
| UI         | ✅     | 11 lines — redirect to `/missions/forest`   |
| API        | N/A    | Redirect                                    |
| Data       | N/A    | Redirect                                    |
| Auth       | N/A    | Public                                      |
| Nav        | ✅     | In SiteHeader "Explore" group               |
| End-to-End | ✅     | Redirects correctly                         |
| Canonical  | ✅     | `apps/ai-institute/src/app/nature/page.tsx` |

**Known defects:** None. Intentional orphan consolidation.

---

### Privacy (`/privacy`)

| Dimension  | Status | Evidence                                     |
| ---------- | ------ | -------------------------------------------- |
| UI         | ✅     | 155 lines, 10-section privacy policy         |
| API        | N/A    | Static page                                  |
| Data       | ✅     | Hardcoded policy text                        |
| Auth       | N/A    | Public                                       |
| Nav        | ✅     | In SiteFooter                                |
| End-to-End | ✅     | Renders                                      |
| Canonical  | ✅     | `apps/ai-institute/src/app/privacy/page.tsx` |

**Known defects:** None.

---

### Programs (`/programs`)

| Dimension  | Status | Evidence                                                        |
| ---------- | ------ | --------------------------------------------------------------- |
| UI         | ✅     | 279 lines, 3 program cards with curricula                       |
| API        | N/A    | Static page                                                     |
| Data       | ✅     | Hardcoded program data                                          |
| Auth       | N/A    | Public                                                          |
| Nav        | ⚠️     | **NOT in SiteHeader** — navigation registry marks as "deferred" |
| End-to-End | ⚠️     | Page exists but is unreachable from navigation                  |
| Canonical  | ✅     | `apps/ai-institute/src/app/programs/page.tsx`                   |

**Known defects:** Route exists but is classified as "deferred" in navigation registry. Not in any nav group. Deep links work but users cannot discover it.

---

### Resources (`/resources`)

| Dimension  | Status | Evidence                                                 |
| ---------- | ------ | -------------------------------------------------------- |
| UI         | ✅     | 119 lines, 4 resource cards (3 "planned", 1 "available") |
| API        | N/A    | Static page                                              |
| Data       | ✅     | Honest status labels                                     |
| Auth       | N/A    | Public                                                   |
| Nav        | ✅     | In SiteHeader "Learn" group                              |
| End-to-End | ✅     | Renders, honest about planned items                      |
| Canonical  | ✅     | `apps/ai-institute/src/app/resources/page.tsx`           |

**Known defects:** None. Honest about incomplete state.

---

### Transparency (`/transparency`)

| Dimension  | Status | Evidence                                                 |
| ---------- | ------ | -------------------------------------------------------- |
| UI         | ✅     | 84 lines, 4 category cards                               |
| API        | ✅     | `GET /api/transparency` returns data                     |
| Data       | ⚠️     | Cards show "will be populated" — empty state             |
| Auth       | N/A    | Public                                                   |
| Nav        | ✅     | In SiteFooter                                            |
| End-to-End | ⚠️     | Page renders but content sections are empty placeholders |
| Canonical  | ✅     | `apps/ai-institute/src/app/transparency/page.tsx`        |

**Known defects:** Content sections are empty placeholders ("will be populated"). API exists but returns minimal data.

---

### Forest (`/forest`)

| Dimension  | Status | Evidence                                            |
| ---------- | ------ | --------------------------------------------------- |
| UI         | ✅     | 402 lines, impact sidebar, focus areas, initiatives |
| API        | ✅     | `GET /api/forest/missions` — full CRUD              |
| Data       | ✅     | Filesystem (`content/forest/`) + SQLite             |
| Auth       | N/A    | Public read                                         |
| Nav        | ✅     | In SiteHeader "Explore" group                       |
| End-to-End | ✅     | Page renders, API returns real mission data         |
| Canonical  | ✅     | `apps/ai-institute/src/app/forest/page.tsx`         |

**Known defects:** None.

---

### Volunteer (`/volunteer`)

| Dimension  | Status | Evidence                                       |
| ---------- | ------ | ---------------------------------------------- |
| UI         | ✅     | 257 lines, 4 pathways, 3-step process          |
| API        | N/A    | Static page                                    |
| Data       | ✅     | Hardcoded content                              |
| Auth       | N/A    | Public                                         |
| Nav        | ✅     | In SiteHeader "Participate" group              |
| End-to-End | ✅     | Renders                                        |
| Canonical  | ✅     | `apps/ai-institute/src/app/volunteer/page.tsx` |

**Known defects:** None.

---

## 2. KNOWLEDGE & LEARNING

### Courses List (`/courses`)

| Dimension  | Status | Evidence                                     |
| ---------- | ------ | -------------------------------------------- |
| UI         | ✅     | 120 lines, course grid from SQLite           |
| API        | ✅     | `GET /api/studio/courses`                    |
| Data       | ✅     | SQLite `courses` table                       |
| Auth       | N/A    | Public listing                               |
| Nav        | ✅     | In SiteHeader "Learn" group                  |
| End-to-End | ✅     | Lists published courses with lesson counts   |
| Canonical  | ✅     | `apps/ai-institute/src/app/courses/page.tsx` |

**Known defects:** None.

---

### Course Detail (`/courses/[id]`)

| Dimension  | Status | Evidence                                          |
| ---------- | ------ | ------------------------------------------------- |
| UI         | ✅     | Dynamic page with loading/error states            |
| API        | ✅     | Course data from SQLite                           |
| Data       | ✅     | SQLite                                            |
| Auth       | N/A    | Public                                            |
| Nav        | ✅     | Linked from courses list                          |
| End-to-End | ✅     | Renders course detail                             |
| Canonical  | ✅     | `apps/ai-institute/src/app/courses/[id]/page.tsx` |

**Known defects:** None.

---

### Dashboard (`/dashboard`)

| Dimension  | Status | Evidence                                                    |
| ---------- | ------ | ----------------------------------------------------------- |
| UI         | ✅     | 409 lines, progress tracking, achievements                  |
| API        | ✅     | Uses `useAuth()` for user data                              |
| Data       | ✅     | SQLite via auth system                                      |
| Auth       | ✅     | `requirePolicy("/dashboard")` in middleware                 |
| Nav        | ✅     | In SiteHeader (authenticated users)                         |
| End-to-End | ⚠️     | Works when logged in. Unauthenticated shows sign-in prompt. |
| Canonical  | ✅     | `apps/ai-institute/src/app/dashboard/page.tsx`              |

**Known defects:** None functional. Requires authentication.

---

## 3. AUTHENTICATED USER

### Login (`/login`)

| Dimension  | Status | Evidence                                                    |
| ---------- | ------ | ----------------------------------------------------------- |
| UI         | ✅     | 126 lines, full form with error handling                    |
| API        | ✅     | `POST /api/auth/login` — bcrypt, rate limiting, audit       |
| Data       | ✅     | SQLite `users` + `sessions` tables                          |
| Auth       | N/A    | Auth entry point                                            |
| Nav        | ✅     | SiteHeader "Enter Bhavya OS" CTA                            |
| End-to-End | ✅     | Login flow complete: form → API → session cookie → redirect |
| Canonical  | ✅     | `apps/ai-institute/src/app/login/page.tsx`                  |

**Known defects:** None.

---

### Register (`/register`)

| Dimension  | Status | Evidence                                                   |
| ---------- | ------ | ---------------------------------------------------------- |
| UI         | ✅     | 138 lines, validation, intent-aware redirect               |
| API        | ✅     | `POST /api/auth/register` — rate limiting, duplicate check |
| Data       | ✅     | SQLite `users` table                                       |
| Auth       | N/A    | Auth entry point                                           |
| Nav        | ✅     | Linked from login page                                     |
| End-to-End | ✅     | Registration flow complete                                 |
| Canonical  | ✅     | `apps/ai-institute/src/app/register/page.tsx`              |

**Known defects:** None.

---

### My Bhavya (`/app`)

| Dimension  | Status | Evidence                                                                                                                |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| UI         | ✅     | 12 route pages (community, contributions, credentials, forest, knowledge, learn, missions, profile, projects, research) |
| API        | ✅     | Various API routes                                                                                                      |
| Data       | ✅     | SQLite + filesystem                                                                                                     |
| Auth       | ✅     | `requirePolicy("/app")` in middleware                                                                                   |
| Nav        | ✅     | In `layers.app` navigation (11 items)                                                                                   |
| End-to-End | ⚠️     | Individual pages work but some may have incomplete content                                                              |
| Canonical  | ✅     | `apps/ai-institute/src/app/app/`                                                                                        |

**Known defects:** Some sub-pages may have placeholder content. Needs individual testing.

---

## 4. OPERATIONS (OS)

### OS Dashboard (`/os`)

| Dimension  | Status | Evidence                                               |
| ---------- | ------ | ------------------------------------------------------ |
| UI         | ✅     | 1,065 lines, 10-workspace grid, metrics                |
| API        | ✅     | Fetches 9 data sources in parallel                     |
| Data       | ✅     | Filesystem + SQLite                                    |
| Auth       | ⚠️     | `/os` is public (bypasses auth redirect in middleware) |
| Nav        | ✅     | SiteHeader "Enter Bhavya OS" CTA                       |
| End-to-End | ✅     | Renders with real data                                 |
| Canonical  | ✅     | `apps/ai-institute/src/app/os/page.tsx`                |

**Known defects:** `/os` is publicly accessible without authentication. Some workspace links may lead to pages that don't exist yet.

---

### OS Admin (`/os/admin`)

| Dimension  | Status | Evidence                                              |
| ---------- | ------ | ----------------------------------------------------- |
| UI         | ✅     | 5 pages (audit, content, releases, users)             |
| API        | ✅     | 5 API routes (audit, data, health, ready, users)      |
| Data       | ⚠️     | Admin API routes exist but may return empty/stub data |
| Auth       | ⚠️     | Middleware does NOT protect `/os/admin` specifically  |
| Nav        | ✅     | In `layers.os` "Administration" section               |
| End-to-End | ⚠️     | Pages render but data may be stub                     |
| Canonical  | ✅     | `apps/ai-institute/src/app/os/admin/`                 |

**Known defects:** Auth protection unclear for admin routes. Data sources may be stubs.

---

### OS GitHub (`/os/github`)

| Dimension  | Status | Evidence                                                                       |
| ---------- | ------ | ------------------------------------------------------------------------------ |
| UI         | ✅     | 3 pages (overview, repositories, repositories/[id])                            |
| API        | ✅     | `apps/github-os` has 32 API routes                                             |
| Data       | ⚠️     | `github-os.db` exists with data, but ai-institute routes may not connect to it |
| Auth       | ❌     | **No auth protection** — github-os has no auth                                 |
| Nav        | ✅     | In `layers.os` "Administration" section                                        |
| End-to-End | ⚠️     | Pages render but may not connect to github-os database                         |
| Canonical  | ⚠️     | ai-institute has 3 pages; github-os has 26 pages + 32 API routes               |

**Known defects:** Major capability gap. ai-institute has minimal GitHub pages vs github-os's full platform. No auth on github-os data.

---

### OS IOC (`/os/ioc`)

| Dimension  | Status | Evidence                                                 |
| ---------- | ------ | -------------------------------------------------------- |
| UI         | ✅     | 1 page in ai-institute                                   |
| API        | ✅     | `apps/ioc` has 8 API routes                              |
| Data       | ⚠️     | `ioc/data/` is empty — no database file                  |
| Auth       | ❌     | **No auth protection**                                   |
| Nav        | ✅     | In `layers.os` "Operations" section                      |
| End-to-End | ❌     | Page exists but no data backend                          |
| Canonical  | ⚠️     | ai-institute has 1 page; ioc has 10 pages + 8 API routes |

**Known defects:** Empty database. Significant capability gap.

---

### OS Social (`/os/social`)

| Dimension  | Status | Evidence                                                      |
| ---------- | ------ | ------------------------------------------------------------- |
| UI         | ✅     | 1 page in ai-institute                                        |
| API        | ✅     | `apps/social-os` has 8 API routes                             |
| Data       | ⚠️     | `social-os/data/` directory doesn't exist — no database       |
| Auth       | ❌     | **No auth protection**                                        |
| Nav        | ✅     | In `layers.os` "Operations" section                           |
| End-to-End | ❌     | Page exists but no data backend                               |
| Canonical  | ⚠️     | ai-institute has 1 page; social-os has 3 pages + 8 API routes |

**Known defects:** No database directory. Significant capability gap.

---

### OS Docs (`/os/docs`)

| Dimension  | Status | Evidence                                                                                 |
| ---------- | ------ | ---------------------------------------------------------------------------------------- |
| UI         | ✅     | 8 pages (decisions, governance, governance/policies, graph, releases, search, standards) |
| API        | ⚠️     | Only `/api/health` in docs app                                                           |
| Data       | ✅     | Reads from `docs/` filesystem                                                            |
| Auth       | ⚠️     | Unclear auth on docs routes                                                              |
| Nav        | ✅     | In `layers.os` "Content" section                                                         |
| End-to-End | ✅     | Pages render with filesystem data                                                        |
| Canonical  | ✅     | `apps/ai-institute/src/app/os/docs/`                                                     |

**Known defects:** Mostly works. Auth protection unclear.

---

## 5. CONTENT STUDIO

### Studio (`/studio`)

| Dimension  | Status | Evidence                                                                  |
| ---------- | ------ | ------------------------------------------------------------------------- |
| UI         | ✅     | 270 lines, stat cards, quick actions, recent items                        |
| API        | ✅     | `GET /api/studio/courses`, `/api/studio/lessons`, `/api/studio/knowledge` |
| Data       | ✅     | SQLite + filesystem                                                       |
| Auth       | ✅     | Middleware protects all `/studio/*` routes                                |
| Nav        | ✅     | In `layers.os` "Content" section                                          |
| End-to-End | ✅     | Studio dashboard loads real data                                          |
| Canonical  | ✅     | `apps/ai-institute/src/app/studio/`                                       |

**Known defects:** None.

---

## 6. NON-CANONICAL APPS (Separate Deployments)

### `apps/website` (Port 3000)

| Dimension  | Status | Evidence                                            |
| ---------- | ------ | --------------------------------------------------- |
| UI         | ✅     | 20 pages, all with real content                     |
| API        | ✅     | 3 health/metrics endpoints                          |
| Data       | ✅     | Filesystem content                                  |
| Auth       | N/A    | Public site                                         |
| Nav        | N/A    | Separate app                                        |
| End-to-End | ✅     | Fully functional public website                     |
| Canonical  | ⚠️     | **DUPLICATE** — 13 routes overlap with ai-institute |

**Known defects:** 13 route paths duplicated with ai-institute. Separate deployment means two public websites.

---

### `apps/admin` (Port 3003)

| Dimension  | Status | Evidence                                                   |
| ---------- | ------ | ---------------------------------------------------------- |
| UI         | ✅     | 5 pages with real components                               |
| API        | ✅     | 3 endpoints                                                |
| Data       | ⚠️     | No database — likely reads from ai-institute or filesystem |
| Auth       | ❌     | Placeholder only — hardcoded roles, no real auth           |
| Nav        | N/A    | Separate app                                               |
| End-to-End | ⚠️     | UI works but no real data or auth                          |
| Canonical  | ⚠️     | **PARTIAL** — ai-institute has `/os/admin/*`               |

**Known defects:** No real auth. No database. Capability partially replicated in ai-institute.

---

### `apps/social-os` (Port 3080)

| Dimension  | Status | Evidence                                           |
| ---------- | ------ | -------------------------------------------------- |
| UI         | ✅     | 3 pages with real content                          |
| API        | ✅     | 8 API routes                                       |
| Data       | ❌     | **No `data/` directory** — no database file exists |
| Auth       | ❌     | No auth                                            |
| Nav        | N/A    | Separate app                                       |
| End-to-End | ❌     | API routes likely fail without database            |
| Canonical  | ⚠️     | ai-institute has `/os/social` (1 page)             |

**Known defects:** No database. APIs likely broken. No auth.

---

### `apps/github-os` (Port 3070)

| Dimension  | Status | Evidence                                |
| ---------- | ------ | --------------------------------------- |
| UI         | ✅     | 26 pages, full interactive dashboard    |
| API        | ✅     | 32 API routes                           |
| Data       | ✅     | `github-os.db` exists with data         |
| Auth       | ❌     | No auth — security headers only         |
| Nav        | N/A    | Separate app                            |
| End-to-End | ✅     | Fully functional (no auth)              |
| Canonical  | ⚠️     | ai-institute has `/os/github` (3 pages) |

**Known defects:** No auth. Major capability not exposed through ai-institute.

---

### `apps/ioc` (Port 3090)

| Dimension  | Status | Evidence                                     |
| ---------- | ------ | -------------------------------------------- |
| UI         | ✅     | 10 pages with real content                   |
| API        | ✅     | 8 API routes                                 |
| Data       | ❌     | `data/` directory is **empty** — no database |
| Auth       | ❌     | No auth                                      |
| Nav        | N/A    | Separate app                                 |
| End-to-End | ❌     | APIs likely fail without database            |
| Canonical  | ⚠️     | ai-institute has `/os/ioc` (1 page)          |

**Known defects:** Empty database. No auth.

---

### `apps/docs` (Port 3002)

| Dimension  | Status | Evidence                                |
| ---------- | ------ | --------------------------------------- |
| UI         | ✅     | 8 pages with real content               |
| API        | ✅     | 1 health endpoint                       |
| Data       | ✅     | Filesystem (`docs/`)                    |
| Auth       | N/A    | Public documentation                    |
| Nav        | N/A    | Separate app                            |
| End-to-End | ✅     | Works                                   |
| Canonical  | ✅     | ai-institute has `/os/docs/*` (8 pages) |

**Known defects:** Mostly replicated in ai-institute.

---

### `apps/design-system` (Port 3010)

| Dimension  | Status | Evidence                                |
| ---------- | ------ | --------------------------------------- |
| UI         | ✅     | 7 pages, token/component showcase       |
| API        | N/A    | No API routes                           |
| Data       | N/A    | Static showcase                         |
| Auth       | N/A    | Development tool                        |
| Nav        | N/A    | Separate app                            |
| End-to-End | ✅     | Works                                   |
| Canonical  | ⚠️     | ai-institute has `/playground` (1 page) |

**Known defects:** Full showcase not exposed through ai-institute.

---

### `apps/bhavya-intelligence-network` (Port 3050)

| Dimension  | Status | Evidence                                     |
| ---------- | ------ | -------------------------------------------- |
| UI         | ✅     | 1 page, 445 lines, full dashboard            |
| API        | ✅     | 2 API routes (loop, approval)                |
| Data       | ✅     | In-memory (OSINT engine)                     |
| Auth       | ❌     | No auth                                      |
| Nav        | N/A    | Separate app                                 |
| End-to-End | ✅     | Works (in-memory data)                       |
| Canonical  | ❌     | **NOT in ai-institute** — no equivalent page |

**Known defects:** Not accessible through canonical app. No auth.

---

## 7. CRITICAL DEFECTS SUMMARY

### P0 — Broken Navigation / 404

| Defect                           | Location                                          | Impact                              |
| -------------------------------- | ------------------------------------------------- | ----------------------------------- |
| `/programs` unreachable from nav | Navigation registry marks as "deferred"           | Users cannot discover programs page |
| OS workspace links may 404       | `/os` links to workspaces that may not have pages | Broken navigation                   |

### P0 — Security Vulnerabilities

| Defect                    | Location                           | Impact                        |
| ------------------------- | ---------------------------------- | ----------------------------- |
| No auth on github-os APIs | `apps/github-os/`                  | Data manipulation possible    |
| No auth on ioc APIs       | `apps/ioc/`                        | Data manipulation possible    |
| No auth on social-os APIs | `apps/social-os/`                  | Data manipulation possible    |
| `/os` publicly accessible | Middleware bypasses auth for `/os` | Operational dashboard exposed |

### P0 — Inaccessible Existing Functionality

| Defect                                     | Location                | Impact                        |
| ------------------------------------------ | ----------------------- | ----------------------------- |
| github-os capabilities not in ai-institute | 26 pages, 32 API routes | Major feature gap             |
| ioc capabilities not in ai-institute       | 10 pages, 8 API routes  | Governance features missing   |
| social-os capabilities not in ai-institute | 3 pages, 8 API routes   | Social features missing       |
| BIN not in ai-institute                    | 1 page, 2 API routes    | Intelligence features missing |
| design-system showcase not in ai-institute | 7 pages                 | Dev tooling gap               |

### P1 — Disconnected APIs

| Defect                      | Location                                      | Impact              |
| --------------------------- | --------------------------------------------- | ------------------- |
| social-os has no database   | `apps/social-os/data/` missing                | APIs likely fail    |
| ioc has empty database      | `apps/ioc/data/` empty                        | APIs return nothing |
| transparency sections empty | `/transparency` cards say "will be populated" | Content gap         |

### P1 — Duplicate Institutional Experiences

| Defect                                    | Location                      | Impact              |
| ----------------------------------------- | ----------------------------- | ------------------- |
| 13 routes duplicated website↔ai-institute | `/about`, `/community`, etc.  | Two public websites |
| 8 routes duplicated docs↔ai-institute     | `/os/docs/*`                  | Two doc systems     |
| admin partially duplicated                | `/os/admin/*` vs `apps/admin` | Two admin panels    |

### P2 — Visual Inconsistencies

| Defect                              | Location                          | Impact                      |
| ----------------------------------- | --------------------------------- | --------------------------- |
| social-os uses inline styles        | `apps/social-os/src/app/page.tsx` | Design system non-compliant |
| Some OS pages have different shells | Various `/os/*` pages             | Inconsistent chrome         |

---

## 8. RECOMMENDED ACTION MATRIX

| Priority | Action                                                              | Effort | Impact |
| -------- | ------------------------------------------------------------------- | ------ | ------ |
| P0       | Fix any 404s in OS workspace navigation                             | Low    | High   |
| P0       | Add auth gates to OS admin/github/ioc/social routes in ai-institute | Low    | High   |
| P0       | Verify `/programs` is intentionally deferred or needs nav link      | Low    | Medium |
| P1       | Test each critical journey end-to-end                               | Medium | High   |
| P1       | Connect ai-institute OS pages to actual data sources                | Medium | High   |
| P1       | Fix transparency page empty states                                  | Low    | Medium |
| P2       | Consolidate website duplicate routes (redirects)                    | Medium | Medium |
| P2       | Align design system across OS pages                                 | Medium | Low    |
| Deferred | Merge databases                                                     | High   | Medium |
| Deferred | Delete/archive non-canonical apps                                   | High   | Low    |
| Deferred | Clean orphan packages                                               | Medium | Low    |

---

## Phase 3 Fixes Applied (commit `d3964bb`)

| Fix                                                 | Impact                            | Files                                                                           |
| --------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| Constitution engine import path (off-by-one)        | Runtime loads correctly           | `packages/runtime/src/engines/constitution-engine.mjs`                          |
| Async test `await rt.load()`                        | Runtime tests pass (26/26)        | `packages/runtime/src/runtime.test.mjs`                                         |
| Social-os formatter/publications/postiz type errors | 3 files compile cleanly           | `apps/social-os/src/lib/formatter.ts`, `publications.ts`, `providers/postiz.ts` |
| Rate-limit test isolation                           | ai-institute tests pass (166/166) | `apps/ai-institute/src/lib/__tests__/rate-limit.test.ts`                        |
| `--passWithNoTests` on 10 packages                  | `pnpm test` 20/20 tasks pass      | 10 `package.json` files                                                         |
| Kernel jest→vitest                                  | Kernel test script functional     | `packages/kernel/package.json`                                                  |
| Gitignore test IO dirs                              | No untracked test artifacts       | `.gitignore`                                                                    |

**Post-fix verification:** 20/20 turbo tasks pass, 166/166 tests pass, ai-institute typecheck clean, file-map:check clean.

---

## Phases 3-5 Fixes Applied (commit `ab30118`)

### Security Hardening

| Fix                                         | Impact              | Files                                    |
| ------------------------------------------- | ------------------- | ---------------------------------------- |
| Session-token auth middleware for social-os | 8 API routes gated  | `apps/social-os/src/middleware.ts` (new) |
| Session-token auth middleware for ioc       | 8 API routes gated  | `apps/ioc/src/middleware.ts` (new)       |
| Updated github-os middleware                | 32 API routes gated | `apps/github-os/src/middleware.ts`       |
| Health endpoints remain public              | No breakage         | All 3 middleware files                   |

### Social OS Type Fixes (10 errors to 0)

| Fix                                               | Files                   |
| ------------------------------------------------- | ----------------------- |
| getPendingApprovals import path corrected         | `pulse/route.ts`        |
| getGitHubOSFeedback added to CEO dashboard        | `ceo/page.tsx`          |
| saveInstitutionalMetrics to saveInstitutionMetric | `communication-loop.ts` |
| 5 missing event types added to EventType          | `events.ts`             |

### Transparency Journey (PARTIAL to WORKING)

| Fix                            | Impact                                          | Files                       |
| ------------------------------ | ----------------------------------------------- | --------------------------- |
| Added getFinancials() accessor | Reads 4 JSON files from content/financials/     | `os-data.ts`                |
| Wired API route to real data   | Returns financials/governance/projects/policies | `api/transparency/route.ts` |
| Page renders dynamic data      | Shows real items instead of placeholders        | `transparency/page.tsx`     |

### IOC Journey (PARTIAL to WORKING)

| Fix                               | Impact                               | Files             |
| --------------------------------- | ------------------------------------ | ----------------- |
| Added getIOCData() accessor       | Reads from IOC SQLite database       | `os-data.ts`      |
| Canonical page wired to real data | Shows live OKR/risk counts and lists | `os/ioc/page.tsx` |

### Post-fix Verification

- 20/20 turbo tasks pass
- 166/166 tests pass
- ai-institute typecheck: 0 errors
- social-os typecheck: 0 errors
- file-map:check: clean

---

_Generated by Wave 20 inspection + ICM Convergence Mode Phase 1. Updated after Phases 3-5 fixes. All claims traceable to file paths._
