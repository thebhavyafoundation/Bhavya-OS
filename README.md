# Bhavya OS

Bhavya OS is the digital operating system for Bhavya Foundation.

It is organized as a production-grade Turborepo monorepo for public websites, mission applications, documentation, dashboards, design systems, and future operational tools.

## Architecture

- `apps/website` - public foundation website, mission pages, docs, and presentation surfaces
- `apps/admin` - founder and operations dashboard shell
- `apps/volunteer` - volunteer portal shell
- `apps/forest` - forest mission shell
- `apps/knowledge` - knowledge mission shell
- `apps/library` - digital library shell
- `apps/heritage` - heritage mission shell
- `packages/ui` - shadcn-style reusable interface components and layouts
- `packages/theme` - brand tokens, CSS variables, Tailwind-facing tokens, and token docs
- `packages/icons` - Bhavya icon wrappers built on Lucide
- `packages/branding` - brand copy, mission model, navigation model
- `packages/charts` - analytics placeholders and chart primitives
- `packages/maps` - MapLibre-ready map placeholders
- `packages/docs` - MDX content registry, versions, and searchable document manifest
- `packages/config` - shared app configuration
- `packages/typescript` - shared TypeScript configs
- `packages/eslint` - shared ESLint configs

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
```

## Principles

Bhavya OS is modular, type-safe, accessible, responsive, performance-first, mobile-first, SEO-friendly, and aligned with the Foundation's founding documents.
