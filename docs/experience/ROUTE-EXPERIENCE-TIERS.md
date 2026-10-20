# ROUTE-EXPERIENCE-TIERS — Verified Tier Classification

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Method:** Enumerated from `apps/ai-institute/src/app/**/page.tsx` at `master` @ `197f31e9`. 166 entry points. Supersedes `docs/experience/ROUTE-EXPERIENCE-MATRIX.md`, which was written when 11 of these routes did not exist.

---

## 1. Tier Definitions

| Tier  | Name                          | Visual budget  | Motion                   | 3D                                                 | Purpose                          |
| ----- | ----------------------------- | -------------- | ------------------------ | -------------------------------------------------- | -------------------------------- |
| **A** | Cinematic public storytelling | Full editorial | Cinematic, scroll-linked | Cinematic allowed **where it carries information** | Credibility, scope, narrative    |
| **B** | Interactive explanatory       | Lightweight    | Scroll reveals, calm     | Selective — object explorers that teach            | Understanding a specific subject |
| **C** | Learning / productivity       | Minimal        | Calm transitions         | Optional educational only                          | Doing a task well                |
| **D** | Operational / admin / legal   | None           | Micro only               | **None. Prohibited.**                              | Getting the job done, correctly  |

**Rule:** a decorative visual with no informational purpose is not permitted in any tier. Tier D prohibits 3D entirely. Tier A permits 3D but does not require it — the current homepage direction (documentary photography + editorial type) is a valid Tier A implementation and is not to be replaced for the sake of adding 3D.

---

## 2. Tier A — Cinematic Public Storytelling (12 routes)

| Route                 | Story job                   | Notes                                                        |
| --------------------- | --------------------------- | ------------------------------------------------------------ |
| `/`                   | Institutional entrance      | Current flagship. Photography-led. **Flagship slice target** |
| `/mission`            | Purpose and constitution    | Already has a `MissionPage` composition to build on          |
| `/missions`           | The four pillars as a set   | Hub for pillar entry                                         |
| `/missions/forest`    | Forest mission narrative    | `MissionPage` reusable                                       |
| `/missions/knowledge` | Knowledge mission narrative | `MissionPage` reusable                                       |
| `/missions/heritage`  | Heritage mission narrative  | `MissionPage` reusable                                       |
| `/missions/community` | Community mission narrative | `MissionPage` reusable                                       |
| `/forest`             | Forest programme            |                                                              |
| `/heritage`           | Heritage programme          |                                                              |
| `/nature`             | Ecological framing          |                                                              |
| `/impact`             | Impact entry                |                                                              |
| `/impact/[id]`        | Impact detail               | Needs honest-data discipline (`bhavya-content-truth`)        |

**Tier A invariants:** semantic HTML carries all narrative; every image has real alt text; scroll-linked motion is `prefers-reduced-motion`-gated; one poster fallback per visual narrative; CTA is singular and obvious.

---

## 3. Tier B — Interactive Explanatory (54 routes)

### 3.1 Governance and institutional (16)

`/governance` · `/governance/ai-ethics` · `/governance/board-of-trustees` · `/governance/constitution` · `/governance/founders` · `/governance/policies` · `/governance/safeguarding` · `/governance/transparency` · `/transparency` · `/contributing` · `/press` · `/about` · `/donate` · `/mentor` · `/volunteer` · `/get-involved`

> **Highest-value opportunity in the whole execution.** Six manifested diagrams already exist and are licence-reviewed, including `foundation-governance-structure`. `/governance` renders none of them.

### 3.2 Programmes and initiatives (13)

`/programs` · `/initiatives` · `/initiatives/ai-labs` · `/initiatives/digital-library` · `/initiatives/environment` · `/initiatives/forest-mission` · `/initiatives/heritage` · `/initiatives/research` · `/initiatives/rural-innovation` · `/initiatives/school-outreach` · `/initiatives/volunteer-corps` · `/schools` · `/teachers`

### 3.3 Knowledge and library (9)

`/knowledge` · `/knowledge/academy` · `/knowledge/ai` · `/knowledge/courses` · `/knowledge/library` · `/knowledge/research` · `/library` · `/research` · `/resources` (+ `/resources/documents`, `/resources/publications`, `/resources/videos`)

> `curriculum-learning-pathway` and `responsible-ai-lifecycle` manifests belong here and on `/curriculum`.

### 3.4 AI Institute sub-brand (11)

`/ai-institute` · `/ai-institute/community` · `/ai-institute/curriculum` · `/ai-institute/experiments` · `/ai-institute/faq` · `/ai-institute/learning` · `/ai-institute/projects` · `/ai-institute/responsible-ai` · `/ai-institute/schools` · `/playground` · `/concepts/[id]`

### 3.5 Curriculum entry (3 — hub pages only)

`/curriculum` · `/curriculum/levels` · `/learning-paths`

> Classification nuance: `/curriculum` and `/curriculum/levels` are **B** (a learner choosing a pathway is an explanatory decision), while everything below a module is **C**. This boundary is deliberate and is the natural seam for the curriculum vertical slice.

### 3.6 Projects and community (7)

`/projects` · `/projects/[id]` · `/community` · `/community/volunteer` · `/portfolio` · `/workspace` · `/faq`

