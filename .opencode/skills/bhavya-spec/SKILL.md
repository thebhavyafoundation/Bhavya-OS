---
name: bhavya-spec
version: 1.0.0
description: Structured specification development for Bhavya OS. Adapted from gstack /spec.
triggers:
  - create a spec
  - write a spec
  - specification
  - define this feature
allowed-tools:
  - Read
  - Write
  - Grep
  - Glob
  - AskUserQuestion
  - WebSearch
---

# Bhavya Spec — Structured Specification

## Overview

Turn vague intent into a precise, executable specification through structured interrogation. Specs are contracts that define what to build, not how to build it.

## Phases

### Phase 1: Intent Capture

1. What is the user trying to accomplish?
2. What problem does this solve?
3. Who is the user/beneficiary?
4. What is the success criteria?

### Phase 2: Constraint Identification

1. What are the technical constraints? (architecture, contracts, standards)
2. What are the business constraints? (budget, timeline, resources)
3. What are the governance constraints? (policies, compliance, approval)
4. What are the design constraints? (brand, accessibility, responsive)

### Phase 3: Scope Definition

1. What is IN scope?
2. What is OUT of scope?
3. What are the dependencies?
4. What are the risks?

### Phase 4: Artifact Specification

For each deliverable:
1. What is it? (description)
2. What does it contain? (fields, sections, components)
3. Where does it live? (file path, route, package)
4. How is it validated? (tests, schema, contract)

### Phase 5: Acceptance Criteria

For each deliverable:
1. How do we know it's done?
2. How do we know it works?
3. How do we know it's correct?
4. How do we know it's safe?

## Output Format

### Standard Specification

```markdown
# Specification: [feature name]

## Intent
[What the user is trying to accomplish]

## Problem
[What problem this solves]

## Users
[Who benefits]

## Constraints
### Technical
- [constraint 1]
- [constraint 2]

### Business
- [constraint 1]

### Governance
- [constraint 1]

### Design
- [constraint 1]

## Scope
### IN
- [item 1]

### OUT
- [item 1]

### Dependencies
- [dependency 1]

### Risks
- [risk 1]

## Deliverables
### [Deliverable 1]
- Description: [what it is]
- Contents: [what it contains]
- Location: [where it lives]
- Validation: [how it's validated]

## Acceptance Criteria
- [ ] [criterion 1]
- [ ] [criterion 2]

## Architecture Notes
[Any relevant architecture decisions, contracts, or standards]
```

### REASONS Canvas Format (Optional)

For substantial features, architectural changes, or cross-module work, output a REASONS Canvas instead. Copy `_templates/reasons-canvas.md` to `specs/{feature-slug}-reasons-canvas.md` and fill all seven dimensions:

- **R** — Requirements (why, scope, success criteria, constraints)
- **E** — Entities (domain model, Mermaid diagrams)
- **A** — Approach (strategy, trade-offs, architecture impact)
- **S** — Structure (file layout, dependencies, interfaces)
- **O** — Operations (precise implementation steps in order)
- **N** — Norms (coding standards, design standards, Bhavya-specific rules)
- **S** — Safeguards (what NOT to do, scope boundaries, anti-slop check)

**When to use REASONS Canvas:**
- Substantial features (multi-file, multi-package)
- Architectural changes
- Cross-module changes
- Security-sensitive changes
- Storage or workflow changes

**When standard spec is sufficient:**
- Bug fixes
- Small UI changes
- Small refactors
- Localized work

See `specs/examples/reasons-canvas-example.md` for a complete example.
See `_templates/reasons-canvas.md` for the blank template.

## Bhavya-Specific Rules

1. Always check `contracts/` for relevant package contracts
2. Always check `standards/` for relevant engineering standards
3. Always check `docs/adr/` for relevant architecture decisions
4. Always check `CONTEXT.md` for routing to existing implementations
5. Always check `bar/` for existing capabilities that could be reused
