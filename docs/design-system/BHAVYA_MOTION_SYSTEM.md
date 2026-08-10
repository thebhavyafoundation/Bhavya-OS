# Bhavya Motion System

## Design Philosophy

The Bhavya motion system embodies **organic, calm, cinematic** movement. Every animation should feel like nature — smooth, purposeful, and never jarring. Motion serves to guide attention, reveal content, and create emotional connection.

## Core Principles

### 1. Organic Over Mechanical

- Use easing curves that mimic natural motion (ease-out for entrances, ease-in for exits)
- Avoid linear motion except for continuous loops
- Stagger elements to create natural flow

### 2. Calm Over Energetic

- Default to subtle, understated animations
- Motion should enhance, not distract
- Respect user preferences (reduced-motion)

### 3. Cinematic Over Decorative

- Motion should tell a story or guide attention
- Every animation needs a purpose
- Create depth through layered reveals

## Animation Primitives

### Reveal

Entrance animation for elements entering viewport.

```tsx
import { Reveal } from "@/components/motion/Reveal";

<Reveal delay={0.1}>
  <div>Content to reveal</div>
</Reveal>;
```

**Props:**

- `delay?: number` — Delay before animation starts (default: 0)
- `duration?: number` — Animation duration in seconds (default: 0.6)
- `direction?: 'up' | 'down' | 'left' | 'right'` — Entrance direction
- `children: React.ReactNode`

**Implementation:**

- Uses framer-motion `motion.div`
- Animates opacity 0→1 and translateY/translateX
- Easing: `[0.25, 0.46, 0.45, 0.94]` (ease-out)
- Respects `prefers-reduced-motion`

### TextReveal

Word-by-word text entrance animation.

```tsx
import { TextReveal } from "@/components/motion/TextReveal";

<TextReveal text="Hello World" />;
```

**Props:**

- `text: string` — Text to animate
- `className?: string` — Optional CSS class
- `delay?: number` — Initial delay (default: 0)

**Implementation:**

- Splits text into words
- Staggers each word with 0.05s delay
- Uses framer-motion `motion.span`
- Handles mixed Chinese/English text

### Parallax

Depth-based scroll animation.

```tsx
import { Parallax } from "@/components/motion/Parallax";

<Parallax offset={50}>
  <div>Parallax content</div>
</Parallax>;
```

**Props:**

- `offset?: number` — Movement range in pixels (default: 30)
- `children: React.ReactNode`

**Implementation:**

- Uses framer-motion `useScroll` and `useTransform`
- Transforms Y position based on scroll progress
- Creates depth illusion

### Stagger

Container that staggers children entrance.

```tsx
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

<Stagger staggerChildren={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</Stagger>;
```

**Props:**

- `staggerChildren?: number` — Delay between children (default: 0.1)
- `children: React.ReactNode`

### ScrollProgress

Visual scroll progress indicator.

```tsx
import { ScrollProgress } from "@/components/motion/ScrollProgress";

<ScrollProgress />;
```

**Implementation:**

- Fixed position bar at top of viewport
- Fills based on scroll percentage
- Green accent color

### MagneticButton

Button with magnetic cursor effect.

```tsx
import { MagneticButton } from "@/components/motion/MagneticButton";

<MagneticButton>
  <button>Hover me</button>
</MagneticButton>;
```

**Props:**

- `strength?: number` — Magnet strength (default: 0.3)
- `children: React.ReactNode`

### ImageReveal

Image entrance with clip-path animation.

```tsx
import { ImageReveal } from "@/components/motion/ImageReveal";

<ImageReveal src="/image.jpg" alt="Description" />;
```

**Props:**

- `src: string` — Image source
- `alt: string` — Image alt text
- `className?: string`

**Implementation:**

- Uses clip-path polygon for reveal effect
- Animates from bottom to top
- Creates dramatic entrance

### NumberReveal

Animated number counter.

```tsx
import { NumberReveal } from "@/components/motion/NumberReveal";

<NumberReveal value={230} suffix="+" />;
```

**Props:**

- `value: number` — Target number
- `suffix?: string` — Optional suffix (default: "")
- `duration?: number` — Animation duration (default: 2)

**Implementation:**

- Uses framer-motion `useInView` to trigger
- Animates from 0 to target value
- Easing for natural feel

## Timing Standards

| Element Type     | Duration | Easing      | Notes             |
| ---------------- | -------- | ----------- | ----------------- |
| Text entrance    | 0.6s     | ease-out    | Subtle, readable  |
| Card entrance    | 0.5s     | ease-out    | Smooth reveal     |
| Image entrance   | 0.8s     | ease-out    | Dramatic reveal   |
| Button hover     | 0.2s     | ease-fast   | Responsive feel   |
| Page transitions | 0.3s     | ease-in-out | Smooth navigation |

## Easing Curves

```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
```

## Stagger Delays

| Context       | Delay | Rationale            |
| ------------- | ----- | -------------------- |
| List items    | 0.05s | Quick succession     |
| Grid cards    | 0.1s  | Medium pace          |
| Hero elements | 0.2s  | Dramatic reveal      |
| Text words    | 0.05s | Natural reading flow |

## Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

## Best Practices

1. **Don't over-animate** — Less is more
2. **Guide attention** — Use motion to direct eye flow
3. **Create depth** — Layer animations for richness
4. **Respect users** — Always honor reduced-motion
5. **Performance first** — Use transform/opacity, avoid layout triggers
6. **Purposeful** — Every animation needs a reason

## Component Locations

- `src/components/motion/Reveal.tsx`
- `src/components/motion/TextReveal.tsx`
- `src/components/motion/Parallax.tsx`
- `src/components/motion/Stagger.tsx`
- `src/components/motion/ScrollProgress.tsx`
- `src/components/motion/MagneticButton.tsx`
- `src/components/motion/ImageReveal.tsx`
- `src/components/motion/NumberReveal.tsx`
