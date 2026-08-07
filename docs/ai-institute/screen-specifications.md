# Screen Specifications — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Overview

Production-ready specifications for every major screen. Includes layout, components, motion, keyboard navigation, accessibility, and responsive behavior.

---

## Screen 1: Landing Experience

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo + Nav + CTA                                   │
├─────────────────────────────────────────────────────────────┤
│  Hero: 60vh                                                 │
│  ├── Headline (Playfair, 48px)                              │
│  ├── Subheadline (Inter, 18px)                              │
│  ├── CTA buttons (2)                                        │
│  └── Social proof (counter, avatars)                        │
├─────────────────────────────────────────────────────────────┤
│  Path Cards: 3-column grid                                  │
│  ├── Explorer (12 weeks)                                    │
│  ├── Builder (16 weeks)                                     │
│  └── Researcher (24 weeks)                                  │
├─────────────────────────────────────────────────────────────┤
│  Features: 2-column grid (icon + text)                      │
├─────────────────────────────────────────────────────────────┤
│  Testimonials: Carousel                                     │
├─────────────────────────────────────────────────────────────┤
│  Footer: Links + Social + Newsletter                        │
└─────────────────────────────────────────────────────────────┘

Tablet (768px):
- Header: Hamburger menu
- Hero: 50vh
- Path Cards: 1-column stack
- Features: 1-column stack

Mobile (375px):
- Header: Logo + hamburger
- Hero: 40vh
- Path Cards: 1-column stack
- Features: 1-column stack
```

### Components

| Component       | Source    | Props                            |
| --------------- | --------- | -------------------------------- |
| Header          | AppLayout | brand, navItems, cta             |
| Hero            | PageHero  | headline, subheadline, ctas      |
| PathCard        | Card      | title, weeks, level, description |
| FeatureCard     | Card      | icon, title, description         |
| TestimonialCard | Card      | quote, author, avatar            |
| Footer          | Custom    | links, social, newsletter        |

### Motion

| Element       | Animation      | Duration        |
| ------------- | -------------- | --------------- |
| Hero text     | fade-in-up     | 600ms staggered |
| Path cards    | scale-in       | 400ms staggered |
| Feature cards | fade-in-up     | 300ms staggered |
| Testimonials  | slide-in       | 500ms           |
| CTA button    | pulse (subtle) | 2s loop         |

### Keyboard Navigation

| Key        | Action                        |
| ---------- | ----------------------------- |
| Tab        | Focus CTA buttons             |
| Enter      | Activate focused element      |
| Arrow keys | Navigate testimonial carousel |

### Accessibility

| Requirement      | Implementation                 |
| ---------------- | ------------------------------ |
| Skip navigation  | SkipNavigation component       |
| Focus indicators | focusRing() on all interactive |
| Screen reader    | ARIA labels on CTAs            |
| Color contrast   | 4.5:1 minimum                  |
| Reduced motion   | Disable animations             |

---

## Screen 2: Learning Dashboard

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (240px)           │  Main Content (1200px)         │
│  ├── Logo                  │  ├── Welcome message            │
│  ├── Dashboard (active)    │  ├── Continue Learning card     │
│  ├── Courses               │  ├── Stats row (3 cards)        │
│  ├── Projects              │  ├── Schedule + AI Mentor       │
│  ├── Portfolio             │  └── Achievements               │
│  ├── Community             │                                 │
│  └── Settings              │                                 │
└─────────────────────────────────────────────────────────────┘

Tablet (768px):
- Sidebar: Collapsed (icons only)
- Main: Full width

Mobile (375px):
- Sidebar: Hidden (bottom nav)
- Main: Full width
```

### Components

| Component        | Source   | Props                               |
| ---------------- | -------- | ----------------------------------- |
| Sidebar          | Sidebar  | brand, items, collapsed             |
| ContinueCard     | Card     | course, lesson, progress, thumbnail |
| StatCard         | StatCard | label, value, icon, trend           |
| ScheduleCard     | Card     | events                              |
| AIMentorCard     | Card     | message, avatar                     |
| AchievementBadge | Badge    | achievement, icon                   |

