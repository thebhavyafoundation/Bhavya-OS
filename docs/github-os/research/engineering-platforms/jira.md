# Jira — Knowledge Package

## Executive Summary

Jira is the world's most widely used project management and issue tracking software, developed by Atlassian. Used by over 300,000 businesses globally, Jira provides agile project management, bug tracking, sprint planning, and workflow automation. Originally designed for software development teams, Jira has expanded to serve IT service management (via Jira Service Management), business project management, and cross-functional planning.

Jira's architecture is a cloud-first SaaS platform (with Data Center option being deprecated by 2029) built on Atlassian's cloud infrastructure. It offers four tiers: Free (10 users), Standard ($7.91/user/month), Premium ($14.54/user/month), and Enterprise (custom). The platform provides Scrum and Kanban boards, backlog management, sprint planning, release management, and deep customization through workflows, issue types, and field configurations.

For Bhavya Foundation, Jira represents the enterprise standard for project management with unmatched ecosystem breadth (3,000+ Marketplace apps). However, it lacks built-in CI/CD and source code management — these require integration with GitHub, Bitbucket, or other tools. Jira's strength is its flexibility and customization, but this can lead to configuration complexity. The pricing structure (with Confluence, test management, and time tracking add-ons) can become expensive.

## Architecture

### Cloud Architecture

Jira Cloud is a multi-tenant SaaS platform:

```
┌─────────────────────────────────────────────┐
│              Atlassian Cloud                 │
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Jira Core  │  │ Confluence  │          │
│  │  (Issues,   │  │ (Knowledge  │          │
│  │   Boards)   │  │   Base)     │          │
│  └──────┬──────┘  └──────┬──────┘          │
│         │                │                  │
│  ┌──────▼────────────────▼──────┐          │
│  │    Atlassian Platform        │          │
│  │  (Identity, Access, APIs)    │          │
│  └──────────────────────────────┘          │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ Marketplace  │  │  Automation  │        │
│  │ (3,000+ apps)│  │  Engine      │        │
│  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────┘
```

### Key Components

| Component               | Role                                 |
| ----------------------- | ------------------------------------ |
| Jira Core               | Issue tracking, boards, backlog      |
| Jira Software           | Scrum/Kanban boards, sprint planning |
| Jira Service Management | ITSM, incident management            |
| Jira Work Management    | Business project management          |
| Confluence              | Knowledge base and documentation     |
| Atlassian Intelligence  | AI features (Rovo)                   |
| Marketplace             | 3,000+ third-party integrations      |

### Data Model

- **Issues**: Work items with types, statuses, fields
- **Projects**: Containers for issues with workflows
- **Workflows**: State machines for issue transitions
- **Sprints**: Time-boxed iterations for Scrum
- **Boards**: Visual views (Scrum, Kanban)
- **Epics**: Large bodies of work spanning multiple issues
- **Versions**: Release versions with issue associations
- **Components**: Sub-sections of projects

### Deployment Options

1. **Cloud (SaaS)**: Multi-tenant, managed by Atlassian
2. **Data Center (On-premises)**: Self-hosted, deprecation announced (March 2029)
3. **Jira Go**: New self-hosted option (announced 2026)

## Folder Structure

Jira is a SaaS product — there is no folder structure for users. The conceptual organization is:

```
Organization
├── Site (e.g., company.atlassian.net)
│   ├── Project: Backend
│   │   ├── Board: Backend Kanban
│   │   ├── Backlog
│   │   ├── Issues (Stories, Bugs, Tasks)
│   │   ├── Sprints
│   │   ├── Releases
│   │   └── Components
│   ├── Project: Frontend
│   ├── Project: DevOps
│   └── Settings
│       ├── Workflows
│       ├── Issue Types
│       ├── Fields
│       ├── Screens
│       ├── Permissions
│       └── Automation
```

## Navigation

### Top Navigation

- **Your Work**: Assigned issues, recent projects, dashboards
- **Projects**: List of accessible projects
- **Filters**: Saved JQL queries
- **Dashboards**: Customizable metric views
- **Boards**: Scrum and Kanban boards

### Project Navigation

- **Board**: Visual task board (Scrum or Kanban)
- **Backlog**: Prioritized issue list
- **Active Sprint**: Current sprint view
- **Releases**: Version management
- **Reports**: Agile metrics and charts
- **Components**: Project sub-sections

### Sidebar

- **Project shortcut**: Quick access to project
- **Board configuration**: Board settings
- **Filters**: Quick filter access
- **Recent**: Recently viewed issues

### Search (JQL)

- **Basic search**: Point-and-click filters
- **Advanced search**: Jira Query Language (JQL)
- Example: `project = BACKEND AND status = "In Progress" AND assignee = currentUser()`
- Saved filters for reuse
- Dashboard gadgets with filter results

