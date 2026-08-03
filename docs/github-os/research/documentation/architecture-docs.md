# Architecture Documentation — Knowledge Package

## Executive Summary

Architecture documentation communicates the structure, behavior, and rationale of a software system to stakeholders. The two dominant frameworks are arc42 (a template with 12 sections covering all architectural aspects) and the C4 Model (a hierarchical approach to system visualization with four levels of abstraction). Modern teams combine these with "Documentation as Code" practices — storing architecture in version control alongside implementation. This package documents these patterns for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: The arc42 Template Structure

The most widely used architecture documentation template globally. 12 sections covering all aspects:

```
01. Introduction and Goals
02. Architecture Constraints
03. System Scope and Context
04. Solution Strategy
05. Building Block View
06. Runtime View
07. Deployment View
08. Cross-cutting Concepts
09. Architecture Decisions
10. Quality Requirements
11. Risks and Technical Debt
12. Glossary
```

**Key insight:** You don't need all 12 sections. Start simple, expand as complexity requires. Remove unused sections.

### Pattern 2: C4 Model Hierarchy

Four levels of abstraction for system visualization:

1. **Context (C1)** — System boundaries and external interactions
2. **Container (C2)** — High-level technology choices (apps, databases, queues)
3. **Component (C3)** — Major structural building blocks within containers
4. **Code (C4)** — Class diagrams and implementation details (optional, rarely needed)

**Mapping to arc42:**

| C4 Level  | arc42 Section                     |
| --------- | --------------------------------- |
| Context   | 3. System Scope and Context       |
| Container | 5. Building Block View (Level 1)  |
| Component | 5. Building Block View (Level 2+) |

### Pattern 3: Documentation as Code (DaC)

Store architecture documentation in version control alongside implementation:

- **Version controlled** — Track every change with full history
- **AI-ready** — Markdown and diagrams-as-code enable AI assistance
- **Standard formats** — Use arc42, C4, ADRs, Mermaid that external teams understand
- **Collaborative** — Review through pull requests, no special tools required
- **Living documentation** — Update during development, not after

### Pattern 4: Diagrams as Code

Use text-based diagram formats that live in version control:

- **Mermaid** — Native GitHub rendering, simple syntax, good for most diagrams
- **PlantUML** — More powerful, wider diagram types, requires export
- **Structurizr DSL** — C4-specific, generates diagrams from model code
- **D2** — Modern, customizable, good for complex diagrams

### Pattern 5: Solution Design + ADR Workflow

- **Solution Design** — RFC-style exploration document for investigating options
- **ADR** — Final decision record with context and consequences

This workflow ensures thoughtful architecture evolution: explore broadly with Solution Designs, then lock in decisions with ADRs.

## Best Practices

1. **Start with arc42 sections 1, 3, and 5.** These cover goals, context, and building blocks — the three most important views for any project. Expand to other sections as needed.

2. **Use C4 diagrams progressively.** Start at C1 (context) and continue only as deep as your documentation needs require. Given limited architect time, stop at the level appropriate for your stakeholders.

3. **Store diagrams as code.** Mermaid, PlantUML, or Structurizr DSL files in version control. Never use binary image files for architecture diagrams.

4. **Keep documentation next to code.** Architecture docs in `docs/architecture/` or `architecture/` in the same repo as the implementation. This ensures documentation stays in sync.

5. **Use external diagram files for scalability.** Store diagram code in `/diagrams/` folder and reference via links. Core views get external files; one-off diagrams can be inline.

6. **Treat documentation like code.** Include it in PR reviews, CI checks, and release processes. Documentation that isn't reviewed rots.

7. **Generate diagrams from models when possible.** Structurizr DSL can generate PlantUML diagrams from a single source of truth. This prevents diagrams from diverging from implementation.

8. **Add a repository overview.** Map the directory structure. Critical for monorepos, data repos, and projects with non-obvious layouts. Benefits both humans and AI systems.

9. **Include a glossary.** Define domain-specific terms. Prevents confusion and ensures consistent language.

10. **Make it AI-readable.** Use explicit section boundaries, stable markdown hierarchy, and predictable labels. AI systems work better when purpose, installation, usage, and configuration are separated into named sections.

## Templates

### arc42-Lite Template (GitHub OS Recommended)

