# Linear — UI Knowledge Package

## Executive Summary

Linear is the opinionated productivity system whose visual language defined a decade of dev-tool UI. Built in 2019 by a small designer-engineer-CEO team, Linear's design system was never published as separate docs — it lives inside the product. Its influence appears in every dev tool launched after 2021: the keyboard-first command palette, the inline diff motion, the muted neutral palette with a single tuned accent, and the typographic restraint with one display weight and one monospace.

Linear targets engineers, product teams, and startups who need a fast, keyboard-driven issue tracker and project management tool. The product is dark-mode-first, with micro-tuned Inter weights, keyboard-speed motion, and an indigo glow that every dev tool now chases. The command palette (⌘K) is the universal entry point — it normalizes the pattern for productivity tools after it migrated from code editors.

The core philosophy: **speed is a feature, not a metric.** Keyboard-first means power users win, but the mouse works perfectly. Information density beats whitespace — show more data with less chrome, reveal detail on hover rather than hiding behind clicks. Dark mode as the primary experience creates premium feel and reduces eye strain.

## Layout System

### Grid System

Linear uses a flexible layout system supporting multiple views:

- **List view** — dense rows with inline data
- **Board view** — kanban-style columns
- **Timeline view** — Gantt-style with snapping
- **Split view** — sidebar + detail panel
- **Fullscreen** — focused single-item view

### Spacing Scale

| Token       | Value |
| ----------- | ----- |
| `--space-1` | 4px   |
| `--space-2` | 8px   |
| `--space-3` | 12px  |
| `--space-4` | 16px  |
| `--space-5` | 24px  |
| `--space-6` | 32px  |

Base unit: **4px** — all spacing is multiples of this.

### Sidebar Pattern

Inverted L-shape sidebar — the global navigation anchor. Redesigned to reduce visual noise, maintain visual alignment, and increase hierarchy/density of navigation elements. Tabs, headers, and panels all align to this structure.

## Command Palette

### Trigger

`⌘K` opens the unified command surface — navigation, action invocation, and search.

### Structure

