# Bhavya Foundation — Design-Integration Plan

**Session:** Bhavya Experience Studio  
**Scope:** Design integration only — visual direction, component selection, storytelling structure, motion discipline, asset curation, implementation planning  
**Boundary:** No code push, no PRs, no deployment/CI, no release mechanics  
**Status:** READY FOR CURATED INTEGRATION

---

## 1. Bhavya Design Direction

**Identity:** Mission-driven, cinematic, modern, premium-but-disciplined. Coherent, not template-like. Not startup-generic. Not over-decorated.

**Core tenets (from Bhavya constitution + AGENTS.md):**

- Brand authority: `docs/constitution/01-BRAND-CONSTITUTION.md` (palette, fonts, voice) prevails over `05-DESIGN-SYSTEM.md` on conflict (00 §5.4).
- Implementation SoT: `packages/platform-ui/src/styles/tokens.css` + `packages/platform-ui/src/components/` — `--color-*` forest/ivory/gold, `--font-display` Playfair, `--font-sans` Inter.
- Gate: `pnpm tokens:check`. No hardcoded colors/fonts. No new primitive when platform-ui already has one.
- OPEN: exact hex/palette alignment among 01 vs 05 vs `tokens.css` is unresolved — do not amend constitutional text or tokens to force agreement during routine work.

**Visual mood:** Forest-deep / ivory / gold. Editorial serif (Playfair) for display; Inter for sans. Generous whitespace. Editorial layout rhythm. Motion only when it strengthens meaning.

**Machine contract:** Cloud-first inspiration. All local work/assets/temp on D:. Selective integration over bulk importing. No giant libraries. No heavy local preview.

---

## 2. Resource Classification Table

| Resource              | Classification                                | Role in Bhavya                                                                                                                    | Rationale                                                                  |
| --------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **shadcn/ui**         | Code foundation — approved                    | Base primitives: forms, dialogs, sheets, tabs, accordions, nav patterns, input primitives. Wrap + restyle into Bhavya components. | Accessible, open-source, primary structural foundation per license rules.  |
| **21st.dev**          | Selective implementation — approved w/ review | Occasional section/layout imports only after per-component license + dependency + motion inspection.                              | License/weight uncertainty. Reject generic/flashy/heavy/inconsistent.      |
| **Magic UI**          | Selective effects — approved (free/open only) | High-leverage premium moments: subtle text effects, beams, marquee, spotlight, grid accents, tasteful hero embellishments.        | Gimmicky components rejected.                                              |
| **Minimal Gallery**   | Inspiration only                              | Page rhythm, whitespace, premium restraint, composition quality. Do not imitate brand styling.                                    | Reference only; no code/asset reuse.                                       |
| **Kage**              | Inspiration only                              | Interface patterns, promptable UI structures. Extract layout/system ideas, not visual cloning.                                    | Reference only.                                                            |
| **AppShot Gallery**   | Inspiration only                              | Mobile composition, onboarding framing, cards, screenshot rhythm. Adapt for curriculum storytelling.                              | Reference only.                                                            |
| **Refero Styles**     | Inspiration only                              | Repeatable systems: type scales, section structure, card logic, nav/footer patterns.                                              | Reference only.                                                            |
| **VibePrompt**        | Inspiration only                              | Layout idea generation, prompt sharpening. Never dictates brand.                                                                  | Reference only.                                                            |
| **Uiverse**           | Selective — sparing                           | Micro-interactions only, after cleanup + restyling. Never raw-dropped into production.                                            | Needs cleanup; licensing unclear per asset.                                |
| **Liquid Glass**      | Experimental — avoid for now                  | One bounded showcase moment only if performance + readability hold. Not global nav/card.                                          | High risk: blur/glass over moving content violates performance discipline. |
| **Motion Primitives** | Avoid (default)                               | Only if a specific motion need isn't solvable by existing stack. Avoid duplicate animation engines.                               | Redundant with shadcn + Magic UI + CSS.                                    |
| **Kinetics**          | Avoid (default)                               | Same as above. Prefer one coherent motion model.                                                                                  | Redundant.                                                                 |
| **Anime.js**          | Avoid (default)                               | Same. Only if a specific need outweighs adding another engine.                                                                    | Adds bundle weight; duplicates responsibility.                             |
| **3dicons**           | Selective — approved                          | Where 3D improves comprehension/warmth/playfulness. Style-consistent.                                                             | Use sparingly.                                                             |
| **Kitbitz**           | Selective — approved                          | Educational illustration / diagram accents where they strengthen meaning.                                                         | Keep style consistency; don't mix too many styles.                         |

---

## 3. Approved Core Stack

| Layer                    | Tool                                         | Role                                                                          |
| ------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------- |
| Structural primitives    | shadcn/ui                                    | Forms, dialogs, sheets, tabs, accordions, nav, inputs                         |
| Design tokens            | `packages/platform-ui/src/styles/tokens.css` | `--color-*` forest/ivory/gold, `--font-display` Playfair, `--font-sans` Inter |
| Animated accents         | Magic UI (free/open)                         | Subtle hero embellishments, beams, marquee, spotlight, grid                   |
| Section/layout reference | 21st.dev (per-component review)              | Occasional curated imports                                                    |
| 3D accents               | 3dicons                                      | Comprehension/warmth moments                                                  |
| Illustration             | Kitbitz + bespoke SVG                        | Educational/diagram accents                                                   |
| Motion                   | CSS transitions + shadcn primitives          | Minimal structural motion + scroll reveals                                    |

**Not in stack:** Anime.js, Kinetics, Motion Primitives, Liquid Glass (global), Uiverse (raw), any paid/ambiguous-license asset.

