# Repository Source of Truth

**Created:** 2026-08-10
**Last updated:** 2026-08-10
**Status:** Authoritative — all architectural decisions reference this document

---

## Canonical Sources Per Domain

### Website (Marketing)

| Attribute           | Canonical                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Location**        | `apps/website/`                                                                                            |
| **Framework**       | Next.js 15 + React 19                                                                                      |
| **Design tokens**   | `packages/platform-ui/src/styles/tokens.css`                                                               |
| **Content**         | 15+ pages, donation form, transparency portal                                                              |
| **Deployed**        | Vercel (`bhavya-foundation.vercel.app`)                                                                    |
| **In workspace**    | Yes                                                                                                        |
| **Root `website/`** | ARCHIVED — Astro/Starlight docs site, not in workspace, 7 files. Relocated to `archive/website-starlight/` |

### Design System

| Source                                       | Role                          | Canonical?                                          |
| -------------------------------------------- | ----------------------------- | --------------------------------------------------- |
| `packages/platform-ui/src/styles/tokens.css` | Token definitions (359 lines) | **YES** — self-declares "Canonical Source of Truth" |
| `packages/platform-ui/src/components/`       | 22+ React components          | **YES** — canonical component library               |
| `apps/design-system/`                        | Showcase/storybook app        | NO — consumer of platform-ui                        |
| `design-system/bhavya-foundation/MASTER.md`  | Documentation                 | NO — spec doc, not implementation                   |
| `apps/website/src/app/globals.css`           | 2000+ lines, most complete    | NO — application-level copy, slightly divergent     |

### Knowledge / Learning

| Source                                               | Role                                       | Canonical?                                     |
| ---------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| `apps/ai-institute/src/data/`                        | Static knowledge objects, courses, lessons | **YES** — production app                       |
| `apps/ai-institute/src/lib/studio/db.ts`             | SQLite persistence                         | **YES** — runtime data                         |
| `apps/ai-institute/src/lib/academy-*.ts`             | Academy data layer                         | **YES** — runtime data                         |
| `apps/ai-institute/src/lib/studio/runtime-client.ts` | SQLite-backed API client                   | **YES** — runtime data                         |
| `apps/knowledge/`                                    | Knowledge visualization UI                 | NO — consumer, not source                      |
| `knowledge/` (root)                                  | Raw knowledge data files                   | NO — data only, no UI                          |
| `apps/knowledge-studio/`                             | Legacy Next.js KO editor                   | **ARCHIVED** — replaced by `/studio/knowledge` |
| `apps/lesson-studio/`                                | Legacy lesson studio                       | **ARCHIVED** — replaced by `/studio/lessons`   |
| `apps/bhavya-ai-lab/`                                | Legacy lesson builder + runtime            | **ARCHIVED** — replaced by ai-institute        |

### GitHub / Intelligence

| Source                   | Role                       | Canonical?                                      |
| ------------------------ | -------------------------- | ----------------------------------------------- |
| `apps/github-os/`        | GitHub OS app              | **MIGRATING** → `/os/github`                    |
| `packages/intelligence/` | Intelligence orchestration | **EXTRACTING** from bhavya-intelligence-network |
| `packages/github/`       | GitHub analysis services   | **EXTRACTING** from github-os                   |

### Governance / Transparency

| Source                 | Role                      | Canonical?                  |
| ---------------------- | ------------------------- | --------------------------- |
| `apps/admin/`          | Admin dashboard (Next.js) | **MIGRATING** → `/os/admin` |
| `packages/governance/` | Governance data layer     | **EXTRACTING** from docs    |
| `governance/` (root)   | Governance documents      | YES — reference data        |
| `standards/` (root)    | Engineering standards     | YES — reference data        |

### Documentation

| Source            | Role                                  | Canonical?                 |
| ----------------- | ------------------------------------- | -------------------------- |
| `apps/docs/`      | Governance dashboard                  | **MIGRATING** → `/os/docs` |
| `docs/` (root)    | Architecture docs, ADRs, design specs | YES — canonical source     |
| `content/` (root) | Raw content, blog posts               | YES — content source       |

### Platform / Shared Packages

| Source                   | Role                                | Canonical? |
| ------------------------ | ----------------------------------- | ---------- |
| `packages/platform-ui/`  | Design system implementation        | **YES**    |
| `packages/shared/`       | Shared types, utilities             | **YES**    |
| `packages/runtime/`      | Runtime engine                      | **YES**    |
| `packages/constitution/` | Governance documents                | **YES**    |
| `packages/video-engine/` | Video generation (composition only) | **YES**    |

---

## Apps Classification

### CANONICAL HOST (1) — The Bhavya Foundation web application

| App            | Purpose                                                                          | Status               |
| -------------- | -------------------------------------------------------------------------------- | -------------------- |
| `ai-institute` | Bhavya Foundation Web — canonical app hosting all public, academy, and OS routes | Active — primary app |

