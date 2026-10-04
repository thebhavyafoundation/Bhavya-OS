# Poly Haven 3D Models - CC0

## Download Instructions

1. Go to: https://polyhaven.com/models
2. Filter by "CC0" license
3. Download GLTF files (1K/2K/4K/8K resolution options)
3. Copy to this folder

## License

**CC0 (Public Domain)** - Free for commercial and personal use without attribution.

## Already Downloaded

### Portable Generator
- `portable-generator-1k.gltf` - 1K resolution GLTF
- `portable-generator.bin` - Binary buffer for GLTF
- `portable-generator-4k-blend.zip` - Blender source file (4K)

## Recommended Categories

### Industrial & Infrastructure
- Portable Generator (downloaded)
- Power Box
- Utility Box
- Industrial Pipe Lamp
- Old Drill Press
- Propane Torch

### Electronics & Appliances
- Classic Laptop
- Television
- Wall Clock
- Binder Notebook

### Furniture
- Metal Office Desk
- Vintage Day Bed
- Wall Clock

### Nature
- Long Life Food
- Portable Welding Cart
- Portable Searchlight

### Weapons/Tools
- Bolt Action Rifle
- Old Drill Press
- Propane Torch

## File Formats

- **GLTF** - JSON + binary (.gltf + .bin) - Recommended for web
- **GLB** - Binary GLTF (single file)
- **FBX** - Autodesk FBX
- **USD** - Universal Scene Description
- **BLEND** - Blender source

## Resolution Variants

Each model typically available in:
- **1K** - ~50-100 MB (web-optimized)
- **2K** - ~200-500 MB (high quality)
- **4K** - ~500 MB - 1 GB (production quality)
- **8K** - 1-3 GB (maximum quality)

## Usage

```tsx
import { useGLTF } from '@react-three/drei'

function Generator() {
  const { scene } = useGLTF('/models/poly-haven/portable-generator-1k.gltf')
  return <primitive object={scene} />
}
```

## Texture Maps Included

Each model typically includes:
- `diff` - Diffuse/Albedo (JPG/PNG)
- `rough` - Roughness (EXR/PNG)
- `metal` - Metalness (EXR/PNG)
- `nor_gl` - Normal GL (EXR/PNG)
- `nor_dx` - Normal DX (EXR/PNG)
- `ao` - Ambient Occlusion (EXR/PNG)
- `spec` - Specular (EXR/PNG)
- `arm` - AO/Roughness/Metal packed (JPG/PNG)
- `alpha` - Alpha mask (PNG/EXR/JPG)
- `tint_mask` - Tint mask (PNG/EXR/JPG)

## Source

https://polyhaven.com/models
License: CC0 (Public Domain)