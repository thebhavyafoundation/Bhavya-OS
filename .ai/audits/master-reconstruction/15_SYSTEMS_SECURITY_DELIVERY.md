# 15–21 — Agents/Skills, Memory, Governance, Security, Design/UX, CI/Deploy, Product Reality

## Agents / skills / MCP

12 project skills in `.opencode/skills/` (ai-development, architecture, content-truth, data-model, design-system, github-workflow, production-verification, reasons-canvas, route-audit, security, spec, ui-verification): all prompt-executable, doc-only (SKILL.md, no scripts) — classify EXECUTABLE-AS-PROMPT, not code. `.ai/agents/` (9 profiles + `registry.yaml`) doc-only. `.ai/memory/` + `memory/` doc-only data. Executable: `packages/memory-engine` (`MemoryEngine`, file-backed Map) + `packages/runtime/daemon/watch.mjs` (fs.watch, debounce, compile→validate→event→history→state, `--once` for CI). No MCP capability invented: only configured servers count; stale doc references must be treated UNKNOWN. Do not reinstall from old docs.

## Memory

Four kinds conflated: institutional (`memory/`, `.ai/memory/`), runtime/agent (engine + `.ai/state|events|history`), student learning (`student-store.ts`, `student/progress` API, SQLite), dev/tooling (snapshots, task graph). Ownership/persistence/privacy/consumers undocumented per-kind; student-vs-institutional boundary is the HIGH-risk item (child data). Required: memory ownership table + retention/privacy rules before any student-memory expansion.

## Governance

`governance/` (16 docs), `standards/` (canonical rules), `CODEOWNERS`, `contracts/`, ADR/RFC dirs, quality gates (antislop+lint+typecheck+test+build+secret-scan in CI). Actual decision flow INFERRED (not codified): human-only — constitutional amendments, public claims, production deploys, autonomy bounds, curriculum merge; agent-permitted — scoped code/content tasks under gates; automatable — registry/file-map/token-sync generation. Missing: amendment log, board records, deployment-approval records, agent-mutation allowlist. HUMAN DECISION REQUIRED.

## Security boundaries

PUBLIC: `/`, editorial routes, `/os /os/knowledge /os/search`. AUTHENTICATED: `/app/*`, `/dashboard`, `/studio` (role-gated), `/onboarding`, non-public `/os/*`. Roles: admin/trustee/staff/volunteer/donor/student/builder/researcher/educator/instructor (+ `OS_TOOL_ROLES` for runtime/github/ioc/social/videos). Controls evidenced: bcrypt-12, session cookie + expiry, `stripSensitive`, route-policy SSOT + authorization-matrix tests, middleware CSRF/referer checks, hard-403 fallback route, noindex on non-public, CSP/HSTS/frame-deny. Watch items: unknown-path fallback is session-only permissive; `packages/auth` unused by canonical app; 4-way DB split multiplies breach surface. No credential/secret leak found in sample; no child-data exposure found in sample (verify again pre-release).

## Design / UX

Intended (05 + brand + `docs/design-system/` + ai-institute design docs): institutional-editorial-ecological; forest/ivory/earth/gold; Playfair Display + Inter; BEE 2.0 + 4 gates. Actual: token split (canonical `platform-ui tokens.css` blue vs app `globals.css` forest 2000+ lines, divergent) + duplicate component clusters (12 sidebars etc.). Never purple/blue AI styling (per AGENTS.md — violated by canonical blue tokens; resolve toward forest per ai-institute CONTEXT.md human-check). Motion/interaction libraries spec'd, implementation partial. Accessibility/responsive/empty/loading/error states: sampled routes exist; systematic a11y pass not evidenced — mark UNVERIFIED.

## CI / deployment / verification

`ci.yml` (master) coherent; `deploy.yml` (main) mismatched; `deploy-cloudflare.yml` (master, opennext) dual-path. Target chain (local → branch → commit → push → Actions → Cloudflare preview → Playwright → evidence → PR → gate → master/prod) is DOCUMENTED in mission but NOT the current wiring (Vercel builds ai-institute via `vercel.json`; Cloudflare path parallel; Playwright/browser skill `.opencode/skills/bhavya-qa` exists but no wired preview→browser gate found). Agents MUST NOT operate Vercel unless explicitly authorized (AGENTS.md). This audit ran zero builds/tests/servers per low-resource rule.

## Product reality (child/student walkthrough today)

`/` → `/learning-paths|/curriculum|/programs` → `/assessment` (static) → `/onboarding|/register|/login` → `/dashboard|/app/learn` → `/courses/[id]/lessons/[lessonId]` (real L1 content) → labs (6, static) → `/projects|/workspace` (shell) → `/portfolio` (shell) → `/mentor` (stub) → `/app/credentials` (stub). Works: browsing, reading L1 lessons, static quizzes, studio authoring shells. Breaks/missing: adaptivity, mentor conversation, verifiable certs, capstone, roadmap personalization, career. Fake-data risk in walked sample: LOW (demo confined to seed/templates); UNSOURCED-CONTENT risk: HIGH (`content/*.mdx` numbers, brand stats, KP-001).
