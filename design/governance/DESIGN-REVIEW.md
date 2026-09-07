# Bhavya Design Review Process

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This document defines the design review process for Bhavya Foundation. Every UI change must pass through this process before merging.

---

## Review Levels

### Level 1: Self-Service Check

**When:** Every UI change
**Who:** Developer
**Time:** 5 minutes

Before requesting review, verify:

- [ ] Uses `@bhavya/platform-ui` components
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Passes accessibility basics (contrast, focus, labels)
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Respects `prefers-reduced-motion`
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44x44px on mobile

### Level 2: AI Review

**When:** Every UI change
**Who:** AI agent
**Time:** 2 minutes

Run the AI Review Checklist:

- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Responsive behavior
- [ ] Keyboard navigation
- [ ] Component reuse
- [ ] Visual consistency
- [ ] Performance
- [ ] Educational clarity

### Level 3: Design Lead Review

**When:** Significant changes
**Who:** Design lead
**Time:** 15 minutes

For significant changes, request design lead review:

- Brand consistency
- Motion purposefulness
- Typography hierarchy
- Spatial composition
- Dark mode correctness

**Significant changes include:**

- New components
- New page layouts
- New motion patterns
- Brand color changes
- Typography changes
- Navigation changes

### Level 4: Architecture Review

**When:** Major architectural changes
**Who:** Architecture lead
**Time:** 30 minutes

For major architectural changes, request architecture review:

- Component API design
- Token architecture
- Motion system integration
- Performance implications
- Accessibility implications

**Major changes include:**

- New design tokens
- New component categories
- New motion primitives
- Design system restructuring

---

## Review Checklist

### Accessibility

- [ ] All interactive elements have `aria-label` or visible text
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for large text)
- [ ] Focus indicators are visible on all focusable elements
- [ ] Screen reader announces dynamic content changes
- [ ] No information conveyed by color alone
- [ ] Form inputs have associated labels
- [ ] Error messages are programmatically associated with fields

### Responsive Behavior

- [ ] Tested at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- [ ] No horizontal scroll on any breakpoint
- [ ] Text remains readable at all sizes
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Layout adapts gracefully (grids collapse, spacing adjusts)
- [ ] Images/media scale properly

### Keyboard Navigation

- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Escape closes modals/dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within composite widgets
- [ ] No keyboard traps
- [ ] Focus is managed correctly (trapped in modals, returned on close)

### Component Reuse

- [ ] Uses `@bhavya/platform-ui` components
- [ ] No inline styles with hardcoded colors
- [ ] No custom foundational components (Button, Card, Badge, etc.)
- [ ] Uses design tokens for spacing, colors, typography
- [ ] No `!important` overrides
- [ ] Follows existing component patterns

### Visual Consistency

- [ ] Matches existing design language
- [ ] Uses consistent spacing (4px base unit)
- [ ] Uses consistent typography (Inter font family)
- [ ] Uses consistent colors (design tokens)
- [ ] Uses consistent border radius
- [ ] Uses consistent shadows/elevation
- [ ] Dark mode works correctly

### Performance

- [ ] No unnecessary re-renders
- [ ] Images are optimized (WebP, appropriate sizes)
- [ ] No layout shift (CLS < 0.1)
- [ ] Bundle size impact is minimal
- [ ] No blocking scripts in critical path
- [ ] Animations use `transform`/`opacity` only

### Educational Clarity

- [ ] Content is clear and concise
- [ ] Actions are obvious
- [ ] Error messages are helpful
- [ ] Empty states guide users
- [ ] Loading states provide feedback
- [ ] Terminology is consistent

---

## Review Report Format

```
## UI Change Review

**Change:** [Description]
**Reviewer:** [Name]
**Date:** [Date]

### Accessibility
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Responsive Behavior
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Keyboard Navigation
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Component Reuse
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Visual Consistency
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Performance
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Educational Clarity
- [ ] Pass / [ ] Fail
- Notes: [Details]

### Overall
- [ ] Approved
- [ ] Approved with conditions
- [ ] Needs revision

### Conditions
- [List any conditions]

### Signature
[Reviewer signature]
```

---

## Escalation Process

### If Review Fails

1. **Fix issues** — Address all failing items
2. **Re-request review** — Submit for re-review
3. **Document changes** — Explain what was fixed

### If Reviewer Disagrees

1. **Discuss** — Open dialogue about the disagreement
2. **Reference constitution** — Check `DESIGN-CONSTITUTION.md`
3. **Reference principles** — Check `DESIGN-PRINCIPLES.md`
4. **Escalate** — If unresolved, escalate to design lead

### If Design Lead Disagrees

1. **Reference brand guidelines** — Check `BHAVYA_WEB_EXPERIENCE.md`
2. **Reference research** — Check `DESIGN-PRINCIPLES.md`
3. **Document decision** — Record rationale in `rfcs/`
4. **Update constitution** — If needed, update `DESIGN-CONSTITUTION.md`

---

## Verification

This process is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
