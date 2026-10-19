# BRAND TOKEN AUDIT

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Canonical source:** `packages/platform-ui/src/styles/tokens.css`
**Gate:** `pnpm tokens:check` — generated copies in every app must match source.

---

## 1. Correction to an earlier finding

An earlier pass in this branch reported that no danger hue existed in the brand
palette and that a new token would need constitutional authority. **That was
wrong.** The canonical source already defined:

```
--color-status-success: #2d8a45
--color-status-warning: #d4af37
--color-status-error:   #c0392b
--color-status-info:    #2980b9
```

The problem was never a missing role. It was that components referenced the
roles by invented names — `accent-red`, `accent-yellow`, `accent-blue`,
`accent-purple` — which are defined nowhere in the repository. So this was a
remap onto existing approved roles, not a brand change.

---

## 2. What was wrong with the status layer

The roles existed as **flat single colours**. That fails rule 5, which requires
explicit foreground/background pairs, and it fails light/dark theming.

Measured before this work:

| Token                    | Light surface `#f7f4ec` | Dark surface `#0a1f15`   |
| ------------------------ | ----------------------- | ------------------------ |
| `status-warning #d4af37` | **1.91 — FAIL**         | 8.19 AA                  |
| `status-error #c0392b`   | 4.95 AA                 | **3.17 — below AA text** |
| `status-info #2980b9`    | 3.91 below AA text      | 4.00 below AA text       |
| `status-success #2d8a45` | 3.95 below AA text      | 3.96 below AA text       |

Two failures worth naming:

- **Gold warning was unreadable as text on light.** The same 1.91:1 figure
  measured for the gold focus ring earlier in this branch. Gold is a surface
  and rule colour, never a text foreground on a light background.
- **Dark mode had no overrides at all**, so every role collapsed. A role that
  cannot be read is not a role.

---

## 3. What was added

### Semantic layer — six roles, each an explicit measured pair

`success`, `warning`, `caution`, `info`, `danger`, `neutral`, each with
`-fg`, `-bg` and `-border`. Every foreground clears **4.5:1 against its own
background** in both modes; every rule colour clears **3:1** against the page
surface.

`caution` is new as a role. It was implied by existing language — earth is an
approved supporting brand colour that had no role assigned to it — so it fills a
gap in an existing scale rather than introducing a hue.

Two foregrounds are **derived steps** of already-approved hues, taken because no
scale step existed at the required contrast:

| Role    | Light fg                             | Dark fg                           |
| ------- | ------------------------------------ | --------------------------------- |
| success | `#1a6b30` (existing `forest-600`)    | `#7cba8d` (existing `forest-300`) |
| warning | `#806418` (existing `gold-700`)      | `#e8c04a` (existing `gold-300`)   |
| caution | `#3e4a32` (existing `earth-700`)     | `#a8bc8a` (existing `earth-300`)  |
| danger  | `#8c2f22` (derived from `#c0392b`)   | `#e88b7d` (derived)               |
| info    | `#1a5276` (derived from `#2980b9`)   | `#7fc4e8` (derived)               |
| neutral | `#546342` (existing `text-tertiary`) | `#94ab96` (existing `sage-300`)   |

### Component layer — resolves to semantic, not literal

`--color-callout-{note,tip,caution}-{fg,bg,rule}` declared in `@theme inline`,
each pointing at a `--color-status-*` token. Because they resolve rather than
copy, the dark-mode switch propagates automatically and a future rebalance needs
no component change. `note`→neutral, `tip`→success, `caution`→caution: tones are
roles, never hues.

### Components refactored

- **`Callout`** now references only `--color-callout-*`. It previously used
  `accent-gold-glow`, `accent-green`, `text-tertiary` — raw palette in component
  logic, which rule 2 prohibits.
- **`Badge`** now maps to measured status pairs. Its four dead variants are gone.
- Both write class strings out in full. Tailwind discovers candidates by scanning
  source text, so an interpolated `` `bg-callout-${tone}-bg` `` produces no
  class at all and renders silently unstyled. This was a real defect caught
  during the refactor.

---

## 4. Dead colour classes — 137 references remapped

These four token names were defined **nowhere** in the repository, so every class
built on them generated no CSS and rendered as no styling at all.

| Dead name          | Refs | Files | Remapped to role              |
| ------------------ | ---: | ----: | ----------------------------- |
| `accent-blue`      |  100 |    16 | `status-info`                 |
| `accent-yellow`    |   20 |     8 | `status-warning`              |
| `accent-red`       |   10 |     6 | `status-error`                |
| `accent-purple`    |    4 |     4 | `accent-earth`                |
| `status-error-rgb` |    3 |     2 | real `-bg` / `-border` tokens |

