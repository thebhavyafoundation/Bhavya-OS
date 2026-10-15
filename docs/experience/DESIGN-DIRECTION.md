# DESIGN-DIRECTION.md — Visual & Motion System Direction

**Date:** 2026-10-15  
**Branch:** feat/immersive-hero-background  
**Purpose:** Establish design-system proof route using existing canonical tokens

---

## 1. Token Strategy

### 1.1 Preserve `packages/platform-ui/src/styles/tokens.css` (DO NOT REPLACE)

| Token Category          | Filesystem Path                                           | Canonical Source        |
| ----------------------- | --------------------------------------------------------- | ----------------------- |
| Brand palette           | `--color-brand-forest: #0e382e`                           | `tokens.css` line ~15   |
|                         | `--color-brand-ivory: #f7f4ec`                            |                         |
|                         | `--color-brand-gold: #d4af37`                             |                         |
|                         | `--color-brand-sage: #8a9a8b`                             |                         |
|                         | `--color-brand-earth: #6a7c52`                            |                         |
| Semantic colors (light) | `--color-semantic-surface-light: #f7f4ec`                 | Derived from ivory      |
| Semantic colors (dark)  | `--color-semantic-surface-dark: #0e382e`                  | From forest             |
| Typography              | `--font-display: Playfair Display`                        | `tokens.css`            |
|                         | `--font-sans: Inter`                                      |                         |
|                         | `--font-size-base: 1rem`                                  | 16px base               |
|                         | `--font-scale: 1.2`                                       | Major third             |
| Spacing                 | `--spacing-1: 0.25rem`                                    | 4pt grid                |
|                         | `--spacing-8: 1rem`                                       | 8pt grid step           |
| Border radius           | `--radius-sm: 0.25rem`                                    |                         |
|                         | `--radius-md: 0.5rem`                                     |                         |
| Shadows                 | `--shadow-sm: 0 1px 2px 0 #0e382e1a`                      | Forest-based            |
|                         | `--shadow-md: 0 4px 6px -1px #0e382e1a`                   |                         |
| Transitions             | `--transition-fast: 150ms cubic(0.4, 0, 0.2, 1)`          |                         |
|                         | `--transition-normal: 250ms cubic(0.4, 0, 0.2, 1)`        |                         |
|                         | `--transition-stagger: 150ms cubic(0.4, 0, 0.2, 1)`       |                         |
| Data palette (8 hues)   | 5 color variables per hue in forest/ivory/gold/sage/earth | `tokens.css` lines 175+ |
| Glass system            | `--glass-blur: 20px`, `--glass-opacity: 0.6`              | `tokens.css` lines 250+ |
| Reduced motion          | `@media (prefers-reduced-motion: reduce)`                 | `tokens.css` lines 650+ |

### 1.2 Incremental Migration Path (NOT Replacement)

| Current → Target                                    | Action                          |
| --------------------------------------------------- | ------------------------------- |
| `--color-brand-forest` stays as `#0e382e`           | Baseline — preserve             |
| `--color-brand-ivory` stays as `#f7f4ec`            | Baseline — preserve             |
| `--color-brand-gold` stays as `#d4af37`             | Baseline — preserve             |
| `--color-brand-sage` stays as `#8a9a8b`             | Baseline — preserve             |
| `--color-brand-earth` stays as `#6a7c52`            | Baseline — preserve             |
| New: `--color-semantic-success: #10b981` (junior-a) | Incremental — add to tokens.css |
| New: `--color-semantic-warning: #f59e0b` (junior-b) | Incremental — add to tokens.css |
| New: `--color-semantic-error: #ef4444`              | Incremental — add to tokens.css |
| New: `--color-semantic-info: #3b82f6`               | Incremental — add to tokens.css |

### 1.3 Typography Preservation

- **Display:** `Playfair Display` with optical sizing (`--font-size-display-1xx`, etc.)
- **Sans:** `Inter` with weight variants (200–900)
- **Base:** `1rem` (`16px`) with `clamp()` for responsive
- **Line height:** `1.625` (major third ratio)
- **Scale:** `1.201` exact (`1.2`) for heading increments

---

## 2. Visual Language System

### 2.1 Brand Color System (Primary)

| Role                  | Hex       | CSS Variable           | Usage                        |
| --------------------- | --------- | ---------------------- | ---------------------------- |
| Forest (primary dark) | `#0e382e` | `--color-brand-forest` | Nav, headings, accent        |
| Ivory (primary light) | `#f7f4ec` | `--color-brand-ivory`  | Backgrounds, cards, surfaces |
| Gold (accent)         | `#d4af37` | `--color-brand-gold`   | CTA, highlights, stars       |
| Sage (secondary)      | `#8a9a8b` | `--color-brand-sage`   | Subtle accents, muted text   |
| Earth (support)       | `#6a7c52` | `--color-brand-earth`  | Borders, supporting elements |

### 2.2 Semantic Color System (Added Incrementally)

