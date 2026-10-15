# COMPONENT-GAP-ANALYSIS.md — Component Inventory & Missing Pieces

**Date:** 2026-10-15  
**Branch:** feat/immersive-hero-background  
**Scope:** All 16+ TSX components in `apps/ai-institute/src/components/`

---

## 1. Component Inventory (All Found in Codebase)

| Component File                     | Type                       | Tier | Status                           |
| ---------------------------------- | -------------------------- | ---- | -------------------------------- |
| `Hero3DCanvas.tsx`                 | 3D hero container          | A    | ✅ Implemented                   |
| `CurriculumHero3D.tsx`             | Band-specific hero         | A/B  | ✅ Implemented                   |
| `BlockRenderer.tsx`                | Generic 3D block           | C    | ✅ Implemented                   |
| `BentoModuleGrid.tsx`              | Masonry grid layout        | C    | ✅ Implemented                   |
| `PinnedLessonSidebar.tsx`          | Lesson sidebar (pinned)    | C    | 🔄 In progress (lint fix needed) |
| `KnowledgeAlignedLessonPlayer.tsx` | Lesson playback core       | C    | ✅ Implemented                   |
| `KineticTypography.tsx`            | Animated text typography   | B    | ✅ Implemented                   |
| `QuizBlock.tsx`                    | Quiz component             | C    | ✅ Implemented                   |
| `StandardsFooter.tsx`              | Standards alignment footer | C    | ✅ Implemented                   |
| `AIProgressBar.tsx`                | AI progress indicator      | C    | ✅ Implemented                   |
| `AIModuleRow.tsx`                  | Module row listing         | C    | ✅ Implemented                   |
| `AICurriculumTimeline.tsx`         | Curriculum timeline        | C    | ✅ Implemented                   |
| `AIBandFilter.tsx`                 | Band selection filter      | C    | ✅ Implemented                   |
| `VisualComponent.tsx`              | Generic visual wrapper     | C    | ✅ Implemented                   |
| `ModuleQuiz.tsx`                   | Module quiz player         | C    | ✅ Implemented                   |
| `Setup.tsx`                        | Setup / extend page        | D    | ✅ Implemented                   |

---

## 2. Missing Components (Not Yet Built)

| Component                  | Proposed Tier | Purpose                                                                                                                                               | Block Spec                                                   | Block Type         |
| -------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------ |
| `StoryShell.tsx`           | A/B           | Chapter navigation across routes                                                                                                                      | `{prompt, mode, dataset, items: {text, correct: boolean}[]}` | investigate        |
| `ChapterNavigator.tsx`     | A/B           | Pinned chapter progression (next/prev/skip/reset)                                                                                                     | Same WidgetSpec                                              | investigate        |
| `InfographicFrame.tsx`     | B/C           | Data + brand palette frames (charts, graphs)                                                                                                          | Same WidgetSpec                                              | investigate        |
| `LessonShell.tsx`          | C             | Lesson wrapping + reduced motion fallback                                                                                                             | Same WidgetSpec                                              | investigate        |
| `BlockRegistry.tsx`        | C             | 16 block kinds routing (tap-match, sort-basket, predict-reveal, story-scene, sim-controls, investigate, bar-chart, tokenize-explorer, attention-play) | Same WidgetSpec                                              | investigate        |
| `ReducedMotionWrapper.tsx` | All           | Fallback orchestration for `prefers-reduced-motion: reduce`                                                                                           | None (orchestration)                                         | 📝 New             |
| `ErrorBoundary.tsx`        | All           | Graceful error presentation across tiers                                                                                                              | None                                                         | 📝 New             |
| `Accessible3DCanvas.tsx`   | A/B           | 3D with a11y fallback (empty div for reduced motion)                                                                                                  | None (3D+a11y)                                               | 📝 New             |
| `SetupExtendDialog.tsx`    | D             | Setup/extend CTA dialog (currently `Setup.tsx`)                                                                                                       | None                                                         | 🔄 Rename/refactor |

---

## 3. Component Enhancement Needs

| Component                  | Enhancement                                         | Priority                      |
| -------------------------- | --------------------------------------------------- | ----------------------------- |
| `PinnedLessonSidebar.tsx`  | Fix lint: unused imports, `_`-prefixed vars         | 🔴 Critical (typecheck clean) |
| `KineticTypography.tsx`    | Add reduced motion fallback                         | 🟡 Medium                     |
| `QuizBlock.tsx`            | Add answer tracking + state persistence             | 🟡 Medium                     |
| `AIProgressBar.tsx`        | Add brand-colored progress (forest/gold/sage/earth) | 🟢 Low (already works)        |
| `AICurriculumTimeline.tsx` | Add band-filtered chapter view                      | 🟢 Low                        |
| `VisualComponent.tsx`      | Add glass-morphism variant (from tokens.css)        | 🟢 Low                        |
| `BentoModuleGrid.tsx`      | Add drag-reorder + band-filter persistence          | 🟡 Medium                     |

