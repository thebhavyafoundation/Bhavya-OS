# CAPABILITY GRAPH

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10

---

## Purpose

Maps skills → capabilities → tasks → related capabilities → validation. Enables task-driven skill discovery and composition.

---

## Major Domains

### 1. Design Domain

```
SKILL: ui-ux-pro-max
  ↓
CAPABILITY: Design intelligence (style search, palette selection, font pairing, UX guidelines)
  ↓
TASK: New page design, component creation, style review
  ↓
RELATED: brand, design-system, ui-styling
  ↓
VALIDATION: browser-automation, visual-review
```

```
SKILL: brand
  ↓
CAPABILITY: Brand identity, voice, visual standards, token sync
  ↓
TASK: Brand definition, style guide, asset validation
  ↓
RELATED: design-system, design
  ↓
VALIDATION: asset-validation, color-extraction
```

```
SKILL: design-system
  ↓
CAPABILITY: Token architecture, CSS variables, component states
  ↓
TASK: Design token creation, Tailwind config, component specification
  ↓
RELATED: brand, ui-styling, platform-ui
  ↓
VALIDATION: token-validation, CSS-variable-check
```

### 2. Frontend Domain

```
SKILL: ui-styling
  ↓
CAPABILITY: shadcn/ui components, Tailwind CSS, responsive layouts, accessibility
  ↓
TASK: Component implementation, styling, responsive design
  ↓
RELATED: design-system, gsap-react, frontend-patterns
  ↓
VALIDATION: browser-automation, accessibility-check
```

```
SKILL: gsap-core + gsap-react + gsap-scrolltrigger + gsap-timeline
  ↓
CAPABILITY: Animation (tweens, scroll, sequencing, React integration)
  ↓
TASK: Page animation, scroll effects, motion design
  ↓
RELATED: ui-styling, design-system
  ↓
VALIDATION: browser-automation, performance-check, reduced-motion-check
```

### 3. Content Domain

```
SKILL: design (slides sub-skill)
  ↓
CAPABILITY: HTML presentations, Chart.js integration, copywriting
  ↓
TASK: Presentation creation, pitch deck, data visualization
  ↓
RELATED: design-system, brand
  ↓
VALIDATION: browser-automation
```

```
SKILL: banner-design
  ↓
CAPABILITY: Multi-platform banners, AI image generation
  ↓
TASK: Campaign creative, social media assets, ad banners
  ↓
RELATED: ui-ux-pro-max, brand
  ↓
VALIDATION: browser-automation, dimension-check
```

### 4. Agent/Architecture Domain

```
SKILL: icm-architect
  ↓
CAPABILITY: ICM workspace design, folder restructuring, stage contracts
  ↓
TASK: Workspace organization, agent architecture, workflow design
  ↓
RELATED: ICM methodology, context routing
  ↓
VALIDATION: walk-test
```

---

## Task Classification Matrix

| Task Type              | Primary Skills                            | Supporting Skills                            | Validation Skills                                |
| ---------------------- | ----------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| **New page/component** | ui-ux-pro-max, ui-styling                 | design-system, brand, gsap-react             | browser-automation, verification-loop            |
| **Homepage**           | ui-ux-pro-max, ui-styling, brand          | design-system, gsap-core, gsap-scrolltrigger | browser-automation, seo-audit, verification-loop |
| **Banner/creative**    | banner-design                             | ui-ux-pro-max, brand                         | browser-automation                               |
| **Logo/branding**      | design                                    | brand, ui-ux-pro-max                         | browser-automation                               |
| **Presentation**       | slides, design                            | design-system                                | browser-automation                               |
| **Animation**          | gsap-core, gsap-react, gsap-scrolltrigger | gsap-timeline, gsap-performance              | browser-automation, performance-check            |
| **Token system**       | design-system                             | brand                                        | token-validation                                 |
| **Style review**       | ui-ux-pro-max                             | design-system                                | browser-automation, verification-loop            |
| **Workspace design**   | icm-architect                             | —                                            | walk-test                                        |
| **Component styling**  | ui-styling                                | design-system, ui-ux-pro-max                 | browser-automation                               |
| **Responsive design**  | ui-styling, ui-ux-pro-max                 | —                                            | browser-automation                               |
| **Accessibility**      | ui-styling, ui-ux-pro-max                 | —                                            | accessibility-check                              |

---

## Skill Selection Rules

1. **Always start with ui-ux-pro-max** for design decisions — it provides data-driven recommendations
2. **Always use brand** before design-system — brand provides the primitives
3. **Always use design-system** before ui-styling — tokens must exist before components
4. **Always use gsap-core** as the base for any GSAP skill — dependencies flow upward
5. **Never skip validation** — every skill output must be verified
6. **Never create competing design systems** — all skills subordinate to platform-ui
