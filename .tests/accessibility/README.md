# Tests: Accessibility

## Scope

WCAG 2.1 AA compliance testing.

## Tools

- Axe
- WAVE
- Lighthouse Accessibility
- Screen readers (VoiceOver, NVDA)

## Test Cases

### Automated Tests

- Color contrast ratios
- ARIA attributes
- Heading hierarchy
- Form labels
- Image alt text
- Keyboard navigation

### Manual Tests

- Screen reader navigation
- Keyboard-only navigation
- Focus management
- Error handling
- Content reflow

## Run Tests

```bash
pnpm test:accessibility
```

## Reports

- Test results in CI/CD
- Weekly accessibility reports
- Issue tracking in GitHub
