# GitLab — Knowledge Package

## Executive Summary

GitLab is a complete DevSecOps platform that provides a single application for the entire software development lifecycle. Founded in 2011, GitLab offers source code management, CI/CD, package registry, security scanning, project management, and deployment — all in one integrated platform. It is available as a SaaS (GitLab.com) or self-managed deployment, and is used by organizations ranging from startups to Fortune 500 enterprises.

GitLab's architecture is a Ruby on Rails monolith with 20+ microservices (Gitaly, Workhorse, Sidekiq, Pages, Registry, etc.), backed by PostgreSQL and Redis. The platform runs on Kubernetes in its cloud offering and provides reference architectures for self-hosted deployments from 1,000 to 50,000+ users. GitLab's "single application" philosophy means all features share the same data model, UI, and access controls — eliminating integration complexity but creating a heavy deployment footprint.

For Bhavya Foundation, GitLab represents a comprehensive alternative to GitHub with stronger built-in security scanning, a more integrated CI/CD pipeline, and a self-hosted option that provides full data sovereignty. The trade-off is significantly higher resource requirements (several GB RAM minimum) and a more complex deployment architecture. GitLab's Duo AI features (code suggestions, chat, vulnerability explanation) are included in Premium/Ultimate tiers.

## Architecture

### Core Architecture

GitLab follows a modular monolith pattern with the following key components:

```
┌─────────────────────────────────────────────────┐
│                    NGINX                         │
│              (Reverse Proxy)                     │
└──────────┬──────────────┬───────────────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼─────────┐
    │  Workhorse  │  │  GitLab Pages│
    │  (Smart     │  │  (Static     │
    │   Proxy)    │  │   Sites)     │
    └──────┬──────┘  └──────────────┘
           │
    ┌──────▼──────┐
    │    Puma     │
    │  (Rails     │
    │   App)      │
    └──────┬──────┘
           │
    ┌──────┼──────────────┐
    │      │              │
┌───▼──┐ ┌▼────────┐ ┌───▼────┐
│Post- │ │  Redis   │ │Gitaly  │
│greSQL│ │(Cache +  │ │(Git    │
│      │ │  Queue)  │ │ RPC)   │
└──────┘ └─────────┘ └────────┘
```

### Component Details

| Component    | Language | Role                            | Resource Impact  |
| ------------ | -------- | ------------------------------- | ---------------- |
| Puma (Rails) | Ruby     | Web UI + API server             | High (CPU + RAM) |
| Sidekiq      | Ruby     | Background job processor        | High (RAM)       |
| Gitaly       | Go       | Git RPC service                 | Medium           |
| Workhorse    | Go       | Smart reverse proxy, large HTTP | Low-Medium       |
| Shell        | Go       | SSH session handling            | Low              |
| PostgreSQL   | SQL      | Persistent database             | High (RAM + I/O) |
| Redis        | C        | Caching, job queue, sessions    | Medium           |
| Registry     | Go       | Container registry              | Medium           |
| Pages        | Go       | Static site hosting             | Low              |
| Praefect     | Go       | Gitaly proxy for HA             | Low              |

### Database Architecture

- **PostgreSQL**: Primary persistent store (users, permissions, issues, metadata)
- **Redis**: Non-persistent cache, job queue backend (Sidekiq), session store
- **Object Storage**: S3-compatible for CI artifacts, LFS, uploads, container images
- **Gitaly**: Git repository storage (replaces NFS in distributed deployments)
- **Praefect**: Transparent proxy for Gitaly HA (repository-level replication)

### Deployment Options

1. **Omnibus Package**: Single package with all components (VM-based)
2. **Cloud Native (Helm)**: All components in Kubernetes (recommended for new deployments)
3. **Cloud Native Hybrid**: Stateless components in K8s, stateful on VMs
4. **Reference Architectures**: Tested configurations for 1K-50K+ users

### Scalability

- Standalone: Up to 2,000 users
- HA (3,000+ users): PostgreSQL replication, Redis Sentinel, Gitaly Cluster
- Cloud Native: Kubernetes-based, scales to 50,000+ users
- GitLab Geo: Cross-regional distribution and disaster recovery

