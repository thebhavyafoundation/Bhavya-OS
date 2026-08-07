# Runtime Contract v1.0.0

**Frozen:** 2026-08-07 | **Owner:** Runtime Team | **Stability:** Stable

## Exports

### Engine Pipeline
- `CapabilityEngine` — Resolves capabilities from registry
- `KnowledgePipeline` — Orchestrates KO → lesson → assessment → guide → workbook → visual-spec → video → website
- `CourseManager` — File-based CRUD at `bhavya-ai-lab/data/courses/`
- `LessonManager` — File-based CRUD at `bhavya-ai-lab/data/lessons/`

### Engine Types
- `Capability` — Engine capability definition
- `PipelineStage` — Pipeline stage interface
- `PipelineResult` — Pipeline execution result
- `QualityGate` — Quality gate definition

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Pipeline changes:** Must maintain backward compatibility

## Validation Schema

```json
{
  "type": "object",
  "required": ["engines", "pipelines"],
  "properties": {
    "engines": { "type": "array", "items": { "type": "string" } },
    "pipelines": { "type": "array", "items": { "type": "string" } }
  }
}
```
