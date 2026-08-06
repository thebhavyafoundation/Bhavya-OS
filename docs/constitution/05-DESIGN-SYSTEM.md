# Constitution 05 — Design System

**Document:** DESIGN-SYSTEM-CONSTITUTION-005
**Version:** 1.0.0
**Status:** Active
**Effective:** 2026-08-06
**Authority:** Bhavya Foundation Governance

---

## 1. Preamble

Design is not decoration. Design is how Bhavya Foundation's mission is experienced. Every pixel, every interaction, every transition either serves the user or it does not. This constitution establishes the design standards that ensure every interface is clear, consistent, accessible, and timeless.

The design system is not a collection of components. It is a set of principles that govern how Bhavya Foundation looks, feels, and behaves across every platform and every screen.

---

## 2. Design Philosophy

### 2.1 Apple-Level Simplicity

Every screen must be reducible to its essential purpose. If a page has more than one primary action, it has too many. If a component requires explanation, it is too complex. Complexity is the enemy of adoption, especially in rural contexts where users may have limited digital experience.

### 2.2 OpenAI Clarity

Information architecture must be immediately understandable. A user should never wonder "where am I?" or "what do I do next?" Navigation is obvious. Labels are descriptive. No jargon without explanation.

### 2.3 Notion Consistency

Every pattern must be reusable. If a card looks one way in one application, it looks the same way in every application. Consistency reduces cognitive load and builds trust. Users learn once, use everywhere.

### 2.4 National Geographic Authenticity

Visuals must be real, not manufactured. Real photography. Real data. Real people. Stock imagery and AI-generated templates erode trust. Bhavya Foundation serves real communities with real needs — the design must reflect that authenticity.

---

## 3. Design Token Architecture

### 3.1 Three-Layer Token System

Every design decision flows through three token layers:

```
Primitive Tokens (raw values)
    ↓
Semantic Tokens (contextual meaning)
    ↓
Component Tokens (component-specific usage)
```

**Primitive tokens** are raw values: `#0a0a0a`, `16px`, `150ms`. They have no meaning on their own.

**Semantic tokens** assign meaning: `bg-primary`, `text-secondary`, `transition-fast`. They reference primitive tokens but add context.

**Component tokens** scope to specific components: `button-bg-primary`, `card-padding`, `input-border`. They reference semantic tokens.

### 3.2 Token Naming Convention

```
{category}-{element}-{variant}-{state}
```

Examples:

- `bg-primary` — primary background
- `text-secondary` — secondary text
- `border-focus` — focus ring border
- `accent-blue-hover` — blue accent in hover state

### 3.3 Token Storage

All tokens are defined in `packages/platform-ui/src/styles/tokens.css`. This file is the single source of truth. No application may define its own foundational tokens. Applications may reference tokens but never redefine them.

### 3.4 Tailwind Integration

Tokens are exposed as Tailwind utility classes:

```tsx
<div className="bg-bg-primary text-text-primary border-border-primary">
```

And as CSS variables:

```css
.element {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

Both forms are valid. Use Tailwind classes in JSX, CSS variables in CSS files.

---

## 4. Color System

### 4.1 Background Colors

| Token          | Value             | Usage                    |
| -------------- | ----------------- | ------------------------ |
| `bg-primary`   | `#0a0a0a`         | Page background          |
| `bg-secondary` | `#111111`         | Card, sidebar background |
| `bg-tertiary`  | `#1a1a1a`         | Input, hover background  |
| `bg-elevated`  | `#18181b`         | Elevated surfaces        |
| `bg-hover`     | `#27272a`         | Hover state              |
| `bg-active`    | `#3f3f46`         | Active state             |
| `bg-overlay`   | `rgba(0,0,0,0.5)` | Modal overlay            |

### 4.2 Text Colors

| Token            | Value     | Usage                     |
| ---------------- | --------- | ------------------------- |
| `text-primary`   | `#fafafa` | Primary text              |
| `text-secondary` | `#a1a1aa` | Secondary text            |
| `text-tertiary`  | `#71717a` | Muted text                |
| `text-muted`     | `#52525b` | Very muted text           |
| `text-inverse`   | `#0a0a0a` | Text on light backgrounds |

### 4.3 Border Colors

| Token              | Value     | Usage              |
| ------------------ | --------- | ------------------ |
| `border-primary`   | `#27272a` | Default borders    |
| `border-secondary` | `#3f3f46` | Emphasized borders |
| `border-focus`     | `#3b82f6` | Focus ring         |

### 4.4 Accent Colors

