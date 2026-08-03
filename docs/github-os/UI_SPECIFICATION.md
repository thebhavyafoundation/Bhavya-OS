# GitHub OS — UI Specification

## Design Principles

### 1. Dark Mode First

- Dark backgrounds (#0a0a0a, #111111, #1a1a1a)
- Light text (#fafafa, #a1a1aa)
- Subtle borders (#27272a, #3f3f46)
- Accent colors for interactive elements

### 2. Linear / Vercel Aesthetic

- Clean, minimal chrome
- Generous whitespace
- Precise typography
- Subtle shadows and borders

### 3. Glassmorphism Elements

- Frosted glass modals and dropdowns
- Subtle blur effects
- Layered depth with transparency

### 4. Keyboard-First

- Every action has a keyboard shortcut
- Command palette (⌘K) for all navigation
- Focus management for accessibility

## Color System

### Background Colors

```css
--bg-primary: #0a0a0a; /* Main background */
--bg-secondary: #111111; /* Card backgrounds */
--bg-tertiary: #1a1a1a; /* Elevated surfaces */
--bg-hover: #27272a; /* Hover states */
--bg-active: #3f3f46; /* Active states */
```

### Text Colors

```css
--text-primary: #fafafa; /* Primary text */
--text-secondary: #a1a1aa; /* Secondary text */
--text-tertiary: #71717a; /* Muted text */
--text-disabled: #52525b; /* Disabled text */
```

### Border Colors

```css
--border-primary: #27272a; /* Default borders */
--border-secondary: #3f3f46; /* Emphasized borders */
--border-focus: #3b82f6; /* Focus rings */
```

### Accent Colors

```css
--accent-blue: #3b82f6; /* Primary actions */
--accent-green: #22c55e; /* Success states */
--accent-yellow: #eab308; /* Warning states */
--accent-red: #ef4444; /* Error states */
--accent-purple: #a855f7; /* AI-related elements */
--accent-orange: #f97316; /* Automation elements */
```

### Category Colors

```css
--repo-color: #3b82f6; /* Repositories */
--knowledge-color: #a855f7; /* Knowledge */
--issue-color: #22c55e; /* Issues */
--pr-color: #f97316; /* Pull Requests */
--workflow-color: #eab308; /* Workflows */
--learning-color: #06b6d4; /* Learning */
```

## Typography

### Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
```

### Type Scale

| Token   | Size | Weight | Line Height | Use              |
| ------- | ---- | ------ | ----------- | ---------------- |
| display | 36px | 700    | 1.2         | Hero text        |
| h1      | 30px | 700    | 1.3         | Page titles      |
| h2      | 24px | 600    | 1.4         | Section headers  |
| h3      | 20px | 600    | 1.4         | Card titles      |
| body    | 14px | 400    | 1.5         | Body text        |
| body-sm | 13px | 400    | 1.5         | Secondary text   |
| caption | 12px | 400    | 1.4         | Labels, captions |
| code    | 13px | 400    | 1.5         | Code blocks      |

## Spacing Scale

| Token    | Value | Use                 |
| -------- | ----- | ------------------- |
| space-0  | 0px   | —                   |
| space-1  | 4px   | Tight spacing       |
| space-2  | 8px   | Default spacing     |
| space-3  | 12px  | Comfortable spacing |
| space-4  | 16px  | Section spacing     |
| space-5  | 20px  | Card padding        |
| space-6  | 24px  | Page margins        |
| space-8  | 32px  | Section gaps        |
| space-10 | 40px  | Large gaps          |
| space-12 | 48px  | Page sections       |

## Component Library

### Button

**Primary Button**

```css
background: var(--accent-blue);
color: white;
border: none;
border-radius: 6px;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: all 100ms ease;

&:hover {
  background: #2563eb;
}
&:active {
  transform: scale(0.98);
}
&:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Secondary Button**

```css
background: transparent;
color: var(--text-primary);
border: 1px solid var(--border-primary);
border-radius: 6px;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;

&:hover {
  background: var(--bg-hover);
  border-color: var(--border-secondary);
}
```

**Ghost Button**

```css
background: transparent;
color: var(--text-secondary);
border: none;
padding: 8px 16px;

&:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}
```

**Danger Button**

```css
background: var(--accent-red);
color: white;

&:hover {
  background: #dc2626;
}
```

### Card

```css
background: var(--bg-secondary);
border: 1px solid var(--border-primary);
border-radius: 8px;
padding: var(--space-5);
transition: border-color 150ms ease;

&:hover {
  border-color: var(--border-secondary);
}
```

### Input

```css
background: var(--bg-primary);
border: 1px solid var(--border-primary);
border-radius: 6px;
padding: 8px 12px;
color: var(--text-primary);
font-size: 14px;

&:focus {
  border-color: var(--accent-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
&::placeholder {
  color: var(--text-tertiary);
}
```

### Badge

```css
background: var(--bg-tertiary);
border-radius: 9999px;
padding: 2px 8px;
font-size: 12px;
font-weight: 500;
```

### Status Badge Variants

```css
.status-open {
  background: #22c55e20;
  color: #22c55e;
}
.status-in-progress {
  background: #3b82f620;
  color: #3b82f6;
}
.status-review {
  background: #a855f720;
  color: #a855f7;
}
.status-approved {
  background: #22c55e20;
  color: #22c55e;
}
.status-merged {
  background: #a855f720;
  color: #a855f7;
}
.status-closed {
  background: #71717a20;
  color: #71717a;
}
.status-failed {
  background: #ef444420;
  color: #ef4444;
}
```

### Tab

```css
border-bottom: 1px solid var(--border-primary);
display: flex;
gap: var(--space-6);

.tab {
  padding: var(--space-3) var(--space-2);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;

  &:hover {
    color: var(--text-primary);
  }
  &.active {
    color: var(--text-primary);
    border-bottom-color: var(--accent-blue);
  }
}
```

### Table

```css
width: 100%;
border-collapse: collapse;

th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-primary);
}

td {
  padding: var(--space-3) var(--space-4);
  font-size: 14px;
  border-bottom: 1px solid var(--border-primary);
}

tr:hover td {
  background: var(--bg-hover);
}
```

### Modal

```css
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
display: flex;
align-items: center;
justify-content: center;
z-index: 50;

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--space-6);
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

### Sidebar

```css
width: 240px;
background: var(--bg-secondary);
border-right: 1px solid var(--border-primary);
height: 100vh;
position: fixed;
left: 0;
top: 0;
padding: var(--space-5) 0;
overflow-y: auto;
```

### Command Palette

```css
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
display: flex;
align-items: flex-start;
justify-content: center;
padding-top: 20vh;
z-index: 100;

.palette {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.palette-input {
  border: none;
  background: transparent;
  padding: var(--space-4) var(--space-5);
  font-size: 16px;
  color: var(--text-primary);
  width: 100%;
  border-bottom: 1px solid var(--border-primary);
}
```

### Stat Card

```css
background: var(--bg-secondary);
border: 1px solid var(--border-primary);
border-radius: 8px;
padding: var(--space-5);

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-change {
  font-size: 12px;
  margin-top: var(--space-1);
}

.stat-change.positive {
  color: var(--accent-green);
}
.stat-change.negative {
  color: var(--accent-red);
}
```

### Empty State

```css
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: var(--space-12);
text-align: center;

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  max-width: 400px;
}
```

### Loading Skeleton

```css
background: linear-gradient(
  90deg,
  var(--bg-tertiary) 25%,
  var(--bg-hover) 50%,
  var(--bg-tertiary) 75%
);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Interaction Patterns

### Hover States

- Background color change (100ms ease)
- Border color change (100ms ease)
- Subtle scale (0.98) for buttons

### Focus States

- Blue ring (3px, rgba blue)
- Visible on keyboard focus only (`:focus-visible`)

### Active States

- Scale down (0.98) for buttons
- Background darken for interactive elements

### Transitions

- All transitions: 100-200ms ease
- Hover: 100ms ease
- Focus: 50ms ease
- Page transitions: 200ms ease

## Responsive Design

### Mobile (< 640px)

- Single column layout
- Bottom navigation bar
- Collapsible sections
- Full-width cards

### Tablet (640-1024px)

- Two column layout
- Collapsible sidebar
- Stacked cards
- Responsive tables

### Desktop (1024-1440px)

- Three column layout
- Fixed sidebar
- Grid layouts
- Side panels

### Wide (> 1440px)

- Expanded layout
- Multiple panels
- Dense information display

## Accessibility

### Color Contrast

- Primary text: 15.4:1 ratio
- Secondary text: 7.5:1 ratio
- Interactive elements: 4.5:1 ratio

### Keyboard Navigation

- Visible focus rings
- Logical tab order
- Skip links
- ARIA labels

### Screen Reader Support

- Semantic HTML
- ARIA landmarks
- Alt text for images
- Live regions for updates

## Dark Mode Toggle

```css
/* Light mode (future) */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-primary: #e5e7eb;
}
```

## Animation

### Micro-interactions

- Button click: scale(0.98) → scale(1)
- Checkbox toggle: translateX
- Dropdown open: translateY(-8px) + opacity
- Modal open: scale(0.95) → scale(1) + opacity

### Page Transitions

- Fade in: opacity 0 → 1
- Slide up: translateY(8px) → translateY(0)
- Duration: 200ms ease

### Loading Animations

- Skeleton shimmer
- Spinner rotation
- Progress bar fill

## Icons

Use Lucide icons (consistent with Linear/Vercel):

```css
.icon {
  width: 16px;
  height: 16px;
  stroke-width: 1.5;
  stroke: currentColor;
  fill: none;
}
```

Common icons:

- Home, Search, Settings, User, Bell
- GitBranch, GitPullRequest, GitCommit
- Folder, File, FileCode
- Play, Pause, Check, X
- Plus, Minus, Edit, Trash
- ArrowLeft, ArrowRight, ChevronDown
