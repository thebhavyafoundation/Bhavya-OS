# Review Checklist — Diagram Design

**Stage:** 14 — Documentation  
Run before promoting any diagram to `approved`. A diagram is not approved until every applicable item passes.

## Factual correctness

- [ ] Every claim traces to a named content source listed in `content_sources`
- [ ] No inferred authority, data, or relationships beyond the source documents
- [ ] Governance diagrams reviewed against Constitution / Trust Deed / Board Charter / Governance Manual
- [ ] Curriculum diagrams consistent with the 86-module registry and four bands

## Source traceability

- [ ] Manifest `content_sources` lists all institutional documents used
- [ ] Manifest `review.content`, `review.subject`, `review.governance`, `review.accessibility` all present
- [ ] `licensing.generator_commit` matches the pinned upstream commit

## Visual hierarchy

- [ ] One accent colour maximum, on 1–2 focal elements
- [ ] No legend floating inside the diagram area
- [ ] No vertical `writing-mode` text on arrows
- [ ] Hierarchy visible from node treatment, not colour alone

## Unnecessary-node deletion

- [ ] Every remaining node represents a distinct idea
- [ ] Mergable nodes (always travel together) are merged
- [ ] Removable arrows (relationship obvious from layout) removed
- [ ] Density at 4/10 or below; above 9 nodes split into two diagrams

## Colour restraint

- [ ] Accent = Bhavya gold `#d4af37`, never body text
- [ ] Labels on accent fills use `ink` #0e382e
- [ ] Chart colour exceptions limited to multi-series chart types
- [ ] No shadows; borders only

## Readability

- [ ] `<title>` ≤ 60 chars, first child of `<svg>`
- [ ] `<desc>` one sentence about content, not geometry
- [ ] `aria-labelledby` resolves to `<title>` + `<desc>`
- [ ] Node names in Inter, technical labels in JetBrains Mono
- [ ] Hindi labels use Noto Devanagari fallback; never mono for Devanagari

## Accessibility

- [ ] SVG has `role="img"` and `role`-resolving accessible name
- [ ] `<title>` / `<desc>` IDs slug-prefixed, never bare `title`/`desc`
- [ ] Arrow labels on opaque masks with 6–10px gap from stroke
- [ ] Orthogonal connectors only (rounded elbows `r=8`); no diagonals
- [ ] No shared/stacked connector strokes; bridge/hop at crossings
- [ ] Distinct attach point per connector on a shared edge (≥12px apart)
- [ ] No transit behind a non-endpoint box (except documented unavoidable case)
- [ ] Contrast: regular text ≥4.5:1, large text ≥3:1, non-text marks ≥3:1
- [ ] Works at 200% zoom; works on 375px mobile
- [ ] `prefers-reduced-motion` shows complete static frame

## Hindi resilience

- [ ] Devanagari text legible at diagram sizes
- [ ] System font fallback used; no web font request

## Mobile layout

- [ ] Explicit `width`/`height` + `viewBox`; no layout shift
- [ ] SVG inside local `overflow-x: auto`; `min-width` equals viewBox width
- [ ] Lazy-loaded below-fold (`loading="lazy"`)

## Print output

- [ ] Prints at natural SVG size; explicit dimensions prevent shift
- [ ] No reliance on screen-only effects (no shadows)
- [ ] System fonts print without network

## Licensing

- [ ] MIT generator licence recorded; third-party icon licences noted
- [ ] No trademark implication of endorsement
- [ ] No credentials, internal URLs, or secret names

## Governance approval (where applicable)

- [ ] `foundation-governance-structure`: `review.governance` = approved (pending)
- [ ] `responsible-ai-lifecycle`: `review.governance` = approved (pending)
- [ ] No draft diagram presented as approved institutional information
