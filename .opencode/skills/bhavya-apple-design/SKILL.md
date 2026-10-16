---
name: bhavya-apple-design
description: Bhavya-governed wrapper around the third-party "apple-design" skill. Use when building or reviewing gesture-driven UI, spring animations, drag/swipe/sheet interactions, momentum, translucency, depth, typography, reduced-motion behaviour, or when a task asks for Apple-style physical, fluid motion on the web. Enforces AGENTS.md and PLATFORM-TRUTH.md before the third-party skill may load.
compatibility: opencode
---

# Bhavya · Apple Design Wrapper

A project-owned wrapper. The third-party `apple-design` skill is **not** invoked directly by agents in this repository; this wrapper governs it.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Only then load the third-party skill with `skill({ name: "apple-design" })`.

If either file cannot be read, **stop**. Do not load the third-party skill.

## Precedence

```
AGENTS.md + PLATFORM-TRUTH.md
  > Bhavya constitution
    > design tokens (packages/platform-ui/src/styles/tokens.css)
      > this wrapper's Bhavya constraints
        > third-party apple-design guidance
```

`apple-design` is a **motion and interaction** reference, not a brand. It must
never be used to replace Bhavya's canonical type, palette or motion system.

## Upstream record

| Field | Value |
|---|---|
| Skill id | `apple-design` |
| Repository | `emilkowalski/skills` |
| Licence | **Unverified** — no licence field is declared in the skill frontmatter. Recorded as unverified, not as permissive. |
| Local path | `.opencode/skills/apple-design/` |
| Modification policy | **Do not edit upstream files.** Update via this wrapper. |
| Review status | Licence verification outstanding per contract §15. Treat as unverified until a human confirms. |

## Bhavya constraints applied before third-party work

- Motion is Tier-A/curated: not every page is cinematic. Follow the experience tiers in the operating contract.
- Every animation gated by `prefers-reduced-motion`; the static fallback must hold the composition on its own.
- Tokens only — `packages/platform-ui/src/styles/tokens.css`. Apple translucency must be expressed with existing Bhavya tokens, never hardcoded hex.
- No new runtime dependency for motion. Use existing `@bhavya/platform-ui` primitives and the existing cinematic/GSAP/Three.js stack.
- WCAG 2.2 AA; no animation-dependent access to information.
- Resource disposal, off-screen pausing and performance budgets apply to every 3D scene.