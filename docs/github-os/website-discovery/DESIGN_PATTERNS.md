# Design Patterns

## Typography

### Font Stack

**Primary (Body):** Inter, system-ui, -apple-system, sans-serif
**Code:** JetBrains Mono, Fira Code, monospace
**Display:** Inter (bold/extra-bold for headlines)

### Type Scale (from Stripe/Linear)

| Element    | Size | Weight | Line Height | Letter Spacing |
| ---------- | ---- | ------ | ----------- | -------------- |
| Hero       | 72px | 800    | 1.1         | -0.02em        |
| H1         | 48px | 700    | 1.2         | -0.02em        |
| H2         | 36px | 700    | 1.3         | -0.01em        |
| H3         | 28px | 600    | 1.4         | -0.01em        |
| H4         | 22px | 600    | 1.4         | 0              |
| Body Large | 18px | 400    | 1.6         | 0              |
| Body       | 16px | 400    | 1.6         | 0              |
| Body Small | 14px | 400    | 1.5         | 0.01em         |
| Caption    | 12px | 500    | 1.4         | 0.02em         |
| Code       | 14px | 400    | 1.5         | 0              |

### Evidence

- Stripe: 16px body, generous line-height
- Linear: Large hero text, tight line-height for headlines
- Vercel: Geist font family, clean hierarchy
- Anthropic: 18px body for readability

## Spacing

### 8px Grid System

All spacing values are multiples of 8px.

| Token    | Value | Use                             |
| -------- | ----- | ------------------------------- |
| space-1  | 4px   | Tight spacing (inline elements) |
| space-2  | 8px   | Small spacing (list items)      |
| space-3  | 12px  | Medium spacing (card padding)   |
| space-4  | 16px  | Standard spacing                |
| space-5  | 20px  | Section padding                 |
| space-6  | 24px  | Card padding                    |
| space-8  | 32px  | Section gaps                    |
| space-10 | 40px  | Large section gaps              |
| space-12 | 48px  | Hero spacing                    |
| space-16 | 64px  | Page margins                    |
| space-20 | 80px  | Section dividers                |
| space-24 | 96px  | Major sections                  |

### Evidence

- Stripe: 64-96px section spacing, 24-32px card padding
- Linear: 48-64px section spacing, minimal borders
- Vercel: 32-48px section spacing, generous whitespace

## Colors

### Dark Mode First (Bhavya Palette)

```css
:root {
  /* Background */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-elevated: #222222;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1a1;
  --text-tertiary: #666666;

  /* Brand */
  --brand-primary: #3b82f6;
  --brand-secondary: #8b5cf6;
  --brand-accent: #06b6d4;

  /* Borders */
  --border-primary: #262626;
  --border-secondary: #333333;

  /* Status */
  --status-success: #22c55e;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
}

/* Light Mode */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --bg-elevated: #ffffff;

  --text-primary: #0a0a0a;
  --text-secondary: #525252;
  --text-tertiary: #a3a3a3;

  --border-primary: #e5e5e5;
  --border-secondary: #d4d4d4;
}
```

### Evidence

