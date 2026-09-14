---
name: bhavya-reasons-canvas
version: 1.0.0
description: Generate REASONS Canvas design contracts for Bhavya Foundation. Use when creating structured design artifacts for substantial features, architectural changes, or cross-module work. Integrates OpenSPDD methodology into ICM workflow.
triggers:
  - reasons canvas
  - design contract
  - spdd
  - structured design
  - create canvas
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
  - WebSearch
---

# Bhavya Reasons Canvas

Generate REASONS Canvas design contracts that capture enough information for OpenCode to implement without unnecessary guessing. The Canvas is an ICM-native artifact living in `specs/`.

## When to Use

- Substantial features (multi-file, multi-package)
- Architectural changes
- Cross-module changes
- Security-sensitive changes
- Storage or workflow changes
- Deployment changes

## When NOT to Use

- Bug fixes (use standard fix workflow)
- Small UI changes (use `bhavya-spec` standard format)
- Small refactors (use standard refactor workflow)
- Localized work

## Workflow

### Step 1: Determine Canvas Scope

Ask the user:
1. What is the feature/change?
2. How many files/packages are affected?
3. Is this architectural or localized?

If substantial (3+ files, cross-module, architectural) -> proceed with full REASONS Canvas.
If localized (1-2 files, same module) -> use `bhavya-spec` standard format instead.

### Step 2: Inspect Repository

Before writing the canvas, inspect:
1. `contracts/` for relevant package contracts
2. `standards/` for relevant engineering standards
3. `docs/adr/` for relevant architecture decisions
4. `CONTEXT.md` for routing to existing implementations
5. `bar/` for existing capabilities that could be reused
6. Actual source code in relevant packages

### Step 3: Generate Canvas

Copy `_templates/reasons-canvas.md` to `specs/{feature-slug}-reasons-canvas.md`.

Fill all seven dimensions:

**R - Requirements:**
- Business context (why this exists)
- Scope (IN/OUT)
- Success criteria
- Constraints (technical, business, governance, design)

**E - Entities:**
- Domain model (Mermaid class diagrams)
- Entity definitions table
- Relationships

**A - Approach:**
- Strategy (sync vs async, patterns)
- Trade-offs table
- Architecture impact

**S - Structure:**
- File layout
- Dependencies table
- Interfaces (TypeScript signatures)

**O - Operations:**
- Precise implementation steps in order
- Each step: responsibility, location, dependencies, input, output, error handling
- Execution order diagram

**N - Norms:**
- Code standards (reference `standards/`)
- Design standards (reference `packages/platform-ui/`)
- Bhavya-specific norms

**S - Safeguards:**
- Hard constraints (must not violate)
- Scope boundaries
- Quality boundaries
- Anti-slop check (Tier 2 rules)

### Step 4: Human Review

Present the canvas to the user for review. Key questions:
1. Are the requirements accurate?
2. Is the approach correct?
3. Are the safeguards complete?
4. Is the scope right?

### Step 5: Save and Link

Save the canvas to `specs/{feature-slug}-reasons-canvas.md`.

Update task references:
- If task has a TASK-ID, update `.ai/tasks/contracts/TASK-NNN.json` to reference the canvas
- If related to an RFC, update the RFC status

## Canvas Modes

### Lightweight Mode

For changes that are borderline (some complexity but not full architectural):

Fill only:
- R (Requirements) - always required
- O (Operations) - always required
- S (Safeguards) - always required

Skip E, A, N if not needed. Add a note at the top: "Lightweight canvas."

### Full Mode

For substantial features: fill all seven dimensions.

## Drift Detection

After implementation, compare canvas against actual code:

1. For each Operation step, verify the described file exists and matches
2. For each Safeguard, verify it was not violated
3. For each Structure file, verify it was created/modified as described
4. Record status: MATCH or DRIFT for each item

If drift detected: investigate discrepancy. The canvas is NOT authority over source code. If the implementation improved on the canvas design, update the canvas to match reality.

## Integration with Bhavya Skills

This skill **complements** (does not replace):
- `bhavya-spec` — standard specification (for simpler changes)
- `bhavya-architecture` — repository inspection
- `bhavya-design-system` — design norms
- `bhavya-review` — code review
- `bhavya-production-verification` — production readiness
- AntiSlop — code quality gates

## Quality Guardrails

- Canvas must reference real repository architecture (no assumptions)
- Every Safeguard must have a concrete verification method
- Every Operation must specify exact file paths
- Every Constraint must cite its source
- No fabricated data, no invented APIs
- Follow AntiSlop Tier 2 rules

## Output Location

| Artifact | Location |
|----------|----------|
| Canvas template | `_templates/reasons-canvas.md` |
| Canvas example | `specs/examples/reasons-canvas-example.md` |
| Generated canvas | `specs/{feature-slug}-reasons-canvas.md` |
| Task reference | `.ai/tasks/contracts/TASK-NNN.json` |
