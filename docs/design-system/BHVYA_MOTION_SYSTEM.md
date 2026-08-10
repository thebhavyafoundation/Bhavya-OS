# BHAVYA MOTION SYSTEM

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Design
**Last updated:** 2026-08-10
**Applies To:** All Bhavya Foundation animation and motion

---

## Motion Principles

1. **Organic Over Mechanical** — Use natural easing curves
2. **Calm Over Energetic** — Subtle, not jarring
3. **Cinematic Over Decorative** — Tell stories with motion
4. **Purposeful** — Every animation needs a reason
5. **Accessible** — Respect `prefers-reduced-motion`

---

## Easing Curves

```css
/* Primary — smooth deceleration */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Secondary — smooth acceleration/deceleration */
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);

/* Spring — bouncy, playful */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### When to Use

| Curve           | Use Case                                             |
| --------------- | ---------------------------------------------------- |
| `--ease-out`    | Elements entering viewport, reveals, transitions     |
| `--ease-in-out` | Elements moving within viewport, looping             |
| `--ease-spring` | Interactive feedback, hover states, playful elements |

---

## Duration Tokens

```css
--duration-fast: 150ms; /* Micro-interactions, hover */
--duration-normal: 250ms; /* Standard transitions */
--duration-slow: 400ms; /* Page transitions, reveals */
--duration-slower: 600ms; /* Hero animations, cinematic */
```

---

## Motion Primitives

### Reveal

Entrance animations for elements entering the viewport.

```tsx
import { Reveal } from "@/components/motion";

<Reveal direction="up" delay={0.1}>
  <h2>Content appears on scroll</h2>
</Reveal>;
```

**Directions:** `up`, `down`, `left`, `right`, `fade`, `scale`

### TextReveal

Word-by-word entrance animation for headings.

```tsx
import { TextReveal } from "@/components/motion";

<TextReveal delay={0.2}>Editorial Heading Text</TextReveal>;
```

### Parallax

Depth-based scroll effects.

```tsx
import { Parallax } from "@/components/motion";

<Parallax speed={0.3}>
  <img src="/hero.jpg" alt="Hero" />
</Parallax>;
```

### Stagger

Sequential animation of child elements.

```tsx
import { Stagger } from "@/components/motion";

<Stagger staggerChildren={0.1}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stagger>;
```

### NumberReveal

Animated counter that counts up from 0.

```tsx
import { NumberReveal } from "@/components/motion";

<NumberReveal value={230} suffix="+" label="Hectares Restored" />;
```

### ScrollProgress

Visual scroll position indicator.

```tsx
import { ScrollProgress } from "@/components/motion";

<ScrollProgress />;
```

### MagneticButton

Cursor-following interactive button.

```tsx
import { MagneticButton } from "@/components/motion";

<MagneticButton>
  <span>Hover me</span>
</MagneticButton>;
```

### ImageReveal

Image masking/transition animation.

```tsx
import { ImageReveal } from "@/components/motion";

<ImageReveal>
  <img src="/photo.jpg" alt="Revealed on scroll" />
</ImageReveal>;
```

---

## Page Transitions

Use Framer Motion `AnimatePresence` for route transitions.

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function Layout({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Scroll-Linked Animations

Use Framer Motion `useScroll` + `useTransform` for scroll-linked effects.

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={ref}>
      <motion.div style={{ y }}>Parallax content</motion.div>
    </section>
  );
}
```

---

## Reduced Motion

Always respect user preference:

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

```tsx
import { useReducedMotion } from "framer-motion";

export function SafeMotion({ children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Skill Routing

| Task                | Skill                                     | Reason                            |
| ------------------- | ----------------------------------------- | --------------------------------- |
| Motion architecture | gsap-core, gsap-react, gsap-scrolltrigger | GSAP for timeline choreography    |
| React motion        | frontend-patterns                         | Framer Motion integration         |
| CSS animations      | coding-standards                          | Native CSS for simple transitions |
| Performance         | gsap-performance                          | Animation performance             |
| Accessibility       | coding-standards                          | Reduced motion support            |

---

## Anti-Patterns

### DO NOT

- Meaningless animation (animation for animation's sake)
- Jarring transitions (linear easing, fast cuts)
- Over-animating (everything moving at once)
- Ignoring reduced motion
- Blocking scroll with animations
- Using animation as content substitute

### DO

- Use natural easing curves
- Stagger child elements
- Respect scroll position
- Provide reduced motion fallback
- Test at 60fps
- Use animation to guide attention

---

## File Locations

| File              | Path                                          |
| ----------------- | --------------------------------------------- |
| Design Tokens     | `packages/platform-ui/src/styles/tokens.css`  |
| Motion Components | `apps/ai-institute/src/components/motion/`    |
| Web Experience    | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md` |
| This Document     | `docs/design-system/BHVYA_MOTION_SYSTEM.md`   |
