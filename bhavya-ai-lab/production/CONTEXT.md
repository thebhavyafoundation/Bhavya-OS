# CONTEXT — Production Workspace

## Purpose
Transform scripts into rendered videos, animations, and multimedia content.

## Audience
Students, teachers, content consumers.

## Current Goal
Build video production pipeline for lesson content.

## Inputs
- Script from curriculum workspace
- Animation patterns from `_config/skills/remotion/`
- Design system from `_config/registries/branding/`

## Outputs
- Video (MP4, WebM, GIF)
- Thumbnail
- Transcript
- Subtitles

## Dependencies
- `curriculum/` — Scripts and lessons
- `_config/skills/remotion/` — Animation patterns
- `_config/registries/animations/` — Reusable animations

## Constraints
- Render locally (no cloud)
- Optimized for low bandwidth
- All outputs versioned

## Quality Standard
- Video matches script timing
- Subtitles accurate
- Thumbnail representative

## Recent Decisions
- 2026-07-30: Use Remotion for video rendering

## Last Updated
2026-07-30
