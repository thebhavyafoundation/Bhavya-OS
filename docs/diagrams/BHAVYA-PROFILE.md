# Bhavya Diagram Profile

**Stage:** 3 — Bhavya profile  
**Derived from:** `packages/platform-ui/src/styles/tokens.css` (canonical design tokens)  
**Applies to:** Diagram Design skill output for Bhavya Foundation  
**Upstream skill:** diagram-design @ `b46c9701f035844a20b13ab0551315977188933b`  
**Font source:** `system` (no Google Fonts request in any Bhavya diagram)

---

## 1. Semantic role tokens

Values resolve against `packages/platform-ui/src/styles/tokens.css`. Diagram Design references roles by name (`{paper}`, `{ink}`, `{accent}`, …) — no hex values are inlined in diagram sources.

### Light mode (default)

| Role          | Bhavya token source      | Hex                     | Purpose                                      |
| ------------- | ------------------------ | ----------------------- | -------------------------------------------- |
| `paper`       | `--color-bg-primary`     | `#f7f4ec`               | Page background, default node fill           |
| `paper-2`     | `--color-bg-secondary`   | `#ede8db`               | Diagram container background, secondary fill |
| `ink`         | `--color-text-primary`   | `#0e382e`               | Primary text, primary stroke                 |
| `ink-strong`  | `--color-text-primary`   | `#0e382e`               | High-contrast text on accent fills           |
| `muted`       | `--color-text-tertiary`  | `#546342`               | Secondary text, default arrow stroke         |
| `soft`        | `--color-text-secondary` | `#3e4a32`               | Sublabels, boundary labels                   |
| `rule`        | `--color-border-primary` | `rgba(14,56,46,0.12)`   | Hairline borders                             |
| `rule-solid`  | `rgba(14,56,46,0.30)`    | `rgba(14,56,46,0.30)`   | Stronger borders, baselines                  |
| `accent`      | `--color-brand-gold`     | `#d4af37`               | Focal accent, 1–2 elements max               |
| `accent-tint` | `rgba(212,175,55,0.15)`  | `rgba(212,175,55,0.15)` | Fill for accent-bordered boxes               |
| `link`        | `--color-forest-500`     | `#2d8a45`               | HTTP/API calls, external arrows              |

### Dark mode (`.dark`)

| Role          | Bhavya token source             | Hex                      | Purpose                              |
| ------------- | ------------------------------- | ------------------------ | ------------------------------------ |
| `paper`       | `--color-bg-primary` (dark)     | `#0a1f15`                | Page background, default node fill   |
| `paper-2`     | `--color-bg-secondary` (dark)   | `#0e2a1c`                | Diagram container background         |
| `ink`         | `--color-text-primary` (dark)   | `#f7f4ec`                | Primary text, primary stroke         |
| `ink-strong`  | `--color-text-primary` (dark)   | `#f7f4ec`                | Text on accent fills                 |
| `muted`       | `--color-text-secondary` (dark) | `#b8c7bc`                | Secondary text, default arrow stroke |
| `soft`        | `--color-text-tertiary` (dark)  | `#8a9a8b`                | Sublabels, boundary labels           |
| `rule`        | `--color-border-primary` (dark) | `rgba(247,244,236,0.08)` | Hairline borders                     |
| `rule-solid`  | `rgba(247,244,236,0.20)`        | `rgba(247,244,236,0.20)` | Stronger borders                     |
| `accent`      | `--color-accent-gold` (dark)    | `#e8c04a`                | Focal accent, 1–2 elements max       |
| `accent-tint` | `rgba(232,192,74,0.15)`         | `rgba(232,192,74,0.15)`  | Fill for accent-bordered boxes       |
| `link`        | `--color-forest-500` (dark)     | `#2d8a45`                | HTTP/API calls, external arrows      |

## 2. Divider / hairline colour

`rule` = `rgba(14,56,46,0.12)` light / `rgba(247,244,236,0.08)` dark. Used for node borders, connector hairlines, and dividers. Never the sole carrier of meaning.

## 3. Typography

