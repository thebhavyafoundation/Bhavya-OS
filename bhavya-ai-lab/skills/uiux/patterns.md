# UI/UX Patterns

## 1. Card Pattern

```tsx
<div className="rounded-lg border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

## 2. Button Pattern

```tsx
<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
  Click me
</button>
```

## 3. Input Pattern

```tsx
<input className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
```

## 4. Navigation Pattern

```tsx
<nav className="flex items-center space-x-4 lg:space-x-6">
  <a href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</a>
  <a href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</a>
</nav>
```

## 5. Grid Pattern

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

## 6. Hero Pattern

```tsx
<section className="flex flex-col items-center justify-center py-12 md:py-24">
  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Title</h1>
  <p className="mt-4 text-center text-muted-foreground">Subtitle</p>
</section>
```

## 7. Footer Pattern

```tsx
<footer className="border-t py-6 md:py-8">
  <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
    <p className="text-center text-sm text-muted-foreground">© 2026 Bhavya Foundation</p>
  </div>
</footer>
```

## 8. Modal Pattern

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="rounded-lg bg-background p-6 shadow-lg">
    <h2 className="text-lg font-semibold">Modal Title</h2>
    <p className="mt-2 text-muted-foreground">Content</p>
  </div>
</div>
```

## 9. Table Pattern

```tsx
<table className="w-full caption-bottom text-sm">
  <thead className="[&_tr]:border-b">
    <tr className="border-b transition-colors">
      <th className="h-12 px-4 text-left">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b transition-colors">
      <td className="p-4">Content</td>
    </tr>
  </tbody>
</table>
```

## 10. Badge Pattern

```tsx
<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Badge</span>
```