---

## 4. Component Integration Map

| Component type                         | Source                            | Bhavya treatment                                    |
| -------------------------------------- | --------------------------------- | --------------------------------------------------- |
| Button, Input, Select, Checkbox, Radio | shadcn/ui                         | Restyle to forest/ivory/gold tokens; Bhavya wrapper |
| Dialog, Sheet, Drawer                  | shadcn/ui                         | Restyle surfaces; editorial typography              |
| Tabs, Accordion                        | shadcn/ui                         | Restyle; motion = subtle slide/fade                 |
| Navigation (primary, footer)           | Bespoke + shadcn primitives       | Custom Bhavya nav using Inter + Playfair tokens     |
| Forms (contact, participate)           | shadcn/ui + bespoke layout        | Accessible primitives, Bhavya validation styling    |
| Hero embellishment                     | Magic UI (beam/spotlight/marquee) | One bounded moment; reduced-motion fallback         |
| Diagram / infographic                  | Bespoke SVG + Kitbitz             | Curriculum storytelling; accessible alt text        |
| 3D icon moments                        | 3dicons                           | Bounded showcase; no continuous motion              |
| Curriculum cards                       | Bespoke on shadcn Card            | Restyled; consistent radius/shadow/spacing          |

**shadcn-built vs imported:**

- Built on shadcn primitives: buttons, inputs, dialogs, sheets, tabs, accordions, nav, cards, forms.
- Imported/adapted (selective): Magic UI beam/spotlight/marquee; 21st.dev section patterns (post-review).
- Handcrafted bespoke: hero layout, curriculum rhythm, impact/trust sections, diagram transitions.

---

## 5. Motion and 3D Policy

**Motion layers (in order of use):**

1. Minimal structural motion (CSS transitions on shadcn primitives) — default.
2. Scroll reveals — home page, mission, curriculum sections.
3. Sticky storytelling sections — impact/governance pages.
4. Diagram transitions — curriculum/program pages.
5. 3D moments — bounded showcase only (3dicons).
6. Hover interactions — subtle, accessible.
7. Reduced-motion fallback — full support via `prefers-reduced-motion`.

**Hard rules:**

- No effect without narrative value.
- No stacked animation engines on one interaction.
- No broad blur/glass over moving content (rules out Liquid Glass globally).
- No default continuous 3D motion unless justified.
- One coherent motion model (CSS + shadcn + selective Magic UI only).

---

## 6. Asset / Illustration Policy

**Approved:**

- **3dicons:** Selective, style-consistent, bounded moments.
- **Kitbitz:** Educational illustration accents; keep style consistency across all chosen assets.
- **Diagrams:** Bespoke SVG infographics for curriculum/program storytelling.
- **SVG infographics:** Handcrafted; accessible alt text; no raster text.
- **Hero visuals:** Bespoke or licensed editorial photography; no AI slop composition.
- **Screenshots/mockups:** AppShot Gallery rhythm adapted; original captures preferred.
- **Environmental/story imagery:** Original or clearly licensed; mission-aligned.

**Not approved:**

- Mixing multiple illustration styles.
- Raw Uiverse drops.
- Marketplace preview assets assumed reusable.
- Ambiguous-license 3D/illustration packs.

---

## 7. Performance and Licensing Cautions

**Performance:**

- No large library for one trivial flourish.
- No Anime.js/Kinetics/Motion Primitives unless a specific need outweighs bundle cost.
- All local assets/downloads on D:.
- Cloud-hosted inspiration browsing; hosted previews; selective copying only.

**Licensing:**

- shadcn/ui: open-source, primary foundation. Preserve notices.
- Magic UI: free/open components only that fit.
- 21st.dev: inspect each component's actual license before shipping. Demos/media not automatically reusable.
- 3dicons/Kitbitz: inspect per-asset license.
- Never assume marketplace preview asset reusable.
- If ambiguous → flag instead of using.

---

## 8. First Integration Priorities (Immediate → Next → Later → Never)

**Immediate (now):**

1. Define Bhavya token map in `packages/platform-ui/src/styles/tokens.css` — forest/ivory/gold, Playfair + Inter (align with 01/05 constitution; note OPEN hex conflict, don't force resolution).
2. Build shadcn-based Button, Input, Dialog, Sheet wrapped into Bhavya components.
3. Build bespoke nav + footer using Refero Styles structural reference (not visual clone).
4. Home page hero: editorial typography + one Magic UI beam/spotlight accent (reduced-motion safe).
5. Set up D: as default for all local assets/temp (already configured).

**Next:** 6. Curriculum/program cards (shadcn Card + bespoke layout). 7. Scroll-reveal sections on home + mission pages. 8. Diagram/infographic system for curriculum pages (Kitbitz + bespoke SVG). 9. One bounded 3dicons moment on a showcase section.

**Later:** 10. Selective 21st.dev section imports (post license review). 11. Liquid Glass single showcase moment (if performance/readability hold). 12. Additional Magic UI accents (marquee, grid).

**Never:**

- Anime.js, Kinetics, Motion Primitives (duplicate motion engines).
- Liquid Glass as global nav/card treatment.
- Uiverse raw drops.
- Ambiguous/paid marketplace assets.
- AI slop landing-page composition.
- Stacked animation engines.

---

## 9. Final Status

**READY FOR CURATED INTEGRATION**

The core stack (shadcn/ui + tokens.css + selective Magic UI) is licensed-safe, performant, and machine-contract compliant. Resource classification is complete. First integration priorities are defined. No code push or deployment is part of this session.
