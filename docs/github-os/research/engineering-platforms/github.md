# GitHub — Knowledge Package

## Executive Summary

GitHub is the world's largest software development platform, hosting over 200 million developers and 420+ million repositories. Founded in 2008 and acquired by Microsoft in 2018, GitHub provides Git hosting, code review, project management, CI/CD (Actions), package hosting, security scanning, and AI-assisted development (Copilot). It is the default platform for open-source software and a dominant choice for enterprise development teams.

GitHub's architecture has historically been a monolith built on Ruby on Rails with MySQL databases, but as of 2026 it is actively migrating to Azure infrastructure and decomposing into isolated microservices. The platform has experienced significant scaling challenges driven by rapid AI-assisted development growth, with 71 million Actions jobs per day (3x from 2024 levels). GitHub is investing heavily in infrastructure resilience — migrating monolith traffic to Azure (45% as of June 2026), extracting services like pullsd (pull request reads) and reposd, and isolating user/authentication domains to prevent cascading failures.

For Bhavya Foundation's GitHub OS project, GitHub represents both the primary platform to integrate with and a reference architecture for engineering tooling. Its ecosystem breadth is unmatched, but recent availability incidents and architectural growing pains are worth monitoring. The platform's pricing model (free for open source, $4/user/month Team, $21/user/month Enterprise) and Actions-based CI/CD make it accessible for foundations and nonprofits.

## Architecture

### Monolith-to-Microservices Transition

GitHub started as a Ruby on Rails monolith with a single MySQL database cluster (`mysql1`). As of 2026, the architecture is in active transition:

- **Primary stack**: Ruby on Rails (Puma), MySQL (via Vitess for sharding), Redis, Elasticsearch, Sidekiq
- **Infrastructure**: Migrating from on-premises to Azure cloud (target: 50%+ traffic served from Azure)
- **Service decomposition**: Extracting domain-specific services (users, pull requests, repositories) from the monolith
- **Database strategy**: Virtual partitions via schema domains, Vitess for vertical sharding, ProxySQL for connection multiplexing

### Key Infrastructure Components

| Component                       | Role                                  | Status                      |
| ------------------------------- | ------------------------------------- | --------------------------- |
| `mysql1` (original cluster)     | Core data (users, repos, issues, PRs) | Being partitioned           |
| Vitess                          | Database sharding layer               | Production use              |
| ProxySQL                        | Connection multiplexing               | Production use              |
| Gitaly                          | Git RPC service                       | Production                  |
| Actions Runner Controller (ARC) | CI/CD runner orchestration            | Production                  |
| Azure infrastructure            | Cloud migration target                | 45% traffic as of June 2026 |

### API Design

- **REST API v3**: Traditional CRUD operations, well-documented
- **GraphQL API**: Modern query interface, recommended for new integrations
- **Webhooks**: Event-driven notifications for repository, issue, and workflow events
- **GitHub Apps**: OAuth-based integrations with granular permissions

### Scalability Metrics (2026)

- 71 million Actions jobs per day
- 500,000+ queries/second offloaded by new users service
- 97% of API rate limiting handled at Gateway level
- Repository replication at 99%

## Folder Structure

A typical GitHub repository:

```
my-project/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD
│   │   ├── ci.yml
│   │   ├── release.yml
│   │   └── deploy.yml
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml      # Dependabot configuration
│   ├── CODEOWNERS          # Code ownership
│   └── FUNDING.yml         # Sponsorship configuration
├── src/
├── tests/
├── docs/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── .gitignore
```

GitHub-specific files:

- `.github/workflows/` — CI/CD pipelines (YAML)
- `.github/CODEOWNERS` — Automatic review assignment
- `.github/dependabot.yml` — Automated dependency updates
- `SECURITY.md` — Security policy and vulnerability reporting

## Navigation

### Sidebar Navigation

- **Home**: Dashboard with activity feed, recommended repositories
- **Issues**: Global issue tracker across all repositories
- **Pull Requests**: Global PR view across all repositories
- **Marketplace**: Third-party integrations and tools
- **Explore**: Repository discovery, trending, collections