```
┌────────────────────────────────────────────────────────────┐
│ Cmd+K                                                      │
├────────────────────────────────────────────────────────────┤
│ > Search issues, projects, or commands...                  │
│                                                            │
│   Recent                                                   │
│   ├─ FE-123 Fix navigation animation              Cmd+O   │
│   ├─ BE-456 API rate limiting                     Cmd+O   │
│   └─ Create new issue                             C       │
│                                                            │
│   Commands                                                 │
│   ├─ Change status                                S       │
│   ├─ Assign issue                                 A       │
│   └─ Set priority                                 P       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Key Features

- **Scoped contexts:** Issue, project, member — results filtered by context
- **Recent actions:** Surfaced at top for quick re-access
- **Mnemonic shortcuts:** S for Status, P for Priority, A for Assign
- **Fuzzy search:** Across everything — issues, projects, commands, team members
- **Async search:** Results load progressively

### Implementation Principles

- Every action has a keyboard shortcut
- Shortcuts are mnemonic (easy to remember)
- Mouse works perfectly — keyboard is faster
- Help is always one keystroke away

## Keyboard Shortcuts

### Mnemonic System

| Shortcut    | Action           |
| ----------- | ---------------- |
| `S`         | Change status    |
| `P`         | Set priority     |
| `A`         | Assign issue     |
| `C`         | Create new issue |
| `⌘K`        | Command palette  |
| `⌘O`        | Open issue       |
| `⌘⇧O`       | Open in new tab  |
| `⌘C`        | Copy link        |
| `Backspace` | Delete           |

### Keyboard-Only Mode

Linear has a keyboard-only mode that disables the mouse entirely — a training tool for learning keyboard shortcuts. Every shortcut is discoverable through the command palette, shown next to each action.

### Contextual Menus

Right-click menus show exactly what you need, with shortcuts displayed:

```
Right-click on issue:
┌────────────────────────────────┐
│  Open issue            Cmd+O  │
│  Open in new tab   Cmd+Shft+O │
├────────────────────────────────┤
│  Set status                S  │
│  Set priority              P  │
│  Assign                    A  │
├────────────────────────────────┤
│  Copy link             Cmd+C  │
│  Copy ID                      │
├────────────────────────────────┤
│  Delete              Backspace│
└────────────────────────────────┘
```

## Dashboard Design

### Issue View

Inline-editable issue surface with:

- Status pill (color-coded by state)
- Assignee avatar
- Labels (color-coded)
- Priority indicator
- Activity stream (comments, status changes, assignments)

### Triage Inbox

Keyboard-first issue triage with:

- Bulk actions (select multiple, change status)
- Status pivot (quick state transitions)
- Timeline scrubbing
- Sets the bar for queue-style productivity UI

### Roadmap Timeline

Multi-level Gantt with:

- Snapping to grid levels
- Designed for long-range planning
- Drag to reschedule
- Dependency visualization

## Search UX

### Input Design

- Integrated into command palette (⌘K)
- Fuzzy matching with ranked results
- Search across issues, projects, team members, commands

### Results

- Grouped by type (issues, projects, commands)
- Keyboard navigable
- Inline previews of issue status/priority

### Filters

- Scope by team, project, status, assignee, priority
- Saved filters for common views

## Activity Feeds

### Issue Activity

- Chronological stream within each issue
- Status changes with timestamps
- Assignment changes
- Comments with markdown rendering
- System events (label additions, priority changes)

### Global Activity

- Team-wide activity feed
- Filterable by type and date range

## Typography

### Font Stack

```css
--font-body: "Inter Variable", "SF Pro Display", -apple-system, sans-serif;
```

### Type Scale

| Token                 | Size | Line Height | Weight |
| --------------------- | ---- | ----------- | ------ |
| `--text-title-1`      | 56px | 61px        | 600    |
| `--text-title-3`      | 24px | 32px        | 600    |
| `--text-text-regular` | 15px | 24px        | 400    |
| `--text-text-small`   | 13px | 19px        | 400    |
| `--text-micro`        | 12px | 16px        | 400    |

### Key Decisions

- **Inter Display** for headings — adds expression while maintaining readability
- **Regular Inter** for all body text
- Body text at **13px** — dense but readable (information density over whitespace)
- One display weight (600) and one monospace — typographic restraint

## Color System

### Core Palette

| Token                     | Value   | Role                          |
| ------------------------- | ------- | ----------------------------- |
| `--linear-accent`         | #5e6ad2 | Brand accent, primary actions |
| `--linear-text`           | #f7f8f8 | Primary text (dark theme)     |
| `--linear-text-secondary` | #8a8f98 | Secondary text                |
| `--linear-bg`             | #08090a | Default dark canvas           |
| `--linear-surface`        | #1c1c1f | Panels and cards              |
| `--linear-border`         | #26262a | Hairlines                     |
| `--linear-success`        | #4cb782 | Completed states              |
| `--linear-warning`        | #f2994a | At-risk states                |
| `--linear-error`          | #eb5757 | Errors, urgent priority       |

### Theme Generation System

Linear rebuilt its color system using **LCH color space** (perceptually uniform) instead of HSL. The system generates themes from just **three variables**:

1. **Base color** — the foundation
2. **Accent color** — the indigo/violet
3. **Contrast** — how contrasty the theme should be

This supports auto-generating high-contrast themes for accessibility.

### Key Principle

Restraint with a single accent — palette is mostly neutral, with one tuned accent (violet/indigo) used as punctuation. The signature look that became the default for indie SaaS.

## Accessibility

- **LCH color space** ensures perceptually uniform contrast across themes
- **Auto-generated high-contrast themes** via contrast variable
- **Keyboard-only mode** for full keyboard navigation
- **Screen reader support** for all interactive elements
- **WCAG AA compliance** across default themes
- **Focus indicators** on all interactive elements

## Design Tokens

### CSS Variables

```css
:root {
  --linear-accent: #5e6ad2;
  --linear-text: #f7f8f8;
  --linear-text-secondary: #8a8f98;
  --linear-bg: #08090a;
  --linear-surface: #1c1c1f;
  --linear-border: #26262a;
  --linear-success: #4cb782;
  --linear-warning: #f2994a;
  --linear-error: #eb5757;

  --font-body: "Inter Variable", "SF Pro Display", -apple-system, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
  --radius-pill: 9999px;

  --shadow-floating: 0 8px 32px rgba(0, 0, 0, 0.35);

  --motion-fast: 100ms ease-out;
  --motion-default: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Radii

| Name     | Value  |
| -------- | ------ |
| `small`  | 4px    |
| `medium` | 8px    |
| `large`  | 12px   |
| `pill`   | 9999px |

## Component Patterns

### Buttons

- Minimal chrome — text-focused
- Accent color for primary actions
- Ghost buttons for secondary actions
- Consistent 4px radius

### Cards (Issue Cards)

- Dense information display
- Status pill + assignee avatar + priority
- Hover reveals additional actions
- Inline editing capability

### Modals

- Centered with dark scrim
- Floating shadow
- Focus trapped
- Keyboard dismissible

### Tables

- Dense rows with inline data
- Sortable columns
- Status badges with semantic colors
- Row hover for actions

## Animation & Motion

### Timing

```css
--motion-fast: 100ms ease-out;
--motion-default: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Patterns

- **View transitions:** 120–180ms eased motion signaling state change
- **List reorders:** Smooth animation when issues move between columns
- **Modal entrances:** Scale + opacity transition
- **Inline diffs:** Motion as feedback for code changes
- **Optimistic UI:** Update locally first, sync in background

### Key Principle

Motion as feedback — signals state change without delaying the user. Other tools imitate the look; few match the timing.

## Dark Mode

### Implementation

Dark-mode-first design — the primary experience, not an afterthought:

- Canvas: #08090a (near-black)
- Surface: #1c1c1f (elevated panels)
- Border: #26262a (subtle hairlines)
- Text: #f7f8f8 (near-white)

### Custom Theme Generator

Users can create custom themes with:

- Base color picker
- Accent color picker
- Contrast slider
- Real-time preview

### Key Decisions

- Dark mode creates premium feel
- Reduces eye strain for long coding sessions
- LCH color space ensures consistent perception across themes

## Mobile Responsive

### Breakpoints

- Responsive sidebar collapses on mobile
- Touch-friendly tap targets (44x44px minimum)
- Simplified layout for small screens

### Mobile Patterns

- Swipe actions for issue management
- Bottom navigation bar
- Pull-to-refresh for lists
- Hamburger menu for navigation

## Navigation Patterns

### Sidebar

- Fixed left sidebar with sections
- Team > Project > View hierarchy
- Collapsible sections
- Active state indicator

### Tabs

- Horizontal tabs for views within a project
- Issue, Board, Timeline, List views
- Active tab with subtle indicator

### Breadcrumbs

- Team > Project > Issue hierarchy
- Clickable at each level

## Form Patterns

### Input Design

- Minimal, clean inputs
- Focus ring in accent color
- Inline validation
- Helper text for context

### Validation

- Real-time validation on blur
- Error messages below inputs
- Success states with green indicators

### Multi-Step

- Modal-based wizards for complex forms
- Progress indicator
- Back/Next navigation

## Data Display

### Issue Lists

- Dense rows with status, assignee, priority, labels
- Sortable by any column
- Filterable by multiple criteria
- Keyboard navigable

### Board View

- Kanban columns with drag-and-drop
- Card count per column
- Column headers with quick actions

### Timeline

- Gantt-style bars
- Drag to reschedule
- Dependency lines
- Zoom levels

## Error Handling

### Error Pages

- Clean, minimal error states
- Retry buttons for transient failures
- Error IDs for support

### Optimistic Updates

- UI updates immediately on user action
- Background sync with server
- Rollback on failure with toast notification

## Loading States

### Skeleton Loaders

- Content-shaped placeholders
- Subtle shimmer animation
- Matches final layout

### Progress Indicators

- Determinate bars for known-duration operations
- Indeterminate spinners for unknown
- Status text updates

## Reusable Ideas

1. **Mnemonic keyboard shortcuts** — S for Status, P for Priority — teachable through the command palette
2. **LCH color space** — perceptually uniform theming with just 3 variables
3. **Optimistic UI** — update locally, sync in background — makes the app feel instant
4. **Information density** — 13px body text, show more data with less chrome
5. **Motion timing** — 120-180ms for state changes, fast enough to not delay, slow enough to register
6. **Command palette as training tool** — show shortcuts next to actions for progressive learning
7. **Dark-mode-first** — design dark, then derive light — ensures premium feel
8. **Single accent restraint** — one tuned violet, everything else neutral — creates focus

## Evidence

- **Source:** https://linear.app/now/how-we-redesigned-the-linear-ui
- **Date collected:** 2026-08-03
- **Why it matters:** Linear defined the keyboard-first, dark-mode-first dev-tool aesthetic that every product now chases.
- **Trade-offs:** Pros: Best-in-class keyboard UX, fast perceived performance, cohesive design language. Cons: Very opinionated (may feel restrictive), dark-only default may alienate some users, dense UI has learning curve.
- **Expected value:** Mnemonic shortcuts, LCH theming, optimistic UI, and motion timing patterns directly transfer to GitHub OS.
- **Maintenance burden:** Medium — custom theme system requires LCH color space understanding, but token-based architecture simplifies updates.
- **Hardware impact:** Low — minimal JS runtime, CSS-based animations, optimized for low-end devices.
