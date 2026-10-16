---
description: Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, live browser iteration on UI elements, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks.
agent: build
subtask: true
---
## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate

Read `AGENTS.md` in full, then `docs/architecture/PLATFORM-TRUTH.md` in full.
Only then load the governed wrapper. Do not call the third-party `impeccable`
skill directly — it is reached exclusively through its Bhavya wrapper, which
applies brand authority, design tokens and the zero-budget prohibitions.

## Execution

1. Call `skill({ name: "bhavya-impeccable" })` and follow it.
2. That wrapper performs the contract read and then calls the third-party
   `impeccable` skill, following its `Setup` and `Commands` sections, to handle
   `$ARGUMENTS`.

If either permanent file cannot be read, stop and report it. Do not proceed to
the third-party skill.