```markdown
# {Project Name} Architecture

## 1. Introduction and Goals

### 1.1. Purpose

{What is this project? Who is it for?}

### 1.2. Quality Goals

| Goal     | Description   | Priority          |
| -------- | ------------- | ----------------- |
| {Goal 1} | {Description} | {High/Medium/Low} |
| {Goal 2} | {Description} | {High/Medium/Low} |

### 1.3. Stakeholders

| Role     | Description      |
| -------- | ---------------- |
| {Role 1} | {What they need} |

## 2. Architecture Constraints

{Technical, organizational, or regulatory constraints}

## 3. System Scope and Context

### 3.1. Business Context

{How the system fits into the business environment}

### 3.2. Technical Context

{External systems, APIs, databases the system interacts with}

[C4 Context Diagram]

## 4. Solution Strategy

{High-level architectural approach and key decisions}

## 5. Building Block View

### 5.1. Level 1: System

[C4 Container Diagram]

### 5.2. Level 2: Containers

[C4 Component Diagram for each container]

## 6. Runtime View

{Key behavioral scenarios and interactions}

[Sequence diagrams for critical flows]

## 7. Deployment View

{How the system is deployed to infrastructure}

[C4 Deployment Diagram]

## 8. Cross-cutting Concepts

{Patterns that span multiple components: logging, security, auth}

## 9. Architecture Decisions

{Link to ADR directory or inline key decisions}

## 10. Quality Requirements

{Performance, scalability, security, maintainability requirements}

## 11. Risks and Technical Debt

{Known issues, mitigation strategies, accepted risks}

## 12. Glossary

| Term   | Definition   |
| ------ | ------------ |
| {Term} | {Definition} |
```

### Directory Structure Template

```
architecture/
├── README.md                    # Quick start and overview
├── 01-introduction-and-goals.md
├── 02-architecture-constraints.md
├── 03-system-scope-and-context.md
├── 04-solution-strategy.md
├── 05-building-block-view.md
├── 06-runtime-view.md
├── 07-deployment-view.md
├── 08-crosscutting-concepts.md
├── 09-architecture-decisions/
│   ├── README.md                # ADR workflow
│   └── adr-000-template.md
├── 10-quality-requirements.md
├── 11-risks-and-technical-debt.md
├── 12-glossary.md
└── diagrams/
    ├── c4/
    │   ├── c1-system-context.mmd
    │   ├── c2-container.mmd
    │   └── c3-component.mmd
    ├── sequence/
    │   └── api-payment.mmd
    └── deployment/
        └── production.mmd
```

## Anti-Patterns

1. **Documentation as afterthought.** Writing architecture docs after implementation is done means they're never written. Document during development.

2. **Binary diagram formats.** PNG, JPG, or Visio files can't be diffed, reviewed, or generated from code. Use text-based formats (Mermaid, PlantUML).

3. **Too much detail too early.** Code diagrams (C4 level) go stale fast and require high maintenance. Only add them if they provide genuine value.

4. **Documentation silos.** Architecture docs in Confluence, code in GitHub, decisions in Slack. This creates knowledge fragmentation.

5. **No glossary.** Domain-specific terms used without definition create confusion, especially for new team members.

6. **Ignoring cross-cutting concerns.** Logging, security, and auth patterns that span multiple components need their own documentation.

7. **No link between docs and decisions.** Architecture docs should reference ADRs, and ADRs should reference the sections they affect.

## Reusable Ideas for GitHub OS

1. **Adopt arc42-lite with 8 core sections.** Start with sections 1, 3, 5, 8, 9, 10, 12. Add others as complexity demands.

2. **Use Mermaid for all diagrams.** Native GitHub rendering, simple syntax, no external tools needed.

3. **Store architecture docs at `docs/architecture/`.** Co-located with ADRs and solution designs.

4. **Create C4 diagrams for:**
   - System Context (what GitHub OS interacts with)
   - Container view (packages, services, data stores)
   - Component view (key modules within packages)

5. **Implement Documentation as Code.** Architecture docs go through PR review, CI checks validate links and formatting.

6. **Generate diagrams from Structurizr DSL** for complex components. Keep source of truth in code, not in images.

7. **Maintain a glossary** of domain-specific terms (KO, capability, runtime, builder, etc.).

8. **Add repository overview** to root README explaining monorepo structure.

## Evidence

- **Source:** https://arc42.org/, https://c4model.com/, https://github.com/bitsmuggler/arc42-c4-software-architecture-documentation-example, https://docs.spryker.com/docs/dg/dev/architecture/architecture-as-code, https://www.codecentric.de/en/knowledge-hub/blog/architecture-documentation-as-code-with-structurizr-and-asciidoctor-part-2-asciidoctor
- **Date collected:** 2026-08-03
- **Why it matters:** Architecture documentation prevents knowledge loss when team members leave and enables informed decision-making for new features and refactoring.
- **Trade-offs:** More documentation takes time to create and maintain, but the investment pays off in reduced miscommunication and faster onboarding. Too much documentation creates noise that obscures what matters.
- **Expected value:** 40-60% reduction in "why was this built this way?" questions. Faster onboarding for new architects and contributors.
- **Maintenance burden:** Medium. Living documentation requires ongoing updates but is far less costly than rebuilding lost knowledge.
