# Spec Standards — Bhavya Foundation

**For Stage 02: Specification — Quality standards for REASONS Canvas and specs.**

---

## REASONS Canvas Standards

### Completeness

- All 7 dimensions (R, E, A, S, O, N, S) must be filled for full canvas
- Lightweight mode (R, O, S only) only for bug fixes/small changes
- Frontmatter: type, status, owner, date, task-id, spec-ref, rfc-ref

### Traceability

- Every constraint cites: contract, standard, ADR, policy, or brand/accessibility
- Entities reference DOMAIN_OWNERSHIP.md canonical definitions
- Operations reference actual file paths in repository
- Interfaces use real TypeScript from codebase

### Verifiability

- Success criteria: measurable, binary (PASS/FAIL)
- Safeguards: unambiguous pass conditions
- Trade-offs: at least 2 options per decision with clear rationale

---

## Specification Standards (bhavya-spec)

### Standard Spec Format

```markdown
---
type: spec
status: draft | approved | implemented
owner: [name]
date: YYYY-MM-DD
---

# SPEC: [Feature Name]

## Summary

[What this builds, in 3 sentences.]

## Requirements

[Link to REASONS Canvas R section]

## Data Model

[Entities, fields, relationships — or link to Canvas E]

## API Contract

[Endpoints, request/response types — or link to Canvas S interfaces]

## UI/UX

[Routes, components, states — or link to Canvas S file layout]

## Acceptance Criteria

[Measurable criteria from Canvas R Success Criteria]
```

### Spec vs Canvas

| Canvas (REASONS)           | Spec (Standard)                   |
| -------------------------- | --------------------------------- |
| Design contract — WHAT/WHY | Implementation guide — HOW        |
| All 7 dimensions           | Focused on Structure + Operations |
| Human review at checkpoint | Developer reference during impl   |
| Lives in `specs/`          | Lives in `specs/`                 |

---

## Anti-Slop Tier 2 Rules (from AGENTS.md)

| Rule | Check                    | Pass Condition                         |
| ---- | ------------------------ | -------------------------------------- |
| R-A1 | Smallest viable change   | No unrelated files modified            |
| R-A2 | Existing patterns reused | Grep finds same pattern in codebase    |
| R-A3 | No unjustified deps      | No new packages without RFC            |
| R-A4 | No invented architecture | Follows REPOSITORY_SOURCE_OF_TRUTH.md  |
| R-A5 | Errors investigated      | No empty catch, no console.error only  |
| R-A6 | Types not weakened       | No `any` without justification comment |
| R-A7 | Diff inspected           | `git diff` reviewed before output      |

---

## Design System Compliance

### Tokens (from `packages/platform-ui/src/styles/tokens.css`)

- Colors: `--color-forest/*`, `--color-ivory/*`, `--color-gold/*`, `--color-earth/*`
- Fonts: `--font-display` (Playfair), `--font-sans` (Inter)
- Spacing: `--space-1` through `--space-16`
- Radius: `--radius-sm` through `--radius-full`

### Components (from `packages/platform-ui/src/components/`)

- Use existing components; don't recreate
- Extend via props, not forks
- Follow component CONTRACT.md

### Accessibility

- WCAG 2.1 AA minimum
- Semantic HTML
- Focus management
- Color contrast (4.5:1 text, 3:1 UI)

---

## Code Standards

### TypeScript

- Strict mode: `true`
- No `any` without `// @ts-expect-error` + justification
- Prefer `interface` over `type` for object shapes
- Use `@bhavya/shared` for cross-package types

### React/Next.js

- Server Components by default
- Client Components only when needed (`'use client'`)
- No direct DOM manipulation
- Use platform-ui components

### File Organization

- Colocate related files
- `index.ts` barrels for packages
- Tests adjacent to source (`*.test.ts`)

---

## References

- `skills/bhavya-spec/SKILL.md` — Standard spec methodology
- `skills/bhavya-reasons-canvas/SKILL.md` — Canvas methodology
- `docs/constitution/04-ENGINEERING-CONSTITUTION.md` — Engineering principles
- `docs/constitution/05-DESIGN-SYSTEM.md` — Design system mechanics
- `_config/design-tokens.md` — Token reference
- `_config/brand-rules.md` — Brand voice, palette, typography
