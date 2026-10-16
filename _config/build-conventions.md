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

- `main` — production deployments (protected)
- `master` — CI runs, PR targets (protected)
- Feature branches: `feat/<slug>`, `fix/<slug>`, `refactor/<slug>`
- RFC branches: `rfc/<nnnn>-<slug>`

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

### Environments

| Environment | Branch | URL                            | Trigger         |
| ----------- | ------ | ------------------------------ | --------------- |
| Preview     | Any PR | `*.vercel.app`                 | Push to PR      |
| Production  | `main` | `bhavya-foundation.vercel.app` | Merge to `main` |

### Deploy Pipeline (`.github/workflows/deploy.yml`)

1. CI passes (antislop → lint → typecheck → test → secret-scan → build)
2. Deploy to Vercel (production)
3. Visual verification on deployed URL (not local build)

**Known issue:** `deploy.yml` targets `main`; push ≠ deploy (wiring mismatch documented; do not "fix" by deploying)

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
