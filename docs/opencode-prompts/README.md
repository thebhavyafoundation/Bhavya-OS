# Bhavya OpenCode Prompt Pack

Use these prompts only after reading:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

Available prompt packs:

- `cinematic-public-pages.md`
- `curriculum-pages.md`
- `diagram-infographic.md`
- `three-d-assets.md`

These prompts do not override platform truth. They extend it for specific task types.

## Precedence within the pack

`AGENTS.md` → `PLATFORM-TRUTH.md` → constitution → **this pack**.

If a prompt in this pack conflicts with anything above it, the higher authority
wins and the prompt is wrong. Fix the prompt; do not work around the rule.

## Prompt pack

| Pack                        | Use for                                                                  |
| --------------------------- | ------------------------------------------------------------------------ |
| `cinematic-public-pages.md` | Tier A public pages — scroll chapters, 3D stages, cinematic infographics |
| `curriculum-pages.md`       | Course / module / lesson — structure, diagrams, progress, accessibility  |
| `diagram-infographic.md`    | Governance, pathways, process and architecture diagrams                  |
| `three-d-assets.md`         | Sourcing, licensing and optimising 3D assets                             |

## Which pack

Not every page should be cinematic. Pick by tier:

- **Tier A public** → `cinematic-public-pages.md`
- **Tier C learning** → `curriculum-pages.md`
- **Any diagram** → `diagram-infographic.md`
- **Any 3D asset** → `three-d-assets.md`, then fold the result into whichever
  page pack owns the route.

Two packs can apply to one task. When they do, the page pack owns layout and
motion; the asset pack owns sourcing, licensing and optimisation. They must not
contradict each other — if one specifies a delivery format, the other follows.

## Universal stop conditions

Stop and correct the plan before writing code if any of these is true:

- The task requires a paid API, Cloudflare R2, or a payment method.
- The task requires deploying, merging to `master`, or migrating production.
- The task requires heavy rendering on the local machine.
- A required path or registry does not exist on disk.
- An asset licence is unverified.
- Content would be published before factual review.

## Reporting labels

Every pack uses the same report labels: `CONFIRMED`, `PROPOSED`, `UNKNOWN`,
`BLOCKED`. `UNKNOWN` is mandatory rather than optional — a gap labelled as a
guess is how a wrong claim reaches production.
