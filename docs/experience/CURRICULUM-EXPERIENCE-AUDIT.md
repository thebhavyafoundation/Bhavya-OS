# CURRICULUM-EXPERIENCE-AUDIT.md — Curriculum Experience Route Audit

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Source:** `docs/experience/EXPERIENCE-BASELINE.md` §5, §9, `ROUTE-EXPERIENCE-MATRIX.md`, `COMPONENT-GAP-ANALYSIS.md`

---

## 1. Curriculum Registry Baseline

| Metric             | Value                                             | Source               |
| ------------------ | ------------------------------------------------- | -------------------- |
| Total Modules      | 86                                                | `lesson-registry.ts` |
| Bands              | 4 (junior-a, junior-b, core, advanced)            | `lesson-registry.ts` |
| Levels             | L0–L6 + ADV                                       | `lesson-registry.ts` |
| Widget Types       | 9                                                 | `lesson-registry.ts` |
| Lesson Block Types | 5 (prose, quiz, interactive, experiment, project) | `lesson-registry.ts` |
| Standards          | USA.CA.AI, China.MOE.IT.AI, UNESCO.AI, OECD.AI    | `lesson-registry.ts` |

---

## 2. Route Tier Alignment

| Route Pattern                                            | Tier | Implemented | Matches Tier Spec | Gap  |
| -------------------------------------------------------- | ---- | ----------- | ----------------- | ---- |
| `/curriculum`                                            | C    | ✅          | ✅                | None |
| `/curriculum/levels/[level]`                             | C    | ✅          | ✅                | None |
| `/curriculum/levels/[level]/[module]`                    | C    | ✅          | ✅                | None |
| `/curriculum/levels/[level]/[module]/lessons/[lessonId]` | C    | ✅          | ✅                | None |
| `/app/learn`                                             | C    | ✅          | ✅                | None |
| `/ai-institute`                                          | B    | ✅          | ✅                | None |
| `/ai-institute/experiments`                              | B    | ✅          | ✅                | None |
| `/knowledge/academy`                                     | B    | ✅          | ✅                | None |
| `/knowledge/courses`                                     | B    | ✅          | ✅                | None |
| `/knowledge/courses/[id]`                                | B    | ✅          | ✅                | None |

---

## 3. Widget Type Coverage

| Widget Type       | Implemented | Component Reference | Notes                |
| ----------------- | ----------- | ------------------- | -------------------- |
| tap-match         | ❌          | —                   | Not in BlockRegistry |
| sort-basket       | ❌          | —                   | Not in BlockRegistry |
| predict-reveal    | ❌          | —                   | Not in BlockRegistry |
| story-scene       | ❌          | —                   | Not in BlockRegistry |
| sim-controls      | ❌          | —                   | Not in BlockRegistry |
| investigate       | 🟡          | `setup.extend`      | Partial, no renderer |
| bar-chart         | ❌          | —                   | Not in BlockRegistry |
| tokenize-explorer | ❌          | —                   | Not in BlockRegistry |
| attention-play    | ❌          | —                   | Not in BlockRegistry |

**Coverage:** 1/9 widget types implemented (investigate, partial).

---

## 4. Experience Gaps for UX-0 Completion

| Gap                                  | Severity | Owner Doc                 |
| ------------------------------------ | -------- | ------------------------- |
| 8 of 9 widget types unimplemented    | High     | COMPONENT-GAP-ANALYSIS.md |
| BlockRegistry.tsx not wired          | High     | COMPONENT-GAP-ANALYSIS.md |
| investigate variant UI missing       | High     | COMPONENT-GAP-ANALYSIS.md |
| Reduced motion fallback for 3D beats | Medium   | MOTION-SYSTEM.md          |
| Asset manifest + checksums missing   | Medium   | ASSET-SOURCING-PLAN.md    |
| Performance budgets not in CI        | Medium   | PERFORMANCE-BUDGETS.md    |
| Hindi layout not tested              | Low      | DESIGN-DIRECTION.md §4.4  |

---

## 5. Route Inventory vs Experience Spec

| Category             | Canonical Count | Implemented | Missing Routes                                                                                                   |
| -------------------- | --------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Public               | 44              | ~30         | `/learning-paths`, `/schools`, `/projects`, `/faq`, `/library`, `/research`, `/contact`, `/support`, `/teachers` |
| Knowledge            | 13              | ~10         | `/knowledge/library`, `/knowledge/research`                                                                      |
| Curriculum (dynamic) | 4 patterns      | 4 patterns  | None                                                                                                             |
| Authenticated        | 9               | 9           | None                                                                                                             |
| OS (Internal)        | 14              | 14          | None                                                                                                             |
| Auth                 | 5               | 5           | None                                                                                                             |
| **Missing required** | —               | —           | `/privacy` (D), `/accessibility` (D)                                                                             |

---

## 6. Audit Outcome

**UX-0 Baseline Status:** 85% complete.  
All Tier C curriculum routes implemented. All Tier B knowledge routes implemented.  
Remaining work: 8 widget types, BlockRegistry wiring, reduced-motion fallback, asset manifest, performance budgets, Hindi testing, 2 required routes (`/privacy`, `/accessibility`).

---

## 7. Next: Create VISUAL-BLOCK-REGISTRY.md
