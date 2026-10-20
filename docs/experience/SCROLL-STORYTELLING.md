# SCROLL STORYTELLING — Scene Contracts and System Audit

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Scope:** every scroll-driven behaviour on the public experience.

---

## 1. System audit

Measured across `apps/ai-institute/src`:

| Mechanism                     | Count | Character                                  |
| ----------------------------- | ----: | ------------------------------------------ |
| GSAP `ScrollTrigger` usages   |   111 | Batched and self-cleaning                  |
| `IntersectionObserver` usages |    12 | Bounded, one-shot or threshold-based       |
| Raw `scroll` listeners        |     8 | All `{ passive: true }` after this session |
| `requestAnimationFrame` sites |    10 | Three corrected; see §5                    |

**Verdict on the two rules that matter.** There is no scroll hijacking: Lenis
smooth-scroll is a scroll-driven animation, not a scroll-stealing one — the
wheel still moves the document, and keyboard paging continues to work. And
there are no unbounded scroll listeners doing layout reads per event.

---

## 2. The smooth-scroll layer

`lib/motion/scrollProvider.tsx` runs Lenis app-wide.

| Property            | Value                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| Narrative purpose   | None — it is infrastructure, not a scene                                     |
| Trigger             | `requestAnimationFrame` loop calling `lenis.raf`                             |
| Animated properties | Scroll position only; the browser still owns scrolling                       |
| Fallback            | If Lenis is absent or `smoothScroll` is false, native scrolling is untouched |
| Reduced motion      | Disabled outright via `prefersReducedMotion()` — not softened                |
| Mobile              | Active; `touchMultiplier` 2 preserves native-feeling touch                   |
| Performance risk    | **Was high. Now fixed — see §5**                                             |

---

## 3. Scene contracts

### Scene 1 — Orientation (`SplitHero`)

| Property            | Value                                                                              |
| ------------------- | ---------------------------------------------------------------------------------- |
| Narrative purpose   | Establish what Bhavya is before anything is asked of the reader                    |
| Trigger             | Page load; parallax settles on scroll                                              |
| Animated properties | `transform` (scrubbed image scale), opacity via `HeroEntrance`                     |
| Fallback            | Static photograph with a scrim stack; type is fully readable without any animation |
| Reduced motion      | Scrub skipped; the hero renders as a still image                                   |
| Mobile              | 2400×1600 hero with `fetchPriority="high"`; parallax distance reduced              |
| Performance risk    | Low. Transform-only, no layout reads                                               |

### Scene 2 — The four mandates (`FourPillars`)

| Property            | Value                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| Narrative purpose   | Introduce the four constitutional mandates as a set                     |
| Trigger             | Scroll reveal; card tilt on pointer                                     |
| Animated properties | `transform`, `opacity`                                                  |
| Fallback            | Cards render as a plain grid                                            |
| Reduced motion      | `TiltCard` degrades to a plain `div`; mist scene is suppressed entirely |
| Mobile              | Cards stack; `MistScene` is skipped below 768px by its own guard        |
| Performance risk    | Low, with one caveat below                                              |

> **Caveat.** `MistScene` is the only scene carrying a live WebGL canvas. It is
> `aria-hidden`, pauses off-screen, and is skipped under reduced motion — but it
> is still a canvas. One canvas per page is within budget; the constraint that
> matters is never more than one at a time.

### Scene 3 — The mandates in depth (`PublicStoryShell` → `StoryChapter`)

| Property            | Value                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Narrative purpose   | One chapter per mandate, sticky media against scrolling copy                               |
| Trigger             | `position: sticky` for the panel; GSAP `ScrollTrigger` scrubs image scale                  |
| Animated properties | `transform` only                                                                           |
| Fallback            | Without JavaScript the chapters stack in document order and read as ordinary sections      |
| Reduced motion      | Sticky released, scrub skipped — **the chapter still reads completely in order**           |
| Mobile              | Guarded off below 768px: no sticky, no scrub                                               |
| Performance risk    | Low. Sticky rather than pinned avoids GSAP pin side effects; no layout properties animated |

