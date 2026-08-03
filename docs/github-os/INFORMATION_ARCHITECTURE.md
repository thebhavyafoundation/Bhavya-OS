# GitHub OS — Information Architecture

## Navigation Model

### Global Navigation (Left Sidebar)

```
┌─────────────────────────────────────┐
│  BHAVYA OS                          │
│  ─────────────────────              │
│  🏠 Dashboard                      │
│  ─────────────────────              │
│  📦 REPOSITORIES                   │
│     ├─ All Repositories            │
│     ├─ Starred                     │
│     └─ Archived                    │
│  ─────────────────────              │
│  🧠 INTELLIGENCE                   │
│     ├─ Knowledge Base              │
│     ├─ Technology Radar            │
│     ├─ Research Hub                │
│     └─ Recommendations             │
│  ─────────────────────              │
│  🔧 ENGINEERING                    │
│     ├─ Issues                      │
│     ├─ Pull Requests               │
│     ├─ Code Review                 │
│     └─ Releases                    │
│  ─────────────────────              │
│  🤖 AUTOMATION                     │
│     ├─ Workflows                   │
│     ├─ MCP Servers                 │
│     └─ Plugins                     │
│  ─────────────────────              │
│  📚 LEARNING                       │
│     ├─ Learning Paths              │
│     ├─ Resources                   │
│     └─ Contributions               │
│  ─────────────────────              │
│  📊 ANALYTICS                      │
│     ├─ Engineering Metrics         │
│     ├─ Team Performance            │
│     └─ AI Metrics                  │
│  ─────────────────────              │
│  ⚙️ SETTINGS                       │
│     ├─ Organization                │
│     ├─ Teams                       │
│     ├─ Members                     │
│     └─ Security                    │
└─────────────────────────────────────┘
```

### Command Palette (⌘K)

Global search and action launcher:

```
┌─────────────────────────────────────┐
│  🔍 Type a command or search...     │
├─────────────────────────────────────┤
│  Recent                            │
│  ├─ bhavya-platform (repo)         │
│  ├─ PR #142 (pull request)         │
│  └─ ADR-001 (decision)             │
├─────────────────────────────────────┤
│  Quick Actions                      │
│  ├─ Create Issue                    │
│  ├─ Create Pull Request             │
│  ├─ Run Workflow                    │
│  └─ Install MCP Server              │
├─────────────────────────────────────┤
│  Navigation                         │
│  ├─ Go to Dashboard                 │
│  ├─ Go to Knowledge Base            │
│  └─ Go to Settings                  │
└─────────────────────────────────────┘
```

## Screen Hierarchy

### Level 1: Dashboard

- **Purpose:** At-a-glance overview of all engineering activity
- **Audience:** All users (personalized by role)
- **Content:** Health scores, recent activity, pending items, AI suggestions

### Level 2: Domain Screens

- **Purpose:** Deep dive into specific engineering domains
- **Audience:** Role-specific
- **Content:** Lists, filters, search, bulk actions

### Level 3: Entity Screens

- **Purpose:** Detailed view of specific entities
- **Audience:** Contributors and reviewers
- **Content:** Full details, related items, actions, history

### Level 4: Detail Screens

- **Purpose:** Edit, configure, or analyze specific aspects
- **Audience:** Power users
- **Content:** Forms, configurations, advanced options

## Information Architecture by Domain

### Repositories

```
Repositories
├─ All Repositories (grid/list view, search, filter)
│  └─ Repository Detail
│     ├─ Overview (health, metrics, recent activity)
│     ├─ Code (file browser, search)
│     ├─ Issues (list, create, filter)
│     ├─ Pull Requests (list, create, filter)
│     ├─ Knowledge (packages, ADRs, patterns)
│     ├─ Automation (workflows, MCP, plugins)
│     ├─ Analytics (metrics, trends)
│     └─ Settings (permissions, integrations)
├─ Starred (personal starred repos)
└─ Archived (archived repos)
```

### Intelligence

```
Intelligence
├─ Knowledge Base (all Knowledge Packages)
│  └─ Knowledge Package Detail
│     ├─ Content (full text, metadata)
│     ├─ Related (linked packages)
│     ├─ Sources (origin entities)
│     └─ Analytics (usage, impact)
├─ Technology Radar (interactive visualization)
│  └─ Technology Detail
│     ├─ Overview (description, maturity)
│     ├─ Usage (where used, how used)
│     ├─ Evaluation (assessment, comparison)
│     └─ Recommendations (adoption, deprecation)
├─ Research Hub (research modules)
│  └─ Research Module Detail
│     ├─ Findings (discoveries)
│     ├─ Methods (how research was conducted)
│     └─ Recommendations (suggested actions)
└─ Recommendations (AI-generated suggestions)
   └─ Recommendation Detail
      ├─ Context (why suggested)
      ├─ Impact (expected benefits)
      └─ Actions (accept, reject, defer)
```

