# Design System — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Overview

The complete design system for Bhavya AI Institute. Built on existing platform capabilities. No foundational components created from scratch.

---

## Design Principles

1. **Learning-first** — Every pixel serves education
2. **Warm & encouraging** — Not cold or corporate
3. **Progressive complexity** — Reveal gradually
4. **Consistent** — Same patterns everywhere
5. **Accessible** — WCAG 2.1 AA compliant

---

## Color System

### Brand Colors

| Color        | Hex     | Usage                     |
| ------------ | ------- | ------------------------- |
| Forest Green | #1a3a2a | Primary, headers, buttons |
| Gold         | #c9a227 | Accents, badges, CTAs     |
| Earth        | #8a7359 | Secondary actions         |

### Neutral Colors

| Color     | Hex     | Usage             |
| --------- | ------- | ----------------- |
| Cream     | #f5f1e6 | Page background   |
| Parchment | #f0ebe0 | Card background   |
| Sand      | #e8e0d4 | Borders, dividers |
| Charcoal  | #2d2d2d | Primary text      |
| Warm Gray | #6b6b6b | Secondary text    |
| Slate     | #4a4a4a | Body text         |

### Status Colors

| Color   | Hex     | Usage                |
| ------- | ------- | -------------------- |
| Success | #2d7a4f | Complete, correct    |
| Warning | #b8860b | Caution, in-progress |
| Error   | #c0392b | Error, incorrect     |
| Info    | #2c5aa0 | Informational        |

### Mastery Colors

| Color       | Hex     | Usage   |
| ----------- | ------- | ------- |
| Mastered    | #2d7a4f | 90-100% |
| Proficient  | #b8860b | 70-89%  |
| Developing  | #c9a227 | 50-69%  |
| Attempting  | #c0392b | 1-49%   |
| Not Started | #6b6b6b | 0%      |

---

## Typography

### Font Families

```css
/* Headlines */
font-family: "Playfair Display", Georgia, serif;

/* Body */
font-family:
  "Inter",
  -apple-system,
  sans-serif;

/* Code */
font-family: "JetBrains Mono", "Fira Code", monospace;
```

### Type Scale

| Name    | Size | Weight | Line Height | Usage              |
| ------- | ---- | ------ | ----------- | ------------------ |
| display | 48px | 700    | 1.1         | Hero headlines     |
| h1      | 36px | 700    | 1.2         | Page titles        |
| h2      | 28px | 600    | 1.3         | Section headers    |
| h3      | 22px | 600    | 1.4         | Card titles        |
| h4      | 18px | 600    | 1.4         | Subsection headers |
| body    | 16px | 400    | 1.6         | Body text          |
| small   | 14px | 400    | 1.5         | Captions, labels   |
| xs      | 12px | 400    | 1.4         | Tags, badges       |

---

## Spacing System

| Token | Value | Usage           |
| ----- | ----- | --------------- |
| xs    | 4px   | Inline spacing  |
| sm    | 8px   | Tight spacing   |
| md    | 16px  | Default spacing |
| lg    | 24px  | Section spacing |
| xl    | 32px  | Large sections  |
| 2xl   | 48px  | Page sections   |
| 3xl   | 64px  | Major sections  |

---

## Border Radius

| Token | Value  | Usage           |
| ----- | ------ | --------------- |
| none  | 0px    | Sharp edges     |
| sm    | 4px    | Buttons, inputs |
| md    | 8px    | Cards, modals   |
| lg    | 12px   | Large cards     |
| xl    | 16px   | Hero sections   |
| full  | 9999px | Circles, pills  |

---

## Shadows

| Token | Value                        | Usage            |
| ----- | ---------------------------- | ---------------- |
| none  | none                         | Flat elements    |
| sm    | 0 1px 2px rgba(0,0,0,0.05)   | Subtle elevation |
| md    | 0 4px 6px rgba(0,0,0,0.1)    | Cards, dropdowns |
| lg    | 0 10px 15px rgba(0,0,0,0.1)  | Modals, popovers |
| xl    | 0 20px 25px rgba(0,0,0,0.15) | Hero sections    |

---

## Component Tokens

### Buttons

```css
/* Primary */
.btn-primary {
  background: #1a3a2a;
  color: #f5f1e6;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 150ms;
}

.btn-primary:hover {
  background: #15301f;
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: #1a3a2a;
  border: 2px solid #1a3a2a;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 150ms;
}

/* CTA */
.btn-cta {
  background: #c9a227;
  color: #2d2d2d;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 150ms;
}

.btn-cta:hover {
  background: #b8960b;
  transform: scale(1.02);
}
```

### Cards

```css
.card {
  background: #f0ebe0;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  padding: 24px;
  transition: all 150ms;
}

.card:hover {
  border-color: #c9a227;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Inputs

```css
.input {
  background: #f5f1e6;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 150ms;
}

.input:focus {
  outline: none;
  border-color: #c9a227;
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.2);
}

