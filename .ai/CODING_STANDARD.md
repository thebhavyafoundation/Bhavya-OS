# Bhavya Foundation — Coding Standard

**How We Write Code**

---

## Principles

1. **Readability** — Code is read more than written
2. **Simplicity** — Simple is better than complex
3. **Consistency** — Follow existing patterns
4. **Minimalism** — Write less code
5. **Testability** — Code must be testable

---

## TypeScript Rules

### Naming

| Type       | Convention  | Example         |
| ---------- | ----------- | --------------- |
| Variables  | camelCase   | `userName`      |
| Functions  | camelCase   | `getUser()`     |
| Components | PascalCase  | `UserCard`      |
| Constants  | UPPER_SNAKE | `API_URL`       |
| Types      | PascalCase  | `UserType`      |
| Files      | PascalCase  | `UserCard.tsx`  |
| Folders    | kebab-case  | `user-profile/` |

### Structure

```typescript
// Component template
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  title: string;
  description?: string;
}

export function Component({ title, description }: ComponentProps) {
  return (
    <div className="...">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Rules

1. One component per file
2. Maximum 200 lines per file
3. Maximum 20 lines per function
4. Maximum 3 levels of nesting
5. Use named exports
6. Use const over let
7. Use arrow functions for callbacks
8. Use destructuring
9. Use early returns
10. No magic numbers

---

## React Rules

1. Use functional components
2. Use hooks over lifecycle methods
3. Use custom hooks for shared logic
4. Use React.memo for expensive renders
5. Use useCallback for stable references
6. Use useMemo for expensive computations
7. Use error boundaries
8. Use Suspense for loading states

---

## CSS Rules

1. Use Tailwind CSS
2. Use design tokens
3. Use responsive design
4. Use semantic HTML
5. Use focus indicators
6. Use reduced-motion
7. Use proper contrast ratios

---

## Testing Rules

1. Test behavior, not implementation
2. Write tests before code (TDD)
3. Test edge cases
4. Test error cases
5. Keep tests fast
6. Keep tests isolated
7. Keep tests readable
8. Keep tests maintainable
9. Aim for 80% coverage
10. Test in production

---

## Documentation Rules

1. Document why, not what
2. Use JSDoc for complex functions
3. Use comments for business logic
4. Keep comments up-to-date
5. Use TODO for future work
6. Use FIXME for known issues
7. Document APIs
8. Document architecture
9. Document decisions
10. Document onboarding

---

_Every AI agent must follow this coding standard._
