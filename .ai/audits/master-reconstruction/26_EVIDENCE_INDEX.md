# 26 — Evidence Index

## Authority / constitution

- `docs/constitution/00-VISION.md` (SUPREME 2026-01-01; Art.1.1, Art.2–5) · `01-BRAND-CONSTITUTION.md` (Art.10 stats) · `02-BHAVYA-OS-CONSTITUTION.md` (Art.2, Art.8) · `03-KNOWLEDGE-OS-CONSTITUTION.md` (§§2–4,10) · `04-ENGINEERING-CONSTITUTION.md` · `05-DESIGN-SYSTEM.md` · `06-AI-ETHICS.md` · `07-CONTENT-CONSTITUTION.md` · `08-ARCHITECTURE.md` (Art.1) · `09-ROADMAP.md`
- `_archive/constitution-2026-09-05/` (15 files — predecessor set) · `_shared/factory-map.md:7-21` · `.ai/MISSION.md` · `history/founder-notes.md` (EMPTY) · `specs/missions.md` + `specs/governance.md` (STUBS)

## Product / architecture

- `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` · `CANONICAL_ROUTE_MAP.md` · `CANONICAL_PRODUCT_ARCHITECTURE.md` · `DOMAIN_OWNERSHIP.md` · `CANONICAL_APPLICATION_MAP.md` · `DUPLICATION_AUDIT.md` · `PACKAGE-NAMESPACE.md`
- `AGENTS.md` · `CONTEXT.md` · `apps/CONTEXT.md` · `apps/ai-institute/CONTEXT.md` · `packages/CONTEXT.md` · `docs/CONTEXT.md` · `.ai/CONTEXT.md` · `docs/product/DIGITAL_INSTITUTION.md`
- `vercel.json` · `turbo.json` · `pnpm-workspace.yaml` · `package.json` · `contracts/` (11) · `scripts/vercel-build-app.mjs` · `.github/workflows/ci.yml|deploy.yml|deploy-cloudflare.yml`

## Institute / curriculum (Source A)

- `apps/ai-institute/src/data/academy-lessons.ts|academy-courses.ts|lesson-content.ts|assessments.ts|learning-paths.ts|lab-exercises.ts|curriculum-levels.ts|knowledge-packages.ts|projects.ts|progress.ts|knowledge-graph.ts`
- `apps/ai-institute/src/lib/api-auth.ts|require-role.ts|route-policy.ts|roles.ts|middleware.ts|repositories/|studio/` · `src/app/` (127 page.tsx) · `apps/ai-institute/docs/architecture/ROUTE_SECURITY_MATRIX.md`
- `docs/ai-institute/` (37: VISION, PRD, CURRICULUM_ARCHITECTURE, COMPETENCY_FRAMEWORK, ASSESSMENT_MODEL, CERTIFICATION_MODEL, LEARNING_JOURNEY, student-journey, MENTOR_MODEL, PORTFOLIO_MODEL, LAB_SYSTEM, CONTENT_MODEL/GOVERNANCE, DOMAIN_MODEL, AI_STRATEGY, KNOWLEDGE_INTEGRATION…) · `docs/master-curriculum/` (12: MASTER_CURRICULUM, LEVEL_STRUCTURE, MODULE_CATALOG 1659 lines, COMPETENCY_MATRIX, PROJECT_CATALOG, KNOWLEDGE_PACKAGE_BACKLOG…)
- `knowledge-packages/level-1/KP-001-How-Large-Language-Models-Work/README.md` (artifacts missing) · `content/` (8 mdx + forest/governance/knowledge/research/volunteer/…) · `content/nature.mdx:15` · `content/community.mdx:10,21`

## Truth / security / delivery samples

- `apps/ai-institute/public/brand/assets/README.md:77-79` · `src/app/forest/page.tsx:44` · `src/app/app/forest/new/page.tsx:250` · `src/scripts/db-seed.ts:5` · `apps/github-os/src/app/api/constitutional-validation/route.ts:145` · `apps/github-os/src/lib/seed.ts:3002`
- `packages/video-engine/src/__tests__/academy.test.ts:7-8` (violation) · `packages/memory-engine/src/index.ts:17-109` · `packages/runtime/daemon/watch.mjs` · `.opencode/skills/*/SKILL.md` (12) · `.ai/agents/registry.yaml` · `governance/` (16) · `standards/`

## Git forensics

- `git log --oneline -15` head `47a0b8c` (Phase-7 recovery reconcile) · branch `master` tracking `origin/master` · `git status`: `M opencode.json` (user auth-header change `env:GITHUB_TOKEN` → `file:.../github-mcp-token`, PRESERVED) + `?? .pnpm-store/`

## Legend

FACT = file-evidenced · DOCUMENTED INTENT = spec without code · IMPLEMENTATION OBSERVATION = code behavior · INFERENCE = labeled as such · UNKNOWN = no evidence · HUMAN DECISION REQUIRED = §24.
