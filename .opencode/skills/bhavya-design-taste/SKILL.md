---
name: bhavya-design-taste
description: Bhavya-governed wrapper around the third-party "design-taste-frontend" skill. Use when the user wants art direction, composition and visual hierarchy, relevant imagery, or whole-page and responsive visual critique. Enforces AGENTS.md and PLATFORM-TRUTH.md before the third-party skill may load, and records the narrow adaptations where upstream defaults conflict with Bhavya authority. Not for backend-only or non-UI tasks.
wrapper_state: ENABLED
upstream_skill: design-taste-frontend
upstream_repo: https://github.com/Leonxlnx/taste-skill
upstream_pin: 3c7017d636c3a4aad378433ea6d0cfa6c921da4a
upstream_license: MIT
update_procedure: docs/tools/design-taste-frontend/UPDATE-PROCEDURE.md
uninstall_procedure: docs/tools/design-taste-frontend/UNINSTALL-PROCEDURE.md
compatibility: opencode
---

# Bhavya · Design Taste Wrapper

**State: `ENABLED`**

A project-owned wrapper. The third-party `design-taste-frontend` skill is
**not** invoked directly by agents in this repository; this wrapper governs
it.

The upstream skill is instruction-only: it is a single Markdown file of
design directives, with no scripts, no dependencies and no network calls. It
is reached through this wrapper and nowhere else.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Read `_config/design-gate.md` and `docs/constitution/01-BRAND-CONSTITUTION.md`.
4. Only then call `skill({ name: "design-taste-frontend" })` and follow it.

## Upstream defaults that Bhavya overrides

These are recorded rather than hidden. Each is an override of an upstream
rule, not a silent divergence. The full analysis is in
`docs/tools/design-taste-frontend/UPSTREAM-PIN.md` (F1–F4).

| Upstream rule | Bhavya position |
|---|---|
| Output fails if it contains an em dash or en dash | **Not applied to Bhavya copy.** Bhavya's house voice and tokens use `—` and `–`. Applies only to non-Bhavya-branded work. |
| `MOTION_INTENSITY` dial, and a page above 4 must actually move | **Not adopted.** Motion is added when it strengthens meaning. No motion is added to satisfy a dial or a visual inspector. |
| A page with 8 sections must use 4+ layout families, and a layout family may appear once | **Not adopted.** Repetition is judged by whether the page reads as one composed piece, not by counting families. |
| Hand-rolled decorative SVGs are strongly discouraged | **Does not apply to Bhavya's diagram system**, which is hand-authored SVG under `content/diagrams/` with a manifest, a text equivalent and a review state. |
| shadcn/ui as the base primitive layer | **Compatible.** shadcn/ui is already the approved base stack in `design-integration-plan.md` §3. |
| LCP under 2.5s; hero image eager or `priority` | **Compatible and required.** The hero image must not be lazily loaded. |

## Boundaries that are not negotiable

- **No fabricated public facts.** No invented impact figures, programmes,
  partnerships, accreditation, curriculum counts or certification authority.
- **No synthetic imagery presented as real Foundation activity.** Stock or
  generated imagery is never presented as Bhavya activity in the field.
- **No automatic typography or palette replacement.** Brand authority is
  `docs/constitution/01-BRAND-CONSTITUTION.md`; implementation is
  `packages/platform-ui/src/styles/tokens.css`. The open hex/palette
  conflict between them stays open and human-gated — do not reconcile it
  silently.
- **No new animation engine and no runtime dependency** for this skill.
- **No global redesign during a bounded improvement task.**
- **No global glassmorphism, no large animated blur or glow layers, no
  blocking preloader, no scroll hijacking.**
- **Reduced motion must be complete**, not merely softened.
- **Every interactive primitive must be verified by behaviour**: keyboard
  navigation, accessible naming, focus management, Escape handling,
  scroll-lock release, touch behaviour and reduced motion. A label or a
  library's reputation is not evidence.

## Gates after using this skill

```bash
pnpm tokens:check     # no hardcoded colours or fonts
pnpm antislop         # no generic generated patterns
node scripts/check-skill-wrappers.mjs
```

Visual work additionally goes through `bhavya-ui-verification`, and the
result is verified against a deployed URL in a real browser.

## Upstream record

| Field | Value |
|---|---|
| Skill id | `design-taste-frontend` |
| Repository | `https://github.com/Leonxlnx/taste-skill` |
| Pinned commit | `3c7017d636c3a4aad378433ea6d0cfa6c921da4a` (2026-05-26) |
| Licence | MIT — Copyright (c) 2026 Leonxlnx, verified 2026-11-12 |
| Local path | `.opencode/skills/design-taste-frontend/` (not committed, per repository policy) |
| Restore after a fresh checkout | `node scripts/tools/install-design-taste-skill.mjs` (hash-verified against the pinned commit) |
| Local modification | One blank line removed after the YAML frontmatter; line endings normalised by the checkout. Nothing else differs. |
| Update procedure | `docs/tools/design-taste-frontend/UPDATE-PROCEDURE.md` |
| Uninstall procedure | `docs/tools/design-taste-frontend/UNINSTALL-PROCEDURE.md` |
| Licence review | `docs/tools/design-taste-frontend/LICENSE-REVIEW.md` |
| Security review | `docs/tools/design-taste-frontend/SECURITY-REVIEW.md` |
| Install record | `docs/tools/design-taste-frontend/INSTALLATION.md` |

## Related Bhavya skills

- `bhavya-design-system` — canonical Bhavya design rules and quality floor
- `bhavya-impeccable` — the Apache-2.0 verified wrapper, for design audit and refinement
- `bhavya-ui-verification` — verification after visual work
- `bhavya-diagram-design` — diagram and infographic production
- `packages/platform-ui/src/styles/tokens.css` — canonical tokens
