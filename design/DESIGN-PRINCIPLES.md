# Bhavya Design Principles

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

These 8 principles guide every design decision in Bhavya Foundation. They are research-backed, implementation-specific, and non-negotiable.

---

## Principle 1: Dark Mode First

**Research:** Users spend 60%+ of screen time in dark mode. Dark-first design ensures the primary experience is optimized, not an afterthought.

**Implementation:**

- Design tokens include dark mode variants
- All components work in both modes
- `prefers-color-scheme` media query supported
- Dark mode is the default for authenticated experiences

**Verification:**

- [ ] Component renders correctly in dark mode
- [ ] Color contrast meets WCAG 2.1 AA in both modes
- [ ] No hardcoded colors that break in dark mode

---

## Principle 2: Border-Based Elevation

**Research:** Shadows alone don't convey depth in dark mode. Borders provide consistent elevation cues across light and dark themes.

**Implementation:**

- Use `--border-primary` for subtle separation
- Use `--border-focus` for interactive states
- Use `--border-gold` for emphasis
- Avoid heavy shadows in dark mode

**Verification:**

- [ ] Elevation is visible in both light and dark modes
- [ ] Borders are consistent across components
- [ ] No heavy shadows that break in dark mode

---

## Principle 3: Consistent Spacing

**Research:** Consistent spacing creates visual rhythm, reduces cognitive load, and improves readability. 4px base unit is industry standard.

**Implementation:**

- All spacing uses `--space-*` tokens
- Base unit: 4px
- Multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- No arbitrary pixel values

**Verification:**

- [ ] All spacing uses tokens
- [ ] No hardcoded pixel values
- [ ] Visual rhythm is consistent

---

## Principle 4: Typography Hierarchy

**Research:** Clear typography hierarchy guides users through content, establishes importance, and improves comprehension.

**Implementation:**

- Display: Playfair Display (headings, hero text)
- Body: Inter (body text, UI elements)
- Type scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- Line heights: tight (1.2), normal (1.5), relaxed (1.6)

**Verification:**

- [ ] Typography hierarchy is clear
- [ ] Fonts are consistent across components
- [ ] Type scale is followed

---

## Principle 5: Purposeful Motion

**Research:** Motion guides attention, provides feedback, and creates continuity. But motion without purpose is noise.

**Implementation:**

- Every animation needs a reason
- Organic over mechanical (natural easing)
- Calm over energetic (subtle, not jarring)
- Cinematic over decorative (tell stories)
- Respect `prefers-reduced-motion`

**Verification:**

- [ ] Animation has a clear purpose
- [ ] Easing is natural
- [ ] Duration is appropriate
- [ ] Reduced motion is respected

---

## Principle 6: Keyboard First

**Research:** Keyboard navigation is essential for accessibility, power users, and assistive technology. If it works with keyboard, it works for everyone.

**Implementation:**

- All interactive elements are focusable
- Tab order is logical
- Escape closes modals/dropdowns
- Enter/Space activates buttons
- Arrow keys navigate within composite widgets
- No keyboard traps

**Verification:**

- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps

---

## Principle 7: Semantic Color Tokens

**Research:** Semantic tokens (e.g., `--color-forest-700`) are more maintainable than hex values. They enable theme changes, dark mode, and brand consistency.

**Implementation:**

- All colors use `--color-*` tokens
- No hardcoded hex values
- Brand colors: forest, ivory, gold
- Status colors: success, warning, error, info

**Verification:**

- [ ] All colors use tokens
- [ ] No hardcoded hex values
- [ ] Brand colors are consistent

---

## Principle 8: Responsive By Default

**Research:** Mobile-first design ensures the primary experience is optimized for the most common device. Progressive enhancement adds complexity only where needed.

**Implementation:**

- Design for 375px first
- Scale up with breakpoints: 768px, 1024px, 1440px
- Touch targets ≥ 44x44px on mobile
- No horizontal scroll on any breakpoint

**Verification:**

- [ ] Component renders correctly at 375px
- [ ] Component renders correctly at 768px
- [ ] Component renders correctly at 1024px
- [ ] Component renders correctly at 1440px
- [ ] No horizontal scroll
- [ ] Touch targets are adequate

---

## Verification

These principles are verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
