# MOTION-SYSTEM.md — Motion & Animation System Specification

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Source:** `docs/experience/DESIGN-DIRECTION.md` §3, `tokens.css`

---

## 1. Motion Tokens (from `packages/platform-ui/src/styles/tokens.css`)

| Token                  | Value                         | Usage                           |
| ---------------------- | ----------------------------- | ------------------------------- |
| `--transition-fast`    | `150ms cubic(0.4, 0, 0.2, 1)` | Micro-animations, focus states  |
| `--transition-normal`  | `250ms cubic(0.4, 0, 0.2, 1)` | Page transitions, state changes |
| `--transition-stagger` | `150ms cubic(0.4, 0, 0.2, 1)` | List/stagger animations         |
| `--easing-quad`        | `cubic(0.4, 0, 0.2, 1)`       | Standard easing                 |
| `--easing-cubic`       | `cubic(0.45, 0, 0.55, 1)`     |                                 |
| `--easing-quart`       | `cubic(0.5, 0, 0.1, 1)`       |                                 |

---

## 2. Motion Architecture Layers

| Layer            | Tool                             | Philosophy                                           |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| Reduced motion   | `prefers-reduced-motion: reduce` | Empty div fallback for 3D, disable GSAP/Lenis tweens |
| Core             | `framer-motion` v13.0.0          | Declarative, component library primitives            |
| Three.js         | `gsap` v3.15.0                   | Group rotations, frame loop, camera moves            |
| Scroll-triggered | `Lenis` v1.3.26                  | Smooth scroll, pinned sections                       |
| Spring           | `apple-springs` (custom lib)     | Physics-based spring for hero elements               |

---

## 3. Motion Hierarchy by Tier

| Tier                        | Motion Level | Allowed Techniques                                      |
| --------------------------- | ------------ | ------------------------------------------------------- |
| A — Cinematic Flagship      | Cinematic    | Full camera moves, cinematic scroll, GSAP timelines, 3D |
| B — Interactive Explanatory | High         | Hover lifts, scroll reveals, card flips, GSAP           |
| C — Functional Learning     | Calm         | Subtle focus, loading spinners, button hover, Lenis     |
| D — Operational             | Micro only   | Micro-animations, accessibility-first, no 3D            |

---

## 4. Reduced Motion Fallback

| Component                  | Fallback Behavior                                        |
| -------------------------- | -------------------------------------------------------- |
| 3D Canvas (`Hero3DCanvas`) | Empty `<div>` with alt text, no WebGL                    |
| GSAP animations            | `display: none` or static state, no frame loop           |
| `Lenis` scroll             | Native `<a href>`, skip links, no smooth scroll          |
| Framer-motion              | `display: block`, `opacity: 1` instantly, no transitions |
| Kinetic Typography         | Static text, no character animation                      |

**Rule:** Every component using GSAP, Lenis, framer-motion, or Three.js must check `prefers-reduced-motion` and substitute a static equivalent.

---

## 5. Component Motion Requirements

| Component                  | Motion Type          | Reduced Motion Fallback   |
| -------------------------- | -------------------- | ------------------------- |
| `Hero3DCanvas.tsx`         | 3D scene, particles  | Empty div + alt text      |
| `CurriculumHero3D.tsx`     | Band scenes, cameras | Static hero image         |
| `KineticTypography.tsx`    | Character animation  | Static text               |
| `ParticleSystems.tsx`      | Particle emission    | Static background         |
| `AICurriculumTimeline.tsx` | Scroll reveals       | Native scroll, no Lenis   |
| `BlockRenderer.tsx`        | 3D block transforms  | Static block              |
| `BentoModuleGrid.tsx`      | Masonry layout       | CSS grid, no JS animation |

---

## 6. Next: Create PERFORMANCE-BUDGETS.md
