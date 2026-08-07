# Motion Guidelines — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Motion Philosophy

**"Motion serves learning. Not decoration. Not delight. Learning."**

Every animation must:

1. Guide attention
2. Reinforce understanding
3. Provide feedback
4. Maintain context
5. Respect user preferences

---

## Motion Principles

### 1. Purposeful

Every animation has a reason:

- **Guide:** Direct attention to important elements
- **Reinforce:** Show cause and effect
- **Feedback:** Confirm actions
- **Context:** Maintain spatial relationships
- **Progress:** Show advancement

### 2. Subtle

Less is more:

- Maximum 300ms duration
- Maximum 2 concurrent animations
- No decorative animations
- No distracting effects
- No competing motions

### 3. Consistent

Same action = same animation:

- Page transitions: fade (200ms)
- Content reveals: fade-in-up (300ms)
- Button actions: scale (150ms)
- Errors: shake (300ms)
- Success: pulse (200ms)

### 4. Accessible

Respect user preferences:

- Check `prefers-reduced-motion`
- Provide alternatives
- Never block content
- Always optional

---

## Animation Catalog

### Page Transitions

```typescript
// Fade (default)
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// Slide right (navigation)
const slideRight = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.2 },
};

// Slide up (content)
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.2 },
};
```

### Content Reveals

```typescript
// Scroll reveal
const scrollReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5 },
};

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
```

### Button Interactions

```typescript
// Hover
const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.15 },
};

// Tap
const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// Loading
const buttonLoading = {
  scale: [1, 1.05, 1],
  transition: { duration: 1, repeat: Infinity },
};
```

### Feedback Animations

```typescript
// Success pulse
const successPulse = {
  scale: [1, 1.05, 1],
  transition: { duration: 0.3 },
};

// Error shake
const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.3 },
};

// Correct answer
const correctAnswer = {
  backgroundColor: ["#f5f1e6", "#d4edda", "#f5f1e6"],
  transition: { duration: 0.5 },
};

// Incorrect answer
const incorrectAnswer = {
  backgroundColor: ["#f5f1e6", "#f8d7da", "#f5f1e6"],
  x: [0, -5, 5, -5, 5, 0],
  transition: { duration: 0.5 },
};
```

### Progress Animations

```typescript
// Progress bar fill
const progressFill = {
  width: `${progress}%`,
  transition: { duration: 0.5, ease: "easeOut" },
};

// Count up
const countUp = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
};

// Mastery ring
const masteryRing = {
  strokeDashoffset: `${100 - mastery}%`,
  transition: { duration: 1, ease: "easeOut" },
};
```

### Celebration Animations

```typescript
// Confetti
const confetti = {
  particles: 100,
  spread: 70,
  origin: { y: 0.6 },
  duration: 2000,
};

// Badge unlock
const badgeUnlock = {
  scale: [0, 1.2, 1],
  rotate: [0, 10, -10, 0],
  transition: { duration: 0.5 },
};

// Streak flame
const streakFlame = {
  scale: [1, 1.1, 1],
  opacity: [0.8, 1, 0.8],
  transition: { duration: 2, repeat: Infinity },
};
```

### Code Animations

```typescript
// Typing indicator
const typingIndicator = {
  y: [0, -5, 0],
  transition: { duration: 0.5, repeat: Infinity },
};

// Output streaming
const outputStreaming = {
  opacity: [0, 1],
  transition: { duration: 0.1 },
};

// Syntax highlight
const syntaxHighlight = {
  color: ["inherit", "#c9a227", "inherit"],
  transition: { duration: 0.3 },
};
```

### Graph Animations

```typescript
// Node appear
const nodeAppear = {
  scale: [0, 1],
  opacity: [0, 1],
  transition: { duration: 0.3 },
};

// Edge draw
const edgeDraw = {
  pathLength: [0, 1],
  transition: { duration: 0.5 },
};

// Node select
const nodeSelect = {
  scale: 1.2,
  boxShadow: "0 0 20px rgba(201, 162, 39, 0.5)",
  transition: { duration: 0.2 },
};

// Edge particles
const edgeParticles = {
  offsetDistance: ["0%", "100%"],
  transition: { duration: 2, repeat: Infinity, ease: "linear" },
};
```

---

## Timing

### Duration Guidelines

| Type     | Duration  | Usage                            |
| -------- | --------- | -------------------------------- |
| Micro    | 100-150ms | Button tap, selection            |
| Short    | 150-200ms | Hover, focus, toggle             |
| Medium   | 200-300ms | Page transition, content reveal  |
| Long     | 300-500ms | Complex animations, celebrations |
| Extended | 500ms-1s  | Graph layout, loading            |

### Easing

| Easing    | Usage                                  |
| --------- | -------------------------------------- |
| easeInOut | Page transitions, content reveals      |
| easeOut   | Elements entering view                 |
| easeIn    | Elements leaving view                  |
| spring    | Physical interactions (buttons, cards) |
| linear    | Progress bars, particles               |

---

## Reduced Motion

### Implementation

```typescript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// Disable animations if preferred
const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2 };
```

### Alternatives

| Animation        | Reduced Motion Alternative |
| ---------------- | -------------------------- |
| Fade in          | Instant appearance         |
| Slide in         | Instant appearance         |
| Scale in         | Instant appearance         |
| Confetti         | Color flash                |
| Typing indicator | Static "..."               |
| Graph layout     | Static layout              |
| Progress fill    | Instant update             |

---

## Performance

### Optimization

1. **Use CSS transforms** — GPU-accelerated
2. **Avoid layout thrashing** — Batch DOM reads
3. **Use will-change** — For complex animations
4. **Limit concurrent animations** — Max 2
5. **Use requestAnimationFrame** — For JS animations

### Monitoring

```typescript
// Monitor frame rate
const monitorFPS = () => {
  let lastTime = performance.now();
  let frames = 0;

  const loop = () => {
    frames++;
    const currentTime = performance.now();
    if (currentColor - lastTime >= 1000) {
      console.log(`FPS: ${frames}`);
      frames = 0;
      lastTime = currentTime;
    }
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};
```

---

## Testing

### Visual Testing

1. **Screenshot comparison** — Before/after
2. **Motion recording** — Capture animations
3. **Performance profiling** — Frame rate analysis
4. **Accessibility testing** — Reduced motion

### User Testing

1. **Observe** — Watch users interact
2. **Interview** — Ask about motion perception
3. **A/B test** — Compare animation variants
4. **Survey** — Measure satisfaction

---

## Checklist

- [ ] Every animation has a purpose
- [ ] Duration ≤ 300ms (except celebrations)
- [ ] Respects prefers-reduced-motion
- [ ] Performance optimized (60fps)
- [ ] Consistent across components
- [ ] Accessible alternatives provided
- [ ] Tested on mobile devices
- [ ] Tested with reduced motion

---

_Motion serves learning. Not decoration. Not delight. Learning._
