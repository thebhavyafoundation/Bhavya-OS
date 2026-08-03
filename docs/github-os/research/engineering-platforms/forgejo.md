# Forgejo — Knowledge Package

## Executive Summary

Forgejo is a community-driven, self-hosted Git forge created in December 2022 as a fork of Gitea. The name comes from the Esperanto word for "forge." Forgejo was created due to concerns about corporate ownership of Gitea and the desire for community-governed, Free/Libre Software. It is developed under the umbrella of Codeberg e.V., a democratic non-profit organization based in Germany.

Forgejo is a lightweight, single-binary application written in Go with a Vue.js frontend. It compiles to a single binary with no external runtime dependencies (except a database). It runs on anything from a Raspberry Pi to a production server, consuming as little as 80-120MB RAM at idle with SQLite. Forgejo includes Git hosting, issues, pull requests, wikis, kanban boards, CI/CD (Forgejo Actions), and a package registry — all in one binary.

For Bhavya Foundation, Forgejo represents an interesting option for self-hosted Git hosting with strong community governance and a privacy-first approach. It is significantly lighter than GitLab (which requires several GB RAM) while providing comparable core features. The federation feature (ActivityPub) is under active development and could enable decentralized collaboration. However, it lacks the ecosystem depth of GitHub and GitLab, and the community is smaller.

## Architecture

### Core Architecture

Forgejo follows a monolithic architecture with a clean separation of concerns:

```
┌─────────────────────────────────┐
│          HTTP Router            │
│         (chi v5)                │
└──────────┬──────────────────────┘
           │
    ┌──────▼──────┐
    │   Handlers  │
    │  (Web + API)│
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Services  │
    │  (Business  │
    │   Logic)    │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Models    │
    │  (Data +    │
    │   ORM)      │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Database   │
    │  (SQLite/   │
    │  MySQL/PG)  │
    └─────────────┘
```

### Technology Stack

| Component   | Technology                          | Purpose                              |
| ----------- | ----------------------------------- | ------------------------------------ |
| Backend     | Go 1.26+                            | Single binary, all server logic      |
| HTTP Router | chi v5                              | Request routing and middleware       |
| ORM         | xorm                                | Database abstraction                 |
| Frontend    | Vue.js 3 + TypeScript               | Web UI                               |
| CSS         | Tailwind CSS                        | Styling                              |
| Build       | Webpack/Vite                        | Frontend bundling                    |
| SSH         | go-ssh (built-in)                   | Git-over-SSH (no system sshd needed) |
| TLS         | CertMagic                           | Automatic Let's Encrypt certificates |
| Search      | Bleve / Elasticsearch / Meilisearch | Full-text search                     |
| Queue       | LevelDB (built-in) or Redis         | Background job processing            |
| Cache       | LevelDB (built-in) or Redis         | Caching layer                        |

### Database Options

1. **SQLite** (default): Zero-config, single-file database
2. **MySQL/MariaDB**: Production-ready relational database
3. **PostgreSQL**: Recommended for production workloads

### Key Architectural Decisions

- **Single binary**: All components compile into one executable
- **No Node.js runtime**: Frontend is pre-compiled and embedded
- **Built-in SSH server**: No dependency on system sshd
- **Optional external dependencies**: Redis and PostgreSQL are optional (can use built-in alternatives)
- **Gitea-compatible**: Can import from GitHub, GitLab, Gitea, Gogs

## Folder Structure

A typical Forgejo repository:

