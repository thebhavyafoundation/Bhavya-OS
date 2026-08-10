# SKILL REGISTRY

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10
**Machine-readable:** `config/skills/registry.json`

---

## Overview

| Metric                    | Count                       |
| ------------------------- | --------------------------- |
| Total registered skills   | 29                          |
| Design skills             | 7                           |
| Frontend/animation skills | 10                          |
| Agent/methodology skills  | 1                           |
| Legacy registry skills    | 12                          |
| Skill categories          | 3 (design, frontend, agent) |

---

## Skill Inventory

### Design Skills (`.opencode/skills/`)

| Skill           | Purpose                           | Key Capability                                 | Dependencies                     |
| --------------- | --------------------------------- | ---------------------------------------------- | -------------------------------- |
| `banner-design` | Multi-format banner design        | AI-generated visuals, 22 styles                | ui-ux-pro-max                    |
| `brand`         | Brand voice, visual identity      | Token sync, asset validation                   | None                             |
| `design`        | Unified design skill              | Logo (55 styles), CIP, slides, banners, icons  | brand, design-system, ui-styling |
| `design-system` | Token architecture, CSS variables | Three-layer tokens, Tailwind config            | brand, ui-styling                |
| `slides`        | HTML presentations                | Chart.js, copywriting formulas                 | design-system                    |
| `ui-styling`    | shadcn/ui + Tailwind styling      | Accessible UI, responsive layouts              | None                             |
| `ui-ux-pro-max` | Design intelligence database      | 67 styles, 161 palettes, 57 fonts, 99 UX rules | Python 3                         |

### Frontend/Animation Skills (`~/.config/opencode/skills/gsap/`)

| Skill                | Purpose                  | Key Capability                        |
| -------------------- | ------------------------ | ------------------------------------- |
| `gsap-core`          | Core GSAP API            | Tweens, easing, stagger, matchMedia   |
| `gsap-react`         | GSAP + React             | useGSAP hook, refs, context cleanup   |
| `gsap-scrolltrigger` | Scroll animations        | Pinning, scrub, scroll triggers       |
| `gsap-timeline`      | Animation sequencing     | Timeline, position parameter          |
| `gsap-utils`         | GSAP utilities           | clamp, mapRange, normalize, snap      |
| `gsap-frameworks`    | GSAP + Vue/Svelte        | Lifecycle, scoping, cleanup           |
| `gsap-plugins`       | Plugin registration      | ScrollTo, Flip, Draggable, SplitText  |
| `gsap-performance`   | Performance optimization | Transform-only, will-change, batching |

### Agent/Methodology Skills

| Skill           | Purpose              | Key Capability                         |
| --------------- | -------------------- | -------------------------------------- |
| `icm-architect` | ICM workspace design | Folder structure as agent architecture |

---

## Cross-Skill Dependency Graph

```
banner-design ──→ ui-ux-pro-max
design ────────→ brand, design-system, ui-styling
design-system ─→ brand, ui-styling
slides ────────→ design-system
gsap-react ────→ gsap-core
gsap-scrolltrigger → gsap-core
gsap-timeline ─→ gsap-core
gsap-utils ────→ gsap-core
gsap-frameworks → gsap-core
gsap-plugins ──→ gsap-core
gsap-performance → gsap-core
```

---

## Skill Format

All primary skills use `SKILL.md` format with:

- Version, author, license
- Capabilities list
- Trigger conditions
- Input/output specifications
- Prerequisites
- References (markdown files with detailed guidance)
- Scripts (where applicable)
- Templates (where applicable)

Legacy skills (bhavya-ai-lab) use JSON registry format.

---

## Maintenance

- **Registry location:** `config/skills/registry.json`
- **Documentation:** `docs/architecture/SKILL_REGISTRY.md`
- **Update rule:** When a skill is added, removed, or its capabilities change, update both the JSON registry and this document in the same change.
- **Validation:** Skills must be actually installed to be registered. No fabricated entries.
