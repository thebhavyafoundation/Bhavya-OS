# Animation Timing System

## Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `duration-none` | 0ms | No animation |
| `duration-fast` | 100ms | Micro interactions |
| `duration-normal` | 200ms | Default transitions |
| `duration-slow` | 300ms | Complex animations |
| `duration-slower` | 500ms | Page transitions |
| `duration-slowest` | 1000ms | Hero animations |

## Easing Functions

| Token | Value | Use Case |
|-------|-------|----------|
| `ease-linear` | linear | Mechanical motion |
| `ease-in` | cubic-bezier(0.4, 0, 1, 1) | Entering elements |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | Exiting elements |
| `ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | UI transitions |
| `ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Natural motion |

## Common Animations

### Fade In

```tsx
<div className="animate-in fade-in duration-300">Content</div>
```

### Slide Up

```tsx
<div className="animate-in slide-in-from-bottom-4 duration-300">Content</div>
```

### Scale

```tsx
<div className="animate-in zoom-in-95 duration-200">Content</div>
```

### Spin

```tsx
<div className="animate-spin duration-1000">Loading</div>
```

## Reduced Motion

```tsx
<div className="motion-safe:animate-bounce motion-reduce:animate-none">
  Content
</div>
```

## Custom Animations

```tsx
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

## Performance

1. **Use `transform`** for movement (GPU accelerated)
2. **Use `opacity`** for fading (GPU accelerated)
3. **Avoid `width`/`height`** animations (causes layout)
4. **Use `will-change`** sparingly
5. **Test on low-end devices**
