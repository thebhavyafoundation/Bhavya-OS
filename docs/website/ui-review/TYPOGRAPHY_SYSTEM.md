# Typography System

## Current State

The Bhavya Foundation website uses default Starlight typography:

- Font: System fonts
- Scale: Default Starlight scale
- Line height: Default
- Letter spacing: Default

**Maturity: 4/10**

## Elite Website Typography Patterns

### Vercel

- **Font:** Geist Sans + Geist Mono
- **Display:** 72px, weight 800, letter-spacing -0.02em
- **H1:** 48px, weight 700
- **H2:** 36px, weight 700
- **Body:** 16px, weight 400, line-height 1.6
- **Code:** 14px, JetBrains Mono

### Linear

- **Font:** Inter
- **Display:** 64px, weight 500, letter-spacing -0.02em
- **H1:** 48px, weight 500
- **Body:** 16px, weight 400, line-height 1.5
- **Color:** White on dark, gray-400 for secondary

### Anthropic

- **Font:** System fonts (clean, readable)
- **Display:** 48px, weight 400
- **Body:** 18px, weight 400, line-height 1.7
- **Color:** Dark on ivory background

### Stripe

- **Font:** Stripe Sans (custom)
- **Display:** 72px, weight 700
- **H1:** 48px, weight 700
- **Body:** 16px, weight 400, line-height 1.6
- **Code:** 14px, monospace

## Recommended Bhavya Foundation Typography

### Font Stack

```css
--font-sans: "Inter", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

### Type Scale

| Element | Size                     | Weight | Letter Spacing | Line Height |
| ------- | ------------------------ | ------ | -------------- | ----------- |
| Display | clamp(3rem, 5vw, 5rem)   | 800    | -0.02em        | 1.1         |
| H1      | clamp(2.5rem, 4vw, 4rem) | 700    | -0.02em        | 1.2         |
| H2      | clamp(2rem, 3vw, 3rem)   | 700    | -0.01em        | 1.3         |
| H3      | clamp(1.5rem, 2vw, 2rem) | 600    | -0.01em        | 1.4         |
| H4      | 1.25rem                  | 600    | 0              | 1.5         |
| Body    | 1rem                     | 400    | 0              | 1.6         |
| Small   | 0.875rem                 | 400    | 0              | 1.5         |
| Code    | 0.875rem                 | 400    | 0              | 1.5         |

### Color Tokens

| Token          | Light   | Dark    |
| -------------- | ------- | ------- |
| text-primary   | #0a0a0a | #fafafa |
| text-secondary | #64748b | #94a3b8 |
| text-tertiary  | #94a3b8 | #64748b |
| text-inverse   | #fafafa | #0a0a0a |

### Line Length

- **Optimal:** 65-75 characters per line
- **Maximum:** 80 characters
- **Implementation:** `max-width: 65ch` for body text

### Line Height

- **Headings:** 1.2-1.3 (tight)
- **Body:** 1.6 (comfortable)
- **Code:** 1.5 (compact)

## Implementation

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --text-display: clamp(3rem, 5vw, 5rem);
  --text-h1: clamp(2.5rem, 4vw, 4rem);
  --text-h2: clamp(2rem, 3vw, 3rem);
  --text-h3: clamp(1.5rem, 2vw, 2rem);
  --text-h4: 1.25rem;
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-code: 0.875rem;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;

  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.7;

  --tracking-tight: -0.02em;
  --tracking-snug: -0.01em;
  --tracking-normal: 0;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

h1,
h2,
h3,
h4 {
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}

code,
pre {
  font-family: var(--font-mono);
}
```

## Priority

| Task                       | Priority | Effort |
| -------------------------- | -------- | ------ |
| Import Inter font          | P0       | Low    |
| Import JetBrains Mono      | P0       | Low    |
| Define type scale          | P0       | Low    |
| Define color tokens        | P0       | Low    |
| Update body styles         | P0       | Low    |
| Update heading styles      | P0       | Low    |
| Update code styles         | P1       | Low    |
| Add line-length constraint | P1       | Low    |
