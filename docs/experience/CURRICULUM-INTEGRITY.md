# CURRICULUM-INTEGRITY — Findings and Decisions Needed

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Status:** One issue fixed and guarded. Three decisions are outstanding and belong to a human.
**Method:** Every figure below was read from the source at `1d1fa218`. Nothing is estimated.

---

## 1. FIXED — The curriculum lesson registry was empty

### What was wrong

`apps/ai-institute/src/lib/curriculum/lessons.ts` held:

```ts
const LESSON_REGISTRY: Map<string, Lesson> = new Map();
```

Nothing ever wrote to it outside a test. Every page imported it:

```
curriculum/levels/[level]/[module]/lessons/[lessonId]/page.tsx  → getLesson
curriculum/levels/[level]/[module]/page.tsx                    → getLessons
curriculum/modules/[moduleId]/lessons/[lessonId]/page.tsx       → getAllLessons, getLessonsForModule, getLesson
curriculum/modules/[moduleId]/page.tsx                         → getLessonsForModule
```

Every function returned a correctly typed value — an empty array, or `undefined`. The whole thing typechecked. `generateStaticParams()` mapped over an empty array, so **no lesson route was ever statically emitted**. The whole lesson tier of the curriculum rendered nothing while appearing healthy to every static check.

Worse, `data/curriculum/lessons/index.ts` was a **near-identical second copy** of the same empty registry. Nothing imported it. Two copies of a registry is the failure mode: one gets wired, one does not, and no tool tells you which.

### Why it was invisible

The existing test suite passed — **vacuously**. Two assertions were pure shape checks:

- `expect(Array.isArray(getAllLessons())).toBe(true)` — `[]` is an array
- `expect(lesson === undefined || typeof lesson === "object")` — `undefined` passes

And one was materially misleading: _"contains no banned regional place names in registered lessons"_ scanned an empty array and passed. That is a safeguarding-adjacent check against regional place-name claims. It was running against nothing.

### What was done

- `lib/curriculum/lessons.ts` now reads the authored corpus from
  `data/curriculum/lesson-registry.ts`, indexing by key and by module at module load.
- `data/curriculum/lessons/index.ts` is now a pure re-export. One implementation.
- `registerLesson` still works, but is documented and used **only** for tests and
  fixtures. Authored content must live in `lesson-registry.ts` where it is
  statically analysable — runtime registration is precisely what made the emitted
  route set depend on nothing at all.
- Four regression assertions added that check **content, not shape**: that at least
  one lesson exists, that `l0-m1` resolves lessons, that every lesson has substantive
  blocks, and that each lesson resolves by its own key.
- A fifth block asserts the per-module lesson counts that drive the "ready to study
  now" list on `/curriculum` agree with the registry, so the page can never
  advertise a module it cannot open.

### Result

`src/lib/curriculum/__tests__/lesson-content.test.ts`: **11/11 pass** (was 7/7, of which 2 were vacuous).

The lessons that are reachable are real authored material — reading, key concepts, worked examples with code, quizzes with per-answer feedback, labs, projects, misconceptions and further reading.

---

## 2. DECISION NEEDED — Two curricula, two age models, three different answers

The repository contains **two parallel curriculum taxonomies**, and they disagree about the age a learner belongs to.

| Source                                                      | Junior A | Junior B | Core      | Advanced     |
| ----------------------------------------------------------- | -------- | -------- | --------- | ------------ |
| `docs/design/2026-09-26-foundation-v2-design.md` + `plan-b` | 6–8      | 9–11     | 12–15     | 15+          |
| `data/curriculum/types.ts` (`AgeBand`)                      | `"6-8"`  | `"9-11"` | `"12-15"` | `"advanced"` |
| `data/curriculum/index.ts` (`TRACKS`)                       | 6–8      | 9–11     | 12–15     | 15+          |
| `lib/curriculum/bands.ts` (`BAND_AGES`)                     | 6–8      | **9–10** | **11–16** | **16–18**    |

`bands.ts` is the outlier on three of four bands, and it disagrees with the design specification that authorised the tracks.

**Why this matters to a learner.** A parent on `/curriculum` is shown `TRACKS` — "Ages 9–11". The same parent on a lesson page is shown `BAND_AGES` — "Ages 9–10". Both are read from Bhavya-owned code, both are confident, and they contradict each other. A child could be told they belong in Core by one page and be excluded by the next.

**Why it was not fixed here.** Reconciling the two means deciding whether `AIBand` or `AgeBand` is canonical, which implies which taxonomy is canonical, which implies whether `/curriculum/*` and `/os/*` should share a module identity. That is an architecture decision, and it touches how the Academy describes who it teaches. This session does not make architecture decisions by assumption and does not restate authority it was not given.