### Repository Navigation

- **Code**: File browser, branch/tag selector
- **Issues**: Issue list, labels, milestones
- **Pull Requests**: PR list, review queues
- **Actions**: CI/CD workflow runs and logs
- **Projects**: Kanban boards and project planning
- **Wiki**: Documentation wiki
- **Security**: Vulnerability alerts, code scanning
- **Insights**: Traffic, contributors, dependency graph

### Command Palette

- `Ctrl+K` or `/` — Global search and navigation
- Repository-level search with file content and symbol search
- Advanced search qualifiers (is:issue, is:pr, language:, etc.)

### Search

- Full-text search across code, commits, issues, PRs, and discussions
- Search qualifiers: `is:open`, `label:bug`, `assignee:@me`, `created:>2025-01-01`
- Code search with language filters and regex support
- Copilot-powered code search in beta

## Workflows

### Issue Creation

1. Navigate to Issues tab → New Issue
2. Select template (bug report, feature request, custom)
3. Fill in title, description, labels, assignees, milestone
4. Submit — triggers notifications and optionally creates linked PRs

### Code Review

1. Create branch from main → make changes → push
2. Open Pull Request with description and linked issues
3. Request reviewers (manual or CODEOWNERS auto-assignment)
4. Reviewers approve, request changes, or comment inline
5. Branch protection rules enforce minimum reviews
6. Merge via merge commit, squash, or rebase

### Release Process

1. Create tag (e.g., `v1.0.0`) on desired commit
2. Create Release with release notes (auto-generated or manual)
3. Attach binary assets
4. Optionally trigger GitHub Actions workflow for publishing

### CI/CD (GitHub Actions)

1. Define workflow in `.github/workflows/*.yml`
2. Trigger on push, pull_request, schedule, or manual
3. Jobs run on GitHub-hosted or self-hosted runners
4. Steps execute shell commands, actions, or reusable workflows
5. Artifacts uploaded for downstream jobs or release assets

## Permissions

### Role Model

- **Organization Owner**: Full control over org settings, billing, repos
- **Organization Member**: Access based on team membership
- **Repository Admin**: Manage settings, Collaborators, branch protection
- **Repository Write**: Push code, manage issues and PRs
- **Repository Read**: View code, issues, and PRs

### Access Control

- **Teams**: Groups of users with repository access permissions
- **CODEOWNERS**: File-level ownership for automatic review requests
- **Branch Protection Rules**: Require reviews, status checks, linear history
- **Environment Protection Rules**: Deployment approval, branch restrictions
- **Enterprise Policies**: Organization-level policies enforced across all repos

### Team Structure

```
Organization
├── Team: Engineering
│   ├── Repository: repo-a (Write)
│   └── Repository: repo-b (Admin)
├── Team: Design
│   └── Repository: repo-c (Read)
└── Team: DevOps
    └── Repository: repo-infra (Admin)
```

## Collaboration

### Pull Request Reviews

- Inline code comments with suggestion mode
- Review summaries and approval/request changes
- Required reviewers via CODEOWNERS or branch protection
- Review assignments based on code ownership

### Issues and Discussions

- Issues with labels, milestones, assignees
- GitHub Discussions for long-form conversations
- Issue linking (`#123` in PRs auto-links)
- Project boards for visual task management

### Real-time Collaboration

- GitHub Codespaces for cloud development environments
- Live share sessions (VS Code integration)
- Copilot pair programming

## Search

- **Global Search**: Issues, PRs, code, commits, repositories
- **Code Search**: Full-text with language filters, file path filters, regex
- **Advanced Qualifiers**: `is:issue is:open label:bug author:@me`
- **Repository Search**: By name, description, language, stars, forks
- **User Search**: By username, organization, location
- **Copilot Code Search**: AI-powered semantic code search (beta)

## Issue Management

### Issue Types

