# GitHub OS — Screen Map

## All Screens

### Dashboard

| Screen                 | Route           | Purpose              | Key Components                                             |
| ---------------------- | --------------- | -------------------- | ---------------------------------------------------------- |
| Main Dashboard         | `/`             | At-a-glance overview | Health cards, activity feed, AI suggestions, quick actions |
| Repository Dashboard   | `/repos`        | Repository overview  | Repo grid/list, search, filter, sort                       |
| Intelligence Dashboard | `/intelligence` | Knowledge overview   | Knowledge packages, radar, recommendations                 |
| Engineering Dashboard  | `/engineering`  | Engineering activity | Issues, PRs, reviews, releases                             |
| Automation Dashboard   | `/automation`   | Automation overview  | Workflows, MCPs, plugins                                   |
| Learning Dashboard     | `/learning`     | Learning overview    | Paths, resources, contributions                            |
| Analytics Dashboard    | `/analytics`    | Metrics overview     | Charts, trends, comparisons                                |

### Repository Screens

| Screen                | Route                      | Purpose                | Key Components                                  |
| --------------------- | -------------------------- | ---------------------- | ----------------------------------------------- |
| Repository List       | `/repos`                   | All repositories       | Grid view, list view, search, filter            |
| Repository Detail     | `/repos/:id`               | Repository overview    | Tabbed interface (overview, code, issues, etc.) |
| Repository Overview   | `/repos/:id/overview`      | Health and metrics     | Health score, activity chart, recent changes    |
| Repository Code       | `/repos/:id/code`          | Code browser           | File tree, file viewer, search                  |
| Repository Issues     | `/repos/:id/issues`        | Issue list             | List view, filters, create button               |
| Repository PRs        | `/repos/:id/pull-requests` | PR list                | List view, filters, create button               |
| Repository Knowledge  | `/repos/:id/knowledge`     | Knowledge packages     | Package list, search, filter                    |
| Repository ADRs       | `/repos/:id/adrs`          | Architecture decisions | ADR list, create, status                        |
| Repository Automation | `/repos/:id/automation`    | Workflows and MCPs     | Workflow list, MCP list                         |
| Repository Settings   | `/repos/:id/settings`      | Repository settings    | Permissions, integrations, general              |

### Issue Screens

| Screen       | Route                            | Purpose                 | Key Components                                      |
| ------------ | -------------------------------- | ----------------------- | --------------------------------------------------- |
| Issue List   | `/issues`                        | All issues across repos | List view, filters, search, bulk actions            |
| Issue Detail | `/repos/:repoId/issues/:id`      | Issue details           | Description, AI suggestions, linked items, activity |
| Issue Create | `/repos/:repoId/issues/new`      | Create issue            | Form, AI assistance, template selection             |
| Issue Edit   | `/repos/:repoId/issues/:id/edit` | Edit issue              | Form, metadata editor                               |

### Pull Request Screens

| Screen    | Route                                     | Purpose              | Key Components                               |
| --------- | ----------------------------------------- | -------------------- | -------------------------------------------- |
| PR List   | `/pull-requests`                          | All PRs across repos | List view, filters, search, bulk actions     |
| PR Detail | `/repos/:repoId/pull-requests/:id`        | PR details           | Diff view, reviews, checks, merge            |
| PR Create | `/repos/:repoId/pull-requests/new`        | Create PR            | Branch selection, template, AI assistance    |
| PR Review | `/repos/:repoId/pull-requests/:id/review` | Review PR            | Diff view, comments, approve/request changes |

### Knowledge Screens

| Screen           | Route              | Purpose                   | Key Components                        |
| ---------------- | ------------------ | ------------------------- | ------------------------------------- |
| Knowledge Base   | `/knowledge`       | All Knowledge Packages    | List view, categories, search, filter |
| Knowledge Detail | `/knowledge/:id`   | Knowledge package details | Content, sources, related packages    |
| Knowledge Create | `/knowledge/new`   | Create Knowledge Package  | Form, source selection, AI assistance |
| Knowledge Graph  | `/knowledge/graph` | Visual knowledge graph    | Interactive graph, node details       |

### Technology Radar

| Screen            | Route            | Purpose                 | Key Components                               |
| ----------------- | ---------------- | ----------------------- | -------------------------------------------- |
| Radar View        | `/radar`         | Technology Radar        | Interactive radar, quadrant filters          |
| Technology Detail | `/radar/:id`     | Technology details      | Overview, usage, evaluation, recommendations |
| Radar History     | `/radar/history` | Radar changes over time | Timeline view, adoption tracking             |

### Research Screens

