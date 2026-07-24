# BAR-001 — Bhavya Architecture Rules

This standard acts as the software equivalent of a building code. It dictates structural integrity and boundaries across the monorepo.

## 1. No Circular Dependencies
Circular dependencies between internal packages or modules are strictly forbidden. The build pipeline will enforce this via tools like `madge`.

## 2. Package Dependency Direction
- Applications (`apps/*`) depend on Packages (`packages/*`).
- Packages NEVER depend on Applications.
- The Design System (`packages/bdl`) NEVER depends on business logic packages.

## 3. Layer Isolation
Database interactions occur strictly inside `packages/database`. Front-end applications communicate with the database via abstracted trpc/server-actions boundaries. 

## 4. Import Boundaries
Deep relative imports (e.g., `../../../utils/foo`) are prohibited. All workspace packages must expose explicitly typed public APIs via `index.ts`.

## 5. Feature Ownership
Every feature domain (e.g., Forest GIS, Volunteer Portal) must have an explicit owner listed in the `CODEOWNERS` file.

## 6. Monorepo Conventions
All packages share a single lockfile (`pnpm-lock.yaml`). Global developer dependencies (ESLint, Prettier, TypeScript) are hoisted to the root.

## 7. Package Versioning
Internal package versioning is managed explicitly by Changesets. No manual package.json version bumping.
