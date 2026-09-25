# 01 — Source-of-Truth Matrix

## Authority hierarchy (discovered, highest first)

1. **CONSTITUTIONAL** — `docs/constitution/00-VISION.md` (SUPREME, effective 2026-01-01) + `01-BRAND`, `02-BHAVYA-OS`, `03-KNOWLEDGE-OS`, `04-ENGINEERING`, `05-DESIGN-SYSTEM`, `06-AI-ETHICS`, `07-CONTENT`, `08-ARCHITECTURE`, `09-ROADMAP`. Conflict: `00 Art.5.1` promises docs 03–15 with different names; only 9 exist. Competing home claim: `_shared/factory-map.md:16` → `packages/constitution/` SDK. EVIDENCE SHOWS `docs/constitution/` is the real home.
2. **INSTITUTIONAL** — `.ai/MISSION.md`, `history/*` (note: `history/founder-notes.md` EMPTY), `governance/` (16 docs), `standards/` (canonical engineering rules).
3. **PRODUCT** — `docs/architecture/CANONICAL_PRODUCT_ARCHITECTURE.md`, `CANONICAL_ROUTE_MAP.md` (one concept → one route), `DOMAIN_OWNERSHIP.md` (one domain → one owner), `REPOSITORY_SOURCE_OF_TRUTH.md` (canonical data per domain), `apps/CONTEXT.md`, `apps/ai-institute/CONTEXT.md`.
4. **CURRICULUM** — `docs/master-curriculum/` (12 files: L0–L12 spec, 74 modules) + `docs/ai-institute/CURRICULUM_ARCHITECTURE.md` (older 8-level model — superseded in practice but never marked) + code `apps/ai-institute/src/data/*.ts`.
5. **DESIGN** — `packages/platform-ui/src/styles/tokens.css` (self-declared canonical) vs `apps/ai-institute` globals (de-facto). CONFLICT, see `DUPLICATION_AUDIT.md:142-153`.
6. **ENGINEERING** — `AGENTS.md`, `CONTEXT.md` hubs, `contracts/*/CONTRACT.md` (11 present), `packages/CONTEXT.md`, `turbo.json`, `.github/workflows/ci.yml`.
7. **RUNTIME** — `apps/ai-institute/src/lib/studio/db.ts` (SQLite), `src/lib/academy-*.ts`, `src/data/*.ts`. CONFLICT with L2 `content-core` doctrine.
8. **OPERATIONAL** — `vercel.json` (Vercel→ai-institute), `deploy-cloudflare.yml` (Cloudflare→ai-institute). Dual path, undocumented precedence.
9. **HISTORICAL** — `_archive/`, `archive/apps/`, `docs/releases/` (49 docs), `history/` timelines. Evidence only, never authority.

## Domain matrix

| Domain              | Authoritative source                     | Secondary                                    | Implementation                        | Status          | Conflicts                             |
| ------------------- | ---------------------------------------- | -------------------------------------------- | ------------------------------------- | --------------- | ------------------------------------- |
| Foundation identity | `00-VISION.md`                           | `.ai/MISSION.md`                             | `content/*.mdx`, `/about`, `/mission` | PARTIAL         | Pillar count; tagline omits Community |
| Vision/Mission      | `00-VISION.md`                           | `01-BRAND`                                   | same                                  | PARTIAL         | 4 metric scales                       |
| Governance          | `governance/` + `standards/`             | `specs/governance.md` (STUB)                 | `/os/docs`, `/os/admin`               | PARTIAL         | No amendment log/board record         |
| Brand               | `01-BRAND` + `docs/brand/BRAND_GUIDE.md` | factory-map                                  | `platform-ui` tokens                  | PARTIAL         | Token split                           |
| Design              | `05-DESIGN-SYSTEM`                       | `docs/design-system/` (7 files)              | `platform-ui` vs app globals          | CONFLICT        | 6 token systems                       |
| Engineering         | `04-ENGINEERING` + `standards/`          | `AGENTS.md`                                  | turbo/CI/contracts                    | PASS with notes | Branch mismatch                       |
| AI ethics           | `06-AI-ETHICS`                           | `docs/ai-institute/AI_STRATEGY.md`           | no runtime enforcement found          | DOCUMENTED ONLY | —                                     |
| Content truth       | `07-CONTENT` + content-truth skill       | —                                            | `content/`, `src/data/`               | FAIL            | Unsourced numeric claims              |
| Knowledge           | `03-KNOWLEDGE-OS`                        | `REPOSITORY_SOURCE_OF_TRUTH.md`              | `src/data/`, SQLite                   | CONFLICT        | SSOT vs SQLite                        |
| AI Institute        | `docs/ai-institute/VISION.md`, `PRD.md`  | `apps/ai-institute/CONTEXT.md`               | `apps/ai-institute/` (127 routes)     | PARTIAL         | Shell vs spec gaps                    |
| Curriculum          | `docs/master-curriculum/`                | `CURRICULUM_ARCHITECTURE.md` (stale)         | `src/data/academy-*.ts`               | PARTIAL         | 13-level vs 8-level                   |
| Lessons             | `src/data/academy-lessons.ts` (479KB)    | `lesson-content.ts`                          | `/courses/[id]/lessons/[lessonId]`    | PARTIAL         | L1-only coverage                      |
| Assessment          | `ASSESSMENT_MODEL.md`                    | `assessments.ts` (40+ Qs)                    | `/assessment`                         | PARTIAL         | No adaptivity                         |
| Certification       | `CERTIFICATION_MODEL.md`                 | —                                            | `/app/credentials`                    | STUB            | No verifiable flow                    |
| Projects            | project constitution docs                | `projects.ts`                                | `/projects`, `/workspace`             | PARTIAL         | No GitHub milestones                  |
| Mentor              | `MENTOR_MODEL.md`                        | —                                            | `/mentor`                             | STUB            | No conversational mentor              |
| Memory              | `.ai/MEMORY.md` + memory docs            | `packages/memory-engine/`                    | file-backed engine                    | PARTIAL         | 4 memory kinds conflated              |
| Runtime/GitHub OS   | `02/08` constitutions                    | `apps/github-os/` + `packages/intelligence/` | migrating app + packages              | PARTIAL         | Autonomy bounds undocumented          |
| Security            | `standards/security.md` + security skill | `route-policy.ts`                            | `api-auth.ts`, middleware, RBAC tests | PASS with notes | Unknown-path fallback permissive      |
| Deployment          | `vercel.json`                            | `deploy*.yml`, `vercel-build-app.mjs`        | Vercel + Cloudflare                   | PARTIAL         | Branch + dual-path                    |
| Analytics           | `docs/ai-institute/SUCCESS_METRICS.md`   | —                                            | not found in code sample              | MISSING         | —                                     |
| Public website      | `CANONICAL_ROUTE_MAP.md`                 | `apps/CONTEXT.md`                            | `/` in ai-institute                   | MIGRATING       | website archived correctly            |

## Conflict handling rule applied

No silent picks. Every conflict above records SOURCE A vs SOURCE B, authority level, what can/cannot be concluded, and whether a human decision is required (see `24_HUMAN_DECISIONS.md`).
