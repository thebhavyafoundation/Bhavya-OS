---
id: RUNTIME-DAEMON
owner: Engineering
status: active
---

# Runtime Daemon

The daemon (`watch.mjs`) keeps `.ai/` synchronized automatically.

## How It Works

```
Source file change
       ↓
     fs.watch detects change
       ↓
     500ms debounce (batches rapid changes)
       ↓
    1. Compile — regenerates machine files
    2. Validate — checks integrity
    3. Emit — writes event to event-log.jsonl
    4. History — logs to .ai/history/YYYY/MM/YYYY-MM-DD.jsonl
    5. State — refreshes .ai/state/repository.json
```

## Watched Paths

- `config/*.json` — app definitions, ports, environment
- `registry/*.json` — generated package/app/agent registries
- `.ai/agents/` — agent profiles and registry
- `.ai/memory/` — domain memory files
- `.ai/releases/` — release YAML definitions
- `.ai/state/` — repository state
- `.ai/tasks/` — task graph
- `.ai/build/` — compiler and validator scripts
- `apps/*/package.json` — app dependencies
- `packages/*/package.json` — package dependencies (except runtime/)

## Usage

```bash
# Persistent watcher (development)
pnpm runtime:daemon

# Single cycle (CI)
pnpm runtime:daemon:once
```

## Design

- Zero external dependencies (uses built-in `fs.watch`)
- Debounces changes at 500ms to batch rapid edits
- Graceful shutdown on SIGINT/SIGTERM
- Does not watch itself (packages/runtime/ is excluded)
- Writes structured history records for full audit trail
