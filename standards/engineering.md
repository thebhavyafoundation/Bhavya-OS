# Engineering Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define engineering standards for the Bhavya Foundation platform.

## Development Workflow

### 1. Feature Development

1. Create feature branch from `main`
2. Implement changes with tests
3. Run quality gates: `pnpm lint && pnpm test && pnpm validate && pnpm build`
4. Create pull request
5. Code review required
6. Merge after approval

### 2. Bug Fixes

1. Create bugfix branch from `main`
2. Write failing test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Create pull request

### 3. Hotfixes

1. Create hotfix branch from `main`
2. Minimal fix with test
3. Fast-track review
4. Deploy immediately after merge

## Code Quality

### Linting

- ESLint with TypeScript rules
- Prettier for formatting
- No warnings in production code

### Testing

- Unit tests for business logic
- Integration tests for API routes
- End-to-end tests for critical paths
- Minimum 80% coverage

### Type Safety

- Strict TypeScript mode
- No `any` types
- Proper error typing

## Performance

- Lazy loading for routes
- Image optimization
- Bundle size monitoring
- Core Web Vitals targets

## Security

- Environment variable management
- Input validation
- Rate limiting
- Dependency auditing
