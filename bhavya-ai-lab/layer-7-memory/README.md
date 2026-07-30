# Layer 7 — Institutional Memory

**BICM Version:** 1.0.0  
**Purpose:** Why things exist  

## Philosophy

Every decision gets recorded. Future contributors understand why something exists, not just what exists.

## Decision Format

Every decision is a JSON file:

```json
{
  "id": "DEC-2026-07-30-architecture",
  "title": "BICM Architecture Adoption",
  "date": "2026-07-30",
  "reviewer": "Bhavya Foundation",
  "decision": "Adopt BICM v1.0 as the architectural framework for Bhavya AI Lab",
  "reason": "Need institutional memory, knowledge objects, and universal compiler",
  "alternatives": [
    {
      "name": "Keep ICM",
      "reason": "Simpler, already implemented",
      "rejectedBecause": "Lacks institutional memory and factory pattern"
    },
    {
      "name": "Custom framework",
      "reason": "More control",
      "rejectedBecause": "Reinventing the wheel"
    }
  ],
  "outcome": "BICM v1.0 adopted",
  "impact": "Full architecture rebuild required",
  "dependencies": [],
  "status": "accepted"
}
```

## Changelog Format

```json
{
  "version": "1.0.0",
  "date": "2026-07-30",
  "author": "Bhavya Foundation",
  "changes": [
    {
      "type": "added",
      "description": "Initial BICM architecture",
      "files": ["layer-0-identity/", "layer-1-mission/", "..."]
    }
  ],
  "breakingChanges": [],
  "migrationNotes": "Fresh start — no migration needed"
}
```

## Audit Format

```json
{
  "timestamp": "2026-07-30T10:00:00Z",
  "actor": "human",
  "action": "created",
  "target": "layer-3-knowledge/objects/ai/ko-ai-what-is-ai.json",
  "metadata": {
    "reason": "Initial knowledge object creation",
    "reviewed": true
  }
}
```

## Memory Rules

1. **Complete** — Every significant decision recorded
2. **Accessible** — Human-readable, machine-parseable
3. **Searchable** — By date, author, topic, impact
4. **Immutable** — Past records never modified, only appended

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial memory layer |
