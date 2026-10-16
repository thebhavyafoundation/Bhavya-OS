# 00 — AGENT OPERATING PROTOCOL

Mandatory sequence for every frontend task (page, section, layout, visual).

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

This document is the entry point for the private design OS (`private-design-os/`).
Reading it satisfies the platform-context requirement for the whole set.

## MODE declaration (required before STORY)

Every brief header MUST include: `MODE: FOUNDATION` or `MODE: OS`.
Selector, per-mode rules, and route table: `02-brand/MODES.md`.
SOURCE: `.opencode/skills/bhavya-design-system/SKILL.md` Two Modes.

## Pipeline

```
DISCOVER → BRIEF → STORY → VISUAL DIRECTION → ASSET PLAN → COMPOSITION
→ TYPOGRAPHY → MOTION PLAN → IMPLEMENTATION → PRODUCTION VERIFICATION
→ REVIEW → ITERATION
```

## Stage rules

1. **DISCOVER.** Read the relevant production files, tokens, brand docs,
   and any existing brief. Never assume; inspect.
2. **BRIEF.** Write the page brief (`03-story/` templates). No brief, no
   storyboard. Required fields: audience, understanding goal, narrative
   arc, primary action, asset plan, motion budget.
3. **STORY.** Storyboard every scene: meaning → visual → text/image
   relation → reveal mechanism → static fallback.
4. **VISUAL DIRECTION.** Fix palette roles, type roles, imagery direction
   from `02-brand/` (including `MODES.md` + `LOGO-SYSTEM.md`) before layout.
5. **ASSET PLAN.** Every visual sourced at hierarchy level 1–4
   (`04-assets/`), or the section is explicitly approved text-led.
   Placeholder imagery for "real" content is forbidden.
6. **COMPOSITION → TYPOGRAPHY.** Layout from `05-composition/`, type from
   `06-typography/`. One idea per viewport; no two adjacent sections share
   a structure.
7. **MOTION PLAN.** Only after hierarchy is fixed. Choose registry techniques
   (`07-motion/`), choreograph scroll (`08-scroll/`), stay inside the motion
   budget. Default: reveal-once. Advanced effects are opt-in with written
   justification. No animation before content hierarchy exists.
8. **IMPLEMENTATION.** Follow repo workflow (skills, tests, CI). Consult this
   OS at each decision; cite brief/storyboard locations in the work.
9. **PRODUCTION VERIFICATION.** Existing gates
   (`bhavya-production-verification`) + screenshot matrix (`12-review/`).
10. **REVIEW.** Run the 13-dimension qualitative protocol. A concern on
    brand, story, or imagery blocks landing.
11. **ITERATION.** Record what was learned: new technique → `07/08-motion`;
    new reference → `13-research/`; new defect → `12-review/KNOWN-DEFECTS.md`.

## STOP conditions (ask, don't improvise)

- No meaningful asset exists for a section that needs one.
- A brand rule conflicts with the requested design.
- The motion budget is exceeded.
- A skill gate fails.
- Anything here contradicts production reality — production wins, and this
  OS gets updated to match.

## Output contract

Every implementation references its brief and storyboard. Every review cites
evidence as path:line or screenshot reference. No "make it premium" without
a brief. No placeholder imagery when real imagery is required.
