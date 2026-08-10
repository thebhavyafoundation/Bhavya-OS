# Navigation Patterns

## Primary Navigation

### Top Bar

- **Left:** Logo (Bhavya Foundation)
- **Center:** Primary links (Learn, Projects, Research, Community, Blog)
- **Right:** Search (⌘K), Dark/Light toggle, Sign Up / Log In

### Pattern from Elite Sites

| Site            | Primary Nav Items                                       | Search | CTA                         |
| --------------- | ------------------------------------------------------- | ------ | --------------------------- |
| Vercel          | Products, Solutions, Resources, Enterprise, Pricing     | ⌘K     | Get a Demo, Log In, Sign Up |
| Anthropic       | Research, Policy, Commitments, Learn, News              | ⌘K     | Try Claude                  |
| Stripe          | Products, Solutions, Developers, Resources, Pricing     | ⌘K     | Start now, Contact sales    |
| Linear          | Product, Resources, Customers, Pricing, Now, Contact    | ⌘K     | Sign up, Log in             |
| GitHub          | Platform, Solutions, Resources, Open Source, Enterprise | ⌘K     | Sign in, Sign up            |
| DeepLearning.AI | Courses, Newsletter, Community, Membership              | ⌘K     | Start Learning              |

**Recommendation for Bhavya:**

- Learn, Projects, Research, Community, Blog, About
- Search (⌘K)
- Get Started (primary CTA)

## Secondary Navigation

### Mega Menu (Desktop)

Used by Vercel, Stripe, GitHub for complex product catalogs.

**Bhavya mega menu for "Learn":**

```
Learn
├── Getting Started
│   ├── New to AI?
│   ├── Choose Your Path
│   └── First Knowledge Package
├── AI Foundations (Level 1)
│   ├── Module 1.1: How LLMs Work
│   ├── Module 1.2: Python Basics
│   └── View All Modules →
├── AI Builder (Level 2)
│   ├── Module 2.1: Building with APIs
│   └── View All Modules →
├── Learning Paths
│   ├── Beginner Path
│   ├── Builder Path
│   └── Contributor Path
└── View Full Curriculum →
```

### Sidebar (Documentation/Learning)

Used by Docusaurus, Starlight, Fumadocs for deep content.

**Bhavya sidebar for Learning Hub:**

```
Getting Started
├── Welcome
├── How to Use This Site
└── Choose Your Path

AI Foundations (Level 1)
├── Module 1.1: How LLMs Work
│   ├── Knowledge Package 1.1.1
│   ├── Knowledge Package 1.1.2
│   └── Project 1.1
├── Module 1.2: Python Basics
│   ├── Knowledge Package 1.2.1
│   └── Knowledge Package 1.2.2
└── Module 1.3: Data Fundamentals

AI Builder (Level 2)
├── Module 2.1: Building with APIs
└── ...
```

## Search Pattern

### Command Palette (⌘K)

Used by: Vercel, Linear, Stripe, GitHub, Anthropic

**Features:**

- Full-text search across all content
- Keyboard navigation (↑↓, Enter, Esc)
- Recent searches
- Quick actions (Navigate to page, Toggle theme)
- AI-powered suggestions (optional)

**Implementation:** Algolia DocSearch or FlexSearch

### Search Results

- Title + excerpt + breadcrumb
- Content type badge (KP, Project, Blog)
- Relevance score
- Quick preview on hover (optional)

## Breadcrumb Pattern

**Format:** Home > Level > Module > Knowledge Package

**Example:**

```
Home > AI Foundations > Module 1.1 > How Large Language Models Work
```

**Rules:**

- Always show full path
- Each segment is a link
- Current page is not a link
- Mobile: Truncate with "..."

## Footer Pattern

**Structure (from Stripe/Vercel):**

```
┌─────────────────────────────────────────────────────┐
│ Bhavya Foundation                                    │
│ Building the future of AI education                  │
│                                                      │
│ Learn          Projects        Community             │
│ AI Foundations  Flagship        Discord               │
│ AI Builder      Community       GitHub                │
│ AI Contributor  Open Source     Events                │
│ Learning Paths                  Newsletter            │
│                                                      │
│ Research       About           Resources             │
│ Publications   Mission         Documentation         │
│ Open Source    Team            Blog                   │
│ Blog           Partners        Changelog              │
│                                                      │
│ [GitHub] [LinkedIn] [YouTube] [X] [Discord]          │
│                                                      │
│ © 2026 Bhavya Foundation. All rights reserved.       │
│ Privacy · Terms · Accessibility                       │
└─────────────────────────────────────────────────────┘
```

## Mobile Navigation

### Hamburger Menu

- Slide-in from right
- Full primary navigation
- Search access
- CTA buttons

### Bottom Tab Bar (optional)

- Home, Learn, Projects, Community, Profile
- Only for logged-in users

## Progress Indicators

### Learning Progress

- Module completion: Progress bar (0-100%)
- Level completion: Circular progress
- Overall progress: Dashboard widget

### Reading Progress

- Top bar progress indicator
- Percentage complete
- Estimated time remaining

## Cross-Linking Rules

1. **Every KP** links to its parent module and level
2. **Every project** links to related KPs
3. **Every blog post** links to related KPs and projects
4. **Every research publication** links to related KPs
5. **Every page** has "Next steps" or "Related content" section
6. **Sidebar** shows context-aware related content
