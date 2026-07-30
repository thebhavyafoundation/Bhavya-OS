# Platform Workspace

**Last Updated:** 2026-07-30
**Current Goal:** Deploy content to web, mobile, offline packages
**Known Constraints:** Static generation. No mandatory server. Works offline.
**Open Questions:** How to handle versioning across deployments?
**Recent Decisions:** Use Next.js with static export
**Next Review:** 2026-08-15

## Context

**Audience:** Students, Teachers, Contributors
**Input:** Validated content from curriculum/production
**Output:** Website, offline package, mobile app

## Stages

### 01_structure
- Define site structure
- Map content to routes
- Output: `output/routes.json`

### 02_content
- Compile content for web
- Apply design system
- Output: `output/pages/`

### 03_deploy
- Build and deploy
- Generate offline package
- Output: `output/deployed/`

## References (Layer 3)

- `references/design-system.md` — Web design rules
- `references/deployment.md` — Deployment procedures
- `../../_config/registries/layouts/` — Reusable layouts

## Output Format

- `site/` — Static website
- `offline/` — USB/MicroSD package
- `mobile/` — Mobile-optimized content
