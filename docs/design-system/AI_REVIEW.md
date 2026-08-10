# AI Review Checklist

Before merging any UI change, review these seven dimensions.

---

## 1. Accessibility

- [ ] All interactive elements have `aria-label` or visible text
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for large text)
- [ ] Focus indicators are visible on all focusable elements
- [ ] Screen reader announces dynamic content changes
- [ ] No information conveyed by color alone
- [ ] Form inputs have associated labels
- [ ] Error messages are programmatically associated with fields

## 2. Responsive Behavior

- [ ] Tested at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- [ ] No horizontal scroll on any breakpoint
- [ ] Text remains readable at all sizes
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Layout adapts gracefully (grids collapse, spacing adjusts)
- [ ] Images/media scale properly

## 3. Keyboard Navigation

- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Escape closes modals/dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within composite widgets
- [ ] No keyboard traps
- [ ] Focus is managed correctly (trapped in modals, returned on close)

## 4. Component Reuse

- [ ] Uses `@bhavya/platform-ui` components
- [ ] No inline styles with hardcoded colors
- [ ] No custom foundational components (Button, Card, Badge, etc.)
- [ ] Uses design tokens for spacing, colors, typography
- [ ] No `!important` overrides
- [ ] Follows existing component patterns

## 5. Visual Consistency

- [ ] Matches existing design language
- [ ] Uses consistent spacing (4px base unit)
- [ ] Uses consistent typography (Inter font family)
- [ ] Uses consistent colors (design tokens)
- [ ] Uses consistent border radius
- [ ] Uses consistent shadows/elevation
- [ ] Dark mode works correctly

## 6. Performance

- [ ] No unnecessary re-renders
- [ ] Images are optimized (WebP, appropriate sizes)
- [ ] No layout shift (CLS < 0.1)
- [ ] Bundle size impact is minimal
- [ ] No blocking scripts in critical path
- [ ] Animations use `transform`/`opacity` only

## 7. Educational Clarity

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
**Reviewer:** AI Review Bot
**Date:** [Date]

### Accessibility: PASS/FAIL
- [ findings ]

### Responsive: PASS/FAIL
- [ findings ]

### Keyboard: PASS/FAIL
- [ findings ]

### Component Reuse: PASS/FAIL
- [ findings ]

### Visual Consistency: PASS/FAIL
- [ findings ]

### Performance: PASS/FAIL
- [ findings ]

### Educational Clarity: PASS/FAIL
- [ findings ]

### Overall: PASS/FAIL

**Recommendation:** [Approve / Request Changes / Reject]
```

---

## Enforcement

- All UI changes must pass this review before merge
- Failing any "must pass" item blocks the merge
- Review report is attached to the PR
- Human reviewer makes final decision
