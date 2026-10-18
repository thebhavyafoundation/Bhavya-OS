# OpenCode Prompt — Curriculum Pages

Read first:

- `/AGENTS.md`
- `/docs/architecture/PLATFORM-TRUTH.md`
- curriculum registry
- lesson/module/course schemas
- current learning UI components
- current progress and assessment flows

## Goal

Upgrade Bhavya curriculum and learning pages into top-class educational
experiences without breaking stability, readability or progress tracking.

## Permanent constraints

- Preserve the existing curriculum registry and route structure.
- Do not silently alter learning outcomes, standards alignment or assessment logic.
- Do not use runtime AI inference in learner flows.
- Do not overload lesson pages with cinematic effects.
- Do not make progress depend on animation or WebGL.
- Every enhancement must have mobile, keyboard and reduced-motion support.

## Curriculum page principles

Course and curriculum pages should feel:

- structured;
- calm;
- elegant;
- visual where it improves comprehension;
- predictable for learners;
- accessible under limited bandwidth and low-power devices.

## Allowed enhancements

For curriculum/course/module/lesson pages:

- pathway diagrams;
- module maps;
- competency progress visualisation;
- timelines;
- worked-example visuals;
- static or optional interactive infographics;
- limited 3D where spatial understanding truly benefits.

## Not allowed

- decorative hero 3D on every lesson;
- autoplay-heavy interactions;
- multiple nested scroll containers;
- UI that hides the next step;
- unstable navigation;
- hover-only teaching interactions.

## Required hierarchy

Maintain:

Institute → Programme → Course → Module → Lesson → Practice → Assessment

## Every lesson should support

- clear learning outcomes;
- prior-knowledge activation;
- concise concept explanation;
- visual explanation;
- worked example;
- guided practice;
- independent practice;
- retrieval;
- assessment;
- remediation;
- next step.

## Deliverables

1. Audit current lesson/course/module shells.
2. Identify reusable learning blocks.
3. Identify where diagrams help.
4. Identify where optional 3D helps.
5. Create stable component plan.
6. Add fallbacks and accessibility equivalents.
7. Add tests for progress persistence and navigation.
8. Keep bundle growth measured.

## Output format

Before coding, report:

- `CONFIRMED` current curriculum implementation
- `PROPOSED` page/component upgrades
- `LEARNING BENEFIT`
- `A11Y IMPACT`
- `MOBILE PLAN`
- `PERFORMANCE IMPACT`
- `ROLLBACK PLAN`

## Verify the route renders at all

A lesson component that cannot be reached is not an upgrade. Before planning
enhancements to any curriculum route:

- Load the route in a browser and confirm a real HTTP 200.
- Confirm the registry actually returns data for that module ID.
- Confirm the page is not returning `notFound()` for content that exists.

An empty registry, a wrong lookup signature, or a missing registration call
will render an apparently complete lesson shell that no learner can ever see.
Check this first; it is cheap and it invalidates everything above if it fails.

## Verify before claiming done

- Tests for progress persistence and navigation pass.
- Measured: zero horizontal overflow at 375, 390, 768, 1280, 1440 px.
- Measured: every focusable element has a visible focus ring.
- Measured: no skip-link regression.
- Report client JS delta for the lesson route. A Tier C page that gains client
  JS needs a stated reason.
