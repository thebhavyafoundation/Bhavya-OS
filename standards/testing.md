# Testing Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define testing standards for the Bhavya Foundation platform.

## Testing Pyramid

### 1. Unit Tests (70%)

**Purpose**: Test individual functions and components
**Tools**: Vitest, React Testing Library
**Coverage Target**: 80% minimum

**Best Practices**
- Test one thing per test
- Use descriptive test names
- Mock external dependencies
- Test edge cases and errors

### 2. Integration Tests (20%)

**Purpose**: Test component interactions
**Tools**: Vitest, Supertest
**Coverage Target**: Critical paths

**Best Practices**
- Test API endpoints
- Test database operations
- Test external service integrations
- Use realistic test data

### 3. End-to-End Tests (10%)

**Purpose**: Test complete user workflows
**Tools**: Playwright (planned)
**Coverage Target**: Critical user journeys

**Best Practices**
- Test in production-like environment
- Test cross-browser compatibility
- Test performance under load

## Test Structure

### File Organization

```
src/
  component/
    Component.tsx
    Component.test.tsx
  utils/
    helper.ts
    helper.test.ts
```

### Test File Naming

- `*.test.ts` for unit tests
- `*.test.tsx` for React component tests
- `*.spec.ts` for integration tests

## Test Writing Guidelines

### AAA Pattern

```typescript
describe('calculateImpact', () => {
  it('should calculate impact score correctly', () => {
    // Arrange
    const metrics = { trees: 100, survival: 0.8 };
    
    // Act
    const score = calculateImpact(metrics);
    
    // Assert
    expect(score).toBe(80);
  });
});
```

### Mocking

```typescript
// Mock external dependencies
vi.mock('./api', () => ({
  fetchData: vi.fn(),
}));

// Use in tests
const mockFetch = vi.mocked(fetchData);
mockFetch.mockResolvedValue({ data: 'test' });
```

## Quality Gates

All code must pass before merge:

1. **Linting**: `pnpm lint`
2. **Type Checking**: `pnpm typecheck`
3. **Unit Tests**: `pnpm test`
4. **Data Validation**: `pnpm validate`
5. **Build**: `pnpm build`

## Continuous Integration

- Run tests on every PR
- Run full suite on merge to main
- Nightly test runs for regression
