# ai-institute — the canonical host

One job: serve the ONE Bhavya Foundation web experience (`/`, `/app`, `/os`).

Bhavya Foundation is the parent institution. AI Institute is one pillar
(Knowledge) within it — never a replacement identity. Four pillars share this
host: Forest, Knowledge, Heritage, Community.

## Inputs

- Working (this run): the route being built under `src/app/` in this folder
- Reference (every run): `docs/architecture/CANONICAL_ROUTE_MAP.md` (one concept → one route)
- Reference (every run): `docs/architecture/DOMAIN_OWNERSHIP.md` (one domain → one owner package)
- Reference (every run): `docs/architecture/CANONICAL_PRODUCT_ARCHITECTURE.md` (product statement)
- Reference (every run): `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` (canonical data per domain)
- Reference (every run): `packages/platform-ui/src/styles/tokens.css` (tokens — never inline)
- Reference (every run): `docs/brand/BRAND_GUIDE.md` (voice — link, do not copy)

Do NOT load: other apps in `apps/` (they migrate here, not the reverse),
`packages/constitution` raw docs (use the `@bhavya/constitution` SDK),
the full `docs/` tree (follow the link for the task at hand only).

## Process

1. Find the canonical route for the concept in `CANONICAL_ROUTE_MAP.md`.
2. Find the domain owner package in `DOMAIN_OWNERSHIP.md`; consume it — never duplicate its logic.
3. Build with `@bhavya/platform-ui` components and tokens only.
4. Verify: typecheck, lint, build; no 404s, no placeholder pages.

## Outputs

- Route under `src/app/` + domain logic consumed from `packages/<domain>/`

## Human check

Open the route on desktop and mobile. Confirm it feels institutional,
editorial, ecological (forest / ivory / earth / gold; Playfair Display +
Inter) — and would still make sense without the word "AI". Fix composition
before merging; do not invent new design primitives.