### Motion

| Element       | Animation      | Duration   |
| ------------- | -------------- | ---------- |
| Welcome text  | fade-in        | 300ms      |
| Continue card | slide-in-left  | 400ms      |
| Stats         | count-up       | 600ms      |
| Streak flame  | pulse          | 2s loop    |
| Achievements  | stagger reveal | 300ms each |

### Keyboard Navigation

| Key   | Action               |
| ----- | -------------------- |
| ⌘K    | Open command palette |
| ⌘B    | Toggle sidebar       |
| J/K   | Navigate stat cards  |
| Enter | Open Continue card   |

### Accessibility

| Requirement        | Implementation                              |
| ------------------ | ------------------------------------------- |
| Sidebar navigation | aria-label="Main navigation"                |
| Stat cards         | aria-label with value                       |
| Progress           | aria-valuenow, aria-valuemin, aria-valuemax |
| Screen reader      | Announce streak updates                     |

---

## Screen 3: Course Experience

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (240px)           │  Main Content (1200px)         │
│  ├── Course modules        │  ├── Course header              │
│  │   ├── Module 1 (active) │  ├── Thumbnail/video            │
│  │   │   ├── Lesson 1.1 ✓  │  ├── Stats (modules, hours)    │
│  │   │   ├── Lesson 1.2 ✓  │  ├── Learning objectives        │
│  │   │   ├── Lesson 1.3 ●  │  ├── Module list (accordion)   │
│  │   │   └── Lab 1 ○       │  └── Continue button            │
│  │   └── Module 2 ▶        │                                 │
│  └── AI Mentor             │                                 │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component          | Source    | Props                            |
| ------------------ | --------- | -------------------------------- |
| CourseSidebar      | Sidebar   | modules, progress, currentLesson |
| ModuleAccordion    | Accordion | module, lessons, expanded        |
| LessonItem         | ListItem  | lesson, status, duration         |
| CourseHeader       | Custom    | title, description, stats        |
| Thumbnail          | Image     | src, alt                         |
| LearningObjectives | List      | objectives                       |

### Motion

| Element          | Animation | Duration |
| ---------------- | --------- | -------- |
| Module expand    | spring    | 300ms    |
| Lesson checkmark | scale-in  | 200ms    |
| Progress bar     | fill      | 500ms    |
| Continue button  | pulse     | 2s loop  |

### Keyboard Navigation

| Key           | Action                 |
| ------------- | ---------------------- |
| Arrow up/down | Navigate lessons       |
| Enter         | Open lesson            |
| Space         | Expand/collapse module |
| Escape        | Back to dashboard      |

### Accessibility

| Requirement     | Implementation               |
| --------------- | ---------------------------- |
| Module headings | aria-expanded                |
| Lesson list     | role="tree", role="treeitem" |
| Progress        | aria-valuenow                |
| Current lesson  | aria-current="true"          |

---

## Screen 4: Lesson Reader

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Breadcrumb + Lesson title + Duration               │
├─────────────────────────────────────────────────────────────┤
│  Content (900px centered)                                   │
│  ├── Objectives card                                        │
│  ├── Content sections (scroll-based)                        │
│  │   ├── Heading                                            │
│  │   ├── Paragraph                                          │
│  │   ├── Interactive diagram                                │
│  │   ├── Code block                                         │
│  │   ├── Checkpoint quiz                                    │
│  │   └── Key takeaways                                      │
│  └── Next lesson preview                                    │
├─────────────────────────────────────────────────────────────┤
│  Footer: Previous / Next                                    │
└─────────────────────────────────────────────────────────────┘

