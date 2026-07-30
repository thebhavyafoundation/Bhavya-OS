# CONTEXT — Remotion Skill

## Purpose

Provide production-ready Remotion patterns for rendering educational videos.

## When to Use

- Generating video from scripts
- Creating animations from Knowledge Objects
- Rendering explainers, lessons, or documentaries
- Building reusable animation components

## Inputs

- Script or storyboard
- Knowledge Objects (for educational content)
- Design system (from registries)

## Outputs

- MP4/WebM video
- Thumbnail
- Transcript
- Subtitles

## Dependencies

- Node.js >= 20.9.0
- React >= 18.0.0
- TypeScript >= 5.0.0
- Remotion >= 4.0.0

## Constraints

- Must render locally (no cloud)
- Optimized for 30fps at 1080p
- All components must be deterministic
- No external API calls during render

## Quality Standards

- Frame-accurate timing
- Consistent visual style
- Accessible captions
- Offline-capable output
