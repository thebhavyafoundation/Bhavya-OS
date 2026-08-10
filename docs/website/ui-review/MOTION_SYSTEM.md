# Motion System

## Current State

The Bhavya Foundation website has no motion system:

- No animations
- No transitions
- No micro-interactions
- No page transitions

**Maturity: 1/10**

## Elite Website Motion Patterns

### Vercel

- **Page transitions:** Fade + slide
- **Hover effects:** Subtle scale + shadow
- **Loading:** Skeleton screens
- **Scroll:** Parallax on hero

### Linear

- **Page transitions:** Smooth fade
- **Hover effects:** Scale + border glow
- **Loading:** Spinner + skeleton
- **Scroll:** Fade-in on scroll
- **Animations:** Product illustration animations

### Anthropic

- **Page transitions:** Fade
- **Hover effects:** Subtle scale
- **Loading:** Minimal
- **Scroll:** Word-by-word animation on hero

### Stripe

- **Page transitions:** Fade
- **Hover effects:** Scale + shadow
- **Loading:** Skeleton screens
- **Scroll:** Parallax on hero

## Recommended Bhavya Foundation Motion System

### Principles

1. **Purposeful:** Every animation serves a purpose
2. **Subtle:** Never distract from content
3. **Respectful:** Honor `prefers-reduced-motion`
4. **Performant:** Use transforms and opacity only
5. **Consistent:** Same timing for same actions

### Timing Tokens

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Motion Catalog

#### 1. Fade In (Scroll)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn var(--duration-slow) var(--ease-out) forwards;
}
```

#### 2. Scale on Hover

```css
.hover-scale {
  transition: transform var(--duration-fast) var(--ease-out);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

#### 3. Shadow on Hover

```css
.hover-shadow {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

.hover-shadow:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
```

#### 4. Border Glow

```css
.hover-glow {
  transition:
    border-color var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.hover-glow:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}
```

#### 5. Page Transition

```css
@keyframes pageIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

main {
  animation: pageIn var(--duration-normal) var(--ease-out);
}
```

#### 6. Skeleton Loading

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 25%,
    var(--color-bg-tertiary) 50%,
    var(--color-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### 7. Word Animation (Hero)

```css
@keyframes wordIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.word-animate {
  display: inline-block;
  opacity: 0;
  animation: wordIn 800ms var(--ease-out) forwards;
}

.word-animate:nth-child(1) {
  animation-delay: 0ms;
}
.word-animate:nth-child(2) {
  animation-delay: 100ms;
}
.word-animate:nth-child(3) {
  animation-delay: 200ms;
}
```

#### 8. Stagger Children

```css
@keyframes staggerIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-children > * {
  opacity: 0;
  animation: staggerIn var(--duration-slow) var(--ease-out) forwards;
}

.stagger-children > *:nth-child(1) {
  animation-delay: 0ms;
}
.stagger-children > *:nth-child(2) {
  animation-delay: 100ms;
}
.stagger-children > *:nth-child(3) {
  animation-delay: 200ms;
}
.stagger-children > *:nth-child(4) {
  animation-delay: 300ms;
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
    scroll-behavior: auto !important;
  }
}
```

## Implementation Priority

| Animation         | Priority | Effort |
| ----------------- | -------- | ------ |
| Fade in on scroll | P0       | Medium |
| Hover scale       | P0       | Low    |
| Hover shadow      | P0       | Low    |
| Page transition   | P1       | Low    |
| Skeleton loading  | P1       | Medium |
| Word animation    | P2       | Medium |
| Stagger children  | P2       | Low    |
| Border glow       | P2       | Low    |
