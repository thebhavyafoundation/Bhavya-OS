---
id: RUNTIME-018
owner: Architecture
version: 0.5
status: active
canonical: .ai/runtime.json (decisions array)
---

# AI Runtime Decision Log

## 2026-07-23 Establish .ai/ as AI Operating System
**The Decision:** Replace the flat `.ai/` prompt folder with a structured AI operating system containing bootstrap, project summary, context loader, repository map, architecture, current state, standards, glossary, decision log, dependencies, conventions, roadmap, memory, agent profiles, prompts, templates, and cache directories.

**Why it was made:** The repository is large and complex. AI agents need deterministic navigation that minimizes token usage, provides clear context loading rules, and avoids full-repository scanning. A single prompt file was insufficient for institutional-scale operations.

**Alternatives considered:**
- Keeping a single `.ai/INSTRUCTIONS.md` — too flat, no context routing
- Using only `AGENTS.md` — insufficient for multi-agent coordination
- Embedding all knowledge in `memory/` — too much indirection

**Consequences:**
- Every AI agent now has a deterministic loading sequence
- Context is minimized per task via `context-loader.md`
- Agent profiles allow role-specific behavior
- `manifest.yaml` provides a single source of truth for all tools
- The `cache/` directory can store ephemeral agent state
- Future agents can be added by creating new files in `.ai/agents/`

## 2026-07-23 Context Loader Routing Pattern
**The Decision:** Define context routes in `context-loader.md` by task domain (Website, Admin, Docs, Runtime, UI, BDL, Governance, Testing, AI Gateway, Security, Release, New Package).

**Why it was made:** AI agents previously loaded too much context. Each task domain now specifies exactly which files to load.

**Alternatives considered:**
- Automatic context detection via manifest — too fragile
- Loading everything — too expensive

**Consequences:** Agents load minimal context per task. New task domains can be added as the platform grows.