Right sidebar (toggleable):
├── AI Mentor chat
├── Notes panel
└── Table of contents
```

### Components

| Component          | Source     | Props                    |
| ------------------ | ---------- | ------------------------ |
| Breadcrumb         | Breadcrumb | items                    |
| ObjectivesCard     | Card       | objectives               |
| ContentSection     | Markdown   | content                  |
| InteractiveDiagram | Custom     | diagram data             |
| CodeBlock          | CodeBlock  | code, language, runnable |
| CheckpointQuiz     | Quiz       | questions                |
| KeyTakeaways       | List       | takeaways                |
| NextPreview        | Card       | nextLesson               |
| AIMentorPanel      | Chat       | context                  |
| NotesPanel         | Textarea   | notes                    |

### Motion

| Element          | Animation            | Duration   |
| ---------------- | -------------------- | ---------- |
| Content sections | fade-in-up on scroll | 300ms      |
| Checkpoint       | instant feedback     | 0ms        |
| Correct answer   | green pulse          | 200ms      |
| Incorrect answer | red shake            | 300ms      |
| Takeaways        | stagger reveal       | 100ms each |

### Keyboard Navigation

| Key        | Action           |
| ---------- | ---------------- |
| Arrow down | Scroll down      |
| Arrow up   | Scroll up        |
| ⌘]         | Next lesson      |
| ⌘[         | Previous lesson  |
| ⌘Enter     | Run code         |
| ⌘M         | Toggle AI Mentor |
| ⌘N         | Toggle notes     |

### Accessibility

| Requirement | Implementation                  |
| ----------- | ------------------------------- |
| Headings    | Proper hierarchy (h1 → h2 → h3) |
| Code blocks | aria-label with language        |
| Checkpoint  | aria-live for feedback          |
| Progress    | aria-valuenow for completion    |

---

## Screen 5: Interactive Lab

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Lab title + Duration + Problem statement            │
├─────────────────────────────────────────────────────────────┤
│  Split pane (resizable)                                     │
│  ├── Code Editor (50%)                                      │
│  │   ├── Monaco editor                                      │
│  │   ├── Language selector                                  │
│  │   └── Run/Reset buttons                                  │
│  └── Output (50%)                                           │
│      ├── Output panel                                       │
│      ├── Test results                                       │
│      └── AI Mentor hints                                    │
├─────────────────────────────────────────────────────────────┤
│  Footer: Submit + Save + Hints                              │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component    | Source    | Props                            |
| ------------ | --------- | -------------------------------- |
| ProblemCard  | Card      | statement, dataset, requirements |
| CodeEditor   | Monaco    | code, language, onChange         |
| OutputPanel  | Pre       | output, errors, testResults      |
| HintSystem   | Accordion | hints, revealed                  |
| AIMentorChat | Chat      | context, suggestions             |
| SplitPane    | SplitPane | left, right, defaultSize         |

### Motion

| Element          | Animation       | Duration       |
| ---------------- | --------------- | -------------- |
| Output streaming | typewriter      | real-time      |
| Test results     | fade-in         | 200ms          |
| Hint reveal      | slide-down      | 300ms          |
| Submit           | loading spinner | until complete |

### Keyboard Navigation

| Key    | Action                         |
| ------ | ------------------------------ |
| ⌘Enter | Run code                       |
| ⌘S     | Save progress                  |
| ⌘H     | Request hint                   |
| ⌘/     | Ask AI Mentor                  |
| Tab    | Navigate between editor/output |

### Accessibility

| Requirement  | Implementation            |
| ------------ | ------------------------- |
| Editor       | aria-label="Code editor"  |
| Output       | aria-label="Output panel" |
| Run button   | aria-label="Run code"     |
| Test results | aria-live="polite"        |

---

## Screen 6: AI Mentor Workspace

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: AI Mentor + Context panel (collapsible)            │
├─────────────────────────────────────────────────────────────┤
│  Chat interface (600px centered)                            │
│  ├── Message history (scrollable)                           │
│  │   ├── User message (right-aligned)                       │
│  │   └── Mentor message (left-aligned, avatar)              │
│  ├── Typing indicator                                       │
│  └── Input area                                             │
│      ├── Text input                                         │
│      ├── Quick actions (buttons)                            │
│      └── Send button                                        │
└─────────────────────────────────────────────────────────────┘

Context panel (right, collapsible):
├── Current lesson
├── Progress
├── Strengths/weaknesses
└── Goals
```

### Components

