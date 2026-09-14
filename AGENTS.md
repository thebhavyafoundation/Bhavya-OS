# Bhavya Foundation (Bhavya OS)

One digital institution: one canonical web app, shared packages, governance.
Four pillars — Forest, Knowledge (AI Institute lives here), Heritage,
Community. AI Institute never replaces the Foundation identity.

## Where things live

| Need                           | Go to                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| Canonical app                  | `apps/ai-institute/` → `apps/ai-institute/CONTEXT.md`                                    |
| Domains / packages             | `packages/` → `packages/CONTEXT.md` (ownership: `docs/architecture/DOMAIN_OWNERSHIP.md`) |
| Knowledge / docs               | `docs/` → `docs/CONTEXT.md`                                                              |
| Agent context / status         | `.ai/` → `.ai/CONTEXT.md` (live: `.ai/current-task.md`)                                  |
| Decisions                      | `rfcs/` → `rfcs/CONTEXT.md`                                                              |
| Architecture source of truth   | `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`                                        |
| Browser verification           | `.opencode/skills/bhavya-qa/SKILL.md` (Playwright, app running)                          |
| Factory (tokens, brand, rules) | `_shared/factory-map.md` (links only — never copy)                                       |

## Test / verify

All commands verified in root `package.json`:

- **Build:** `pnpm build` (turbo, depends on `^build`)
- **Lint:** `pnpm lint` (turbo, depends on `^build`)
- **Typecheck:** `pnpm typecheck` (turbo, depends on `^build`)
- **Test:** `pnpm test` (turbo) or `pnpm --filter @bhavya/<name> test`
- **Format:** `pnpm format` (prettier, all `*.{ts,tsx,md,mdx,json,css}`)
- **Validate:** `pnpm validate` (content-core)
- **Scaffold:** `pnpm scaffold` (content-core)
- **File map:** `pnpm file-map` (generate) / `pnpm file-map:check` (CI check)
- **Token sync:** `pnpm tokens:sync` (sync) / `pnpm tokens:check` (CI check)
- **AntiSlop:** `pnpm antislop` (deterministic anti-AI-slop quality gate)
- **AntiSlop (staged):** `pnpm antislop:staged` (pre-commit mode, staged files only)
- **Git check:** `git diff --check`

### CI workflow (`.github/workflows/ci.yml`)

Runs on push/PR to `main`. Three parallel jobs, then build:

1. **lint-and-typecheck** — `pnpm antislop` + `pnpm lint` + `pnpm typecheck`
2. **test** — `pnpm test`
3. **secret-scan** — gitleaks + pattern scan
4. **build** (after lint-and-typecheck + test pass) — `pnpm build`

### Vercel

Documented for architectural awareness only. Agents MUST NOT create, modify,
deploy, promote, rollback, or otherwise operate Vercel resources unless the
user explicitly authorizes Vercel operations in that task.

- `vercel.json` builds `apps/ai-institute` via `scripts/vercel-build-app.mjs`
- Valid apps: `ai-institute`, `admin`, `docs`, `design-system`, `github-os`, `ioc`, `social-os`, `bhavya-intelligence-network`, `website`
- Deploy workflow: `.github/workflows/deploy.yml` (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)

**Normal workflow is Git-only:** inspect → modify → validate → commit → push → verify remote.
Knowing that `vercel-build-app.mjs` exists does NOT constitute authorization to execute it.
Do not present Vercel deployment as a normal verification step.

### Canonical repo

`github.com/thebhavyafoundation/Bhavya-OS` (`master`) → ONE Vercel project (`bhavya-foundation`) → `bhavyafoundation.org`

## Never do

- No new design primitives — use `@bhavya/platform-ui` tokens/components; forest/ivory/earth/gold, Playfair Display + Inter (never purple/blue AI styling)
- No app-to-app dependencies; one concept → one route (`docs/architecture/CANONICAL_ROUTE_MAP.md`)
- Never hand-edit generated indexes (`registry/`, `bar/`, `FILE-MAP.md`) or create a new Vercel project
- Nothing moves forward until a person has read the last output

---

# Bhavya Engineering Constitution

## PRINCIPLE 1 — INSPECT FIRST

Never implement against assumptions.

Before making structural changes, inspect:

- Repository structure and existing code
- Architecture decisions and conventions
- Data models and type definitions
- Routes and navigation
- Tests and verification
- Deployment configuration

Use `bhavya-architecture` skill for structural changes.

## PRINCIPLE 2 — EXISTING SYSTEM FIRST

Search for existing functionality before creating new functionality.

Prefer:

- Reuse of existing packages, components, and patterns
- Extension of existing types and interfaces
- Refactoring of existing code over duplication

Before creating anything, search:

- `packages/platform-ui/` for UI components
- `packages/shared/` for type definitions
- `packages/` for existing package capabilities
- `.opencode/skills/` for existing skills