### Engineering

```
Engineering
├─ Issues (all issues across repos)
│  └─ Issue Detail
│     ├─ Description (full context)
│     ├─ AI Suggestions (solutions, effort)
│     ├─ Linked Items (PRs, ADRs, resources)
│     ├─ Activity (comments, updates)
│     └─ Metadata (labels, assignees, milestones)
├─ Pull Requests (all PRs across repos)
│  └─ PR Detail
│     ├─ Changes (diff, files)
│     ├─ Review (AI review, human reviews)
│     ├─ Checks (CI status, tests)
│     ├─ Discussion (comments, reviews)
│     └─ Merge (status, actions)
├─ Code Review (review queue, assignments)
│  └─ Review Detail
│     ├─ Diff View (inline comments)
│     ├─ AI Analysis (suggestions, issues)
│     └─ Learning Points (educational insights)
└─ Releases (all releases across repos)
   └─ Release Detail
      ├─ Changelog (generated, editable)
      ├─ Breaking Changes (detected, documented)
      └─ Assets (binaries, packages)
```

### Automation

```
Automation
├─ Workflows (all workflows)
│  └─ Workflow Detail
│     ├─ Definition (triggers, steps)
│     ├─ History (past runs)
│     ├─ Analytics (success rate, duration)
│     └─ Settings (enable, disable, config)
├─ MCP Servers (installed MCPs)
│  └─ MCP Server Detail
│     ├─ Capabilities (what it can do)
│     ├─ Configuration (settings)
│     ├─ Status (health, usage)
│     └─ Documentation (usage guide)
└─ Plugins (installed plugins)
   └─ Plugin Detail
      ├─ Features (what it adds)
      ├─ Configuration (settings)
      └─ Compatibility (version info)
```

### Learning

```
Learning
├─ Learning Paths (personalized paths)
│  └─ Path Detail
│     ├─ Overview (goals, duration)
│     ├─ Steps (guided contributions)
│     ├─ Progress (completion, skills)
│     └─ Resources (linked materials)
├─ Resources (curated learning materials)
│  └─ Resource Detail
│     ├─ Content (article, video, course)
│     ├─ Related (linked to repos, issues)
│     └─ Reviews (ratings, feedback)
└─ Contributions (personal contribution history)
   └─ Contribution Detail
      ├─ Code (changes made)
      ├─ Review (feedback received)
      ├─ Learning (points earned)
      └─ Impact (contribution value)
```

### Analytics

```
Analytics
├─ Engineering Metrics (velocity, quality, health)
│  ├─ Repository Health (per repo)
│  ├─ Team Performance (per team)
│  ├─ Individual Metrics (per person)
│  └─ Trends (over time)
├─ Team Performance (team comparisons)
│  ├─ Velocity (story points, issues)
│  ├─ Quality (bugs, reviews, coverage)
│  ├─ Collaboration (PRs, reviews, discussions)
│  └─ Growth (skills, contributions)
└─ AI Metrics (AI effectiveness)
   ├─ Suggestions (generated, accepted)
   ├─ Reviews (AI-assisted, quality)
   ├─ Knowledge (packages generated)
   └─ Learning (paths completed)
```

### Settings

```
Settings
├─ Organization (name, description, settings)
├─ Teams (create, edit, manage)
├─ Members (invite, remove, roles)
├─ Security (permissions, access, audit)
├─ Integrations (GitHub, MCP, webhooks)
└─ Notifications (preferences, channels)
```

## Breadcrumb Navigation

Every screen shows the navigation path:

```
Dashboard > Repositories > bhavya-platform > Issues > #142
```

## Search Hierarchy

1. **Global Search** (⌘K) — Search everything
2. **Domain Search** — Search within current domain
3. **Entity Search** — Search within current entity
4. **Contextual Search** — Search related items

## Responsive Breakpoints

| Breakpoint | Width       | Layout                           |
| ---------- | ----------- | -------------------------------- |
| Mobile     | < 640px     | Single column, bottom nav        |
| Tablet     | 640-1024px  | Two columns, collapsible sidebar |
| Desktop    | 1024-1440px | Three columns, fixed sidebar     |
| Wide       | > 1440px    | Full layout, expanded sidebar    |

## Keyboard Navigation

- **⌘K** — Command palette
- **⌘/** — Search
- **⌘N** — Create new (context-aware)
- **⌘E** — Edit current entity
- **⌘⇧P** — Command palette (alternative)
- **⌘⇧K** — Quick actions
- **↑/↓** — Navigate list items
- **Enter** — Open selected item
- **Escape** — Close modals, go back
- **⌘⇧↑/↓** — Move between sections