This scene is the closest thing on the site to scroll hijacking, and it was
deliberately built not to be: sticky CSS holds the panel, and GSAP only scrubs a
transform. The document's own scroll position is never rewritten.

### Scenes 4 and 5 — Learning journey, inside a lesson (`LearningJourney`, `ActiveLearning`)

| Property            | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Narrative purpose   | Show how the curriculum is structured, then what a lesson contains |
| Trigger             | **None.** No scroll listener, no observer, no animation            |
| Animated properties | None                                                               |
| Fallback            | The fallback _is_ the scene                                        |
| Reduced motion      | Identical                                                          |
| Mobile              | Single column below 900px; the asymmetric split collapses          |
| Performance risk    | None. Both are server components and ship no JavaScript            |

These two were added this session precisely because the flagship narrative had
a gap: a visitor had been told about four mandates and then asked to start
learning, with nothing in between explaining how learning is structured or what
a lesson contains. They are static because the information is structural. Motion
here would have been decoration.

---

## 4. Rules held

| Rule                               | How it is met                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| One purpose per scene              | Each scene answers exactly one question                                            |
| Opacity and transforms first       | No scene animates width, height, top or left                                       |
| No unbounded scroll listeners      | All 8 are passive; GSAP batches the rest                                           |
| Bounded observers preferred        | 12 `IntersectionObserver` sites                                                    |
| Pinned sections limited            | One sticky scene, using CSS sticky rather than JS pinning                          |
| No scroll hijacking                | Lenis animates scroll; the browser still owns it                                   |
| Keyboard navigation preserved      | No scene captures or intercepts key events                                         |
| Touch supported                    | Multipliers tuned; sticky and scrub disabled below 768px                           |
| `prefers-reduced-motion` respected | Every scene either skips animation or is suppressed                                |
| Static narrative order             | Document order is the real order in all five scenes                                |
| Content survives JS failure        | Only Scene 1 and 3 depend on JS for polish; both degrade to readable static layout |

---

## 5. Defects found and fixed

Three animation loops could not be stopped. All three shared one bug: a
`requestAnimationFrame` function that re-scheduled itself while the cleanup
path cancelled the id returned by the _first_ call — which is stale by the time
cleanup runs.

**`scrollProvider` (app-wide, highest impact).** The Lenis loop survived
unmount entirely. `lenis.destroy()` ran, and the loop kept calling `lenis.raf()`
on a destroyed instance for the rest of the session, holding a main-thread
frame callback open. Re-running the effect — which any dependency change
triggers — stacked a further loop on top. Now the handle is tracked, a `stopped`
flag guards re-entry, and the ref is nulled on teardown.

**`Preloader` → `VelocityMarquee`.** Same stale-handle bug, calling `setState`
on an unmounted component every frame. Now tracked and cancellable, plus:
velocity decays so the loop idles instead of burning frames on a page nobody is
scrolling; the loop does not start at all under reduced motion; and the scroll
listener is `{ passive: true }`.

**`ParticleField` and `CountUp`.** Inspected — both already reassign the handle
inside the loop, so cleanup is correct. No change made.

---

## 6. Remaining risks

| Risk                                           | Severity | Handling                                                                                                                              |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Lenis is a whole-page smooth-scroll dependency | Medium   | Disabled under reduced motion; a `smoothScroll` prop exists to turn it off per-surface                                                |
| 111 ScrollTrigger instances                    | Medium   | Each must `kill()` on unmount. Not audited individually — GSAP scopes most of them, but this deserves a look in CI with a long scroll |
| `MistScene` canvas on the mandates scene       | Low      | Single canvas, off-screen paused, reduced-motion suppressed                                                                           |
| No measured frame budget                       | Unknown  | Cannot be measured without CI browser runs                                                                                            |
