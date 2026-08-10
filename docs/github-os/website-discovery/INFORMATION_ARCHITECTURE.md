# Information Architecture

## Site Map

```
bhavyafoundation.org (or ai.bhavyafoundation.org)
│
├── / (Homepage)
│   ├── Hero: Mission statement + CTA
│   ├── Featured Knowledge Packages
│   ├── Learning Paths overview
│   ├── Impact metrics
│   └── Testimonials
│
├── /learn (Learning Hub)
│   ├── /learn/ai-foundations (Level 1)
│   │   ├── /learn/ai-foundations/[module-slug] (Module page)
│   │   └── /learn/ai-foundations/[module-slug]/[kp-slug] (Knowledge Package)
│   ├── /learn/ai-builder (Level 2)
│   ├── /learn/ai-contributor (Level 3)
│   ├── /learn/ai-mentor (Level 4)
│   └── /learn/ai-researcher (Level 5)
│
├── /projects (Project Hub)
│   ├── /projects/flagship (Flagship projects)
│   │   └── /projects/flagship/[project-slug]
│   ├── /projects/community (Community projects)
│   └── /projects/[project-slug] (Project workspace)
│
├── /research (Research Hub)
│   ├── /research/publications
│   ├── /research/open-source
│   └── /research/[publication-slug]
│
├── /community (Community Hub)
│   ├── /community/discord
│   ├── /community/github
│   ├── /community/events
│   └── /community/stories
│
├── /blog (Blog & Newsletter)
│   ├── /blog/[post-slug]
│   └── /blog/newsletter
│
├── /about (About)
│   ├── /about/mission
│   ├── /about/team
│   ├── /about/impact
│   └── /about/partners
│
├── /docs (Documentation)
│   ├── /docs/getting-started
│   ├── /docs/curriculum
│   ├── /docs/contributing
│   └── /docs/api
│
└── /social (Social Hub)
    ├── Live feeds from GitHub, YouTube, LinkedIn
    ├── Social media links
    └── Newsletter signup
```

## Page Hierarchy

### Homepage

- **Purpose:** Introduce mission, showcase impact, drive action
- **Primary CTA:** Start Learning
- **Secondary CTA:** View Projects
- **Key sections:** Hero, Featured KPs, Learning Paths, Impact Stats, Testimonials

### Learning Hub (/learn)

- **Purpose:** Primary educational content delivery
- **Structure:** Level → Module → Knowledge Package
- **Navigation:** Sidebar with level/module hierarchy
- **Key features:** Progress tracking, search, filtering by level/topic

### Project Hub (/projects)

- **Purpose:** Showcase what learners build
- **Structure:** Flagship projects + community contributions
- **Navigation:** Grid/list view with filters
- **Key features:** Status badges, tech stack tags, contributor avatars

### Research Hub (/research)

- **Purpose:** Establish thought leadership
- **Structure:** Publications, open source, blog posts
- **Navigation:** Chronological + tag-based
- **Key features:** Citation info, related KPs, download links

### Community Hub (/community)

- **Purpose:** Connect learners, mentors, contributors
- **Structure:** Discord, GitHub org, events calendar
- **Navigation:** Social media feeds + community highlights
- **Key features:** Live activity feeds, member spotlights

### Blog (/blog)

- **Purpose:** News, updates, thought leadership
- **Structure:** Chronological posts with tags
- **Navigation:** Category + tag filtering
- **Key features:** Newsletter signup, social sharing, RSS

### Documentation (/docs)

- **Purpose:** Technical documentation for contributors
- **Structure:** Getting started, curriculum, contributing, API
- **Navigation:** Sidebar with collapsible sections
- **Key features:** Search, versioning, edit links

## Content Types

### Knowledge Package (KP)

- Title, description, level, module
- Learning outcomes, prerequisites, estimated time
- Sections with rich content (MDX)
- Assessment questions
- Media assets (images, diagrams)
- Metadata (version, status, author)

### Project

- Title, description, difficulty
- Tech stack, prerequisites
- Milestones with tasks
- Status (planned, in-progress, completed)
- Contributors, repository link

### Blog Post

- Title, excerpt, date, author
- Tags, featured image
- Full content (MDX)
- Reading time estimate

### Research Publication

- Title, authors, date
- Abstract, keywords
- PDF/download link
- Related KPs

## Navigation Rules

1. **Max 7 top-level items** in primary navigation
2. **Max 3 levels deep** in any content hierarchy
3. **Search always visible** (⌘K pattern)
4. **Breadcrumbs** on all pages except homepage
5. **Footer** mirrors primary navigation + social links
6. **Back to top** button on long pages
7. **Previous/Next** navigation on content pages
