# Build Conventions — Bhavya Foundation

**Canonical build commands, verification gates, and deployment procedures.**
Referenced by stages 03-implementation, 04-verification, 05-deployment.

---

## Package Manager

- **pnpm** (workspace)
- Lockfile: `pnpm-lock.yaml`
- Workspace config: `pnpm-workspace.yaml`

---

## Verification Gates (Run in Order)

| Gate      | Command               | Purpose                      | CI Stage              |
| --------- | --------------------- | ---------------------------- | --------------------- |
| Typecheck | `pnpm typecheck`      | TypeScript compilation check | `ci.yml`              |
| Lint      | `pnpm lint`           | ESLint + style checks        | `ci.yml`              |
| Test      | `pnpm test`           | Unit/integration tests       | `ci.yml`              |
| Build     | `pnpm build`          | Production build             | `ci.yml` (after test) |
| AntiSlop  | `pnpm antislop`       | Code quality gate            | `ci.yml`              |
| Tokens    | `pnpm tokens:check`   | Design token compliance      | `ci.yml`              |
| File Map  | `pnpm file-map:check` | File map currency            | `ci.yml`              |
| Registry  | `pnpm registry:check` | Registry currency            | `ci.yml`              |
| Drift     | `pnpm drift:check`    | Schema/contract drift        | `ci.yml`              |
| Validate  | `pnpm validate`       | All checks                   | Local                 |
| Format    | `pnpm format`         | Prettier formatting          | Pre-commit            |

**Local only:** Typecheck, lint, test, antislop, tokens:check, file-map, drift:check, git
**NEVER local:** `pnpm build`, `turbo build`, `next build`, `opennextjs-cloudflare build`, full monorepo `pnpm test` — these run on GitHub Actions

---

## Build Commands

### Canonical App (`apps/ai-institute/`)

```bash
# Development
pnpm dev                    # Next.js dev server
pnpm dev:studio            # Studio dev server

# Build
pnpm build                 # Production build (Next.js)
pnpm build:analyze         # Bundle analysis

# Verification
pnpm typecheck             # tsc --noEmit
pnpm lint                  # ESLint
pnpm test                  # Vitest/Jest
pnpm test:watch            # Watch mode
```

### Platform UI (`packages/platform-ui/`)

```bash
pnpm build                 # Build component library
pnpm typecheck             # TypeScript check
pnpm test                  # Component tests
pnpm storybook             # Storybook dev server
pnpm build-storybook       # Static Storybook build
```

### All Packages (from root)

```bash
pnpm build                 # Build all packages
pnpm --filter <pkg> build  # Build specific package
```

---

## Git Workflow (per `bhavya-github-workflow` skill)

### Branching

- `master` — the only integration branch. CI runs, PR target, and production
  deploy trigger. Protected.
- Feature branches: `feat/<slug>`, `fix/<slug>`, `refactor/<slug>`
- RFC branches: `rfc/<nnnn>-<slug>`

There is no `main` branch in this repository. Earlier documentation described a
`main` → Vercel production model; that pipeline never ran because the branch did
not exist. Cloudflare/OpenNext on `master` is the real production path.

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `build`, `ci`

### PR Requirements

- All verification gates pass (CI)
- No `pnpm antislop` failures
- No `pnpm tokens:check` failures
- Conventional commits
- Linked RFC for architectural changes

---

## Deployment

Canonical host: **Cloudflare via OpenNext**, per `docs/architecture/PLATFORM-TRUTH.md`.
Vercel is preview-only and must never become a production dependency.

### Environments

| Environment | Branch   | URL                                         | Trigger                       |
| ----------- | -------- | ------------------------------------------- | ----------------------------- |
| Preview     | Any PR   | `*.vercel.app` (Vercel app integration)     | Push to PR                    |
| Production  | `master` | `bhavya-foundation.<subdomain>.workers.dev` | Merge to `master` or dispatch |

### Production Deploy Pipeline (`.github/workflows/deploy-cloudflare.yml`)

1. CI passes (antislop → lint → typecheck → test → secret-scan → build)
2. `npx opennextjs-cloudflare build` in `apps/ai-institute`
3. `npx opennextjs-cloudflare deploy` to the `bhavya-foundation` Worker
4. Visual verification on the deployed URL (not a local build)

Triggers:

- `push` to `master`, filtered to app/package/content/dependency changes
- `workflow_dispatch` — deliberate, auditable manual production deploy

The workflow sets `cancel-in-progress: false` so an in-flight production deploy
is never interrupted; a newer commit queues behind it.

Runtime secrets (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) are set on the Worker
itself and are not needed at build time.

### Static assets (`.github/workflows/pages.yml`)

Publishes only `apps/ai-institute/public` to GitHub Pages. This is **not** the
application. Only `master` may publish; feature branches must not.

---

## Code Generation (Never Hand-Edit)

| Command                  | Output                       | Regenerate When        |
| ------------------------ | ---------------------------- | ---------------------- |
| `pnpm file-map`          | `FILE-MAP.md`                | File structure changes |
| `pnpm registry:generate` | `registry/index.json`        | Package/route changes  |
| `pnpm tokens:sync`       | `tokens.css` (if applicable) | Design token changes   |

---

## TypeScript Configuration

- **Strict mode**: Enabled in all packages
- **Module resolution**: Bundler (Next.js) / NodeNext (packages)
- **Target**: ES2022
- **Lib**: ES2022, DOM, DOM.Iterable
- **JSX**: React-jsx (Next.js) / preserve (packages)

---

## Testing

- **Framework**: Vitest (preferred) / Jest (legacy)
- **Coverage**: `pnpm test --coverage`
- **E2E**: Playwright (`.playwright-mcp/`)
- **Visual**: Playwright MCP + deployed URL

---

## Linting

- **ESLint**: `packages/eslint-config-bhavya/` (shared config)
- **Prettier**: `packages/prettier-config-bhavya/` (shared config)
- **Rules**: TypeScript, React, accessibility, import order

---

## References

- `docs/constitution/04-ENGINEERING-CONSTITUTION.md` — Engineering principles
- `.github/workflows/ci.yml` — CI pipeline definition
- `.github/workflows/deploy.yml` — Deploy pipeline definition
- `bhavya-github-workflow` skill — GitHub workflow conventions
- `bhavya-production-verification` skill — Production readiness
