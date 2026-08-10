# BHAVYA VISUAL FIDELITY REPORT

**Date:** 2026-08-10
**Status:** FAIL — Visual composition incomplete

---

## Old Reference (apps/website)

**Hero:** Cinematic mountain landscape with 3-layer parallax SVG, sun glow, fog, tree silhouettes, gold particles, Framer Motion reveal animations, scroll indicator. Text overlays a rich visual scene.

**Imagery:** SVG mountain landscape (hero), photographic mission images, nature/people/heritage visuals throughout.

**Motion:** Framer Motion for hero reveal, GSAP ScrollTrigger for section entrance, parallax scroll, particle system, sun pulse.

**Typography:** Editorial display with blur reveal, `--text-7xl` hero, `--text-6xl` sections, generous line-height.

**Colors:** Light mode default (#fafafa bg), forest green primary (#15803d), gold accent (#ca8a04), earth secondary (#8a7359).

**Layout:** Max-width 1200px, generous whitespace, section rhythm with alternating backgrounds.

**Navigation:** Floating glass navbar with logo, 7 nav items, CTA button.

**Footer:** 4-column institutional footer with brand, missions, learn, governance.

---

## New Implementation (apps/ai-institute)

**Hero:** Text-only. No imagery. No SVG landscape. No particles. No animation. Centered text on light background.

**Imagery:** None. Zero images on the entire homepage.

**Motion:** None. No animations, no scroll effects, no reveals.

**Typography:** Editorial scale (--text-6xl hero, --text-4xl sections). Correct weight (800). Correct letter-spacing (-0.03em).

**Colors:** Light mode default. Forest green accent. Gold accent on principles. Correct palette.

**Layout:** Max-width 1200px. Generous whitespace. Section rhythm. Correct structure.

**Navigation:** Sticky glass navbar. Logo text "Bhavya". 7 nav items + My Bhavya + Start Learning CTA.

**Footer:** 4-column institutional footer. Brand, missions, learn, governance. Copyright line.

---

## Preserved

- [x] Brand color palette (forest, gold, earth, cream)
- [x] Light mode default
- [x] Editorial typography scale
- [x] Section structure (hero, missions, stats, principles, CTA, footer)
- [x] Navigation layout
- [x] Footer layout
- [x] Content (missions, principles, stats, CTAs)
- [x] Skip navigation
- [x] Accessibility (aria labels, roles)
- [x] "Bhavya Foundation" identity
- [x] "Restoring Nature. Empowering Humanity. Preserving Heritage." tagline
- [x] Four missions (Forest, Knowledge, Heritage, Community)
- [x] Guiding principles
- [x] Institutional tone

## Lost

- [ ] **Bhavya logo image** — Only text "Bhavya", no SVG logo/icon
- [ ] **Hero imagery** — No mountain landscape, no nature photography
- [ ] **Hero motion** — No parallax, no reveal animations, no particles
- [ ] **Section imagery** — No mission photos, no nature/people visuals
- [ ] **Banner/carousel** — No Knowledge Packages carousel
- [ ] **Trust layer** — No transparency grid section
- [ ] **Scroll indicator** — No scroll-down cue
- [ ] **Motion** — No GSAP ScrollTrigger, no Framer Motion
- [ ] **Responsive layout** — No media queries, no mobile menu
- [ ] **Interactive hover states** — Minimal hover effects

## Improved

- [x] **Cleaner code** — Single file, no component imports
- [x] **Canonical tokens** — Uses platform-ui tokens directly
- [x] **No duplication** — No copied CSS
- [x] **Faster load** — No external dependencies (Framer Motion, GSAP)
- [x] **Accessibility** — Skip nav, ARIA labels, semantic HTML

---

## Critical Gaps

### 1. NO IMAGERY (Critical)

The homepage has zero images. The old website had:

- SVG mountain landscape hero
- Mission photography
- Nature/people visuals

**Impact:** The page reads as a generic text site, not Bhavya Foundation.

**Fix required:** Add Bhavya logo, hero imagery, mission photography.

### 2. NO MOTION (Major)

The homepage has zero animation. The old website had:

- Hero reveal (blur → clear)
- Parallax scroll
- Particle system
- Section entrance animations
- Scroll indicator

**Impact:** The page feels static and lifeless.

**Fix required:** Add hero reveal, scroll animations, section entrance.

### 3. NO RESPONSIVE LAYOUT (Major)

The homepage uses inline styles with no media queries. The footer 4-column grid will break on mobile. The nav will overflow on tablet.

**Impact:** Mobile experience is broken.

**Fix required:** Add responsive breakpoints, mobile navigation.

### 4. NO LOGO IMAGE (Moderate)

The header shows text "Bhavya" but no SVG logo/icon. The old website had the B-tree mark icon.

**Impact:** Brand recognition is weaker.

**Fix required:** Add Bhavya logo SVG.

---

## Duplicate CSS Check

- `apps/ai-institute/website-theme.css` — **EXISTS: NO**
- Any other copied website global CSS — **NONE**
- platform-ui tokens.css — **CANONICAL**

---

## Design System Verification

- [x] Homepage uses platform-ui tokens (var(--color-_), var(--text-_), var(--space-*))
- [x] No duplicate token definitions
- [x] No app-specific brand overrides
- [x] platform-ui is canonical source
- [x] No copied website CSS

---

## Browser Verification

**Cannot complete** — Dev server cannot start via OpenCode on Windows.

Manual verification required:

1. Run `pnpm --filter @bhavya/ai-institute dev`
2. Open http://localhost:3000
3. Capture screenshots at 390x844, 768x1024, 1280x800, 1440x900, 1920x1080
4. Compare with old website at http://localhost:3001

---

## Status

**FAIL**

The canonical design system produces the correct color palette, typography, and layout structure. However, the homepage is missing:

1. All imagery (hero, missions, brand)
2. All motion (reveal, parallax, scroll)
3. Responsive layout
4. Logo image

The page structure is correct. The visual composition is incomplete.

**To pass:** Add hero imagery, logo, motion, and responsive layout using platform-ui tokens.
