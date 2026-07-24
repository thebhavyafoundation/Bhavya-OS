# @bhavya/runtime v3.0 — Stable

Bhavya Runtime is an AI-native software development runtime. It provides deterministic context loading,
knowledge graph, dependency graph, planner, executor, orchestrator, CLI, API, metrics, and event bus.

## Status

**v3.0 — STABLE (Frozen)**

The runtime is frozen at v3.0. No further feature additions will be made. All future development
occurs at the application layer on top of this stable foundation.

## Components

| Component | Description |
|-----------|-------------|
| `cli/bhavya.mjs` | Unified CLI with 20+ commands |
| `cli/planner.mjs` | Goal-to-execution-plan derivation |
| `cli/executor.mjs` | Task contract execution engine |
| `cli/optimizer.mjs` | Scored context file selection |
| `cli/orchestrator.mjs` | Multi-agent work allocation |
| `cli/api.mjs` | Local HTTP API server |
| `cli/instrument.mjs` | Runtime metrics collection |
| `daemon/watch.mjs` | File watcher (Phase 1 daemon) |

## Usage

```bash
pnpm bhavya           # Show all commands
pnpm bhavya:status    # Runtime health
pnpm bhavya:plan      # Build execution plan  
pnpm bhavya:task      # Show next task
pnpm bhavya:api       # Start API server
```

## Release

See [current-release.md](../../.ai/current-release.md) for release details.
Snapshots are stored in `.ai/snapshots/runtime-v3.0.snapshot.json`.