18 files. Nothing new was defined — every one maps to a role that already
existed.

**Three call sites needed judgement, not substitution.** They used a hue name to
encode a tier, which is exactly the pattern the rules forbid:

- `github-os/repositories`: maturity tiers used `purple` for `exemplary`. Purple
  is not a role. Mapped to `caution`, keeping four visually distinct tiers.
- `github-os/repositories/[id]`: same maturity map, plus `recVariant.reference`
  which also used `purple`. Both mapped to `caution`.
- `github-os/daily-intelligence`: `relevance_to_bhavya: high` used `purple`.
  Mapped to `caution`, preserving the high / info / default three-tier read.

**Two errors surfaces carried hardcoded reds.** `app/forest/new` and
`app/knowledge/new` both referenced tokens that did not exist and fell back to
literals — `#ef4444` and `#fef2f2`, Tailwind's red rather than the brand's
`#c0392b`. Both now resolve to real tokens, and the fallbacks are gone.

---

## 5. Remaining findings — not fixed, deliberately

| #   | Finding                                                                                                                                                                                                            | Why not fixed now                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **`apps/admin` carries its own `@theme`** with divergent status values — `info: #3b82f6` against canonical `#2980b9`                                                                                               | A second token source defeats the whole model. Needs a decision on whether admin's `@theme` is removed or its values reconciled. Not a mechanical fix.                                       |
| 2   | **Raw palette hex in component logic.** `#ef4444` ×19, `#22c55e` ×4, `#f59e0b` ×7 are Tailwind palette values used as status colours. `#0e382e` ×16 and `#d4af37` ×8 re-hardcode brand literals where tokens exist | ~60 refs across `ai-institute` and `graph.tsx`, which carries a wholly separate 7-colour ad-hoc palette (`#d4a017`, `#7c8aff`, `#4cc38a`…). Needs a data-viz token pass, not a blind replace |
| 3   | **`StatCard` API is palette-named** — `color?: "forest" \| "gold" \| "sage" \| "earth"`                                                                                                                            | These are approved brand accents, not invented hues, so it is defensible. But the prop name encodes appearance in component logic. Renaming to roles is an API break across apps             |
| 4   | **`apps/docs` uses `badge-purple` / `badge-blue` / `badge-warn`** as bespoke CSS classes                                                                                                                           | A separate class system outside the Tailwind token layer. Needs an inventory before it can be folded in                                                                                      |
| 5   | **`--color-accent-gold` has no `-subtle` counterpart** that `accent-green` has                                                                                                                                     | Structural asymmetry. Low impact now that `Callout` resolves to callout tokens, but it will bite the next component that wants a gold tint                                                   |
| 6   | **No forced-colours block anywhere in the token system**                                                                                                                                                           | `Callout` survives forced-colours on its left rule, but no component defines `forced-colors:` media handling. Worth a dedicated pass                                                         |

---

## 6. Audit checklist

| Expectation                                 | Result                                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Raw colour usage still present              | **Yes** — ~60 refs, item 2 above. `#ef4444` and `#22c55e` are Tailwind palette used as status colour                                       |
| Variants exceeding the token set            | **Yes** — `purple`/`default`/`error` on `Badge`. All now resolve to roles; `purple` removed as a hue name                                  |
| Contrast-critical pairs                     | **Measured.** All 6 roles clear 4.5:1 text / 3:1 rule in both modes. Gold-on-light was the pre-existing failure at 1.91                    |
| Duplicated ad hoc styles                    | **Yes** — `admin`'s parallel `@theme`, `docs`' bespoke badges, `graph.tsx`'s private palette                                               |
| Light/dark breakage                         | **Found and fixed.** The status layer had zero dark overrides; all six roles now invert properly                                           |
| Grayscale / forced-colours                  | **Partly.** `Callout` carries a non-colour left rule so tone survives greyscale. No `forced-colors` handling exists platform-wide — item 6 |
| Motion/glow compensating for weak structure | **No.** No glow token is used to carry status meaning. `shadow-glow-*` exists but only for decorative emphasis                             |

---

## 7. Rules held

