# SKILL INTEGRATION REGISTRY

**Date:** 2026-08-09
**Last updated:** 2026-08-10
**Status:** **NON-AUTHORITATIVE** — historical integration inventory
**Purpose:** Track actual skill implementation across the Bhavya Foundation monorepo
**Scope:** 9 current apps + packages

> **2026-09-23:** Not a skill discovery source. Installed skills: `.opencode/skills/` only.

---

## REGISTERED SKILLS

### React

| Field                     | Value                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| Purpose                   | Application architecture, component patterns                       |
| Canonical subsystem       | packages/platform-ui, apps/ai-institute                            |
| Inputs                    | Component requirements, page specifications                        |
| Outputs                   | React components with typed props, composition patterns            |
| Design-system integration | Uses canonical tokens, platform-ui components                      |
| Implementation location   | All 23 apps, packages/platform-ui                                  |
| Tests                     | None (no component tests found)                                    |
| Status                    | **PARTIAL** — Components exist but no tests, inconsistent patterns |

### UI/UX Max Pro

| Field                     | Value                                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| Purpose                   | Design QA, information architecture, visual hierarchy                   |
| Canonical subsystem       | Migration waves, design system review                                   |
| Inputs                    | Page requirements, user tasks                                           |
| Outputs                   | Reviewed, accessible, responsive UI                                     |
| Design-system integration | Works with canonical tokens/components                                  |
| Implementation location   | Not integrated — referenced in docs only                                |
| Tests                     | None                                                                    |
| Status                    | **NOT INTEGRATED** — Skill exists but not used in actual implementation |

### Web Animations

| Field                     | Value                                                                          |
| ------------------------- | ------------------------------------------------------------------------------ |
| Purpose                   | Motion design, animation primitives                                            |
| Canonical subsystem       | platform-ui motion, page transitions                                           |
| Inputs                    | Animation requirements                                                         |
| Outputs                   | Reduced-motion-aware, performant animations                                    |
| Design-system integration | Should use canonical motion tokens                                             |
| Implementation location   | apps/website (GSAP, Lenis), apps/ai-institute (framer-motion)                  |
| Tests                     | None                                                                           |
| Status                    | **FRAGMENTED** — Two different animation libraries, no canonical motion system |

### Hyperframe

| Field                     | Value                                                                      |
| ------------------------- | -------------------------------------------------------------------------- |
| Purpose                   | Video rendering from HTML compositions                                     |
| Canonical subsystem       | packages/video-engine                                                      |
| Inputs                    | Scene graph, composition objects                                           |
| Outputs                   | Rendered MP4 video artifacts                                               |
| Design-system integration | N/A                                                                        |
| Implementation location   | packages/video-engine                                                      |
| Tests                     | Pipeline tests exist                                                       |
| Status                    | **PARTIAL** — Pipeline and components exist, but NO actual video rendering |

### ICM Architect

| Field                     | Value                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Purpose                   | Folder structure as agent architecture                                              |
| Canonical subsystem       | Curriculum pipeline, agent routing                                                  |
| Inputs                    | Knowledge domains, learning objectives                                              |
| Outputs                   | Structured curriculum, lesson sequences                                             |
| Design-system integration | N/A                                                                                 |
| Implementation location   | .opencode/icm/ (installed), docs (referenced)                                       |
| Tests                     | None                                                                                |
| Status                    | **NOT INTEGRATED** — Installed as documentation routing, not curriculum methodology |

### Next.js

| Field                     | Value                                 |
| ------------------------- | ------------------------------------- |
| Purpose                   | Web framework, routing, rendering     |
| Canonical subsystem       | All apps                              |
| Inputs                    | Page components, API routes           |
| Outputs                   | Server-rendered React applications    |
| Design-system integration | Layout imports platform-ui            |
| Implementation location   | All 23 apps                           |
| Tests                     | None (no E2E tests found)             |
| Status                    | **WORKING** — All apps use Next.js 15 |

### Vercel

| Field                     | Value                                                                        |
| ------------------------- | ---------------------------------------------------------------------------- |
| Purpose                   | Deployment, hosting                                                          |
| Canonical subsystem       | ONE canonical deployment                                                     |
| Inputs                    | apps/ai-institute                                                            |
| Outputs                   | Production website                                                           |
| Design-system integration | N/A                                                                          |
| Implementation location   | Vercel dashboard                                                             |
| Tests                     | None                                                                         |
| Status                    | **CONFIGURED** — ONE project (bhavya-foundation), legacy projects documented |

---

## INTEGRATION GAPS

| Skill          | Gap                                     | Priority |
| -------------- | --------------------------------------- | -------- |
| UI/UX Max Pro  | Not used in any migration wave review   | HIGH     |
| Web Animations | No canonical motion system              | HIGH     |
| Hyperframe     | No actual video rendering               | HIGH     |
| ICM Architect  | Not integrated into curriculum pipeline | HIGH     |
| React          | No component tests                      | MEDIUM   |
| Accessibility  | No automated a11y testing               | MEDIUM   |
| Performance    | No bundle analysis                      | LOW      |

---

## RECOMMENDED ACTIONS

1. **UI/UX Max Pro**: Add design review checkpoint to migration wave process
2. **Web Animations**: Create canonical motion primitives in platform-ui
3. **Hyperframe**: Integrate Remotion for actual video rendering
4. **ICM Architect**: Wire ICM stages into lesson-studio pipeline
5. **React**: Add component tests to platform-ui
6. **Accessibility**: Add axe-core or similar automated testing
7. **Performance**: Add bundle analyzer to build process
