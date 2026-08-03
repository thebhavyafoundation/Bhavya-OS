# Azure DevOps — Knowledge Package

## Executive Summary

Azure DevOps is Microsoft's comprehensive DevOps platform that provides a complete set of tools for software development lifecycle management. It includes Azure Boards (work tracking), Azure Repos (source control), Azure Pipelines (CI/CD), Azure Test Plans (testing), and Azure Artifacts (package management). Azure DevOps is available as a cloud service (SaaS) and as an on-premises server product (Azure DevOps Server, formerly TFS).

Azure DevOps is designed for enterprise development teams, particularly those in the Microsoft ecosystem. It integrates deeply with Visual Studio, Visual Studio Code, Azure cloud services, and GitHub. The platform supports any language, platform, and cloud deployment target — not just Microsoft technologies. Azure DevOps is included with Visual Studio subscriptions and GitHub Enterprise, making it a cost-effective choice for organizations already in the Microsoft ecosystem.

For Bhavya Foundation, Azure DevOps represents a viable option for teams heavily invested in the Microsoft ecosystem. Its strength is the tight integration between boards, repos, pipelines, and test plans — all sharing a unified project structure. The free tier is generous (5 users free, 1,800 CI/CD minutes/month), and the per-user pricing ($6/user/month) is competitive. However, Azure DevOps lacks the ecosystem breadth of GitHub and the AI capabilities of newer platforms. It is also less suitable for open-source projects compared to GitHub.

## Architecture

### Platform Architecture

Azure DevOps is a multi-tenant cloud service built on Azure infrastructure:

```
┌─────────────────────────────────────────────┐
│           Azure DevOps Services             │
│  ┌───────────┐  ┌───────────┐              │
│  │  Boards   │  │   Repos   │              │
│  │  (Work    │  │  (Git +   │              │
│  │  Tracking)│  │   TFVC)   │              │
│  └─────┬─────┘  └─────┬─────┘              │
│        │              │                    │
│  ┌─────▼──────────────▼─────┐              │
│  │    Azure DevOps Core     │              │
│  │  (Identity, Auth, APIs)  │              │
│  └──────────────────────────┘              │
│                                             │
│  ┌───────────┐  ┌───────────┐              │
│  │ Pipelines │  │  Artifacts│              │
│  │  (CI/CD)  │  │ (Packages)│              │
│  └─────┬─────┘  └─────┬─────┘              │
│        │              │                    │
│  ┌─────▼──────────────▼─────┐              │
│  │    Azure Pipelines       │              │
│  │  (Build + Release)       │              │
│  └──────────────────────────┘              │
│                                             │
│  ┌───────────┐  ┌───────────┐              │
│  │ Test Plans│  │  Wiki     │              │
│  │ (Testing) │  │ (Docs)    │              │
│  └───────────┘  └───────────┘              │
└─────────────────────────────────────────────┘
```

### Core Components

| Component        | Role           | Description                                    |
| ---------------- | -------------- | ---------------------------------------------- |
| Azure Boards     | Work tracking  | Scrum, Kanban, Agile boards, backlogs, queries |
| Azure Repos      | Source control | Git repositories (unlimited private)           |
| Azure Pipelines  | CI/CD          | Build, test, deploy any language/platform      |
| Azure Test Plans | Testing        | Manual and exploratory testing                 |
| Azure Artifacts  | Packages       | NuGet, npm, Maven, Python packages             |
| Azure Plan       | Planning       | Delivery plans across teams                    |

### Project Structure

```
Organization
├── Project: MyApp
│   ├── Boards (Work items, backlogs, boards)
│   ├── Repos (Git repositories)
│   ├── Pipelines (CI/CD definitions)
│   ├── Test Plans (Test cases and plans)
│   ├── Artifacts (Package feeds)
│   ├── Wiki (Documentation)
│   └── Settings (Organization and project settings)
```

### Integration Points

- **GitHub**: Bidirectional integration (Azure Boards ↔ GitHub Issues)
- **Azure Cloud**: Deep deployment integration
- **Visual Studio**: IDE integration for code and work items
- **Visual Studio Code**: Extension for work item management
- **Microsoft Teams**: Notifications and work item creation
- **Slack**: Notifications and work item creation

## Folder Structure

An Azure DevOps project:

```
my-project/
├── azure-pipelines.yml      # CI/CD pipeline definition
├── src/
├── tests/
├── docs/
│   └── wiki/                # Azure DevOps Wiki
├── README.md
├── LICENSE
└── .gitignore
```

Azure DevOps-specific files:

- `azure-pipelines.yml` — CI/CD pipeline configuration
- Wiki pages stored in repository or service

## Navigation

### Top Navigation

- **Home**: Dashboard with project overview
- **Boards**: Work item tracking and boards
- **Repos**: Source code management
- **Pipelines**: CI/CD build and release
- **Test Plans**: Test management
- **Artifacts**: Package management
- **Wiki**: Documentation

### Boards Navigation

