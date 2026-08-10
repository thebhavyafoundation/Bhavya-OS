# packages/ — Shared Package Library

65 packages organized by domain. Each is a record in the library with its own `package.json`, `src/`, and `CONTRACT.md` (where applicable).

**Last updated:** 2026-08-10

## Core Platform

| Package   | Purpose                                             |
| --------- | --------------------------------------------------- |
| `kernel/` | Core kernel with BRP types, registry, observability |
| `shared/` | Canonical type definitions (100+ types)             |
| `types/`  | Type re-exports                                     |
| `config/` | Platform configuration                              |
| `events/` | Event bus                                           |
| `sdk/`    | Extension SDK                                       |

## Runtime Engine

| Package             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `runtime/`          | Full runtime: engine, builders, CLI, API, daemon, planner |
| `mission-runtime/`  | Mission execution                                         |
| `learning-runtime/` | Learning execution                                        |
| `project-runtime/`  | Project execution                                         |
| `impact-runtime/`   | Impact measurement                                        |

## AI/Agent Systems

| Package             | Purpose                           |
| ------------------- | --------------------------------- |
| `ai/`               | AI abstractions                   |
| `agent-engine/`     | Agent lifecycle                   |
| `intelligence/`     | Intelligence processing           |
| `knowledge-engine/` | Knowledge processing              |
| `knowledge-graph/`  | Knowledge graph (17 entity types) |
| `mentor-engine/`    | Mentor system                     |
| `memory-engine/`    | Memory persistence                |
| `search-engine/`    | Search                            |
| `scheduler-engine/` | Task scheduling                   |
| `planner-engine/`   | Planning                          |
| `workflow-engine/`  | Workflow execution                |

## UI/Design

| Package                   | Purpose                            |
| ------------------------- | ---------------------------------- |
| `platform-ui/`            | Canonical UI (@bhavya/platform-ui) |
| `design-system/`          | Design system                      |
| `icons/`                  | Icons                              |
| `charts/`                 | Charts                             |
| `motion-system/`          | Motion/animation                   |
| `interactive-components/` | Interactive UI                     |
| `branding/`               | Brand assets                       |

## Content

| Package           | Purpose                    |
| ----------------- | -------------------------- |
| `content-core/`   | Content authoring pipeline |
| `content-board/`  | Content board              |
| `content-engine/` | Content engine             |

## Infrastructure

| Package          | Purpose        |
| ---------------- | -------------- |
| `api/`           | API layer      |
| `auth/`          | Authentication |
| `database/`      | Database layer |
| `security/`      | Security       |
| `notifications/` | Notifications  |
| `observability/` | Monitoring     |

## Tooling

| Package       | Purpose            |
| ------------- | ------------------ |
| `cli/`        | CLI utilities      |
| `eslint/`     | ESLint configs     |
| `typescript/` | TypeScript configs |
| `bdx/`        | Developer tools    |

## Contracts

11 packages have formal `CONTRACT.md` files in `contracts/`:
`agents`, `content-core`, `events`, `kernel`, `knowledge-graph`, `mission-runtime`, `platform-ui`, `plugins`, `runtime`, `services`, `shared`.

## Using a package

```bash
# From root
pnpm --filter @bhavya/<name> <command>

# Import in code
import { ... } from "@bhavya/<name>";
```
