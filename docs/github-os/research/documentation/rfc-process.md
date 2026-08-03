# RFC Process — Knowledge Package

## Executive Summary

RFC (Request for Comments) processes provide a structured way to propose, discuss, and ratify significant changes to a project. Unlike ADRs which document decisions after they're made, RFCs facilitate the discussion that leads to the decision. Major projects like Rust, npm, TypeScript, and Turborepo use RFC processes to manage substantial changes. This package documents real RFC processes for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: The Rust RFC Process (Gold Standard)

The most comprehensive and well-documented RFC process. Defines "substantial" changes clearly:

- Any semantic or syntactic change to the language that is not a bugfix
- Removing language features, including those that are feature-gated
- Large additions to `std`
- Changes to the interface between the compiler and libraries

**Workflow:**

1. Fork the RFC repo
2. Copy `0000-template.md` to `text/0000-my-feature.md`
3. Fill in the RFC with care: convincing motivation, design impact, honest drawbacks
4. Submit a pull request
5. Build consensus and integrate feedback
6. Sub-team discusses and proposes "motion for final comment period" (FCP)
7. FCP lasts 10 calendar days (at least 5 business days)
8. RFC is merged (active), closed, or postponed

### Pattern 2: The npm RFC Process (Community-Oriented)

Limited to issues concerning the npm CLI and web services. Uses "Rough Consensus" model similar to IETF.

**Key features:**

- Anyone may participate in discussion
- Only npm collaborators can ratify
- RFCs can be written before or after implementation
- Proof of concepts encouraged before ratification
- Automated numbering and status tracking via bots

### Pattern 3: RFC vs ADR Distinction

| Aspect    | RFC                                         | ADR                              |
| --------- | ------------------------------------------- | -------------------------------- |
| Purpose   | Propose and discuss                         | Document decision                |
| Timing    | Before implementation                       | After decision                   |
| Audience  | Community-wide                              | Team-focused                     |
| Lifecycle | Draft → Discussion → Ratified → Implemented | Proposed → Accepted → Superseded |
| Scope     | Major features, breaking changes            | Architectural decisions          |

### Pattern 4: Frontmatter-Driven Automation

Modern RFC processes use YAML frontmatter for automated status tracking:

```yaml
---
title: "RFC: Feature Name"
number: 123
status: accepted
author: username
created: 2026-01-15
implementation: null
---
```

### Pattern 5: Tiered Change Classification

Not all changes require RFCs. Projects define clear thresholds:

- **Bug fixes, docs:** Normal PR workflow
- **Minor features:** May need discussion but not full RFC
- **Substantial changes:** Full RFC process required
- **Breaking changes:** RFC with extended comment period

## Best Practices

1. **Define "substantial" explicitly.** Vague thresholds lead to confusion. List specific categories that require RFCs.

2. **Use pull requests as the discussion forum.** GitHub PRs provide threaded discussion, inline comments, and version history. No separate tools needed.

3. **Require motivation, not just implementation.** The RFC should explain WHY the change is needed, not just HOW it's done.

4. **Include alternatives and drawbacks.** Honest discussion of tradeoffs builds trust and catches blind spots.

5. **Set a comment period.** 10 calendar days (at least 5 business days) gives stakeholders time to respond without blocking progress indefinitely.

6. **Use a template.** Consistent structure makes RFCs easier to review and compare.

7. **Allow proof of concepts.** Sometimes code speaks louder than words. Encourage working implementations before final decision.

8. **Automate what you can.** Bot-assigned numbers, automated status updates, and CI checks reduce manual overhead.

9. **Archive everything.** Even rejected RFCs contain valuable context. Keep them with "postponed" or "rejected" status.

10. **Separate exploration from decision.** Use Solution Designs for exploration, ADRs for final decisions, RFCs for community-facing proposals.

## Templates

### RFC Template (Rust-Inspired)

