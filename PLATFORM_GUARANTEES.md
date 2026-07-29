# Platform Guarantees

These are the architectural promises that every contributor to the Bhavya Foundation platform must understand and respect. They are the principles that make the system coherent as it grows.

**Version:** 3.0.0  
**Status:** Frozen  
**Rationale:** The architecture has reached a point where the cost of changing core contracts exceeds the cost of adding features. These guarantees are architectural invariants, not implementation details.

---

## Canonical Records

**content-core remains the single source of truth.**

- No parallel data models exist outside content-core.
- All institutional data flows through one canonical pipeline.
- Filesystem (JSON/Markdown) is the authoritative storage layer.
- Git-versioned history provides auditability.

```
Mission Apps → content-core → Knowledge → Intelligence → Presentation
```

## Layered Dependencies

**Dependencies flow upward only.**

- Higher layers consume lower-layer outputs.
- Higher layers never mutate lower-layer state directly.
- No circular dependencies.
- No reverse imports.

```
Mission Apps → content-core → Knowledge → Intelligence → Presentation
     ↑              ↑            ↑           ↑              ↑
  Creates      Stores       Exposes     Derives       Displays
  domain data  canonical    data via    insights      to users
               records      APIs        (read-only)
```

## Domain Isolation

**Mission applications operate independently.**

- Research, Forest, Heritage, Volunteer do not import from each other.
- They share only: core models, I/O utilities, publishing contract.
- Cross-domain queries go through Knowledge, not direct imports.
- New mission apps follow the same pattern.

## Evidence Before Insight

**Every insight references supporting evidence.**

- Intelligence capabilities return `Insight<T>` with evidence array.
- Evidence includes source references and verification status.
- No insight is presented without traceable evidence.
- Confidence scores reflect data quality and evidence strength.

```typescript
interface Insight<T> {
  id: string;
  title: string;
  description: string;
  confidence: number;      // 0-1 based on data quality
  evidence: Evidence[];    // Supporting sources
  generatedAt: string;     // ISO timestamp
  data: T;                 // Typed payload
}
```

## Explainable Predictions

**Every prediction includes supporting context.**

- Supporting evidence
- Contributing patterns
- Confidence level
- Assumptions involved

This maintains the platform's emphasis on transparency and traceability.

```typescript
interface Prediction {
  id: string;
  type: "risk" | "opportunity" | "forecast" | "anomaly";
  title: string;
  description: string;
  confidence: number;
  evidenceCount: number;
  sources: string[];
  timeframe: "immediate" | "short-term" | "medium-term" | "long-term";
  severity?: "low" | "medium" | "high" | "critical";
  recommendation: string;
  created: string;
}
```

## Generated Reports

**Reports are reproducible from canonical records.**

- Reports are generated from canonical data, not manually maintained.
- Cross-domain reports aggregate across all six domains.
- Impact reports trace from evidence through outcomes.
- Executive summaries are generated, not hand-written.

## Institutional Memory

**Decision rationale is preserved with decisions.**

- Every significant decision captures: context, rationale, alternatives considered, assumptions, risks, expected outcomes.
- Lessons are recorded after each mission.
- Patterns emerge from accumulated experience.
- Memory is searchable and linked to decisions.

```typescript
interface DecisionContext {
  id: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  assumptions: string[];
  risks: string[];
  expectedOutcomes: string[];
  actualOutcome?: string;
  lessons?: string[];
}
```

## Learning

**Lessons become patterns only after sufficient supporting evidence.**

- Individual lessons are captured from missions.
- Patterns emerge when multiple lessons converge.
- Confidence increases with supporting evidence.
- Learning velocity tracks institutional growth.

```typescript
interface InstitutionalPattern {
  id: string;
  pattern: string;
  description: string;
  confidence: number;
  sampleSize: number;
  successRate: number;
  conditions: string[];
  outcomes: string[];
  domain: string;
}
```

## Playbooks

**Playbooks derive from validated institutional experience.**

- Playbooks are generated from validated lessons and patterns.
- Each playbook provides structured phases and tasks.
- Success criteria are evidence-based.
- Playbooks are versioned and domain-specific.

```typescript
interface Playbook {
  id: string;
  name: string;
  description: string;
  missionType: string;
  domain: string;
  version: string;
  confidence: number;
  sourceCount: number;
  phases: PlaybookPhase[];
  lessons: string[];
  patterns: string[];
  successCriteria: string[];
}
```

## Read-Only Intelligence

**Analytics and insights never modify the underlying data.**

- Intelligence layer derives insights from canonical records.
- No intelligence capability mutates content-core state.
- Dashboards consume existing APIs.
- Reports are generated, not stored.

## Single Publishing Pipeline

**Every mission application publishes through content-core.**

- No app-specific publication paths.
- Consistent content format.
- Single-point indexing.
- Predictable data flow.

```
Mission App → content-core → Knowledge → Library → Website
```

## Applications Are Thin

**Applications own UI and interaction, not data models.**

Applications own:
- UI presentation
- User interaction
- Route handling
- Application-specific workflows

Applications do not own:
- Content models
- Publication logic
- Entity extraction
- Search indexing
- Knowledge graph management

## Breaking Changes Are Deliberate

**Breaking changes to the public API require a major version bump.**

- Within a major version, the API surface is stable.
- Changes are documented in CHANGELOG.md before release.
- Deprecation warnings precede removal.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2025 | Initial platform guarantees |
| 2.0.0 | 2025 | Phase II: Governance operations |
| 3.0.0 | 2026 | Phase III: Institutional learning — frozen architectural invariants |
