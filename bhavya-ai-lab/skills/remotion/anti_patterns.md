# Remotion Anti-Patterns

## 1. Mutating State in Render

**Bad:**
```tsx
const frame = useCurrentFrame();
let opacity = 0;
if (frame > 30) opacity = 1; // Mutation
```

**Good:**
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

## 2. Using `setTimeout` Instead of `delayRender`

**Bad:**
```tsx
useEffect(() => {
  setTimeout(() => setData(result), 1000);
}, []);
```

**Good:**
```tsx
const [handle] = useState(() => delayRender());
useEffect(() => {
  fetchData().then(result => {
    setData(result);
    continueRender(handle);
  });
}, [handle]);
```

## 3. Non-Deterministic Components

**Bad:**
```tsx
export const Bad = () => (
  <div>{Math.random()}</div> // Changes every render
);
```

**Good:**
```tsx
import { random } from 'remotion';

export const Good = () => (
  <div>{random('seed')}</div> // Deterministic
);
```

## 4. Forgetting `extrapolateRight: 'clamp'`

**Bad:**
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1]); // Continues beyond 1
```

**Good:**
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});
```

## 5. Using CSS Animations

**Bad:**
```tsx
<div style={{ animation: 'fadeIn 0.3s' }} /> // Not frame-accurate
```

**Good:**
```tsx
const opacity = interpolate(frame, [0, 9], [0, 1]);
<div style={{ opacity }} /> // Frame-accurate
```

## 6. Side Effects in Render

**Bad:**
```tsx
export const Bad = () => {
  console.log('rendering'); // Side effect
  return <div>Content</div>;
};
```

**Good:**
```tsx
export const Good = () => (
  <div>Content</div>
);
```

## 7. Using `Date.now()` for Timing

**Bad:**
```tsx
const start = Date.now(); // Not deterministic
```

**Good:**
```tsx
const frame = useCurrentFrame(); // Frame-based timing
```

## 8. Hardcoding Colors

**Bad:**
```tsx
<div style={{ color: '#ff0000' }} />
```

**Good:**
```tsx
import { DESIGN_TOKENS } from '../design-system';

<div style={{ color: DESIGN_TOKENS.colors.primary }} />
```

## 9. Missing Key in Maps

**Bad:**
```tsx
{items.map(item => <Item />)} // Missing key
```

**Good:**
```tsx
{items.map(item => <Item key={item.id} />)}
```

## 10. Using `window` Directly

**Bad:**
```tsx
const width = window.innerWidth; // Breaks in render
```

**Good:**
```tsx
const { width } = useVideoConfig(); // Safe
```