- Issues (bugs, features, tasks)
- Discussions (long-form, Q&A, polls)
- Security Advisories (private vulnerability reporting)

### Labels

- Custom labels with colors and descriptions
- Default labels: bug, enhancement, documentation, good first issue
- Auto-labeling via workflows or third-party apps

### Milestones

- Group issues into release milestones
- Track progress with milestone burndown
- Close milestone when all issues resolved

### Project Boards

- Kanban-style boards with custom columns
- Automated card movement based on issue status
- Custom fields for priority, effort, sprint
- Roadmaps for timeline-based planning

### Issue Templates

- Markdown-based templates with YAML frontmatter
- Template chooser for multiple issue types
- Custom forms with required fields

## Code Review

### Pull Request Workflow

1. **Create**: Branch → commit → push → open PR
2. **Review**: Inline comments, suggestions, review summaries
3. **Approve/Request Changes**: Explicit approval or change requests
4. **Merge**: Merge commit, squash merge, or rebase
5. **Auto-close**: PR linked to issue closes issue on merge

### Review Features

- **Inline Comments**: Line-by-line code review with suggestions
- **Review Summaries**: Overall review feedback
- **Suggestion Mode**: Apply suggested changes directly from review
- **Draft PRs**: WIP pull requests not ready for review
- **Review Assignments**: CODEOWNERS auto-assignment
- **Required Reviews**: Branch protection enforces minimum approvals

### Diff Viewing

- Side-by-side and unified diff views
- Image diff support
- Rich diff for HTML, Markdown, Jupyter notebooks
- Commit comparison view

## Releases

### Release Process

- Tag-based releases (lightweight or annotated tags)
- Release notes: auto-generated from PRs/milestones or manual
- Binary asset attachments (up to 2GB per release)
- Pre-release and draft releases

### Changelog Management

- Auto-generated release notes from merged PRs
- Custom release notes templates
- `release-drafter` GitHub Action for automated changelogs

### Versioning

- Semantic versioning via tags
- GitHub releases with version metadata
- npm/package registry publishing via Actions

## Notifications

### Notification Channels

- **Email**: Configurable per-repository and per-event
- **GitHub Web**: In-app notification center
- **Mobile**: Push notifications via GitHub Mobile
- **Webhooks**: Custom HTTP endpoints for integrations

### Notification Preferences

- Per-repository notification settings
- Watch/ignore/participate/mention options
- Custom notification routing via `.github/notification.yaml`
- Batch notifications for digest emails

### Notification Management

- Mark as read/unread
- Custom filters and saved searches
- Notification inbox with priority sorting

## Automation

### GitHub Actions

- YAML-based workflow definitions
- 20,000+ community actions in Marketplace
- Matrix builds for cross-platform testing
- Reusable workflows and composite actions
- Self-hosted runners with ARC (Actions Runner Controller)

### Webhooks

- Repository, organization, and app-level webhooks
- Events: push, pull_request, issues, release, workflow_run
- JSON payloads with event metadata
- Retry logic and delivery guarantees

### GitHub Apps

- OAuth-based integrations with granular permissions
- GitHub Marketplace distribution
- Fine-grained API access per repository
- Installation tokens with scoped permissions

### Dependabot

- Automated dependency version updates
- Security vulnerability alerts
- Custom update schedules and groupings
- Auto-merge with CI validation

## AI Integration

### GitHub Copilot

- Code completion and suggestion (IDE integration)
- Copilot Chat for conversational coding assistance
- Copilot Coding Agent for autonomous issue resolution
- Pull request summaries and code review assistance
- Security vulnerability autofix (Code Security + Copilot)

### Copilot Features (2026)

- **Copilot Code Review**: AI-powered PR review
- **Copilot Autofix**: Automatic security vulnerability fixes
- **Copilot Chat**: Natural language code assistance
- **Copilot Extensions**: Third-party AI model integration
- **Copilot Workspace**: Multi-file editing with AI planning

### Model Marketplace