## Workflows

### Issue Creation

1. Navigate to Project → Create Issue
2. Select issue type (Story, Bug, Task, Epic)
3. Fill in required fields (summary, description)
4. Set priority, assignee, sprint, labels
5. Submit — triggers automation rules and notifications

### Scrum Workflow

1. Product Owner creates and prioritizes backlog
2. Team plans sprint from backlog
3. Team works through sprint backlog
4. Daily standups track progress
5. Sprint review and retrospective
6. Repeat

### Kanban Workflow

1. Items flow through columns (To Do, In Progress, Done)
2. Work in Progress (WIP) limits enforce focus
3. Continuous flow without fixed iterations
4. Board shows current state of all work

### Release Process

1. Create Version (e.g., v1.0.0)
2. Associate issues with version
3. Track version progress
4. Release version when ready
5. Generate release notes from completed issues

## Permissions

### Role Model

- **Jira Administrator**: Full system configuration
- **Project Administrator**: Project-level configuration
- **Project Member**: Create and edit issues
- **Viewer**: Read-only access

### Access Control

- **Project Roles**: Customizable roles with permission schemes
- **Permission Schemes**: Fine-grained permission configurations
- **Issue Security Schemes**: Restrict issue visibility
- **Workflow Schemes**: Associate workflows with issue types
- **Field Configuration Schemes**: Control field visibility

### Team Structure

```
Organization
├── Group: Engineering
│   ├── Project: Backend (Project Role: Developers)
│   └── Project: Frontend (Project Role: Developers)
├── Group: QA
│   ├── Project: Backend (Project Role: Testers)
│   └── Project: Frontend (Project Role: Testers)
└── Group: DevOps
    └── Project: Infrastructure (Project Role: Admins)
```

## Collaboration

### Issue Collaboration

- **Comments**: Rich text with @mentions
- **Attachments**: File uploads and images
- **Watchers**: Follow issue updates
- **Activity log**: Complete issue history
- **Time tracking**: Log time spent on issues

### Board Collaboration

- **Daily standups**: Board-based progress tracking
- **Swimlanes**: Group issues by assignee, label, or custom field
- **Quick filters**: Filter board view

### Real-time Collaboration

- **Confluence integration**: Link issues to documentation
- **Slack/Microsoft Teams**: Notifications and issue creation
- **Bitbucket/GitHub integration**: Link issues to code

## Search

### JQL (Jira Query Language)

- `project = PROJECT AND status = "In Progress"`
- `assignee = currentUser() AND priority = High`
- `created >= -7d AND type = Bug`
- `cf[10001] ~ "keyword"` (custom field search)

### Saved Filters

- Store frequently used JQL queries
- Share filters with team members
- Use in dashboards and boards

### Global Search

- Search across issues, projects, people
- Full-text search in issue content
- Filter by project, type, status, assignee

## Issue Management

### Issue Types

- **Epic**: Large body of work
- **Story**: User-facing feature
- **Task**: Work item
- **Bug**: Defect
- **Sub-task**: Breakdown of story/task
- **Custom types**: Configurable per project

### Fields

- **Standard fields**: Summary, Description, Priority, Status, Assignee
- **Custom fields**: Text, number, date, select, user, URL
- **System fields**: Created, Updated, Reporter, Labels

### Labels

- Custom labels for categorization
- Multiple labels per issue
- Filter by label in JQL

### Sprints

- Time-boxed iterations (typically 1-2 weeks)
- Sprint goal and planning
- Velocity tracking
- Burndown and burnup charts

### Boards

- **Scrum board**: Sprint-based workflow
- **Kanban board**: Continuous flow
- **Custom boards**: Filtered views across projects

### Epics

- Large bodies of work spanning multiple issues
- Epic link field associates stories to epics
- Epic board for cross-project tracking

### Versions

- Release versions with issue associations
- Version progress tracking
- Release notes generation

## Code Review

Jira does not have built-in code review. It integrates with:

- **Bitbucket**: Pull requests linked to issues
- **GitHub**: Pull requests linked to issues
- **GitLab**: Merge requests linked to issues

Code review happens in the connected code hosting platform.

## Releases

### Release Management

- Create versions with release dates
- Associate issues with versions
- Track version progress (open/closed issues)
- Generate release notes from completed issues
- Deploy versions to environments

### Release Notes

- Auto-generated from completed issues
- Custom release notes templates
- Integration with Confluence for documentation

## Notifications

### Notification Channels

- **Email**: Per-event configuration
- **In-app**: Notification center
- **Slack**: Issue updates and creation
- **Microsoft Teams**: Issue updates
- **Mobile**: Push notifications (iOS/Android)

### Notification Preferences

