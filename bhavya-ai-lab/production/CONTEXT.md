# Production Workspace

**Last Updated:** 2026-07-30
**Current Goal:** Transform scripts into rendered videos and animations
**Known Constraints:** Render locally. No cloud rendering. MP4/WebM output.
**Open Questions:** How to optimize for low-bandwidth delivery?
**Recent Decisions:** Use Remotion for video rendering
**Next Review:** 2026-08-15

## Context

**Audience:** Students, Teachers
**Input:** Script from curriculum workspace
**Output:** Video, thumbnail, transcript

## Stages

### 01_visual_spec
- Read script
- Define scenes, camera, animations
- Output: `output/visual-spec.json`

### 02_script
- Finalize narration
- Add timing markers
- Output: `output/script.md`

### 03_remotion
- Translate to Remotion code
- Build components
- Output: `output/src/`

### 04_render
- Render locally
- Generate outputs
- Output: `output/video/`

## References (Layer 3)

- `references/animations.md` — Animation conventions
- `references/design-system.md` — Visual design rules
- `../../_config/registries/animations/` — Reusable animations

## Output Format

- `video/` — MP4, WebM, GIF
- `thumbnail.png`
- `transcript.md`