| Token           | Value     | Usage                 |
| --------------- | --------- | --------------------- |
| `accent-blue`   | `#3b82f6` | Primary action, links |
| `accent-green`  | `#22c55e` | Success, health       |
| `accent-yellow` | `#eab308` | Warning, learning     |
| `accent-red`    | `#ef4444` | Error, danger         |
| `accent-purple` | `#a855f7` | Special, exemplary    |
| `accent-orange` | `#f97316` | Caution               |
| `accent-cyan`   | `#06b6d4` | Info, technology      |

### 4.5 Status Colors

| Token            | Value     | Usage         |
| ---------------- | --------- | ------------- |
| `status-success` | `#22c55e` | Success state |
| `status-warning` | `#eab308` | Warning state |
| `status-error`   | `#ef4444` | Error state   |
| `status-info`    | `#3b82f6` | Info state    |

### 4.6 Score Colors

| Token             | Value     | Usage       |
| ----------------- | --------- | ----------- |
| `score-excellent` | `#22c55e` | 90+ score   |
| `score-good`      | `#3b82f6` | 80-89 score |
| `score-fair`      | `#eab308` | 70-79 score |
| `score-poor`      | `#ef4444` | <70 score   |

### 4.7 Color Rules

1. **No hardcoded hex values in components.** Always use tokens.
2. **No custom color palettes.** The token system is the palette.
3. **Dark mode is default.** Light mode is optional and must be designed separately if added.
4. **Contrast ratios.** All text must meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text).

---

## 5. Typography

### 5.1 Font Families

| Token       | Value                     | Usage                   |
| ----------- | ------------------------- | ----------------------- |
| `font-sans` | Inter, system fonts       | All body text           |
| `font-mono` | JetBrains Mono, monospace | Code, technical content |

Maximum two font families. No exceptions. If a third family is needed, it must be approved through governance review.

### 5.2 Font Sizes

| Token       | Value | Tailwind    | Usage            |
| ----------- | ----- | ----------- | ---------------- |
| `text-xs`   | 12px  | `text-xs`   | Labels, captions |
| `text-sm`   | 14px  | `text-sm`   | Secondary text   |
| `text-base` | 16px  | `text-base` | Body text        |
| `text-lg`   | 18px  | `text-lg`   | Emphasized body  |
| `text-xl`   | 20px  | `text-xl`   | Subheadings      |
| `text-2xl`  | 24px  | `text-2xl`  | Section headings |
| `text-3xl`  | 30px  | `text-3xl`  | Page titles      |

### 5.3 Typography Rules

1. **Tight letter-spacing for headings.** `-0.02em` for headings creates a cleaner look.
2. **Clear hierarchy.** Every page must have a visible size hierarchy. No two adjacent text elements at the same size.
3. **No decorative fonts.** Inter and JetBrains Mono only. If a project needs a display font, it must be justified and approved.
4. **Maximum line length.** Body text should not exceed 70 characters per line for readability.

---

## 6. Spacing System

### 6.1 Base Unit

The base unit is **4px**. All spacing is a multiple of 4.

### 6.2 Spacing Scale

| Token      | Value | Tailwind         |
| ---------- | ----- | ---------------- |
| `space-0`  | 0     | `p-0`, `m-0`     |
| `space-1`  | 4px   | `p-1`, `gap-1`   |
| `space-2`  | 8px   | `p-2`, `gap-2`   |
| `space-3`  | 12px  | `p-3`, `gap-3`   |
| `space-4`  | 16px  | `p-4`, `gap-4`   |
| `space-5`  | 20px  | `p-5`, `gap-5`   |
| `space-6`  | 24px  | `p-6`, `gap-6`   |
| `space-8`  | 32px  | `p-8`, `gap-8`   |
| `space-10` | 40px  | `p-10`, `gap-10` |
| `space-12` | 48px  | `p-12`, `gap-12` |

### 6.3 Spacing Rules

1. **No arbitrary values.** Use tokens, not pixel values.
2. **Consistent component padding.** Cards use `p-6`, inputs use `p-3`, buttons use `p-2`.
3. **Consistent gaps.** `gap-3` for related items, `gap-6` for sections, `gap-8` for page sections.
4. **No negative margins.** Use flexbox or grid for layout adjustments.

---

## 7. Component Standards

### 7.1 Accessibility

Every component must be accessible:

1. **Keyboard navigation.** All interactive elements must be keyboard accessible.
2. **Focus indicators.** Visible focus ring on all focusable elements using `border-focus`.
3. **ARIA labels.** Icon-only buttons must have `aria-label`.
4. **Screen reader support.** Semantic HTML, proper heading hierarchy, alt text for images.
5. **Color independence.** Status must not be conveyed by color alone (use icons or text alongside color).

