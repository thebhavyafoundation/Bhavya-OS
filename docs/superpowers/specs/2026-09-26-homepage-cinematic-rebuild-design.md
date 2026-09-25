# Homepage Cinematic Rebuild — Design Spec

**Date:** 2026-09-26
**Status:** Approved design (sections 1R–4 approved in session; approval for the built result arrives via the deployed link)
**Scope:** Homepage (`/`) of `apps/ai-institute` only. Other routes unchanged.
**Method:** Control-center workflow — code + installs locally, heavy builds on GitHub Actions, visual verification on the deployed Cloudflare URL.

---

## 1. Goal

Rebuild the Bhavya Foundation homepage as an Apple-caliber cinematic scroll
story: **Promise → Practice → Proof → Invitation**. The page tells one
continuous narrative where every visual matches its beat's subject and every
claim is traceable to repository information.

**Success criteria:**

- A visitor can scroll the page and describe the institution's story in order
  (four missions, knowledge offer, structure, evidence, invitation).
- Every stat on the page carries a verification state and source; nothing invented.
- Page passes light gates locally (`tsc`, `eslint`, `tokens:check`, `antislop`)
  and full CI on GitHub.
- Visual verification on the live Cloudflare URL at desktop and mobile widths;
  `prefers-reduced-motion` renders a complete, readable static story.
- User approves via the deployed link (or returns feedback).

## 2. Hard constraints

1. **Brand tokens only** (constitution 01 + `tokens.css`): forest/ivory/gold,
   Playfair Display (display) + Inter (sans). Apple's grammar, Bhavya's voice.
   No hardcoded colors/fonts (`pnpm tokens:check` gate).
2. **Content truth** (`bhavya-content-truth`): claims from repo data modules
   only; verification states shown; honest empty states; no placeholder numbers.
3. **Hardware contract** (global AGENTS.md rule 16): local = edits, installs,
   light checks; heavy build/test = GitHub Actions (`ci.yml`,
   `deploy-cloudflare.yml` on `master`); visual truth = live URL.
4. **Push flow A:** branch → PR → CI → merge `master` → Cloudflare deploy →
   live verification.
5. **Licenses:** only MIT/CC0/public-domain code and imagery; attribution and
   license recorded for every asset in `photo_manifest.json`.

## 3. Research findings → decisions (2026 state of the art)

| Finding (source: MotionKit 2026 report, VULK Apple-scroll guide, scrollytelling.ai, adamarant 2026 stack, line25 trends)                        | Decision                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| #1 trend is scrollytelling; Apple product pages are the canonical reference; beats replace sections; "one continuous film, not separate blocks" | Narrative beats with pinned/scrubbed scenes (Section 4 arc)                                                                                      |
| GSAP 100% free since Apr 2025 (incl. SplitText, ScrollSmoother); already installed (`gsap@3.15`)                                                | Kinetic typography via SplitText-style staged reveals; ScrollTrigger for pin+scrub                                                               |
| Native CSS scroll-driven animations (`animation-timeline: scroll()/view()`) now baseline — composes the simple ~80% of effects at zero JS       | Use CSS for simple reveals/progress; GSAP for pins, scrubs, timelines                                                                            |
| Stack consensus 2026: Lenis (~3 kB, MIT) + GSAP ScrollTrigger; "scrub, never jack" — read scroll, never hijack                                  | Add `lenis` (+ React adapter), synced to GSAP ticker per official pattern                                                                        |
| INP < 200 ms is a ranking metric; animate only `transform`/`opacity`; lazy-load motion code                                                     | Performance budget in §8                                                                                                                         |
| `prefers-reduced-motion` is table stakes; reduced version must be a complete story                                                              | Static-first fallback: all beats readable, no pins/scrubs                                                                                        |
| Mobile: use `100svh` not `100vh`; most traffic is phones                                                                                        | All full-viewport beats use `svh` + mobile-reduced choreography                                                                                  |
| Content must be real HTML (crawlable); motion layered on top                                                                                    | Story text server-rendered in `page.tsx`; animation is progressive enhancement                                                                   |
| Uiverse.io (`uiverse-io/galaxy`, MIT, 3000+ elements) for micro-details                                                                         | Reference only — borrow specific interaction ideas (press states, glass cards) with creator credit; never wholesale imports that fight the brand |
| `basementstudio/scrollytelling` (React+GSAP, license "Other")                                                                                   | Skipped — in-tree GSAP components already cover it; avoid license ambiguity                                                                      |
| Openverse / Wikimedia Commons / WP Photo Directory (CC0, no API keys)                                                                           | Photo curation pipeline (§7)                                                                                                                     |
| 3D: one moment that "earns it"; lazy, DPR-capped, WebGL fallback                                                                                | `three` + `@react-three/fiber` (MIT) for Structure beat only (§6)                                                                                |

