# REASONS Canvas Guide

**For Stage 02: Specification — How to fill the REASONS Canvas.**

---

## Canvas Structure (7 Dimensions)

### R — Requirements

- **Business Context**: Why this exists, what problem it solves, who benefits
- **Scope**: IN (what's included) / OUT (explicitly excluded)
- **Success Criteria**: Checklist of measurable outcomes
- **Constraints**: Table with Type (Technical/Business/Governance/Design), Constraint, Source

### E — Entities

- **Mermaid class diagram** — Domain model visualization
- **Entity definitions table** — Entity, Purpose, Key Fields, Relationships

### A — Approach

- **Strategy** — High-level approach (sync/async, patterns)
- **Trade-offs** — Decision, Chosen, Rejected, Reason table
- **Architecture Impact** — Packages, routes, contracts, database changes

### S — Structure

- **File Layout** — Directory tree with purpose comments
- **Dependencies** — Component, Depends On, Type (import/runtime/data) table
- **Interfaces** — TypeScript signatures for new/modified interfaces

### O — Operations

- **Numbered steps** — Each: Responsibility, Location, Dependencies, Input, Output, Error handling
- **Execution Order** — Text diagram showing dependencies

### N — Norms

- **Code Standards** — References to standards/, CONTRACT.md, patterns
- **Design Standards** — platform-ui tokens, brand palette, typography
- **Bhavya-Specific Norms** — No purple gradients, no fabricated data, etc.

### S — Safeguards

- **Hard Constraints** — Must not violate (negative space)
- **Scope Boundaries** — What not to touch
- **Quality Boundaries** — No weakened types, no swallowed errors, etc.
- **Anti-Slop Check** — Tier 2 rules verification

---

## Filling Process

### 1. Start with Requirements (R)

- Copy business context from discovery report
- Define IN/OUT explicitly — prevents scope creep
- Make success criteria measurable
- Every constraint must cite a source document

### 2. Model Entities (E)

- Use Mermaid classDiagram syntax
- Include only entities relevant to this feature
- Link to DOMAIN_OWNERSHIP.md for canonical entities

### 3. Define Approach (A)

- State strategy in 1-2 sentences
- Trade-offs table: at least 2 options per major decision
- Architecture impact: be specific about packages/routes/contracts

### 4. Detail Structure (S)

- File layout: use tree notation with `# purpose` comments
- Dependencies: distinguish import vs runtime vs data
- Interfaces: real TypeScript, not pseudocode

### 5. Specify Operations (O)

- One step per logical unit
- Location = exact file path
- Dependencies = what must exist before this step
- Error handling = concrete, not "handle errors"

### 6. State Norms (N)

- Reference existing standards, don't restate
- Bhavya norms are fixed — copy from template

### 7. Define Safeguards (S)

- Hard constraints = architectural invariants
- Scope boundaries = prevent scope creep
- Quality boundaries = code quality floor
- Anti-slop = copy Tier 2 rules from template

---

## Checkpoint Protocol

**After drafting all 7 dimensions:**

1. Present complete canvas to human
2. Human chooses: Approve / Request changes / Reject
3. If changes: note which dimensions, iterate
4. If approved: status → `in-progress` (or `implemented` if just docs)

---

## Quality Checklist (Pre-Checkpoint)

- [ ] All 7 dimensions filled
- [ ] No `{{PLACEHOLDERS}}`
- [ ] Constraints cite real sources
- [ ] Entities match discovery report
- [ ] Trade-offs have ≥2 options
- [ ] Interfaces are valid TypeScript
- [ ] Operations are sequential where dependent
- [ ] Safeguards have unambiguous pass conditions
- [ ] Anti-slop Tier 2 all checked
- [ ] Frontmatter complete

---

## Common Mistakes

| Mistake                          | Fix                                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| Vague success criteria           | Make measurable: "pnpm build succeeds" not "builds work"            |
| Missing constraint sources       | Every constraint row needs Source column filled                     |
| Entities not in DOMAIN_OWNERSHIP | Add to DOMAIN_OWNERSHIP.md first, then reference                    |
| Operations too granular          | One step per logical unit, not per file                             |
| Safeguards not verifiable        | "No duplicate types" → "grep -r 'type X' finds only @bhavya/shared" |

---

## Template Location

- `_templates/reasons-canvas.md` — Full template
- `specs/examples/reasons-canvas-example.md` — Reference example
- `skills/bhavya-reasons-canvas/SKILL.md` — Methodology
