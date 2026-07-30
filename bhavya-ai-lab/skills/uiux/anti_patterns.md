# UI/UX Anti-Patterns

## 1. Hardcoded Colors

**Bad:**
```tsx
<div style={{ color: '#ff0000' }} />
```

**Good:**
```tsx
<div className="text-destructive" />
```

## 2. Missing Focus States

**Bad:**
```tsx
<button className="... focus:outline-none">Click</button>
```

**Good:**
```tsx
<button className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Click</button>
```

## 3. No Alt Text

**Bad:**
```tsx
<img src="image.png" />
```

**Good:**
```tsx
<img src="image.png" alt="Description of image" />
```

## 4. Fixed Width Containers

**Bad:**
```tsx
<div style={{ width: '1200px' }}>Content</div>
```

**Good:**
```tsx
<div className="container mx-auto px-4">Content</div>
```

## 5. Small Touch Targets

**Bad:**
```tsx
<button className="h-6 w-6">X</button>
```

**Good:**
```tsx
<button className="h-10 w-10">X</button>
```

## 6. Missing Color Contrast

**Bad:**
```tsx
<span className="text-gray-400">Low contrast text</span>
```

**Good:**
```tsx
<span className="text-muted-foreground">Accessible text</span>
```

## 7. No Reduced Motion Support

**Bad:**
```tsx
<div className="animate-bounce">Content</div>
```

**Good:**
```tsx
<div className="motion-safe:animate-bounce motion-reduce:animate-none">Content</div>
```

## 8. Inconsistent Spacing

**Bad:**
```tsx
<div style={{ padding: '13px' }}>Content</div>
```

**Good:**
```tsx
<div className="p-4">Content</div>
```

## 9. Missing Keyboard Navigation

**Bad:**
```tsx
<div onClick={handleClick}>Click me</div>
```

**Good:**
```tsx
<button onClick={handleClick}>Click me</button>
```

## 10. No Loading States

**Bad:**
```tsx
{data ? <Content data={data} /> : null}
```

**Good:**
```tsx
{data ? <Content data={data} /> : <Skeleton />}
```