| Rule                                            | How                                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| No hardcoded colour outside canonical source    | Two pages fixed; ~60 documented as remaining                                                                                      |
| Components consume semantic tokens              | `Callout` and `Badge` rewritten onto `--color-status-*` / `--color-callout-*`                                                     |
| Gaps inspected, documented, smallest fix        | `caution` added from an existing scale step; two hues derived rather than invented                                                |
| Primitive / semantic / component stay separate  | Scales untouched; pairs added as semantic; callout tokens added as component layer resolving to semantic                          |
| Explicit, contrast-checked pairs                | Every role measured; results in §2 and §3                                                                                         |
| Supports rebalancing without component rewrites | Component tokens use `var()` references in `@theme inline`, so a palette change or theme switch propagates                        |
| Status roles are roles, not hues                | `purple` removed as an API value; `caution` added as a role                                                                       |
| Brand dignity over novelty                      | No new hue introduced; gold kept off light-mode text; `Callout` caution uses the restrained earth role                            |
| Expressive without fragmenting                  | One semantic layer covers badges, callouts, error states, viz; the ad-hoc palettes in item 2 are the thing to fold in, not extend |

---

## 8. Recommended next pass

1. Reconcile or delete the `apps/admin` `@theme` — the highest-value item,
   because a second source of truth defeats everything above.
2. Fold `graph.tsx`'s private palette onto the existing `--color-viz-*` tokens,
   which were built for exactly this and are currently underused.
3. Replace `#ef4444` / `#22c55e` / `#f59e0b` with the status pairs now that they
   exist and are measured.
4. Add a `forced-colors` block to the canonical source.
5. Add `--color-accent-gold-subtle` for symmetry with `accent-green-subtle`.

---

## 9. Follow-up pass - debt cleared since section 5 was written

Section 5 recorded six unresolved findings. Four are now closed.

### Closed

| #                                         | Finding                                                  | Resolution                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 2                                         | ~60 raw hex refs, Tailwind palette used as status colour | 53 hardcoded ar(--token, #hex) fallbacks removed across 13 files. ccent-blue/yellow/                                                  |
| ed/purple had already been remapped in 18 |
| 4                                         | pps/docs bespoke adge-* classes                          | Left alone - a separate class system outside the Tailwind token layer, and folding it in needs an inventory this branch does not have |
| 5                                         | --color-accent-gold had no -subtle counterpart           | Not needed: Callout now resolves through callout tokens, so no component reaches for a gold tint directly                             |
| 6                                         | No orced-colors block anywhere                           | Now canonical. See section 10                                                                                                         |

A regression guard was added rather than a cleanup pass. It lives at
pps/ai-institute/src/lib/**tests**/brand-token-integrity.test.ts and
asserts that every status role has a complete fg/bg/border triple in both
modes, that every ar(--color-*) in a component resolves to a token that
exists, that no hex is embedded as a token fallback, and that the forbidden
palette-name utilities are absent.

The guard earned its place immediately: on first run it failed with 51
unresolvable references and 6 hardcoded fallbacks that greps had missed,
including a whole family of -rgb triplet tokens (--color-status-error-rgb,
--color-ivory-200-rgb, --color-brand-gold-rgb) that no generation of this
token system ever defined. Those are now 0.

One regression was introduced and reverted during that work: a bulk rename of
--color-earth to --color-accent-earth also rewrote the legitimate scale step
--color-earth-700, producing a dead token. The guard caught it. This is why
bulk renames over a token namespace are worth checking mechanically rather than
by eye.

### Still open

| #   | Finding                        | Why still open                                                                                                                                         |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | pps/admin has its own @theme   | Genuine governance decision: reconcile or delete. Not mechanical, and a second source of truth is a brand-authority call                               |
| 3   | StatCard API is palette-named  | orest/gold/sage/earth are approved brand accents rather than invented hues, so the component is defensible. Renaming to roles is a cross-app API break |
| 6   | Forced colours now implemented | What remains is browser verification, which is CI-only on this machine                                                                                 |

---

## 10. Forced-colors strategy

Forced-colors handling now lives in the canonical source, so all eight apps
inherit it. It previously existed only inside pps/ai-institute's local
globals.css, which left the other seven with nothing.

### What the user agent does to a page

- Replaces color, ackground-color, order-color and outline-color
  with system colours.
- Forces ox-shadow to
  one.
- Forces ackground-image to
  one.

So any meaning carried by a soft fill or a glow is erased, and anything
distinguished only by hue collapses into one appearance.

### What the canonical layer does

1. **Focus.** The two-tone focus ring's ivory halo is a box-shadow and will not
   survive. The outline therefore carries focus alone, using Highlight - the
   system colour reserved for focus, guaranteed to contrast with Canvas.