## Folder Structure

A typical GitLab repository:

```
my-project/
├── .gitlab/
│   ├──-ci.yml              # GitLab CI/CD pipeline definition
│   ├──issue_templates/     # Issue templates
│   │   ├── bug.md
│   │   └── feature.md
│   ├── merge_request_templates/  # MR templates
│   │   └── default.md
│   └── approval_rules.yml  # Code review rules
├── .gitlab-ci.yml          # Main CI/CD configuration
├── src/
├── tests/
├── docs/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── .gitignore
```

GitLab-specific files:

- `.gitlab-ci.yml` — CI/CD pipeline configuration
- `.gitlab/issue_templates/` — Issue templates
- `.gitlab/merge_request_templates/` — MR templates
- `SECURITY.md` — Security policy
- `.gitlab/approval_rules.yml` — Merge request approval rules

## Navigation

### Top Navigation

- **Dashboard**: Activity feed, starred projects, assigned issues/MRs
- **Projects**: List of accessible projects
- **Groups**: Organizational units containing projects
- **Milestones**: Cross-project milestone tracking
- **Snippets**: Code snippets (public and private)

### Sidebar Navigation (Per Project)

- **Project Home**: Overview, activity, files
- **Repository**: Code, branches, tags, commits
- **Plan**: Issues, boards, milestones, wiki
- **Code**: Merge requests, CI/CD pipelines
- **Build**: Pipelines, jobs, artifacts
- **Deploy**: Environments, releases, feature flags
- **Monitor**: Metrics, logs, traces, alerts
- **Secure**: Security dashboard, vulnerability management
- **Analyze**: Value stream analytics, CI/CD analytics
- **Settings**: General, repository, CI/CD, access tokens

### Global Search

- `Ctrl+K` — Command palette / global search
- Search across projects, issues, MRs, code, users
- Advanced search with filters (project, group, author, date)

## Workflows

### Issue Creation

1. Navigate to Project → Issues → New Issue
2. Select issue template (bug, feature, custom)
3. Fill in title, description, labels, assignees, milestone, weight
4. Set confidentiality if needed
5. Submit — triggers notifications and CI/CD hooks

### Merge Request Workflow

1. Create branch → commit → push to remote
2. Create Merge Request with description
3. Assign reviewers (manual or Approval Rules)
4. CI/CD pipeline runs automatically
5. Reviewers approve or request changes
6. Pipeline must pass (if required by approval rules)
7. Squash merge, merge commit, or fast-forward

### CI/CD Pipeline (GitLab CI)

1. Define `.gitlab-ci.yml` with stages and jobs
2. Push triggers pipeline automatically
3. Jobs run on shared runners or specific runners
4. Artifacts passed between stages
5. Environments track deployments
6. Release job creates GitLab Releases

### Release Process

1. Tag commit (e.g., `v1.0.0`)
2. Create Release via UI or `release-cli`
3. Add release notes, assets, and links
4. Link to deployed environment
5. Auto-generate changelog from merged MRs

## Permissions

### Role Model (5-Level Hierarchy)

1. **Guest**: View project, read issues (if allowed)
2. **Reporter**: Create issues, view code
3. **Developer**: Push to non-protected branches, create MRs
4. **Maintainer**: Push to protected branches, manage CI/CD, deploy
5. **Owner**: Full project/group control, billing, transfer

### Access Control

- **Groups**: Organizational containers with inherited permissions
- **Subgroups**: Nested group hierarchy
- **Project Access Tokens**: Scoped API access
- **Personal Access Tokens**: User-level API access
- **Protected Branches**: Merge approvals, push restrictions
- **Protected Tags**: Tag creation restrictions
- **Deployment Protection Rules**: Environment-specific approvals

### Team Structure

```
Namespace (User/Organization)
├── Group: Engineering
│   ├── Subgroup: Frontend
│   │   └── Project: web-app
│   └── Subgroup: Backend
│       ├── Project: api
│       └── Project: database
├── Group: DevOps
│   └── Project: infrastructure
└── Group: Design
    └── Project: design-system
```