| Component       | Source      | Props                              |
| --------------- | ----------- | ---------------------------------- |
| ChatMessage     | Card        | message, sender, avatar, timestamp |
| TypingIndicator | Custom      | dots animation                     |
| ChatInput       | InputArea   | placeholder, onSend                |
| QuickActions    | ButtonGroup | actions                            |
| ContextPanel    | Sidebar     | context data                       |

### Motion

| Element          | Animation   | Duration |
| ---------------- | ----------- | -------- |
| Messages         | fade-in-up  | 200ms    |
| Typing indicator | dots bounce | 1s loop  |
| Context panel    | slide-in    | 300ms    |

### Keyboard Navigation

| Key      | Action                 |
| -------- | ---------------------- |
| Enter    | Send message           |
| Escape   | Close context panel    |
| Arrow up | Edit last message      |
| Tab      | Navigate quick actions |

### Accessibility

| Requirement | Implementation                 |
| ----------- | ------------------------------ |
| Messages    | role="log", aria-live="polite" |
| Input       | aria-label="Message input"     |
| Send        | aria-label="Send message"      |
| Typing      | aria-live="assertive"          |

---

## Screen 7: Knowledge Graph Explorer

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Knowledge Graph + Search + Filters                 │
├─────────────────────────────────────────────────────────────┤
│  Graph visualization (full width, 60vh)                     │
│  ├── Nodes (concept circles)                                │
│  ├── Edges (prerequisite arrows)                            │
│  ├── Zoom/Pan controls                                      │
│  └── Selection highlight                                     │
├─────────────────────────────────────────────────────────────┤
│  Details panel (bottom, slide-up)                           │
│  ├── Concept name                                           │
│  ├── Mastery level                                          │
│  ├── Prerequisites                                          │
│  ├── Related lessons                                        │
│  └── Actions (Start, Review, Practice)                      │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component          | Source      | Props                      |
| ------------------ | ----------- | -------------------------- |
| GraphVisualization | D3          | nodes, edges, onNodeClick  |
| GraphNode          | SVG         | concept, mastery, position |
| GraphEdge          | SVG         | source, target, animated   |
| SearchBar          | SearchBar   | placeholder, onSearch      |
| FilterBar          | ButtonGroup | filters                    |
| DetailsPanel       | Card        | concept details            |

### Motion

| Element        | Animation             | Duration |
| -------------- | --------------------- | -------- |
| Graph load     | force-directed layout | 1000ms   |
| Node hover     | scale-up              | 200ms    |
| Node select    | glow                  | 300ms    |
| Edge particles | continuous flow       | 2s loop  |
| Details panel  | slide-up              | 300ms    |

### Keyboard Navigation

| Key        | Action         |
| ---------- | -------------- |
| Arrow keys | Pan graph      |
| +/-        | Zoom in/out    |
| Tab        | Navigate nodes |
| Enter      | Select node    |
| Escape     | Deselect       |

### Accessibility

| Requirement   | Implementation               |
| ------------- | ---------------------------- |
| Graph         | aria-label="Knowledge graph" |
| Nodes         | role="button", aria-label    |
| Details       | aria-live="polite"           |
| Screen reader | Alternative list view        |

---

## Screen 8: Project Studio

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Project title + Duration + Status                  │
├─────────────────────────────────────────────────────────────┤
│  Split view (tabs)                                          │
│  ├── Brief tab                                              │
│  │   ├── Problem statement                                  │
│  │   ├── Requirements                                       │
│  │   └── Milestones                                         │
│  ├── Code tab                                               │
│  │   ├── Repository view                                    │
│  │   └── File browser                                       │
│  ├── Review tab                                             │
│  │   ├── AI Mentor feedback                                 │
│  │   └── Peer review                                        │
│  └── Submission tab                                         │
│      ├── Checklist                                          │
│      └── Submit button                                      │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component           | Source    | Props                             |
| ------------------- | --------- | --------------------------------- |
| BriefCard           | Card      | problem, requirements, milestones |
| MilestoneList       | List      | milestones, progress              |
| CodeView            | Monaco    | code, readOnly                    |
| ReviewPanel         | Chat      | feedback                          |
| SubmissionChecklist | Checklist | items, completed                  |

