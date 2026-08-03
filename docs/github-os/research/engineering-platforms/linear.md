# Linear — Knowledge Package

## Executive Summary

Linear is a purpose-built project management and issue tracking tool for software engineering teams. Founded in 2019 by Karri Saarinen, Tuomas Artman, and Jori Lallo, Linear has become the preferred issue tracker for over 40,000 product teams including Vercel, Ramp, Cash App, OpenAI, Loom, and Mercury. The company raised an $80 million Series C in 2024 at a $1.25 billion valuation.

Linear's defining characteristic is its speed. The application is built on a local-first architecture where the browser maintains a full copy of the workspace in IndexedDB. Mutations apply locally first (optimistic writes) and asynchronously sync to the server via WebSocket. This means zero perceived latency per keystroke — the app feels instant because it reads from the local database, not the server. The UI uses React with MobX for granular observable-based rendering, so a 50-issue update re-renders exactly the 50 cells that changed, not the entire list.

For Bhavya Foundation, Linear represents the gold standard for issue tracker UX and performance. Its opinionated design enforces a specific workflow (issues, projects, cycles, initiatives) that works well for product engineering teams. The GraphQL API is comprehensive and well-documented, making it suitable for integration. However, Linear is cloud-only (no self-hosting), its free tier is limited (250 issues), and it lacks the breadth of features found in all-in-one platforms like GitHub or GitLab.

## Architecture

### Local-First Architecture

Linear inverts the traditional client-server relationship:

```
Traditional: Server → Fetch → Client
Linear:      Client (IndexedDB) → Local Read → Instant UI
             Client → Sync → Server → Broadcast → Other Clients
```

### Frontend Stack

| Component        | Technology                  | Purpose                                      |
| ---------------- | --------------------------- | -------------------------------------------- |
| UI Framework     | React + react-dom           | UI runtime                                   |
| State Management | MobX                        | Observable graph, granular re-renders        |
| Language         | TypeScript                  | Single language end-to-end                   |
| Build Tool       | Rolldown-Vite               | Bundling (previously Parcel → Rollup → Vite) |
| Rich Text Editor | ProseMirror + y-prosemirror | Live collaboration via Yjs CRDT              |
| UI Primitives    | Radix UI                    | Popovers, menus, focus traps                 |
| CSS              | Emotion + StyleX            | Runtime + compiled atomic CSS                |
| Local Database   | IndexedDB (via idb)         | Local-first sync store                       |
| Transport        | graphql-request             | GraphQL transport to sync server             |
| Error Monitoring | Sentry                      | Error tracking                               |

### Backend Stack

| Component     | Technology              | Purpose                                |
| ------------- | ----------------------- | -------------------------------------- |
| Runtime       | Node.js + TypeScript    | Server-side logic                      |
| Database      | PostgreSQL on Cloud SQL | Persistent storage (workspace-sharded) |
| Cache/Bus     | Memorystore Redis       | Event bus, cache, sync cursors         |
| Vector DB     | turbopuffer             | Similar-issue detection                |
| Orchestration | Kubernetes on GCP       | One workload per concern               |
| Edge Proxy    | Cloudflare Workers      | Multi-region edge routing              |
| WebSocket     | Custom sync server      | Real-time sync per workspace           |

### Other Clients

- **Desktop**: Electron (same web JS, native chrome)
- **Mobile**: Swift (iOS) + Kotlin (separate native reimplementation)

### Sync Engine Architecture

```
┌─────────────────────────────────────────┐
│              CLIENT                      │
│  ┌──────────┐    ┌──────────────┐       │
│  │ MobX     │◄───│ IndexedDB    │       │
│  │ Observa- │    │ Sync Store   │       │
│  │ bles     │    │ (Full Copy)  │       │
│  └────┬─────┘    └──────────────┘       │
│       │                                  │
│  ┌────▼─────┐    ┌──────────────┐       │
│  │ UI       │◄───│ Sync Engine  │       │
│  │ Render   │    │ (Rust/WASM)  │       │
│  └──────────┘    └──────────────┘       │
│                         │                │
└─────────────────────────┼────────────────┘
                          │ WebSocket
┌─────────────────────────┼────────────────┐
│              SERVER                      │
│  ┌──────────────┐    ┌──────────┐       │
│  │ Sync Gateway │◄──►│ Postgres │       │
│  │ (WS Fan-out) │    │ (Sharded)│       │
│  └──────────────┘    └──────────┘       │
│                                          │
│  ┌──────────────┐    ┌──────────┐       │
│  │ Operation Log│    │ Search   │       │
│  │ (Append-only)│    │ Index    │       │
│  └──────────────┘    └──────────┘       │
└──────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Local-first**: Server is sync target, not source of truth for UI
2. **Optimistic writes**: Mutations apply locally before server confirmation
3. **Domain-specific sync**: Not generic CRDT — knows about issues, status, ordering
4. **Workspace sharding**: Per-workspace logical shard in PostgreSQL
5. **Write-path search**: Search index populated on write, not query-time
6. **Two protocols**: GraphQL for external integrations, bespoke for internal client

## Folder Structure

Linear is a SaaS product — there is no folder structure for users. However, the conceptual organization is:

```
Workspace
├── Teams
│   ├── Engineering
│   │   ├── Issues (with statuses: Todo, In Progress, In Review, Done)
│   │   ├── Projects (roadmaps)
│   │   └── Cycles (time-boxed iterations)
│   ├── Design
│   └── Product
├── Initiatives (company-level goals)
├── Customer Requests (feedback intake)
└── Settings
    ├── Members
    ├── Teams
    ├── Integrations
    └── API Keys
