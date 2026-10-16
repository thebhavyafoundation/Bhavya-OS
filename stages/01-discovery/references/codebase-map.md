# Codebase Map — Bhavya OS

**For Stage 01: Discovery — Key directories and their purposes.**

---

## Root Structure

```
D:\Bhavya OS\
├── AGENTS.md              # opencode config (Layer 0 for opencode)
├── CLAUDE.md              # ICM workspace identity (Layer 0 for all agents)
├── CONTEXT.md             # Task routing (Layer 1)
├── CLAUDE.md              # ICM workspace identity
├── _config/               # Layer 3: Factory config
├── shared/                # Layer 3: Cross-stage resources
├── skills/                # Layer 3: Bundled skills (junction to .opencode/skills/)
├── setup/                 # Layer 3: Onboarding questionnaire
├── stages/                # Layer 2: ICM workflow stages
├── apps/                  # Next.js applications
├── packages/              # Shared packages (platform-ui, shared, runtime, etc.)
├── docs/                  # Architecture, constitution, standards
├── rfcs/                  # Architecture decision records
├── specs/                 # REASONS Canvas design contracts
├── contracts/             # Package contracts
├── standards/             # Engineering standards
├── .ai/                   # Agent memory, state, workflows
├── .opencode/             # opencode config, skills
├── .github/               # CI/CD workflows
└── ... (other dirs)
```

---

## Canonical App: `apps/ai-institute/`

**Primary production app** — hosts all public, academy, and OS routes.

```
apps/ai-institute/
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (public)/           # Public pages
│   │   ├── academy/            # Academy routes
│   │   ├── os/                 # OS routes (admin, github, intelligence, etc.)
│   │   ├── studio/             # Studio routes
│   │   └── api/                # API routes
│   ├── components/             # App-specific components
│   ├── lib/                    # Core libraries
│   │   ├── studio/             # Studio runtime (SQLite-backed)
│   │   ├── academy-*.ts        # Academy data layer
│   │   └── ...                 # Other libs
│   └── data/                   # Static knowledge objects
├── package.json
└── tsconfig.json
```

**Key routes:**

- `/` — Foundation homepage
- `/academy/*` — Courses, lessons, enrollment
- `/os/admin` — Founder operations
- `/os/github` — Repository intelligence
- `/os/intelligence` — Intelligence engine
- `/os/ioc` — Compliance/OKR
- `/os/social` — Communication ops
- `/os/docs` — Governance dashboard
- `/studio/*` — Knowledge/lesson studios

---

## Platform Packages: `packages/`

| Package         | Purpose                                | Canonical? |
| --------------- | -------------------------------------- | ---------- |
| `platform-ui/`  | Design system (tokens, 22+ components) | YES        |
| `shared/`       | Shared types, utilities                | YES        |
| `runtime/`      | Runtime engine                         | YES        |
| `constitution/` | Governance documents                   | YES        |
| `video-engine/` | Video generation (composition)         | YES        |
| `intelligence/` | Intelligence orchestration             | EXTRACTING |
| `github/`       | GitHub analysis services               | EXTRACTING |
| `ioc/`          | Compliance/OKR                         | EXTRACTING |

---

## Architecture Docs: `docs/`

```
docs/
├── architecture/
│   ├── REPOSITORY_SOURCE_OF_TRUTH.md  # Canonical sources per domain
│   ├── DOMAIN_OWNERSHIP.md            # Domain → package/route mapping
│   ├── CANONICAL_ROUTE_MAP.md         # Route ownership
│   └── ...
├── constitution/
│   ├── 00-VISION.md
│   ├── 01-BRAND-CONSTITUTION.md
│   ├── 02-BHAVYA-OS-CONSTITUTION.md
│   ├── 04-ENGINEERING-CONSTITUTION.md
│   ├── 05-DESIGN-SYSTEM.md
│   └── ...
├── adr/                    # Architecture Decision Records
├── design-system/          # Design system docs
└── ...
```

---

## Contracts: `contracts/`

Each package has a `CONTRACT.md` defining its public interface:

```
contracts/
├── shared/
├── services/
├── runtime/
├── platform-ui/
├── mission-runtime/
├── knowledge-graph/
└── plugins/
```

---

## Agent Context: `.ai/`

```
.ai/
├── architecture.md         # System architecture
├── bootstrap.md            # Initialization instructions
├── CODING_STANDARD.md      # Coding standards
├── CONSTRAINTS.md          # System constraints
├── MASTER_CONTEXT.md       # Master context
├── MEMORY.md               # AI memory
├── MISSION.md              # Foundation mission
├── current-release.md      # Current release info
├── current-task.md         # Current task info
├── roadmap.md              # Development roadmap
├── decision-log.md         # Decision history
├── glossary.md             # Project glossary
├── repository-map.md       # Repository map
├── STYLE_GUIDE.md          # Style guide
├── TOOLS.md                # Available tools
├── WORKFLOWS.md            # Workflow documentation
└── agents/                 # Agent role definitions
```

---

## Generated/Build Outputs

| Path                  | Generated By             | Purpose                        |
| --------------------- | ------------------------ | ------------------------------ |
| `registry/index.json` | `pnpm registry:generate` | Package/route catalog          |
| `FILE-MAP.md`         | `pnpm file-map`          | File structure map             |
| `bar/index.json`      | `bar/scripts/`           | Architecture registry snapshot |
| `.next/`              | `next build`             | Next.js build output           |

---

## Quick Reference: Finding Things

| Need                               | Go To                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| What package owns a domain?        | `docs/architecture/DOMAIN_OWNERSHIP.md`                                        |
| What route serves a feature?       | `docs/architecture/CANONICAL_ROUTE_MAP.md`                                     |
| What's the canonical source for X? | `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`                              |
| Package interface?                 | `contracts/<pkg>/CONTRACT.md`                                                  |
| Engineering standard?              | `standards/`                                                                   |
| Design tokens?                     | `packages/platform-ui/src/styles/tokens.css`                                   |
| Brand rules?                       | `_config/brand-rules.md` (ICM) or `docs/constitution/01-BRAND-CONSTITUTION.md` |
| RFC for a decision?                | `rfcs/`                                                                        |
| Spec for a feature?                | `specs/`                                                                       |
