# SEO Strategy

## Technical SEO

### Static Generation

- All content pages rendered as static HTML
- Zero JavaScript by default (Astro)
- Instant page loads via CDN
- Core Web Vitals optimization

### Sitemap

**Implementation:** Astro sitemap integration
**URL:** `/sitemap.xml`
**Includes:** All public pages, Knowledge Packages, blog posts, projects

```astro
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap()],
});
```

### robots.txt

**URL:** `/robots.txt`
**Content:**

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://bhavyafoundation.org/sitemap.xml
```

### Structured Data

**Knowledge Package (Course schema):**

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "How Large Language Models Work",
  "description": "Understand the technology behind ChatGPT, Claude, and other AI assistants.",
  "provider": {
    "@type": "Organization",
    "name": "Bhavya Foundation"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT45M"
  },
  "isAccessibleForFree": true,
  "educationalLevel": "Beginner",
  "inLanguage": "en"
}
```

**Blog Post (Article schema):**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Welcome to Bhavya Foundation",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Bhavya Foundation"
  },
  "datePublished": "2026-08-04",
  "dateModified": "2026-08-04"
}
```

**FAQ (for Learning Hub):**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Bhavya Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bhavya Foundation is building the future of AI education..."
      }
    }
  ]
}
```

### Open Graph / Twitter Cards

**Template:**

```astro
<head>
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={Astro.url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={Astro.url} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</head>
```

## Content SEO

### Title Tags

**Pattern:** `{Page Title} | Bhavya Foundation`
**Example:** `How Large Language Models Work | Bhavya Foundation`

### Meta Descriptions

**Pattern:** First 155 characters of content, or custom frontmatter
**Example:** `Learn how large language models like ChatGPT and Claude work. Interactive knowledge package with hands-on exercises.`

### Heading Hierarchy

- H1: Page title (one per page)
- H2: Main sections
- H3: Subsections
- H4: Detailed divisions

### Internal Linking

- Every KP links to parent module and level
- Every KP links to related KPs
- Blog posts link to relevant KPs
- Projects link to prerequisite KPs

### Alt Text

**Pattern:** Descriptive, includes keywords where natural
**Example:** `Diagram showing the transformer architecture used in large language models`

## Keyword Strategy

### Primary Keywords

- "AI education"
- "Learn AI"
- "AI course"
- "AI foundations"
- "artificial intelligence learning"

### Long-tail Keywords

- "how large language models work"
- "learn to build AI assistants"
- "AI project for beginners"
- "open source AI education"

### Content Targets

| Page Type    | Primary Keyword | Long-tail             |
| ------------ | --------------- | --------------------- |
| Homepage     | AI education    | Learn AI online free  |
| Learning Hub | AI course       | AI foundations course |
| KP Article   | [KP topic]      | How to [topic]        |
| Project      | AI project      | Build [project type]  |
| Blog         | [post topic]    | [specific question]   |

## Analytics

### Implementation

**Tool:** Plausible Analytics (privacy-first)
**Installation:** Astro integration

```astro
// astro.config.mjs
import plausible from 'astro-plausible';

export default defineConfig({
  integrations: [
    plausible({
      domain: 'bhavyafoundation.org',
    }),
  ],
});
```

### Metrics to Track

- Page views per KP
- Time on page
- Bounce rate
- Search queries
- External links clicked
- Social shares
- Newsletter signups

## Performance Optimization

### Image Optimization

- Astro `<Image>` component (auto-optimization)
- WebP format with fallbacks
- Lazy loading for below-fold images
- Responsive srcset

### Font Optimization

- `font-display: swap` for web fonts
- Subset fonts to required characters
- Preload critical fonts

### Code Optimization

- Zero JS by default (Astro)
- Minimal CSS (Tailwind or CSS variables)
- Tree-shaking for any dependencies

### Caching

- Static assets: immutable cache headers
- HTML pages: CDN edge caching
- API responses: cache with revalidation

## Search Integration

### Option 1: FlexSearch (Recommended)

- Client-side search
- No external service required
- Index at build time
- Instant results

### Option 2: Algolia DocSearch

- Free for open source
- Managed service
- Instant search
- Analytics included

### Implementation

```astro
// Search component
<div id="search">
  <input type="text" placeholder="Search..." id="search-input" />
  <div id="search-results"></div>
</div>

<script>
  import FlexSearch from 'flexsearch';
  // Initialize search index
</script>
```

## Monitoring

### Google Search Console

- Submit sitemap
- Monitor indexing
- Check for errors
- Track search performance

### Core Web Vitals

- Monitor via Plausible
- Track LCP, FID, CLS
- Set performance budgets
- Alert on regressions
