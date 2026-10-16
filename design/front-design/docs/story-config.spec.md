# Story Config Spec (proposal — not live code)

Status: `spec` — requires RFC + human gate before creating live `apps/ai-institute/src/lib/storyConfig.ts`.
Correct path is `apps/ai-institute/src/lib/` (user draft omitted `src/`). Do not create at `apps/ai-institute/lib/`.

## Why spec-only

- Canonical `Lesson` already exists in `packages/shared/src/types.ts:619-640` and `apps/ai-institute/src/lib/studio/types.ts:72+`. New `LessonStory` must reference `lessonId`, not redefine lessons.
- `CourseLevel` canonical: `foundation | beginner | intermediate | advanced | expert` (`packages/shared/src/types.ts:694-695`). Reuse it; do not invent a narrower union.
- Installed motion stack in `apps/ai-institute/package.json`: `framer-motion`, `gsap` + `@gsap/react`, `lenis`, `three` + `@react-three/fiber`. NOT installed (verified via grep, no matches): `anime.js`, `p5.js`, `pixi.js`, `scrollmagic`. Adding them violates `Avoid unnecessary dependencies` — requires RFC with bundle/memory justification + i5/8GB test evidence.

## Approved for spec (installed)

- `motion-ui` → framer-motion (entrances, layout, gestures)
- `gsap-pinned` → gsap + ScrollTrigger + Lenis (scrub, pin, reveals)
- `r3f-3d` → three + R3F (lazy, viewport-gated 3D)

## Requires RFC (not installed)

- `p5-sketch` → p5.js, PixiJS paths, Anime.js timelines, ScrollMagic scenes. Do not `pnpm add` without RFC. Prefer installed: Canvas API for 2D, framer-motion for micro-interactions, GSAP for pinning.

## Proposed types (extend, don't duplicate)

```ts
// Proposed: apps/ai-institute/src/lib/storyConfig.ts (DO NOT CREATE YET)
import type { CourseLevel } from "@bhavya/shared";

export type MotionType = "motion-ui" | "gsap-pinned" | "r3f-3d";
// 'p5-sketch' only after p5.js RFC approved.

export type StoryBeat = {
  id: string;
  stepNumber: number;
  narrativeTitle: string;
  nonNativeText: string;
  motionEngine: MotionType;
  requiredAssetKey?: string; // must match key in design/front-design/docs/asset-sources.md
  interactionType: "drag" | "scroll-scrub" | "hover-inspect" | "click-step";
};

export type LessonStory = {
  lessonId: string; // references canonical Lesson.id, not a new lesson
  moduleLevel: CourseLevel;
  title: string;
  storyBeats: StoryBeat[];
};
```

## Hardware gates (must hold for every beat)

- Visual-first: diagram/sketch precedes code/formula.
- Zero-paint WebGL: IntersectionObserver +200px buffer, `await import('./Scene.js')` on approach.
- GC: offscreen → `cancelAnimationFrame` + dispose geometries/materials/textures.
- DPR ≤1.5. `prefers-reduced-motion` → static fallback everywhere.
- Asset pre-check: `requiredAssetKey` must exist in `asset-sources.md` with `reported`/`verified` state; `pending verification` blocks build of that beat. No large binaries in Git.