```
my-project/
├── .forgejo/
│   ├── workflows/          # Forgejo Actions (CI/CD)
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

Forgejo-specific files:

- `.forgejo/workflows/` — CI/CD pipeline definitions (GitHub Actions-compatible)
- `.forgejo/pull_request_template.md` — PR template
- `.forgejo/issue_templates/` — Issue templates

## Navigation

### Top Navigation

- **Dashboard**: Activity feed, repositories, organizations
- **Explore**: Discover repositories, organizations, users
- **Sign In**: Login page

### Sidebar Navigation (Per Repository)

- **Code**: File browser, branch selector, raw file view
- **Issues**: Issue list, labels, milestones
- **Pull Requests**: PR list, review queue
- **Projects**: Kanban boards
- **Wiki**: Documentation wiki
- **Actions**: CI/CD workflow runs
- **Releases**: Versioned releases with assets
- **Packages**: Package registry
- **Settings**: Repository settings

### Repository Settings

- **General**: Name, description, visibility
- **Options**: Features (issues, wiki, packages, etc.)
- **Branches**: Branch protection rules
- **Webhooks**: Event notifications
- **Actions**: CI/CD configuration
- **Collaborators**: User and team access
- **Deploy Keys**: SSH keys for deployment

### Search

- Global search across repositories, issues, code
- Repository search with file content
- Advanced filters (language, stars, forks)

## Workflows

### Issue Creation

1. Navigate to Issues → New Issue
2. Select template (if configured)
3. Fill in title, description, labels, assignees, milestone
4. Submit — triggers notifications and webhooks

### Pull Request Workflow

1. Create branch → commit → push
2. Create Pull Request with description
3. Request reviewers (manual or CODEOWNERS)
4. CI/CD pipeline runs (Forgejo Actions)
5. Reviewers approve or request changes
6. Merge (merge, squash, or rebase)

### CI/CD (Forgejo Actions)

1. Define workflow in `.forgejo/workflows/*.yml`
2. Compatible with GitHub Actions YAML syntax
3. Trigger on push, pull_request, schedule, or manual
4. Jobs run on Forgejo Runner (separate component)
5. Artifacts uploaded for downstream jobs

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
- CODEOWNERS-based auto-assignment
- Branch protection with required reviews

### Issues and Projects

- Issues with labels, milestones, assignees
- Kanban boards for project management
- Time tracking on issues
- Issue dependencies

### Real-time Collaboration

- Web-based code editing
- Issue and PR commenting
- Team discussions

## Search

- **Global Search**: Repositories, issues, code, users
- **Code Search**: Full-text search with Bleve, Elasticsearch, or Meilisearch
- **Repository Search**: By name, description, language
- **Advanced Filters**: Language, stars, forks, visibility

## Issue Management

### Issue Types

- Issues (bugs, features, tasks)
- Pull Requests (code review)

### Labels

- Custom labels with colors
- Default labels: bug, enhancement, documentation
- Label filtering

### Milestones

- Project milestones
- Progress tracking
- Close milestone when all issues resolved

### Boards

- Kanban boards with customizable columns
- Issue filtering by label, assignee, milestone

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

## Releases

### Release Management

- Tag-based releases
- Release notes (Markdown)
- Binary asset attachments
- Pre-release flag
- Changelog generation

## Notifications

### Notification Channels

- **Email**: Per-event configuration
- **In-app**: Notification center
- **Webhooks**: Custom HTTP endpoints

### Notification Preferences

- Per-repository settings
- Watch/ignore/participate options
- Email notification batching

## Automation

### Forgejo Actions

- YAML-based workflow definitions (GitHub Actions-compatible)
- Community-built actions
- Matrix builds
- Reusable workflows

### Webhooks

- Repository and organization webhooks
- Events: push, pull_request, issues, release
- JSON payloads

### API

- REST API (compatible with Gitea API)
- Swagger/OpenAPI documentation
- Personal access tokens

## AI Integration

### Current State

- **No built-in AI features**: Forgejo does not include AI code suggestions or chat
- **External integrations**: Can integrate with external AI tools via webhooks/API
- **Community plugins**: Potential for AI integrations via community contributions

### Future Plans

- Federation (ActivityPub) could enable cross-forge AI collaboration
- Community-driven feature development may add AI capabilities

## Design Patterns

### Platform Patterns

- **Single binary deployment**: All components in one executable
- **Modular monolith**: Clean layer separation (routers → services → models)
- **Optional dependencies**: Can use built-in alternatives for Redis, search
- **Gitea-compatible API**: Familiar API for Gitea users
- **Community governance**: Democratic development process via Codeberg e.V.

### Design Philosophy

- **Privacy-first**: No telemetry, minimal defaults
- **Lightweight**: Minimal resource requirements
- **Self-hosted**: Full data sovereignty
- **Free Software**: GPL v3 license, community-owned

## UX Observations

### What Works Well

- **Simplicity**: Clean, focused interface without feature bloat
- **Performance**: Fast and responsive, even on low-end hardware
- **Privacy**: No telemetry, no tracking
- **Deployment**: Single binary, easy to install and maintain
- **GitHub familiarity**: Similar UI for GitHub users

### What Doesn't Work Well

- **Feature depth**: Less feature-rich than GitHub/GitLab
- **Ecosystem**: Smaller community and fewer integrations
- **Documentation**: Less comprehensive than larger platforms
- **Enterprise features**: Limited advanced permissions and compliance
- **Search**: Basic search compared to Elasticsearch-powered alternatives

### What's Innovative

- **Federation (ActivityPub)**: Cross-forge collaboration (in development)
- **Community governance**: Democratic, non-profit ownership model
- **Single binary**: Extremely simple deployment model
- **Privacy-first approach**: No tracking by default

## Reusable Ideas

1. **Single binary deployment**: Model for simple, maintainable deployments
2. **Community governance**: Democratic ownership model for open-source projects
3. **Privacy-first defaults**: No telemetry, minimal data collection
4. **Gitea-compatible API**: Interoperability with existing ecosystem
5. **Federation via ActivityPub**: Decentralized collaboration model
6. **Optional dependencies**: Graceful degradation without external services

## Risks

- **Small community**: Fewer contributors and less ecosystem support
- **Feature gaps**: Missing advanced features (epics, advanced CI/CD)
- **Federation maturity**: ActivityPub support is still in development
- **Long-term sustainability**: Community-funded project vs. corporate-backed alternatives
- **Migration risk**: Fork of Gitea may diverge significantly over time
- **Limited enterprise support**: No commercial support option

## Evidence

- **Source**: https://forgejo.org, https://forgejo.codeberg.page/docs/next/contributor/architecture/
- **Date collected**: 2026-08-03
- **Why it matters**: Forgejo represents a community-governed, lightweight alternative to GitHub with strong privacy focus
- **Trade-offs**: Community governance and simplicity vs. feature depth and ecosystem
- **Expected value**: Self-hosted Git forge with GitHub compatibility and privacy-first approach
- **Maintenance burden**: Very low (single binary, minimal dependencies)

## Pricing

Forgejo is **completely free** — it is Free/Libre Software released under GPL v3.

**Self-hosting costs** (only infrastructure):

- Raspberry Pi: ~$50-100 one-time
- VPS: $5-20/month
- Production server: $50-200/month

**Codeberg hosting** (managed Forgejo instance):

- Free for open-source projects
- Supported by donations to Codeberg e.V.

**No per-user licensing, no SaaS tiers, no hidden costs.**
