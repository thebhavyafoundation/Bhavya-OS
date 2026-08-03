# Vercel — UI Knowledge Package

## Executive Summary

Vercel's UI is built on the **Geist** design system — a developer-first, performance-obsessed visual language that treats speed as a feature, not a metric. The system is defined by extreme restraint: a near-black #171717 primary ink, a single mesh gradient for hero moments, and the Geist Sans / Geist Mono typeface pair released open-source and now adopted across the dev-tool ecosystem. Every surface is optimized for perceived performance — minimal animations, lazy-loaded content, above-the-fold prioritization.

Vercel targets developers, engineering teams, and companies deploying web applications. The dashboard serves as the control plane for projects, deployments, analytics, and team management. The command palette (⌘K) is the central navigation hub, letting users jump between projects, deployments, documentation, and actions without touching the mouse. The entire product feels like a terminal-native tool wrapped in a browser — fast, focused, and developer-native.

The design system philosophy is "restraint is the product": no second accent color, no display weight above 600, no gradient miniaturization. This discipline creates a UI that feels premium without trying to be flashy, and it's the reason Vercel's visual language has become the default for modern developer tools.

## Layout System

### Grid System

Vercel's grid operates on a **4px base unit** (gap unit). The responsive grid component supports `columns` and `rows` props at three breakpoints: `sm`, `md`, `lg`. For marketing pages, the grid includes visible guide lines as a design element; for product surfaces, plain Tailwind grid utilities are preferred.

- **Columns:** Responsive — `sm: 1, md: 2, lg: 3` for typical card layouts
- **Max content width:** ~1200px centered
- **Gutters:** 24px default
- **Guide lines:** Decorative, marked `aria-hidden="true"`

### Spacing Scale

| Token       | Value |
| ----------- | ----- |
| `--space-1` | 4px   |
| `--space-2` | 8px   |
| `--space-3` | 12px  |
| `--space-4` | 16px  |
| `--space-5` | 24px  |
| `--space-6` | 32px  |
| `--space-7` | 48px  |
| `--space-8` | 64px  |

### Sidebar Pattern

Zero-fluff left sidebar: Projects, Analytics, Settings. Always accessible, never trying to be clever. Contextual actions surface based on current view (project → logs, deploy preview, settings).

## Command Palette

### Trigger

`⌘K` (macOS) / `Ctrl+K` (Windows/Linux) opens the Command Menu globally.

### Search & Actions

- Fuzzy search across projects, deployments, documentation, team members
- Navigate to a specific Project or Deployments within that Project
- Search documentation inline
- Invite team members to current Vercel Team
- Create new Projects from Git repos or Templates
- Scoped contexts: project-level vs. account-level

### Deployment Integration

`⌘K` also available on any deployment with Vercel Toolbar enabled (production and localhost). `Cmd+Shift+K` disambiguates when the deployed site has its own ⌘K menu.

### Keyboard Shortcuts

| Shortcut | Action                                 |
| -------- | -------------------------------------- |
| `⌘K`     | Open Command Menu                      |
| `⌘⇧K`    | Open Command Menu (deployment context) |
| `⌘↵`     | Submit / confirm                       |

## Keyboard Shortcuts

Vercel's shortcut system is designed for discoverability through the command palette. Every action is accessible via keyboard, but the palette teaches shortcuts by showing them next to actions.

- **Global:** `⌘K` (command palette), `⌘/` (search)
- **Navigation:** Left sidebar items accessible via keyboard focus
- **Deployment:** `⌘⇧K` for toolbar-specific commands
- **Pattern:** Shortcuts are revealed progressively — users discover them through the command palette, not through a static shortcut reference

## Dashboard Design

### Card System

Cards use **stacked shadows** — an inset 1px hairline ring (`0 0 0 1px #00000014` inset) combined with 2–3 stacked offsets at 4–12% black opacity. This creates a card that sits on the page without feeling material-heavy.

### Elevation Levels

1. **Flat** — no shadow
2. **Inset hairline** — 1px ring only
3. **Subtle drop** — single offset
4. **Soft stack** — multiple offsets
5. **Float stack** — elevated elements
6. **Modal** — maximum elevation with scrim

### Real-Time Updates

