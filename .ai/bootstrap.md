---
runtime: 2.0
schema: 1.0
manifest: 4
generated: 2026-07-23
---

# Bhavya Foundation AI Runtime

You are an engineering agent working inside the Bhavya Foundation repository.

Do NOT read the entire repository.

Follow this loading sequence.

## STEP 1
Read `.ai/runtime.json` (single state file — replaces 4 separate files)

## STEP 2
Read `.ai/bootstrap.md` (this file — context layers, load budget, workflow)

## STEP 3
Read `.ai/index.yaml` (deterministic lookup — never scan directories)

## STEP 4
Read `.ai/retrieval.md` (retrieval rules, context layers, load budget)

## STEP 5
Read `.ai/context-loader.md` (domain-specific file routes)

## STEP 6
Load ONLY the files required for the current task.

Never load unrelated files.
Never summarize the repository.
Never inspect every directory.
Always minimize context usage.

---

## Context Layers

L0 (Always):
  - .ai/bootstrap.md
  - .ai/runtime.json

L1 (If task requires overview):
  - .ai/index.yaml
  - .ai/project-summary.md
  - .ai/repository-map.md

L2 (If task requires details):
  - .ai/architecture.md
  - .ai/design-system.md
  - .ai/coding-standards.md
  - .ai/conventions.md
  - .ai/dependencies.yaml

L3 (Task-specific):
  - Files specified by context-loader.md for the current domain
  - Only load the relevant agent profile from .ai/agents/

## Load Budget

| Mode | Max Files | When |
|------|-----------|------|
| Planning | 6 | Understanding task, writing plan |
| Coding | 8 | Implementing changes |
| Documentation | 5 | Writing docs, specs |
| Release | 4 | Versioning, certification |
| Review | 6 | Code review, QA |

Stop loading once budget is consumed. Do not exceed budget.

---

## Workflow

1. Understand — load L0, check runtime.json
2. Plan — load L1-L2 if needed, define files
3. Identify files — use context-loader.md + index.yaml
4. Implement — load L3, make changes
5. Test — run verification commands
6. Update documentation — update runtime.json, decision log
7. Finish — validate against validation.md checklist

---

## Entity ID System

Refer to entities by stable ID:
- APP-001..009 for apps
- PKG-001..014 for packages
- STD-001..016 for standards
- SPEC-001..007 for specifications
- REL-001..005 for releases
- DEC-001..NNN for decisions
- MEM-* for memory files

Example: "Implement APP-001 using PKG-002 and STD-001."

---

## Principles

Every improvement must satisfy:
- Simplicity
- Consistency
- Accessibility (WCAG AA)
- Reusability
- Security
- Testability
- Maintainability
- Performance
- Documentation
- Institutional longevity

---

## Rules

- Never duplicate components, business logic, styles, API logic, or utilities
- Never ignore accessibility
- Never hardcode values
- Never bypass architecture
- Never introduce unnecessary dependencies
- Never break public APIs
- Always reuse existing packages
- Always follow standards in `.ai/` and `standards/`
- Always update `decision-log.md` if architecture changes
- Always keep responses concise

---

## If Information Is Missing

Search only the required directory. Never search the entire repository.

---

## Response Format

For every task provide:
1. Understanding
2. Plan
3. Files affected
4. Implementation
5. Validation
6. Remaining work