.input.error {
  border-color: #c0392b;
}

.input.success {
  border-color: #2d7a4f;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #d4edda;
  color: #2d7a4f;
}

.badge-warning {
  background: #fff3cd;
  color: #b8860b;
}

.badge-error {
  background: #f8d7da;
  color: #c0392b;
}

.badge-info {
  background: #d1ecf1;
  color: #2c5aa0;
}
```

---

## Layout System

### Grid

```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

### Flex

```css
.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-col {
  flex-direction: column;
}
```

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-narrow {
  max-width: 800px;
}

.container-wide {
  max-width: 1440px;
}
```

---

## Responsive Breakpoints

| Name    | Width      | Layout              |
| ------- | ---------- | ------------------- |
| mobile  | < 640px    | Single column       |
| tablet  | 640-1024px | Two columns         |
| desktop | > 1024px   | Full layout         |
| wide    | > 1440px   | Max-width container |

---

## Accessibility

### Focus

```css
:focus-visible {
  outline: 2px solid #c9a227;
  outline-offset: 2px;
}
```

### Screen Reader

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animation Tokens

```css
/* Transitions */
transition-fast: 150ms;
transition-normal: 200ms;
transition-slow: 300ms;

/* Easing */
ease-in: cubic-bezier(0.4, 0, 1, 1);
ease-out: cubic-bezier(0, 0, 0.2, 1);
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Component Inventory

### Existing (Use As-Is)

| Component      | Package        | Usage               |
| -------------- | -------------- | ------------------- |
| Button         | platform-ui    | CTAs, actions       |
| Card           | platform-ui    | Content containers  |
| Badge          | platform-ui    | Status indicators   |
| Avatar         | platform-ui    | User representation |
| Breadcrumb     | platform-ui    | Navigation          |
| DataTable      | platform-ui    | Data display        |
| Sidebar        | platform-ui    | Navigation          |
| Toast          | platform-ui    | Notifications       |
| Tabs           | platform-ui    | Content switching   |
| StatusBadge    | platform-ui    | Status display      |
| StatCard       | platform-ui    | Metrics             |
| Skeleton       | platform-ui    | Loading states      |
| SearchBar      | platform-ui    | Search              |
| PageLayout     | platform-ui    | Page structure      |
| AppLayout      | platform-ui    | App shell           |
| LoadingState   | platform-ui    | Loading indicators  |
| Reveal         | website/motion | Scroll reveals      |
| Stagger        | website/motion | List animations     |
| TiltCard       | website/motion | Premium cards       |
| MagneticButton | website/motion | CTAs                |
| TextReveal     | website/motion | Headlines           |
| SkipNavigation | website        | Accessibility       |

### To Create

| Component        | Priority | Foundation |
| ---------------- | -------- | ---------- |
| ChatMessage      | HIGH     | Card       |
| CodeEditor       | HIGH     | Monaco     |
| GraphNode        | MEDIUM   | SVG        |
| QuizQuestion     | HIGH     | Card       |
| ProgressBar      | MEDIUM   | SVG        |
| LessonSection    | HIGH     | Markdown   |
| LabWorkspace     | HIGH     | SplitPane  |
| SkillRadar       | MEDIUM   | SVG        |
| TimelineView     | MEDIUM   | Custom     |
| AchievementBadge | LOW      | Badge      |

---

## Design Tokens Reference

```typescript
export const tokens = {
  colors: {
    forest: "#1a3a2a",
    gold: "#c9a227",
    earth: "#8a7359",
    cream: "#f5f1e6",
    parchment: "#f0ebe0",
    sand: "#e8e0d4",
    charcoal: "#2d2d2d",
    warmGray: "#6b6b6b",
    slate: "#4a4a4a",
    success: "#2d7a4f",
    warning: "#b8860b",
    error: "#c0392b",
    info: "#2c5aa0",
  },
  typography: {
    display: { size: "48px", weight: 700, lineHeight: 1.1 },
    h1: { size: "36px", weight: 700, lineHeight: 1.2 },
    h2: { size: "28px", weight: 600, lineHeight: 1.3 },
    h3: { size: "22px", weight: 600, lineHeight: 1.4 },
    h4: { size: "18px", weight: 600, lineHeight: 1.4 },
    body: { size: "16px", weight: 400, lineHeight: 1.6 },
    small: { size: "14px", weight: 400, lineHeight: 1.5 },
    xs: { size: "12px", weight: 400, lineHeight: 1.4 },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  borderRadius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.15)",
  },
};
```

---

## Usage Guidelines

### Do

- Use existing components
- Follow color system
- Use type scale
- Maintain spacing
- Ensure accessibility
- Test responsive

### Don't

- Create new foundational components
- Use inline styles
- Skip focus states
- Ignore reduced motion
- Use decorative animations
- Hardcode values

---

_The design system is built on existing platform capabilities. No foundational components are created from scratch._