- Deployment status updates in real-time
- Log streaming with monospace font and timestamp grouping
- Visual indicators for build/deploy progress
- Lazy-loaded logs for performance

## Search UX

### Input Design

- Minimal, inline search within the command palette
- No standalone search page — search is contextual
- Fuzzy matching with instant results

### Results

- Grouped by category (projects, deployments, docs, team)
- Keyboard navigable with `↑`/`↓`
- `↵` to select, `⌘↵` for secondary action

### Filters

- Scope by project, team, or documentation
- Recent items surfaced first

## Activity Feeds

### Deployment Timeline

- Chronological list of deployments per project
- Status badges (ready, building, error, queued)
- Commit messages and branch names inline
- Timestamp with relative time ("2 hours ago")

### Filtering

- Filter by branch, status, or environment (production/preview)
- Search within deployment history

## Typography

### Font Stack

```css
--font-body: "Geist", -apple-system, "Segoe UI", sans-serif;
--font-mono: "Geist Mono", ui-monospace, Menlo, monospace;
```

### Type Scale

| Token               | Size | Line Height | Weight |
| ------------------- | ---- | ----------- | ------ |
| `--text-heading-72` | 72px | 72px        | 600    |
| `--text-heading-40` | 40px | 48px        | 600    |
| `--text-heading-24` | 24px | 32px        | 600    |
| `--text-copy-16`    | 16px | 24px        | 400    |
| `--text-copy-14`    | 14px | 20px        | 400    |
| `--text-label-12`   | 12px | 16px        | 400    |

### Key Decisions

- Display caps at weight **600** — aggressive negative tracking (-2.4px at 48px) carries voice instead of heavier weights
- Monospace (Geist Mono) for terminal mockups, code blocks, technical eyebrows
- No weight above 600 anywhere in the system

## Color System

### Core Palette

| Token                | Value   | Role                               |
| -------------------- | ------- | ---------------------------------- |
| `--geist-foreground` | #000000 | Primary text, primary buttons      |
| `--geist-background` | #ffffff | Page background                    |
| `--accents-5`        | #666666 | Secondary text                     |
| `--accents-2`        | #eaeaea | Borders, dividers                  |
| `--accents-1`        | #fafafa | Subtle background                  |
| `--geist-success`    | #0070f3 | Links, informational (Vercel blue) |
| `--geist-error`      | #ee0000 | Errors                             |
| `--geist-warning`    | #f5a623 | Warnings                           |
| `--geist-violet`     | #7928ca | Marketing gradient accent          |

### Brand Gradient (Hero Scale Only)

Three-pair gradient stack used ONLY at hero scale:

- **Develop:** #007cf0 → #00dfd8
- **Preview:** #7928ca → #ff0080
- **Ship:** #ff4d4d → #f9cb28

Never cropped to a single hue, never miniaturized to an icon, never reordered.

### Key Principle

