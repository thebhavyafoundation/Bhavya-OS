---
id: RUNTIME-008
owner: Documentation
version: 0.5
status: active
depends: []
related:
  - STD-007
---

# Bhavya Foundation Glossary

### ADR
Architecture Decision Record. Immutable record of architectural decisions, stored in `governance/adr/`.

### AI Gateway
Provider-agnostic abstraction layer for LLM access. Defined in RFC-0003 and ADR-0002.

### BDL
Bhavya Design Language. The complete design system: tokens, primitives, icons, charts, maps, motion in `packages/bdl/`.

### BDX
Bhavya Developer Experience. CLI tools, generators, validators, codemods in `packages/bdx/`.

### Bhavya OS
The digital operating system powering Bhavya Foundation — a monorepo of apps, packages, standards, and infrastructure.

### Deterministic Registry
Generated registry files (`registry/*.json`) produced by `scripts/generate-registry.js`. Never edited manually.

### Domain Memory
Memory system in `memory/` where each domain (agents, decisions, knowledge, projects, releases, research, tasks) owns its subdirectory with `_meta.json`.

### Gateway Client
Runtime client for AI gateway interactions. Part of `@bhavya/mission-runtime`.

### Knowledge Graph
Graph of all institutional knowledge nodes (ADRs, RFCs, standards, releases, agents) in `registry/knowledge-graph.json`.

### Mission Runtime
`packages/mission-runtime/` — shared runtime providing gateway, registry, memory, events, metadata, accessibility, and observability.

### Release Snapshot
Versioned, immutable snapshots in `foundation-snapshot-v*/` directories. Each includes RELEASE.md, MANIFEST.json, and CHANGELOG.md.

### RFC
Request for Comments. Proposal documents for significant changes. Stored in `rfcs/`.

### Schema
JSON Schema validation files in `schemas/`. Define contracts for registry, events, agents, memory, workflow, search index, knowledge graph.

### Service Registry
`registry/services.json` — registered platform services with status, endpoint, and health information.