### Motion

| Element         | Animation | Duration |
| --------------- | --------- | -------- |
| Tab switch      | fade      | 200ms    |
| Milestone check | scale-in  | 200ms    |
| Submit          | confetti  | 1000ms   |

### Keyboard Navigation

| Key    | Action      |
| ------ | ----------- |
| ⌘1-4   | Switch tabs |
| ⌘S     | Save        |
| ⌘Enter | Submit      |

### Accessibility

| Requirement | Implementation               |
| ----------- | ---------------------------- |
| Tabs        | role="tablist", role="tab"   |
| Checklist   | aria-checked                 |
| Submit      | aria-label with project name |

---

## Screen 9: Research Library

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Research Library + Search                          │
├─────────────────────────────────────────────────────────────┤
│  Filters: Type, Topic, Level (horizontal)                   │
├─────────────────────────────────────────────────────────────┤
│  Results grid (3 columns)                                   │
│  ├── Paper card                                             │
│  │   ├── Title                                              │
│  │   ├── Authors                                            │
│  │   ├── Tags                                               │
│  │   └── Actions (Read, Cite, Save)                         │
│  ├── Dataset card                                           │
│  └── Tutorial card                                          │
├─────────────────────────────────────────────────────────────┤
│  Pagination                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component    | Source      | Props                  |
| ------------ | ----------- | ---------------------- |
| SearchBar    | SearchBar   | placeholder, onSearch  |
| FilterBar    | ButtonGroup | filters, active        |
| PaperCard    | Card        | title, authors, tags   |
| DatasetCard  | Card        | name, size, format     |
| TutorialCard | Card        | title, duration, level |
| Pagination   | Pagination  | page, total            |

### Motion

| Element       | Animation       | Duration   |
| ------------- | --------------- | ---------- |
| Cards         | stagger fade-in | 100ms each |
| Filter change | fade            | 200ms      |

### Keyboard Navigation

| Key        | Action         |
| ---------- | -------------- |
| /          | Focus search   |
| Arrow keys | Navigate cards |
| Enter      | Open card      |
| S          | Save card      |

### Accessibility

| Requirement | Implementation               |
| ----------- | ---------------------------- |
| Search      | aria-label="Search research" |
| Cards       | role="article"               |
| Tags        | aria-label with tag text     |

---

## Screen 10: Notebook Workspace

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Notebook title + Save + Share + Export             │
├─────────────────────────────────────────────────────────────┤
│  Cells (vertical stack, reorderable)                        │
│  ├── Markdown cell                                          │
│  │   └── Editable markdown                                  │
│  ├── Code cell                                               │
│  │   ├── Editor                                             │
│  │   ├── Run button                                         │
│  │   └── Output                                             │
│  └── [Add cell] button                                      │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component     | Source          | Props                  |
| ------------- | --------------- | ---------------------- |
| MarkdownCell  | Textarea        | content, onChange      |
| CodeCell      | Monaco + Output | code, output, language |
| AddCellButton | Button          | type (markdown/code)   |
| CellToolbar   | Toolbar         | actions                |

### Motion

| Element      | Animation  | Duration  |
| ------------ | ---------- | --------- |
| Cell add     | slide-down | 200ms     |
| Cell reorder | drag       | real-time |
| Output       | typewriter | real-time |

### Keyboard Navigation

| Key           | Action               |
| ------------- | -------------------- |
| ⌘Enter        | Run code cell        |
| ⌘S            | Save notebook        |
| ⌘M            | Toggle markdown/code |
| Arrow up/down | Navigate cells       |

### Accessibility

| Requirement | Implementation            |
| ----------- | ------------------------- |
| Cells       | role="region", aria-label |
| Editor      | aria-label="Code editor"  |
| Output      | aria-label="Output"       |

---