- **Work Items**: List of all work items
- **Backlog**: Product backlog view
- **Board**: Kanban board view
- **Sprint**: Sprint planning and tracking
- **Queries**: Work item queries (WIQL)

### Repos Navigation

- **Files**: Code browser
- **Commits**: Commit history
- **Branches**: Branch management
- **Pull Requests**: Code review
- **Branch Policies**: Merge requirements

### Search

- Global search across work items, code, wiki
- Work item search with field filters
- Code search with file path and content filters
- Wiki search

## Workflows

### Work Item Creation

1. Navigate to Boards → New Work Item
2. Select type (Epic, Issue, Task, Bug)
3. Fill in title, description, priority
4. Assign to area path and iteration
5. Set tags and links
6. Save — triggers notifications and automation

### Agile Workflow

1. Product Owner manages product backlog
2. Team plans sprint from backlog
3. Team works through sprint backlog
4. Daily standups track progress
5. Sprint review and retrospective
6. Repeat

### CI/CD Pipeline

1. Define `azure-pipelines.yml` in repository
2. Push triggers pipeline automatically
3. Build agent compiles and tests
4. Release pipeline deploys to environments
5. Approval gates for production deployments

### Pull Request Workflow

1. Create branch → commit → push
2. Create Pull Request in Azure Repos
3. Request reviewers
4. CI/CD pipeline runs
5. Reviewers approve or request changes
6. Complete merge with policies

## Permissions

### Role Model (Organization Level)

- **Organization Owner**: Full control over organization
- **Project Administrator**: Full project control
- **Project Contributor**: Create and edit work items, code
- **Project Reader**: Read-only access

### Access Control

- **Azure AD Groups**: Organizational identity management
- **Project Groups**: Team-based access
- **Area Permissions**: Fine-grained work item access
- **Branch Policies**: Code merge requirements
- **Environment Approvals**: Deployment gates

### Team Structure

```
Organization
├── Project: Engineering
│   ├── Team: Backend
│   ├── Team: Frontend
│   └── Team: DevOps
├── Project: Design
│   └── Team: Designers
└── Project: QA
    └── Team: Testers
```

## Collaboration

### Work Item Collaboration

- **Comments**: Rich text comments with @mentions
- **Discussions**: Threaded discussions on work items
- **Links**: Link work items to code, PRs, other work items
- **Attachments**: File uploads
- **@Mentions**: Notify specific team members

### Code Collaboration

- **Pull Requests**: Code review with inline comments
- **Branch Policies**: Require reviews and builds
- **Code Owners**: Automatic review assignment
- **Conflict Resolution**: Merge conflict tools

### Real-time Collaboration

- **Microsoft Teams**: Notifications and work item creation
- **Slack**: Notifications and work item creation
- **Azure Boards Integration**: Bidirectional GitHub issue sync

## Search

- **Work Item Search**: Search across all work items
- **Code Search**: Full-text code search with language filters
- **Wiki Search**: Search documentation
- **Advanced Filters**: WIQL queries for work items
- **Saved Queries**: Reusable work item queries

## Issue Management

### Work Item Types

- **Epic**: Large body of work
- **Issue**: User story or feature
- **Task**: Work item
- **Bug**: Defect
- **Test Case**: Testing work item
- **Custom types**: Configurable per project

### Fields

- **Standard fields**: Title, Description, Priority, State, Assigned To
- **Custom fields**: Text, number, date, picklist, rich text
- **System fields**: Created Date, Changed Date, Area Path, Iteration Path

### Area Paths

- Hierarchical project organization
- Work item categorization by area
- Area-based permissions

### Iteration Paths

- Sprint and release planning
- Time-boxed iteration tracking
- Hierarchical iterations (releases → sprints)

### Boards

- **Kanban board**: Continuous flow visualization
- **Scrum board**: Sprint-based workflow
- **Custom boards**: Filtered views
- **Swimlanes**: Group work items by field

### Queries (WIQL)

- Work Item Query Language (SQL-like)
- Filter by any field
- Save and share queries
- Use in dashboards and boards

## Code Review

### Pull Request Features

- **Inline Comments**: Line-by-line code review
- **Threaded Discussions**: Conversation on code changes
- **Branch Policies**: Require reviews, builds, linked work items
- **Code Owners**: Automatic review assignment
- **Auto-complete**: Auto-merge when policies pass

### Diff Viewing

- Side-by-side diff view
- Inline diff view
- Image diff support
- File comparison tools

## Releases

### Release Management

- **Releases**: Versioned deployments with approval gates
- **Environments**: Target deployment stages (Dev, Test, Prod)
- **Artifacts**: Package-based deployments
- **Approvals**: Manual approval gates per environment
- **Deployment groups**: Target machine groups

### Deployment Strategies

- **Classic Releases**: UI-based pipeline configuration
- **YAML Pipelines**: Code-based pipeline definition
- **Multi-stage pipelines**: CI/CD in single YAML file

## Notifications

### Notification Channels

- **Email**: Per-event configuration
- **Microsoft Teams**: Chat integration
- **Slack**: Chat integration
- **Webhooks**: Custom HTTP endpoints

### Notification Preferences

