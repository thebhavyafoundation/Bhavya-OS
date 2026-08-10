# Prototype C: Next.js + Fumadocs

## Setup

```bash
npx create-fumadocs-app
cd bhavya-website-fumadocs
npm install
```

## Configuration

```ts
// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({});
```

```ts
// app/source.ts
import { loader } from "fumadocs-core/source";
import { docs } from "@/source";

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
});
```

## Pages Implemented

### 1. Homepage (`app/page.tsx`)

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Building the Future of AI Education</h1>
      <p>
        Learn AI by building real projects. From beginner to contributor in 6
        months.
      </p>

      <div>
        <h2>Start Your Journey</h2>
        <ul>
          <li>
            <a href="/docs/ai-institute">AI Foundations</a> — Master the
            fundamentals
          </li>
          <li>
            <a href="/docs/kp/kp-001">Knowledge Packages</a> — Interactive
            learning modules
          </li>
          <li>
            <a href="/blog">Blog</a> — Updates and insights
          </li>
        </ul>
      </div>

      <div>
        <h2>Why Bhavya Foundation?</h2>
        <div>
          <h3>Hands-On Learning</h3>
          <p>Every concept comes with a project. Build while you learn.</p>
        </div>
        <div>
          <h3>Open Source</h3>
          <p>Contribute to real projects. Build your portfolio.</p>
        </div>
        <div>
          <h3>Community</h3>
          <p>Learn with others. Mentor those who follow.</p>
        </div>
      </div>
    </main>
  );
}
```

### 2. AI Institute (`content/docs/ai-institute.mdx`)

```mdx
---
title: AI Institute
description: The learning hub for AI education at Bhavya Foundation.
---

# AI Institute

The learning hub for AI education at Bhavya Foundation.

## Learning Paths

### AI Foundations (Level 1)

- **Duration:** 12 weeks
- **Format:** 12 modules, 48 Knowledge Packages
- **Outcome:** Build your first AI application

### AI Builder (Level 2)

- **Duration:** 16 weeks
- **Format:** 16 modules, 64 Knowledge Packages
- **Outcome:** Deploy 3 production AI apps

### AI Contributor (Level 3)

- **Duration:** 20 weeks
- **Format:** 20 modules, 80 Knowledge Packages
- **Outcome:** Merged PRs in major AI repos

## How It Works

1. **Learn** — Read Knowledge Packages
2. **Build** — Complete projects
3. **Contribute** — Open source contributions
4. **Teach** — Mentoring deepens understanding
```

### 3. Knowledge Package (`content/docs/kp/kp-001.mdx`)

````mdx
---
title: KP-001: How Large Language Models Work
description: Understand the technology behind ChatGPT, Claude, and other AI assistants.
---

# KP-001: How Large Language Models Work

**Estimated Time:** 45 minutes | **Difficulty:** Beginner

## Learning Outcomes

1. Explain what a large language model is
2. Describe how LLMs process text
3. Understand the transformer architecture
4. Recognize the limitations of LLMs

---

## What Is a Large Language Model?

A large language model (LLM) is an AI system trained on vast amounts of text data.

```python
# Simple example of tokenization
text = "Hello, world!"
tokens = text.split()
print(tokens)
```
````

## Key Concepts

- **Tokens:** Words or subwords
- **Context Window:** How much text the model can "see"
- **Parameters:** The weights learned during training

---

## What Did We Learn?

- LLMs are AI systems trained on text data
- They use transformer architecture
- They predict the next token

**Next:** [KP-002: Python Basics](/docs/kp/kp-002)

````

### 4. Blog Post (`content/blog/welcome.mdx`)
```mdx
---
title: Welcome to Bhavya Foundation
description: Introducing our mission to build the future of AI education.
date: 2026-08-04
---

# Welcome to Bhavya Foundation

Introducing our mission to build the future of AI education.

## Our Mission

Learning AI should be hands-on, project-based, and accessible to everyone.

## What We're Building

- **Knowledge Packages** — Interactive learning modules
- **Projects** — Real-world applications
- **Community** — Global network of AI learners

## Join Us

- [Start Learning](/docs/ai-institute)
- [GitHub](https://github.com/bhavya-foundation)
````

## Build & Benchmark

```bash
# Build
npm run build

# Output
# - Next.js static export
# - MDX compiled to React components
# - Search index generated
```

## Expected Metrics

| Metric                    | Expected                  |
| ------------------------- | ------------------------- |
| Lighthouse Performance    | 90+                       |
| Lighthouse Accessibility  | 95+                       |
| Lighthouse Best Practices | 95+                       |
| Lighthouse SEO            | 95+                       |
| Build Time                | ~90s                      |
| Bundle Size               | ~120KB (React + Fumadocs) |
| First Contentful Paint    | ~1.2s                     |
| Largest Contentful Paint  | ~2.0s                     |
| Cumulative Layout Shift   | < 0.1                     |
