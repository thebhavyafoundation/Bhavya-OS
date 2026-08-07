# UI System — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Design Philosophy

**"World-class learning experience, not a dashboard."**

Every pixel serves education. Every interaction improves learning. Every motion has purpose.

---

## Component Architecture

### Layer 1: Design Tokens (Existing)

**Source:** `packages/design-system/src/tokens.ts` + `packages/platform-ui/src/styles/tokens.css`

```typescript
// Colors
const colors = {
  // Brand
  forest: "#1a3a2a", // Primary, headers, buttons
  gold: "#c9a227", // Accents, badges, CTAs
  earth: "#8a7359", // Secondary actions

  // Background
  cream: "#f5f1e6", // Page background
  parchment: "#f0ebe0", // Card background
  sand: "#e8e0d4", // Borders, dividers

  // Text
  charcoal: "#2d2d2d", // Primary text
  warmGray: "#6b6b6b", // Secondary text
  slate: "#4a4a4a", // Body text

  // Status
  success: "#2d7a4f", // Complete, correct
  warning: "#b8860b", // Caution, in-progress
  error: "#c0392b", // Error, incorrect
  info: "#2c5aa0", // Informational

  // Mastery (for knowledge graph)
  mastered: "#2d7a4f", // Green
  learning: "#b8860b", // Gold
  notStarted: "#6b6b6b", // Gray
};
```

### Layer 2: Platform-UI Components (Existing)

**Source:** `packages/platform-ui/src/`

| Component    | Usage               | Customization                |
| ------------ | ------------------- | ---------------------------- |
| Button       | CTAs, actions       | variant, size, loading       |
| Card         | Content containers  | hover, padding, onClick      |
| Badge        | Status indicators   | variant, size, dot           |
| Avatar       | User representation | name, src, size              |
| Breadcrumb   | Navigation          | items, separator             |
| DataTable    | Data display        | columns, data, onRowClick    |
| Sidebar      | Navigation          | brand, items, collapsed      |
| Toast        | Notifications       | message, type, duration      |
| Tabs         | Content switching   | tabs, activeTab, onChange    |
| StatusBadge  | Status display      | label, variant, size         |
| StatCard     | Metrics             | label, value, trend          |
| Skeleton     | Loading states      | variant, width, height       |
| SearchBar    | Search              | placeholder, value, debounce |
| PageLayout   | Page structure      | brand, sidebarItems, title   |
| AppLayout    | App shell           | sidebar, children            |
| LoadingState | Loading indicators  | size, color                  |

### Layer 3: Motion Components (Existing)

**Source:** `apps/website/src/components/motion/`

| Component       | Animation                       | Usage           |
| --------------- | ------------------------------- | --------------- |
| Reveal          | fade/slide/scale/blur on scroll | Section reveals |
| Stagger         | Staggered children animation    | List items      |
| TiltCard        | 3D tilt + glare                 | Premium cards   |
| MagneticButton  | Spring cursor follow            | CTAs            |
| FloatingElement | Infinite oscillation            | Decorative      |
| Parallax        | Scroll-linked displacement      | Hero sections   |
| TextReveal      | Character-by-character reveal   | Headlines       |
| ScrollProgress  | Progress bar                    | Page progress   |
| SmoothScroll    | Lenis smooth scroll             | Page smoothness |

### Layer 4: Accessibility Utilities (Existing)

**Source:** `packages/design-system/src/accessibility.ts`

| Utility                  | Purpose                   | WCAG  |
| ------------------------ | ------------------------- | ----- |
| focusRing()              | Keyboard focus indicators | 2.4.7 |
| focusRingClass()         | Tailwind focus class      | 2.4.7 |
| srOnly()                 | Screen reader content     | 1.3.1 |
| ariaLabel()              | ARIA labels               | 4.1.2 |
| ariaDescribedBy()        | ARIA descriptions         | 4.1.2 |
| ariaLive()               | Live regions              | 4.1.3 |
| contrastRatio()          | Color contrast            | 1.4.3 |
| isAccessible()           | WCAG compliance check     | 1.4.3 |
| suggestAccessibleColor() | Color suggestions         | 1.4.3 |
| handleKeyboard()         | Keyboard handlers         | 2.1.1 |
| createFocusTrap()        | Focus trapping            | 2.4.3 |

