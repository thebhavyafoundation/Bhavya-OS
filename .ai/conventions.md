---
id: RUNTIME-011
owner: Engineering
version: 0.5
status: active
depends: []
related:
  - STD-003
  - STD-008
---

# Conventions

## Repository

- Turborepo monorepo with pnpm workspaces
- All packages scoped `@bhavya/*`
- Packages in `packages/`, apps in `apps/`
- TypeScript strict mode across all packages
- ESLint flat config (`.mjs`) shared via `@bhavya/eslint`

## Naming

- **Apps**: lowercase single word (`website`, `admin`, `docs`)
- **Packages**: kebab-case (`mission-runtime`, `typescript`)
- **Components**: PascalCase (`Header.tsx`, `FeatureCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `getPlatformStatus.ts`)
- **Types**: PascalCase interfaces, camelCase type aliases
- **CSS classes**: kebab-case (`.feature-card`, `.nav-logo`)
- **CSS variables**: kebab-case with `--` prefix (`--border-focus`)

## File Structure per App

```
apps/<name>/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # App-specific components
│   ├── services/     # Server-side services
│   └── app-manifest.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## File Structure per Package

```
packages/<name>/
├── src/
│   └── index.ts      # Public API
├── package.json
├── tsconfig.json
└── (optional) eslint.config.mjs
```

## Versioning

- All packages versioned with Changesets
- Apps track independently — no root version
- Root `package.json` version is the platform version (currently `0.1.0`)

## Registries

- All registry files in `registry/` are GENERATED
- Edit the source in `config/` or package `package.json`
- Run `pnpm registry:generate` to regenerate
- Registry files are committed for transparency

## Content

- MDX content in `content/` for the website
- Structured content (policies, reports, research) in subdirectories
- Navigation manifests in `navigation/` (JSON)

## Memory

- Domain-owned memory in `memory/<domain>/`
- Each domain has `_meta.json` describing its memory records
- Agents write to their domain's memory directory
- Decisions go in `memory/decisions/`
- Tasks go in `memory/tasks/`
