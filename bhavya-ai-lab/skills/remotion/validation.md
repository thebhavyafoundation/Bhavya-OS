# Remotion Validation Rules

## Composition Validation

- [ ] Composition ID is unique
- [ ] Duration is positive integer
- [ ] FPS is valid (24, 30, 60)
- [ ] Width and height are multiples of 2
- [ ] Component is defined and exported

## Component Validation

- [ ] No side effects in render
- [ ] No `Date.now()` or `Math.random()`
- [ ] No `window` or `document` access
- [ ] All props have types
- [ ] No unused imports

## Animation Validation

- [ ] All values are frame-based
- [ ] Interpolate has `extrapolateRight: 'clamp'`
- [ ] Spring uses `useVideoConfig()` for FPS
- [ ] No CSS animations used
- [ ] Timing is deterministic

## Asset Validation

- [ ] All images exist in `/public`
- [ ] All fonts are loaded with `@font-face`
- [ ] All audio files are accessible
- [ ] Prefetch is used for remote assets
- [ ] No broken references

## Performance Validation

- [ ] No unnecessary re-renders
- [ ] Heavy components are memoized
- [ ] Assets are lazy loaded
- [ ] No large inline objects
- [ ] Bundle size is reasonable

## Accessibility Validation

- [ ] Alt text for images
- [ ] Sufficient color contrast
- [ ] Semantic HTML used
- [ ] Captions available
- [ ] Reduced motion supported

## Output Validation

- [ ] Video renders without errors
- [ ] Audio syncs with video
- [ ] All frames are present
- [ ] Quality meets standards
- [ ] File size is acceptable
