---
name: bhavya-impeccable
description: Bhavya-governed wrapper around the third-party "impeccable" frontend design skill. Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Enforces AGENTS.md and PLATFORM-TRUTH.md before the third-party skill may load. Not for backend-only or non-UI tasks.
compatibility: opencode
---

# Bhavya · Impeccable Wrapper

A project-owned wrapper. The third-party `impeccable` skill is **not** invoked directly by agents in this repository; this wrapper governs it.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Only then load the third-party skill with `skill({ name: "impeccable" })` and follow its `Setup` and `Commands` sections.

If either file cannot be read, **stop**. Do not load the third-party skill. Report the missing authority instead of proceeding.

## Precedence

Bhavya authority always wins:

```
AGENTS.md + PLATFORM-TRUTH.md
  > Bhavya constitution (docs/constitution/)
    > design tokens (packages/platform-ui/src/styles/tokens.css)
      > this wrapper's Bhavya constraints
        > third-party impeccable guidance
```

`impeccable` may suggest components, patterns or services. It may never
introduce a paid service, a payment-method-requiring service, a duplicate
design system, hardcoded colours/fonts, or a second deployment target. If its
advice conflicts with `PLATFORM-TRUTH.md`, follow the contract and say so.

## Upstream record

| Field | Value |
|---|---|
| Skill id | `impeccable` |
| Repository | `pbakaus/impeccable` |
| Licence | Apache-2.0 (declared in the skill's own frontmatter) |
| Local path | `.opencode/skills/impeccable/` |
| Modification policy | **Do not edit upstream files.** Update via this wrapper. |

## Bhavya constraints applied before third-party work

- Tokens only: `packages/platform-ui/src/styles/tokens.css`. No hardcoded colours or fonts.
- Components only from `@bhavya/platform-ui`; do not create a duplicate design system.
- Cloudflare/OpenNext is the only application host. No R2, no paid services, no payment methods.
- Every animation gated by `prefers-reduced-motion`; WCAG 2.2 AA target.
- Visual work is followed by `bhavya-ui-verification`.