## Screen 11: Portfolio Showcase

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Name + Level + XP + Specialization                 │
├─────────────────────────────────────────────────────────────┤
│  Skills radar chart (centered)                              │
├─────────────────────────────────────────────────────────────┤
│  Projects grid (3 columns)                                  │
│  ├── Project card                                           │
│  │   ├── Thumbnail                                          │
│  │   ├── Title                                              │
│  │   ├── Description                                        │
│  │   └── Actions (View, GitHub)                             │
├─────────────────────────────────────────────────────────────┤
│  Research list                                              │
├─────────────────────────────────────────────────────────────┤
│  Actions: Edit, Share, Export PDF                           │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component     | Source      | Props                           |
| ------------- | ----------- | ------------------------------- |
| ProfileHeader | Custom      | name, level, xp, specialization |
| SkillRadar    | SVG         | skills, values                  |
| ProjectCard   | Card        | project                         |
| ResearchList  | List        | papers                          |
| ActionButtons | ButtonGroup | actions                         |

### Motion

| Element       | Animation       | Duration   |
| ------------- | --------------- | ---------- |
| Radar chart   | draw-in         | 1000ms     |
| Project cards | stagger fade-in | 100ms each |
| Export        | confetti        | 1000ms     |

### Keyboard Navigation

| Key   | Action         |
| ----- | -------------- |
| Tab   | Navigate cards |
| Enter | Open project   |
| E     | Edit profile   |
| P     | Export PDF     |

### Accessibility

| Requirement | Implementation               |
| ----------- | ---------------------------- |
| Radar chart | aria-label with skill values |
| Cards       | role="article"               |
| Actions     | aria-label with action text  |

---

## Screen 12: Progress Center

### Layout

```
Desktop (1440px):
┌─────────────────────────────────────────────────────────────┐
│  Header: Progress Center                                    │
├─────────────────────────────────────────────────────────────┤
│  Stats row (4 cards)                                        │
├─────────────────────────────────────────────────────────────┤
│  Timeline visualization (horizontal)                        │
├─────────────────────────────────────────────────────────────┤
│  Achievements grid                                          │
├─────────────────────────────────────────────────────────────┤
│  Learning analytics (charts)                                │
│  ├── Study time by day                                      │
│  ├── Completion by topic                                    │
│  └── Quiz scores over time                                  │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component       | Source   | Props              |
| --------------- | -------- | ------------------ |
| StatCard        | StatCard | label, value, icon |
| Timeline        | Custom   | events, progress   |
| AchievementGrid | Grid     | achievements       |
| AnalyticsChart  | Charts   | data, type         |

### Motion

| Element      | Animation       | Duration   |
| ------------ | --------------- | ---------- |
| Stats        | count-up        | 600ms      |
| Timeline     | draw-in         | 1000ms     |
| Achievements | stagger fade-in | 100ms each |
| Charts       | draw-in         | 800ms      |

### Keyboard Navigation

| Key        | Action                   |
| ---------- | ------------------------ |
| Tab        | Navigate sections        |
| Arrow keys | Navigate achievements    |
| Enter      | View achievement details |

### Accessibility

| Requirement | Implementation          |
| ----------- | ----------------------- |
| Stats       | aria-label with values  |
| Timeline    | aria-label with dates   |
| Charts      | aria-label with summary |

---

## Responsive Behavior Summary

| Screen          | Mobile               | Tablet              | Desktop       |
| --------------- | -------------------- | ------------------- | ------------- |
| Landing         | Single column        | 2-column grid       | Full layout   |
| Dashboard       | Bottom nav           | Collapsible sidebar | Full sidebar  |
| Course          | Full-width modules   | Split view          | Full layout   |
| Lesson          | Full-width content   | Content + sidebar   | Full layout   |
| Lab             | Toggle editor/output | Split pane          | Full split    |
| AI Mentor       | Full-width chat      | Chat + context      | Full layout   |
| Knowledge Graph | List view            | Small graph         | Full graph    |
| Projects        | Tabbed view          | Split view          | Full layout   |
| Portfolio       | Single column        | 2-column grid       | 3-column grid |

---

_Every screen is production-ready. Every interaction is specified._
