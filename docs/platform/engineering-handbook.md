# Engineering Handbook

> Bhavya OS Engineering — Development practices and workflows.

## Development Workflow

```
Plan → Implement → Test → Review → Document → Deploy
```

## Code Standards

- **TypeScript** — Strict mode enabled
- **ESLint** — Standard configuration
- **Prettier** — Consistent formatting
- **Conventional Commits** — Commit message format

## Branch Strategy

- `master` — Production branch
- `feature/*` — Feature branches
- `fix/*` — Bug fix branches
- `release/*` — Release branches

## Testing

- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical paths
- Accessibility tests for UI

## Code Review

1. All changes require review
2. Approve before merge
3. Address all comments
4. Squash merge to master

## Performance

- Target: Lighthouse 90+
- Bundle size monitoring
- Core Web Vitals tracking
- Static generation preferred

## Security

- No secrets in code
- Dependency auditing
- Input validation
- XSS prevention
