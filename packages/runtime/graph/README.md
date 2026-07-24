# Knowledge Graph

Graph-based entity traversal for context retrieval.

## Data
- Nodes: apps, packages, standards, specs, decisions, tasks, releases
- Edges: depends, follows, extends, affects, produced, modifies

## Storage
- Generated: .ai/graph/graph.json (from compile-runtime.mjs)
- Source: registry/knowledge-graph.json

## Retrieval Strategy
Start from the task entity, follow edges to find relevant context.
Prefer shortest path. Stop when budget is consumed.
