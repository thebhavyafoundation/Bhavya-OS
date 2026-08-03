# GitHub — UI Knowledge Package

## Executive Summary

GitHub's Primer is the design system for the world's largest developer platform — over 100 million developers. Primer delivers colors as design tokens (CSS variables for code, Figma variables for design) that support multiple color modes and themes. The system has two main modes (light and dark) with nine themes total, including high-contrast, colorblind, and dimmed variants. Every pattern in Primer is built to work across all color modes out of the box.

GitHub targets every developer on the planet — from individual open-source contributors to enterprise teams. The UI serves code hosting, pull requests, issues, actions, packages, and more. The design system must handle extreme complexity (thousands of unique page types) while maintaining consistency and accessibility.

The core philosophy: **inclusive by design.** Primer's color system was rebuilt to resolve hundreds of accessibility issues across more than a thousand use cases. The team automated color contrast checking with scripts that run on every pull request, catching violations before they reach production. The result is a design system that works for everyone, including users with color vision deficiencies.

## Layout System

### Grid System

GitHub uses a responsive 12-column grid:

- **Max content width:** ~1280px
- **Gutters:** 16px (compact) to 24px (comfortable)
- **Margins:** Responsive, collapsing on mobile

### Spacing Scale

| Token            | Value |
| ---------------- | ----- |
| `--base-size-4`  | 4px   |
| `--base-size-8`  | 8px   |
| `--base-size-12` | 12px  |
| `--base-size-16` | 16px  |
| `--base-size-24` | 24px  |
| `--base-size-32` | 32px  |
| `--base-size-40` | 40px  |
| `--base-size-48` | 48px  |
| `--base-size-64` | 64px  |

### Sidebar Pattern

- Fixed left sidebar for navigation
- Collapsible on smaller screens
- Sections: Home, Issues, Pull Requests, Actions, Projects, etc.
- Active state with left border indicator

## Command Palette

### Command Menu

`⌘K` opens the Command Menu:

- Search across repositories, issues, pull requests, organizations
- Quick actions (new repository, new issue, etc.)
- Navigate to any page
- Recent items surfaced first

### Search

- Global search bar at top of every page
- Repository-scoped search
- Advanced search with qualifiers
- Code search with regex support

## Keyboard Shortcuts

### Global

| Shortcut | Action                        |
| -------- | ----------------------------- |
| `⌘K`     | Command Menu                  |
| `⌘/`     | Focus search bar              |
| `.`      | Open file finder (repository) |
| `⌘⇧P`    | Command palette (repo)        |
| `⌘⇧F`    | Search in file                |
| `⌘⇧G`    | Go to file                    |

### Navigation

| Shortcut     | Action              |
| ------------ | ------------------- |
| `G` then `N` | Go to Notifications |
| `G` then `C` | Go to Code          |
| `G` then `I` | Go to Issues        |
| `G` then `P` | Go to Pull Requests |
| `G` then `A` | Go to Actions       |

### Issue/PR

| Shortcut | Action           |
| -------- | ---------------- |
| `C`      | Comment          |
| `E`      | Edit             |
| `L`      | Toggle label     |
| `M`      | Toggle milestone |
| `A`      | Assign           |

### Discoverability

- Shortcut overlay available (? key)
- Shortcuts shown in tooltips
- Progressive disclosure

## Dashboard Design

### Repository Dashboard

- File tree with folder expand/collapse
- README rendering
- Recent commits
- Contributors
- Languages

### Issue Dashboard

- List/board/timeline views
- Filters and labels
- Assignees and milestones
- Real-time updates

### Pull Request Dashboard

- Diff view with inline comments
- Checks and status
- Review requests
- Merge controls

### Cards

- White/dark surface
- Subtle border
- Hover elevation change
- Consistent padding

## Search UX

### Global Search

- Prominent search bar at top
- Repository-scoped or global
- Advanced qualifiers (is:issue, is:pr, language:, etc.)
- Code search with regex

### Results

- Grouped by type (repos, issues, code, users)
- Relevance ranking
- Filters on left sidebar
- Pagination

### Code Search

- File path matching
- Content matching
- Language filtering
- Repository filtering

## Activity Feeds

### Notification Center

- Threaded notifications
- Repository grouping
- Mark as read/unread
- Filter by type

### Timeline

- Chronological activity on issues/PRs
- System events (labels, assignments, merges)
- User actions (comments, reviews)
- Cross-references

### Real-Time

- Live updates for notifications
- Real-time collaboration on issues
- Status updates for actions

## Typography

### Font Stack

