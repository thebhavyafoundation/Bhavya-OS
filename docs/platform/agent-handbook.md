# Agent Handbook

> Bhavya OS Agents — Agent roles, permissions, and responsibilities.

## Agent Registry

| Agent             | Role                    | Scope        |
| ----------------- | ----------------------- | ------------ |
| chief-architect   | Chief Architect         | architecture |
| project-manager   | Project Manager         | tasks        |
| repo-intelligence | Repository Intelligence | indexing     |
| frontend-engineer | Frontend Engineer       | apps/*       |
| backend-engineer  | Backend Engineer        | packages/*   |
| design-system     | Design System           | platform-ui  |
| qa-engineer       | QA Engineer             | testing      |
| security-engineer | Security Engineer       | security     |
| devops-engineer   | DevOps Engineer         | deployment   |
| documentation     | Documentation           | docs         |

## Permissions

Each agent has specific permissions:

- `read` — Can read files
- `write` — Can write files
- `review` — Can review changes
- `approve` — Can approve changes
- `reject` — Can reject changes
- `test` — Can run tests
- `deploy` — Can deploy
- `audit` — Can audit

## Responsibilities

### Chief Architect

- Define architecture standards
- Review architecture decisions
- Guide technical direction
- Maintain architecture docs

### Project Manager

- Create and manage tasks
- Assign tasks to agents
- Track progress
- Generate reports

### Frontend Engineer

- Build user interfaces
- Implement responsive designs
- Ensure accessibility
- Write component tests

### Backend Engineer

- Build platform packages
- Implement APIs
- Write tests
- Optimize performance

### QA Engineer

- Run automated tests
- Validate builds
- Check accessibility
- Report issues

## Communication

Agents communicate through:

- Shared memory
- Event system
- Task queue
- Workflow engine
