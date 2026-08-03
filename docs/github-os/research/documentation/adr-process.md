# ADR Process — Knowledge Package

## Executive Summary

Architecture Decision Records (ADRs) capture a single design decision and its rationale in a lightweight markdown file stored close to the code. Popularized by Michael Nygard in 2011, ADRs have been adopted by hundreds of projects including IBM Watson, Microsoft, AWS, and the Rust ecosystem. This package documents ADR templates, processes, and real-world adoption patterns for use in the GitHub OS project.

## Patterns Found

### Pattern 1: The Nygard Format (Most Popular)

The original and most widely adopted ADR format. Simple, focused on the decision.

```markdown
# {short title, representative of solved problem and found solution}

## Status

{proposed | accepted | deprecated | superseded by [ADR-0005](0005-example.md)}

## Context and Problem Statement

{Describe the context and problem statement}

## Decision Drivers

- {decision driver 1}
- {decision driver 2}

## Considered Options

- {title of option 1}
- {title of option 2}
- {title of option 3}

## Decision Outcome

Chosen option: "{title of option 1}", because {justification}.

### Consequences

- Good, because {positive consequence}
- Bad, because {negative consequence}
```

### Pattern 2: MADR (Markdown Any Decision Records)

More detailed template emphasizing options and their pros/cons. Includes a "Confirmation" section for validation.

### Pattern 3: Decision = Immutable, File = Append-Only

ADRs are numbered sequentially and monotonically. Numbers are never reused. When a decision is reversed, the old ADR is kept but marked as "superseded" with a reference to the replacement.

### Pattern 4: ADRs Stored with Code

Keep ADRs in the project repository under `doc/arch/adr-NNN.md`. Since they live in version control, they're reviewed through the same pull request workflow as code.

### Pattern 5: Two-Tier Decision Documentation

- **Solution Design** — RFC-style exploration documents for investigating options
- **ADR** — Final decision record with context, decision, and consequences

This workflow (explore with Solution Designs, document decisions with ADRs) ensures thoughtful architecture evolution.

## Best Practices

1. **Keep it short.** One or two pages maximum. Write as if having a conversation with a future developer. Use full sentences, not bullet fragments.

2. **One ADR = one decision.** Don't cram multiple decisions into one record. Each should affect how the rest of the project runs.

3. **Use active voice.** "We will..." not "It was decided that..." This makes decisions clear and accountable.

4. **Store with the code.** ADRs in the same repo as the code they document stay in sync. GitHub renders markdown automatically, so they look as friendly as wiki pages.

5. **Number sequentially.** Never reuse numbers. Use `adr-tools` CLI for consistent management.

6. **Include consequences.** All consequences — positive, negative, and neutral. A decision's consequences become the context for subsequent ADRs.

7. **Start with a pilot.** Begin with 3-5 significant decisions, then expand. Not every decision needs an ADR.

8. **Make it a PR workflow.** ADRs go through the same review process as code. This ensures team buy-in and catches blind spots.

9. **Include a "Confirmation" section.** Describe how the implementation can be validated. This bridges the gap between decision and reality.

10. **Keep the template accessible.** Store the template in the repo so anyone can create a new ADR without hunting for the format.

## Templates

### Full ADR Template (MADR-Inspired)

```markdown
# ADR-{NUMBER}: {Title}

## Status

{Proposed | Accepted | Deprecated | Superseded}

## Date

{YYYY-MM-DD}

## Context and Problem Statement

{Describe the context and problem statement. What forces are at play?
Include technological, political, social, and project-local factors.
These forces are probably in tension.}

## Decision Drivers

- {decision driver 1 — a force, facing concern, or constraint}
- {decision driver 2}
- ...

## Considered Options

- {title of option 1}
- {title of option 2}
- {title of option 3}
- ...

## Decision Outcome

Chosen option: "{title}", because {justification. e.g., only option
which meets k.o. criterion | resolves force | comes out best}.

### Consequences

- Good, because {positive consequence}
- Bad, because {negative consequence}
- Neutral, because {neutral consequence}

### Confirmation

{How will we verify the decision was implemented correctly?
What fitness functions or tests apply?}

## Pros and Cons of the Options

### {Option 1}

{example | description | pointer to more information}

- Good, because {argument a}
- Good, because {argument b}
- Neutral, because {argument c}
- Bad, because {argument d}

### {Option 2}

{example | description | pointer to more information}

- Good, because {argument a}
- Bad, because {argument b}

## More Information

{Additional evidence, team agreement, links to related decisions,
or timeline for when this should be revisited.}

## Related ADRs

- [ADR-XXX] {title} — {relationship}
```

### Minimal ADR Template (Nygard)

```markdown
# {NUMBER}. {Title}

## Status

{proposed | accepted | deprecated | superseded}

## Context

{Describe the forces at play — technological, political, social,
project-local. These forces are in tension. Value-neutral language.}

## Decision

{Response to the forces. Full sentences, active voice. "We will..."}

## Consequences

{Resulting context after applying the decision. All consequences.}
```

## Anti-Patterns

1. **Not every decision needs an ADR.** Style preferences, minor implementation choices, and routine bug fixes don't warrant ADRs. Reserve them for architecturally significant decisions.

2. **Don't use ADRs for design guidelines or API specs.** Create separate document types for guidelines and specifications.

3. **Avoid bullet fragments.** Use full sentences organized into paragraphs. "Bullets kill people, even PowerPoint bullets." — Michael Nygard

4. **Don't bury ADRs in a wiki.** They must live with the code. Separate documentation silos lose context.

5. **Don't number with dates.** Sequential numbers are simpler and avoid confusion about when a decision was actually made vs. when it was documented.

6. **Don't skip the "Considered Options" section.** The alternatives considered are as important as the decision itself. Future developers need to know what was rejected and why.

## Reusable Ideas for GitHub OS

1. **Start with 5 foundational ADRs:**
   - ADR-0001: Record Architecture Decisions (meta-ADR)
   - ADR-0002: Use Monorepo Structure
   - ADR-0003: Choose TypeScript as Primary Language
   - ADR-0004: Use Mermaid for Diagrams
   - ADR-0005: Follow Conventional Commits

2. **Use MADR template for consistency.** It's more detailed than Nygard but still lightweight.

3. **Store ADRs at `docs/architecture/decisions/`.** Co-located with other architecture documentation.

4. **Require ADRs for:**
   - Language or framework choices
   - Database or storage decisions
   - API design patterns
   - Security architecture
   - Deployment strategy

5. **Don't require ADRs for:**
   - Code style (use linters)
   - Bug fixes
   - Documentation updates
   - Test additions

6. **Use `adr-tools` CLI for management.** Consistent numbering, easy superseding.

## Evidence

- **Source:** https://github.com/adr/madr, https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions, https://adr.github.io/, https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/, https://keeling.dev/essays/distribute-design-authority-with-architecture-decision-records/
- **Date collected:** 2026-08-03
- **Why it matters:** ADRs prevent architecture entropy by capturing the "why" behind decisions, enabling new team members to understand context without tribal knowledge.
- **Trade-offs:** Lightweight (just markdown files) but requires team discipline to maintain. Over-documenting trivial decisions creates noise; under-documenting creates knowledge gaps.
- **Expected value:** 30-50% reduction in "why did we do this?" questions. Faster onboarding for new contributors.
- **Maintenance burden:** Low. One-time template setup, ongoing PR-based workflow integrates naturally with development.
