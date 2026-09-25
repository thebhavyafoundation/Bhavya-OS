# Mission Control — Existing Capability Map (2026-09-18, forensic, read-only)

Evidence from three parallel forensic sweeps this session. Seed/demo is NEVER counted as capability.

## 1. GitHub OS capability-intelligence layer — largely IMPLEMENTED

- **Live discovery + scoring:** `apps/github-os/src/lib/intelligence-engine.ts` (Discover→Ingest→Inspect→Score→Extract→Recommend, live GitHub fetch, heuristic scoring), `daily-intelligence-engine.ts` (daily loop, 8 req/min limiter, 6-dim ranking, `persistRankings`), `daily-intelligence-types.ts` (DailyRun/DiscoveryCandidate/Finding/Gates). IMPLEMENTED.
- **41 API routes** in `apps/github-os/src/app/api/`: repositories (14), daily-intelligence loop (8: runs/findings/briefing/trends/graph/validate/webhooks), knowledge/graph/search/patterns (5), radar/recommendations passthrough (2), design/education/ops (12). Mostly IMPLEMENTED; advisor/plan/review heuristic → PARTIAL. Auth via `withAuth()` except public `health`.
- **Graph derivation:** `intelligence-graph.ts`, `knowledge-graph-builder.ts` (DB→graph). IMPLEMENTED over seed-or-live data.
- **Truth/constitution rules:** `constitutional-validation.ts` (TRUTH-001..NN, confidence 0–1, provenance). IMPLEMENTED.
- **Seed/demo (NOT capability):** `seed.ts` (3193 lines static inserts), `discovery-categories.ts` constants, radar/recommendations pure-SELECT passthroughs. SEED-DEMO.
- **Packages:** `@bhavya/github-intelligence` (live trending/releases fetch, graceful [] fallback) IMPLEMENTED; `@bhavya/intelligence` types IMPLEMENTED but engine files unwired (PARTIAL); `knowledge-extraction` ephemeral logic (PARTIAL); `knowledge-graph` 25-entity/20-relation schema IMPLEMENTED, manager STUB; `knowledge-engine` file-loader STUB; `capability-registry` 12-dim heuristic `calculateBhavyaScore` PARTIAL. No _ranking_/_scoring_ packages exist.
- **License analysis:** SPDX-set lookup + gate evaluator (allow/study/monitor). PARTIAL (no dep-license scan, no SPDX API).
- **Security analysis:** filename blocklists + README regexes; `hasKnownVulnerabilities: false` hardcoded; no CVE/audit/SBOM. STUB/PARTIAL.
- **Notifications:** `webhook-notifications.ts` formatter+dispatch, no retry queue. PARTIAL.

## 2. Agent / job / artifact / memory substrate — runtime IMPLEMENTED, agency thin

- **Runtime engine:** `packages/runtime/` (frozen v3.0): BhavyaRuntime SDK (resolve/chain/provenance/permissions/workflows), 19 engines (constitution/event-dispatcher/permission/provenance/traceability/workflow-executor + TS stub-engines), planner (Kahn topo-sort over generated graph), executor/orchestrator, HTTP API (fail-closed key, CORS allowlist), daemon (fs.watch → compile→validate→event-log→history→state, --once for CI). IMPLEMENTED.
- **Build/validate:** `.ai/build/` compile (7 generated files), validate (14 checks), snapshot. IMPLEMENTED.
- **Events:** `BhavyaEvent` envelope + in-process bus (history 1000, retry 3) + daemon JSONL log (12k+ lines, envelope supersedes README spec — spec drift noted) + IOC SQLite variant. IMPLEMENTED.
- **Jobs:** `packages/workflows/src/queue.ts` Job/JobQueue (in-memory, maxConcurrent 3) IMPLEMENTED but unlinked to `.ai/tasks` DAG (static, PARTIAL) and planner. No worker assignment/retries/persistence.
- **Agents:** `.ai/agents/` 9 role profiles DOC-ONLY; `agent-engine` loads .md files but never registry.yaml, capabilities/permissions always empty (STUB); `agent-platform` real HTTP adapters (OmniRoute/Crawl4AI/Qdrant/Supabase/N8n) all env-gated, no in-repo daemon (PARTIAL).
- **Artifacts:** `Artifact` type canonical in shared/types + pervasive use; provenance via ProvenanceEngine; NO central artifact store, NO versioning, NO review lifecycle. Type-level only.
- **Approvals:** `bee` ApprovalEngine (request/approve/deny, in-memory, 5min default) exists but unwired to tasks/planner. Narrow implementation, no global gate.
- **Sessions:** auth sessions only; agent sessions exist solely as event types. No session store.
- **Memory:** MemoryEngine file-backend only (sqlite/qdrant accepted-but-ignored), no persistence on set(), substring search. PARTIAL.
- **Domain runtimes:** mission/learning/project/impact runtimes IMPLEMENTED as libraries (no daemons) — experiment→reflection→portfolio, milestones+evidence, problem→evidence→open-source-path.
- **Contracts:** agents/runtime/mission-runtime/events CONTRACT.md frozen v1.0.0 — DOC-ONLY specs.

## 3. UI / auth / nav / events surface — REAL internal OS shell

- **`/os/*` (~50 routes):** institutional home, admin (users/audit/content/releases + JSON APIs), governance, knowledge+evidence, forest, github (+local repo state), ioc (dashboard/actions/events/health/okr/risks/reviews), memory, runtime, observability, search, social, student/volunteer/donor/trustee workspaces — REAL with EmptyState fallbacks. STUBS: api-explorer (static catalog), bin (hardcoded pipeline), docs hub (hardcoded counts), videos (all —).
- **Auth:** 11 roles, route-policy map, session-cookie server auth, CSRF/CSP/HSTS/noindex middleware, self-assignable onboarding roles only. IMPLEMENTED. Known gap: unknown-path fallback permissive.
- **Platform UI:** 21 components incl. StatCard/DataTable/Badge/StatusBadge/Skeleton/LoadingState/EmptyState/ErrorState. IMPLEMENTED canon.
- **Nav:** `navigation-registry.json` v2.2.0 canonical (public/app/os layers, role-filtered) + OsSidebar. IMPLEMENTED.
- **MCP (names only):** context7, gh_grep, github, vercel, playwright, cloudflare×4. Plugin: superpowers. Agents: bhavya/build/plan. 12 bhavya skills present.

## 4. What this means for Mission Control

EXISTS and reusable: intelligence pipeline, runtime+daemon+events, /os shell + auth + nav + platform-ui, RBAC, audit repositories, approval engine (narrow), job queue (narrow), artifact types, contracts.
MISSING (must be designed/built): artifact store+versioning+review lifecycle, global approval gates, agent session store, persisted jobs with retries, evidence inspector UX, graph UI, human-takeover mechanics.
MUST NOT be rebuilt: second knowledge graph, second workflow engine, second database, second auth, observability stack.
