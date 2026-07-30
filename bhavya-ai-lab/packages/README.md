# Bhavya Package Registry (BPR)

## Philosophy

The Bhavya Package Registry makes the OS extensible without modifying the core. Skills, components, schemas, and builders become installable packages.

## Installation

```bash
bpr install remotion
bpr install education
bpr install diagrams
bpr install himalayan-assets
bpr install ai-foundations
```

## Package Structure

Each package contributes:

```
package/
├── package.json        # Metadata
├── components/         # Reusable UI components
├── schemas/            # Data schemas
├── registries/         # Reusable assets
├── skills/             # Domain expertise
├── builders/           # Build pipelines
└── tests/              # Validation checks
```

## Core Packages

| Package | Description |
|---------|-------------|
| `@bhavya/core` | OS utilities, routing, shared types |
| `@bhavya/education` | Curriculum design, lessons |
| `@bhavya/remotion` | Video rendering, animation |
| `@bhavya/website` | Static site generation |
| `@bhavya/knowledge` | Knowledge Objects storage |
| `@bhavya/assessment` | Quizzes, rubrics, certificates |
| `@bhavya/community` | Forums, collaborative learning |

## Community Packages

| Package | Description |
|---------|-------------|
| `@himalayan/assets` | Local images, sounds, cultural references |
| `@ai-foundations/curriculum` | Standard AI education curriculum |
| `@localization/hindi` | Hindi translations and voice rules |
| `@offline/usb` | USB/MicroSD packaging tools |

## Package Manifest

```json
{
  "name": "@bhavya/education",
  "version": "1.0.0",
  "description": "Curriculum design and lesson creation",
  "dependencies": ["@bhavya/core", "@bhavya/knowledge"],
  "exports": {
    "./components": "./components/index.ts",
    "./schemas": "./schemas/index.ts",
    "./skills": "./skills/index.ts",
    "./builders": "./builders/index.ts"
  }
}
```

## How Packages Extend the OS

1. **Install package** → `bpr install education`
2. **Register skills** → Package adds skills to registry
3. **Load components** → Package contributes components to registries
4. **Add builders** → Package adds build pipelines
5. **Extend schemas** → Package adds data schemas

## Future: Community Marketplace

Eventually, teachers and developers can publish packages:

```bash
bpr publish my-custom-lesson
bpr search himalayan-assets
bpr install @community/seasonal-curriculum
```

This makes Bhavya AI Lab a platform, not just an operating system.
