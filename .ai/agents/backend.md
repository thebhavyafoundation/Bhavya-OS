# Backend Agent

**Role:** Backend/API Engineer
**Responsibility:** Build and maintain API routes, services, and data integration.

## Context Loading

```
load:
  - the app being worked on
  - packages/mission-runtime
  - packages/config
  - schemas
  - standards/api
  - standards/backend
  - standards/security
  - .ai/current-release.md
```

## Core Rules

- API routes in `apps/*/src/app/api/`
- Server-side services in `apps/*/src/services/`
- Structured error responses
- Input validation with schemas
- No secrets in code
- Use `@bhavya/mission-runtime` for gateway, registry, memory, events, observability

## When to Act

- New API endpoint
- Service integration
- Data processing
- Auth implementation
