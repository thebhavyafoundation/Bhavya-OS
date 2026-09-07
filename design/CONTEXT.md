# design/ — Design Context Management System (ICM)

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This is the **canonical design governance layer** for Bhavya Foundation. It establishes:

- What the Bhavya visual language IS
- Where design artifacts LIVE
- How design decisions are MADE
- How design quality is VERIFIED

**This is NOT:**

- A React component library
- A second UI implementation
- A design tool output
- A style guide generator

**Relationship:**

```
design/ (governance/specification)
    ↓ defines
packages/platform-ui/ (canonical UI implementation)
    ↓ powers
apps/ai-institute/ (application)
```

---

## Structure

| Path                             | Purpose                                        |
| -------------------------------- | ---------------------------------------------- |
| `CONTEXT.md`                     | This file — ICM context router                 |
| `DESIGN-CONSTITUTION.md`         | Canonical design governance rules              |
| `DESIGN-MANIFEST.md`             | Complete inventory of all design artifacts     |
| `DESIGN-PRINCIPLES.md`           | 8 canonical design principles                  |
| `tokens/TOKEN-REFERENCE.md`      | All semantic tokens mapped to usage            |
| `motion/MOTION-SPECIFICATION.md` | Durations, easings, interaction states         |
| `inventory/DESIGN-INVENTORY.md`  | Every primitive, component, icon, illustration |
| `governance/`                    | Design review process, admission criteria      |

---

## Canonical Sources of Truth

| Artifact          | Canonical Location                              | Status                           |
| ----------------- | ----------------------------------------------- | -------------------------------- |
| Design tokens     | `packages/platform-ui/src/styles/tokens.css`    | ACTIVE — 610 lines               |
| Components        | `packages/platform-ui/src/components/`          | ACTIVE — 22 components           |
| Primitives        | `packages/platform-ui/src/primitives/`          | ACTIVE — button, input           |
| Motion            | `packages/platform-ui/src/motion/`              | ACTIVE — Reveal + CSS animations |
| Brand identity    | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`   | ACTIVE — 493 lines               |
| Design system     | `docs/design-system/CANONICAL_DESIGN_SYSTEM.md` | ACTIVE                           |
| Design principles | `docs/design-system/DESIGN_PRINCIPLES.md`       | ACTIVE — 8 principles            |
| Component catalog | `docs/design-system/COMPONENT_CATALOG.md`       | ACTIVE                           |
| Motion system     | `docs/design-system/BHVYA_MOTION_SYSTEM.md`     | ACTIVE — 283 lines               |

---

## Obsolete/Inconsistent Artifacts

These files exist but are NOT canonical. Do NOT use them as reference:

| File                                        | Issue                                                                                                                  | Action                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `design-system/bhavya-foundation/MASTER.md` | Auto-generated template with wrong colors (cyan #0891B2, orange #EA580C) and wrong typography (Lexend + Source Sans 3) | OBSOLETE — Do not reference                              |
| `design-system/bhavya-foundation/pages/`    | Empty directory                                                                                                        | OBSOLETE — Do not reference                              |
| `docs/design-system/BEE-2.0.md`             | Empty file (0 lines)                                                                                                   | OBSOLETE — Do not reference                              |
| `docs/design-principles.md`                 | Stub (3 lines)                                                                                                         | REPLACED by `design/DESIGN-PRINCIPLES.md`                |
| `docs/design-inventory.md`                  | Stub (3 lines)                                                                                                         | REPLACED by `design/inventory/DESIGN-INVENTORY.md`       |
| `docs/token-reference.md`                   | Stub (3 lines)                                                                                                         | REPLACED by `design/tokens/TOKEN-REFERENCE.md`           |
| `docs/motion-specification.md`              | Stub (3 lines)                                                                                                         | REPLACED by `design/motion/MOTION-SPECIFICATION.md`      |
| `docs/component-matrix.md`                  | Stub (4 lines, empty table)                                                                                            | OBSOLETE — Use `docs/design-system/COMPONENT_CATALOG.md` |

---

## Design ICM Rules

1. **One canonical source per artifact.** If a design decision exists in multiple places, this directory defines which is canonical.

2. **Governance before implementation.** No new component, token, or motion pattern enters production without passing through this directory's review process.

3. **No duplicate design systems.** `packages/platform-ui/` is the ONLY React component library. `design/` is governance only.

4. **Token-first design.** All visual decisions use tokens from `packages/platform-ui/src/styles/tokens.css`. No hardcoded colors, spacing, or typography.

5. **Brand consistency.** The Bhavya visual language is: forest green, warm ivory, heritage gold. NOT cyan, NOT orange, NOT purple AI gradients.

6. **Accessibility by default.** All design decisions must pass WCAG 2.1 AA. `prefers-reduced-motion` respected. Keyboard navigation complete.

7. **Motion with purpose.** Every animation needs a reason. Organic over mechanical. Calm over energetic. Cinematic over decorative.

8. **Mobile-first.** Design for 375px first, then scale up. App-like experience. Touch targets ≥ 44x44px.

---

## How to Use This Directory

**For design decisions:**

1. Read `DESIGN-CONSTITUTION.md` for governance rules
2. Read `DESIGN-PRINCIPLES.md` for guiding principles
3. Read `tokens/TOKEN-REFERENCE.md` for available tokens
4. Read `motion/MOTION-SPECIFICATION.md` for animation rules
5. Read `inventory/DESIGN-INVENTORY.md` for existing components

**For design review:**

1. Check against `DESIGN-CONSTITUTION.md` gate questions
2. Verify token usage in `tokens/TOKEN-REFERENCE.md`
3. Check component reuse in `inventory/DESIGN-INVENTORY.md`
4. Run accessibility checks per `DESIGN-PRINCIPLES.md`

**For new components:**

1. Must pass Feature Admission in `governance/`
2. Must use canonical tokens only
3. Must be added to `packages/platform-ui/`
4. Must be added to `inventory/DESIGN-INVENTORY.md`
5. Must pass AI Review Checklist

---

## Verification

This directory is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
