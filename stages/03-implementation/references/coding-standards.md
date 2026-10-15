# Coding Standards — Bhavya Foundation

**For Stage 03: Implementation — TypeScript, React, Next.js patterns.**

---

## TypeScript

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Patterns

**Prefer interfaces for object shapes:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

**Use type for unions, primitives, computed:**

```typescript
type Status = "pending" | "active" | "archived";
type UserId = string & { readonly __brand: unique symbol };
```

**Generics with constraints:**

```typescript
function getById<T extends { id: string }>(
  items: T[],
  id: string,
): T | undefined;
```

### Imports

```typescript
// Package imports first
import { z } from "zod";
import { type User } from "@bhavya/shared";

// Relative imports last
import { Button } from "@/components/ui/button";
import { apiConstants } from "@/shared/constants/api-constants";
```

### No `any` Without Justification

```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good — with justification
const data: unknown = fetchData(); // API returns unknown; validated below
// @ts-expect-error Legacy API returns untyped data — validated by schema
const validated = schema.parse(data);
```

---

## React / Next.js

### Component Patterns

**Server Component (default):**

```typescript
// app/page.tsx
export default async function Page() {
  const data = await getData(); // Direct DB access
  return <View data={data} />;
}
```

**Client Component (when needed):**

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@bhavya/platform-ui';

export function InteractiveView() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(c => c + 1)}>{count}</Button>;
}
```

### Props Interface

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  onClick,
  children,
}: ButtonProps) {
  // ...
}
```

### Data Fetching

- Server Components: Direct async/await
- Client Components: SWR / TanStack Query
- No `fetch` in client components without cache strategy

---

## Design System Usage

### Colors

```tsx
// ❌ Bad — hardcoded
<div style={{ backgroundColor: '#1B3A2F' }}>

// ✅ Good — token reference
<div className="bg-forest-600">        {/* Tailwind */}
<div style={{ backgroundColor: 'var(--color-forest-600)' }}>  {/* CSS */}
<div style={{ backgroundColor: designTokens.colors.forest[600] }}>  {/* TS constant */}
```

### Typography

```tsx
// ❌ Bad
<h1 style={{ fontFamily: 'Playfair Display' }}>

// ✅ Good
<h1 className="font-display">          {/* Tailwind */}
<h1 style={{ fontFamily: 'var(--font-display)' }}>
```

### Spacing

```tsx
// ✅ Good — token-based
<div className="p-4 md:p-6 lg:p-8">    {/* Tailwind: space-4, space-6, space-8 */}
<div style={{ padding: 'var(--space-4)' }}>
```

---

## Error Handling

### Async Operations

```typescript
// ✅ Good — explicit error handling
async function getUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch user");
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error("Unexpected error fetching user", { id, error });
    throw new ApiError(500, "Internal error");
  }
}

// ❌ Bad — swallowed error
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // No error check!
}
```

### Error Types

```typescript
class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

---

## Testing Patterns

### Unit Tests

```typescript
// utils/format-date.test.ts
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formats ISO date to display format", () => {
    expect(formatDate("2026-10-07")).toBe("October 7, 2026");
  });

  it("handles invalid input", () => {
    expect(() => formatDate("invalid")).toThrow("Invalid date");
  });
});
```

### Integration Tests

```typescript
// app/api/users.test.ts
import { createTestClient } from "@/test/utils";

describe("GET /api/users/:id", () => {
  it("returns user", async () => {
    const client = createTestClient();
    const user = await factory.createUser();
    const response = await client.get(`/api/users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: user.id });
  });
});
```

---

## Git Workflow (per bhavya-github-workflow)

### Commits

```bash
# Format
feat(scope): subject

body (optional)

footer (optional)

# Examples
feat(api): add user search endpoint

fix(ui): resolve button focus outline

refactor(auth): extract token validation
```

### Branches

```bash
feat/user-search          # New feature
fix/button-focus          # Bug fix
refactor/auth-tokens      # Refactor
docs/readme-update        # Documentation
chore/deps-update         # Maintenance
```

---

## References

- `standards/` — Full engineering standards
- `contracts/<pkg>/CONTRACT.md` — Package interfaces
- `packages/platform-ui/src/components/` — Component library
- `skills/bhavya-design-system/SKILL.md` — Design system rules
- `skills/bhavya-security/SKILL.md` — Security practices
- `_config/design-tokens.md` — Token reference
- `_config/build-conventions.md` — Build/verification commands
