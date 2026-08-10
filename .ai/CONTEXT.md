# .ai/ — Agent Context (Knowledge Bundle)

The AI agent's navigable brain — architecture, memory, state, decisions, and workflows. This directory is the primary context source for agents working on Bhavya OS.

## Where things live

| Path                 | What it holds                         |
| -------------------- | ------------------------------------- |
| `architecture.md`    | System architecture documentation     |
| `bootstrap.md`       | Bootstrap/initialization instructions |
| `CODING_STANDARD.md` | Coding standards                      |
| `CONSTRAINTS.md`     | System constraints                    |
| `MASTER_CONTEXT.md`  | Master context for AI agents          |
| `MEMORY.md`          | AI memory documentation               |
| `MISSION.md`         | Foundation mission statement          |
| `current-release.md` | Current release info                  |
| `current-task.md`    | Current task info                     |
| `roadmap.md`         | Development roadmap                   |
| `decision-log.md`    | Decision history                      |
| `glossary.md`        | Project glossary                      |
| `repository-map.md`  | Repository map                        |
| `STYLE_GUIDE.md`     | Style guide                           |
| `TOOLS.md`           | Available tools                       |
| `WORKFLOWS.md`       | Workflow documentation                |

## Subdirectories

| Path         | What it holds                                                             |
| ------------ | ------------------------------------------------------------------------- |
| `agents/`    | Agent role definitions + `registry.yaml`                                  |
| `memory/`    | Agent memory: agents.md, engineering.md, governance.md, project.md, ui.md |
| `state/`     | Runtime state: logs, repository.json, metrics                             |
| `events/`    | Event log (event-log.jsonl)                                               |
| `releases/`  | Release YAML files (v0.1 through v0.5)                                    |
| `tasks/`     | Task contracts and graph                                                  |
| `build/`     | Build scripts                                                             |
| `templates/` | ADR and task templates                                                    |
| `snapshots/` | Runtime snapshots                                                         |
| `history/`   | Historical data                                                           |

## Route

| Task                    | File                                     |
| ----------------------- | ---------------------------------------- |
| Understand architecture | `architecture.md`                        |
| Bootstrap an agent      | `bootstrap.md`                           |
| Check current state     | `current-release.md` + `current-task.md` |
| Read decisions          | `decision-log.md`                        |
| Find agent definitions  | `agents/registry.yaml`                   |
| Read memory             | `memory/engineering.md`                  |
| Check workflows         | `WORKFLOWS.md`                           |
| Read constraints        | `CONSTRAINTS.md`                         |
| Check roadmap           | `roadmap.md`                             |