- Watch issues, projects, or filters
- Notification schemes per project
- Custom notification templates
- Email batching and digest

## Automation

### Atlassian Automation

- No-code automation rules
- Triggers: issue created, updated, transitioned
- Conditions: field values, user, project
- Actions: update fields, send notifications, create issues
- Global and project-level rules
- Rule limits vary by plan (100-1000 runs/month)

### Marketplace Integrations

- 3,000+ apps in Atlassian Marketplace
- CI/CD: Jenkins, CircleCI, GitHub Actions
- Monitoring: PagerDuty, OpsGenie
- Testing: Zephyr, Xray, TestRail
- Time tracking: Tempo, Clockify
- Reporting: eazyBI, Custom Charts

### API

- **REST API**: Comprehensive CRUD operations
- **Webhooks**: Event-driven notifications
- **Connect framework**: Add-on development
- **Forge**: Serverless app development

## AI Integration

### Atlassian Intelligence (Rovo)

- **Work summaries**: AI-generated issue summaries
- **Sprint risk identification**: Predict sprint completion risk
- **Issue classification**: Auto-categorize issues
- **Search enhancement**: AI-powered search results
- **Confluence AI**: Document summarization and generation

### Jira AI Features (2026)

- **Jira Agents**: AI-powered task automation
- **Agentic workflows**: Connect agents from any system
- **MCP Server**: Enable GitHub Copilot to interact with Jira
- **Rovo**: AI assistant across Atlassian products

## Design Patterns

### Platform Patterns

- **Workflow engine**: State machines for issue transitions
- **Field configuration**: Customizable fields per project
- **Permission schemes**: Reusable permission configurations
- **Issue security**: Fine-grained visibility control
- **Automation rules**: Event-driven automation

### Data Patterns

- **JQL**: SQL-like query language for issues
- **Custom fields**: Extensible data model
- **Issue linking**: Relationships between issues
- **Attachments**: File-based document management

## UX Observations

### What Works Well

- **Customization**: Highly configurable workflows, fields, and screens
- **Ecosystem**: 3,000+ Marketplace apps for any need
- **Agile support**: Best-in-class Scrum and Kanban boards
- **Enterprise features**: Advanced permissions, audit logs, compliance
- **Reporting**: Extensive agile metrics and charts

### What Doesn't Work Well

- **Complexity**: Overwhelming configuration options
- **Performance**: Can be slow with many issues
- **UI inconsistency**: Multiple UI versions (classic, next-gen)
- **Pricing**: Add-on costs compound quickly
- **Learning curve**: Steep for new users

### What's Innovative

- **JQL**: Powerful query language for issues
- **Automation rules**: No-code workflow automation
- **Marketplace**: Massive ecosystem of integrations
- **Jira Agents**: AI-powered task automation (2026)

## Reusable Ideas

1. **JQL**: Powerful query language for filtering and reporting
2. **Workflow engine**: Configurable state machines for issue transitions
3. **Automation rules**: Event-driven automation without code
4. **Permission schemes**: Reusable permission configurations
5. **Issue linking**: Relationships between work items
6. **Sprint metrics**: Velocity, burndown, and burnup charts

## Risks

- **Complexity**: Overwhelming configuration can lead to "Jira sprawl"
- **Cost**: Base price + Confluence + add-ons compound quickly
- **Performance**: Slow with large issue counts
- **Cloud lock-in**: Data Center deprecated by 2029
- **UI fragmentation**: Multiple UI versions create confusion
- **No built-in CI/CD**: Requires external tools for development workflows

## Evidence

- **Source**: https://www.atlassian.com/software/jira, https://support.atlassian.com/jira-cloud-administration/
- **Date collected**: 2026-08-03
- **Why it matters**: Jira is the enterprise standard for project management with unmatched ecosystem breadth
- **Trade-offs**: Flexibility and customization vs. complexity and cost
- **Expected value**: Comprehensive project management with deep customization
- **Maintenance burden**: Low for cloud (SaaS), high for Data Center (deprecated)

## Pricing (2026)

| Plan       | Price                 | Key Features                                    |
| ---------- | --------------------- | ----------------------------------------------- |
| Free       | $0                    | Up to 10 users, 2GB storage, basic boards       |
| Standard   | $7.91/user/month      | Up to 100K users, 250GB, audit logs             |
| Premium    | $14.54/user/month     | Unlimited storage, 99.9% SLA, Advanced Roadmaps |
| Enterprise | Custom (~$20-25/user) | Multi-site, analytics, 99.95% SLA               |

**Hidden costs:**

- Confluence: $6.05/user/month (Standard)
- Zephyr Scale: $10/user/month (test management)
- Tempo Timesheets: $12/user/month (time tracking)
- Additional automation runs beyond plan limits
