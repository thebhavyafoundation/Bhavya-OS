# Grid System

## Container

| Token | Max Width | Use Case |
|-------|-----------|----------|
| `container-sm` | 640px | Small content |
| `container-md` | 768px | Medium content |
| `container-lg` | 1024px | Large content |
| `container-xl` | 1280px | XL content |
| `container-2xl` | 1440px | Full width |

## Breakpoints

| Token | Width | Use Case |
|-------|-------|----------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

## Grid Columns

| Token | Columns | Use Case |
|-------|---------|----------|
| `grid-cols-1` | 1 | Mobile |
| `grid-cols-2` | 2 | Tablet |
| `grid-cols-3` | 3 | Desktop |
| `grid-cols-4` | 4 | Large desktop |
| `grid-cols-6` | 6 | Complex layouts |
| `grid-cols-12` | 12 | Full flexibility |

## Grid Gaps

| Token | Value | Use Case |
|-------|-------|----------|
| `gap-1` | 4px | Tight |
| `gap-2` | 8px | Compact |
| `gap-3` | 12px | Default |
| `gap-4` | 16px | Comfortable |
| `gap-6` | 24px | Loose |
| `gap-8` | 32px | Section |

## Common Layouts

### Two Column

```tsx
<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
  <div>Sidebar</div>
  <div>Main Content</div>
</div>
```

### Three Column

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

### Sidebar Layout

```tsx
<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
  <aside className="lg:col-span-1">Sidebar</aside>
  <main className="lg:col-span-3">Content</main>
</div>
```
