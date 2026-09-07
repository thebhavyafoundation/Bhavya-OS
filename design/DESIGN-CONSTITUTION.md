# Bhavya Design Constitution

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This constitution establishes the canonical governance rules for all design decisions in Bhavya Foundation. It is the single source of truth for how design is evaluated, approved, and verified.

---

## Gate Questions

No feature enters development until it answers all seven:

### 1. Mission Alignment

> Which Bhavya mission does this support?

- Forest (ecological restoration)
- Knowledge (AI Institute, education)
- Heritage (cultural preservation)
- Community (volunteers, social impact)

**If it doesn't support any mission, it doesn't get built.**

### 2. User Problem

> Which user problem does it solve?

- Must be a specific, observable problem
- "Users would find this useful" is not a problem
- "Users cannot do X" is a problem

### 3. Platform Reuse

> Which existing platform capabilities does it reuse?

- Check `@bhavya/platform-ui` first
- Check existing packages before creating new ones
- If it reimplements existing functionality, refactor instead

### 4. Research Support

> Which research supports it?

- Must cite a Knowledge Package or research entry
- "We think this is better" is not research
- "Linear does X and research shows Y" is research

### 5. Educational Value

> What educational value does it create?

- Does it teach something?
- Does it make learning easier?
- Does it expose engineering patterns?
- If no educational value, reconsider

### 6. Maintenance Burden

> What maintenance burden does it introduce?

- Estimated ongoing cost
- Required expertise
- Dependencies created
- If burden exceeds value, don't build

### 7. Exit Strategy

> What is the exit strategy if it fails?

- Can it be removed cleanly?
- Does it depend on external services?
- Can data be migrated?
- Always have an exit strategy

---

## Scoring

| Question           | Weight | Pass Threshold |
| ------------------ | ------ | -------------- |
| Mission Alignment  | 25%    | Must pass      |
| User Problem       | 20%    | Must pass      |
| Platform Reuse     | 15%    | ≥ 50%          |
| Research Support   | 15%    | ≥ 50%          |
| Educational Value  | 10%    | ≥ 50%          |
| Maintenance Burden | 10%    | ≤ 50% burden   |
| Exit Strategy      | 5%     | Must have one  |

**Minimum score to proceed:** 70/100
**Hard gates:** Mission Alignment + User Problem must both pass

---

## Design Review Process

### Step 1: Self-Service Check

Before requesting review, verify:

- [ ] Uses `@bhavya/platform-ui` components
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Passes accessibility basics (contrast, focus, labels)
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Respects `prefers-reduced-motion`

### Step 2: AI Review

Run the AI Review Checklist:

- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Responsive behavior
- [ ] Keyboard navigation
- [ ] Component reuse
- [ ] Visual consistency
- [ ] Performance
- [ ] Educational clarity

### Step 3: Design Lead Review

For significant changes, request design lead review:

- Brand consistency
- Motion purposefulness
- Typography hierarchy
- Spatial composition
- Dark mode correctness

### Step 4: Merge

After all reviews pass:

- Commit with conventional format
- Push to origin/master
- Verify deployment

---

## Brand Rules

### Canonical Colors

| Token                | Value     | Usage                                 |
| -------------------- | --------- | ------------------------------------- |
| `--color-forest-700` | `#0E382E` | Primary brand, dark backgrounds, CTAs |
| `--color-ivory-50`   | `#F7F4EC` | Primary background, light surfaces    |
| `--color-gold-500`   | `#D4AF37` | Accent, highlights, premium elements  |

### Forbidden Colors

| Color              | Why Forbidden                        |
| ------------------ | ------------------------------------ |
| Cyan (`#0891B2`)   | Not Bhavya brand                     |
| Orange (`#EA580C`) | Not Bhavya brand                     |
| Purple gradients   | AI SaaS aesthetic, not institutional |
| Neon accents       | Generic, not premium                 |

### Canonical Typography

| Role    | Font             | Weight                  |
| ------- | ---------------- | ----------------------- |
| Display | Playfair Display | 400, 500, 600, 700      |
| Body    | Inter            | 300, 400, 500, 600, 700 |

### Forbidden Typography

| Font          | Why Forbidden          |
| ------------- | ---------------------- |
| Lexend        | Not Bhavya brand       |
| Source Sans 3 | Not Bhavya brand       |
| System fonts  | Inconsistent rendering |

---

## Anti-Patterns

### Visual Anti-Patterns

- [ ] Purple AI gradients
- [ ] Generic dark AI dashboards
- [ ] Random glass cards
- [ ] Excessive rounded cards
- [ ] Template hero sections
- [ ] AI-generated illustrations
- [ ] Generic stock imagery
- [ ] Random neon accents
- [ ] Dashboard-first homepage composition

### Code Anti-Patterns

- [ ] Hardcoded colors (not tokens)
- [ ] Inline styles with design values
- [ ] Custom components that duplicate `@bhavya/platform-ui`
- [ ] `!important` overrides
- [ ] Missing `prefers-reduced-motion`
- [ ] Missing aria labels
- [ ] Missing focus indicators

---

## Verification

This constitution is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes

---

## Amendment Process

To amend this constitution:

1. Propose change in `rfcs/`
2. Document rationale
3. Get design lead approval
4. Update this file
5. Update affected documentation
6. Commit with conventional format
