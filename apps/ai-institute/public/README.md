# Static Assets for Bhavya AI Curriculum

This directory contains CC0 / Public Domain assets for the curriculum.
All assets are free to use without attribution (though attribution is appreciated).

## Folder Structure

```
public/
├── models/          # 3D Models (GLB, GLTF)
│   ├── kenney/      # From Kenney.nl (CC0)
│   ├── poly-haven/  # From Poly Haven (CC0)
│   └── open-source/ # From other open sources
├── icons/           # 2D Icons (SVG, PNG)
│   ├── reshot/      # From Reshot (Free license)
│   └── open-peeps/  # From Open Peeps (CC0)
├── animations/      # Lottie Animations (JSON)
│   └── lottiefiles/ # From LottieFiles (Free)
└── textures/        # Textures & HDRIs
    └── poly-haven/  # From Poly Haven (CC0)
```

## Sources & Licenses

| Source      | License | Website                  |
| ----------- | ------- | ------------------------ |
| Kenney.nl   | CC0     | https://kenney.nl/assets |
| Poly Haven  | CC0     | https://polyhaven.com    |
| Reshot      | Free    | https://www.reshot.com   |
| Open Peeps  | CC0     | https://openpeeps.com    |
| LottieFiles | Free    | https://lottiefiles.com  |

## Usage

### Models

```tsx
// In React Three Fiber
import { useGLTF } from "@react-three/drei";

function Robot() {
  const { scene } = useGLTF("/models/kenney/robot.glb");
  return <primitive object={scene} />;
}
```

### Icons

```tsx
// Direct SVG import
import BookIcon from "/icons/reshot/book.svg";

// Or as image
<img src="/icons/open-peeps/person-1.svg" alt="Student" />;
```

### Animations (Lottie)

```tsx
import Lottie from "lottie-react";
import animationData from "/animations/lottiefiles/loading.json";

<Lottie animationData={animationData} loop />;
```

### Textures

```tsx
import { useTexture } from "@react-three/drei";

const [texture] = useTexture("/textures/poly-haven/concrete-floor.jpg");
```

## Downloading Assets

### Kenney.nl Models

1. Visit https://kenney.nl/assets
2. Download packs like: "Robot Pack", "Space Kit", "Nature Kit"
3. Extract GLB files to `public/models/kenney/`

### Poly Haven

1. Visit https://polyhaven.com/models
2. Filter by "CC0" license
3. Download GLB files to `public/models/poly-haven/`
4. Download HDRIs to `public/textures/poly-haven/`

### Reshot Icons

1. Visit https://www.reshot.com
2. Search for education/science icons
3. Download SVGs to `public/icons/reshot/`

### Open Peeps

1. Visit https://openpeeps.com
2. Download the SVG pack
3. Extract to `public/icons/open-peeps/`

### LottieFiles

1. Visit https://lottieFiles.com
2. Search for free animations (loading, success, education)
3. Download JSON files to `public/animations/lottiefiles/`

## Asset Naming Convention

- Use kebab-case: `robot-arm.glb`, `book-open.svg`
- Prefix with source: `kenney-robot.glb`, `polyhaven-concrete.jpg`
- Include variant: `robot-idle.glb`, `robot-walk.glb`

## GitHub Pages Deployment

These assets are served via GitHub Pages at:
`https://<username>.github.io/<repo>/models/kenney/robot.glb`

Configure in repository Settings > Pages > Deploy from branch (main) / public folder.
