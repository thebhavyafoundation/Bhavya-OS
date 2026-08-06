# Website Design System — v2.0

> Bhavya Foundation website visual and interaction design system.

## Brand

- **Palette:** Forest #15803d, Gold #ca8a04, Earth #8a7359
- **Typography:** Inter (400–800)
- **Never change:** Logo, typography, color palette

## Architecture

```
src/
├── components/
│   ├── motion/          # Framer Motion primitives
│   │   ├── Reveal.tsx       # Scroll-triggered reveal (7 variants)
│   │   ├── Parallax.tsx     # Scroll-driven parallax
│   │   ├── MagneticButton.tsx # Magnetic hover effect
│   │   ├── TiltCard.tsx     # 3D tilt with glare
│   │   ├── TextReveal.tsx   # Letter-by-letter animation
│   │   ├── Stagger.tsx      # Staggered children
│   │   ├── ScrollProgress.tsx # Top scroll bar
│   │   ├── FloatingElement.tsx # Floating animation
│   │   └── SmoothScroll.tsx # Lenis integration
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx       # 4 variants, 3 sizes
│   │   ├── Badge.tsx        # 5 variants
│   │   ├── SectionHeader.tsx # Animated section headers
│   │   └── GlassCard.tsx    # 3D tilt + glare card
│   ├── Providers.tsx    # Lenis + ScrollProgress wrapper
│   ├── Header.tsx       # Site navigation
│   ├── Footer.tsx       # Site footer
│   ├── HeroSection.tsx  # Cinematic hero
│   └── MissionCards.tsx # Animated mission cards
├── app/
│   ├── layout.tsx       # Root layout with Providers
│   ├── loading.tsx      # Branded loading screen
│   └── globals.css      # Design system (2326 lines)
└── lib/
    └── metadata.ts      # SEO metadata builder
```

## Animation Stack

- **Framer Motion** — Primary animation library
- **Lenis** — Smooth scroll
- **GSAP** — Legacy (existing hooks in `lib/animations.ts`)
- **CSS** — Reduced-motion fallbacks

### Motion Primitives

| Component         | Use Case                        |
| ----------------- | ------------------------------- |
| `Reveal`          | Scroll-triggered content reveal |
| `Parallax`        | Depth on scroll                 |
| `MagneticButton`  | Hover magnetic pull             |
| `TiltCard`        | 3D card tilt                    |
| `TextReveal`      | Letter-by-letter text           |
| `Stagger`         | Staggered children              |
| `ScrollProgress`  | Top progress bar                |
| `FloatingElement` | Gentle floating                 |
| `SmoothScroll`    | Lenis wrapper                   |

## Performance

- Target: Lighthouse 90+
- All animations GPU-accelerated
- `prefers-reduced-motion` fully supported
- Static generation for all pages
- First Load JS: ~205 KB

## Accessibility

- WCAG 2.1 AA baseline
- Skip links on every page
- Semantic landmarks (header, nav, main, footer)
- Keyboard navigable
- Focus-visible indicators
- 4.5:1+ contrast ratios

## Commands

```bash
# Dev
pnpm --filter @bhavya/website dev

# Build
pnpm --filter @bhavya/website build

# Type check
pnpm --filter @bhavya/website build  # includes tsc
```
