---
id: RUNTIME-014
owner: Release
version: 3.0
status: certified
canonical: .ai/runtime.json
---

# Current Release

## Release
v3.0 — Autonomous Execution (Runtime Freeze)

## Status
Certified — Stable

## Objective
Autonomous AI runtime with deterministic context loading, knowledge graph, dependency graph, planner, executor, orchestrator, CLI, API, metrics, and event bus. Runtime is now frozen — no further feature additions. All future work is application-layer on top of the stable runtime.

## In Scope
- `packages/runtime` — CLI (bhavya), planner, executor, orchestrator, optimizer, API, metrics (v3.0 stable)
- `packages/mission-runtime` — Shared app runtime with auth, permissions, content, navigation, search, audit, documents, media, localization, notifications (v0.5+)
- `packages/sdk` — Public application SDK layer
- `apps/website` — Public foundation website (primary dev target)
- `apps/*` — 8 additional mission applications
- `.ai/tasks/contracts/` — Machine-readable task contracts
- `.ai/snapshots/` — Reproducible runtime snapshots

## Out of Scope
- Runtime feature additions (frozen at v3.0)
- Volunteer Portal — Future app milestone
- Forest GIS — Future app milestone
- Heritage & Culture — Future app milestone
- Digital Library — Future app milestone

## Release Artifacts
- `.ai/snapshots/runtime-v3.0.snapshot.json` — Full runtime snapshot
- `packages/runtime/cli/bhavya.mjs` — Unified CLI (20+ commands)
- `.ai/tasks/contracts/TASK-002..006.json` — 5 task contracts
- `navigation/public.json` — Public navigation registry
- `registry/apps.json` — 9 app manifests
- `registry/knowledge-graph.json` — 16-node knowledge graph