### MIGRATING (7) — Domain apps being consolidated into canonical app

| App                           | Purpose                      | Target Route                   | Status     |
| ----------------------------- | ---------------------------- | ------------------------------ | ---------- |
| `website`                     | Public foundation website    | Merge into canonical `/`       | Migrating  |
| `admin`                       | Founder operations dashboard | `/os/admin`                    | Migrating  |
| `docs`                        | Governance dashboard         | `/os/docs`                     | Migrating  |
| `github-os`                   | Repository intelligence      | `/os/github`                   | Migrating  |
| `ioc`                         | Compliance / OKR             | `/os/ioc`                      | Migrating  |
| `social-os`                   | Communication ops            | `/os/social`                   | Migrating  |
| `bhavya-intelligence-network` | Intelligence engine          | Package extraction (no routes) | Extracting |

### KEEP SEPARATE (1) — Developer tool

| App             | Purpose                | Status                       |
| --------------- | ---------------------- | ---------------------------- |
| `design-system` | Design system showcase | Active — standalone dev tool |

### ARCHIVED (14) — Moved to `archive/apps/`

| App                        | Reason                | Replaced By                     |
| -------------------------- | --------------------- | ------------------------------- |
| `bhavya-ai-lab`            | Legacy lesson builder | `ai-institute`                  |
| `dashboard`                | Legacy dashboard      | `admin`                         |
| `forest`                   | Superseded            | `ai-institute`                  |
| `heritage`                 | Superseded            | `ai-institute`                  |
| `knowledge`                | Superseded            | `ai-institute`                  |
| `knowledge-studio`         | Legacy KO editor      | `ai-institute/studio/knowledge` |
| `lesson-studio`            | Legacy lesson studio  | `ai-institute/studio/lessons`   |
| `library`                  | Superseded            | `ai-institute`                  |
| `research`                 | Superseded            | `ai-institute`                  |
| `transparency`             | Superseded            | `admin`                         |
| `volunteer`                | Superseded            | `ai-institute`                  |
| `capability-center`        | Shell app             | `github-os`                     |
| `github-intelligence-lab`  | Legacy GitHub intel   | `github-os`                     |
| `open-source-intelligence` | Shell app             | `bhavya-intelligence-network`   |

### Root Directories — Classification

| Directory     | Role                   | Canonical?                                                              |
| ------------- | ---------------------- | ----------------------------------------------------------------------- |
| `bar/`        | Architecture registry  | YES — reference data                                                    |
| `config/`     | Configuration files    | YES — shared config                                                     |
| `content/`    | Content source (MDX)   | YES — raw content                                                       |
| `contracts/`  | Package contracts      | YES — reference data                                                    |
| `governance/` | Governance documents   | YES — reference data                                                    |
| `memory/`     | Agent memory           | YES — reference data                                                    |
| `navigation/` | Navigation definitions | YES — reference data                                                    |
| `platform/`   | Platform config        | YES — reference data                                                    |
| `prototypes/` | Experimental code      | YES — reference data                                                    |
| `registry/`   | Generated registry     | YES — generated output                                                  |
| `rfcs/`       | RFC documents          | YES — reference data                                                    |
| `schemas/`    | Data schemas           | YES — reference data                                                    |
| `scripts/`    | Utility scripts        | YES — shared scripts                                                    |
| `specs/`      | Specifications         | YES — reference data                                                    |
| `standards/`  | Engineering standards  | YES — reference data                                                    |
| `validation/` | Validation rules       | YES — reference data                                                    |
| `website/`    | Astro docs site        | **ARCHIVED** — non-workspace, relocated to `archive/website-starlight/` |

---

## Cleanup Actions Taken

| Date       | Action                                                     | Impact                                          |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------- |
| 2026-08-10 | Root `website/` archived to `archive/website-starlight/`   | Non-workspace Astro docs site removed from root |
| 2026-08-10 | 14 legacy/duplicate/shell apps archived to `archive/apps/` | apps/ reduced from 23 to 9 canonical            |
| 2026-08-10 | `pnpm-workspace.yaml` updated                              | Workspace only includes 9 canonical apps        |

---

## Decision Record

**Q: Why archive apps instead of deleting?**
A: Preserves git history, allows reference, prevents accidental data loss. Archive is a holding area — code can be recovered if needed.

**Q: Why not consolidate canonical apps into ai-institute?**
A: We ARE consolidating into ai-institute. The 7 migrating apps will have their domain logic extracted to packages and their UI routes moved into the canonical app under `/os/*`. Only `design-system` remains separate as a developer tool. See `CANONICAL_PRODUCT_ARCHITECTURE.md`.

**Q: What about the root `design-system/` directory?**
A: It contains MASTER.md documentation only. The actual implementation lives in `packages/platform-ui/`. The root dir is kept as reference documentation.
