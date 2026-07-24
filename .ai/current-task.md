---
id: RUNTIME-014
owner: Engineering
version: 0.5
status: active
canonical: .ai/runtime.json
---

# Current Task — Runtime Daemon (Phase 1)

## Current Goal
Build the autonomous runtime daemon that keeps `.ai/` synchronized automatically. Every source file change triggers compile → validate → emit event → write history → refresh state, without manual `pnpm` commands.

## Priority
High

## Focus
- `packages/runtime/daemon/watch.mjs` — Persistent file watcher
- Zero external dependencies (built-in `fs.watch`)
- 500ms debounce to batch rapid changes
- Automatic compile + validate on any source change
- Event emission to `event-log.jsonl`
- History logging to `.ai/history/YYYY/MM/YYYY-MM-DD.jsonl`
- State refresh on each cycle
- `--once` mode for CI
- Graceful SIGINT/SIGTERM shutdown

## Blocked
None

## Next
- Run `pnpm runtime:daemon` in development for auto-sync
- Build Phase 2 (semantic embeddings for context retrieval)
- Build Phase 8 (repository API for agent queries)

## Completed
- `.ai/` AI runtime v2 (compiler, validator, event bus, state, task graph, knowledge graph, capabilities, summaries, versioning, packages/runtime engine)
- `packages/runtime/daemon/watch.mjs` — autonomous watcher with compile → validate → emit → history → state cycle
- `pnpm runtime:daemon` and `pnpm runtime:daemon:once` scripts
- History directory structure (`.ai/history/2026/07/`)
- Zero external dependencies, graceful shutdown, debounced changes
