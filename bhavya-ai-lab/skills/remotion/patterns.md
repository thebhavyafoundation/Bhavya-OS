# Remotion Patterns

## 1. Composition Pattern

Register a renderable video:

```tsx
import { Composition } from 'remotion';
import { Lesson } from './Lesson';

export const RemotionRoot = () => (
  <Composition
    id="AI-001-WhatIsAI"
    component={Lesson}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      title: "What is AI?",
      sections: [...]
    }}
  />
);
```

## 2. Sequence Pattern

Control timing with sequences:

```tsx
import { Sequence, AbsoluteFill } from 'remotion';

export const Lesson = ({ title, sections }) => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <TitleCard title={title} />
    </Sequence>
    {sections.map((section, i) => (
      <Sequence key={i} from={90 + i * 120} durationInFrames={120}>
        <SectionCard section={section} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
```

## 3. Interpolate Pattern

Animate values over frames:

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const FadeIn = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>{children}</div>;
};
```

## 4. Spring Pattern

Natural motion with springs:

```tsx
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

export const SlideIn = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, from: 0, to: 1 });
  return <div style={{ transform: `scale(${scale})` }}>{children}</div>;
};
```

## 5. Sequence Stack Pattern

Layer multiple sequences:

```tsx
import { Sequence, AbsoluteFill } from 'remotion';

export const Scene = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={300}>
      <Background />
    </Sequence>
    <Sequence from={30} durationInFrames={270}>
      <Content />
    </Sequence>
    <Sequence from={60} durationInFrames={240}>
      <Overlay />
    </Sequence>
  </AbsoluteFill>
);
```

## 6. DelayRender Pattern

Load async data before render:

```tsx
import { delayRender, continueRender } from 'remotion';
import { useState, useEffect } from 'react';

export const DataLoader = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        setData(d);
        continueRender(handle);
      });
  }, [handle]);

  if (!data) return null;
  return <div>{data.title}</div>;
};
```

## 7. Prefetch Pattern

Preload assets before render:

```tsx
import { prefetch } from 'remotion';

// Before render
const { free } = prefetch('https://example.com/image.png');

// After render
free();
```

## 8. Loop Pattern

Repeat content:

```tsx
import { Loop } from 'remotion';

export const RepeatingContent = () => (
  <Loop durationInFrames={60}>
    <AnimatedElement />
  </Loop>
);
```

## 9. Series Pattern

Sequential content:

```tsx
import { Series } from 'remotion';

export const Lesson = () => (
  <Series>
    <Series.Sequence durationInFrames={90}>
      <TitleCard />
    </Series.Sequence>
    <Series.Sequence durationInFrames={120}>
      <ContentCard />
    </Series.Sequence>
    <Series.Sequence durationInFrames={60}>
      <SummaryCard />
    </Series.Sequence>
  </Series>
);
```

## 10. AbsoluteFill Layering

Stack layers:

```tsx
import { AbsoluteFill } from 'remotion';

export const Scene = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <AbsoluteFill style={{ backgroundImage: 'url(/bg.png)' }} />
    <AbsoluteFill style={{ padding: 100 }}>
      <h1>Title</h1>
    </AbsoluteFill>
    <AbsoluteFill style={{ bottom: 50, right: 50 }}>
      <Logo />
    </AbsoluteFill>
  </AbsoluteFill>
);
```
