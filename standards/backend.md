# Backend Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define backend development standards for the Bhavya Foundation platform.

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm 10+
- **Framework**: Next.js 15 (App Router)

## Code Standards

### File Structure

```
packages/
  content-core/     # Shared platform logic
  ui/              # Shared UI components
  theme/           # Design tokens
apps/
  forest/          # Nature Mission
  heritage/        # Heritage Mission
  research/        # Research Mission
  volunteer/       # Volunteer Mission
  knowledge/       # Knowledge graph
  library/         # Public consumption
  website/         # Main website
```

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Error Handling

- Use try/catch for async operations
- Log errors with context
- Return meaningful error messages
- Never expose internal errors to clients

## Testing

- Unit tests with Vitest
- Integration tests for API routes
- Minimum 80% code coverage
