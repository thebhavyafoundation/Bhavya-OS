# Remotion Video Engineering

## Purpose

Production-ready Remotion patterns for educational video rendering. This skill covers the complete pipeline from React components to rendered MP4.

## Core Concepts

### Composition

A composition combines a React component with video metadata:

```tsx
import { Composition } from 'remotion';

export const RemotionRoot = () => (
  <Composition
    id="Lesson"
    component={Lesson}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

### Frame-Based Animation

All animation is driven by `useCurrentFrame()`:

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

### Sequence

Sequences control timing:

```tsx
import { Sequence } from 'remotion';

<Sequence from={0} durationInFrames={60}>
  <TitleCard />
</Sequence>
<Sequence from={60} durationInFrames={120}>
  <ContentCard />
</Sequence>
```

### AbsoluteFill

Layer components with absolute positioning:

```tsx
import { AbsoluteFill } from 'remotion';

<AbsoluteFill style={{ backgroundColor: 'white' }}>
  <AbsoluteFill style={{ opacity: 0.5 }} />
</AbsoluteFill>
```

## Rendering

### CLI Commands

```bash
# Preview in browser
npx remotion studio

# Render to MP4
npx remotion render Lesson output.mp4

# Render specific frames
npx remotion render Lesson output.mp4 --frames=0-89

# Render with concurrency
npx remotion render Lesson output.mp4 --concurrency=4
```

### Programmatic Rendering

```tsx
import { bundle } from '@remotion/bundler';
import { renderMedia, getCompositions } from '@remotion/renderer';

const bundleLocation = await bundle({ entryPoint: './src/index.ts' });
const compositions = await getCompositions(bundleLocation);
await renderMedia({
  composition: compositions[0],
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: 'output.mp4',
});
```

## Best Practices

1. **Use TypeScript** for type safety
2. **Keep components pure** - no side effects in render
3. **Use `delayRender`** for async data loading
4. **Prefer `interpolate`** over manual frame math
5. **Use `spring`** for natural motion
6. **Batch assets** with `prefetch()` before render
7. **Test with `vitest`** before rendering