- GitHub Models: Access to AI models (GPT-4, Claude, etc.)
- GitHub AI Credits for API-based AI usage
- Model hosting and inference endpoints

## Design Patterns

### Platform Patterns

- **Monolith with service extraction**: Active decomposition of Rails monolith
- **Event-driven architecture**: Webhooks and Actions for async workflows
- **Optimistic locking**: Concurrent editing with merge conflict resolution
- **Code ownership**: CODEOWNERS for distributed review responsibility
- **Feature flags**: Gradual rollout of new features
- **Circuit breakers**: Automated migration pause when database load is high

### API Patterns

- REST for CRUD, GraphQL for complex queries
- Pagination with `Link` headers and cursors
- Rate limiting with `Retry-After` headers
- Conditional requests with `If-None-Match`/`If-Modified-Since`

## UX Observations

### What Works Well

- **Pull request workflow**: Gold standard for code review UX
- **Issue linking**: Automatic cross-referencing between issues, PRs, commits
- **Actions ecosystem**: Massive marketplace of reusable workflows
- **CODEOWNERS**: Automated review assignment based on code ownership
- **Copilot integration**: Seamless AI assistance in IDE and web

### What Doesn't Work Well

- **Notification overload**: Too many notifications without good filtering
- **Project management**: Less powerful than dedicated tools (Linear, Jira)
- **Large file handling**: Git LFS adds complexity
- **Performance (2026)**: Recent availability issues due to scaling challenges
- **Pricing complexity**: Multiple add-ons (Copilot, Advanced Security, Codespaces) can compound

### What's Innovative

- **Copilot Coding Agent**: Autonomous issue resolution with AI
- **Actions Runner Controller**: Kubernetes-native CI/CD runner management
- **GitHub Models**: Built-in AI model marketplace
- **Secret Protection**: Proactive secret detection across push, PR, and repo history

## Reusable Ideas

1. **CODEOWNERS pattern**: Automatic code review assignment — adaptable for GitHub OS
2. **Issue templates with YAML forms**: Structured data collection for bug reports
3. **Actions Marketplace**: Reusable workflow components — model for GitHub OS builders
4. **Dependabot**: Automated dependency updates — essential for open-source maintenance
5. **Copilot Autofix**: AI-powered security remediation — valuable for code quality
6. **Release drafter**: Automated changelog generation from PR labels
7. **Branch protection rules**: Fine-grained merge requirements per branch

## Risks

- **Vendor lock-in**: Deep integration makes migration difficult
- **Availability concerns**: 2026 infrastructure instability affected reliability
- **Cost scaling**: Actions minutes, Copilot seats, and Advanced Security add up
- **Microsoft dependency**: Corporate ownership could shift priorities
- **AI dependency risk**: Copilot suggestions may introduce vulnerabilities if not reviewed
- **Monolith decomposition risk**: Active architecture changes may cause transient instability

## Evidence

- **Source**: https://github.com, https://github.blog/engineering/
- **Date collected**: 2026-08-03
- **Why it matters**: GitHub is the dominant platform for software development and the foundation for GitHub OS integration
- **Trade-offs**: Unmatched ecosystem and network effect vs. recent reliability concerns and Microsoft dependency
- **Expected value**: Direct integration path, massive action ecosystem, AI capabilities, industry-standard workflow
- **Maintenance burden**: Low for hosted (SaaS), high for self-hosted (GitHub Enterprise Server)

## Pricing (2026)

| Plan              | Price               | Key Features                                                        |
| ----------------- | ------------------- | ------------------------------------------------------------------- |
| Free              | $0                  | Unlimited public repos, 2,000 Actions minutes/month, 500MB packages |
| Team              | $4/user/month       | Private repos, 3,000 Actions minutes, code owners                   |
| Enterprise        | $21/user/month      | 50,000 Actions minutes, SAML/SSO, audit log, advanced security      |
| Copilot           | $10-39/user/month   | AI code completion, chat, coding agent                              |
| Advanced Security | $49/committer/month | Code scanning, secret scanning, dependency review                   |