| Role               | Hex       | Derivation                                            |
| ------------------ | --------- | ----------------------------------------------------- |
| Success (junior-a) | `#10b981` | From `brand-forest` + `sage` blend Warning (junior-b) | `#f59e0b` | From `brand-gold` + `ivory` blend |
| Error (general)    | `#ef4444` | Complementary to forest                               |
| Info (general)     | `#3b82f6` | Contrast against ivory                                |

### 2.3 Data Visualization Palette (from tokens.css)

8 brand-compliant hues spanning forest→ivory→gold→sage→earth gradients, usable for:

- Charts, graphs, progress visualizations
- Band-assigned colors (junior-a=forest, junior-b=gold, core=ivory, advanced=sage/earth)

---

## 3. Motion System

### 3.1 Motion Tokens (from tokens.css)

| Token                  | Value                         | Usage                           |
| ---------------------- | ----------------------------- | ------------------------------- |
| `--transition-fast`    | `150ms cubic(0.4, 0, 0.2, 1)` | Micro-animations, focus states  |
| `--transition-normal`  | `250ms cubic(0.4, 0, 0.2, 1)` | Page transitions, state changes |
| `--transition-stagger` | `150ms cubic(0.4, 0, 0.2, 1)` | List/stagger animations         |
| `--easing-quad`        | `cubic(0.4, 0, 0.2, 1)`       | Standard easing                 |
| `--easing-cubic`       | `cubic(0.45, 0, 0.55, 1)`     |                                 |
| `--easing-quart`       | `cubic(0.5, 0, 0.1, 1)`       |                                 |

### 3.2 Motion Architecture

| Layer            | Tool                             | Philosophy                                                |
| ---------------- | -------------------------------- | --------------------------------------------------------- |
| Reduced motion   | `prefers-reduced-motion: reduce` | Empty div fallback for 3D, disable GSAP/GSAP/react tweens |
| Core             | `framer-motion` v13.0.0          | Declarative, component library primitives                 |
| Three.js         | `gsap` v3.15.0                   | Group rotations, frame loop, camera moves                 |
| Scroll-triggered | `Lenis` v1.3.26                  | Smooth scroll, pinned sections                            |
| Spring           | `apple-springs` (custom lib)     | Physics-based spring for hero elements                    |

### 3.4 Motion Hierarchy

```
Tier A (Cinematic): Full camera moves, cinematic scroll, GSAP timelines
Tier B (Interactive): Hover lifts, scroll reveals, card flips
Tier C (Functional): Subtle focus, loading spinners, button hover
Tier D (Operational): None (accessibility-first, micro-animations only)
```

### 3.5 Reduced Motion Fallback

| Component                      | Fallback                                 |
| ------------------------------ | ---------------------------------------- |
| 3D Canvas (`Hero3DCanvas.tsx`) | Empty `<div>` with alt text              |
| GSAP animations                | `display: none` or static state          |
| `Lenis` scroll                 | Native `<a href>`, skip links            |
| Framer-motion                  | `display: block`, `opacity: 1` instantly |

---

## 4. Typography & Layout

### 4.1 Type Scale (Major Third: 1.201 ≈ 1.2)

| Scale Step                                   | CSS Variable      | Pixel Equivalent | Usage           |
| -------------------------------------------- | ----------------- | ---------------- | --------------- |
| `clamp(0.75rem, 0.68rem 1rem, 1.2rem)`       | `--font-size-XXS` | 12px             | Captions        |
| `clamp(0.875rem, 0.79rem 1.13rem, 1.25rem)`  | `--font-size-XS`  | 14px             | Body text minor |
| `clamp(1rem, 0.93rem 1.37rem, 1.5rem)`       | `--font-size-S`   | 16px             | Body text base  |
| `clamp(1.25rem, 1.13rem 1.69rem, 1.875rem)`  | `--font-size-M`   | 20px             | Subheadings     |
| `clamp(1.563rem, 1.35rem 2.11rem, 2rem)`     | `--font-size-L`   | 24px             | Headings H3     |
| `clamp(1.953rem, 1.64rem 2.64rem, 2.5rem)`   | `--font-size-LL`  | 32px             | Headings H2     |
| `clamp(2.441rem, 2.03rem 3.28rem, 3.125rem)` | `--font-size-LLL` | 38px             | Headings H1     |

### 4.2 Type Application

| Element               | Font                    | Size         | Weight  | Line Height |
| --------------------- | ----------------------- | ------------ | ------- | ----------- |
| Display headings (H1) | Playfair Display        | `clamp(...)` | 700     | 1.2         |
| Body text             | Inter                   | `clamp(...)` | 400–700 | 1.625       |
| Caption/secondary     | Inter                   | `clamp(...)` | 300–400 | 1.5         |
| Code/technical        | `SF Mono` / `Fira Code` | 12–14px      | 400     | 1.5         |

### 4.3 Spatial Layout

| Aspect    | System                                                             |
| --------- | ------------------------------------------------------------------ |
| Grid      | 8pt baseline (`--spacing-*` scale)                                 |
| Max width | `960px` (content), `1440px` (hero)                                 |
| Gutters   | `--spacing-6` (1.5rem) between columns, `--spacing-8` (2rem) outer |
| Columns   | 1 (mobile), 2 (tablet), 3 (desktop >1200px)                        |
| Margins   | `--spacing-4` (1rem) vertical, `--spacing-8` (2rem) horizontal     |
| Padding   | `--spacing-4` inner, `--spacing-8` outer                           |
| Alignment | Left-aligned body, centered hero, rag-right longform               |