## Collaboration

### Merge Request Reviews

- Inline code comments with suggestions
- Approval rules (required reviewers, approvals)
- Merge trains for sequential pipeline validation
- Draft MRs (work in progress)
- Push options for auto-merge

### Issues and Epics

- Issues with labels, milestones, assignees, weight
- Epics for cross-project initiative tracking
- Issue boards (Kanban/Scrum)
- Related issues and blocking relationships
- Design management (design artifacts attached to issues)

### Real-time Collaboration

- GitLab Duo Chat for AI-assisted discussions
- Web IDE for collaborative editing
- Conflict resolution in merge requests

## Search

- **Global Search**: Projects, issues, MRs, code, users, wiki
- **Advanced Search**: Elasticsearch/Zoekt-powered full-text search
- **Code Search**: Repository content with language filters
- **Commit Search**: Search commit messages and diffs
- **Wiki Search**: Search across project wikis
- **Security Dashboard**: Search vulnerabilities across projects

## Issue Management

### Issue Types

- Issues (standard work items)
- Epics (cross-project initiatives, Premium+)
- Confidential issues (restricted visibility)
- Design management (attached designs)

### Labels

- Custom labels with colors and descriptions
- Scoped labels (e.g., `type::bug`, `status::in-progress`)
- Group-level and project-level labels

### Milestones

- Project milestones (single project)
- Group milestones (cross-project)
- Cross-project milestones (Premium+)
- Burndown and burnup charts

### Boards

- Kanban boards with customizable lists
- Scrum boards with sprint support
- Board filters (assignee, label, milestone)
- Multiple boards per project

### Time Tracking

- Estimate and track time on issues
- Time reporting and summaries
- Time tracking API

## Code Review

### Merge Request Features

- **Inline Comments**: Line-by-line code review
- **Suggestions**: Apply suggested changes directly
- **Approval Rules**: Required reviewers, minimum approvals
- **Approval Groups**: Named groups of approvers
- **Merge Trains**: Sequential pipeline validation
- **Code Owner Approval**: CODEOWNERS-based auto-assignment
- **Push Options**: CLI-based auto-merge

### Diff Viewing

- Side-by-side and inline diff views
- Syntax highlighting for 100+ languages
- Image diff (visual comparison)
- Markdown rendering preview
- Collapsed/expanded file sections

## Releases

### Release Management

- GitLab Releases with versioned tags
- Release notes (Markdown)
- Asset links (binaries, packages)
- Evidence attachments (security scans)
- Auto-generated changelogs from merged MRs

### Release Approvals

- Release approval workflows
- Protected environments
- Deployment gates

## Notifications

### Notification Channels

- **Email**: Per-event configuration
- **In-app**: Notification center
- **Webhooks**: Custom HTTP endpoints
- **Slack/Mattermost**: Chat integration
- **Microsoft Teams**: Chat integration

### Notification Preferences

- Global notification settings
- Per-project notification levels (Watching, Participating, Mentioned)
- Custom notification filters
- Notification email batching

## Automation

### GitLab CI/CD

- YAML-based pipeline definitions
- 10,000+ community CI templates
- Multi-project and parent-child pipelines
- DAG (Directed Acyclic Graph) pipelines
- Dynamic child pipelines
- Review apps for automatic environment creation
- Container registry integration

### Auto DevOps

- Automatic detection of project language/framework
- Pre-built CI/CD templates
- Automatic security scanning
- Automatic deployment to Kubernetes

### Webhooks

- Project and group-level webhooks
- Events: push, merge, issue, pipeline, deployment
- JSON payloads with detailed event data

### API

- REST API v4
- GraphQL API (available in GitLab)
- Webhooks for event-driven integrations

## AI Integration

### GitLab Duo

- **Code Suggestions**: AI-powered code completion
- **Duo Chat**: Conversational coding assistance
- **Vulnerability Explanation**: AI-powered security analysis
- **Root Cause Analysis**: CI/CD pipeline failure analysis
- **Code Review Summary**: AI-generated MR summaries
- **Discussion Summary**: Issue/MR discussion summaries
- **Duo Workflow**: Agentic task completion (beta)