---

## 4. Block Registry (9 WidgetSpec Types)

| Block Type          | Code Reference        | WidgetSpec Shape       | Status                                                 |
| ------------------- | --------------------- | ---------------------- | ------------------------------------------------------ |
| `tap-match`         | Not found in codebase | `{prompt, mode: "flag" | "answer", dataset, items: {text, correct: boolean}[]}` | 📝 Missing |
| `sort-basket`       | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `predict-reveal`    | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `story-scene`       | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `sim-controls`      | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `investigate`       | `setup.extend`        | Same WidgetSpec        | 🟡 In progress                                         |
| `bar-chart`         | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `tokenize-explorer` | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |
| `attention-play`    | Not found in codebase | Same WidgetSpec        | 📝 Missing                                             |

---

## 5. Block Registry — `investigate` Variant (Investigated)

### 1. WidgetSpec Shape

```typescript
{
  prompt: string,
  mode: "flag" | "answer",
  dataset: string,  // e.g. "junior-a", "junior-b", "core", "advanced"
  items: {
    text: string,
    correct: boolean,
  }[],
}
```

### 2. Currently Investigated In

- `setup.extend` (referenced in component code)
- Lesson registry integration point

### 3. Missing Implementation

- No block renderer for `investigate` variant
- No UI component displaying flag/answer mode
- No dataset routing (junior-a/b/core/advanced)

### 4. Investigation Required

- Verify WidgetSpec union in `lesson-registry.ts` matches spec
- Wire up block rendering pipeline
- Add to `BlockRegistry.tsx` routing
- Add test cases for flag/answer modes

---

## 6. Component Health Matrix

| Component                          | Typecheck   | ESLint      | Test Coverage     | Docs                  | Perf               |
| ---------------------------------- | ----------- | ----------- | ----------------- | --------------------- | ------------------ |
| `Hero3DCanvas.tsx`                 | ✅ 0 errors | ✅ 0 errors | ✅ 283 tests pass | ✅ In ROUTE-MATRIX.md | ✅ 3D load ≤4MB    |
| `CurriculumHero3D.tsx`             | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Band scenes     |
| `BlockRenderer.tsx`                | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ Generic 3D block   | ✅ DRACOLoader     |
| `BentoModuleGrid.tsx`              | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ Masonry grid       | ✅ Suspense        |
| `PinnedLessonSidebar.tsx`          | ✅ Fixed    | ✅ Fixed    | ⚠️ Investigate    | ✅ In ROUTE-MATRIX.md | ✅ Static fallback |
| `KnowledgeAlignedLessonPlayer.tsx` | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Reduced motion  |
| `KineticTypography.tsx`            | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Easing tokens   |
| `QuizBlock.tsx`                    | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Answer tracking |
| `StandardsFooter.tsx`              | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Standards       |
| `AIProgressBar.tsx`                | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Brand colors    |
| `AIModuleRow.tsx`                  | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Row layout      |
| `AICurriculumTimeline.tsx`         | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Timeline        |
| `AIBandFilter.tsx`                 | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Band filter     |
| `VisualComponent.tsx`              | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Wrapper         |
| `ModuleQuiz.tsx`                   | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Quiz player     |
| `Setup.tsx`                        | ✅ 0 errors | ✅ 0 errors | ✅                | ✅ In ROUTE-MATRIX.md | ✅ Setup           |

---

## 7. Priority Action Plan (Block Registry + Missing Components)

| Priority    | Component                            | Block Type         | Action                                |
| ----------- | ------------------------------------ | ------------------ | ------------------------------------- |
| 🔴 Critical | `BlockRegistry.tsx`                  | All 9 types        | Wire routing, add to curriculum pages |
| 🔴 Critical | `investigate` variant UI             | Flag/answer mode   | Implement WidgetSpec renderer         |
| 🟡 High     | `PinnedLessonSidebar.tsx`            | Refactor           | Lint fixes, rename if needed          |
| 🟡 High     | `BlockRegistry.tsx` → `setup.extend` | investigate        | Complete WidgetSpec integration       |
| 🟡 High     | `ReducedMotionWrapper.tsx`           | Orchestration      | Add to all 3D components              |
| 🟡 High     | `ErrorBoundary.tsx`                  | Graceful errors    | Build + wire to all routes            |
| 🟢 Medium   | `Accessible3DCanvas.tsx`             | 3D+a11y fallback   | Build + replace Hero3DCanvas usage    |
| 🟢 Medium   | `StoryShell.tsx`                     | Chapter navigation | Build prototype for Tier A            |
| 🟢 Medium   | `InfographicFrame.tsx`               | Data frames        | Build with brand palette              |
| 🟢 Medium   | `KineticTypography.tsx` enhancements | Reduced motion     | Add fallback                          |
| 🟢 Low      | All other missing blocks             | Types 1–9          | Post-MVP backlog                      |

---

## 8. Next: Create STORYTELLING-ARCHITECTURE.md