## PRINCIPLE 3 — ONE ECOSYSTEM

Bhavya Foundation and Bhavya OS are parts of one ecosystem.

Do not create:

- Separate repositories
- Duplicate entities or types
- Duplicate authentication systems
- Duplicate design systems
- Duplicate data models

One canonical app. One design system. One auth system. One database.

## PRINCIPLE 4 — SOURCE OF TRUTH

GitHub is the canonical source of code.

Production deployment is derived from the repository.
Do not treat a local machine as the authoritative production state.

- `master` branch deploys to production
- PRs target `main` or `master`
- CI validates all changes
- Vercel deploys from GitHub

## PRINCIPLE 5 — TRUTH OVER APPEARANCE

Never fabricate institutional impact.

Do not invent:

- Tree counts or hectares planted
- Beneficiary numbers
- Student or volunteer counts
- Funding amounts
- Partner organizations
- Government relationships
- Certifications or awards
- Research results
- Project completion dates

If data does not exist, say that it does not exist.

Use `bhavya-content-truth` skill for content verification.

## PRINCIPLE 6 — EVIDENCE

Institutional claims should support:

- Value — what was achieved
- Source — where the data comes from
- Date — when the data was recorded
- Verification state — how confident we are

Verification states:

- `verified` — Confirmed by authoritative source
- `reported` — Stated by institution, not independently verified
- `estimated` — Approximate or calculated value
- `pending verification` — Submitted but not yet confirmed
- `demo` — Sample data, not real

## PRINCIPLE 7 — AI IS NOT THE SOURCE OF TRUTH

AI can:

- Research and gather information
- Draft and summarize content
- Analyze and classify data
- Recommend actions
- Transform and format data

AI must not silently invent institutional facts.

Consequential actions (publishing, submitting, financial decisions) require appropriate human approval.

## PRINCIPLE 8 — TEST BEFORE CLAIMING COMPLETE

Never report "complete" merely because implementation exists.

Completion requires evidence:

- Typecheck passing
- Lint passing
- Tests passing
- Build succeeding
- Route audit clean
- Security check passed
- Git status clean
- CI passing

Use `bhavya-production-verification` skill for completion gates.

---

# Bhavya Skills

Project-local skills live in `.opencode/skills/`. Use the `skill` tool to load them.

| Skill                            | Purpose                                             |
| -------------------------------- | --------------------------------------------------- |
| `bhavya-architecture`            | Inspect and evolve architecture without duplication |
| `bhavya-design-system`           | Enforce dual-mode design system (Foundation + OS)   |
| `bhavya-content-truth`           | Prevent fabrication of institutional data           |
| `bhavya-data-model`              | Manage canonical entity definitions                 |
| `bhavya-route-audit`             | Audit routes, navigation, and links                 |
| `bhavya-ui-verification`         | Verify UI against design system and a11y            |
| `bhavya-security`                | Verify security practices                           |
| `bhavya-github-workflow`         | Follow Git workflow conventions                     |
| `bhavya-production-verification` | Verify production readiness                         |
| `bhavya-ai-development`          | Guide AI agent development                          |
| `bhavya-qa`                      | Browser-driven QA testing                           |
| `bhavya-autoplan`                | Auto-review pipeline                                |
| `bhavya-canary`                  | Post-deploy monitoring                              |
| `bhavya-freeze`                  | Scope lock for debugging                            |
| `bhavya-investigate`             | Systematic debugging                                |
| `bhavya-learn`                   | Persistent engineering knowledge                    |
| `bhavya-plan-review`             | Structured plan review                              |
| `bhavya-retro`                   | Weekly engineering retrospective                    |
| `bhavya-review`                  | Pre-landing code review                             |
| `bhavya-security-audit`          | CSO mode for security audit                         |
| `bhavya-ship`                    | Ship workflow                                       |
| `bhavya-spec`                    | Structured specification development                |
| `bhavya-reasons-canvas`          | REASONS Canvas design contracts (SPDD integration)  |
| `antislop`                       | Anti-AI-slop quality rules and gate                 |
| `antislop-code`                  | Code comment hygiene (remove AI-slop comments)      |
| `antislop-copywriting`           | Detect AI writing patterns in prose                 |

## Skill Precedence

1. Project skills (`.opencode/skills/`) — highest priority
2. Personal skills (`~/.config/opencode/skills/`)
3. Superpowers skills (via plugin) — lowest priority

## Execution Workflow

For substantive engineering tasks:

1. **Brainstorm** — Explore intent and requirements
2. **Specification** — Define what to build
3. **Plan** — Design the approach
4. **TDD** — Write tests first
5. **Implementation** — Build the solution
6. **Review** — Verify against requirements
7. **Verification** — Run all checks
8. **Git** — Commit with evidence