```

## Navigation

### Global Navigation

- **My Issues**: Assigned issues, recently viewed
- **My Projects**: Projects I'm a member of
- ** Inbox**: Triage incoming issues
- **Views**: Custom filtered views of issues

### Keyboard-First Design

- `Cmd+K` — Command palette (global navigation and actions)
- `J/K` — Navigate up/down in lists
- `S` — Change issue status
- `A` — Assign issue
- `L` — Add label
- `E` — Edit issue title
- `C` — Create new issue
- `1-5` — Set priority
- `/` — Search

### Sidebar

- Favorites (starred views, projects)
- Teams and their issues/projects
- Filters and custom views
- Recent activity

### Search

- Global search with `Cmd+K`
- Filter by status, priority, assignee, label, project, cycle
- Saved views for recurring filters
- Keyboard-driven filtering

## Workflows

### Issue Creation

1. Press `C` or click New Issue
2. Enter title and description (rich text with Markdown)
3. Set priority (No Priority, Urgent, High, Medium, Low)
4. Assign to team, project, and cycle
5. Add labels and estimate
6. Submit — instant local update, async server sync

### Project Workflow

1. Create Project with name, description, and team
2. Add Issues to project
3. Set project status (Planned, In Progress, Complete)
4. Track progress with project updates
5. Mark project complete when all issues done

### Cycle Workflow

1. Create Cycle with start/end dates
2. Assign issues to cycle
3. Work through issues during cycle
4. Track velocity and completion rate
5. Retrospective at cycle end

### Initiative Workflow

1. Create Initiative for company-level goals
2. Link Projects that contribute to initiative
3. Track initiative progress across projects
4. Report on initiative completion

## Permissions

### Role Model

- **Organization Admin**: Full org control, billing, settings
- **Team Admin**: Manage team settings, members, workflows
- **Member**: Create and edit issues, projects, cycles
- **Guest**: Limited access (Business tier and above)

### Access Control

- **Organizations**: Top-level container
- **Teams**: Groups with their own workflows
- **Private teams**: Visible only to members (Business+)
- **Guest access**: External collaborators (Business+)

## Collaboration

### Issue Collaboration

- **Comments**: Rich text with Markdown, mentions, reactions
- **Assignees**: Single or multiple assignees
- **Sub-issues**: Issue breakdown and tracking
- **Linked issues**: Cross-reference related work
- **Customer Requests**: Link issues to customer feedback

### Project Collaboration

- **Project updates**: Status updates and progress reports
- **Project links**: Link to designs, documents, PRs
- **Project members**: Team collaboration on projects
- **Initiatives**: Cross-project goal tracking

### Code Integration

- **GitHub/GitLab integration**: Auto-link issues to PRs
- **PR status**: Auto-update issue status on merge
- **Code review**: Review PRs within Linear (beta)
- **Coding sessions**: AI-assisted code editing (beta)

## Search

- **Global search**: `Cmd+K` for instant search
- **Filter syntax**: `status:in-progress assignee:@me priority:high`
- **Saved views**: Persistent filtered views
- **Recently viewed**: Quick access to recent issues
- **Similar issues**: AI-powered duplicate detection (turbopuffer)

## Issue Management

### Issue Types

- Issues (standard work items)
- Sub-issues (child issues)
- Customer Requests (feedback intake)

### Statuses

- Configurable per team (default: Todo, In Progress, In Review, Done)
- Custom statuses with colors and icons
- Status workflows with transition rules

### Priorities

- No Priority, Urgent, High, Medium, Low
- Priority-based sorting and filtering

### Labels

- Custom labels with colors
- Label-based filtering and grouping

### Estimates

- Story points or custom estimation
- Time tracking (beta)

## Code Review

### Linear Code Review (Beta)

- **Structural diffs**: Understand code changes at a glance
- **Review within Linear**: No need to switch to GitHub
- **Agent output review**: Review AI-generated code
- **Merge from Linear**: Merge PRs without leaving the app

### GitHub/GitLab Integration

- Auto-link issues to PRs
- Update issue status on PR merge
- View PR status in Linear

## Releases

Linear does not have a built-in release management feature. Releases are typically managed through:

- GitHub/GitLab releases
- CI/CD pipelines
- Project status tracking

## Notifications

### Notification Channels

- **In-app**: Notification center
- **Email**: Per-event configuration
- **Slack**: Issue creation and updates
- **Microsoft Teams**: Issue updates (Business+)
- **Mobile**: Push notifications (iOS/Android)

### Notification Preferences

- Per-team notification settings
- Custom notification routing
- Notification batching

## Automation

### Built-in Automation

- **Triage Intelligence**: Auto-categorize and route issues
- **Auto-assign**: Based on labels or project
- **Status transitions**: Auto-update status on PR merge
- **Cycle management**: Auto-archive completed cycles

### API

- **GraphQL API**: Full read/write access to all resources
- **Webhooks**: Event-driven notifications
- **SDK**: Official TypeScript SDK
- **Integrations**: 50+ native integrations

### Linear Asks

- Intake forms that route to issues
- Slack-based issue creation
- Customer feedback capture

## AI Integration

### Linear Agent

- **Agent platform**: AI-assisted issue resolution
- **Coding sessions**: AI-assisted code editing (beta)
- **Loops**: Recurring work automation (beta)
- **Triage Intelligence**: AI-powered issue categorization

### Code Intelligence (Beta)

- AI-powered code analysis
- Similar issue detection
- Code review assistance

## Design Patterns

### Platform Patterns

- **Local-first**: Browser is primary data store
- **Optimistic writes**: Mutations apply locally before server sync
- **Domain-specific sync**: Custom sync engine for issue semantics
- **Granular observables**: Per-field MobX reactivity
- **Keyboard-first**: Every action has a keyboard shortcut
- **Opinionated design**: Enforces specific workflow

### Sync Patterns

- **WebSocket as sole transport**: Real-time bidirectional sync
- **Append-only operation log**: Immutable history of changes
- **Workspace sharding**: Logical tenant isolation
- **Write-path search**: Search index populated on write

## UX Observations

### What Works Well

- **Speed**: Zero perceived latency — the fastest issue tracker available
- **Keyboard shortcuts**: Every action has a shortcut, command palette for everything
- **Offline support**: Full functionality without network connection
- **Clean design**: Minimal, focused interface without feature bloat
- **Mobile apps**: Native iOS and Android apps with full functionality

### What Doesn't Work Well

- **Cloud-only**: No self-hosting option
- **Limited free tier**: 250 issues on free plan
- **No built-in releases**: Requires external release management
- **Opinionated**: Limited customization for non-standard workflows
- **Price**: $10-16/user/month can add up for large teams

### What's Innovative

- **Local-first architecture**: Revolutionary approach to web app performance
- **Domain-specific sync**: Custom sync engine for issue semantics
- **Keyboard-first design**: Every action accessible without mouse
- **Coding sessions**: AI-assisted code editing within issue tracker

## Reusable Ideas

1. **Local-first architecture**: Browser as primary data store for instant UI
2. **Optimistic writes**: Apply mutations locally before server confirmation
3. **Granular observables**: Per-field reactivity for efficient rendering
4. **Keyboard-first design**: Every action has a keyboard shortcut
5. **Command palette**: Universal navigation and action interface
6. **Write-path search**: Populate search index on write for faster reads
7. **Domain-specific sync**: Custom sync engine for specific data models

## Risks

- **No self-hosting**: Full dependency on Linear's infrastructure
- **Vendor lock-in**: GraphQL API but deep product integration
- **Free tier limits**: 250 issues may be insufficient for some projects
- **Opinionated design**: May not fit all team workflows
- **Price scaling**: $10-16/user/month adds up at scale
- **Feature gaps**: No built-in releases, wikis, or package registry

## Evidence

- **Source**: https://linear.app, https://linear.app/developers/graphql
- **Date collected**: 2026-08-03
- **Why it matters**: Linear represents the gold standard for issue tracker UX and performance, with a revolutionary local-first architecture
- **Trade-offs**: Unmatched speed and UX vs. cloud-only dependency and limited feature breadth
- **Expected value**: Best-in-class issue tracking with GraphQL API for integration
- **Maintenance burden**: Zero (SaaS only)

## Pricing (2026)

| Plan       | Price                            | Key Features                                           |
| ---------- | -------------------------------- | ------------------------------------------------------ |
| Free       | $0                               | Unlimited members, 2 teams, 250 issues                 |
| Basic      | $10/user/month                   | 5 teams, unlimited issues, admin roles                 |
| Business   | $16/user/month                   | Unlimited teams, private teams, guests, Insights, Asks |
| Enterprise | Custom (~$40/user at 200+ seats) | SAML/SCIM, audit controls, migration support           |