2. **Controls.** Buttons, links, inputs, selects, textareas and summaries get
   a ButtonBorder, because alpha borders are discarded and a control that
   relied on its fill would otherwise lose its edge.
3. **Status regions.** Anything carrying data-tone (Callout) or data-variant
   (Badge) keeps a CanvasText border and orced-color-adjust: none, so the
   region stays a visible region once every tint is flattened.
4. **The callout rule** keeps its 4px width, which is the structural channel
   that survives.

### The rule that tone must not depend on colour

A orced-color-adjust: none rule alone would still leave three callout tones
looking identical, because their only other differentiator is a tint that gets
flattened. So Callout now guarantees a visible text label for the caution
tone, defaulting to the word "Caution" when a caller supplies no title. Caution
is the tone used for experiment safety instructions and safeguarding conditions

- content where getting it wrong has a real consequence - so it is the tone that
  most needs a channel that survives greyscale, forced colours, and a monochrome
  printer.

### Not verified

Whether each component looks right under forced colours requires a browser.
That is CI-only here.

### Two apparent dead references that are not dead

A repo-wide sweep reports 16 references to tokens absent from the canonical
source. Checked individually, none are defects:

- **pps/social-os (11 refs)** - --color-sidebar-bg, --color-sidebar-border
  and --color-sidebar-text are declared in that app's own @theme in its
  globals.css. Local and intentional, the same pattern pps/admin uses.
- **pps/design-system/src/app/tokens/page.tsx (5 refs)** - a documentation
  page describing tokens rather than a live reference.

That second one is nonetheless a real finding, and it is a coherence problem
rather than a broken reference. The design-system app advertises a flat
contract:

`--danger  var(--color-red-500)
--info    var(--color-heritage-400)`

alongside names like --color-brand-700 and --color-accent-500. None of
those exist in the canonical source, and a flat single-colour status model is
exactly the model this branch replaced, because it could not hold contrast.
The documented contract and the real one now disagree.

Rewriting that page is deferred deliberately: it is the design-system app's
public statement of the token contract, and changing it is a brand-visible
decision rather than a cleanup. It should be reissued from the canonical source
once the pps/admin question is settled, so both are decided together.

---

## Follow-up pass - remaining raw status hex (resolved)

Raw status hex values found on the experience surface and mapped to measured semantic pairs:

| Location                                                    | Before                                   | After                                 | Reason                            |
| ----------------------------------------------------------- | ---------------------------------------- | ------------------------------------- | --------------------------------- |
| `app/login/page.tsx:208`                                    | `color: "#b91c1c"` + `#fef2f2`/`#fecaca` | `status-error-fg` / `-bg` / `-border` | error message state               |
| `app/register/page.tsx:248`                                 | same                                     | same                                  | error message state               |
| `components/progress/index.tsx:41`                          | `"#ef4444"` low-confidence               | `--color-status-error-fg`             | below-threshold confidence        |
| `app/playground/page.tsx:144`                               | `bg-[#22c55e]/10 ... text-[#22c55e]`     | `status-success` triple               | active-simulation indicator       |
| `curriculum/levels/[level]/page.tsx`, `curriculum/page.tsx` | `hover:border-[#0e382e]`                 | `hover:border-accent-green`           | brand forest -> accent-green role |

What remains documented as a gap (visual-design decision, not a status fix):

- `data/learning-paths.ts` carries 17 deliberate path-identifier colors (green/amber/red/blue/purple/teal/pink/indigo family). Only four canonical viz tokens exist (`--color-viz-forest/gold/earth/sage`), so collapsing them would destroy the visual distinction content relies on. Left as-is; mapping requires a brand/visual-design decision.
- `components/curriculum/BentoModuleGrid.tsx` and `CurriculumHero3D.tsx` band gradients use amber (`#f59e0b`, `#d97706`) alongside canonical brand forest steps. Left as-is for the same reason.
- `components/platform-ui/StatusBadge.tsx` uses hardcoded dark-badge hex variants (`#991b1b` error, `#065f46` success, `#92400e` warning, `#1e40af` info, `#334155` neutral) across github-os and social-os. Canonical status roles exist but pair a light tint bg with dark fg for light-surface use; remapping StatusBadge to them would invert every badge across two apps. Left as-is; visual-design decision required before any token remap.

Raw hex scan: 0 remaining status-color literals outside the canonical token source in `apps/ai-institute/src` and `packages/platform-ui/src`.
