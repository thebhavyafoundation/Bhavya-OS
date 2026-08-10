# Content Authoring

## MDX Workflow Comparison

### Creating a New Knowledge Package

**Astro + Starlight:**

1. Create `src/content/docs/kp/kp-002.mdx`
2. Add frontmatter
3. Write MDX content
4. Add to sidebar in `astro.config.mjs`
5. Done — appears on next build

**Nextra:**

1. Create `pages/kp/kp-002.mdx`
2. Add frontmatter
3. Write MDX content
4. Add to `_meta.json` for sidebar ordering
5. Done — appears on next build

**Fumadocs:**

1. Create `content/docs/kp/kp-002.mdx`
2. Add frontmatter
3. Write MDX content
4. Schema validated automatically
5. Done — appears on next build

### Component Usage

**All three support:**

- Code blocks with syntax highlighting (Shiki)
- Callouts/admonitions
- Tabs
- Steps
- Cards
- Images with optimization

**Astro advantages:**

- `<FileTree>` component built-in
- `<CardGrid>` for grid layouts
- Better default styling

**Nextra advantages:**

- `<FileTree>` built-in
- `<Steps>` built-in
- `<Callout>` with more variants

**Fumadocs advantages:**

- `<AutoTypeTable>` for API docs
- OpenAPI integration
- Storybook integration

### Content Collections

**Astro:**

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const knowledgePackages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.number(),
    module: z.string(),
    estimatedTime: z.number(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    learningOutcomes: z.array(z.string()),
    prerequisites: z.array(z.string()),
    tags: z.array(z.string()),
  }),
});

export const collections = { "knowledge-packages": knowledgePackages };
```

**Nextra:** No built-in schema validation (manual or use zod)

**Fumadocs:**

```typescript
// source.config.ts
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});
```

**Verdict:** Astro has best content collection system.

### Frontmatter

**Astro (with validation):**

```yaml
---
title: "KP-001: How Large Language Models Work"
description: "Understand the technology behind ChatGPT"
level: 1
module: "1.1"
estimatedTime: 45
difficulty: beginner
learningOutcomes:
  - "Explain what an LLM is"
  - "Describe transformer architecture"
prerequisites: []
tags: [AI, LLM, beginner]
---
```

**Nextra (manual):**

```yaml
---
title: KP-001: How Large Language Models Work
---
```

**Fumadocs (schema validated):**

```yaml
---
title: KP-001: How Large Language Models Work
description: "Understand the technology behind ChatGPT"
---
```

**Verdict:** Astro has richest frontmatter validation.

### Search

**Astro:** Pagefind (client-side, zero-config)
**Nextra:** Built-in flexsearch (client-side)
**Fumadocs:** Built-in search or Algolia

**Verdict:** All three have good search. Astro's Pagefind is simplest.

### Images

**Astro:**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---
<Image src={heroImage} alt="Hero" width={800} height={400} />
```

**Nextra:**

```mdx
![Hero](/hero.png)
```

**Fumadocs:**

```mdx
![Hero](/hero.png)
```

**Verdict:** Astro has best image optimization.

### Versioning

**Astro:** Manual (git-based)
**Nextra:** Built-in versioning
**Fumadocs:** Manual (git-based)

**Verdict:** Nextra has best versioning out of the box.

### i18n

**Astro:** Built-in i18n with Starlight
**Nextra:** Built-in i18n
**Fumadocs:** Manual setup

**Verdict:** Astro and Nextra tied.

## Content Pipeline

### Astro + Starlight

```
MDX File → Content Collections → Schema Validation → Static HTML → CDN
```

### Nextra

```
MDX File → Next.js Compilation → React Components → Static/SSR → CDN
```

### Fumadocs

```
MDX File → Fumadocs MDX → Schema Validation → React Components → Static/SSR → CDN
```

## Recommendation

**For Bhavya Foundation content:**

1. **Astro + Starlight** — Best for content-first sites
   - Richest frontmatter validation
   - Best image optimization
   - Simplest content pipeline
   - Zero JS by default

2. **Nextra** — Best for versioned documentation
   - Built-in versioning
   - Good search
   - Simple file-based routing

3. **Fumadocs** — Best for API documentation
   - OpenAPI integration
   - Auto-type-table
   - Storybook integration

**Winner: Astro + Starlight** for Knowledge Package content.
