---
name: bhavya-ui-verification
description: Verify UI implementation against design system and accessibility standards. Use after completing visual/interactive work.
compatibility: opencode
---

# Bhavya UI Verification Skill

## Purpose

Ensure UI implementations are correct, accessible, responsive, and consistent with the Bhavya design system.

## Verification Checklist

### 1. Design System Compliance
- [ ] Uses design tokens from `packages/platform-ui/src/styles/tokens.css`
- [ ] No hardcoded hex colors
- [ ] Uses existing components from `packages/platform-ui/src/components/`
- [ ] Follows typography scale (Playfair Display for headings, Inter for body)
- [ ] Uses 8pt grid spacing
- [ ] Uses warm green-tinted shadows (not cold gray)

### 2. Visual Hierarchy
- [ ] Clear heading hierarchy (h1 → h2 → h3)
- [ ] Appropriate font sizes for context
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Visual weight guides user attention
- [ ] Whitespace creates breathing room

### 3. Responsive Design
- [ ] Mobile layout (< 640px) works correctly
- [ ] Tablet layout (640px - 1024px) works correctly
- [ ] Desktop layout (> 1024px) works correctly
- [ ] No horizontal overflow on any breakpoint
- [ ] Touch targets are at least 44x44px on mobile

### 4. Accessibility
- [ ] All images have meaningful `alt` text
- [ ] Interactive elements have `aria-label` or visible text
- [ ] Form inputs have associated labels
- [ ] Color is not the only way to convey information
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] `prefers-reduced-motion` is respected
- [ ] Screen reader announces dynamic content

### 5. Motion
- [ ] Animations are purposeful (not decorative)
- [ ] Transitions use design system easing
- [ ] No animations run longer than 500ms for UI feedback
- [ ] Reduced motion preference disables animations

### 6. States
- [ ] Loading states are implemented
- [ ] Empty states are implemented
- [ ] Error states are implemented
- [ ] Success states are implemented
- [ ] Disabled states are styled appropriately

### 7. Anti-Slop Check
- [ ] No purple/blue AI gradients
- [ ] No generic dark dashboard patterns
- [ ] No random glass cards
- [ ] No excessive border-radius
- [ ] No template hero sections
- [ ] Feels institutional, not SaaS

## Verification Method

1. Inspect the code for token usage
2. Check responsive behavior at breakpoints
3. Run accessibility audit (axe-core or manual)
4. Verify keyboard navigation
5. Check reduced motion behavior
6. Compare against Bhavya brand guidelines