```markdown
# RFC-{NUMBER}: {Title}

- **RFC PR:** [#{NUMBER}](https://github.com/org/repo/pull/{NUMBER})
- **Issue:** [#{ISSUE}](https://github.com/org/repo/issues/{ISSUE})
- **Status:** {draft | in-review | accepted | rejected | postponed}
- **Author:** {name}
- **Created:** {YYYY-MM-DD}
- **Updated:** {YYYY-MM-DD}

## Summary

{One paragraph explanation. What is this RFC about?}

## Motivation

{Why are we doing this? What problem does it solve?
What use cases does it support? What is the expected outcome?}

## Detailed Design

### Guide-Level Explanation

{Explain the feature from the user's perspective.
What new concepts are introduced? What new syntax is added?
Show examples of how users will interact with this feature.}

### Reference-Level Explanation

{Explain the implementation from a technical perspective.
How does it interact with other features? What edge cases
need consideration? Keep it brief — core ideas, not full implementation.}

## Drawbacks

{Why should we NOT do this? What are the tradeoffs?
What alternatives were considered and rejected?}

## Rationale and Alternatives

{Why is this design the best? What other approaches
were considered? How do other projects handle this?}

## Unresolved Questions

{What parts of the design are still TBD?
What questions need answers before implementation?}

## Future Possibilities

{What future work does this enable?
What related features could be built on top of this?}

## Implementation Plan

{High-level timeline. Who will implement this?
What are the milestones?}
```

### Lightweight RFC Template

```markdown
# RFC: {Title}

**Status:** {Draft | Review | Accepted | Rejected}
**Author:** {name}
**Date:** {YYYY-MM-DD}

## Problem

{What problem does this solve?}

## Proposal

{What are you suggesting?}

## Alternatives Considered

{What else was considered?}

## Trade-offs

| Option   | Pros | Cons |
| -------- | ---- | ---- |
| Option A | ...  | ...  |
| Option B | ...  | ...  |

## Decision

{Final decision and rationale}

## Implementation

{How will this be implemented?}
```

## Anti-Patterns

1. **RFCs for trivial changes.** Don't use RFCs for bug fixes, typo corrections, or minor refactors. They create unnecessary process overhead.

2. **RFCs without motivation.** An RFC that says "let's use X" without explaining WHY wastes everyone's time.

3. **Ignoring community feedback.** An RFC process that ignores outside input is just theater. Genuinely consider feedback.

4. **Infinite comment periods.** Set a deadline. Decisions delayed are decisions deferred, and deferral has costs.

5. **RFCs as implementation specs.** RFCs are for design decisions, not line-by-line implementation plans.

6. **Skipping the summary.** If you can't explain your RFC in one paragraph, you don't understand it well enough yet.

7. **No tracking of rejected RFCs.** Rejected proposals contain valuable context about what was considered and why it wasn't pursued.

## Reusable Ideas for GitHub OS

1. **Adopt tiered change classification:**
   - **Level 0:** Documentation, typos → Normal PR
   - **Level 1:** Bug fixes, small features → PR with issue discussion
   - **Level 2:** New features, significant changes → Lightweight RFC
   - **Level 3:** Breaking changes, architectural shifts → Full RFC with FCP

2. **Use GitHub Issues for RFCs initially, then move to PRs for ratification.** This captures early discussion without requiring a separate repo.

3. **Create RFC template at `docs/rfcs/0000-template.md`.** Copy the Rust/npm hybrid template.

4. **Automate numbering via CI.** When an RFC PR is merged, a bot assigns the next sequential number.

5. **Set 7-day comment period for Level 2, 14-day for Level 3.** Balishes thoroughness with velocity.

6. **Archive all RFCs in `docs/rfcs/` directory.** Even rejected ones provide context.

7. **Require RFC for:**
   - New public API surfaces
   - Breaking changes to existing APIs
   - Changes to core architecture
   - New external dependencies
   - Changes to governance model

8. **Don't require RFC for:**
   - Internal implementation changes
   - Bug fixes
   - Documentation updates
   - Performance optimizations (unless they change API)

## Evidence

- **Source:** https://github.com/rust-lang/rfcs, https://github.com/npm/rfcs, https://rust-lang.github.io/rfcs/0002-rfc-process.html, https://medium.com/@databend/how-to-write-rfcs-for-open-source-projects-3a77641a8b7b, https://github.com/vercel/turborepo/discussions/13415
- **Date collected:** 2026-08-03
- **Why it matters:** RFC processes prevent "surprise" changes that break community trust. They ensure all stakeholders have input before significant decisions are finalized.
- **Trade-offs:** More structured than ad-hoc discussion but slower than just making decisions. Best suited for projects with multiple stakeholders and public APIs.
- **Expected value:** Fewer reverted decisions, better community buy-in, documented rationale for all significant choices.
- **Maintenance burden:** Medium. Requires active moderation and enforcement of process. Automatable parts reduce overhead.
