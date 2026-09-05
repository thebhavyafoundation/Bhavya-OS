# Setup questionnaire — configure the factory once

Answers get written into the canonical factory homes (see
`_shared/factory-map.md`). Every future run reads them; no run re-asks them.

1. Who is this workspace for, and what should a finished deliverable look like?
   (becomes the product statement — today: ONE canonical web experience in
   `apps/ai-institute`; see `docs/architecture/CANONICAL_PRODUCT_ARCHITECTURE.md`)
2. Voice and tone: paste two examples of past work that sound right (Bhavya
   editorial: Playfair Display + Inter, forest / ivory / earth / gold), and one
   that sounds wrong (generic AI-SaaS dashboard, purple gradients, neon).
   (becomes `docs/brand/BRAND_GUIDE.md` — link, do not copy here)
3. Hard constraints that never bend: canonical routes
   (`docs/architecture/CANONICAL_ROUTE_MAP.md`), domain ownership
   (`docs/architecture/DOMAIN_OWNERSHIP.md`), design tokens
   (`packages/platform-ui/src/styles/tokens.css`).
4. What does the human always check before anything ships?
   (becomes each stage's Human check line — one concrete act, not "review")
5. What already exists that runs should reuse — templates (`_templates/`),
   reference data (`governance/`, `standards/`, `schemas/`), content
   (`content/`)? (linked from `_shared/factory-map.md`, one home per fact)

---

Adapted from `.opencode/skills/icm-architect/assets/templates/questionnaire.md`.