```css
--fontStack-monospace:
  ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono,
  monospace;
--fontStack-sansSerif:
  "Mona Sans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
  Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

### Type Scale

| Token               | Size             | Line Height | Weight |
| ------------------- | ---------------- | ----------- | ------ |
| `--text-display`    | 2.5rem (40px)    | 1.375       | 500    |
| `--text-title`      | 1.25rem (20px)   | 1.25        | 600    |
| `--text-subtitle`   | 1rem (16px)      | 1.5         | 400    |
| `--text-body`       | 1rem (16px)      | 1.5         | 400    |
| `--text-caption`    | 0.75rem (12px)   | 1.333       | 400    |
| `--text-codeBlock`  | 0.8125rem (13px) | 1.5         | 400    |
| `--text-codeInline` | 0.9285em         | -           | 400    |

### Key Decisions

- **Mona Sans VF** — variable font for all UI text
- **Monospace** for code — clear distinction between code and prose
- **Display at weight 500** — medium, not bold
- **Body at 16px / 1.5** — generous for readability
- **rem units** — accessible browser zoom

## Color System

### Architecture

Three-layer token system:

1. **Base tokens** — raw color values (never used directly)
2. **Functional tokens** — semantic meanings (bg, text, border)
3. **Component tokens** — element-specific

### Light Theme

| Token                   | Value   | Role               |
| ----------------------- | ------- | ------------------ |
| `--bgColor-default`     | #ffffff | Page background    |
| `--bgColor-muted`       | #f6f8fa | Muted background   |
| `--fgColor-default`     | #1f2328 | Primary text       |
| `--fgColor-muted`       | #636c76 | Secondary text     |
| `--fgColor-subtle`      | #6e7781 | Tertiary text      |
| `--borderColor-default` | #d0d7de | Default border     |
| `--borderColor-muted`   | #d8dee4 | Muted border       |
| `--accent-fg`           | #0969da | Links, interactive |
| `--accent-emphasis`     | #0969da | Primary actions    |

### Dark Theme

| Token                   | Value   | Role               |
| ----------------------- | ------- | ------------------ |
| `--bgColor-default`     | #0d1117 | Page background    |
| `--bgColor-muted`       | #161b22 | Muted background   |
| `--fgColor-default`     | #e6edf3 | Primary text       |
| `--fgColor-muted`       | #8b949e | Secondary text     |
| `--borderColor-default` | #30363d | Default border     |
| `--accent-fg`           | #58a6ff | Links, interactive |
| `--accent-emphasis`     | #1f6feb | Primary actions    |

### Semantic Colors

| Role        | Light   | Dark    | Usage                |
| ----------- | ------- | ------- | -------------------- |
| `success`   | #1a7f37 | #3fb950 | Merged, completed    |
| `attention` | #9a6700 | #d29922 | Pending, in progress |
| `danger`    | #d1242f | #f85149 | Errors, deleted      |
| `open`      | #1a7f37 | #3fb950 | Open issues/PRs      |
| `closed`    | #d1242f | #f85149 | Closed issues/PRs    |
| `done`      | #8250df | #a371f7 | Completed tasks      |
| `sponsors`  | #bf3989 | #f778ba | GitHub Sponsors      |

### Nine Themes

1. Light (default)
2. Light High Contrast
3. Light Colorblind
4. Light Tritanopia
5. Dark (default)
6. Dark Dimmed
7. Dark High Contrast
8. Dark Colorblind
9. Dark Tritanopia

### Key Principle

Neutral scales are inverted between light and dark — steps 0-6 for backgrounds, 7-8 for borders, 9-10 for text. This allows many functional tokens to be shared across themes without overrides.

## Accessibility

### WCAG Compliance

- **Required:** WCAG AA-level (SC A and AA observed)
- **Target:** 7:1 contrast for high-contrast themes
- **Automated:** Color contrast checks run on every PR

### Color Contrast Strategy

- Automated script checks all color pairs across all themes
- Blend algorithm handles opacity-based colors
- GitHub Action runs on every Primer PR
- Hundreds of accessibility issues resolved across 1000+ use cases

### Keyboard Navigation

- Full keyboard navigation across all pages
- Skip links for main content
- Focus indicators on interactive elements
- Logical tab order

### Screen Reader Support

- Semantic HTML throughout
- ARIA labels on all interactive elements
- Live regions for dynamic content
- Announcements for state changes

### Forced Colors Mode

- Supports Windows forced colors mode
- Does not override forced color keywords
- Ensures maximum legibility

## Design Tokens

### Token Architecture

```css
/* Base tokens (never use directly) */
--base-color-gray-0: #ffffff;
--base-color-gray-13: #000000;

/* Functional tokens (use these) */
--bgColor-default: var(--base-color-gray-0);
--fgColor-default: var(--base-color-gray-9);