### 7.2 Responsiveness

Every component must work at all breakpoints:

| Breakpoint | Width  | Layout                        |
| ---------- | ------ | ----------------------------- |
| Mobile     | 375px  | Single column, stacked        |
| Tablet     | 768px  | Two columns where appropriate |
| Desktop    | 1024px | Full layout                   |
| Wide       | 1440px | Max-width container           |

**Rules:**

- Mobile-first design approach
- Sidebar collapses to hamburger on mobile
- Grid layouts adapt: 3-col → 2-col → 1-col
- No horizontal scrolling at any breakpoint

### 7.3 Dark Mode

Dark mode is the default. All components are designed for dark backgrounds first.

- `bg-primary` (`#0a0a0a`) is the default background
- Light mode is optional and must use separate token mappings
- Components must not assume a specific background color

### 7.4 Component Variants

Components use variants, not separate components, for stylistic differences:

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
<Button variant="danger">Delete</Button>
```

**Standard variants:** primary, secondary, ghost, danger
**Standard sizes:** sm, md, lg

---

## 8. Elevation

### 8.1 Border-Based Elevation

Use subtle borders instead of box-shadows for default elevation. Reserve shadows for overlays.

| Level   | Treatment                    | Usage               |
| ------- | ---------------------------- | ------------------- |
| Level 0 | No border, no shadow         | Inline content      |
| Level 1 | `1px solid border-primary`   | Cards, containers   |
| Level 2 | `1px solid border-secondary` | Emphasized cards    |
| Level 3 | `shadow-md`                  | Dropdowns, popovers |
| Level 4 | `shadow-lg`                  | Modals, dialogs     |
| Level 5 | `shadow-xl`                  | Tooltips            |

### 8.2 Elevation Rules

1. **Borders for structure.** Use borders to define layout hierarchy.
2. **Shadows for overlays.** Use shadows only when content floats above the page.
3. **No gratuitous shadows.** Every shadow must serve a purpose.

---

## 9. Motion

### 9.1 Motion Principles

Motion is meaningful, not decorative. Every animation must serve one of these purposes:

1. **Feedback.** Confirming an action (button click, form submission).
2. **Orientation.** Showing where something came from or went (page transition, modal open).
3. **Progress.** Indicating loading or completion (skeleton shimmer, progress bar).
4. **Focus.** Drawing attention to something important (new notification, error state).

### 9.2 Motion Tokens

| Token               | Value      | Usage                        |
| ------------------- | ---------- | ---------------------------- |
| `transition-fast`   | 150ms ease | Button hover, focus ring     |
| `transition-normal` | 200ms ease | Page transitions, modal open |
| `transition-slow`   | 300ms ease | Complex animations           |

### 9.3 Motion Rules

1. **150ms default.** Most transitions use 150ms ease-out.
2. **Respect reduced motion.** All animations must respect `prefers-reduced-motion: reduce`.
3. **No animation for decoration.** If an animation does not serve feedback, orientation, progress, or focus, it is removed.
4. **No wobble, bounce, or elastic effects.** These are playful but distracting. Bhavya Foundation's design is calm and focused.
5. **No animation on page load.** Content appears immediately. Animations are for interactions, not arrivals.

---

## 10. What We Never Do

These are absolute prohibitions. They are not guidelines — they are boundaries that define Bhavya Foundation's design identity.

### 10.1 No Glassmorphism Everywhere

Glassmorphism (frosted glass, backdrop-blur) is used sparingly and only for overlays (modals, dropdowns). It is never applied to cards, containers, or page-level elements. It creates visual noise and reduces readability.

### 10.2 No Dashboard Clutter

Dashboards are not information dumps. Every metric on a dashboard must answer a question the user is actually asking. If a metric does not inform a decision, it is removed. Dashboards follow the "5-second rule": a user should understand the state of their system within 5 seconds of looking at the dashboard.

### 10.3 No AI-Generated Templates

Bhavya Foundation does not use AI-generated design templates. Templates are designed by humans who understand the mission, the users, and the context. AI generates content; humans design experiences.

### 10.4 No Trend-Chasing

If a design trend (neomorphism, glassmorphism, brutalism, bento grids) does not serve the user, it is not adopted. Trends are temporary. Clarity is permanent.

### 10.5 No Gratuitous Complexity

Every element on screen must earn its place. If an element does not help the user complete their task, it is removed. White space is not wasted space — it is breathing room.

### 10.6 No Stock Photography

Real images of real people and real places. Stock photography erodes trust. If a photo cannot be taken, an illustration or diagram is used instead.

---

## 11. Evidence-First Design

### 11.1 Design Decisions Are Research-Backed

Every design pattern in this system is extracted from analysis of successful products: Linear, Vercel, GitHub, Raycast, Notion, and shadcn/ui. These are not arbitrary choices — they are evidence-based decisions.

### 11.2 Research Sources

| Pattern                | Source           | Evidence                                             |
| ---------------------- | ---------------- | ---------------------------------------------------- |
| Dark mode first        | Linear, Raycast  | Reduced eye strain, modern aesthetic                 |
| Border-based elevation | Linear           | Cleaner than shadows, more consistent                |
| 4px spacing grid       | Tailwind, GitHub | Consistent rhythm, predictable layout                |
| Inter font             | Vercel, Linear   | Readability at small sizes, tight metrics            |
| 150ms transitions      | Apple HIG        | Fast enough to feel instant, slow enough to register |
| Command palette        | Linear, Raycast  | Power user efficiency, keyboard-first workflow       |

### 11.3 Design Changes Require Evidence

Before changing any design pattern, the team must:

1. Identify the problem the change solves
2. Gather evidence that the current pattern is insufficient
3. Propose an alternative with rationale
4. Validate through user testing or A/B testing
5. Document the decision

---

## 12. Component Catalog

The canonical component library is `@bhavya/platform-ui`. All applications must use these components. Custom foundational components are not permitted.

### 12.1 Available Components

**Layout:** AppLayout
**Primitives:** Button, Card, Badge, Avatar
**Navigation:** Breadcrumb, Tabs
**Feedback:** EmptyState, Toast, Modal
**Loading:** Skeleton, LoadingSpinner
**Data Display:** StatCard, StatusBadge, DataTable
**Forms:** SearchBar

### 12.2 Component Rules

1. **Check first.** Before building a component, check the catalog. If it exists, use it.
2. **Extend, don't replace.** If a component is close but not exact, extend it through props or composition.
3. **Contribute upstream.** If you build a component that should be shared, contribute it to `@bhavya/platform-ui`.
4. **No inline styles.** All styling uses tokens and Tailwind classes.
5. **No inline design tokens.** All tokens are defined in `tokens.css`.

---

## 13. Responsive Grid System

### 13.1 Grid Breakpoints

| Breakpoint       | Columns | Gutter | Margin           |
| ---------------- | ------- | ------ | ---------------- |
| Mobile (375px)   | 4       | 16px   | 16px             |
| Tablet (768px)   | 8       | 16px   | 24px             |
| Desktop (1024px) | 12      | 24px   | 32px             |
| Wide (1440px)    | 12      | 24px   | Auto (max-width) |

### 13.2 Grid Rules

1. **Always use the grid.** Never use arbitrary widths for page layout.
2. **Content max-width.** Text content should not exceed 720px for readability.
3. **Sidebar width.** Standard sidebar is 240px collapsed to 64px.
4. **Card width.** Cards span full grid column width in their container.

---

## 14. Accessibility Standards

### 14.1 WCAG 2.1 AA Compliance

Bhavya Foundation targets WCAG 2.1 AA compliance for all interfaces:

1. **Contrast:** 4.5:1 for normal text, 3:1 for large text
2. **Keyboard:** All interactive elements keyboard accessible
3. **Focus:** Visible focus indicators on all focusable elements
4. **Labels:** All form inputs have labels (visible or aria-label)
5. **Alt text:** All meaningful images have alt text
6. **Heading hierarchy:** Proper h1 → h2 → h3 nesting
7. **Skip links:** Skip to main content link on all pages

### 14.2 Testing

- Automated: axe-core in CI pipeline
- Manual: Keyboard-only navigation testing quarterly
- User testing: Screen reader testing with real users annually

---

## 15. Constitutional Authority

This document is the single source of truth for design decisions at Bhavya Foundation. All visual design, interaction design, and user experience decisions must trace back to this constitution.

When this constitution conflicts with a library's default styling, this constitution wins. Libraries provide tools; this constitution provides standards.

When this constitution is silent on a matter, the team follows the existing patterns in `@bhavya/platform-ui`. When no pattern exists, the team proposes one through the BEE 2.0 process.

---

**Amendment Process:** Amendments require documented rationale, design review, and governance approval. No amendment may reduce accessibility standards below WCAG 2.1 AA. No amendment may introduce new font families, color palettes, or spacing systems without full token system integration.
