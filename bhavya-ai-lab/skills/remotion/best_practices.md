# Remotion Best Practices

## Project Structure

```
src/
├── Root.tsx           # Register compositions
├── compositions/      # Video compositions
├── components/        # Reusable components
│   ├── text/
│   ├── shapes/
│   ├── layouts/
│   └── animations/
├── lib/
│   ├── easing.ts      # Custom easing functions
│   ├── colors.ts      # Color palette
│   └── fonts.ts       # Font configuration
└── types.ts           # Shared types
```

## TypeScript

- Use strict mode
- Define prop types explicitly
- Export composition props as named types
- Use `satisfies` for composition metadata

```tsx
type LessonProps = {
  title: string;
  sections: Section[];
};

export const Lesson: React.FC<LessonProps> = ({ title, sections }) => (
  // ...
);

// Composition metadata
const metadata = {
  id: 'AI-001',
  durationInFrames: 900,
  fps: 30,
  width: 1920,
  height: 1080,
} satisfies CompositionProps;
```

## Performance

1. **Lazy load** heavy assets with `prefetch()`
2. **Use `React.memo`** for expensive components
3. **Avoid re-renders** with `useMemo` and `useCallback`
4. **Batch state updates** when possible
5. **Use `OffthreadVideo`** for video elements

## Testing

```bash
# Run tests
npx vitest

# Run specific test
npx vitest run src/components/text/Title.test.tsx
```

## Rendering

```bash
# Preview
npx remotion studio

# Render single composition
npx remotion render Lesson output.mp4

# Render with options
npx remotion render Lesson output.mp4 \
  --codec h264 \
  --quality 80 \
  --concurrency 4

# Render still frame
npx remotion still Lesson thumbnail.png --frame=0
```

## Naming Conventions

- Compositions: `PascalCase` (e.g., `Lesson`, `TitleCard`)
- Files: `kebab-case.tsx` (e.g., `title-card.tsx`)
- Types: `PascalCase` with `Props` suffix
- Constants: `SCREAMING_SNAKE_CASE`

## Design Tokens

Always use design tokens from the registry:

```tsx
import { DESIGN_TOKENS } from '../design-system';

const style = {
  backgroundColor: DESIGN_TOKENS.colors.background,
  color: DESIGN_TOKENS.colors.text,
  fontFamily: DESIGN_TOKENS.fonts.heading,
  fontSize: DESIGN_TOKENS.sizes.h1,
  padding: DESIGN_TOKENS.spacing.lg,
};
```

## Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure sufficient color contrast
- Support `prefers-reduced-motion`
- Add captions for audio content
