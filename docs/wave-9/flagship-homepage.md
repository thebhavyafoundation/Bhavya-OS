# Flagship Homepage Specification

## Vision

The front door to a future institution. Not a landing page. An experience that communicates the weight, ambition, and intellectual seriousness of Bhavya AI Institute.

## Design Principles (from Repository Intelligence)

1. **Content-first** — No sidebars, no unnecessary chrome
2. **Dark mode primary** — Premium, focused, scientific
3. **Forest green accent** — #1a3a2a (Bhavya's identity)
4. **Gold highlights** — #c9a227 (achievement, excellence)
5. **Generous whitespace** — Space communicates quality
6. **Typography hierarchy** — Inter for UI, JetBrains Mono for code
7. **Motion with purpose** — Every animation communicates understanding

## Page Sections

### 1. Cinematic Hero

- Full viewport height
- Animated knowledge graph background (constellation of connected concepts)
- Bold headline: "The Institution Where AI Is Understood, Not Just Used"
- Subheadline: "A 10-year mission to become the global benchmark for AI education"
- Primary CTA: "Begin Your Journey"
- Secondary CTA: "Explore the Knowledge Graph"

### 2. Interactive Knowledge Graph

- Visual representation of Bhavya's curriculum as a connected graph
- Nodes = concepts, Edges = relationships
- Hover to see connections
- Click to explore a school
- Animation: Nodes pulse when hovered, edges glow

### 3. 12 Schools of AI

- Grid of 12 school cards
- Each card: icon, name, description, course count
- Hover: reveal school's unique color accent
- Click: navigate to school page

### 4. Learning Paths

- Horizontal scroll of 8 flagship learning paths
- Each path: title, duration, difficulty, progress indicator
- Visual: Path visualization (start → milestones → end)

### 5. Research Highlights

- Latest research papers and publications
- Cards with title, authors, abstract snippet, citation count
- Link to research library

### 6. Featured Projects

- Student projects from the portfolio
- Live demos embedded
- Student name, project title, technologies used

### 7. Student Success Roadmap

- Visual timeline: Visitor → Learner → Practitioner → Researcher → Mentor
- Each stage: skills acquired, projects completed, career outcomes
- Animated progression

### 8. Faculty Vision

- Quote from founder
- Vision statement
- Institutional philosophy

### 9. Community

- Active learners count
- Discussion threads
- Open source contributions
- Upcoming events

### 10. Open Source

- GitHub stars, forks, contributors
- Featured repositories
- Contribution guide

### 11. Career Pathways

- Visual mapping: Skills → Roles → Companies
- Salary ranges
- Job market demand

### 12. Footer

- Navigation links
- Social media
- Newsletter signup
- Legal links

## Component Architecture

```
FlagshipHomepage
├── CinematicHero
│   ├── AnimatedKnowledgeGraph
│   ├── HeroContent
│   └── HeroActions
├── SchoolsGrid
│   └── SchoolCard (x12)
├── LearningPaths
│   └── PathCard (x8)
├── ResearchHighlights
│   └── ResearchCard (x3)
├── FeaturedProjects
│   └── ProjectCard (x3)
├── StudentRoadmap
│   └── RoadmapStage (x5)
├── FacultyVision
├── CommunityStats
├── OpenSourceStats
├── CareerPathways
└── Footer
```

## Animation Map

| Element         | Trigger    | Animation            | Duration |
| --------------- | ---------- | -------------------- | -------- |
| Hero text       | Page load  | Fade up + slide      | 800ms    |
| Knowledge graph | Continuous | Particle movement    | Loop     |
| School cards    | Hover      | Scale + glow         | 300ms    |
| Learning path   | Scroll     | Reveal left to right | 500ms    |
| Research cards  | Scroll     | Fade up              | 400ms    |
| Roadmap         | Scroll     | Progress fill        | 600ms    |
| Stats           | Scroll     | Count up             | 1000ms   |

## Color Usage

| Element        | Color   | Purpose           |
| -------------- | ------- | ----------------- |
| Background     | #0a0f0d | Deep forest black |
| Surface        | #111916 | Elevated surfaces |
| Border         | #1a2a1f | Subtle borders    |
| Primary text   | #f5f1e6 | Cream white       |
| Secondary text | #8a7359 | Earth tone        |
| Accent         | #1a3a2a | Forest green      |
| Highlight      | #c9a227 | Gold              |
| Code           | #1e3a2a | Green tint        |

## Typography Scale

| Element       | Font           | Size | Weight | Line Height |
| ------------- | -------------- | ---- | ------ | ----------- |
| Hero headline | Inter          | 64px | 700    | 1.1         |
| Section title | Inter          | 48px | 600    | 1.2         |
| Card title    | Inter          | 24px | 600    | 1.3         |
| Body          | Inter          | 16px | 400    | 1.6         |
| Caption       | Inter          | 14px | 400    | 1.5         |
| Code          | JetBrains Mono | 14px | 400    | 1.5         |

## Responsive Breakpoints

| Breakpoint | Width      | Layout                 |
| ---------- | ---------- | ---------------------- |
| Mobile     | < 768px    | Single column, stacked |
| Tablet     | 768-1024px | 2 columns              |
| Desktop    | > 1024px   | Full layout            |
| Wide       | > 1440px   | Max-width container    |
