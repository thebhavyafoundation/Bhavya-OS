# Frontend Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define frontend development standards for the Bhavya Foundation platform.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: React hooks + context
- **Testing**: Vitest + React Testing Library

## Component Standards

### File Structure

```
components/
  Button/
    Button.tsx
    Button.test.tsx
    Button.module.css
    index.ts
```

### Component Pattern

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, size, children, onClick }: ButtonProps) {
  return (
    <button 
      className={clsx(styles.button, styles[variant], styles[size])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## Styling Standards

### Tailwind Configuration

- Custom color palette matching brand
- Responsive breakpoints: sm, md, lg, xl
- Custom spacing scale

### CSS Modules

- Use for component-specific styles
- Avoid global CSS
- BEM-like naming convention

## Performance

- Lazy load below-the-fold content
- Optimize images with next/image
- Minimize client-side JavaScript
- Use React Server Components when possible

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader testing
