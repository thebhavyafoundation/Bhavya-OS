# Responsive Design System

## Breakpoints

| Token | Width | Devices |
|-------|-------|---------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape, desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

## Mobile First Approach

Always start with mobile styles, then add breakpoints:

```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

## Responsive Typography

```tsx
// Mobile: 24px
// Tablet: 30px
// Desktop: 36px
<h1 className="text-2xl sm:text-3xl lg:text-4xl">Title</h1>
```

## Responsive Spacing

```tsx
// Mobile: 16px
// Tablet: 24px
// Desktop: 32px
<section className="p-4 sm:p-6 lg:p-8">Content</section>
```

## Responsive Visibility

```tsx
// Hidden on mobile, visible on desktop
<div className="hidden lg:block">Desktop Only</div>

// Visible on mobile, hidden on desktop
<div className="block lg:hidden">Mobile Only</div>
```

## Responsive Images

```tsx
<img
  src="image.png"
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
/>
```

## Common Patterns

### Responsive Container

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>
```

### Responsive Navbar

```tsx
<nav className="flex items-center justify-between p-4 lg:justify-center">
  <Logo />
  <Menu className="lg:hidden" />
  <NavLinks className="hidden lg:flex" />
</nav>
```

### Responsive Card Grid

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Testing

Test at these widths:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Desktop)
- 1440px (Large Desktop)
