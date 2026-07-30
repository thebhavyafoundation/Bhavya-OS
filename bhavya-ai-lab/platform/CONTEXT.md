# CONTEXT — Platform Workspace

## Purpose
Deploy content to web, mobile, and offline packages.

## Audience
Students, teachers, contributors, general public.

## Current Goal
Build static website deployment for AI lab content.

## Inputs
- Validated content from curriculum workspace
- Rendered media from production workspace
- Layouts from `_config/registries/layouts/`

## Outputs
- Static website
- Offline package (USB/MicroSD)
- Mobile-optimized content

## Dependencies
- `curriculum/` — Validated lessons
- `production/` — Rendered videos
- `_config/skills/deployment/` — Deployment patterns
- `_config/registries/layouts/` — Page layouts

## Constraints
- Static generation (no server required)
- Works offline
- All outputs versioned

## Quality Standard
- All pages render correctly
- Offline package complete
- Mobile responsive

## Recent Decisions
- 2026-07-30: Use Next.js with static export

## Last Updated
2026-07-30
