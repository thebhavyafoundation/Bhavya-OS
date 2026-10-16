---
name: bhavya-design-taste
description: Bhavya-governed wrapper around the third-party "design-taste-frontend" skill. Use for landing pages, portfolios, redesigns and anti-slop frontend work where the agent must infer a design direction and ship a non-templated interface. Enforces AGENTS.md and PLATFORM-TRUTH.md before the third-party skill may load.
compatibility: opencode
---

# Bhavya · Design Taste Wrapper

A project-owned wrapper. The third-party `design-taste-frontend` skill is **not** invoked directly by agents in this repository; this wrapper governs it.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Only then load the third-party skill with `skill({ name: "design-taste-frontend" })`.

If either file cannot be read, **stop**. Do not load the third-party skill.

## Precedence

```
AGENTS.md + PLATFORM-TRUTH.md
  > Bhavya constitution
    > brand authority (docs/constitution/01-BRAND-CONSTITUTION.md)
      > design tokens (packages/platform-ui/src/styles/tokens.css)
        > this wrapper's Bhavya constraints
          > third-party design-taste guidance
```

## Upstream record

| Field | Value |
|---|---|
| Skill id | `design-taste-frontend` |
| Repository | `Leonxlnx/taste-skill` |
| Licence | **Unverified** — no licence field is declared in the skill frontmatter. Recorded as unverified, not as permissive. |
| Local path | `.opencode/skills/design-taste-frontend/` |
| Modification policy | **Do not edit upstream files.** Update via this wrapper. |
| Review status | Licence verification outstanding per contract §15. |

## Bhavya constraints applied before third-party work

- `docs/constitution/01-BRAND-CONSTITUTION.md` governs palette, fonts and voice. Third-party "taste" never overrides brand authority.
- Tokens only — `packages/platform-ui/src/styles/tokens.css`. No hardcoded colours, no Google Fonts or external font CDNs (contract: no external fonts unless already installed and licensed).
- No stock/placeholder imagery as a final surface. Assets require verified individual licences and provenance records.
- No new paid service, no payment-method-requiring dependency.
- Craft floor from the contract's quality bar: display type ≤ 6rem, tracking ≥ -0.04em, no eyebrow labels above headings, asymmetric composed layouts.