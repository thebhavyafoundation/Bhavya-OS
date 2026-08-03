# MIGRATION GUIDE

**Date:** 2026-08-03
**Sprint:** Platform Foundation v2.0

---

## How to Migrate Existing Code

### 1. Replace Duplicate UI Components

**Before:**

```tsx
// apps/dashboard/src/app/page.tsx
function StatCard({ label, value }: { label: string; value: string }) {
  return <div style={{ background: "#1e293b", ... }}>{label}: {value}</div>;
}
```

**After:**

```tsx
import { StatCard } from "@bhavya/platform-ui";
```

### 2. Replace Duplicate Types

**Before:**

```ts
// apps/lesson-studio/src/lib/types.ts
interface KnowledgeObject {
  id: string;
  title: string;
  // ... 20 more fields
}
```

**After:**

```ts
import type { KnowledgeObject } from "@bhavya/types";
```

### 3. Replace Duplicate Utilities

**Before:**

```ts
// apps/bhavya-ai-lab/src/lib/data.ts
function readJSON(filePath: string) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}
```

**After:**

```ts
import { readJSON } from "@bhavya/platform";
```

### 4. Replace Duplicate Auth

**Before:**

```ts
// apps/knowledge-studio/src/lib/auth.ts
// 100+ lines of NextAuth config
```

**After:**

```ts
import { Authenticator, ApiKeyStrategy } from "@bhavya/security";
const auth = new Authenticator().use(new ApiKeyStrategy());
```

### 5. Replace Duplicate Rate Limiting

**Before:**

```ts
// apps/knowledge-studio/src/lib/rate-limit.ts
// 50+ lines of rate limiter
```

**After:**

```ts
import { RateLimiter, RateLimits } from "@bhavya/security";
const limiter = new RateLimiter();
const result = limiter.check(userId, RateLimits.auth);
```

### 6. Replace Duplicate Event Systems

**Before:**

```ts
// 3 different EventBus implementations
```

**After:**

```ts
import { EventBus } from "@bhavya/events";
const bus = new EventBus();
bus.subscribe("knowledge.created", handler);
await bus.publish({ type: "knowledge.created", source: "ks", payload: data });
```

### 7. Use Shared Layout

**Before:**

```tsx
// Every page file repeats:
<div style={{ display: "flex", minHeight: "100vh" }}>
  <Sidebar />
  <main>...</main>
</div>
```

**After:**

```tsx
import { PageLayout } from "@bhavya/platform-ui";
<PageLayout brand="Bhavya OS" sidebarItems={items} title="Dashboard">
  {/* content */}
</PageLayout>;
```

---

## Migration Priority

1. **Types first** — Replace all local type definitions with @bhavya/types
2. **Utilities second** — Replace readJSON, generateId, etc. with @bhavya/platform
3. **UI third** — Replace duplicated components with @bhavya/platform-ui
4. **Infrastructure last** — Replace EventBus, RateLimiter, Auth with platform packages
