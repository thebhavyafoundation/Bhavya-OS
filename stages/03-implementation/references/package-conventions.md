# Package Conventions — Bhavya Foundation

**For Stage 03: Implementation — Package structure, exports, contracts.**

---

## Package Structure

### Standard Layout

```
packages/<pkg>/
├── src/
│   ├── index.ts              # Public exports barrel
│   ├── <domain>/             # Domain modules
│   │   ├── index.ts          # Domain exports
│   │   ├── types.ts          # Type definitions
│   │   ├── utils.ts          # Utilities
│   │   └── *.test.ts         # Co-located tests
│   └── lib/                  # Internal implementation
├── CONTRACT.md               # Public interface contract
├── package.json
├── tsconfig.json
├── pnpm-workspace.yaml       # If workspace root
└── README.md                 # Package documentation
```

### Export Rules

```typescript
// src/index.ts — Public API only
export { type User, type UserId } from "./user/types";
export { createUser, getUser } from "./user/utils";
export { UserService } from "./user/service";

// ❌ Don't export internals
// export { privateHelper } from './lib/internal';
```

---

## CONTRACT.md Template

Every package must have a `CONTRACT.md` at its root:

```markdown
# @bhavya/<pkg> Contract

## Purpose

[One sentence: what this package provides.]

## Exports

| Export       | Type      | Description  |
| ------------ | --------- | ------------ |
| `User`       | interface | User entity  |
| `createUser` | function  | Creates user |

## Dependencies

| Package          | Version | Purpose      |
| ---------------- | ------- | ------------ |
| `@bhavya/shared` | ^1.0.0  | Shared types |

## Versioning

- Follows semver
- Breaking changes = MAJOR bump
- Documented in CHANGELOG.md

## Migration

[Instructions for breaking changes.]
```

---

## Domain Ownership

Per `docs/architecture/DOMAIN_OWNERSHIP.md`:

| Domain       | Package                | Types                                     |
| ------------ | ---------------------- | ----------------------------------------- |
| Knowledge    | `@bhavya/knowledge`    | `KnowledgeObject`, `KnowledgePackage`     |
| Curriculum   | `@bhavya/curriculum`   | `Lesson`, `Assessment`, `LearningOutcome` |
| Academy      | `@bhavya/academy`      | `Course`, `Enrollment`, `Progress`        |
| Intelligence | `@bhavya/intelligence` | `IntelRun`, `Recommendation`              |
| GitHub       | `@bhavya/github`       | `Repository`, `Analysis`, `Pattern`       |
| Compliance   | `@bhavya/ioc`          | `OKR`, `Risk`, `Action`                   |
| Social       | `@bhavya/social`       | `Campaign`, `Publication`                 |
| Governance   | `@bhavya/governance`   | `Policy`, `Standard`, `ADR`               |
| Video        | `@bhavya/video-engine` | `VisualSpec`, `Composition`               |

**Rule:** One domain → one package. No duplicate types.

---

## Shared Package: `@bhavya/shared`

**Canonical location for cross-package types.**

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── base.ts           # BaseEntity, Timestamped, etc.
│   │   ├── user.ts           # User, UserId, UserRole
│   │   ├── api.ts            # ApiResponse, Pagination, etc.
│   │   └── index.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── string.ts
│   │   └── validation.ts
│   └── index.ts
├── CONTRACT.md
└── package.json
```

**Usage:**

```typescript
import { type User, type ApiResponse } from "@bhavya/shared";
```

---

## Adding a New Package

### Prerequisites

- [ ] Domain not already owned (check DOMAIN_OWNERSHIP.md)
- [ ] RFC approved for new domain
- [ ] Package follows structure above
- [ ] CONTRACT.md written
- [ ] Added to `pnpm-workspace.yaml`
- [ ] Added to `package.json` dependencies where needed

### Steps

1. Create package directory with structure
2. Write CONTRACT.md
3. Implement types in `src/types/`
4. Export via `src/index.ts`
5. Add tests
6. Run `pnpm typecheck` `pnpm lint` `pnpm test`
7. Update DOMAIN_OWNERSHIP.md
8. Create PR

---

## Package Dependencies

### Allowed

- `@bhavya/shared` → any package
- `@bhavya/platform-ui` → apps, packages (UI)
- `@bhavya/runtime` → apps, packages (runtime)
- Domain packages → apps only (not other domain packages)

### Forbidden

- App → App imports
- Domain package → Domain package imports
- Circular dependencies

### Dependency Graph

```
apps/* (canonical app)
  ├─ @bhavya/platform-ui
  ├─ @bhavya/shared
  ├─ @bhavya/runtime
  ├─ @bhavya/knowledge
  ├─ @bhavya/curriculum
  ├─ @bhavya/academy
  ├─ @bhavya/intelligence
  ├─ @bhavya/github
  ├─ @bhavya/ioc
  ├─ @bhavya/social
  ├─ @bhavya/governance
  └─ @bhavya/video-engine
```

---

## Testing

### Package Tests

```bash
# From package root
pnpm test              # All tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

### Cross-Package Tests

- Integration tests in canonical app (`apps/ai-institute/`)
- Contract tests for package interfaces

---

## Publishing

### Internal (Workspace)

- Version managed by workspace
- `pnpm publish` from package root (if public)

### Version Bumps

- Patch: bug fixes, non-breaking improvements
- Minor: new features, backward compatible
- Major: breaking changes (requires RFC)

---

## References

- `docs/architecture/DOMAIN_OWNERSHIP.md` — Domain ownership
- `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` — Canonical sources
- `contracts/<pkg>/CONTRACT.md` — Package contracts
- `skills/bhavya-architecture/SKILL.md` — Architecture rules
- `packages/shared/` — Shared types reference