| Screen           | Route                   | Purpose          | Key Components                         |
| ---------------- | ----------------------- | ---------------- | -------------------------------------- |
| Research Hub     | `/research`             | Research modules | Module list, findings, recommendations |
| Research Module  | `/research/:module`     | Module details   | Findings, methods, recommendations     |
| Research Finding | `/research/:module/:id` | Finding details  | Evidence, analysis, impact             |

### Automation Screens

| Screen          | Route                                   | Purpose            | Key Components                    |
| --------------- | --------------------------------------- | ------------------ | --------------------------------- |
| Workflow List   | `/automation/workflows`                 | All workflows      | List view, search, filter, create |
| Workflow Detail | `/automation/workflows/:id`             | Workflow details   | Definition, history, analytics    |
| Workflow Create | `/automation/workflows/new`             | Create workflow    | Template selection, builder, test |
| Workflow Run    | `/automation/workflows/:id/runs/:runId` | Run details        | Steps, logs, duration, status     |
| MCP List        | `/automation/mcp`                       | MCP servers        | List view, status, actions        |
| MCP Detail      | `/automation/mcp/:id`                   | MCP server details | Capabilities, config, docs        |
| MCP Install     | `/automation/mcp/install`               | Install MCP        | Search, evaluate, install         |
| Plugin List     | `/automation/plugins`                   | Plugins            | List view, status, actions        |
| Plugin Detail   | `/automation/plugins/:id`               | Plugin details     | Features, config, compatibility   |

### Learning Screens

| Screen              | Route                         | Purpose              | Key Components                      |
| ------------------- | ----------------------------- | -------------------- | ----------------------------------- |
| Learning Paths      | `/learning/paths`             | Learning paths       | Path list, progress, create         |
| Path Detail         | `/learning/paths/:id`         | Path details         | Steps, progress, resources          |
| Resources           | `/learning/resources`         | Learning materials   | Resource list, search, filter       |
| Resource Detail     | `/learning/resources/:id`     | Resource details     | Content, related, reviews           |
| Contributions       | `/learning/contributions`     | Contribution history | Contribution list, impact, learning |
| Contribution Detail | `/learning/contributions/:id` | Contribution details | Code, review, learning, impact      |

### Analytics Screens

| Screen              | Route                    | Purpose             | Key Components                 |
| ------------------- | ------------------------ | ------------------- | ------------------------------ |
| Engineering Metrics | `/analytics/engineering` | Engineering metrics | Charts, trends, comparisons    |
| Team Performance    | `/analytics/teams`       | Team metrics        | Team comparisons, rankings     |
| AI Metrics          | `/analytics/ai`          | AI effectiveness    | AI usage, acceptance, impact   |
| Individual Metrics  | `/analytics/:userId`     | Personal metrics    | Individual performance, growth |

### Settings Screens

| Screen                | Route                     | Purpose           | Key Components                          |
| --------------------- | ------------------------- | ----------------- | --------------------------------------- |
| Organization Settings | `/settings/org`           | Org settings      | Name, description, general settings     |
| Team Settings         | `/settings/teams`         | Team management   | Team list, create, edit, members        |
| Member Settings       | `/settings/members`       | Member management | Member list, invite, roles, permissions |
| Security Settings     | `/settings/security`      | Security settings | Permissions, access, audit logs         |
| Integration Settings  | `/settings/integrations`  | Integrations      | GitHub, MCP, webhooks                   |
| Notification Settings | `/settings/notifications` | Notifications     | Preferences, channels, frequency        |

### Admin Screens

| Screen          | Route           | Purpose             | Key Components                 |
| --------------- | --------------- | ------------------- | ------------------------------ |
| Admin Dashboard | `/admin`        | Admin overview      | System health, usage, alerts   |
| User Management | `/admin/users`  | User administration | User list, roles, permissions  |
| Audit Logs      | `/admin/audit`  | Audit trail         | Log viewer, filters, export    |
| System Health   | `/admin/health` | System status       | Health checks, metrics, alerts |

## Screen States

### Empty States

Each list screen has an empty state with:

- Illustration
- Description
- Call-to-action button

### Loading States

Each screen shows:

- Skeleton loader
- Progress indicator
- Estimated time

### Error States

Each screen handles errors:

- Error message
- Retry button
- Help link

### Not Found States

When entity doesn't exist:

- 404 message
- Navigation back
- Search suggestions

## Navigation Transitions

| Transition      | Animation         | Duration |
| --------------- | ----------------- | -------- |
| Page load       | Fade in           | 200ms    |
| Tab switch      | Slide left/right  | 150ms    |
| Modal open      | Scale up + fade   | 200ms    |
| Modal close     | Scale down + fade | 150ms    |
| Sidebar toggle  | Slide             | 200ms    |
| List item hover | Background change | 100ms    |
| Button click    | Scale (0.98)      | 50ms     |