**New dependencies:** `lenis`, `three`, `@react-three/fiber` — installed
locally in the project (approved). Everything else already exists in the repo
(GSAP, framer-motion, in-tree motion/editorial components).

## 4. Narrative architecture (the ten beats)

Story arc: **Promise → Practice → Proof → Invitation.**

| #   | Beat                                                               | Visual                                                                                                  | Motion (linked vs triggered)                                                                                           |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **Promise** — hero: "Building for Generations."                    | Full-bleed photograph (Himalaya/forest), forest scrim                                                   | Triggered: staged word reveal, image 1.05→1 scale, sub-line fade-up; frosted header appears after 80 px                |
| 2   | **Thesis** — one institutional sentence                            | Ivory whitespace                                                                                        | Triggered: line-mask reveal                                                                                            |
| 3–6 | **Four mission chapters** (Forest, Knowledge, Heritage, Community) | Sticky full-viewport photo per chapter, crossfading on scrub; chapter number 01–04                      | Linked: pinned panel + scrubbed crossfade/parallax (`ScrubParallax`/`ScrubExit`, ScrollTrigger); text steps trigger in |
| 7   | **Knowledge deep dive** — "Free AI education for rural India"      | Classroom imagery + stat moment `13 levels · 74 modules` (from `src/data/curriculum-levels.ts`)         | Triggered: count-up on enter, magnetic CTA                                                                             |
| 8   | **Structure** — constitution-bound, four pillars                   | Typographic diagram + **3D signature**: rotating particle sphere, four gold node clusters (§6)          | Linked: slow idle rotation + cursor tilt; lazy WebGL                                                                   |
| 9   | **Bhavya OS** (forest-dark panel) + **Evidence**                   | Glass cards for four system entries; `ProofStrip` stats with `verified`/`reported` chips + source lines | Triggered: staggered bento reveal; count-ups                                                                           |
| 10  | **Invitation** — "Shape what endures" close                        | Ivory, single CTA + Volunteer                                                                           | Triggered: final line reveal, magnetic CTA                                                                             |

Fixed **chapter rail** (edge indicator 01–04 …) tracks story position.
Footer unchanged. Every beat keeps exit points (CTAs/links) — no scroll tunnel.

## 5. Visual & motion system

- **Type:** hero Playfair `clamp(3.5rem, 12vw, 9rem)`, leading ~0.95,
  tracking −0.02em; section heads `clamp(2.25rem, 6vw, 4.5rem)`; body Inter
  17–19 px / 1.6 / max 65ch; eyebrows Inter uppercase 12 px, 0.14em, gold.
- **Layout:** beats on `100svh`; rhythm 160–240 px; 1200 px container;
  imagery full-bleed with forest-tint scrim; one forest-dark contrast panel
  (Bhavya OS) per page; gold reserved for hairlines/stat numbers/CTA accents.
- **Header:** transparent → frosted glass (`backdrop-blur` + hairline) after
  80 px; magnetic link hover; mobile full-screen sheet, staggered entrance.
- **Easing:** entrances `cubic-bezier(0.22, 1, 0.36, 1)`; scroll work scrubbed
  (linked) or IntersectionObserver-triggered — never timed autoplay on scroll.
