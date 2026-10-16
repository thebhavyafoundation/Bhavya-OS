# Diagram Registry

**Stage:** 14 — Documentation  
**Source of truth:** manifests under `content/diagrams/manifests/`  
**Validator:** `scripts/diagrams/validate-diagrams.mjs`, `scripts/diagrams/check-manifests.mjs`

| diagram_id                      | title                                  | type         | route                        | status | updated_at |
| ------------------------------- | -------------------------------------- | ------------ | ---------------------------- | ------ | ---------- |
| bhavya-os-architecture          | Bhavya OS architecture                 | architecture | /os/architecture             | draft  | 2026-10-16 |
| b2-secured-data-flow            | Secured B2 data flow                   | data-flow    | /os/security/b2-data-flow    | draft  | 2026-10-16 |
| foundation-governance-structure | Bhavya Foundation governance structure | org-chart    | /os/governance/structure     | draft  | 2026-10-16 |
| curriculum-learning-pathway     | Curriculum learning pathway            | tree         | /app/learn/pathway           | draft  | 2026-10-16 |
| responsible-ai-lifecycle        | Responsible AI lifecycle               | process      | /os/ai/responsible-lifecycle | draft  | 2026-10-16 |
| environmental-system            | Environmental system                   | loop         | /forest/environmental-system | draft  | 2026-10-16 |

**Licensing (all):** generated with diagram-design @ `b46c9701f035844a20b13ab0551315977188933b`, MIT licence. No additional output licence conditions.

**Review status:** all pilot diagrams are `draft`. `foundation-governance-structure` and `responsible-ai-lifecycle` additionally require governance review (`review.governance: pending`). None are approved for production presentation.

**Assets:**

- Sources: `content/diagrams/sources/html/<diagram_id>.html`
- SVG: `apps/ai-institute/public/diagrams/<group>/<diagram_id>.svg`
- Sizes: 3.8–5.8 KB each (budget: <300 KB)
