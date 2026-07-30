# Component Registry

Reusable animation assets for the Production workspace.

## Structure

```
_config/registries/
├── components/      # Reusable React components
├── layouts/         # Page layouts
├── animations/      # Animation presets
├── charts/          # Chart components
├── maps/            # Map visualizations
├── diagrams/        # Diagram components
├── backgrounds/     # Background patterns
└── audio/           # Audio tracks
```

## Usage

The Remotion skill checks this registry before generating new components.

```typescript
// Example: Loading a component from registry
import { ConceptCard } from '../_config/registries/components/concept-card';
import { FadeIn } from '../_config/registries/animations/fade-in';
```

## Registry Format

Each registry entry is a self-contained module:

```
_config/registries/animations/
├── fade-in/
│   ├── index.tsx
│   ├── README.md
│   └── examples/
├── slide-up/
│   ├── index.tsx
│   ├── README.md
│   └── examples/
└── typewriter/
    ├── index.tsx
    ├── README.md
    └── examples/
```

## Adding New Components

1. Create folder in appropriate registry
2. Add index.tsx with implementation
3. Add README.md with usage docs
4. Add examples/ with sample usage
5. Update registry.json if needed
