# BHAVYA VISUAL RESTORATION AUDIT

**Date:** 2026-08-10
**Status:** ACTIVE
**Task:** Restore Bhavya Foundation homepage from previous implementation

---

## Source Found

**Primary source:** `apps/website/` — Full Next.js 15 website with 18 pages, 30+ components, 2400+ line CSS design system, brand assets (logo, icon, OG image, favicon).

**Secondary sources:**

- `_archive/extracted_pages/` — Original HTML concept with Fraunces serif, forest photography, cream backgrounds
- `_archive/foundation-snapshot-v0.1.0/TOKENS.json` — Earliest design tokens
- `packages/branding/src/index.ts` — Brand constants (name, tagline, missions)
- `apps/website/public/brand/` — SVG logo, icon, OG image, apple touch icon

---

## Previous Visual System

### What Made the Old Bhavya Website Distinctive

1. **Light mode default** — Cream/white backgrounds (#fafafa, #ffffff), NOT dark SaaS
2. **Cinematic hero** — SVG mountain landscape with parallax (3 layers), sun glow, fog, tree silhouettes, gold particles
3. **Georgia serif logo** — "BHAVYA" in serif with decorative gold rules
4. **Editorial typography** — Inter for body, Georgia for logo, clean hierarchy
5. **Forest green primary** — #15803d, not dark #0a0f0d
6. **Gold accent restrained** — #ca8a04 used sparingly, not as primary CTA color
7. **Earth stone secondary** — #8a7359 for stability
8. **Institutional sections** — "Our Four Missions", "Founded on Public Trust", "Guiding Principles", "Transparency Is Not Optional"
9. **Real content** — Founder name, trustee names, constitutional commitments
10. **Glass navbar** — Floating header with backdrop-filter blur
11. **GSAP animations** — Stagger reveals, scroll-triggered, not constant animation
12. **Nature imagery** — Forest photography, mountain landscapes
13. **Thin gold rules** — Decorative separators, not heavy borders
14. **Footer with 4 columns** — Missions, Learn, Governance, Legal

---

## Current Drift

### What Was Wrong with the AI Institute Design

| Aspect         | Previous (Correct)                     | Current (Drifted)             |
| -------------- | -------------------------------------- | ----------------------------- |
| **Background** | Light cream/white                      | Dark #0a0f0d                  |
| **Typography** | Georgia serif logo, Inter body         | All Inter, oversized          |
| **Hero**       | Mountain landscape SVG, parallax       | Canvas particle network       |
| **Logo**       | "Bhavya" with B-tree mark              | "Bhavya Foundation" text only |
| **Color**      | Forest green primary                   | Gold primary (#c9a227)        |
| **Missions**   | 4 cards with icons                     | 12 AI school cards            |
| **Content**    | Forest, Heritage, Community            | AI, ML, DL, NLP, CV           |
| **Tone**       | Institutional                          | AI startup                    |
| **Stats**      | Founder, Board, Constitution           | Schools, Learning Paths       |
| **Sections**   | Values, Vision, Approach               | "12 Schools of AI"            |
| **Footer**     | 4-column institutional                 | None visible                  |
| **CTA**        | "Start Learning" + "Explore Knowledge" | "Begin Your Journey"          |

### Root Cause

The ai-institute homepage was built as an AI Institute product page, not as the Bhavya Foundation institutional homepage. The folder name `ai-institute` dictated the brand identity instead of the other way around.

---

## What Will Be Restored

1. **Light mode** — Cream/white backgrounds
2. **Cinematic hero** — Mountain landscape with parallax from website
3. **Logo** — Full B-tree SVG with Georgia serif
4. **MissionCards** — 4 missions (Forest, Knowledge, Heritage, Community)
5. **StatsSection** — Founder, Board, Constitution
6. **PrinciplesSection** — 5 guiding principles
7. **TrustLayer** — Transparency, standards, roadmap, metrics
8. **CTASection** — Active programmes
9. **Header** — Floating glass navbar with 8 nav items
10. **Footer** — 4-column institutional footer
11. **CSS design system** — Website's 2400+ line globals.css
12. **Brand assets** — Logo, icon, favicon from public/brand/

---

## What Will Be Retained from Current System

- `packages/platform-ui/src/styles/tokens.css` — Canonical tokens for OS/internal routes
- `apps/ai-institute/src/lib/` — Database, auth, API utilities
- `apps/ai-institute/src/components/AppShell.tsx` — Layout wrapper
- `apps/ai-institute/src/components/AuthProvider.tsx` — Auth context
- All API routes — Unchanged
- All OS routes — Unchanged

---

## Implementation Plan

1. Copy `apps/website/public/brand/` → `apps/ai-institute/public/brand/`
2. Copy `apps/website/public/favicon.svg` → `apps/ai-institute/public/favicon.svg`
3. Port `apps/website/src/app/globals.css` → `apps/ai-institute/src/app/website.css`
4. Port components: Header, Footer, HeroSection, MissionCards, StatsSection, PrinciplesSection, TrustLayer, CTASection, SkipNavigation
5. Rebuild `apps/ai-institute/src/app/page.tsx` using website components
6. Update `apps/ai-institute/src/app/layout.tsx` to import website.css for homepage
7. Verify visual fidelity