/* Component tokens (element-specific) */
--button-bg: var(--accent-emphasis);
```

### Spacing Tokens

```css
--base-size-4: 4px;
--base-size-8: 8px;
--base-size-12: 12px;
--base-size-16: 16px;
--base-size-24: 24px;
--base-size-32: 32px;
--base-size-40: 40px;
--base-size-48: 48px;
--base-size-64: 64px;
```

### Motion Tokens

```css
--base-duration-fast: 100ms;
--base-duration-normal: 200ms;
--base-duration-slow: 400ms;
--base-easing-default: cubic-bezier(0.33, 1, 0.68, 1);
```

## Component Patterns

### Buttons

- **Primary:** Accent background, white text
- **Default:** Border + background
- **Danger:** Red for destructive actions
- **Outline:** Border only
- Consistent 6px radius

### Cards

- White/dark surface
- Subtle border
- Hover elevation
- Consistent padding (16px)

### Modals (Dialogs)

- Centered with dark scrim
- Focus trapped
- `Esc` to close
- Title + description + actions

### Tables

- Sortable columns
- Sticky headers
- Zebra striping
- Responsive (horizontal scroll on mobile)

### Labels/Badges

- Semantic colors (open, closed, merged, etc.)
- Consistent sizing
- Pill shape (9999px radius)

## Animation & Motion

### Timing

```css
--base-duration-fast: 100ms;
--base-duration-normal: 200ms;
--base-duration-slow: 400ms;
```

### Patterns

- **Page transitions:** Subtle fade
- **Dropdown menus:** Scale + opacity
- **Toasts:** Slide in from top
- **Loading:** Skeleton shimmer
- **Hover:** Background color change

### Key Principle

Motion is functional — signals state changes without decoration. Respects `prefers-reduced-motion`.

## Dark Mode

### Implementation

- Class-based toggle on `<html>` element
- System preference detection
- User preference persistence
- Nine theme variants

### Color Adaptation

- Neutral scales inverted
- Accent colors adjusted for dark backgrounds
- Semantic colors remain consistent
- High-contrast variants available

### Key Decisions

- Dark mode is a first-class citizen, not an afterthought
- Same design tokens work across all themes
- No separate dark mode components

## Mobile Responsive

### Breakpoints

```css
--breakpoint-sm: 544px;
--breakpoint-md: 768px;
--breakpoint-lg: 1012px;
--breakpoint-xl: 1280px;
```

### Mobile Patterns

- Collapsible sidebar → hamburger
- Bottom navigation bar
- Touch targets ≥ 44x44px
- Simplified layouts
- Swipe gestures

## Navigation Patterns

### Top Navigation

- Global search bar
- User avatar + dropdown
- Notification bell
- Repository selector

### Sidebar

- Fixed left navigation
- Collapsible sections
- Active state indicator
- Keyboard navigable

### Breadcrumbs

- Repository > Branch > Path
- Clickable at each level
- Truncated with ellipsis

### Tabs

- Code, Issues, Pull Requests, Actions, Projects, etc.
- Active tab with bottom indicator
- Badge counts for unread items

## Form Patterns

### Input Design

- Clean, minimal inputs
- 1px border
- Focus ring in accent color
- Labels above inputs

### Validation

- Inline validation on blur
- Error messages below inputs
- Success states with green
- Icon indicators

### Multi-Step

- Wizard-style for complex workflows
- Progress indicator
- Back/Next navigation

## Data Display

### Tables

- Sortable columns
- Sticky headers
- Row hover
- Bulk actions
- Pagination

### Lists

- Dense rows with actions
- Inline editing
- Drag-and-drop reordering
- Keyboard navigable

### Charts

- Contribution graphs
- Traffic analytics
- Action run timelines
- Clean, minimal design

### Empty States

- Illustration + message + CTA
- Context-specific guidance
- Links to getting started

## Error Handling

### Error Pages

- 404: Search + navigation
- 500: Error ID + retry
- 403: Permission guidance
- Rate limit: Wait time + retry

### Toast Notifications

- Slide in from top
- Auto-dismiss after timeout
- Manual dismiss
- Action buttons inline

### Retry Patterns

- Automatic retry for transient failures
- Manual retry buttons
- Exponential backoff

## Loading States

### Skeleton Loaders

- Content-shaped placeholders
- Shimmer animation
- Matches final layout
- Progressive loading

### Progress Indicators

- Determinate bars for known durations
- Indeterminate spinners for unknown
- Status text updates

### Optimistic Updates

- Immediate UI feedback
- Background sync
- Rollback on failure

## Reusable Ideas

1. **Three-layer token system** — base → functional → component tokens for maximum flexibility
2. **Automated accessibility checking** — GitHub Actions running contrast checks on every PR
3. **Nine theme variants** — light, dark, high-contrast, colorblind, dimmed
4. **Inverted neutral scales** — shared functional tokens across light/dark
5. **Semantic color roles** — open, closed, merged, done — consistent across themes
6. **Rem-based typography** — accessible browser zoom
7. **Skip links** — keyboard accessibility from the start
8. **Forced colors mode support** — works with Windows high contrast

## Evidence

- **Source:** https://primer.style/foundations/color
- **Date collected:** 2026-08-03
- **Why it matters:** Primer is the most battle-tested developer design system — serving 100M+ developers across nine themes with automated accessibility.
- **Trade-offs:** Pros: Extremely robust token system, automated accessibility, nine themes, massive component library. Cons: Very large/complex system, can feel heavy for small projects, many tokens to learn.
- **Expected value:** Token architecture, automated accessibility, and semantic color roles directly transfer to GitHub OS.
- **Maintenance burden:** Medium-High — large token surface, multiple themes, but automated tooling helps.
- **Hardware impact:** Low — CSS variables, no heavy JS runtime, optimized for scale.
