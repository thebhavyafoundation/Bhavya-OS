# Architecture Handbook

> Bhavya OS Architecture — System design and technical direction.

## Overview

Bhavya OS is a monorepo-based platform with the following architecture layers:

```
┌─────────────────────────────────────────┐
│  Presentation Layer (apps/)              │
│  - Next.js applications                 │
│  - User-facing interfaces               │
├─────────────────────────────────────────┤
│  Platform Layer (packages/)              │
│  - Shared libraries                     │
│  - UI components                        │
│  - Runtime engine                       │
├─────────────────────────────────────────┤
│  Infrastructure Layer                    │
│  - Build system (Turbo)                 │
│  - Package manager (pnpm)               │
│  - Deployment (Vercel)                  │
├─────────────────────────────────────────┤
│  Data Layer                              │
│  - Knowledge objects                    │
│  - Institution data                     │
│  - Constitution                         │
└─────────────────────────────────────────┘
```

## Principles

1. **Monorepo-first** — All code in one repository
2. **Workspace isolation** — Each package is independent
3. **Shared conventions** — Consistent patterns across packages
4. **Type safety** — TypeScript throughout
5. **Performance** — Static generation where possible

## Package Structure

### Applications (`apps/`)

- `website` — Public website (Next.js)
- `ai-institute` — AI education platform
- `knowledge-studio` — Knowledge management
- `github-os` — GitHub integration
- `dashboard` — Engineering dashboard

### Libraries (`packages/`)

- `platform-ui` — Design system components
- `runtime` — Runtime engine
- `constitution` — Governance documents
- `impact-runtime` — Impact measurement
- `learning-runtime` — Learning management

## Decision Process

1. Architecture decisions are recorded as ADRs
2. Chief Architect has final authority
3. All changes must be reviewed
4. Documentation is required