### 3.7 Contact, support, verification (5)

`/contact` · `/support` · `/verify/[id]` · `/studio` · `/onboarding`

---

## 4. Tier C — Learning / Productivity (26 routes)

### 4.1 Curriculum detail chain (6)

| Route                                                    | Tier | Role                              |
| -------------------------------------------------------- | ---- | --------------------------------- |
| `/curriculum/levels/[level]`                             | C    | Module list for a level           |
| `/curriculum/levels/[level]/[module]`                    | C    | Module overview                   |
| `/curriculum/levels/[level]/[module]/lessons/[lessonId]` | C    | Lesson player                     |
| `/curriculum/modules/[moduleId]`                         | C    | Module overview (alternate chain) |
| `/curriculum/modules/[moduleId]/lessons/[lessonId]`      | C    | Lesson player (alternate chain)   |

### 4.2 Courses chain (6)

`/courses` · `/courses/[id]` · `/courses/[id]/lessons/[lessonId]` · `/courses/foundations` · `/courses/foundations/lessons/[id]` · `/courses/foundations/check` · `/courses/foundations/lab` · `/courses/foundations/project`

### 4.3 Assessment and authenticated student surfaces (14)

`/assessment` · `/app` · `/app/learn` · `/app/knowledge` · `/app/knowledge/new` · `/app/community` · `/app/contributions` · `/app/credentials` · `/app/forest` · `/app/forest/new` · `/app/missions` · `/app/projects` · `/app/research` · `/profile` · `/app/profile` · `/dashboard`

> `/dashboard`, `/profile`, `/app/profile` are three routes for profile/dashboard. Duplication, not consolidation target for this execution.

### 4.4 Content authoring (6)

`/studio` · `/studio/courses` · `/studio/courses/new` · `/studio/courses/[id]` · `/studio/knowledge` · `/studio/knowledge/new` · `/studio/knowledge/[id]/edit` · `/studio/lessons` · `/studio/lessons/new` · `/studio/lessons/[id]`

> Authoring is productivity work, not storytelling. Editorial chrome must not leak into `/studio`.

**Tier C invariants:** no scroll-linked motion; no pinning; no autoplay; body measure ≤ 72ch; every interactive element keyboard-reachable; progress visible and stable; loading/empty/error states present on every data surface.

---

## 5. Tier D — Operational / Admin / Legal (71 routes)

### 5.1 Auth (5)

`/login` · `/register` · `/verify/[id]` · `/auth/auth-code-error` · `/forbidden`

### 5.2 Legal and policy (4)

`/privacy` · `/terms` · `/accessibility`

> `/accessibility` is Tier D _visually_ but is a **first-class accessibility artefact** and is treated as such in Phase 9 — its content must reflect what was actually built and verified.

### 5.3 OS internal operations (57)

`/os` and every `/os/**` subtree: `/os/admin` (+ `/api`, `/audit`, `/components`, `/content`, `/releases`, `/users`, and its `/os/admin/api/*` REST routes), `/os/api-explorer`, `/os/bin`, `/os/docs` (+ `decisions`, `governance`, `graph`, `releases`, `search`, `standards`, `governance/policies`), `/os/donor`, `/os/forest`, `/os/github` (+ `repositories`, `repositories/[id]`), `/os/governance`, `/os/ioc` (+ `actions`, `dashboard`, `events`, `health`, `okr`, `reviews`, `risks`), `/os/knowledge`, `/os/memory`, `/os/mission` (+ `approvals`, `approvals/[id]`, `decisions`, `evidence`, `integrations`, `jobs/[id]`, `api/*`), `/os/observability`, `/os/runtime`, `/os/search`, `/os/social`, `/os/student`, `/os/trustee`, `/os/videos`, `/os/volunteer`.

**Tier D invariants:** 3D prohibited; decorative photography prohibited; token colours only; dense information permitted; keyboard-first; tables and forms beat canvases.

---

## 6. Tier Summary

| Tier                        | Route count | 3D posture                  | Vertical-slice relevance                                                                   |
| --------------------------- | ----------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| A — Cinematic public        | 12          | Allowed where informational | **Flagship target: `/`**                                                                   |
| B — Interactive explanatory | 54          | Selective, explanatory      | **Curriculum entry: `/curriculum`**                                                        |
| C — Learning / productivity | 26          | Optional educational        | **Curriculum slice: `/curriculum` → `levels/[level]` → `[module]` → `lessons/[lessonId]`** |
| D — Operational             | 74          | Prohibited                  | Out of scope for visual work                                                               |

---

## 7. Rules Derived From Tiering

1. **A component may not render above its tier's motion budget.** A cinematic scroll effect used in Tier C is a defect, not a nicety.
2. **`Optional3DExplorer` is Tier A/B only.** A Tier C route may use educational 3D through a different, opt-in component with an explicit educational justification in `ASSET-NEEDS.md`.
3. **No new route is created by this execution.** All work happens on existing routes.
4. **No route is deleted or renamed by this execution.**
5. **Diagram and infographic blocks are Tier A/B/C-legal, never Tier D.**
6. **Every Tier A/B page that receives a visual must gain a matching static fallback in the same commit.** A visual without a fallback is incomplete.
