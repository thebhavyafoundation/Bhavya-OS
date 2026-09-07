# Bhavya Motion Specification

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This specification defines all motion patterns in Bhavya Foundation. Every animation must follow these rules. Motion is a first-class design capability, not an afterthought.

---

## Motion Principles

1. **Organic Over Mechanical** — Use natural easing curves
2. **Calm Over Energetic** — Subtle, not jarring
3. **Cinematic Over Decorative** — Tell stories with motion
4. **Purposeful** — Every animation needs a reason
5. **Accessible** — Respect `prefers-reduced-motion`

---

## Easing Curves

### Primary — Smooth Deceleration

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

**When to use:** Elements entering viewport, reveals, transitions

### Secondary — Smooth Acceleration/Deceleration

```css
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
```

**When to use:** Elements moving within viewport, looping

### Spring — Bouncy, Playful

```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

**When to use:** Interactive feedback, hover states, playful elements

---

## Duration Tokens

| Token               | Value | Usage                      |
| ------------------- | ----- | -------------------------- |
| `--duration-fast`   | 150ms | Micro-interactions, hover  |
| `--duration-normal` | 250ms | Standard transitions       |
| `--duration-slow`   | 400ms | Page transitions, reveals  |
| `--duration-slower` | 600ms | Hero animations, cinematic |

---

## Motion Primitives

### Reveal

Entrance animations for elements entering the viewport.

```tsx
import { Reveal } from "@bhavya/platform-ui/motion";

<Reveal direction="up" delay={0.1}>
  <h2>Content appears on scroll</h2>
</Reveal>;
```

**Directions:** `up`, `down`, `left`, `right`, `fade`, `scale`

**Props:**

- `direction`: Direction of reveal (default: `up`)
- `delay`: Delay in milliseconds (default: `0`)
- `duration`: Duration in milliseconds (default: `600`)
- `className`: Additional CSS classes

### TextReveal

Word-by-word entrance animation for headings.

```tsx
import { TextReveal } from "@bhavya/platform-ui/motion";

<TextReveal delay={0.2}>Editorial Heading Text</TextReveal>;
```

### FadeIn

Simple fade-in animation.

```tsx
import { FadeIn } from "@bhavya/platform-ui/motion";

<FadeIn delay={0.1}>
  <p>Content fades in</p>
</FadeIn>;
```

### SlideUp

Slide-up entrance animation.

```tsx
import { SlideUp } from "@bhavya/platform-ui/motion";

<SlideUp delay={0.1}>
  <p>Content slides up</p>
</SlideUp>;
```

### ScaleIn

Scale-in entrance animation.

```tsx
import { ScaleIn } from "@bhavya/platform-ui/motion";

<ScaleIn delay={0.1}>
  <p>Content scales in</p>
</ScaleIn>;
```

---

## CSS Animations

### Bhavya Reveal

```css
@keyframes bhavya-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bhavya-reveal {
  animation: bhavya-reveal 0.6s ease-out forwards;
}
```

### Bhavya Fade In

```css
@keyframes bhavya-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bhavya-fade-in {
  animation: bhavya-fade-in 0.3s ease-out forwards;
}
```

### Bhavya Slide Up

```css
@keyframes bhavya-slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bhavya-slide-up {
  animation: bhavya-slide-up 0.4s ease-out forwards;
}
```

### Bhavya Scale In

```css
@keyframes bhavya-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bhavya-scale-in {
  animation: bhavya-scale-in 0.3s ease-out forwards;
}
```

---

## Interaction States

### Hover

```css
/* Button hover */
.button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

/* Card hover */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}
```

### Focus

```css
/* Focus ring */
:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  transition: outline-offset var(--duration-fast) var(--ease-out);
}
```

### Active

```css
/* Button active */
.button:active {
  transform: translateY(0);
  transition: transform var(--duration-fast) var(--ease-out);
}
```

### Disabled

```css
/* Disabled state */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transition: opacity var(--duration-fast) var(--ease-out);
}
```

---

## Page Transitions

### Route Change

```css
/* Page enter */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page exit */
@keyframes page-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

### Modal

```css
/* Modal enter */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Modal backdrop enter */
@keyframes backdrop-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## Reduced Motion

All animations must respect `prefers-reduced-motion`:

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

**Implementation:**

- `Reveal` component checks `prefers-reduced-motion`
- CSS animations include `@media (prefers-reduced-motion: reduce)` fallback
- JavaScript animations use `window.matchMedia('(prefers-reduced-motion: reduce)')`

---

## Anti-Patterns

### Forbidden

- [ ] Random animations without purpose
- [ ] Jarring, fast animations
- [ ] Animations that block interaction
- [ ] Animations that cause vestibular disorders (spinning, flashing)
- [ ] Animations without `prefers-reduced-motion` support
- [ ] Animations using `layout` properties (trigger reflow)
- [ ] Animations that exceed 600ms (except hero)

### Required

- [ ] Every animation has a clear purpose
- [ ] Easing is natural
- [ ] Duration is appropriate
- [ ] Reduced motion is respected
- [ ] Animation uses `transform`/`opacity` only (GPU accelerated)

---

## Performance

### GPU Acceleration

Use `transform` and `opacity` for 60fps animations:

```css
/* ✅ GPU accelerated */
transform: translateY(20px);
opacity: 0;

/* ❌ Triggers layout */
margin-top: 20px;
width: 100px;
```

### Will-Change

Use `will-change` sparingly:

```css
/* Only when animation is about to happen */
.will-animate {
  will-change: transform, opacity;
}

/* Remove after animation */
.animated {
  will-change: auto;
}
```

---

## Verification

This specification is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