---

## New Components (To Create)

### Tier 1: Core Learning Components

| Component     | Purpose              | Foundation       |
| ------------- | -------------------- | ---------------- |
| ChatMessage   | AI Mentor messages   | Card + animation |
| CodeEditor    | In-browser coding    | Monaco wrapper   |
| CodeOutput    | Execution output     | Pre + streaming  |
| GraphNode     | Knowledge graph node | SVG + D3         |
| GraphEdge     | Knowledge graph edge | SVG + D3         |
| QuizQuestion  | Assessment question  | Card + form      |
| ProgressBar   | Learning progress    | SVG circle/line  |
| LessonSection | Content section      | Markdown + code  |
| LabWorkspace  | Interactive lab      | Split pane       |

### Tier 2: Navigation Components

| Component       | Purpose           | Foundation        |
| --------------- | ----------------- | ----------------- |
| CourseSidebar   | Course navigation | Sidebar           |
| ModuleAccordion | Module list       | Accordion         |
| LessonNav       | Lesson navigation | Button group      |
| BreadcrumbTrail | Deep navigation   | Breadcrumb        |
| SearchOverlay   | Command palette   | Modal + SearchBar |

### Tier 3: Data Display Components

| Component        | Purpose              | Foundation           |
| ---------------- | -------------------- | -------------------- |
| SkillRadar       | Skills visualization | SVG radar chart      |
| TimelineView     | Learning timeline    | Custom + animation   |
| AchievementBadge | Badge display        | Badge + animation    |
| HeatMap          | Activity heatmap     | SVG grid             |
| StatCounter      | Animated counter     | StatCard + animation |

### Tier 4: Layout Components

| Component        | Purpose              | Foundation      |
| ---------------- | -------------------- | --------------- |
| SplitPane        | Resizable panels     | CSS grid        |
| TabbedPanel      | Tabbed interface     | Tabs            |
| CollapsiblePanel | Collapsible sections | CSS + animation |
| FullScreenMode   | Focused learning     | CSS fullscreen  |
| ResponsiveGrid   | Adaptive grid        | CSS grid        |

---

## Motion System

### Principles

1. **Purposeful** — Every animation teaches or guides
2. **Subtle** — Enhances, never distracts
3. **Fast** — 150-300ms maximum
4. **Consistent** — Same action = same animation
5. **Accessible** — Respects prefers-reduced-motion

### Animation Library

**Source:** Framer Motion (already installed)

```typescript
// Transitions
const transitions = {
  default: { duration: 0.2, ease: "easeInOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  gentle: { duration: 0.4, ease: "easeOut" },
  snappy: { duration: 0.15, ease: "easeIn" },
};

// Variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};
```

### Animation Catalog

| Animation    | Duration   | Usage                    |
| ------------ | ---------- | ------------------------ |
| fadeIn       | 200ms      | Page loads, reveals      |
| slideUp      | 200ms      | Content appearing        |
| slideRight   | 200ms      | Navigation, progress     |
| scaleIn      | 150ms      | Buttons, badges          |
| stagger      | 50ms delay | Lists, grids             |
| pulse        | 2s loop    | Notifications, streaks   |
| shake        | 300ms      | Errors, incorrect        |
| confetti     | 1s         | Celebrations, completion |
| typewriter   | 50ms/char  | AI Mentor typing         |
| progressFill | 500ms      | Progress bars            |

---

## Typography

### Font Stack

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

### Scale

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

## Color Application

### Backgrounds

