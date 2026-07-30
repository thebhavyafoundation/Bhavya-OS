# 60/30/10 Architecture Rule

**BICM Version:** 1.0.0  
**Purpose:** Mandatory resource allocation  

## Rule

Every new feature must be evaluated against this balance:

| Category | Percentage | Components |
|----------|-----------|------------|
| **Infrastructure** | 60% | Filesystem, Schemas, Components, Automation, Rendering, Storage, Validation, Registries |
| **Context** | 30% | Knowledge Graph, Routing, Factories, Contracts, Metadata, Policies, Decision Trees |
| **AI** | 10% | Reasoning, Narration, Translation, Assessment, Planning, Animation Suggestions |

## Enforcement

### Before Adding a Feature

1. **Estimate effort** — How much work is this?
2. **Categorize** — Infrastructure, Context, or AI?
3. **Check balance** — Does this maintain 60/30/10?
4. **Adjust** — If AI > 10%, move work to Context or Infrastructure

### Examples

| Feature | Category | Justification |
|---------|----------|---------------|
| New Knowledge Object | Context (30%) | Adding to knowledge graph |
| New schema | Infrastructure (60%) | Defining structure |
| AI-powered quiz generator | AI (10%) | Using AI for generation |
| Factory pipeline | Context (30%) | Transforming knowledge |
| UI component | Infrastructure (60%) | Building interface |

### Red Flags

- AI handling tasks that should be deterministic
- No schema for new content type
- Hardcoded values instead of registry references
- Decisions not recorded in Layer 7

## Why This Matters

- **60% Infrastructure** — Ensures stability, reusability, offline capability
- **30% Context** — Ensures knowledge is central, traceable, versioned
- **10% AI** — Ensures AI is a tool, not the center

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial 60/30/10 rule |
