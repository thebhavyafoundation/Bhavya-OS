# Raycast — UI Knowledge Package

## Executive Summary

Raycast is a blazingly fast launcher for macOS that puts your workflows one keystroke away. The design system reads like an extended product screenshot — the marketing chrome IS the in-product command palette scaled up: pure-near-black canvas at #07080a, hairline 1px borders, command-palette-style cards, and a single white CTA pill anchoring every primary action. The system runs Inter with `font-feature-settings: "ss03"` enabled site-wide — the ss03 stylistic set swaps in Inter's alternate single-story g, which is the brand's signature typographic detail.

Raycast targets power users, developers, and anyone who lives in keyboard workflows. The entire app is built to be driven from the keyboard — Emacs and Vim bindings are built in, custom hotkeys can be assigned to any command, and the Action Panel (⌘K) is the universal entry point for all actions. The product philosophy: keyboard-first, mouse-friendly. Every action has a shortcut, shortcuts are discoverable through the palette, and the mouse works perfectly but the keyboard is faster.

The design is notable for what it refuses: no chromatic brand color (the universal primary CTA is pure white at #ffffff), no drop shadows (depth comes from a 4-step surface ladder), and no light mode (dark-only by design). The one chromatic moment on chrome is a red diagonal-stripe gradient that appears once per page maximum.

## Layout System

### Grid System

Raycast's layout is command-palette-native:

- **List view** — dense rows with keyboard navigation
- **Grid view** — image-forward items with more breathing room
- **Detail view** — full-width content panels
- **Form view** — inline forms within the command surface

### Spacing Scale

| Token           | Value |
| --------------- | ----- |
| `--spacing-xs`  | 4px   |
| `--spacing-sm`  | 8px   |
| `--spacing-md`  | 12px  |
| `--spacing-lg`  | 16px  |
| `--spacing-xl`  | 24px  |
| `--spacing-2xl` | 32px  |
| `--spacing-3xl` | 48px  |
| `--spacing-4xl` | 96px  |

### Layout Pattern

- Single-window interface (not a full desktop app)
- Command palette as the primary surface
- Action Panel overlays content
- Minimal chrome — content is king

## Command Palette

### The Core: Root Search

`⌘Space` (default, customizable) opens Raycast — the command palette IS the app.

### Action Panel

`⌘K` opens the Action Panel — contextual actions for any selected item:

```
┌────────────────────────────────────────────────────────────┐
│ Action Panel                                                │
├────────────────────────────────────────────────────────────┤
│ Primary Action                                              │
│ ├─ Open / Run Command                                       │
│                                                            │
│ Favorites                                                   │
│ ├─ Add to Favorites                          ⌘F            │
│ ├─ Move Up                                    ⌘↑           │
│ └─ Move Down                                  ⌘↓           │
│                                                            │
│ Configure                                                   │
│ ├─ Set Hotkey                               ⌘⇧,           │
│ ├─ Set Alias                                             │
│ └─ Open Settings                                         │
│                                                            │
│ Manage                                                      │
│ ├─ Disable Command                         ⌘⇧D           │
│ └─ Reset Ranking                                          │
└────────────────────────────────────────────────────────────┘
```

### Key Features

- **Fuzzy search** across actions, commands, extensions
- **Sub-menus** for complex action hierarchies
- **Custom views** inside the Action Panel
- **Destructive actions** shown in red
- **Inline hotkey recorder** with auto-save and conflict detection

### Keyboard Shortcuts

| Shortcut | Action                         |
| -------- | ------------------------------ |
| `↵`      | Run primary action             |
| `⌘K`     | Open Action Panel              |
| `⌘↵`     | Submit form / secondary action |
| `⌘⇧↵`    | Tertiary action                |
| `Esc`    | Close panel / go back          |

## Keyboard Shortcuts

### Global System

| Shortcut | Action                       |
| -------- | ---------------------------- |
| `⌘Space` | Open/close Raycast (default) |
| `⌘Esc`   | Pop to Root                  |
| `⌘W`     | Close window                 |
| `⌘,`     | Open Settings                |
| `⌘⇧/`    | Open User Guide              |

### List Navigation

| Shortcut          | Action               |
| ----------------- | -------------------- |
| `↑`/`↓`           | Move up/down         |
| `⌥↑`/`⌥↓`         | Jump page up/down    |
| `⌘↑`/`⌘↓`         | Jump section up/down |
| `Ctrl+N`/`Ctrl+P` | Emacs-style down/up  |
| `⇧Tab`            | Navigate to parent   |
| `↑`/`↓` at bounds | Cycle search history |

### Alternative Bindings

- **Emacs:** Ctrl+N/P/F/B for navigation (enabled by default)
- **Vim:** Ctrl+J/K/L/H for navigation (optional)

### Custom Hotkeys

- Any command can have a global hotkey
- Hotkeys work even when Raycast is in background
- Visual keyboard shortcut recorder with auto-save
- Real-time conflict detection
- Physical key vs. key equivalent options

## Dashboard Design

### Not a Traditional Dashboard

Raycast doesn't have a dashboard — it IS the dashboard. The command palette is the surface.

### Store/Extension Cards

- Dark cards (#121212) with 10-16px radius
- Extension icon + name + description
- Install button
- Category badges

### Pricing Tiers

- Card-based comparison
- Feature lists with checkmarks
- CTA pills

## Search UX

### Root Search

- Full-text fuzzy search across everything
- Results grouped by type (applications, commands, extensions, quicklinks, system actions)
- Keyboard navigable
- Recent items surfaced first

### Search Results

- Icon + name + description
- Keyboard shortcut displayed
- Alias badge if set
- Category indicator

### Filters

- By category (Applications, Extensions, Quicklinks, System Actions)
- By status (Hotkey Set, Alias Set, Enabled, Disabled)
- Inline search within filtered results

## Activity Feeds

### Clipboard History

- Chronological list of copied items
- Search within history
- Pin items for persistence
- Preview on hover

### AI Chat History

- Sidebar with chat sessions
- Search across chats
- Continue previous conversations

## Typography

### Font Stack

```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
font-feature-settings: "calt", "kern", "liga", "ss03";
```

### Type Scale

| Token        | Size | Weight | Notes            |
| ------------ | ---- | ------ | ---------------- |
| `display-xl` | 64px | 600    | Hero headlines   |
| `display-lg` | 48px | 600    | Section headers  |
| `heading-1`  | 32px | 600    | Page titles      |
| `heading-2`  | 24px | 600    | Sub-sections     |
| `heading-3`  | 20px | 600    | Card titles      |
| `body-lg`    | 16px | 400    | Large body text  |
| `body`       | 14px | 400    | Default body     |
| `body-sm`    | 13px | 400    | Dense body       |
| `caption`    | 12px | 400    | Labels, metadata |
| `caption-sm` | 11px | 400    | Micro text       |

### Key Decisions

- **ss03 stylistic set** — swaps in Inter's alternate single-story g. The brand's signature typographic detail. Without it, the chrome loses its voice.
- **Display tier** also enables ss02 and ss08, disables standard liga
- **Body at 14px** — dense, information-forward
- **Single font family** — Inter for everything

## Color System

### Core Palette

| Token                | Value                  | Role                       |
| -------------------- | ---------------------- | -------------------------- |
| `--canvas`           | #07080a                | Base canvas                |
| `--surface`          | #0d0d0d                | Elevated surface           |
| `--surface-elevated` | #101111                | Higher elevation           |
| `--surface-card`     | #121212                | Card background            |
| `--ink`              | #f4f4f6                | Primary text               |
| `--body`             | #cdcdcd                | Secondary text             |
| `--on-dark`          | #ffffff                | Text on dark               |
| `--on-dark-muted`    | rgba(255,255,255,0.72) | Muted text on dark         |
| `--button-fg`        | #18191a                | Button text (on white CTA) |
| `--on-primary`       | #000000                | Text on primary            |
| `--hairline`         | #242728                | Card borders               |
| `--hairline-soft`    | rgba(255,255,255,0.08) | Subtle borders             |
| `--hairline-strong`  | rgba(255,255,255,0.16) | Stronger borders           |

### Surface Ladder (4-Step)

```
#07080a → #0d0d0d → #101111 → #121212
canvas     surface    elevated    card
```

Depth comes from the surface ladder, not drop shadows.

### Key Decisions

- **No chromatic brand color** — the universal primary CTA is pure white at #ffffff
- **Zero drop shadows** — depth from surface ladder + hairline borders
- **Red gradient** (#ff5757 → #a1131a) — the one chromatic moment, appears once per page maximum
- **Dark-only** — no light mode by design

## Accessibility

- **Keyboard-first** with full keyboard navigation
- **Emacs and Vim bindings** for power users
- **Screen reader support** for all UI elements
- **Focus indicators** on interactive elements
- **High contrast** dark theme
- **ARIA labels** on all controls

### Key Accessibility Features

- All actions accessible via keyboard
- Focus management in Action Panel
- Screen reader announcements for state changes
- Reduced motion support
- High contrast mode support

## Design Tokens

### CSS Variables

```css
:root {
  --canvas: #07080a;
  --surface: #0d0d0d;
  --surface-elevated: #101111;
  --surface-card: #121212;
  --ink: #f4f4f6;
  --body: #cdcdcd;
  --hairline: #242728;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### Border Radius Scale

| Name   | Value  | Usage                                |
| ------ | ------ | ------------------------------------ |
| `xs`   | 4px    | Keycaps                              |
| `sm`   | 6px    | Command-palette rows, inline buttons |
| `md`   | 8px    | Standard buttons, inputs             |
| `lg`   | 10px   | Feature cards, pricing tiers         |
| `xl`   | 16px   | Hero command-palette containers      |
| `full` | 9999px | Pill-tabs, avatars                   |

### Key Principle

Chrome never goes flat at 0px on cards and never exceeds 16px except for fully-rounded pills.

## Component Patterns

### Buttons

- **Primary:** White (#ffffff) background, black text — the universal CTA
- **Secondary:** Transparent with hairline border
- **Ghost:** No background, text only
- **Destructive:** Red text/indicators

### Command Palette Cards

- 6-16px radius
- Hairline 1px borders at #242728
- No drop shadows
- Hover: surface elevation change

### Forms

- Inline forms within Action Panel
- Tab between fields
- `⌘↵` to submit
- `Esc` to cancel

### Lists

- Dense rows with keyboard navigation
- Icon + name + description + shortcut
- Section headers
- Fuzzy search filtering

## Animation & Motion

### Timing

- **Fast:** 100ms ease-out
- **Default:** 150ms ease
- **Slow:** 200ms ease-in-out

### Patterns

- **Action Panel:** Scale + opacity entrance
- **List items:** Subtle fade on appear
- **Hotkey recorder:** Real-time key display
- **Search results:** Progressive loading

### Key Principle

Motion is functional — signals state changes without decoration. Fast enough to not delay, slow enough to register.

## Dark Mode

### Implementation

Dark-only by design — no light mode:

- Canvas: #07080a (pure-near-black)
- 4-step surface ladder for elevation
- Hairline borders for depth
- Zero drop shadows

### Key Decisions

- Dark mode IS the design, not an alternative
- Depth from surface ladder, not shadows
- High contrast text on dark backgrounds
- Premium feel for power users

## Mobile Responsive

### Not Applicable

Raycast is a macOS/Windows desktop launcher — no mobile version. However, the design principles translate:

- Dense, keyboard-first layout
- Single-window interface
- Command-palette-native navigation

## Navigation Patterns

### Root Search as Navigation

- Type to filter/navigate
- Sections for different item types
- Recent items at top
- Favorites pinned

### Action Panel

- Contextual to selected item
- Sub-menus for complex hierarchies
- `Esc` to go back

### Tabs

- Extension settings tabs
- Category filters
- View mode toggles

## Form Patterns

### Inline Forms

- Within Action Panel
- Tab navigation between fields
- `⌘↵` to submit
- `Esc` to cancel

### Hotkey Recorder

- Visual key display
- Auto-save with countdown
- Conflict detection
- Clear button

### Validation

- Real-time conflict warnings
- Visual feedback for invalid states
- Inline error messages

## Data Display

### Clipboard History

- Chronological list
- Search within
- Pin for persistence
- Preview on hover

### Extension Store

- Card-based browsing
- Category filters
- Search
- Install/uninstall actions

## Error Handling

### Error States

- Clean, minimal error messages
- Retry buttons
- Fallback to default state

### Conflict Resolution

- Hotkey conflict warnings
- Alias conflict detection
- Visual feedback before save

## Loading States

### Indicators

- Loading indicator at top of Raycast
- Skeleton loaders for content
- Progress for long operations

### Optimistic Updates

- Immediate UI feedback
- Background sync
- Rollback on failure

## Reusable Ideas

1. **Surface ladder over shadows** — 4-step elevation system (#07080a → #121212) creates depth without heaviness
2. **White CTA as universal primary** — no chromatic brand color, pure white is the action color
3. **ss03 stylistic set** — a single typographic detail (alternate g) creates brand identity
4. **Hairline borders only** — zero drop shadows, 1px borders at consistent color
5. **Inline hotkey recorder** — visual key display with auto-save and conflict detection
6. **Emacs/Vim bindings** — alternative navigation for power users
7. **Action Panel as universal pattern** — contextual actions for any selected item
8. **Dark-only design** — no light mode overhead, premium feel

## Evidence

- **Source:** https://manual.raycast.com/keyboard-shortcuts
- **Date collected:** 2026-08-03
- **Why it matters:** Raycast proves that keyboard-first design can be beautiful and that surface ladders beat drop shadows for dark UIs.
- **Trade-offs:** Pros: Best-in-class keyboard UX, beautiful dark design, extensible via extensions. Cons: macOS/Windows only (no mobile), dark-only may alienate some users, dense UI has learning curve.
- **Expected value:** Surface ladder pattern, white CTA philosophy, and inline hotkey recorder directly transfer to GitHub OS.
- **Maintenance burden:** Low — CSS variable-based system, single font family, minimal animation.
- **Hardware impact:** Very low — no heavy JS runtime, CSS-based everything, optimized for keyboard workflows.
