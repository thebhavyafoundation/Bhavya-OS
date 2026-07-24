id: MEM-AGENTS
type: memory
domain: agents
owner: Engineering
last_updated: 2026-07-23

# Agents Memory

## Registered Agents (runtime)
| ID | Name | Role |
|----|------|------|
| agent.engineering | Engineering Agent | Platform, packages, apps |
| agent.architecture | Architecture Agent | ADRs, dependency integrity |
| agent.frontend | Frontend Agent | UI, components, a11y |
| agent.backend | Backend Agent | APIs, services, data |
| agent.documentation | Documentation Agent | Specs, standards, docs |
| agent.release | Release Agent | Versioning, snapshots, CI |
| agent.testing | Testing Agent | Quality gates, test coverage |
| agent.security | Security Agent | Vulnerabilities, compliance |
| agent.devops | DevOps Agent | Docker, CI/CD, infra |
| agent.research | Research Agent | RFCs, feasibility, eval |

## Agent Profiles
Each agent has a profile in .ai/agents/ with context loading rules and max file budgets.
Agent registry in .ai/agents/registry.yaml defines what each agent loads.

## Permission Model
- Engineering/Release: Read/Write, Terminal, Gateway execute
- Documentation/Design: Read/Write docs/design scope, Terminal execute
- Governance/Founder: Read-only
- Security: Read-only, review scope
