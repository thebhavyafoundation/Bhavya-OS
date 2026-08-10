# Content Rendering

## Knowledge Package as Article

### Rendering Pipeline

```
knowledge-packages/level-1/KP-001/
├── README.md (source of truth)
├── knowledge-package.json (metadata)
└── media/ (assets)
    ↓
Astro Content Collection
    ↓
Static HTML page with:
├── Hero section (title, metadata, estimated time)
├── Table of contents (auto-generated)
├── Rich content (MDX with components)
├── Assessment section
├── Related content
├── Social sharing
└── Version history
```

### MDX Components

**Built-in Components (from Starlight):**

- `<CodeBlock>` — Syntax highlighted code
- `<Callout>` — Info, warning, tip boxes
- `<Card>` — Feature cards
- `<Steps>` — Step-by-step instructions
- `<Tabs>` — Tabbed content
- `<FileTree>` — File structure visualization

**Custom Components (Bhavya-specific):**

- `<LearningOutcome>` — Learning outcome display
- `<Assessment>` — Interactive quiz
- `<ReflectionPrompt>` — Reflection questions
- `<ProgressTracker>` — Progress indicator
- `<RelatedKP>` — Related Knowledge Packages
- `<MediaPlayer>` — Image/video/audio player

### Article Template

```astro
---
// src/content/knowledge-packages/[...slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import TableOfContents from '../../components/TableOfContents.astro';
import SocialShare from '../../components/SocialShare.astro';
import RelatedKP from '../../components/RelatedKP.astro';

const { entry } = Astro.props;
const { Content, headings } = await entry.render();
---

<BaseLayout title={entry.data.title}>
  <article>
    <header>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/learn">Learn</a></li>
          <li><a href={`/learn/${entry.data.level}`}>{entry.data.levelName}</a></li>
          <li><a href={`/learn/${entry.data.level}/${entry.data.module}`}>{entry.data.moduleName}</a></li>
          <li aria-current="page">{entry.data.title}</li>
        </ol>
      </nav>

      <h1>{entry.data.title}</h1>

      <div class="metadata">
        <span>⏱ {entry.data.estimatedTime} min</span>
        <span>📊 {entry.data.difficulty}</span>
        <span>📝 {entry.data.sections} sections</span>
      </div>

      <p class="description">{entry.data.description}</p>
    </header>

    <div class="content-layout">
      <aside class="toc">
        <TableOfContents headings={headings} />
      </aside>

      <main class="content">
        <Content />
      </main>
    </div>

    <footer>
      <SocialShare title={entry.data.title} url={Astro.url} />
      <RelatedKP related={entry.data.related} />
    </footer>
  </article>
</BaseLayout>
```

### Frontmatter Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const knowledgePackages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.number(),
    levelName: z.string(),
    module: z.string(),
    moduleName: z.string(),
    estimatedTime: z.number(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    sections: z.number(),
    learningOutcomes: z.array(z.string()),
    prerequisites: z.array(z.string()),
    tags: z.array(z.string()),
    related: z.array(z.string()),
    version: z.string(),
    status: z.enum(["draft", "review", "published"]),
    author: z.string(),
    lastUpdated: z.date(),
  }),
});

export const collections = {
  "knowledge-packages": knowledgePackages,
};
```

## Project as Article

### Rendering Pipeline

```
projects/flagship/build-first-ai-assistant/
├── README.md (source of truth)
├── project.json (metadata)
└── milestones/ (tasks)
    ↓
Astro Content Collection
    ↓
Static HTML page with:
├── Hero section (title, status, tech stack)
├── Overview description
├── Prerequisites
├── Milestones with tasks
├── Contributors
├── Repository link
└── Related KPs
```

### Project Template

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import MilestoneCard from '../../components/MilestoneCard.astro';
import ContributorList from '../../components/ContributorList.astro';

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<BaseLayout title={entry.data.title}>
  <article>
    <header>
      <span class="status-badge">{entry.data.status}</span>
      <h1>{entry.data.title}</h1>
      <p>{entry.data.description}</p>

      <div class="tech-stack">
        {entry.data.techStack.map(tech => (
          <span class="tech-badge">{tech}</span>
        ))}
      </div>

      <div class="stats">
        <span>⏱ {entry.data.estimatedTime} hours</span>
        <span>📊 {entry.data.difficulty}</span>
        <span>👥 {entry.data.contributors.length} contributors</span>
      </div>
    </header>

    <main>
      <Content />

      <section class="milestones">
        <h2>Milestones</h2>
        {entry.data.milestones.map(milestone => (
          <MilestoneCard milestone={milestone} />
        ))}
      </section>
    </main>

    <footer>
      <ContributorList contributors={entry.data.contributors} />
      <a href={entry.data.repo} class="github-link">
        View on GitHub
      </a>
    </footer>
  </article>
</BaseLayout>
```

## Blog Post

### Rendering Pipeline

```
blog/2026-08-04-welcome.md
    ↓
Astro Content Collection
    ↓
Static HTML page with:
├── Hero (title, date, author, reading time)
├── Featured image
├── Full content (MDX)
├── Tags
├── Social sharing
└── Related posts
```

### Blog Template

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import AuthorCard from '../../components/AuthorCard.astro';

const { entry } = Astro.props;
const { Content, headings } = await entry.render();
---

<BaseLayout title={entry.data.title}>
  <article class="blog-post">
    <header>
      <time>{entry.data.date}</time>
      <h1>{entry.data.title}</h1>
      <AuthorCard author={entry.data.author} />
      <span class="reading-time">⏱ {entry.data.readingTime} min read</span>
    </header>

    {entry.data.image && (
      <img src={entry.data.image} alt={entry.data.title} class="featured-image" />
    )}

    <main>
      <Content />
    </main>

    <footer>
      <div class="tags">
        {entry.data.tags.map(tag => (
          <a href={`/blog/tag/${tag}`}>{tag}</a>
        ))}
      </div>
      <SocialShare title={entry.data.title} url={Astro.url} />
    </footer>
  </article>
</BaseLayout>
```

## Media Rendering

### Image Handling

- **Hero images:** Astro `<Image>` component (optimized, lazy-loaded)
- **Content images:** Markdown syntax with alt text
- **Diagrams:** SVG inline or Mermaid.js
- **Thumbnails:** Content Collections schema validation

### Video Handling

- **YouTube:** Embed via iframe
- **Self-hosted:** Astro `<Video>` component
- **Transcripts:** Always provide for accessibility

### Audio Handling

- **Podcast:** HTML5 `<audio>` element
- **Transcripts:** Always provide for accessibility

## Version History

### Implementation

- Git-based versioning (each edit is a commit)
- "Last updated" timestamp in footer
- "Edit this page" link to GitHub
- Changelog section for major updates

### Template

```astro
<footer class="version-info">
  <p>Last updated: {entry.data.lastUpdated}</p>
  <a href={`https://github.com/bhavya-foundation/website/edit/main/src/content/${entry.id}`}>
    Edit this page
  </a>
</footer>
```

## Social Sharing

### Implementation

- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags
- Copy link button
- Share to Twitter/LinkedIn buttons

### Template

```astro
<head>
  <meta property="og:title" content={entry.data.title} />
  <meta property="og:description" content={entry.data.description} />
  <meta property="og:image" content={entry.data.image} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```
