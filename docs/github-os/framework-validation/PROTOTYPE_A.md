# Prototype A: Astro + Starlight

## Setup

```bash
npm create astro@latest -- --template starlight
cd bhavya-website-astro
npm install
```

## Configuration

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://bhavyafoundation.org",
  integrations: [
    starlight({
      title: "Bhavya Foundation",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/bhavya-foundation",
        },
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://linkedin.com/company/bhavya-foundation",
        },
        {
          icon: "youtube",
          label: "YouTube",
          href: "https://youtube.com/@bhavyafoundation",
        },
      ],
      sidebar: [
        { label: "Home", slug: "index" },
        { label: "AI Institute", slug: "ai-institute" },
        {
          label: "Knowledge Packages",
          items: [{ label: "KP-001: How LLMs Work", slug: "kp/kp-001" }],
        },
        { label: "Blog", slug: "blog/welcome" },
      ],
    }),
  ],
});
```

## Pages Implemented

### 1. Homepage (`src/content/docs/index.mdx`)

```mdx
---
title: Building the Future of AI Education
description: Learn AI by building real projects. From beginner to contributor in 6 months.
---

import { Card, CardGrid } from "@astrojs/starlight/components";

## Welcome to Bhavya Foundation

Learn AI by building real projects. From beginner to contributor in 6 months.

<CardGrid>
  <Card title="AI Foundations" icon="star">
    Master the fundamentals of artificial intelligence through hands-on
    projects.
  </Card>
  <Card title="Real Projects" icon="rocket">
    Build solutions that matter. From AI assistants to open source tools.
  </Card>
  <Card title="Open Source" icon="open-book">
    Contribute to real projects. Learn from the community. Teach others.
  </Card>
</CardGrid>

### Start Your Journey

Ready to learn AI? Begin with [AI Foundations](/ai-institute).
```

### 2. AI Institute (`src/content/docs/ai-institute.mdx`)

```mdx
---
title: AI Institute
description: The learning hub for AI education at Bhavya Foundation.
---

## Learning Paths

### AI Foundations (Level 1)

Master the fundamentals of artificial intelligence.

- **Duration:** 12 weeks
- **Format:** 12 modules, 48 Knowledge Packages
- **Outcome:** Build your first AI application

### AI Builder (Level 2)

Build real-world AI applications.

- **Duration:** 16 weeks
- **Format:** 16 modules, 64 Knowledge Packages
- **Outcome:** Deploy 3 production AI apps

### AI Contributor (Level 3)

Contribute to open source AI projects.

- **Duration:** 20 weeks
- **Format:** 20 modules, 80 Knowledge Packages
- **Outcome:** Merged PRs in major AI repos

## How It Works

1. **Learn:** Read Knowledge Packages with hands-on exercises
2. **Build:** Complete projects that demonstrate skills
3. **Contribute:** Open source contributions build your portfolio
4. **Teach:** Mentoring deepens understanding
```

### 3. Knowledge Package (`src/content/docs/kp/kp-001.mdx`)

````mdx
---
title: "KP-001: How Large Language Models Work"
description: Understand the technology behind ChatGPT, Claude, and other AI assistants.
---

## Learning Outcomes

By the end of this Knowledge Package, you will be able to:

1. Explain what a large language model is
2. Describe how LLMs process text
3. Understand the transformer architecture
4. Recognize the limitations of LLMs

**Estimated Time:** 45 minutes
**Difficulty:** Beginner

---

## What Is a Large Language Model?

A large language model (LLM) is an AI system trained on vast amounts of text data. It learns patterns in language to generate human-like text.

### How LLMs Work

LLMs use a neural network architecture called the **transformer**. The transformer processes text in parallel, allowing it to understand context and relationships between words.

```python
# Simple example of tokenization
text = "Hello, world!"
tokens = text.split()
print(tokens)  # ['Hello,', 'world!']
```
````

### Key Concepts

- **Tokens:** Words or subwords that the model processes
- **Context Window:** How much text the model can "see"
- **Parameters:** The weights the model learned during training

---

## What Did We Learn?

- LLMs are AI systems trained on text data
- They use transformer architecture
- They predict the next token in a sequence
- They have limitations and biases

**Next:** [KP-002: Python Basics](/kp/kp-002)

````

### 4. Blog Post (`src/content/docs/blog/welcome.mdx`)
```mdx
---
title: Welcome to Bhavya Foundation
description: Introducing our mission to build the future of AI education.
date: 2026-08-04
---

## Our Mission

Bhavya Foundation is building the future of AI education. We believe that learning AI should be hands-on, project-based, and accessible to everyone.

## What We're Building

- **Knowledge Packages:** Interactive learning modules that teach AI concepts through building
- **Projects:** Real-world applications that demonstrate skills
- **Community:** A global network of AI learners, builders, and mentors

## Join Us

We're just getting started. If you believe in learning by building, we'd love to have you.

- [Start Learning](/ai-institute)
- [GitHub](https://github.com/bhavya-foundation)
- [Discord](https://discord.gg/bhavyafoundation)
````

## Build & Benchmark

```bash
# Build
npm run build

# Output
# - Static HTML files
# - Zero JavaScript by default
# - Optimized images
# - Sitemap generated
```

## Expected Metrics

| Metric                    | Expected          |
| ------------------------- | ----------------- |
| Lighthouse Performance    | 95+               |
| Lighthouse Accessibility  | 100               |
| Lighthouse Best Practices | 100               |
| Lighthouse SEO            | 100               |
| Build Time                | ~30s              |
| Bundle Size               | ~5KB (minimal JS) |
| First Contentful Paint    | < 1s              |
| Largest Contentful Paint  | < 1.5s            |
| Cumulative Layout Shift   | 0                 |