Single ink primary (#171717) carries every CTA. No brand-blue accent. The ink IS the brand.

## Accessibility

- **WCAG AA compliance** across all surfaces
- Grid guide lines marked `aria-hidden="true"`
- Focus rings on interactive elements
- High contrast dark mode designed first, not as afterthought
- Keyboard navigation through all dashboard elements
- Screen reader support for deployment status updates

## Design Tokens

### Token Architecture

Three-layer system:

1. **Primitive tokens** — raw color values
2. **Functional tokens** — semantic meanings (bg, text, border)
3. **Component tokens** — element-specific (button-bg, card-border)

### Radii

| Name      | Value  |
| --------- | ------ |
| `small`   | 6px    |
| `default` | 8px    |
| `large`   | 12px   |
| `pill`    | 9999px |

### Motion

```css
--motion-default: 150ms ease;
```

Minimal animations — fast, snappy transitions. No decorative motion.

## Component Patterns

### Buttons

- **Primary:** #171717 background, white text, 100px pill radius (marketing) or 6px radius (in-app)
- **Secondary:** Transparent background, ink text
- Two pill scales: 100px marketing CTAs vs. 6px nav buttons — never mixed on one screen

### Cards

- Stacked shadows (multiple 4-12% opacity offsets)
- Inset hairline ring
- 8px default radius
- Hover: slight elevation increase

### Modals

- Centered on screen with dark scrim
- Maximum elevation shadow
- Focus trapped inside modal
- `Esc` to close

### Tables

- Monospace headers for data tables
- Zebra striping with subtle background alternation
- Sortable column headers

## Animation & Motion

### Timing

- **Default:** 150ms ease
- **Fast:** 100ms ease-out
- All transitions purposeful — state changes, not decoration

### Patterns

- Deployment status transitions
- Log streaming (real-time append)
- Command palette open/close (scale + opacity)
- Sidebar collapse/expand

### Loading States

- Skeleton loaders with shimmer
- Progress bars for deployments
- Spinner for async operations

## Dark Mode

### Implementation

Dark mode is designed first, not inverted from light:

- High contrast for readability during long coding sessions
- Background: #000000 or near-black
- Text: white / near-white
- Same stacked shadow system, adjusted opacity for dark surfaces

### Key Decisions

- Dark mode feels tailored, not like an inverted light theme
- Visual comfort over long coding sessions
- Same Geist typeface, same weight hierarchy

## Mobile Responsive

### Breakpoints

- **sm:** Mobile (< 640px)
- **md:** Tablet (640-1024px)
- **lg:** Desktop (> 1024px)

### Mobile Patterns

- Sidebar collapses to hamburger
- Command palette adapts to full-width
- Cards stack vertically
- Touch targets minimum 44x44px

## Navigation Patterns

### Sidebar

- Fixed left sidebar with icon + label
- Collapsible on smaller screens
- Active state indicated by background highlight
- Sections: Projects, Analytics, Settings

### Breadcrumbs

- Project > Environment > Deployment hierarchy
- Clickable at each level

### Tabs

- Horizontal tabs for project sections (Deployments, Analytics, Logs, Settings)
- Active tab with bottom border indicator

## Form Patterns

### Input Design

- Clean, minimal inputs with subtle borders
- Focus state: blue ring (#0070f3)
- Labels above inputs
- Helper text below for context

### Validation

- Inline validation on blur
- Error messages below inputs in red
- Success states with green indicators

### Multi-Step

- Wizard-style for project creation
- Progress indicator at top
- Back/Next navigation

## Data Display

### Tables

- Sortable columns
- Monospace for technical data
- Status badges with semantic colors
- Pagination at bottom

### Charts

- Analytics charts with clean, minimal design
- Tooltip on hover
- Time range selector

### Empty States

- Illustration + message + CTA
- "No deployments yet" → "Create your first project"

## Error Handling

### Error Pages

- 404: Clean page with search and navigation back
- 500: Error ID for support, retry button
- Build failures: Log viewer with error highlighting

### Retry Patterns

- Automatic retry for transient failures
- Manual retry button for build failures
- Exponential backoff for API calls

## Loading States

### Skeleton Loaders

- Content-shaped placeholders
- Subtle shimmer animation
- Matches final content layout

### Progress Indicators

- Determinate progress bars for deployments
- Indeterminate spinners for async operations
- Status text updates ("Building...", "Deploying...")

## Reusable Ideas

1. **Stacked shadow system** — Multiple low-opacity shadows create depth without heaviness
2. **Command palette as primary navigation** — ⌘K as the universal entry point
3. **Restrained color system** — Single ink primary, no competing accents
4. **Geist typeface pair** — Sans + Mono designed for developer tools
5. **Performance-first design** — Lazy loading, minimal animation, above-the-fold priority
6. **Two pill scales** — Marketing (100px) vs. in-app (6px) — context-appropriate shapes
7. **Dark mode as first-class** — Designed dark-first, not inverted from light

## Evidence

- **Source:** https://vercel.com/geist/introduction
- **Date collected:** 2026-08-03
- **Why it matters:** Vercel's Geist system defines the modern developer-tool aesthetic — restrained, fast, keyboard-first.
- **Trade-offs:** Pros: Extremely fast perceived performance, cohesive type system, strong dark mode. Cons: Very opinionated (ink-only primary may feel bland for non-dev products), limited color palette for marketing.
- **Expected value:** Stacked shadows, command palette patterns, and the restrained color philosophy directly transfer to GitHub OS dashboards.
- **Maintenance burden:** Low — token-based system with CSS variables, components published as npm package.
- **Hardware impact:** Minimal — lightweight CSS, no heavy JS runtime, optimized for low-end devices.
