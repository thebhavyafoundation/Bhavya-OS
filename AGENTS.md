# Bhavya Foundation (Bhavya OS)

One digital institution: one canonical web app, shared packages, governance.
Four pillars — Forest, Knowledge (AI Institute lives here), Heritage,
Community. AI Institute never replaces the Foundation identity.

## Where things live

| Need                           | Go to                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| Canonical app                  | `apps/ai-institute/` → `apps/ai-institute/CONTEXT.md`                                    |
| Domains / packages             | `packages/` → `packages/CONTEXT.md` (ownership: `docs/architecture/DOMAIN_OWNERSHIP.md`) |
| Knowledge / docs               | `docs/` → `docs/CONTEXT.md`                                                              |
| Agent context / status         | `.ai/` → `.ai/CONTEXT.md` (live: `.ai/current-task.md`)                                  |
| Decisions                      | `rfcs/` → `rfcs/CONTEXT.md`                                                              |
| Architecture source of truth   | `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`                                        |
| Browser verification           | `.opencode/skills/bhavya-qa/SKILL.md` (Playwright, app running)                          |
| Factory (tokens, brand, rules) | `_shared/factory-map.md` (links only — never copy)                                       |

## Test / verify

- Test: `pnpm test` (turbo) or `pnpm --filter @bhavya/<name> test`
- Verify: `pnpm typecheck`, `git diff --check`, `pnpm file-map:check`
- Canonical repo: `github.com/thebhavyafoundation/Bhavya-OS` (`master`) → ONE Vercel project (`bhavya-foundation`) → `bhavyafoundation.org`

## Never do

- No new design primitives — use `@bhavya/platform-ui` tokens/components; forest/ivory/earth/gold, Playfair Display + Inter (never purple/blue AI styling)
- No app-to-app dependencies; one concept → one route (`docs/architecture/CANONICAL_ROUTE_MAP.md`)
- Never hand-edit generated indexes (`registry/`, `bar/`, `FILE-MAP.md`) or create a new Vercel project
- Nothing moves forward until a person has read the last output
