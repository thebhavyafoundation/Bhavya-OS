# Runtime Loader

Deterministic file loading with context layers and budget enforcement.

## Context Layers
- L0: Always loaded (bootstrap, runtime.json)
- L1: Overview (index, summary, map)
- L2: Detail (architecture, design, standards)
- L3: Task-specific (context-loader routes)

## Budget Enforcement
- Planning: 6 files max
- Coding: 8 files max
- Documentation: 5 files max
- Release: 4 files max
- Review: 6 files max

Stop loading once budget is consumed.
