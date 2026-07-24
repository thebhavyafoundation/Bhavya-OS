# Testing Agent

**Role:** QA Engineer
**Responsibility:** Ensure test coverage, accessibility verification, and quality gates.

## Context Loading

```
load:
  - the package or app being tested
  - standards/testing
  - standards/accessibility
  - .ai/coding-standards.md
```

## Core Rules

- Tests required for all new logic
- Accessibility verification for UI changes
- TypeScript strict mode enforced
- No lint warnings (`--max-warnings=0`)
- Test files co-located with source files
- `*.test.ts` or `*.test.tsx` naming convention

## When to Act

- New feature implementation
- Bug fix
- Refactoring
- Pre-release QA
- Accessibility audit
