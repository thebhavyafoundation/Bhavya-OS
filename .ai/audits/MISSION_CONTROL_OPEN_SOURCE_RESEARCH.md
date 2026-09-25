# Mission Control — Open-Source Research (2026-09-18, time-boxed)

Method: GitHub repo search + web research, read-only, no installs. Disposition vocabulary: ADOPT/ADAPT/COMPOSE/WRAP/FORK/DISTILL/WATCH/REJECT. No rankings.

## Graph UI

- **xyflow/xyflow** (github.com/xyflow/xyflow) — React Flow + Svelte Flow node UIs. 38k stars, 2.5k forks, updated 2026-09-18, TypeScript, MIT (as widely published; re-verify license file before use). Zero backend, runs anywhere incl. i5/8GB/Windows/offline. Overlap: none in Bhavya (no graph UI exists). Fit: exact match for Mission Control repository/architecture/route/evidence graphs inside existing Next.js app. **→ COMPOSE** (npm dep later, not this phase).
- Jalez/react-flow-automated-layout, avinkrisv/egui-xyflow — niche complements. **→ WATCH.**

## Approval / human-in-the-loop

- **sajanyerra/Human-In-The-Loop** (MIT, FastAPI+Next.js+SQLite, 0 stars, 5 commits, 2026-05) — approval inbox, risk levels, audit trail, idempotent decisions, callbacks. Concepts match Bhavya's approval need exactly; codebase too young/small to adopt. **→ DISTILL** (inbox + idempotency + audit-trail patterns into Bhavya-native approval engine).
- **kdowswell/hitl-ui** — React HITL components + agent-instruction pattern. **→ DISTILL** (instruction-file pattern).
- **in-the-loop-labs/pair-review** — local-first PR-style review UI supporting OpenCode, git-worktree review, markdown feedback export. **→ DISTILL** (review UX: diff view + structured feedback + approve-with-comment).
- AnPod/human-in-loop-approval (MIT, Telegram approvals, AutoGen) — Telegram-first, wrong surface. **→ REJECT** (record pattern only).
- Permit.io MCP Gateway HITL, Microsoft AG-UI approval interrupts, Inngest `waitForEvent`, Letta HITL — commercial or framework-coupled. **→ REJECT** (note interrupt/resume + `always_require/conditional` policy vocabulary as DISTILL-worthy concepts).

## Agent observability

- **agent-obs** (npm `agent-obs`, MCP self-reporting: `start_session`/`log_tool_call`/`end_session`, local SQLite `~/.agent-observability/`, dashboard :9400, explicit OpenCode support). Closest architectural fit to Bhavya's event model (tool-call log ≈ BhavyaEvent). **→ DISTILL** (self-reporting envelope + session grading concepts); verify repo/license before any code reuse.
- **Klepsiphron/agenttrace** (MIT, SQLite local-first, zero-cloud, CLI wrap). Same verdict. **→ DISTILL/WATCH.**
- **srathish/agent-trace-dashboard** (MIT, span tree + cost + zero-dep dashboard). **→ DISTILL** (span-tree + cost-roll-up shapes).
- agentic-layer/observability-dashboard (Apache-2.0, OTel→WebSocket) — needs Docker/K8s. **→ REJECT** for local; DISTILL span→event transformation concept.
- OpenObserve (AGPL-3.0), Grafana Cloud, Datadog — paid/cloud/heavy and/or copyleft. **→ REJECT.**
- PxA-Labs/AgentsScope, liam-ringstad/AgentTrace — 0-star, thin evidence. **→ WATCH.**

## Offline learning / content packaging

- **learningequality/kolibri** (Python, offline-first, active, 1.1k stars) — the reference architecture for Bhavya's future Offline Learning App (content packaging + sneakernet sync + local progress). Whole-platform adoption is out of scope and stack-mismatched. **→ DISTILL** (channel/packaging + offline-progress concepts), WATCH for interop.
- H5P ecosystem — NOT verified in this pass (only an unrelated 0-star TS alternative surfaced). **→ WATCH** (verify later; do not claim).
- intellectif/learning-kit (0 stars, 2026-05, "TS alternative to H5P", xAPI) — too early. **→ WATCH.**

## Skill ecosystem

- obra/superpowers (already integrated via plugin; 13 skills live) — ADOPTED already. No wholesale external skill pack justified. Doctrine stands: External Skill → Study → Extract methodology → Bhavya-native adaptation. No new skill created this phase (gap analysis covers whether the 5 proposed skills are needed — verdict below).

## Cross-cutting verdicts

- Nothing researched warrants ADOPT/FORK now. Highest-value moves are all DISTILL/COMPOSE later: xyflow graphs, HITL inbox/audit patterns, agent-obs-style self-report envelopes, Kolibri offline-packaging concepts.
- Zero-cost posture holds: every DISTILL target is MIT/Apache, dependency-light or concept-only; no paid API, no Docker/K8s, no new database required.
