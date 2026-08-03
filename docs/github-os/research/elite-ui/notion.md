# Notion — UI Knowledge Package

## Executive Summary

Notion's design system reads as a workspace, not a marketing site. The dominant impression is warm, paper-calm: an off-white canvas under near-black Inter type, structured by a single confident blue. The system operates on a functional, dual-mode aesthetic — a dark, immersive hero section with deep navy background transitions into a bright, exceptionally clean primary interface. The entire user experience is unified by the NotionInter font, used for everything from 54px display headings to 14px captions.

Notion targets knowledge workers, teams, and individuals who need an all-in-one workspace for notes, documents, databases, and project management. The product is block-based — every piece of content is a block with consistent padding, border behavior, and hover states. The visual rhythm is vertical: content flows down, blocks stack, spacing stays regular. This creates a document feel that most web apps never achieve.

The design philosophy: warm neutrals, generous spacing, and type that doesn't demand attention. Notion's type system is designed to lose the visual competition against user content — on purpose. The user's content hierarchy takes priority over the UI's own hierarchy.

## Layout System

### Grid System

- **Max content width:** 900px (inferred from content areas)
- **Base unit:** 4px — all padding, margins, and layout gaps use multiples
- **Columns:** 12-column grid for marketing, single-column for document content
- **Content margins:** 96px horizontal padding creates a centered column echoing a printed page

### Spacing Scale

| Token           | Value | Context                             |
| --------------- | ----- | ----------------------------------- |
| `--spacing-xxs` | 4px   | Micro-spacing, icon-to-text gaps    |
| `--spacing-xs`  | 8px   | Inner padding for small components  |
| `--spacing-sm`  | 12px  | Inner padding for larger components |
| `--spacing-md`  | 16px  | Gaps between elements               |
| `--spacing-lg`  | 24px  | Card gaps in grid                   |
| `--spacing-xl`  | 32px  | Section gaps                        |
| `--spacing-xxl` | 56px  | Large section spacing               |

### Sidebar Pattern

