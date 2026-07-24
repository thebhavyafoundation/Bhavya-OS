---
id: RUNTIME-003
owner: Engineering
version: 0.5
status: active
depends:
  - RUNTIME-001
  - RUNTIME-002
related:
  - RUNTIME-004
  - RUNTIME-012
  - MEM-PROJECT
---

# Bhavya Foundation — Project Summary

## Mission

Build a digital operating system for a public charitable institution — serving Nature, Knowledge, Heritage, and Community with radical transparency.

## Products

| App | ID | Port | Status | Mission |
|-----|----|------|--------|---------|
| Bhavya Foundation Website | `website` | 3000 | active | Foundation |
| Engineering Dashboard | `admin` | 3001 | active | Platform |
| Knowledge Platform | `docs` | 3002 | active | Knowledge |
| Transparency Portal | `transparency` | 3003 | active | Governance |
| Forest & Nature | `forest` | 3004 | shell | Nature |
| Heritage & Culture | `heritage` | 3005 | shell | Heritage |
| Volunteer Portal | `volunteer` | 3006 | shell | Community |
| Knowledge & Education | `knowledge` | 3007 | shell | Knowledge |
| Digital Library | `library` | 3008 | shell | Knowledge |

## Shared Packages

| Package | Path | Description |
|---------|------|-------------|
| `@bhavya/ui` | `packages/ui` | Component library |
| `@bhavya/mission-runtime` | `packages/mission-runtime` | Shared runtime (gateway, registry, memory, events, observability, accessibility, metadata) |
| `@bhavya/bdl` | `packages/bdl` | Bhavya Design Language (tokens, primitives, icons, charts, maps, motion, illustrations) |
| `@bhavya/bdx` | `packages/bdx` | Developer experience (CLI, codemods, generators, lint, migrations, validators, profilers) |
| `@bhavya/docs` | `packages/docs` | MDX content registry |
| `@bhavya/branding` | `packages/branding` | Brand copy, mission model, navigation |
| `@bhavya/charts` | `packages/charts` | Chart primitives |
| `@bhavya/icons` | `packages/icons` | Icon wrappers |
| `@bhavya/maps` | `packages/maps` | MapLibre-ready map placeholders |
| `@bhavya/auth` | `packages/auth` | Auth (shell) |
| `@bhavya/config` | `packages/config` | Shared app configuration |
| `@bhavya/database` | `packages/database` | Database (shell) |
| `@bhavya/typescript` | `packages/typescript` | Shared TS configs |
| `@bhavya/eslint` | `packages/eslint` | Shared ESLint configs |

## Tech Stack

- **Runtime**: Node.js >=20.9.0
- **Package Manager**: pnpm 10.17.1
- **Monorepo**: Turborepo 2.5.6
- **Language**: TypeScript 5.9 (strict)
- **Framework**: Next.js 15.5, React 19.2
- **Styling**: Tailwind CSS 4, CSS custom properties
- **Linting**: ESLint 9, Prettier
- **Commit**: Commitlint, Husky, lint-staged
- **Releases**: Changesets

## Architecture

Apps → Mission Runtime → Shared Packages → Utilities → Core Infrastructure

- `apps/` — product applications
- `packages/` — reusable packages
- `schemas/` — JSON validation schemas
- `specs/` — product & design specifications
- `standards/` — engineering & governance standards
- `registry/` — deterministic generated registries
- `rfcs/` — RFC documents
- `scripts/` — automation
- `config/` — shared config
- `content/` — MDX content
- `memory/` — domain-owned memory system
- `navigation/` — navigation manifests
- `governance/` — ADRs, decisions, governance model
- `history/` — institutional history
- `docs/` — design & contributor documentation

## Current Status

- **Release**: v0.5 (Certified)
- **Next Release**: v0.6 — Public APIs & Integrations
- **Release Cadence**: 8-phase progression to v1.0

## Standards (16)

accessibility, api, architecture, backend, database, design, documentation, engineering, frontend, git, observability, performance, release, security, testing
