# Research Workspace

**Last Updated:** 2026-07-30
**Current Goal:** Transform topic requests into structured research briefs
**Known Constraints:** No internet required. Use local references when possible.
**Open Questions:** How to handle contradictory sources?
**Recent Decisions:** Use JSON for knowledge objects, not markdown
**Next Review:** 2026-08-15

## Context

**Audience:** Curriculum developers, teachers
**Input:** Topic request from user
**Output:** Research brief with key points, sources, local relevance

## Stages

### 01_topic_brief
- Read user request
- Define scope and questions
- Output: `output/brief.md`

### 02_source_collection
- Gather from references/ folder
- Document sources with citations
- Output: `output/sources.md`

### 03_synthesis
- Combine into structured brief
- Identify key concepts, misconceptions, local examples
- Output: `output/research-brief.md`

## References (Layer 3)

- `references/` — Local reference files
- `../../_config/voice.md` — Voice rules
- `../../knowledge/` — Existing knowledge objects

## Output Format

```json
{
  "topic": "...",
  "keyPoints": [...],
  "sources": [...],
  "misconceptions": [...],
  "localRelevance": "...",
  "prerequisites": [...]
}
```
