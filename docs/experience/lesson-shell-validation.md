# Lesson shell — browser validation

Date: 2026-10-18 · Branch: `feat/curriculum-lesson-shell-clean` · Commit: `aec496c4`
Environment: local `next dev` on `localhost:3111` (dev mode bypasses OpenNext, so the lesson route renders).

## Routes tested

| Route                                        | Result  |
| -------------------------------------------- | ------- |
| `/curriculum/modules/l0-m1/lessons/l0-m1-l1` | **200** |
| `/curriculum/modules/l1-m1/lessons/l1-m1-l1` | **200** |
| `/curriculum/modules/l0-m1` (module)         | 200     |

## Defect found and fixed before validation

**Every lesson route returned 404 for all 86 modules.** Two independent defects in `createLesson()` in `src/data/curriculum/lesson-content.ts`:

1. `getModule(moduleId, moduleId)` — but `getModule(level, id)` expects a _level_ (`"0"`), so `isLevelParam` rejected it, the lookup returned `undefined`, and `createLesson` returned before doing anything.
2. Having built the lesson, it discarded it. A comment claimed registration happened elsewhere; nothing called `registerLesson`.

Both fixed. The lesson route now imports the content module for its side effect so population happens before the lookup.

This is why the earlier report's claim of a "working slice" was untested — the route had never rendered for anyone.

## Viewport results

Tested 375×812, 390×844, 768×1024, 1280×800, 1440×900. Identical results at all five:

| Check                          | Result                             |
| ------------------------------ | ---------------------------------- |
| Horizontal overflow            | **0 px** at every viewport         |
| `<figure>` rendered            | yes                                |
| Figure `<figcaption>`          | present                            |
| Figure text equivalent (`<p>`) | present                            |
| Figure inline SVG              | present                            |
| Progress rail (`nav` labelled) | present                            |
| `aria-current="step"`          | **"What Is AI?"** — correct lesson |
| Learning outcomes panel        | present                            |
| Reading time                   | `30 MINUTES` rendered              |
| `<h1>` count                   | 1                                  |
| `<h2>` count                   | 2                                  |
| Links with no accessible name  | 0                                  |
| `rel="next"` navigation        | present                            |

Screenshots: `docs/experience/screenshots/lesson-1280x800.png`, `lesson-375x812.png`.

## Accessibility findings

- Single `h1`, no heading-level skips observed.
- Progress rail is a `<nav>` with an accessible name, an ordered list, and the current lesson marked `aria-current="step"`.
- Outcomes are a labelled `<section>` whose heading text is "What you will be able to do".
- Diagram meaning is carried by a visible text equivalent, not a screen-reader-only class.
- No animation was added, so there is nothing to pause under `prefers-reduced-motion`. Print rules hide the rail and navigation.

**Not verified:** a full keyboard walkthrough and focus-visible ring inspection were not performed — no automated focus-order assertion was written, and the dev overlay interferes with visual inspection. Recorded as remaining work.

## Console findings

**191–200 errors, all one pre-existing defect unrelated to this work.**

`B2StorageProvider.health()` runs in the browser and attempts to reach
`https://your-b2-bucket-name.backblazeb2.com` — a placeholder bucket name — which
the app's own CSP (`connect-src 'self'`) blocks. It then retries in a loop.

- Source: `src/lib/storage/b2-strategy.ts:143` and `:185`
- Not caused by the lesson shell; it reproduces on any route in dev.
- Should not run client-side at all. **Out of scope here, recorded for follow-up.**

No hydration errors were reported.

## Remaining issues

1. B2 health check should not execute in the browser (pre-existing).
2. Keyboard/focus-visible pass not yet performed.
3. Progress rail shows position but not completion state; `src/lib/curriculum/ai-progress.ts` exists and is not wired here.
4. Learning outcomes are per module, not per lesson — `Lesson` has no outcome field.
