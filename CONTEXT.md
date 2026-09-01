# Bhavya Digital Institution — Context Router

One sentence: Bhavya is a digital institution — one application, many roles, one shared knowledge graph, one contribution graph, one community. This monorepo contains the canonical web application, 65 shared packages, and the governance architecture.

**Last updated:** 2026-08-11

## Product Definition

Bhavya is not a website + academy + dashboard. It is ONE DIGITAL INSTITUTION:

- **Public Experience** (`/`) — editorial, cinematic, institutional entrance
- **My Bhavya** (`/app`) — role-aware authenticated home (student, volunteer, donor, researcher, mentor, educator)
- **Bhavya OS** (`/os`) — institutional operations (admin, governance, studio)

See `docs/product/DIGITAL_INSTITUTION.md` for the full product definition.

## Where things live

| Folder           | What it holds                                                                                                           | ICM Form         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `apps/`          | 9 applications — 1 canonical web app (ai-institute), 1 dev tool (design-system), 7 domain apps migrating into canonical | Umbrella         |
| `packages/`      | 65 shared packages (auth, database, runtime, UI, AI engines)                                                            | Record Library   |
| `.ai/`           | Agent context — architecture, memory, state, decisions                                                                  | Knowledge Bundle |
| `.agents/`       | 18 role-based agent definitions + 25 video skills                                                                       | Context Map      |
| `docs/`          | 54+ directories of institutional knowledge                                                                              | Knowledge Bundle |
| `registry/`      | Machine-readable indexes (agents, apps, packages, services)                                                             | Catalog          |
| `schemas/`       | JSON validation contracts (agent, event, task, workflow, etc.)                                                          | Contract         |
| `platform/`      | Agent runtime definitions, ecosystem components, AI runtime                                                             | Context Map      |
| `memory/`        | Institutional memory (engineering, decisions, knowledge)                                                                | Record Library   |
| `bar/`           | Bhavya Architecture Registry — 618 entities                                                                             | Catalog          |
| `standards/`     | 21 engineering standards                                                                                                | Contract         |
| `governance/`    | Governance model, policies, ownership                                                                                   | Contract         |
| `rfcs/`          | Request for Comments pipeline                                                                                           | Pipeline         |
| `contracts/`     | 11 package CONTRACT.md files                                                                                            | Contract         |
| `scripts/`       | Build/deploy automation                                                                                                 | Factory          |
| `knowledge/`     | Engineering graphs (7 JSON dependency maps)                                                                             | Knowledge Bundle |
| `content/`       | Content data (constitution, financials, forest, heritage, etc.)                                                         | Record Library   |
| `archive/`       | 14 archived apps + 1 archived website (preserved, git-tracked)                                                          | Archive          |
| `bhavya-ai-lab/` | AI Lab OS — self-contained sub-project                                                                                  | Umbrella         |
| `openhuman/`     | Rust + Tauri desktop app (separate project)                                                                             | Product          |

## Route by task

| If you need to...            | Go to                            | Start with                          |
| ---------------------------- | -------------------------------- | ----------------------------------- |
| Build/modify an application  | `apps/<name>/`                   | `apps/CONTEXT.md`                   |
| Use a shared package         | `packages/<name>/`               | `packages/CONTEXT.md`               |
| Understand agent context     | `.ai/`                           | `.ai/CONTEXT.md`                    |
| Find an agent definition     | `.agents/` or `platform/agents/` | `.agents/registry.json`             |
| Read documentation           | `docs/`                          | `docs/CONTEXT.md`                   |
| Check machine-readable state | `registry/`                      | `registry/index.json`               |
| Validate against schema      | `schemas/`                       | `schemas/`                          |
| Read engineering standards   | `standards/`                     | `standards/README.md`               |
| Read governance rules        | `governance/`                    | `governance/README.md`              |
| Submit an RFC                | `rfcs/`                          | `rfcs/RFC-0001-Volunteer-Portal.md` |
| Read architecture decisions  | `docs/adr/`                      | `docs/adr/ADR-001-...md`            |
| Check institutional memory   | `memory/` or `.ai/memory/`       | `memory/engineering/`               |
| Run build scripts            | `scripts/`                       | `scripts/`                          |
| Check package contracts      | `contracts/`                     | `contracts/<pkg>/CONTRACT.md`       |
| View architecture registry   | `bar/`                           | `bar/index.json`                    |
| Work on AI Lab               | `bhavya-ai-lab/`                 | `bhavya-ai-lab/CLAUDE.md`           |

## The governance layer

Governance lives ABOVE the ICM routing layer. These are the authoritative sources:

- **Engineering principles:** `AGENTS.md` (root)
- **Standards:** `standards/` (21 files)
- **Architecture decisions:** `docs/adr/` (6 ADRs)
- **RFCs:** `rfcs/` (3 RFCs)
- **Package contracts:** `contracts/` (11 CONTRACT.md files)
- **Constitutional documents:** `@bhavya/constitution` package (use the package, not root copies)
- **Agent permissions:** `.agents/` role definitions + `platform/agents/` scope files

## Status

Status is derivable from the filesystem:

- Release info: `.ai/current-release.md`
- Active work: `.ai/current-task.md`
- Roadmap: `.ai/roadmap.md`
- Wave docs: `docs/wave-9/`, `docs/wave-10/`
- Release notes: `docs/releases/`

## Product consolidation status

The target is **ONE BHAVYA FOUNDATION WEB EXPERIENCE**. Currently9 apps exist in `apps/`, but the product consolidation plan (see `docs/architecture/CANONICAL_PRODUCT_ARCHITECTURE.md`) maps them all into a single canonical app (`apps/ai-institute`) with domain packages. The consolidation is planned, not yet implemented.

- **Canonical app:** `apps/ai-institute` → Bhavya Foundation Web
- **Design system:** `apps/design-system` → developer showcase (keep separate)
- **All others:** Migrating into canonical app as `/os/*` routes

See `docs/architecture/CANONICAL_APPLICATION_MAP.md` for the full route mapping.

## Design System

The Bhavya Foundation design system is canonical and must be followed for all UI work:

- **Design System Board:** `apps/ai-institute/public/brand/assets/bhavya-design-system-board.png`
- **Design System Board Reference:** `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md`
- **Web Experience Design System:** `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`
- **Design Tokens:** `packages/platform-ui/src/styles/tokens.css`
- **Brand Guide:** `docs/brand/BRAND_GUIDE.md`
- **Motion System:** `docs/design-system/BHAVYA_MOTION_SYSTEM.md`

All agents MUST review the design system board before creating any UI components or visual assets.

## The one rule

Nothing in this routing file holds content. It points. If a section grows past 5 lines, the content belongs in the target directory's own CONTEXT.md.
