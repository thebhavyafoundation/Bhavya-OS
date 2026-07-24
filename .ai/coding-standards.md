---
id: RUNTIME-007
owner: Engineering
version: 0.5
status: active
depends: []
related:
  - STD-008
  - STD-009
  - STD-010
---

# Bhavya Coding Standards

## TypeScript

- Strict mode enabled in `tsconfig.base.json`
- Prefer `type` over `interface` for props and simple types
- Use `interface` for public API contracts
- No `any` — use `unknown` and narrow with type guards
- Explicit return types on public functions
- Use `as const` for literal types
- Prefer `import type` for type-only imports

## React / Next.js

- Prefer Server Components by default
- Client components only when interactivity required
- Use `'use client'` directive explicitly
- Use semantic HTML elements
- Accessible forms with labels and ARIA attributes
- Use `next/link` for navigation, `next/image` for images

## Component Design

- One component per file
- Named exports preferred
- Props typed with `interface ComponentNameProps`
- Destructure props in function signature
- Forward refs where appropriate
- Reusable components in `packages/ui`, app-specific in `apps/*/src/components`

## CSS / Styling

- Use CSS custom properties (design tokens) from `packages/bdl/tokens/`
- Use Tailwind utility classes for rapid layout
- Custom CSS (via `globals.css` or CSS modules) for complex components
- No inline styles except for dynamic values
- Responsive design with mobile-first breakpoints

## File Naming

- React components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`
- Pages: `page.tsx`, layouts: `layout.tsx`
- Tests: `ComponentName.test.tsx` or `util.test.ts`

## Imports

- Group: 1) Node built-ins 2) External packages 3) Internal packages 4) Relative imports
- Use path aliases (`@/`) within apps
- Workspace packages referenced as `@bhavya/*`

## Error Handling

- Use early returns and guard clauses
- Server components: throw for 404/500
- API routes: return structured error responses
- Client: use error boundaries for React errors
- Log with `@bhavya/mission-runtime` observability

## Git

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- Linear history, no merge commits
- Small focused commits
- `pnpm changeset` for versioning
