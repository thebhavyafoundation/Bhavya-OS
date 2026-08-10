# Responsive Review

## Current State

The Bhavya Foundation website uses Starlight's responsive design:

- Basic mobile menu
- Responsive typography
- Basic grid system

**Maturity: 5/10**

## Elite Website Responsive Patterns

### Vercel

- **Mobile:** Full-screen navigation, optimized touch targets
- **Tablet:** Adapted layout, maintain readability
- **Desktop:** Full experience, hover effects
- **Large screens:** Max-width container

### Linear

- **Mobile:** Hamburger menu, stacked layout
- **Tablet:** Two-column layout
- **Desktop:** Full navigation, hover effects
- **Large screens:** Max-width container

### Notion

- **Mobile:** Simplified navigation, touch-friendly
- **Tablet:** Sidebar collapse
- **Desktop:** Full experience
- **Large screens:** Comfortable reading width

## Recommended Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Device-Specific Requirements

### Mobile (< 768px)

**Navigation:**

- Hamburger menu
- Full-screen overlay
- Touch-friendly targets (44px minimum)
- Bottom navigation for key actions

**Layout:**

- Single column
- Stacked content
- Full-width cards
- Reduced padding

**Typography:**

- Smaller display sizes
- Maintain readability
- Increase line height

**Touch:**

- 44px minimum touch targets
- No hover-dependent interactions
- Swipe gestures for carousels

### Tablet (768px - 1024px)

**Navigation:**

- Collapsed sidebar
- Top navigation
- Search accessible

**Layout:**

- Two-column grid
- Sidebar + content
- Adapted feature sections

**Typography:**

- Medium display sizes
- Comfortable reading

### Desktop (1024px - 1280px)

**Navigation:**

- Full sidebar
- Mega menu
- Keyboard shortcuts

**Layout:**

- Three-column grid
- Feature sections with images
- Side-by-side content

**Typography:**

- Full display sizes
- Optimal reading width

### Large Screens (> 1280px)

**Navigation:**

- Fixed sidebar
- Command palette

**Layout:**

- Max-width container (1280px)
- Centered content
- Generous whitespace

**Typography:**

- Full display sizes
- Comfortable line length

## Responsive Components

### Navigation

```css
/* Mobile */
@media (max-width: 768px) {
  .nav-sidebar {
    display: none;
  }

  .nav-hamburger {
    display: block;
  }

  .nav-overlay {
    position: fixed;
    inset: 0;
    background: var(--color-bg);
    z-index: 100;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav-sidebar {
    width: 250px;
  }

  .content {
    margin-left: 250px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .nav-sidebar {
    width: 300px;
  }

  .content {
    margin-left: 300px;
    max-width: calc(1280px - 300px);
  }
}
```

### Cards

```css
/* Mobile */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Typography

```css
/* Mobile */
@media (max-width: 768px) {
  :root {
    --text-display: 2.5rem;
    --text-h1: 2rem;
    --text-h2: 1.5rem;
  }

  .content {
    padding: 1rem;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --text-display: 3rem;
    --text-h1: 2.5rem;
    --text-h2: 2rem;
  }

  .content {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  :root {
    --text-display: 4rem;
    --text-h1: 3rem;
    --text-h2: 2.5rem;
  }

  .content {
    padding: 3rem;
  }
}
```

## Touch Targets

```css
/* Minimum touch target size */
button,
a,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Increase padding on mobile */
@media (max-width: 768px) {
  button,
  a {
    padding: 12px 16px;
  }
}
```

## Accessibility

```css
/* Focus states */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* High contrast */
@media (prefers-contrast: high) {
  :root {
    --color-border: #000;
    --color-text: #000;
    --color-bg: #fff;
  }
}
```

## Priority

| Task                  | Priority | Effort |
| --------------------- | -------- | ------ |
| Mobile navigation     | P0       | High   |
| Touch targets         | P0       | Low    |
| Responsive typography | P0       | Low    |
| Card grid responsive  | P1       | Low    |
| Sidebar responsive    | P1       | Medium |
| Table responsive      | P2       | Medium |
