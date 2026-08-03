# Gitea — Knowledge Package

## Executive Summary

Gitea is a lightweight, self-hosted Git service written in Go, designed to be the easiest and fastest way to set up a self-hosted Git hosting solution. Created in 2016 as a fork of Gogs, Gitea has grown to become one of the most popular self-hosted Git forge options. It provides Git hosting, code review, team collaboration, package registry, and CI/CD — all in a single binary.

Gitea's architecture is a modular Go application with a Vue.js frontend, supporting multiple databases (PostgreSQL, MySQL, SQLite, MSSQL) and storage backends. It runs on virtually any platform — Linux, macOS, Windows, ARM, RISC-V — and can operate on hardware as minimal as a Raspberry Pi 3 with 2 CPU cores and 1GB RAM. The project has a strong community with active development and a commercial entity (Gitea Limited) offering cloud and enterprise services.

For Bhavya Foundation, Gitea represents the most lightweight self-hosted option with a balance of features and simplicity. It is simpler and more established than Forgejo (its fork), with a larger community and more mature feature set. The trade-off is that Gitea is backed by a commercial entity (unlike Forgejo's community governance), and some advanced features require the paid Gitea Enterprise edition. Gitea Actions (CI/CD) are compatible with GitHub Actions YAML syntax, making migration easier.

## Architecture

### Core Architecture

Gitea follows a clean, layered architecture:

```
┌─────────────────────────────────┐
│          HTTP Router            │
│         (Chi v5)                │
└──────────┬──────────────────────┘
           │
    ┌──────▼──────┐
    │   Routers   │
    │  (Web + API)│
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Services   │
    │  (Business  │
    │   Logic)    │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Models    │
    │  (ORM +     │
    │   Database) │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Modules   │
    │  (Utilities,│
    │   Git, Auth)│
    └─────────────┘
```

### Technology Stack

| Component       | Technology             | Purpose                              |
| --------------- | ---------------------- | ------------------------------------ |
| Backend         | Go 1.26+               | Single binary, all server logic      |
| HTTP Router     | Chi v5                 | Request routing and middleware       |
| ORM             | XORM                   | Database abstraction                 |
| Frontend        | Vue.js 3               | Web UI (Vite build)                  |
| CSS             | Tailwind + Fomantic UI | Styling                              |
| Template Engine | Go templates           | Server-side rendering                |
| SSH             | Go SSH server          | Git-over-SSH (no system sshd needed) |
| Search          | Bleve (built-in)       | Full-text search                     |
| Queue           | Built-in or Redis      | Background job processing            |
| Cache           | Built-in or Redis      | Caching layer                        |

### Database Support

| Database      | Support Level    | Best For                 |
| ------------- | ---------------- | ------------------------ |
| SQLite3       | Built-in default | Small teams, development |
| PostgreSQL    | Recommended      | Production workloads     |
| MySQL/MariaDB | Full support     | Production workloads     |
| MSSQL         | Full support     | Enterprise environments  |

### Storage Options

| Backend               | Use Case               |
| --------------------- | ---------------------- |
| Local filesystem      | Default, single-server |
| S3-compatible (MinIO) | Distributed storage    |
| Azure Blob Storage    | Cloud storage          |

### Request Flow

```
HTTP Request → Middleware Pipeline → Router Handler → Service Layer → Model Layer → Database
                    ↓
            - Context initialization
            - Session management
            - CSRF protection
            - Authentication
            - Permission checks
            - Rate limiting
            - Logging
```

## Folder Structure

A typical Gitea repository:

```
my-project/
├── .gitea/
│   ├── workflows/          # Gitea Actions (CI/CD)
│   │   ├── ci.yml
│   │   └── release.yml
│   └── pull_request_template.md
├── .github/
│   └── workflows/          # GitHub Actions (also supported)
├── src/
├── tests/
├── docs/
├── README.md
├── LICENSE
└── .gitignore
```

Gitea-specific files:

- `.gitea/workflows/` — CI/CD pipeline definitions (GitHub Actions-compatible)
- `.gitea/pull_request_template.md` — PR template

## Navigation

### Top Navigation

- **Dashboard**: Activity feed, repositories, organizations
- **Explore**: Discover repositories, organizations, users
- **Site Admin**: Administration panel (admin users only)

### Sidebar Navigation (Per Repository)

- **Code**: File browser, branch selector, raw file view
- **Issues**: Issue list, labels, milestones
- **Pull Requests**: PR list, review queue
- **Projects**: Kanban boards
- **Wiki**: Documentation wiki
- **Actions**: CI/CD workflow runs
- **Releases**: Versioned releases with assets
- **Packages**: Package registry (20+ formats)
- **Settings**: Repository settings

### Search

- Global search across repositories, issues, code, users
- Repository-level file search
- Advanced filters (language, visibility, stars)

## Workflows

### Issue Creation

1. Navigate to Issues → New Issue
2. Select template (if configured)
3. Fill in title, description, labels, assignees, milestone
4. Set due date and time estimate
5. Submit — triggers notifications and webhooks

### Pull Request Workflow

1. Create branch → commit → push
2. Create Pull Request with description
3. Request reviewers
4. CI/CD pipeline runs (Gitea Actions)
5. Reviewers approve or request changes
6. Merge (merge, squash, rebase, or manual)

### CI/CD (Gitea Actions)

1. Define workflow in `.gitea/workflows/*.yml`
2. Compatible with GitHub Actions YAML syntax
3. Trigger on push, pull_request, schedule, or manual
4. Jobs run on act_runner (separate component)
5. Artifacts uploaded for downstream jobs
6. Supports reusable workflows and owner-level scoped workflows

### Release Process

1. Create tag on desired commit
2. Create Release with release notes
3. Attach binary assets
4. Optionally trigger Actions workflow

## Permissions

### Role Model

1. **Read**: View code, issues, and pull requests
2. **Write**: Push code, manage issues and PRs
3. **Admin**: Manage repository settings, collaborators, branch protection
4. **Owner**: Full repository control, transfer, delete

### Access Control

- **Organizations**: Groups of users with shared repositories
- **Teams**: Sub-groups within organizations with different permissions
- **Collaborators**: Individual user access per repository
- **CODEOWNERS**: File-level ownership for automatic review requests
- **Branch Protection**: Require reviews, status checks, signed commits

### Team Structure

```
Organization
├── Team: Developers
│   ├── Repository: app (Write)
│   └── Repository: api (Write)
├── Team: Maintainers
│   ├── Repository: app (Admin)
│   └── Repository: api (Admin)
└── Team: Contributors
    └── Repository: docs (Write)
```

## Collaboration

### Pull Request Reviews

- Inline code comments
- Review approval/request changes
- Branch protection with required reviews
- Diff viewing (side-by-side and unified)

### Issues and Projects

- Issues with labels, milestones, assignees
- Time tracking and due dates
- Issue dependencies
- Kanban boards for project management

### Real-time Collaboration

- Web-based code editing
- Issue and PR commenting
- Team discussions

## Search

- **Global Search**: Repositories, issues, code, users
- **Code Search**: Full-text search with Bleve (built-in)
- **Repository Search**: By name, description, language
- **Advanced Filters**: Language, visibility, stars, forks

## Issue Management

### Issue Types

- Issues (bugs, features, tasks)
- Pull Requests (code review)

### Labels

- Custom labels with colors
- Label filtering

### Milestones

- Project milestones
- Progress tracking

### Boards

- Kanban boards with customizable columns
- Issue filtering by label, assignee, milestone

### Time Tracking

- Estimate and track time on issues
- Due dates and time logging

## Code Review

### Pull Request Features

- **Inline Comments**: Line-by-line code review
- **Review Approval**: Approve or request changes
- **CODEOWNERS**: Automatic review assignment
- **Branch Protection**: Required reviews, status checks
- **Diff Viewing**: Side-by-side and unified diffs

### Merge Options

- Merge commit (preserve history)
- Squash merge (linear history)
- Rebase (clean linear history)
- Manual merge (external tools)

## Releases

### Release Management

- Tag-based releases
- Release notes (Markdown)
- Binary asset attachments
- Pre-release flag

## Notifications

### Notification Channels

- **Email**: Per-event configuration
- **In-app**: Notification center
- **Webhooks**: Custom HTTP endpoints
- **Slack/Discord**: Chat integration (via webhooks)

### Notification Preferences

- Per-repository settings
- Watch/ignore/participate options
- Email notification batching

## Automation

### Gitea Actions

- YAML-based workflow definitions (GitHub Actions-compatible)
- Community-built actions
- Matrix builds
- Reusable workflows

### Webhooks

- Repository and organization webhooks
- Events: push, pull_request, issues, release, package
- JSON payloads

### API

- REST API (comprehensive)
- Swagger/OpenAPI documentation
- Personal access tokens
- OAuth2 support

## AI Integration

### Current State

- **No built-in AI features**: Gitea does not include AI code suggestions or chat
- **External integrations**: Can integrate with external AI tools via webhooks/API
- **Community plugins**: Potential for AI integrations via community contributions

## Design Patterns

### Platform Patterns

- **Single binary deployment**: All components in one executable
- **Modular architecture**: Clean layer separation (routers → services → models → modules)
- **Middleware pipeline**: Request processing through composable middleware
- **Optional dependencies**: Can use built-in alternatives for Redis, search
- **Gitea Actions**: GitHub Actions-compatible CI/CD

### Design Philosophy

- **Simplicity**: Easiest way to set up self-hosted Git
- **Performance**: Fast and lightweight
- **Cross-platform**: Runs on all Go-supported platforms
- **Self-hosted**: Full data sovereignty

## UX Observations

### What Works Well

- **Simplicity**: Clean, focused interface
- **Performance**: Fast and responsive on minimal hardware
- **Deployment**: Single binary, easy to install
- **GitHub familiarity**: Similar UI for GitHub users
- **Package registry**: 20+ package formats built-in
- **Actions compatibility**: GitHub Actions YAML works without modification

### What Doesn't Work Well

- **Feature depth**: Less feature-rich than GitHub/GitLab
- **Ecosystem**: Smaller community and fewer integrations
- **Enterprise features**: Limited advanced permissions (requires Enterprise edition)
- **Search**: Basic search compared to Elasticsearch-powered alternatives
- **UI design**: Functional but less polished than competitors

### What's Innovative

- **Single binary**: Extremely simple deployment model
- **Cross-platform support**: Runs on ARM, RISC-V, PowerPC
- **GitHub Actions compatibility**: Easy migration from GitHub
- **Package registry**: 20+ formats in one instance

## Reusable Ideas

1. **Single binary deployment**: Model for simple, maintainable deployments
2. **GitHub Actions compatibility**: Reuse existing CI/CD workflows
3. **Package registry**: Centralized package hosting
4. **Cross-platform support**: Run on any hardware
5. **Middleware pipeline**: Composable request processing

## Risks

- **Commercial backing**: Gitea Limited controls the roadmap
- **Enterprise features**: Advanced features require paid edition
- **Fork relationship**: Forgejo fork may diverge over time
- **Community size**: Smaller than GitHub/GitLab
- **Search limitations**: Bleve is less powerful than Elasticsearch
- **Limited compliance**: Fewer enterprise compliance features

## Evidence

- **Source**: https://gitea.com, https://docs.gitea.com, https://github.com/go-gitea/gitea
- **Date collected**: 2026-08-03
- **Why it matters**: Gitea is the most popular lightweight self-hosted Git forge with a balance of features and simplicity
- **Trade-offs**: Simplicity and performance vs. feature depth and ecosystem
- **Expected value**: Self-hosted Git forge with GitHub compatibility and minimal resource requirements
- **Maintenance burden**: Very low (single binary, minimal dependencies)

## Pricing

### Gitea (Self-Hosted)

- **Free** (MIT license)
- Self-hosting costs only (infrastructure)

### Gitea Enterprise

- Custom pricing for commercial support and advanced features
- Contact Gitea Limited for quotes

### Gitea Cloud

- Managed hosting service
- Free trial available
- Pay-as-you-go pricing

**No per-user licensing for self-hosted community edition.**