### Duo Pricing

- Included in Premium and Ultimate tiers
- Duo Pro: $19/user/month (additional features)
- Duo Enterprise: Custom pricing (advanced security, self-hosted models)
- Duo with Amazon Q: Joint offering with AWS

## Design Patterns

### Platform Patterns

- **Single application architecture**: All features share data model and UI
- **Service decomposition**: Gitaly, Workhorse, Registry as separate services
- **Event-driven CI**: Pipeline triggers via webhooks and events
- **Protected environments**: Deployment approval gates
- **Geo replication**: Cross-regional data replication for DR

### CI/CD Patterns

- **Pipeline as Code**: `.gitlab-ci.yml` versioned with source
- **Runner selection**: Tags for runner affinity
- **Artifact passing**: Files shared between pipeline stages
- **Environment tracking**: Deployment state per environment
- **Feature flags**: Progressive delivery

## UX Observations

### What Works Well

- **Single application**: No integration hell between tools
- **Built-in CI/CD**: Deep integration with source code and MRs
- **Security scanning**: SAST, DAST, dependency scanning built-in
- **Self-hosted option**: Full data sovereignty
- **Geo replication**: Disaster recovery for on-premises

### What Doesn't Work Well

- **Resource requirements**: Heavy (several GB RAM minimum)
- **UI complexity**: Feature-rich but overwhelming for new users
- **Update process**: Self-hosted updates require careful planning
- **Performance**: Can be slow at scale without proper infrastructure
- **Learning curve**: Many features with non-obvious discoverability

### What's Innovative

- **Auto DevOps**: Automatic CI/CD pipeline detection
- **Merge trains**: Sequential pipeline validation to prevent broken main
- **Duo Agent Platform**: Agentic AI across the SDLC
- **Orbit Context Graph**: Cross-project context for AI assistants

## Reusable Ideas

1. **Single application philosophy**: One data model across all features — model for GitHub OS integration
2. **Auto DevOps**: Automatic pipeline detection — valuable for zero-config CI/CD
3. **Merge trains**: Sequential validation prevents broken main
4. **Protected environments**: Deployment approval gates
5. **Time tracking**: Built-in time estimation and tracking
6. **Geo replication**: Cross-regional data distribution
7. **Duo Agent Platform**: Agentic AI across the full SDLC

## Risks

- **Resource requirements**: Minimum 4GB RAM for small instances, much more for production
- **Complexity**: 20+ components to manage and monitor
- **Update risk**: Self-hosted updates can break installations
- **Vendor dependency**: GitLab Inc. controls the roadmap
- **Licensing**: CE is MIT, but EE features are proprietary
- **AI feature lock-in**: Duo features require paid tiers

## Evidence

- **Source**: https://about.gitlab.com, https://docs.gitlab.com/development/architecture/
- **Date collected**: 2026-08-03
- **Why it matters**: GitLab is the most comprehensive self-hosted DevSecOps platform, providing a complete alternative to GitHub
- **Trade-offs**: All-in-one integrated platform vs. heavy resource requirements and complex deployment
- **Expected value**: Full DevSecOps platform with built-in security, CI/CD, and project management
- **Maintenance burden**: High for self-hosted (20+ components), low for SaaS (gitlab.com)

## Pricing (2026)

| Plan         | Price                    | Key Features                                         |
| ------------ | ------------------------ | ---------------------------------------------------- |
| Free         | $0                       | 5 users, 400 CI minutes/month, 5GB storage           |
| Premium      | $29/user/month           | 50,000 CI minutes, Duo Code Suggestions, Geo         |
| Ultimate     | $99/user/month           | 50,000 CI minutes, Duo Enterprise, advanced security |
| Duo Pro      | $19/user/month           | Additional AI features, seat assignment controls     |
| Self-Managed | Free (CE) to custom (EE) | Full control, requires infrastructure                |
