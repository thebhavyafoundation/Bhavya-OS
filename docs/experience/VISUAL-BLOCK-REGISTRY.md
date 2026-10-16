# VISUAL-BLOCK-REGISTRY.md — Visual Block Registry & Component Mapping

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Scope:** All TSX components in `apps/ai-institute/src/components/`  
**Registry Purpose:** Map every visual block type to its TSX component implementation, tier assignment, and status.

---

## 1. Implemented Components (In Codebase)

| Component File                     | Type                       | Tier | Block Types      | Status         |
| ---------------------------------- | -------------------------- | ---- | ---------------- | -------------- |
| `Hero3DCanvas.tsx`                 | 3D hero container          | A    | hero-3d          | ✅ Implemented |
| `CurriculumHero3D.tsx`             | Band-specific hero         | A/B  | hero-3d          | ✅ Implemented |
| `BlockRenderer.tsx`                | Generic 3D block           | C    | generic          | ✅ Implemented |
| `BentoModuleGrid.tsx`              | Masonry grid layout        | C    | grid             | ✅ Implemented |
| `PinnedLessonSidebar.tsx`          | Lesson sidebar (pinned)    | C    | sidebar          | 🔄 Lint fixed  |
| `KnowledgeAlignedLessonPlayer.tsx` | Lesson playback core       | C    | lesson-player    | ✅ Implemented |
| `KineticTypography.tsx`            | Animated text typography   | B    | kinetic-text     | ✅ Implemented |
| `QuizBlock.tsx`                    | Quiz component             | C    | quiz             | ✅ Implemented |
| `StandardsFooter.tsx`              | Standards alignment footer | C    | standards-footer | ✅ Implemented |
| `AIProgressBar.tsx`                | AI progress indicator      | C    | progress-bar     | ✅ Implemented |
| `AIModuleRow.tsx`                  | Module row listing         | C    | module-row       | ✅ Implemented |
| `AICurriculumTimeline.tsx`         | Curriculum timeline        | C    | timeline         | ✅ Implemented |
| `AIBandFilter.tsx`                 | Band selection filter      | C    | band-filter      | ✅ Implemented |
| `VisualComponent.tsx`              | Generic visual wrapper     | C    | visual-wrapper   | ✅ Implemented |
| `ModuleQuiz.tsx`                   | Module quiz player         | C    | module-quiz      | ✅ Implemented |
| `Setup.tsx`                        | Setup / extend page        | D    | setup            | ✅ Implemented |

**Total implemented:** 16 components, 9 block types partially covered.

---

## 2. Missing Components (Not Yet Built)

| Component File             | Tier | Block Types       | Purpose                                              | Priority |
| -------------------------- | ---- | ----------------- | ---------------------------------------------------- | -------- |
| `StoryShell.tsx`           | A/B  | story-shell       | Chapter navigation across routes                     | Medium   |
| `ChapterNavigator.tsx`     | A/B  | chapter-nav       | Pinned chapter progression (next/prev/skip/reset)    | Medium   |
| `InfographicFrame.tsx`     | B/C  | infographic       | Data + brand palette frames (charts, graphs)         | Medium   |
| `LessonShell.tsx`          | C    | lesson-shell      | Lesson wrapping + reduced motion fallback            | Medium   |
| `BlockRegistry.tsx`        | C    | all 9 block types | 16 block kinds routing                               | Critical |
| `ReducedMotionWrapper.tsx` | All  | reduced-motion    | Fallback orchestration for `prefers-reduced-motion`  | High     |
| `ErrorBoundary.tsx`        | All  | error-boundary    | Graceful error presentation across tiers             | High     |
| `Accessible3DCanvas.tsx`   | A/B  | accessible-3d     | 3D with a11y fallback (empty div for reduced motion) | Medium   |
| `SetupExtendDialog.tsx`    | D    | setup-dialog      | Setup/extend CTA dialog (currently `Setup.tsx`)      | Low      |

---

## 3. Block Registry — 9 WidgetSpec Types

| Block Type        | WidgetSpec Shape                                                                 | Implemented | Component Reference      |
| ----------------- | -------------------------------------------------------------------------------- | ----------- | ------------------------ |
| tap-match         | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| sort-basket       | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| predict-reveal    | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| story-scene       | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| sim-controls      | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| investigate       | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | 🟡 Partial  | `setup.extend` (partial) |
| bar-chart         | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| tokenize-explorer | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |
| attention-play    | `{prompt, mode: "flag" \| "answer", dataset, items: {text, correct: boolean}[]}` | ❌          | —                        |

**Implementation coverage:** 1/9 (investigate, partial via `setup.extend`).

---

## 4. Block Registry Routing — Missing Implementations

| Block Type        | Missing Implementation                            | Priority |
| ----------------- | ------------------------------------------------- | -------- |
| tap-match         | No renderer, no UI component for flag/answer mode | Critical |
| sort-basket       | No renderer, no UI component                      | Critical |
| predict-reveal    | No renderer, no UI component                      | Critical |
| story-scene       | No renderer, no UI component                      | Critical |
| sim-controls      | No renderer, no UI component                      | Critical |
| bar-chart         | No renderer, no UI component                      | Critical |
| tokenize-explorer | No renderer, no UI component                      | Critical |
| attention-play    | No renderer, no UI component                      | Critical |
| investigate       | Partial via `setup.extend`, no dedicated renderer | High     |

---

## 5. Component Enhancement Needs

| Component                  | Enhancement                                         | Priority    |
| -------------------------- | --------------------------------------------------- | ----------- |
| `PinnedLessonSidebar.tsx`  | Fix lint: unused imports, `_`-prefixed vars         | 🔴 Critical |
| `KineticTypography.tsx`    | Add reduced motion fallback                         | 🟡 Medium   |
| `QuizBlock.tsx`            | Add answer tracking + state persistence             | 🟡 Medium   |
| `AIProgressBar.tsx`        | Add brand-colored progress (forest/gold/sage/earth) | 🟢 Low      |
| `AICurriculumTimeline.tsx` | Add band-filtered chapter view                      | 🟢 Low      |
| `VisualComponent.tsx`      | Add glass-morphism variant (from tokens.css)        | 🟢 Low      |
| `BentoModuleGrid.tsx`      | Add drag-reorder + band-filter persistence          | 🟡 Medium   |

---

## 6. Next: Create ASSET-SOURCING-PLAN.md
