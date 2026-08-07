# @bhavya/knowledge-graph — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Exports

### Core Types
- `KnowledgeGraph` — Graph data structure
- `GraphNode` — Entity node (17 types)
- `GraphEdge` — Relationship edge
- `GraphTraversal` — Traversal operations

### Entity Types (17)
- `Person`, `Organization`, `Event`, `Concept`, `Location`
- `Document`, `Artifact`, `Technology`, `Method`, `Theory`
- `Curriculum`, `Course`, `Module`, `Lesson`, `Assessment`
- `Resource`, `Standard`

### Traversal
- `traverse()` — BFS/DFS traversal
- `shortestPath()` — Find shortest path between nodes
- `neighbors()` — Get adjacent nodes
- `connectedComponents()` — Find connected subgraphs

### Validation
- `validateGraph()` — Check graph integrity
- `detectCycles()` — Find circular dependencies
- `validateTypes()` — Type checking

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
