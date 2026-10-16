# Authoring Guide — Diagram Design

**Stage:** 14 — Documentation  
**Applies to:** Bhavya Foundation institutional diagrams  
**Upstream skill:** diagram-design @ `b46c9701f035844a20b13ab0551315977188933b` (MIT)

---

## 1. When to use Diagram Design

Use Diagram Design for editorial diagrams that help a reader learn more from a visual than from prose, a table, or a bulleted list:

- Programme pathways, module relationships
- Timelines, process explanations, cause-and-effect systems
- Decision trees, concept hierarchies, stakeholder relationships
- Scientific systems, vocational workflows
- Architecture, data-flow, governance, and security documentation
- Static fallbacks for selected interactive experiences

**Do not use for:**

- Quick unicode sketches → wiretext
- Lists of things → table or bullets
- Attribute-only before/after → table; topology changes → Architecture delta
- One-shape "diagrams" → write the sentence

**Ask before drawing:** _Would the reader learn more from this than from a well-written paragraph?_ If no, don't draw.

## 2. Diagram Design vs other tools

| Tool               | Use when                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Diagram Design** | Published editorial diagrams in Bhavya brand; static SVG; accessibility-reviewed; no client JS                |
| **Mermaid**        | Frequently changing engineering documentation that lives in Git and diffs cleanly                             |
| **ECharts / D3**   | Interactive, data-driven charts needing user exploration                                                      |
| **3D (Three.js)**  | Immersive experiences owned by the story engine; Diagram Design is the reduced-motion / low-power replacement |

## 3. Selecting a diagram type

Choose a semantic pattern first when behavior, state, enforcement, or risk carries the meaning, then the nearest visual type for layout. If no pattern matches, choose the type directly.

| Showing                        | Type               |
| ------------------------------ | ------------------ |
| Components + connections       | Architecture       |
| Before / After topology change | Architecture delta |
| Decision logic                 | Flowchart          |
| Time-ordered messages          | Sequence           |
| States + transitions           | State machine      |
| Entities + fields              | ER / data model    |
| Events in time                 | Timeline           |
| Cross-functional process       | Swimlane           |
| Two-axis prioritization        | Quadrant           |
| Reinforcing cycle              | Loop               |
| Containment / scope            | Nested             |
| Parent → children              | Tree               |
| Ownership / routing            | Org chart          |
| Stacked abstractions           | Layer stack        |
| Quantitative comparison        | Bar chart          |
| Part-of-whole by area          | Treemap            |
| Quantities that split + merge  | Sankey             |

Always load the matching `type-*.md` reference before drawing. Keep density at 4/10; above 9 nodes, split into overview + detail.

## 4. Using the Bhavya profile

Diagram tokens resolve against `docs/diagrams/BHAVYA-PROFILE.md`, derived from `packages/platform-ui/src/styles/tokens.css`:

- `paper` #f7f4ec / `ink` #0e382e / `muted` #546342 / `accent` #d4af37 / `link` #2d8a45
- Fonts: Playfair Display (title), Inter (node name), JetBrains Mono (technical labels), system stack — **no Google Fonts**
- Divider/hairline: `rgba(14,56,46,0.12)`

**Accent rule:** gold (`#d4af37`) on one or two focal elements maximum. Never as body text. Labels on accent fills use `ink` (#0e382e).

## 5. Registering a diagram

Every diagram requires a manifest under `content/diagrams/manifests/<diagram_id>.json` conforming to `manifest.schema.json`.

Required fields: `diagram_id`, `title`, `type`, `variant`, `route`, `section`, `purpose`, `audience`, `source_html`, `production_svg`, `accessible_text`, `content_sources`, `review`, `licensing`, `version`, `status`, `updated_at`.

Statuses: `draft` → `content-reviewed` → `accessibility-reviewed` → `approved` → `deprecated`. **No draft diagram may be presented as approved institutional information.**

Register in `docs/diagrams/DIAGRAM-REGISTRY.md`.

## 6. Authoring an HTML source

1. Copy the nearest variant template concept (minimal light / dark / full editorial).
2. State the chosen type, size, and planned cuts before drawing.
3. Write the SVG with:
   - `role="img"`, `aria-labelledby`, first-child `<title>` / `<desc>` with slug-prefixed IDs
   - `viewBox` + explicit `width`/`height`
   - 4px grid geometry; hairline borders; no shadows
   - Bhavya profile tokens; no inline hex outside the style block
   - No `<script>`, no external URLs, no unsafe event attributes
   - At most 2 accent elements
4. Run `node scripts/diagrams/validate-diagrams.mjs` and `node scripts/diagrams/check-manifests.mjs`.
5. Export: `node scripts/diagrams/export-diagrams.mjs` (manual only).

## 7. Text alternatives

Every diagram needs an `accessible_text` (plain-language transcript) in its manifest, plus `<title>` (short name, ≤60 chars) and `<desc>` (one sentence about content, not geometry) in the SVG. The `EditorialDiagram` component renders `<figcaption>` and a "Detailed description" link.

## 8. Export

SVG export is manual (`scripts/diagrams/export-diagrams.mjs`). PNG export via Playwright is available upstream but is **not** part of the ordinary build. No external font requests; no client JavaScript for static diagrams.

## 9. Updating and deprecating

- To update: edit the HTML source, re-export the SVG, bump `version`, set `updated_at`, re-run validation.
- To deprecate: set `status: "deprecated"`, keep the asset for reference, remove from production routes.
- To roll back: restore the previous manifest version and SVG from git.

## 10. Constraints

- No Diagram Design runtime dependency in the browser bundle.
- No Google Fonts request from production diagrams.
- No credentials, internal URLs, or secret names in diagram content.
- Draft diagrams are never presented as approved.
- Governance diagrams require governance review before `approved`.
- No page gets a diagram where it adds no explanatory value.
