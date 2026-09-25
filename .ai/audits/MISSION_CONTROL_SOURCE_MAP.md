# Mission Control — Source/Projection/Action Map (WS1, Phase 3)

For every Mission Control type: canonical source → MC role → human action path.

| Concept                            | Canonical source (reuse)                                            | MC role                                                          | Human action via                         |
| ---------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Job                                | `workflows` Job/JobQueue = executor (in-memory; zero callers found) | `mc_jobs` audit envelope + `queue_job_id` ref                    | /os/mission job actions                  |
| JobTransition                      | transition maps in repo (MC)                                        | enforced                                                         | API 422 on invalid                       |
| Task                               | `.ai/tasks` contracts + DAG (planning)                              | read projection (`task-contracts.ts`) + `findJobsByTaskContract` | link at creation; view on job            |
| Artifact                           | shared `Artifact` = file-action record (distinct)                   | `MissionArtifact` registry + `mc_artifacts`                      | review/approve flows                     |
| ArtifactVersion                    | — (new)                                                             | `mc_artifact_versions`, immutable, parent-linked                 | version timeline, compare                |
| Approval                           | bee engine = runtime gate (in-memory)                               | `mc_approval_requests` durable rounds                            | approve/reject/revise                    |
| Decision                           | — (new)                                                             | `mc_decisions` append-only                                       | history, audit                           |
| Session                            | auth sessions (untouched)                                           | `mc_sessions` execution audit                                    | session list, version links              |
| Evidence                           | `evidence_records` + Evidence repo                                  | `listEvidence` reads                                             | evidence trail UI                        |
| Source                             | research `Source`, `Citation`, `ExternalResourceRef`                | referenced, not duplicated                                       | WHY inspector                            |
| Integration                        | shared `IntegrationRecord` (future table)                           | artifact statuses + approve_integration decisions                | verify→integrating→integrated            |
| Repository/Commit/PR/CI/Deployment | github-os DB, git, CI API                                           | projections only                                                 | repo picker, local-state panel, PR links |
| Event                              | `BhavyaEvent` + bus + JSONL/IOC sinks                               | `mission-control.*` evidence rows                                | timelines                                |

No second source of truth was created for any row. `getMissionGraph` derives FACT edges from the above.
