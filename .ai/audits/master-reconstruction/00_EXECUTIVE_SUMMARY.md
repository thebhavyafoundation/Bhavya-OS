# 00 — Executive Summary (Master Reconstruction Audit, 2026-09-17)

Method: static inspection only (Windows i5/8GB — no servers, no builds, no installs).
Forensic subagents (4 parallel sweeps) + direct verification. `opencode.json` user change preserved, untouched.

## Verdicts

- SOURCE OF TRUTH: PARTIAL (authority hierarchy exists, 8+ unresolved conflicts)
- CONSTITUTION: PARTIAL (9 docs live in `docs/constitution/`; promised docs 10–15 missing; dual-home conflict)
- FOUNDATION MODEL: PASS (4 missions evidenced; Institute-in-Knowledge evidenced)
- MISSION/PROGRAM MODEL: PARTIAL (`Program` entity undefined; route prefixes diverge)
- BHAVYA OS MODEL: PARTIAL (6-layer doctrine vs SQLite-in-app reality)
- GITHUB OS MODEL: PARTIAL (implemented as migrating app + packages; autonomy boundaries undocumented)
- AI INSTITUTE: PARTIAL (127 routes exist as shells; mentor/certification/capstone are stubs)
- EXISTING CURRICULUM: PARTIAL (L1 subset implemented; L0/L2–L12 spec-only; 1 of ~300+ KPs built)
- NEW LESSON SOURCE: FAIL — **no separately supplied lesson collection exists anywhere in the repo**
- CURRICULUM SEPARATION: PASS (nothing to merge; Source B absent — provenance model specified for when it arrives)
- CONTENT TRUTH: FAIL (numeric impact claims ship without source/date/verification state)
- ARCHITECTURE: PARTIAL (canonical host + migration plan coherent; duplicates + split DB/auth blockers)
- DATA MODEL: PARTIAL (canonical direction app→packages holds except 1 violation; domain packages aspirational)
- AGENTS/SKILLS: PARTIAL (12 skills prompt-executable, no code; registries doc-only; memory-engine executable)
- MEMORY: PARTIAL (4 memory kinds conflated in docs; file-backed engine live, ownership unclear)
- GOVERNANCE: PARTIAL (docs exist; amendment log, board records, deployment approvals undocumented)
- SECURITY: PASS (route-policy SSOT + middleware + RBAC + tests evidenced; 1 unknown-path fallback noted)
- CI/DEPLOYMENT: PARTIAL (`main` vs `master` mismatch; Vercel-vs-Cloudflare dual path)
- PRODUCT REALITY: PARTIAL (student shell journey works; backend/ai-mentor missing; no fake-data-to-prod leak found in sample)

## Top critical findings

1. **Source B absent.** Mission premise of "two curriculum sources" is not evidenced in-repo. `git status` shows only `M opencode.json` + `?? .pnpm-store/`; no untracked lesson dirs; `knowledge-packages/` holds 1 README-only KP-001 (6 referenced artifacts missing). If Source B was supplied out-of-band (e.g. Drive), it was never landed. HUMAN DECISION REQUIRED.
2. **KP-001 is a stub presenting as "Gold Standard."** README claims 6 artifacts; zero exist on disk. Production-risk presentation issue.
3. **Constitution numbering/home conflict.** `00-VISION.md Art.5.1` promises docs 03–15; only 9 files exist with non-matching names; `_shared/factory-map.md` says constitution lives in `packages/constitution/`, reality is `docs/constitution/`.
4. **Content SSOT contradiction.** Constitution: `content-core` is the single source, no hardcoded content. Reality per `REPOSITORY_SOURCE_OF_TRUTH.md`: curriculum truth = `apps/ai-institute/src/data/*.ts` + SQLite in app.
5. **Metrics skew across 4 sources** (10,000ha vs 100ha vs 8ha; 1M resources vs 500 KPs vs 10k students). No reconciliation note. Violates content-truth principle.
6. **Route prefix divergence.** `DOMAIN_OWNERSHIP.md` (`/missions/forest`, `/academy`) vs `CANONICAL_ROUTE_MAP.md` (`/forest`, `/knowledge/academy`). Both ACTIVE.
7. **Split persistence/auth.** 4 apps each own `better-sqlite3` + separate DBs; `auth` package exists but ai-institute uses bespoke `api-auth.ts`. Must unify before `/os/*` consolidation.
8. **CI branch mismatch.** `ci.yml`/`deploy-cloudflare.yml` trigger on `master`; `deploy.yml` (Vercel) triggers on `main`. Canonical branch per AGENTS.md is `master`→production; `deploy.yml` would never fire on `master` pushes (or fires on wrong branch).
9. **Design-token split.** 6 competing token systems; canonical `platform-ui tokens.css` (blue `#3b82f6`) vs ai-institute `globals.css` (forest `#1a3a2a`). Rebuild required before migration.
10. **Dead/duplicate weight.** 2 deprecated packages (`ui`, `bdl`), 1 duplicate system (`design-system` pkg), 3 orphan stubs, ~10 duplicate clusters, `apps/github-os.zip` orphan artifact, unscoped `bhavya-intelligence-network` name violating `PACKAGE-NAMESPACE.md`.

## Most important contradictions

- "Three Pillars" header listing four missions (`00-VISION.md Art.2`); brand tagline omits Community.
- L1 domain list differs between `02/08` and `03-KNOWLEDGE-OS` constitutions.
- Package→app source import: `packages/video-engine/src/__tests__/academy.test.ts:7-8` imports from `apps/ai-institute/src/data/`.

## Most important unsupported content

- `content/nature.mdx:15` "14,200 hectares"; `content/community.mdx:21` "100% of contributions fund field projects"; brand README "500+ volunteers / 230+ hectares / 331 KPs" — all UNKNOWN (no source/date/state).
- No named partners, testimonials, awards, or government relationships evidenced anywhere in `ai-institute/src` or `content/`.

## Most important missing capabilities

- Adaptive assessment, conversational AI mentor, verifiable certification, capstone/research flow, personalized roadmap, career/placement — all spec'd in `docs/ai-institute/`, all stub/missing in code.
- Missing domain packages (`knowledge, curriculum, academy, research, forest, heritage, community, github, ioc, social, governance, media`) declared as owners in `DOMAIN_OWNERSHIP.md`.

## Next safe execution order

AUTHORITY (resolve constitution home/numbering, route prefix, content SSOT) → TRUTH (strip or source every numeric claim; complete KP-001 or delist) → DATA (unify DB/auth; fix video-engine import) → ARCHITECTURE (tokens rebuild; duplicates retire; branch fix) → CURRICULUM MODEL (provenance schema; land Source B when supplied) → PRODUCT (stub→real per journey) → VERIFICATION (CI + remote browser).

## Files modified / deleted / renamed

NONE (audit-only). `opencode.json` user modification preserved. Commands: `git status/log/diff`, `Test-Path/Get-ChildItem`, reads via tooling.
