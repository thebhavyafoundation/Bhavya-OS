# AI Runtime Memory

This file tracks the current session's memory across interactions.

## Session

- **Start**: 2026-07-23
- **Objective**: Create `.ai/` AI operating system
- **Agent**: Engineering Agent

## Files Created

| File | Status | Purpose |
|------|--------|---------|
| `.ai/bootstrap.md` | ✓ | Master system prompt |
| `.ai/runtime.json` | ✓ | Single state file |
| `.ai/index.yaml` | ✓ | Deterministic lookup index |
| `.ai/retrieval.md` | ✓ | Retrieval rules & layers |
| `.ai/validation.md` | ✓ | Definition of done |
| `.ai/dependencies.yaml` | ✓ | Machine-readable deps |
| `.ai/manifest.yaml` | ✓ | Single source of truth |
| `.ai/project-summary.md` | ✓ | Project overview |
| `.ai/context-loader.md` | ✓ | Dynamic context routing |
| `.ai/repository-map.md` | ✓ | Complete repo map |
| `.ai/architecture.md` | ✓ | High-level architecture |
| `.ai/design-system.md` | ✓ | Design system reference |
| `.ai/coding-standards.md` | ✓ | Coding standards |
| `.ai/glossary.md` | ✓ | Terminology |
| `.ai/dependencies.md` | ✓ | Dependency map |
| `.ai/conventions.md` | ✓ | Repository conventions |
| `.ai/roadmap.md` | ✓ | Release roadmap |
| `.ai/decision-log.md` | ✓ | Architecture decisions |
| `.ai/memory.md` | ✓ | This file |
| `.ai/memory/` (5) | ✓ | Split by domain |
| `.ai/agents/` (10) | ✓ | Agent profiles + registry.yaml |
| `.ai/releases/` (5) | ✓ | Machine-readable YAML |
| `.ai/prompts/` | ✓ | Task prompt directory |
| `.ai/templates/` | ✓ | Task + ADR templates |
| `.ai/cache/` | ✓ | Ephemeral storage |

## Decisions Made

- DEC-001: `.ai/` as deterministic AI Operating System
- DEC-002: Context Loader routing by task domain
- DEC-003: Context Layers (L0-L3) with load budgets
- DEC-004: Entity ID system (APP, PKG, STD, SPEC, REL, DEC, MEM)

## Memory Split

Memory file was split into domain-specific files in `.ai/memory/`:
- `project.md` — project state, apps, releases
- `engineering.md` — stack, packages, patterns
- `governance.md` — ADRs, RFCs, policies, standards
- `ui.md` — design tokens, components, a11y
- `agents.md` — agent roster, profiles, permissions

## Next Steps

1. Commit `.ai/` directory
2. Begin v0.6 Public APIs & Integrations
3. Wire remaining apps to mission-runtime