- Per-project notification settings
- Work item field change notifications
- Build and release notifications
- Code review notifications

## Automation

### Azure Pipelines

- YAML-based CI/CD definitions
- Multi-platform builds (Linux, macOS, Windows)
- Parallel jobs and stages
- Deployment gates and approvals
- Self-hosted and Microsoft-hosted agents

### Marketplace Extensions

- 1,000+ extensions in Visual Studio Marketplace
- CI/CD: Jenkins, Docker, Kubernetes
- Testing: TestRail, SonarQube
- Reporting: Custom dashboards and charts

### API

- REST API for all services
- Webhooks for event notifications
- OAuth 2.0 and PAT authentication
- Graph API for organization management

## AI Integration

### GitHub Copilot Integration

- **Copilot Code Review**: AI-powered PR review
- **Copilot in Azure Boards**: AI-assisted work item creation
- **Azure DevOps MCP Server**: Enable Copilot to interact with Azure DevOps

### Azure DevOps AI Features (2026)

- **AI-assisted work item creation**: Generate descriptions from titles
- **Test case generation**: AI-powered test case creation
- **Build failure analysis**: AI-assisted pipeline troubleshooting

## Design Patterns

### Platform Patterns

- **Unified project model**: All services share project structure
- **Work item hierarchy**: Epic → Issue → Task → Sub-task
- **Area/Iteration paths**: Hierarchical organization
- **Pipeline as Code**: YAML-based CI/CD definitions
- **Extension framework**: Pluggable marketplace integrations

### Data Patterns

- **WIQL**: Work Item Query Language for filtering
- **Link types**: Relationships between work items
- **Area paths**: Hierarchical project categorization
- **Iteration paths**: Time-boxed planning

## UX Observations

### What Works Well

- **Unified platform**: All DevOps tools in one place
- **Microsoft ecosystem**: Deep Visual Studio and Azure integration
- **Pricing**: Competitive with generous free tier
- **YAML pipelines**: Modern CI/CD as code
- **Enterprise features**: Advanced permissions and compliance

### What Doesn't Work Well

- **UI inconsistency**: Multiple UI versions (classic vs. modern)
- **Performance**: Can be slow with large projects
- **Learning curve**: Many features with complex configuration
- **Ecosystem**: Smaller extension marketplace than GitHub
- **Open-source focus**: Less suitable for public OSS projects

### What's Innovative

- **Unified project model**: All services share one project structure
- **Deployment gates**: Automated approval workflows
- **Managed DevOps Pools**: Custom agent pool management
- **Azure DevOps MCP Server**: AI-powered integration with Copilot

## Reusable Ideas

1. **Unified project model**: All services in one project structure
2. **WIQL queries**: Powerful work item filtering language
3. **Deployment gates**: Automated approval workflows
4. **Area/Iteration paths**: Hierarchical project organization
5. **Pipeline as Code**: YAML-based CI/CD definitions
6. **Extension framework**: Pluggable marketplace integrations

## Risks

- **Microsoft dependency**: Deep Azure and Visual Studio lock-in
- **Cloud-first**: Data Center deprecated by 2029
- **UI fragmentation**: Multiple UI versions create confusion
- **Feature gaps**: Less feature-rich than GitHub for open source
- **Ecosystem**: Smaller marketplace than GitHub
- **Performance**: Can be slow at scale

## Evidence

- **Source**: https://azure.microsoft.com/en-us/products/devops, https://learn.microsoft.com/en-us/azure/devops/
- **Date collected**: 2026-08-03
- **Why it matters**: Azure DevOps is the enterprise standard for Microsoft-centric development teams with unified DevOps tools
- **Trade-offs**: Unified platform and Microsoft integration vs. ecosystem breadth and open-source support
- **Expected value**: Complete DevOps platform with deep Azure and Visual Studio integration
- **Maintenance burden**: Low for cloud (SaaS), medium for self-hosted (deprecated)

## Pricing (2026)

| Plan                       | Price                                  | Key Features                                     |
| -------------------------- | -------------------------------------- | ------------------------------------------------ |
| Stakeholder                | Free                                   | View/edit work items, limited project visibility |
| Basic                      | First 5 users free, then $6/user/month | Boards, Repos, Pipelines, Artifacts              |
| Basic + Test Plans         | $52/user/month                         | Everything in Basic + manual/exploratory testing |
| Visual Studio Subscription | Included                               | Basic access for VS subscribers                  |
| GitHub Enterprise          | Included                               | Basic access for GitHub Enterprise users         |

**CI/CD Pricing:**

- 1 free Microsoft-hosted parallel job (1,800 minutes/month)
- Additional Microsoft-hosted jobs: $40/parallel job/month
- 1 free self-hosted parallel job (unlimited minutes)
- Additional self-hosted jobs: $15/parallel job/month

**Storage:**

- Azure Artifacts: 2 GiB free, then $2/GiB (2-10 GiB)
- Scales to $0.25/GiB for 1,000+ GiB

**No per-user licensing for Pipelines and Artifacts access — all users can use these services.**