| Surface  | Color             | Usage             |
| -------- | ----------------- | ----------------- |
| Page     | cream #f5f1e6     | Main background   |
| Card     | parchment #f0ebe0 | Card background   |
| Border   | sand #e8e0d4      | Dividers, borders |
| Elevated | white #ffffff     | Modals, dropdowns |

### Text

| Level     | Color            | Usage               |
| --------- | ---------------- | ------------------- |
| Primary   | charcoal #2d2d2d | Headlines, body     |
| Secondary | warmGray #6b6b6b | Captions, labels    |
| Muted     | slate #4a4a4a    | Disabled, hints     |
| Inverse   | cream #f5f1e6    | On dark backgrounds |

### Interactive

| State   | Color                 | Usage          |
| ------- | --------------------- | -------------- |
| Default | forest #1a3a2a        | Buttons, links |
| Hover   | forest-dark #15301f   | Button hover   |
| Active  | forest-darker #0f2517 | Button active  |
| Focus   | gold #c9a227          | Focus rings    |

### Status

| Status  | Color         | Usage                |
| ------- | ------------- | -------------------- |
| Success | green #2d7a4f | Complete, correct    |
| Warning | gold #b8860b  | Caution, in-progress |
| Error   | red #c0392b   | Error, incorrect     |
| Info    | blue #2c5aa0  | Informational        |

---

## Responsive Design

### Breakpoints

| Name    | Width      | Layout                           |
| ------- | ---------- | -------------------------------- |
| mobile  | < 640px    | Single column, bottom nav        |
| tablet  | 640-1024px | Two columns, collapsible sidebar |
| desktop | > 1024px   | Full layout, persistent sidebar  |
| wide    | > 1440px   | Max-width container              |

### Mobile-First Patterns

| Pattern              | Implementation             |
| -------------------- | -------------------------- |
| Bottom navigation    | Fixed bottom bar (5 items) |
| Swipe gestures       | Left/right for navigation  |
| Pull to refresh      | Refresh content            |
| Collapsible sections | Accordion for menus        |
| Full-width cards     | Stack vertically           |
| Hidden sidebar       | Off-canvas menu            |

---

## Accessibility

### WCAG 2.1 AA Compliance

| Requirement         | Implementation                         |
| ------------------- | -------------------------------------- |
| Color contrast      | 4.5:1 minimum (text), 3:1 (large text) |
| Keyboard navigation | Tab order, focus management            |
| Screen reader       | Semantic HTML, ARIA labels             |
| Focus indicators    | Visible focus rings                    |
| Text scaling        | 200% without breaking                  |
| Reduced motion      | prefers-reduced-motion                 |
| Captions            | All videos captioned                   |
| Alt text            | All images described                   |

### Focus Management

```typescript
// Focus trap for modals
const trapFocus = createFocusTrap(modalElement);

// Focus ring for interactive elements
const focusStyles = focusRing({
  offset: 2,
  color: 'gold',
  width: 2,
});

// Skip navigation
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Dark Mode (Future)

### Token Mapping

| Light             | Dark            |
| ----------------- | --------------- |
| cream #f5f1e6     | gray950 #0a0a0a |
| parchment #f0ebe0 | gray900 #171717 |
| sand #e8e0d4      | gray800 #262626 |
| charcoal #2d2d2d  | gray100 #f5f5f5 |
| warmGray #6b6b6b  | gray400 #a3a3a3 |

---

## Implementation Checklist

- [ ] Use existing platform-ui components
- [ ] Use existing design tokens
- [ ] Use existing accessibility utilities
- [ ] Use existing motion components
- [ ] Create Tier 1 components (9)
- [ ] Create Tier 2 components (5)
- [ ] Create Tier 3 components (5)
- [ ] Create Tier 4 components (5)
- [ ] Implement responsive layouts
- [ ] Implement keyboard navigation
- [ ] Implement screen reader support
- [ ] Implement reduced motion
- [ ] Test on mobile, tablet, desktop

---

_The UI system is built on existing platform capabilities. No foundational components are created from scratch._
