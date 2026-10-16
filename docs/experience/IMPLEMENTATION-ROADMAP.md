# IMPLEMENTATION-ROADMAP.md — UX-0 Completion → UX-1 Design-System Proof

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Source:** `docs/experience/EXPERIENCE-BASELINE.md` §11–12

---

## 1. Current State (UX-0 Baseline)

| Gate                        | Status                                         |
| --------------------------- | ---------------------------------------------- |
| Route tier classification   | ✅ Complete (`ROUTE-EXPERIENCE-MATRIX.md`)     |
| Design direction & tokens   | ✅ Complete (`DESIGN-DIRECTION.md`)            |
| Component gap analysis      | ✅ Complete (`COMPONENT-GAP-ANALYSIS.md`)      |
| Storytelling architecture   | ✅ Complete (`STORYTELLING-ARCHITECTURE.md`)   |
| Curriculum experience audit | ✅ Complete (`CURRICULUM-EXPERIENCE-AUDIT.md`) |
| Visual block registry       | ✅ Complete (`VISUAL-BLOCK-REGISTRY.md`)       |
| Asset sourcing plan         | ✅ Complete (`ASSET-SOURCING-PLAN.md`)         |
| Motion system               | ✅ Complete (`MOTION-SYSTEM.md`)               |
| Performance budgets         | ✅ Complete (`PERFORMANCE-BUDGETS.md`)         |
| Implementation roadmap      | 🔄 In progress (this doc)                      |

**Remaining UX-0 Missing Docs:** None — all 11 docs complete.

---

## 2. Phase 1 — Critical Fixes (Week 1)

| Priority | Task                                          | Component/Doc              | Effort  |
| -------- | --------------------------------------------- | -------------------------- | ------- |
| 🔴       | Wire `BlockRegistry.tsx` to all 9 block types | `BlockRegistry.tsx`        | 2 days  |
| 🔴       | Implement `investigate` variant renderer      | `investigate` block        | 2 days  |
| 🔴       | Fix `PinnedLessonSidebar.tsx` lint errors     | `PinnedLessonSidebar.tsx`  | 0.5 day |
| 🔴       | Add `ReducedMotionWrapper.tsx`                | `ReducedMotionWrapper.tsx` | 1 day   |
| 🔴       | Add `ErrorBoundary.tsx`                       | `ErrorBoundary.tsx`        | 1 day   |
| 🔴       | Add `Accessible3DCanvas.tsx`                  | `Accessible3DCanvas.tsx`   | 1 day   |

---

## 3. Phase 2 — Component Buildout (Week 2–3)

| Priority | Task                                             | Component/Doc           | Effort |
| -------- | ------------------------------------------------ | ----------------------- | ------ |
| 🟡       | Build `StoryShell.tsx`                           | `StoryShell.tsx`        | 2 days |
| 🟡       | Build `ChapterNavigator.tsx`                     | `ChapterNavigator.tsx`  | 2 days |
| 🟡       | Build `InfographicFrame.tsx`                     | `InfographicFrame.tsx`  | 2 days |
| 🟡       | Build `LessonShell.tsx`                          | `LessonShell.tsx`       | 1 day  |
| 🟡       | Enhance `KineticTypography.tsx` (reduced motion) | `KineticTypography.tsx` | 1 day  |
| 🟡       | Enhance `QuizBlock.tsx` (answer tracking)        | `QuizBlock.tsx`         | 1 day  |
| 🟡       | Enhance `BentoModuleGrid.tsx` (drag-reorder)     | `BentoModuleGrid.tsx`   | 2 days |

---

## 4. Phase 3 — Asset Pipeline & Performance (Week 4)

| Priority | Task                                        | Component/Doc            | Effort  |
| -------- | ------------------------------------------- | ------------------------ | ------- |
| 🟡       | Create `asset-manifest.json`                | `ASSET-SOURCING-PLAN.md` | 1 day   |
| 🟡       | Add checksums (`checksums.sha256`)          | `ASSET-SOURCING-PLAN.md` | 0.5 day |
| 🟡       | Configure glTF Transform + meshoptimizer CI | `ASSET-SOURCING-PLAN.md` | 2 days  |
| 🟡       | Configure KTX2 texture compression          | `ASSET-SOURCING-PLAN.md` | 1 day   |
| 🟡       | Add performance budgets to CI               | `PERFORMANCE-BUDGETS.md` | 2 days  |
| 🟡       | Optimize 3D assets (Draco, KTX2, AVIF)      | `ASSET-SOURCING-PLAN.md` | 3 days  |

---

## 5. Phase 4 — Missing Routes & Hindi (Week 5)

| Priority | Task                                 | Component/Doc                | Effort  |
| -------- | ------------------------------------ | ---------------------------- | ------- |
| 🟢       | Implement `/privacy` (Tier D)        | `ROUTE-EXPERIENCE-MATRIX.md` | 0.5 day |
| 🟢       | Implement `/accessibility` (Tier D)  | `ROUTE-EXPERIENCE-MATRIX.md` | 0.5 day |
| 🟢       | Implement `/learning-paths` (Tier B) | `ROUTE-EXPERIENCE-MATRIX.md` | 2 days  |
| 🟢       | Implement `/library` (Tier B)        | `ROUTE-EXPERIENCE-MATRIX.md` | 2 days  |
| 🟢       | Hindi layout testing (Devanagari)    | `DESIGN-DIRECTION.md` §4.4   | 2 days  |
| 🟢       | WCAG contrast verification           | `DESIGN-DIRECTION.md` §5     | 1 day   |

---

## 6. Phase 5 — UX-1: Design-System Proof Route

| Task                                 | Component/Doc             | Effort |
| ------------------------------------ | ------------------------- | ------ |
| Build Tier A proof route (`/`)       | `DESIGN-DIRECTION.md` §7  | 5 days |
| Four-pillar cinematic hero           | `Hero3DCanvas.tsx` + GSAP | 3 days |
| Scroll-pinned chapters               | `StoryShell.tsx` + Lenis  | 2 days |
| Documentary hero with reduced motion | `Accessible3DCanvas.tsx`  | 1 day  |

---

## 7. Total Effort Estimate

| Phase                            | Effort       | Calendar     |
| -------------------------------- | ------------ | ------------ |
| Phase 1 — Critical Fixes         | 7.5 days     | Week 1       |
| Phase 2 — Component Buildout     | 11.5 days    | Weeks 2–3    |
| Phase 3 — Asset Pipeline         | 9.5 days     | Week 4       |
| Phase 4 — Missing Routes & Hindi | 8 days       | Week 5       |
| Phase 5 — UX-1 Proof Route       | 11 days      | Weeks 6–7    |
| **Total**                        | **~45 days** | **~7 weeks** |

---

## 8. Definition of Done (UX-0 → UX-1)

- [ ] All 9 widget types implemented in `BlockRegistry.tsx`
- [ ] `investigate` variant renderer complete
- [ ] `ReducedMotionWrapper.tsx` wired to all 3D components
- [ ] `ErrorBoundary.tsx` wired to all routes
- [ ] `Accessible3DCanvas.tsx` replaces `Hero3DCanvas.tsx` usage
- [ ] `asset-manifest.json` + `checksums.sha256` committed
- [ ] CI enforces performance budgets (fails build on overage)
- [ ] `/privacy` and `/accessibility` routes implemented
- [ ] Hindi layout tested (Devanagari)
- [ ] WCAG contrast programmatically verified
- [ ] Tier A proof route (`/`) built with cinematic hero + scroll chapters
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all green

---

## 9. Next: Begin Phase 1 — Critical Fixes