- **Toolkit split:** CSS scroll-driven for simple reveals/progress hairline;
  GSAP ScrollTrigger for pins/scrubs/timelines; framer-motion for component
  entrance/layout; Lenis for smooth scroll (synced: `lenis.on('scroll',
ScrollTrigger.update)` + GSAP ticker, `lagSmoothing(0)`); reduced-motion via
  `gsap.matchMedia()` + Lenis disable.
- **Reuse in-tree:** `MotionProvider`, `HeroEntrance`, `ScrollReveal`,
  `TextReveal`, `ScrubExit`, `ScrubParallax`, `Stagger`, `MagneticButton`,
  `TiltCard`, `ScrollProgress`, `FloatingElement`, `PhotoPlate`, `MissionChapter`,
  `ProofStrip`, `EditorialLink`.

## 6. 3D signature moment (Structure beat)

- `three` + `@react-three/fiber`: slow-rotating particle sphere; four gold
  node clusters = four pillars; forest-tinted haze; idle drift + few-degree
  cursor tilt.
- Engineering: `React.lazy`/`Suspense` code-split; DPR capped at 2; rendering
  paused off-screen; no textures (procedural points only); WebGL-unavailable →
  static gradient fallback (content identical).
- Appears once on the page. Hero stays photographic.

## 7. Imagery pipeline (no paid APIs)

1. Keep the 5 real photos already in `public/photography/`.
2. Curate replacements/additions via Openverse + Wikimedia Commons APIs
   (license filter `cc0`/`pdm`), hand-picked so subject matches beat
   (forest→forest, knowledge→classroom, heritage→stonework, community→village).
3. Convert to responsive WebP + JPEG fallback; compress; add to
   `public/photography/`.
4. Record every image in `photo_manifest.json`: source URL, license, author,
   whether actual or representative.
5. Hero degrades gracefully: photograph → SVG art (topographic/atmosphere) →
   gradient — page must never depend on one remote asset.

## 8. Performance & accessibility budget

- Animate only `transform`/`opacity`; no layout-property animation.
- Motion code lazy; WebGL lazy; images `loading="lazy"` except hero
  (`priority`), explicit dimensions to protect CLS.
- INP: no main-thread work during scroll beyond GSAP's rAF; scrub, never hijack.
- `prefers-reduced-motion: reduce` → pins/scrubs/parallax disabled, end states
  rendered, Lenis off, content identical (static story must still read in order).
- SEO: all beat copy in server-rendered HTML; animation enhances only.
- `100svh` beats; mobile choreography reduced (fewer pins, shorter scrubs).

## 9. Verification loop

1. Local light gates: `npx tsc --noEmit`, `npx eslint src`,
   `pnpm tokens:check`, `pnpm antislop` (+ `file-map`/`drift:check` as needed).
2. Push branch → PR → GitHub Actions CI (lint/typecheck/test/build) — the
   heavy verification.
3. Merge to `master` → `deploy-cloudflare.yml` → Worker `bhavya-foundation`.
4. Playwright on `https://bhavya-foundation.thebhavyafoundation.workers.dev/`:
   desktop + mobile, top-to-bottom scroll, reduced-motion pass; screenshots.
5. Deliver link for approval; iterate on feedback (repeat 1–5).

## 10. Out of scope

- Other routes, brand/token changes, constitutional docs, auth flows.
- The `/register?intent=educator|researcher` bug (reported separately).
- Governance 8th-child IA question (reported separately).
- Local full builds/tests (contract: GitHub Actions only).

## 11. Risks & mitigations

| Risk                                                         | Mitigation                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Working tree holds 230+ files from parallel sessions         | Build on the working tree (approved); stage only files the homepage + this task own when opening the PR |
| GSAP plugin availability (SplitText etc.) in `gsap@3.15` npm | Verify import at implementation; fallback to in-tree `TextReveal` splitting                             |
| Openverse images with unclear subject/quality                | Hand-pick with browser preview; record provenance; drop anything unverifiable                           |
| Scroll choreography jank on low-end mobile                   | Mobile beat variants: fewer pins, CSS-only reveals; test on live URL at mobile viewport                 |
| PR includes mixed parallel work                              | PR description enumerates task-owned files; CI is the gate                                              |
