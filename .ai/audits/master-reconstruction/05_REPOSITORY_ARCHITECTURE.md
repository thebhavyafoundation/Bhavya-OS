# 05–08 — Bhavya OS, GitHub OS, Repository Architecture, App/Package Map

## Bhavya OS model (evidenced 6-layer doctrine vs reality)

Doctrine (`02 Art.2`, `08 Art.1`): L1 Mission (creates via `publishKnowledge()`) → L2 Platform `@bhavya/content-core` (SSOT) → L3 Knowledge API (read-only) → L4 Intelligence (never mutates) → L5 Presentation → L6 UX.
Reality (`REPOSITORY_SOURCE_OF_TRUTH.md:33-45`): knowledge/curriculum truth = `apps/ai-institute/src/data/`, `src/lib/studio/db.ts` (SQLite), `src/lib/academy-*.ts`. Status: DOCUMENTED doctrine vs CONTRADICTORY implementation. Migration path: extract `src/data` + studio DB into `content-core`/domain packages (which don't exist yet — see below).

Bhavya OS component status: LIVE: canonical host, content-core, platform-ui, runtime daemon (`packages/runtime/daemon/watch.mjs`), memory-engine. PARTIAL: intelligence extraction, governance data layer. DOCUMENTATION ONLY: AI ethics enforcement, analytics. HISTORICAL/ARCHIVED: 14 apps in `archive/apps/`, `bar/` static snapshot (generator retired).

## GitHub OS reconstruction

Meaning in-repo: repository-intelligence subsystem (repo → commits/issues → agents → specs → CI → deploy → verify → evolve). Implementation: `apps/github-os/` (MIGRATING → `/os/github`) + `packages/github/` + `packages/intelligence/` star (capability-registry, crawlers, analyzers, plugin-manager, browser-automation, technology-radar, mcp-manager, github-intelligence). IMPLEMENTED: app shell, seed/validation routes, intelligence package wiring (heaviest app: 15 workspace deps in `bhavya-intelligence-network`). PARTIAL: extraction to packages. DOCUMENTED ONLY: autonomous-change bounds — what agents may/may not mutate, what requires human authority, self-modification guards are NOT codified anywhere found. HUMAN DECISION REQUIRED before any autonomy claims.

## Repository inventory (structural)

- `apps/`: 8 dirs + CONTEXT.md + `github-os.zip` (ORPHAN ARTIFACT — remove). 1 CANONICAL (`ai-institute`), 5 MIGRATING (`admin→/os/admin`, `docs→/os/docs`, `github-os→/os/github`, `ioc→/os/ioc`, `social-os→/os/social`), 1 EXTRACTING (`bhavya-intelligence-network`, unscoped name violates `PACKAGE-NAMESPACE.md`), 1 KEEP (`design-system` dev tool).
- `packages/`: 65 dirs, ~60 workspace packages + 3 orphan stubs (`github-os/ioc/social-os`, no package.json) + 2 deprecated (`ui`, `bdl` → platform-ui) + 1 duplicate system (`design-system` pkg vs `platform-ui`). Duplicate clusters: `shared/types/platform/config`; `knowledge-{engine,graph,extraction}`; `agent-{engine,platform}`; `workflow-engine/workflows`; `content-{core,board,engine}`; UI primitives (12 sidebars, 4 search, 5 buttons per `DUPLICATION_AUDIT.md`).
- `contracts/`: 11/11 present, aligned with `packages/CONTEXT.md`. `bar/`: static snapshot, generator retired — do not hand-edit. `registry/`: generated (`pnpm registry:generate`).
- Missing domain packages declared as owners in `DOMAIN_OWNERSHIP.md:19-35` (`knowledge, curriculum, academy, research, forest, heritage, community, github, ioc, social, governance, media`) — zero exist as `packages/*/package.json`. Ownership doc is ASPIRATIONAL.
- Boundary audit (sampled): apps→packages direction clean; NO app→app imports (conforms); ONE package→app violation (`packages/video-engine/src/__tests__/academy.test.ts:7-8` imports `apps/ai-institute/src/data/` — must fix); 4 apps each bundle `better-sqlite3` with separate DBs (must unify); auth split (bespoke `api-auth.ts` vs unused `packages/auth`).
- CI: `ci.yml` (master: antislop+lint+typecheck → test → build + secret-scan) coherent. `deploy.yml` triggers on `main` — MISMATCH (canonical branch is `master`). `deploy-cloudflare.yml` (master, opennext) creates undocumented Vercel-vs-Cloudflare dual path.