- Vercel: Dark first, #000 background, white text
- Linear: Dark gray (#1a1a1a) with subtle borders
- Stripe: Dark mode with gradient accents
- Anthropic: Warm dark tones

## Cards

### Feature Card

```
┌─────────────────────────────────┐
│ [Icon]                           │
│                                  │
│ Feature Title                    │
│ Description text that explains   │
│ the feature in 1-2 lines.        │
│                                  │
│ [Learn more →]                   │
└─────────────────────────────────┘
```

**Specs:**

- Border: 1px solid var(--border-primary)
- Border-radius: 12px
- Padding: 24px
- Background: var(--bg-secondary)
- Hover: border-color change, subtle scale

### Knowledge Package Card

```
┌─────────────────────────────────┐
│ [Thumbnail]                      │
│                                  │
│ KP-001: How LLMs Work           │
│ Level 1 · Module 1.1 · 45 min   │
│                                  │
│ Brief description of what this   │
│ Knowledge Package covers.        │
│                                  │
│ [Tags: AI, LLM, Beginner]       │
│                                  │
│ ──────────────────────────────── │
│ ⏱ 45 min · 📊 Beginner          │
└─────────────────────────────────┘
```

**Specs:**

- Border: 1px solid var(--border-primary)
- Border-radius: 12px
- Padding: 16px
- Thumbnail: 16:9 aspect ratio
- Hover: lift effect (translateY(-2px))

### Project Card

```
┌─────────────────────────────────┐
│ [Status Badge]                   │
│                                  │
│ Build Your First AI Assistant    │
│                                  │
│ Learn to build a personal AI    │
│ assistant using modern APIs.     │
│                                  │
│ [Python] [API] [Beginner]       │
│                                  │
│ ──────────────────────────────── │
│ 👥 12 contributors · ⭐ 4.8      │
└─────────────────────────────────┘
```

### Testimonial Card

```
┌─────────────────────────────────┐
│ "This Knowledge Package changed │
│ how I think about AI. The hands-on│
│ approach made complex concepts   │
│ feel accessible."                │
│                                  │
│ [Avatar] Name                    │
│ Role, Organization               │
└─────────────────────────────────┘
```

## Hero Sections

### Homepage Hero

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│           Building the Future of AI Education        │
│                                                      │
│   Learn AI by building real projects. From beginner  │
│   to contributor in 6 months.                        │
│                                                      │
│   [Get Started] [View Curriculum]                    │
│                                                      │
│   Trusted by 1,000+ learners worldwide               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Specs:**

- Padding: 96-128px vertical
- Max-width: 800px centered
- Headline: 48-72px, font-weight: 800
- Subtitle: 18-20px, var(--text-secondary)
- CTA: Primary button + Secondary button
- Social proof: Logos or metrics

### Learning Hub Hero

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│   AI Foundations                                     │
│   Master the fundamentals of artificial intelligence  │
│                                                      │
│   [12 Modules] [48 Knowledge Packages] [96 Hours]    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Knowledge Package Hero

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│   Level 1 > Module 1.1                               │
│                                                      │
│   How Large Language Models Work                     │
│                                                      │
│   Understand the technology behind ChatGPT, Claude,  │
│   and other AI assistants.                           │
│                                                      │
│   ⏱ 45 min · 📊 Beginner · 📝 8 sections            │
│                                                      │
│   [Start Learning] [View on GitHub]                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Documentation Layout

### Sidebar + Content Pattern

```
┌────────┬────────────────────────────────────────────┐
│        │                                            │
│ Sidebar│  Content Area                              │
│        │                                            │
│ 📚     │  # Page Title                              │
│ Item 1 │                                            │
│ Item 2 │  Content goes here...                      │
│ > Item 3│                                            │
│   Sub  │  ## Section                                │
│   Sub  │                                            │
│ Item 4 │  More content...                           │
│        │                                            │
│        │  [Previous] [Next]                         │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

**Specs:**

- Sidebar: 280px fixed width
- Content: max-width 720px
- Table of contents: 220px fixed (right side on desktop)
- Mobile: Sidebar collapses to hamburger

## Dark Mode

### Toggle Pattern

- Sun/Moon icon in top-right
- System preference detection
- Smooth transition (200ms)
- Persisted in localStorage

### Implementation

```css
/* Transition */
* {
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}

/* System preference */
@media (prefers-color-scheme: dark) {
  :root {
    /* dark tokens */
  }
}
```

## Responsive Breakpoints

| Breakpoint | Width       | Layout                           |
| ---------- | ----------- | -------------------------------- |
| Mobile     | < 640px     | Single column, hamburger nav     |
| Tablet     | 640-1024px  | Two columns, collapsed sidebar   |
| Desktop    | 1024-1280px | Full layout, sidebar visible     |
| Wide       | > 1280px    | Max-width container, TOC visible |

## Animations

### Micro-interactions

- Button hover: scale(1.02), 150ms
- Card hover: translateY(-2px), 200ms
- Theme toggle: rotation 300ms
- Page transitions: fade 200ms

### Loading States

- Skeleton screens for content
- Spinner for actions
- Progress bar for uploads

## Accessibility

### Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Focus visible indicators
- Alt text for all images
- ARIA labels for complex components
- Color contrast: 4.5:1 for text, 3:1 for large text
