# Bhavya Foundation — Photography Archive

## Overview

This directory holds editorial photography for the public site.

**Current state:** `PARTIAL — WIRED` — five rights-cleared JPEGs present and wired via `src/lib/photos.ts` (`PHOTO`).

- Wired: `hero-himalayan-sunset.jpg`, `why/why-terrace-garhwal.jpg`,
  `heritage/heritage-stone-temple.jpg`, `knowledge/knowledge-books-notepad.jpg`,
  `community/community-village-landscape.jpg`.
- Still `ASSET REQUIRED` (do not wire — see `PHOTO_PENDING`): forest cedar,
  school-children, wooden temple, village gathering.
- Interim `.svg` scene illustrations remain as art only: valid SVG with
  `.svg` extension, never SVG disguised as `.jpg`.
- Historical commit `cea919c` stored SVG bytes under `.jpg` names — that is a
  quality blocker. Do not restore those files as photography.

## Asset Policy

- Target: real documentary `.jpg` photographs (2400×1600, 3:2, JPEG sRGB).
- Swap rule: place real `.jpg` with the same basename; wire `PHOTO` map /
  `HeroBackground photo=` / feature-panel `<img>`. Never ship broken images
  (`naturalWidth: 0`) or fake MIME types.
- Generation prompts + target dimensions live in `metadata/photo_manifest.json`.
- Missing photo → stop that image subtask, emit `ASSET REQUIRED`, continue
  non-dependent work. Do not fill with SVG/CSS/gradient stand-ins as imagery.

## Directory Structure

```
photography/
├── hero/           # Hero background (WIRED)
│   ├── hero-himalayan-sunset.jpg   (+ .webp, .svg interim)
├── why/            # WHY chapter plate (WIRED)
│   └── why-terrace-garhwal.jpg     (+ .webp)
├── forest/         # Forest mission — ASSET REQUIRED
│   └── forest-cedar-sunlight.svg
├── knowledge/      # Knowledge mission
│   ├── knowledge-books-notepad.jpg (+ .webp)  object-first, WIRED
│   └── knowledge-school-children.svg          ASSET REQUIRED
├── heritage/       # Heritage mission
│   ├── heritage-stone-temple.jpg   (+ .webp)  WIRED
│   ├── heritage-stone-temple.svg
│   └── heritage-wooden-temple.svg              ASSET REQUIRED
├── community/      # Community mission
│   ├── community-village-landscape.jpg (+ .webp) place-only, WIRED
│   └── community-village-gathering.svg         ASSET REQUIRED
└── metadata/
    └── photo_manifest.json
```

## Photo Placement Instructions

| Photo                       | Destination (real JPEG)                     | Status           |
| --------------------------- | ------------------------------------------- | ---------------- |
| Valley of Uttarakhand       | `hero/hero-himalayan-sunset.jpg`            | ACQUIRED · WIRED |
| Garhwal terrace fields      | `why/why-terrace-garhwal.jpg`               | ACQUIRED · WIRED |
| Sunlit cedar forest         | `forest/forest-cedar-sunlight.jpg`          | ASSET REQUIRED   |
| Open book object study      | `knowledge/knowledge-books-notepad.jpg`     | ACQUIRED · WIRED |
| School children + mountains | `knowledge/knowledge-school-children.jpg`   | ASSET REQUIRED   |
| Stone temple architecture   | `heritage/heritage-stone-temple.jpg`        | ACQUIRED · WIRED |
| Wooden temple + mountains   | `heritage/heritage-wooden-temple.jpg`       | ASSET REQUIRED   |
| Mountain landscape (place)  | `community/community-village-landscape.jpg` | ACQUIRED · WIRED |
| Village community gathering | `community/community-village-gathering.jpg` | ASSET REQUIRED   |

Code references: `src/lib/photos.ts` (`PHOTO` wired / `PHOTO_PENDING` not
wired) and `HeroBackground` / `PhotoPlate` / `MissionChapter` `photo=` props.

## Legal Notice

These are CONTEXTUAL REAL PHOTOGRAPHS (once real JPEGs land). Never write
copy such as:

- "Bhavya restored this forest"
- "Bhavya's school"
- "Bhavya's volunteers"
- "Bhavya's community project"

unless the repository contains verified evidence that the activity actually
belongs to Bhavya Foundation.

Use language such as:

- "Across the Himalayan communities we seek to serve."
- "Representative photograph — Himachal Pradesh."

## Provenance

Every image must be traceable to its original source. See
`metadata/photo_manifest.json` for photographer, source, location, license,
original source URL, target dimensions, and art direction.
