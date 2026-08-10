# Prototype B: Nextra

## Setup

```bash
npx create-nextra@latest --theme docs
cd bhavya-website-nextra
npm install
```

## Configuration

```js
// next.config.mjs
import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

export default withNextra();
```

```jsx
// theme.config.jsx
export default {
  logo: <span>Bhavya Foundation</span>,
  project: {
    link: "https://github.com/bhavya-foundation",
  },
  docsRepositoryBase: "https://github.com/bhavya-foundation/website",
  footer: {
    text: "© 2026 Bhavya Foundation",
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Bhavya Foundation",
    };
  },
};
```

## Pages Implemented

### 1. Homepage (`pages/index.mdx`)

```mdx
---
title: Building the Future of AI Education
---

# Building the Future of AI Education

Learn AI by building real projects. From beginner to contributor in 6 months.

## Start Your Journey

- [AI Foundations](/ai-institute) — Master the fundamentals
- [Knowledge Packages](/kp/kp-001) — Interactive learning modules
- [Blog](/blog/welcome) — Updates and insights

## Why Bhavya Foundation?

**Hands-On Learning**
Every concept comes with a project. Build while you learn.

**Open Source**
Contribute to real projects. Build your portfolio.

**Community**
Learn with others. Mentor those who follow.
```

### 2. AI Institute (`pages/ai-institute.mdx`)

```mdx
---
title: AI Institute
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

### 3. Knowledge Package (`pages/kp/kp-001.mdx`)

````mdx
---
title: KP-001: How Large Language Models Work
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

**Next:** [KP-002: Python Basics](/kp/kp-002)

````

### 4. Blog Post (`pages/blog/welcome.mdx`)
```mdx
---
title: Welcome to Bhavya Foundation
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

- [Start Learning](/ai-institute)
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

| Metric                    | Expected               |
| ------------------------- | ---------------------- |
| Lighthouse Performance    | 85+                    |
| Lighthouse Accessibility  | 95+                    |
| Lighthouse Best Practices | 95+                    |
| Lighthouse SEO            | 95+                    |
| Build Time                | ~60s                   |
| Bundle Size               | ~80KB (React + Nextra) |
| First Contentful Paint    | ~1.5s                  |
| Largest Contentful Paint  | ~2.5s                  |
| Cumulative Layout Shift   | < 0.1                  |