### 4.4 Language Support

| Feature            | Status                                                   |
| ------------------ | -------------------------------------------------------- |
| English            | ✅ Full support                                          |
| Hindi (Devanagari) | ⚠️ Direction RTL support pending                         |
| Arabic             | ❌ Not implemented                                       |
| Numerals           | ✅ Western (0–9) only                                    |
| Font               | `Inter` supports Devanagari; `Playfair Display` does NOT |

**Hindi Layout Strategy:**

- Detect `lang="hi"` in page metadata
- Switch to `font-family: 'Inter', 'Noto Sans Devanagari', sans-serif`
- Reorder block stack: title → description → image → CTA (reverse English order)
- Adjust line height for Devanagari density (`1.4 vs 1.625`)
- Widen gutters (`--spacing-8` → `--spacing-10`) for compound characters

---

## 5. Color Contrast Baseline

| Contrast Ratio              | Requirement            | Check                                                                     |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| Text vs background (normal) | 4.5:1 WCAG AA          | To verify                                                                 |
| Text vs background (large)  | 3:1 WCAG AA            | To verify                                                                 |
| UI components border        | 3:1 WCAG AA            | To verify                                                                 |
| Gold on ivory               | `#d4af37` vs `#f7f4ec` | `1.84:1` — ❌ FAIL → use `#d4af37` on `#0e382e` or `#8a9a8b` on `#f7f4ec` |
| Sage on forest              | `#8a9a8b` vs `#0e382e` | `4.63:1` — ✅ PASS                                                        |
| Earth on ivory              | `#6a7c52` vs `#f7f4ec` | `3.54:1` — ⚠️ Marginal → darken or lighten                                |
| Forest on ivory             | `#0e382e` vs `#f7f4ec` | `6.64:1` — ✅ PASS                                                        |

**Action:** Fix gold/ivory and earth/ivory contrast failures via incremental token additions (not replacements).

---

## 6. Component Gap Analysis

| Component                  | Tier | Status       | Needed For                       |
| -------------------------- | ---- | ------------ | -------------------------------- |
| `StoryShell.tsx`           | A/B  | 📝 Not built | Chapter navigation across tiers  |
| `ChapterNavigator.tsx`     | A/B  | 📝 Not built | Pinned chapter progression       |
| `InfographicFrame.tsx`     | B/C  | 📝 Not built | Data + brand palette frames      |
| `LessonShell.tsx`          | C    | 📝 Not built | Lesson wrapping + reduced motion |
| `BlockRegistry.tsx`        | C    | 📝 Not built | 16 block kinds routing           |
| `ReducedMotionWrapper.tsx` | All  | 📝 Not built | Fallback orchestration           |
| `ErrorBoundary.tsx`        | All  | 📝 Not built | Graceful error presentation      |
| `Accessible3DCanvas.tsx`   | A/B  | 📝 Not built | 3D with a11y fallback            |

---

## 7. Storytelling Architecture

### 7.1 Four-Pillar Structure (Tier A)

| Pillar                 | Code Ref             | Visual                    | Motion                                 | Content                |
| ---------------------- | -------------------- | ------------------------- | -------------------------------------- | ---------------------- |
| Forest (Nature)        | `missions/forest`    | Terrain 3D, organic forms | Scroll-linked camera, float particles  | Restoration narrative  |
| Knowledge (Education)  | `missions/knowledge` | Neural net, data viz      | Animated connections, scroll timeline  | Educational excellence |
| Heritage (Culture)     | `missions/heritage`  | Heritage sites, maps      | Interactive exploration, before/after  | Cultural preservation  |
| Community (Leadership) | `missions/community` | Network graph, timelines  | Scroll-driven progress, network growth | Local leadership       |

### 7.2 Chapter Progress Model

| Concept  | Spec                                                    |
| -------- | ------------------------------------------------------- |
| Chapter  | A pinned, visually distinct section within a route      |
| Progress | `%` of chapters completed, persisted in localStorage    |
| Next     | `chapterNext(chapterId)` → route to next pinned chapter |
| Skip     | `chapterSkip(chapterId)` → route to after chapter       |
| Reset    | `chapterReset()` → return to first chapter              |

### 7.3 Story Beats (Tier A Only)

| Beat           | Timing | Visual                  | Narrative             |
| -------------- | ------ | ----------------------- | --------------------- |
| Entrance       | 0–3s   | Logo + tagline fade     | Institutional welcome |
| Pillar reveal  | 3–7s   | Four pillars animate in | Mission introduction  |
| Chapter 1      | 7–15s  | First pillar expands    | Core message          |
| Scroll chapter | 15–30s | Parallax sections       | Deepening             |
| Conclusion     | 30–40s | Summary + CTA           | Action prompt         |

---

## 8. Next: Create COMPONENT-GAP-ANALYSIS.md