**Decision required:** is `6–8 / 9–11 / 12–15 / 15+` the canonical band model, with `bands.ts` corrected to match? Or is the wider `6–8 / 9–10 / 11–16 / 16–18` intended and the design spec superseded?

---

## 2b. DISPOSITION — Two type families, one boundary cast

Discovered while wiring the §1 fix, and the technical expression of §2.

The authored registry emits `Lesson` from `@/types/curriculum`, where every field is
`readonly` and `band` is an `AIBand` (`"junior-a" | "core" | ...`). The widget tree —
`blocks/BlockRenderer`, `WidgetRenderer`, `QuizBlock`, `ModuleQuiz` — is typed
against `@/data/curriculum`, which is mutable and declares a different `LessonBlock`
union member for several kinds.

The two families describe the same runtime data. They differ by `readonly`
modifiers and by which band vocabulary they use. Aligning them is one canonical
type module for the whole curriculum — which is exactly the §2 decision, arrived at
from a different direction.

**Attempted and deliberately reverted.** Re-typing the accessor to
`@/types/curriculum` was tried. It typechecked the accessor, then failed in
`blocks/BlockRenderer`, then in `WidgetRenderer`, then in `QuizBlock` — a transitive
cascade through the whole widget tree. Completing it is the consolidation, not a
cleanup, so the attempt was reverted rather than half-applied.

**What ships instead:** one documented cast at the registry boundary in
`lib/curriculum/lessons.ts`, so every consumer receives a correctly typed `Lesson`
and casts nothing itself. `data/curriculum/index.ts` already casts at the same
boundary for the same reason. The alternative — leaving each page to cast its own —
is how the two families drifted apart without anyone noticing.

**§2 and §2b are one decision.** Reconciling the band vocabulary and collapsing the
two type families must be done together. Doing either alone leaves the other as a cast.

---

## 3. DECISION NEEDED — 87 authored lessons are not reachable from the curriculum

There is a second, complete, authored curriculum corpus that the `/curriculum` route chain does not expose.

| Artefact                  | Size   | Content                                                                                                                                                |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data/academy-lessons.ts` | 487 KB | **87 lessons**, each with reading, key concepts, worked examples with code, typed exercises (`prompt` / `code` / `reflection`), and reflection prompts |
| `data/academy-courses.ts` | 29 KB  | Canonical Course → Module → Lesson graph referencing those ids (`found-1-1`, `py-1-1`, …)                                                              |

This corpus **is** reachable — through `/courses` → `/courses/[id]` → `/courses/[id]/lessons/[lessonId]`. It is _not_ reachable through `/curriculum` → `/curriculum/modules/[moduleId]` → lessons.

Meanwhile the curriculum registry maps only **5 lessons across 3 of 86 modules**:

```
l0-m1 → defining-ai, history-of-ai, types-of-ai-systems
l4-m1 → the-ai-workflow
l0-m7 → ethics-in-ai
```

So a learner browsing `/curriculum` — the route that advertises "86 modules" — reaches published lessons in **3.5%** of modules. The other 96.5% now show an honest "No lessons published for this module yet" state (added this session), which is truthful but is not a curriculum.

**Decision required:** should the 87 authored academy lessons be mapped onto curriculum modules, and if so by what rule? Mapping them is a content-sequencing decision — which module owns which lesson — and is curriculum authority, not an engineering choice. A proposed mapping is not offered here because a plausible-looking mapping invented by an engineer is worse than an obvious gap.

---

## 4. DECISION NEEDED — Four parallel lesson chains

Four routes implement Programme/Course/Module/Lesson today:

1. `/curriculum/levels/[level]/[module]/lessons/[lessonId]`
2. `/curriculum/modules/[moduleId]/lessons/[lessonId]`
3. `/courses/[id]/lessons/[lessonId]`
4. `/courses/foundations/lessons/[id]`

Chains 1 and 2 are now equivalent — both read the same accessor fixed in §1 — so they differ only in path shape. Chains 3 and 4 serve the academy corpus from §3.

Consolidating these is an architecture change with routing, SEO and redirect consequences. Out of scope here. Flagged so it is not discovered later by accident.

---

## 5. What was deliberately not done

| Not done                                      | Reason                                                             |
| --------------------------------------------- | ------------------------------------------------------------------ |
| Merged the two taxonomies                     | Architecture decision; see §2                                      |
| Invented a module ↔ lesson mapping            | Curriculum authority; see §3                                       |
| Deleted the duplicate registry file           | Replaced with a re-export instead — same result, nothing destroyed |
| Edited constitutional or governance documents | Human gate; not in scope                                           |
| Chose between age models                      | Human gate; see §2                                                 |

---

## 6. Guard added

`apps/ai-institute/src/lib/curriculum/__tests__/lesson-content.test.ts` now asserts content rather than shape. If a future change empties the registry again, the suite fails — which is the entire class of failure that hid this for as long as it did.
