# Poly Haven Textures - CC0

## Download Instructions

1. Go to: https://polyhaven.com/textures
2. Filter by CC0 license
3. Download textures (4K/8K recommended for quality)
4. Extract and copy to this folder

## License

**CC0 (Public Domain)** - Free for commercial and personal use without attribution.

## Recommended Categories

### Floors

- `floor-wood-01` - Wood floor
- `floor-concrete-01` - Concrete floor
- `floor-tiles-01` - Tile floor

### Walls

- `wall-brick-01` - Brick wall
- `wall-plaster-01` - Plaster wall
- `wall-concrete-01` - Concrete wall

### Ground/Nature

- `ground-grass-01` - Grass
- `ground-dirt-01` - Dirt
- `ground-sand-01` - Sand

### Materials

- `metal-scratched-01` - Scratched metal
- `metal-rusted-01` - Rusted metal
- `fabric-canvas-01` - Canvas fabric
- `fabric-denim-01` - Denim

### HDRIs (for lighting)

- `hdri-outdoor-01` - Outdoor lighting
- `hdri-studio-01` - Studio lighting
- `hdri-sunset-01` - Sunset lighting

## Usage

```tsx
import { useTexture } from "@react-three/drei";

const [floorTexture] = useTexture("/textures/poly-haven/floor-wood-01.jpg");
const [hdri] = useTexture("/textures/poly-haven/hdri-outdoor-01.hdr");
```

## File Formats

- **Textures**: JPG/PNG (color), EXR/PNG (normal, roughness, metalness, AO)
- **HDRIs**: HDR/EXR

## Naming Convention

```
{category}-{name}-{variant}.{ext}
Examples:
- floor-wood-oak-01.jpg
- wall-brick-red-01.exr
- hdri-outdoor-sunset-01.hdr
```

## Source

https://polyhaven.com/textures
License: CC0 (Public Domain)