- Warm gray background (#F7F6F3)
- Hierarchical tree navigation
- Page icons and toggles
- Collapsible sections
- Search at top

## Command Palette

### Quick Find

Notion's command palette (⌘K / Ctrl+K) provides:

- Search across all pages, databases, and content
- Quick actions (new page, new database, toggle theme)
- Navigate to recent pages
- Filter by page type (page, database, template)

### Search Integration

- Inline search within the command palette
- Results grouped by type (pages, databases, people)
- Keyboard navigable with arrow keys
- `↵` to open, `⌘↵` to open in new tab

## Keyboard Shortcuts

### System

| Shortcut               | Action                       |
| ---------------------- | ---------------------------- |
| `⌘K` / `Ctrl+K`        | Quick Find / Command palette |
| `⌘N` / `Ctrl+N`        | New page                     |
| `⌘P` / `Ctrl+P`        | Quick Find                   |
| `⌘[` / `Ctrl+[`        | Navigate back                |
| `⌘]` / `Ctrl+]`        | Navigate forward             |
| `⌘⇧L` / `Ctrl+Shift+L` | Toggle dark mode             |

### Block Operations

| Shortcut    | Action           |
| ----------- | ---------------- |
| `⌘Enter`    | Open as page     |
| `⌘⇧H`       | Add to favorites |
| `ESC`       | Exit edit mode   |
| `Enter`     | Split block      |
| `Backspace` | Merge blocks     |

### Text Formatting

| Shortcut | Action        |
| -------- | ------------- |
| `⌘B`     | Bold          |
| `⌘I`     | Italic        |
| `⌘U`     | Underline     |
| `⌘E`     | Code          |
| `⌘⇧S`    | Strikethrough |

### Discoverability

- Shortcuts shown in tooltips on hover
- Keyboard shortcut overlay available (⌘/)
- Progressive disclosure — basic shortcuts first, advanced later

## Dashboard Design

### Page Layout

- Single-column document flow
- Wide content margins (96px) for readability
- Block-based content with consistent spacing
- Toggle blocks for collapsible content

### Database Views

- Table view with sortable columns
- Board view (kanban)
- Timeline view (Gantt)
- Gallery view (cards)
- List view (compact)
- Calendar view

### Cards

- White surface (#ffffff)
- 12px border radius
- Multi-layered soft shadows (`rgba(25, 25, 25, 0.027)...`)
- Hover: larger shadow + `translateY(-2px)` transform

## Search UX

### Quick Find (⌘K)

- Full-text search across all content
- Results with page icons and breadcrumbs
- Filter by type (pages, databases, people)
- Recent pages surfaced first

### Search Results

- Page title + icon
- Breadcrumb path
- Content preview snippet
- Last edited timestamp

### Filters

- Filter by page type
- Filter by workspace
- Filter by creator
- Filter by date range

## Activity Feeds

### Page Activity

- Page history with timestamps
- Collaborative editing indicators
- Comment threads
- Mention notifications

### Workspace Activity

- Recent pages across workspace
- Team member activity
- Database changes

## Typography

### Font Stack

```css
font-family:
  "NotionInter",
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Helvetica,
  Arial,
  sans-serif;
```

### Type Scale

| Role    | Size             | Weight | Line Height | Letter Spacing |
| ------- | ---------------- | ------ | ----------- | -------------- |
| Display | 54px             | 600    | 1.2         | -0.02em        |
| H1      | 40px             | 600    | 1.2         | -0.02em        |
| H2      | 24px             | 500    | 1.3         | -0.01em        |
| H3      | 20px             | 500    | 1.4         | -0.01em        |
| Body    | 16px             | 400    | 1.5         | Normal         |
| Caption | 14px             | 400    | 1.5         | Normal         |
| Quote   | 22px (Lyon Text) | 400    | 1.25        | Normal         |
| Code    | 14px (Nitti)     | 400    | 1.5         | Normal         |

### Key Decisions

- **Single-Family Dominance:** NotionInter for all UI text — cohesive and branded
- **Clear Weight Hierarchy:** 600 for headings, 500 for subheadings, 400 for body
- **Readability First:** 1.5 line height for body text — generous by SaaS standards
- **Serif for Marketing:** Lyon Text serif on marketing pages positions Notion alongside editorial tools
- **Body at 16px** — larger than typical SaaS (14px), optimizing for reading/writing over density

## Color System

### Core Palette

| Token                | Value                  | Role                                            |
| -------------------- | ---------------------- | ----------------------------------------------- |
| `--text-primary`     | #37352F                | Primary text (warm brown-black, not pure black) |
| `--text-secondary`   | #787774                | Secondary text                                  |
| `--text-tertiary`    | #9B9A97                | Tertiary text                                   |
| `--text-placeholder` | #C3C2BF                | Placeholders                                    |
| `--background`       | #FFFFFF                | Page background                                 |
| `--surface`          | #F7F6F3                | Warm hover, sidebar                             |
| `--surface-active`   | #EFEDE8                | Active states                                   |
| `--border`           | rgba(55, 53, 47, 0.09) | Subtle borders                                  |
| `--border-strong`    | rgba(55, 53, 47, 0.16) | Stronger borders                                |
| `--accent`           | #2383E2                | Links, selected states, primary buttons         |
| `--accent-hover`     | #1B6EC2                | Accent hover                                    |

### Pastel Card Tints

| Color  | Hex     | Usage         |
| ------ | ------- | ------------- |
| Peach  | #fff5ed | Feature tiles |
| Rose   | #fef3f1 | Feature tiles |
| Lilac  | #f8f5fc | Feature tiles |
| Mint   | #d9f3e1 | Feature tiles |
| Sky    | #dcecf8 | Feature tiles |
| Yellow | #fef7d6 | Feature tiles |

### Key Decisions

- **#37352F text** — warm brown-black, not pure black. Reduces contrast fatigue for users spending hours in the product
- **#F7F6F3 warm hover** — the signature. Used everywhere: sidebar items, page list rows, inline menus. Warmth makes the product feel like paper warming under your hand
- **Single accent blue** (#2383E2) — barely noticeable in daily use. Blue communicates "interactive element" universally
- **Warm grays** — not blue-gray. The cumulative effect is human and approachable, not clinical

## Accessibility

- **WCAG AA compliance** across default themes
- **High contrast text:** #37352F on #FFFFFF passes AAA
- **Keyboard navigation** through all block types
- **Screen reader support** for database views
- **Focus indicators** on interactive elements
- **Color contrast** verified across all theme combinations

### Color Considerations

- #a39e98 (subtle text) fails AA contrast on white — used only for large/bold text
- All interactive elements have focus states
- Semantic HTML for block structure
- ARIA labels for database controls

## Design Tokens

### CSS Variables

```css
:root {
  --text-primary: #37352f;
  --text-secondary: #787774;
  --text-tertiary: #9b9a97;
  --background: #ffffff;
  --surface: #f7f6f3;
  --surface-active: #efede8;
  --border: rgba(55, 53, 47, 0.09);
  --accent: #2383e2;

  --font-body: "NotionInter", Inter, -apple-system, sans-serif;
  --font-serif: "Lyon Text", Georgia, serif;
  --font-mono: "Nitti", ui-monospace, Menlo, monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  --shadow-card:
    rgba(25, 25, 25, 0.027) 0px 1px 3px, rgba(25, 25, 25, 0.054) 0px 2px 6px;
  --shadow-card-hover:
    rgba(25, 25, 25, 0.04) 0px 2px 8px, rgba(25, 25, 25, 0.08) 0px 4px 16px;
}
```

### Border Radius Scale

| Name   | Value  | Usage                        |
| ------ | ------ | ---------------------------- |
| `sm`   | 4px    | Buttons, inputs              |
| `md`   | 8px    | Utility buttons, small cards |
| `lg`   | 12px   | Content cards, containers    |
| `xl`   | 20px   | Decorative containers        |
| `full` | 9999px | Pills, avatars               |

### Elevation

- **Level 0:** 1px hairline only — default card
- **Level 1/2:** Soft layered micro-shadow — floating cards, modals

## Component Patterns

### Buttons

- **Primary:** #2383E2 background, white text, 4px radius
- **Secondary:** Transparent background, border
- **Ghost:** No background, text only
- One primary button per screen view maximum

### Cards

- White surface, 12px radius
- Multi-layered soft shadows
- Hover: larger shadow + translateY(-2px)
- Warm gray borders

### Modals

- Centered card over 50% ink scrim
- Hairline divider above action row
- Secondary text-button left, primary right
- Focus trapped inside

### Tables

- Mono uppercase column headers
- Alternating canvas rows
- Status pills with semantic colors
- Hairline row dividers
- Footer pager

## Animation & Motion

### Timing

- **Default:** 150-200ms ease
- **Fast:** 100ms ease-out
- **Slow:** 300ms ease-in-out

### Patterns

- **Block transitions:** Fade in on creation
- **Page transitions:** Slide left/right for navigation
- **Hover states:** Subtle shadow changes
- **Drag and drop:** Smooth reordering animation
- **Autoplaying videos** and CSS keyframe animations (fadeIn, etc.)

### Key Principle

Subtle but meaningful motion — responsive and modern feel without being distracting.

## Dark Mode

### Implementation

Notion has a full dark theme in the app (not on marketing site):

- Background: near-black
- Text: near-white
- Surfaces: slightly elevated dark tones
- Accent: same blue, adjusted for dark backgrounds

### Marketing Site

- Light-only with dark hero bands (#02093a navy)
- Not a togglable theme
- Hero sections use inverted color scheme

## Mobile Responsive

### Breakpoints

| Name    | Width       | Changes                                    |
| ------- | ----------- | ------------------------------------------ |
| Mobile  | < 768px     | Single column, hamburger nav, stacked CTAs |
| Tablet  | 768-1023px  | 2-up grids, condensed nav                  |
| Laptop  | 1024-1279px | Tightened gutters, 3-col retained          |
| Desktop | ≥ 1280px    | Full multi-column, ~1200px centered        |

### Mobile Patterns

- Hamburger menu for navigation
- Bottom action bar
- Swipe gestures for block manipulation
- Touch targets ≥ 44x44px

## Navigation Patterns

### Sidebar

- Fixed left sidebar
- Hierarchical tree structure
- Page icons and toggles
- Collapsible sections
- Search at top

### Breadcrumbs

- Page hierarchy displayed
- Clickable at each level
- Truncated with ellipsis for deep hierarchies

### Tabs

- Database view tabs (Table, Board, Timeline, etc.)
- Active tab with bottom indicator

## Form Patterns

### Input Design

- Clean, minimal inputs
- 1px solid #dfdcd9 border
- Blue box-shadow on :focus
- Labels above inputs

### Validation

- Inline validation on blur
- Error messages below inputs
- Success states with green indicators

### Multi-Step

- Wizard-style for complex workflows
- Progress indicator
- Back/Next navigation

## Data Display

### Database Views

- **Table:** Sortable columns, filterable, groupable
- **Board:** Kanban columns with drag-and-drop
- **Timeline:** Gantt-style bars
- **Gallery:** Card grid with images
- **List:** Compact rows
- **Calendar:** Date-based layout

### Empty States

- Illustration + message + CTA
- "No pages yet" → "Create your first page"

## Error Handling

### Error Pages

- Clean, minimal error states
- Retry buttons
- Navigation back to home

### Optimistic Updates

- Block creation appears instantly
- Background sync with server
- Rollback on failure

## Loading States

### Skeleton Loaders

- Content-shaped placeholders
- Subtle shimmer
- Matches final layout

### Progress Indicators

- Determinate bars for exports
- Indeterminate spinners for async

## Reusable Ideas

1. **Warm neutrals over cold grays** — #37352F text, #F7F6F3 hover — makes the product feel human
2. **Block-based architecture** — consistent spacing, borders, hover states for all content
3. **96px content margins** — creates a document feel echoing printed pages
4. **16px body text** — larger than typical SaaS, optimizing for reading/writing
5. **Type that loses to user content** — NotionInter stays quiet so user hierarchy wins
6. **Pastel card tints** — peach, rose, lilac, mint — personality without gradient bling
7. **Single accent restraint** — one blue (#2383E2) for all interactive elements
8. **Multi-layered soft shadows** — many near-transparent stops, never a hard cast

## Evidence

- **Source:** https://designmd.cc/benchmarks/notion
- **Date collected:** 2026-08-03
- **Why it matters:** Notion proves that warm, document-like design can scale to complex productivity tools without losing approachability.
- **Trade-offs:** Pros: Exceptional readability, warm/approachable feel, block-based consistency. Cons: Dense UI can feel slow, warm palette may feel dated to some, 16px body text wastes space on data-heavy screens.
- **Expected value:** Warm neutral palette, block-based patterns, and generous typography directly transfer to GitHub OS content areas.
- **Maintenance burden:** Low — CSS variable-based system, single font family, consistent spacing scale.
- **Hardware impact:** Low — CSS-based shadows, no heavy JS animations, optimized for reading/writing workflows.
