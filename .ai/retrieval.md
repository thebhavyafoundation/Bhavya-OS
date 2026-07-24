id: RUNTIME-016
owner: Engineering

# Retrieval Rules

## Core Rules

1. Never recursively scan the repository.
2. Prefer index.yaml for file lookups.
3. Load files listed by context-loader.md only.
4. Stop loading once enough context is available.
5. Avoid loading files unrelated to the current task.
6. Use entity IDs (APP-001, PKG-001, STD-001, SPEC-001, REL-001) instead of repeating names.

## Context Layers

L0 (Always):
  - .ai/bootstrap.md
  - .ai/runtime.json

L1 (If needed):
  - .ai/index.yaml
  - .ai/project-summary.md
  - .ai/repository-map.md

L2 (If needed):
  - .ai/architecture.md
  - .ai/design-system.md
  - .ai/coding-standards.md
  - .ai/conventions.md
  - .ai/dependencies.yaml

L3 (Task-specific):
  - Files specified by context-loader.md for the current task domain
  - Only load the specific agent profile from .ai/agents/

## Load Budget

| Mode | Max Files | When |
|------|-----------|------|
| Planning | 6 | Understanding task, writing plan |
| Coding | 8 | Implementing changes |
| Documentation | 5 | Writing docs, specs |
| Release | 4 | Versioning, certification |
| Review | 6 | Code review, QA |

## If Information Is Missing

1. Check index.yaml for the entity ID.
2. Search the specific directory mentioned in the task.
3. If still missing, state assumptions clearly and choose the smallest safe implementation.
