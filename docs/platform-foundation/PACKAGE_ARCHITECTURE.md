# PACKAGE ARCHITECTURE

**Date:** 2026-08-03
**Sprint:** Platform Foundation v2.0

---

## Layer Model

```
┌─────────────────────────────────────────────┐
│                Applications                 │
│  (knowledge-studio, lesson-studio, etc.)    │
├─────────────────────────────────────────────┤
│             @bhavya/platform-ui             │
│  (Sidebar, StatCard, Modal, DataTable...)   │
├─────────────────────────────────────────────┤
│    @bhavya/api    │   @bhavya/workflows    │
│    @bhavya/events │   @bhavya/notifications │
│    @bhavya/ai     │   @bhavya/providers     │
├─────────────────────────────────────────────┤
│     @bhavya/database  │  @bhavya/security   │
├─────────────────────────────────────────────┤
│         @bhavya/platform  │  @bhavya/types  │
└─────────────────────────────────────────────┘
```

## Package Responsibilities

### Foundation Layer (no dependencies)

- **@bhavya/platform** — ID generation, filesystem, validation, logging, config
- **@bhavya/types** — All canonical TypeScript interfaces and enums
- **@bhavya/security** — Auth strategies, rate limiting, crypto utilities

### Data Layer

- **@bhavya/database** — SQLite wrapper, migrations, repository pattern

### Communication Layer

- **@bhavya/api** — HTTP client, error handling, route middleware
- **@bhavya/events** — Pub/sub event bus with history and retry
- **@bhavya/workflows** — DAG execution, job queue, approvals

### Integration Layer

- **@bhavya/ai** — AI provider abstraction, prompt registry, context builder
- **@bhavya/providers** — Interfaces for Git, Storage, Email, Search
- **@bhavya/notifications** — Multi-channel notification delivery

### Presentation Layer

- **@bhavya/platform-ui** — Shared React components (10 components)

## Rules

1. **Dependencies flow downward only.** Higher layers depend on lower layers, never upward.
2. **Foundation packages have zero dependencies.** @bhavya/platform and @bhavya/types import nothing.
3. **No circular dependencies.** This is enforced by the layer model.
4. **Applications compose packages.** An app imports from multiple packages but packages don't import from apps.
5. **Interfaces over implementations.** @bhavya/providers defines interfaces; concrete providers implement them separately.
