# ADR-011: GitHub Intelligence Lab Package Boundaries

**Status:** Accepted | **Date:** 2026-08-03 | **Deciders:** Bhavya OS Architecture
**Source:** Migrated from `docs/architecture/ADR-001-github-intelligence-package-boundaries.md` (2026-09-17)

## Context

GitHub Intelligence Lab (GIL) requires research capabilities across 10 domains: Elite UI, AI Education, AI Frameworks, MCP Intelligence, Plugin Intelligence, Architecture, Documentation, Automation, Websites, and AI Institute.

The initial proposal created 4 new shared packages:

- `@bhavya/ui-research`
- `@bhavya/course-research`
- `@bhavya/architecture-research`
- `@bhavya/automation-research`

This ADR determines whether these should be shared packages or application-internal modules.

## Decision

**All four research domains remain internal modules of `apps/github-intelligence-lab`.**

They are not promoted to `packages/` until a second application consumes them.

## Review Criteria Applied

### 1. Is this a true bounded context?

| Package               | Has distinct models?                                            | Has distinct workflows?         | Has own lifecycle? |
| --------------------- | --------------------------------------------------------------- | ------------------------------- | ------------------ |
| ui-research           | Yes (UIRepository, DesignSystemAnalysis, AccessibilityAnalysis) | Yes (discover, extractKP)       | Could              |
| course-research       | Yes (Course, LearningPath, CurriculumRecommendation)            | Yes (discover, recommend)       | Could              |
| architecture-research | Yes (RepositoryAnalysis, FolderTemplate, DocumentationStandard) | Yes (discover, extractTemplate) | Could              |
| automation-research   | Yes (GitHubAction, AutomationWorkflow, ReusableTemplate)        | Yes (discover, recommend)       | Could              |

All four pass this test. They have distinct models, services, and workflows.

### 2. Will another application import it?

| Package               | Current consumers | Future consumers        | Verdict |
| --------------------- | ----------------- | ----------------------- | ------- |
| ui-research           | GIL only          | Website OS (if built)   | **No**  |
| course-research       | GIL only          | AI Institute (if built) | **No**  |
| architecture-research | GIL only          | GitHub OS (if built)    | **No**  |
| automation-research   | GIL only          | None identified         | **No**  |

**All four fail this test.** No second consumer exists today.

### 3. Does it have independent evolution?

All four could evolve independently with their own tests and versioning. But premature abstraction is waste. They should evolve within GIL until a second consumer demands extraction.

### 4. Does it expose a stable API?

All four expose clear public APIs (UIResearcher, CourseResearcher, ArchitectureResearcher, AutomationResearcher). But stability is proven through use, not declared upfront.

## Alternative Designs Considered

### Alternative A: Create all 4 as shared packages

**Pros:**

- Clean separation
- Reusable if another app needs them
- Independent versioning

**Cons:**

- Premature abstraction (no second consumer)
- 4 extra package.json, tsconfig.json, index.ts files
- 4 extra dependency edges in the monorepo
- Maintenance burden without demonstrated value

**Verdict:** Rejected. Violates Package Promotion Rule.

### Alternative B: Keep all 4 as internal modules

**Pros:**

- No premature abstraction
- GIL owns its research logic
- Easy to refactor later
- Leaner monorepo

**Cons:**

- If a second app needs them, extraction requires refactoring
- Code lives inside an app, not discoverable at monorepo level

**Verdict:** Accepted. The extraction cost is low and the disciplines are high.

### Alternative C: Hybrid — promote one, keep three internal

**Pros:**

- Pragmatic

**Cons:**

- Inconsistent rules
- Which one gets promoted and why?

**Verdict:** Rejected. Apply the rule uniformly.

## Recommended Internal Structure

```
apps/github-intelligence-lab/
    src/
        research/
            ui/
                index.ts          — UIResearcher class
                types.ts          — UIPattern, UIRepository, etc.
            architecture/
                index.ts          — ArchitectureResearcher class
                types.ts          — RepositoryAnalysis, FolderTemplate, etc.
            automation/
                index.ts          — AutomationResearcher class
                types.ts          — GitHubAction, AutomationWorkflow, etc.
            courses/
                index.ts          — CourseResearcher class
                types.ts          — Course, LearningPath, etc.
        lib/
            engine.ts             — GIL orchestration
        app/
            page.tsx              — Dashboard
```

## Promotion Triggers

A research module earns package status when:

1. **A second application imports it** — not just GIL
2. **The API has been stable for 2+ iterations** — not still evolving
3. **It has its own test suite** — not just GIL integration tests
4. **It has documented public API** — not just internal usage

Specific triggers:

| Module                | Promotes when                            |
| --------------------- | ---------------------------------------- |
| ui-research           | Website OS needs UI pattern extraction   |
| course-research       | AI Institute needs curriculum research   |
| architecture-research | GitHub OS needs architecture analysis    |
| automation-research   | Another app needs GitHub Action research |

## Consequences

1. **GIL app grows larger** — 4 internal modules instead of 4 external dependencies. Acceptable because GIL is the sole consumer.

2. **Extraction is straightforward** — Moving `src/research/ui/` to `packages/ui-research/` is a mechanical refactor when the time comes.

3. **Monorepo stays lean** — No unused packages. Every package earns its place through demonstrated consumption.

4. **Architecture is protected** — The Package Promotion Rule prevents premature abstraction and keeps the codebase honest.

## Engineering Rule Established

**Package Promotion Rule:**
Nothing starts life as a shared package.

Lifecycle:

1. Application Module
2. Used Successfully
3. Required By Second Application
4. Promote To Shared Package
5. Version
6. Document
7. Maintain

Shared packages are earned, not planned.