| Role                         | Family (CSS variable)     | Fallback stack                            | Size    | Weight | Usage                               |
| ---------------------------- | ------------------------- | ----------------------------------------- | ------- | ------ | ----------------------------------- |
| `title` / heading            | `--font-display`          | `Playfair Display`, Georgia, serif        | 1.75rem | 400    | Page H1, diagram eyebrow            |
| `node-name`                  | `--font-sans`             | `Inter`, system-ui, sans-serif            | 12px    | 600    | Human-readable labels               |
| `sublabel` / technical-label | `--font-mono`             | `JetBrains Mono`, ui-monospace, monospace | 9px     | 400    | Ports, protocols, URLs, field types |
| `arrow-label`                | `--font-mono`             | `JetBrains Mono`, ui-monospace, monospace | 8px     | 400    | Arrow annotations                   |
| `callout`                    | `--font-display` _italic_ | Playfair Display, Georgia, serif          | 14px    | 400    | Editorial asides only               |

**Hindi fallback:** `Noto Sans Devanagari`, `Noto Serif Devanagari` appended to the relevant stacks where Hindi labels appear (system-installed; no web font request). Devanagari text never set in mono.

**Font source:** `system` — no `<link>` to `fonts.googleapis.com`, no `@import`, no external font request. Stacks end in generic families (`serif`, `system-ui, sans-serif`, `ui-monospace, monospace`) so viewers with Playfair/Inter/JetBrains Mono installed still receive them.

**Do not** use Instrument Serif, Geist, or Geist Mono (upstream defaults) — Bhavya uses self-hosted Playfair Display + Inter.

## 4. Minimum contrast requirements

| Use                                                                            | Minimum vs. actual background             |
| ------------------------------------------------------------------------------ | ----------------------------------------- |
| Regular text (incl. `muted`, `soft`, `link` used as text)                      | 4.5:1                                     |
| Large text (≥24px, or ≥18.7px at weight 600+)                                  | 3:1                                       |
| Essential non-text marks (lines, arrows, borders, focus outlines, data points) | 3:1 against adjacent color                |
| Decorative rules / translucent tints (`rule`, `accent-tint`, fills at opacity) | No minimum; never sole carrier of meaning |

Light-mode spot checks (against `paper` `#f7f4ec`): `ink` #0e382e ≫ 4.5:1 ✓; `muted` #546342 ≈ 4.8:1 ✓; `soft` #3e4a32 ≈ 5.6:1 ✓; `link` #2d8a45 as a stroke (non-text) ≈ 3.5:1 ✓ (3:1 non-text bar). Dark mode mirrors via the dark column above.

`accent` #d4af37 / #e8c04a does **not** clear 4.5:1 as body text on `paper`; it is therefore **never used as body text**. It appears only as focal stroke/fill (≤2 elements), where the 3:1 non-text bar applies, and any label sitting on an accent fill uses `ink-strong`.

## 5. Approved accent usage

- One accent colour (`accent`, brand gold) for one or two focal elements per diagram.
- Accent is editorial, not a signalling system. Do not accent four or more nodes.
- All other nodes/arrows use `ink`, `muted`, `soft`, or `link`.
- Legend (if any) covers every type used and nothing extra; it is a horizontal bottom strip.

## 6. Chart colour exceptions

Multi-series charts may use the Bhavya data-visualization category palette (from `tokens.css` § Data Visualization):

| Token        | Hex       | Use              |
| ------------ | --------- | ---------------- |
| `viz-forest` | `#2d8a45` | Non-focal series |
| `viz-gold`   | `#d4af37` | Non-focal series |
| `viz-earth`  | `#6a7c52` | Non-focal series |
| `viz-sage`   | `#8a9a8b` | Non-focal series |

Restricted to chart types that genuinely need to distinguish overlapping entities (radar, bar, line, treemap, heatmap, scatter). The 1-focal rule still holds: `accent` is reserved for the focal series. Do not backfill these colours to architecture, flow, or org-chart types.

## 7. Print behaviour

- Diagrams print at natural SVG size; explicit `width`/`height` and `viewBox` prevent layout shift.
- Background colours print; no reliance on screen-only shadows (none used).
- Reduced motion (`prefers-reduced-motion: reduce`) shows the complete static frame; motion controls hidden.
- Fonts are system stacks, so print output needs no network.

## 8. What this profile deliberately does NOT do

- Does not use the upstream default tangerine/jet-black skin (`paper #f5f5f5`, `ink #2d3142`, `accent #bf4520`).
- Does not load Google Fonts or any external font.
- Does not modify `tokens.css`, constitutional documents, or brand meaning.

## 9. Local marker (optional)

A project-level `.diagram-design` marker may contain `profile: bhavya` to select this profile. The canonical profile source is this file in Git; no machine-specific absolute paths are committed. A sync script may copy this profile into a user configuration directory only if the upstream profile mechanism supports it without writing machine-specific paths into Git (it does not, so the marker references this document by name only).
