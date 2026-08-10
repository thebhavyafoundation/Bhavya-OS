# Implementation Recommendation

## Executive Summary

**Recommendation:** Astro + Starlight website framework
**Timeline:** 10 weeks
**Cost:** $0/month (static hosting on Vercel free tier)
**Team:** 1 developer + content authoring

## Architecture

```
bhavya-foundation.org
├── Astro (static site generator)
├── Starlight (documentation theme)
├── Content Collections (MDX)
├── FlexSearch (client-side search)
├── Plausible (analytics)
└── Vercel (hosting, free tier)
```

## Directory Structure

```
website/
├── public/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── knowledge-packages/ (MDX files)
│   │   │   ├── level-1/
│   │   │   │   ├── module-1.1/
│   │   │   │   │   ├── kp-001-how-llms-work.mdx
│   │   │   │   │   └── kp-002-python-basics.mdx
│   │   │   │   └── module-1.2/
│   │   │   └── level-2/
│   │   ├── projects/
│   │   │   ├── flagship/
│   │   │   │   └── build-first-ai-assistant.mdx
│   │   │   └── community/
│   │   ├── blog/
│   │   │   └── 2026-08-04-welcome.mdx
│   │   └── research/
│   ├── components/
│   │   ├── LearningOutcome.astro
│   │   ├── Assessment.astro
│   │   ├── ProgressTracker.astro
│   │   ├── RelatedKP.astro
│   │   ├── NewsletterSignup.astro
│   │   ├── GitHubActivity.astro
│   │   ├── YouTubeChannel.astro
│   │   ├── DiscordWidget.astro
│   │   ├── SocialLinks.astro
│   │   ├── TableOfContents.astro
│   │   └── SocialShare.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── KPLayout.astro
│   │   ├── ProjectLayout.astro
│   │   └── BlogLayout.astro
│   ├── pages/
│   │   ├── index.astro (homepage)
│   │   ├── learn/
│   │   │   ├── index.astro (learning hub)
│   │   │   ├── [level]/
│   │   │   │   └── [module]/
│   │   │   │       └── [...slug].astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── research/
│   │   │   └── index.astro
│   │   ├── community/
│   │   │   └── index.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── about/
│   │   │   ├── index.astro
│   │   │   ├── mission.astro
│   │   │   ├── team.astro
│   │   │   └── impact.astro
│   │   ├── docs/
│   │   │   └── [...slug].astro
│   │   ├── social/
│   │   │   └── index.astro
│   │   └── newsletter/
│   │       └── index.astro
│   ├── styles/
│   │   └── global.css
│   └── config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Phase 1: Foundation (Week 1-2)

### Tasks

1. Initialize Astro project
2. Install Starlight theme
3. Configure design tokens (colors, typography, spacing)
4. Set up content collections (KP, project, blog schemas)
5. Create base layout
6. Set up Git repository

### Deliverables

- Working Astro project
- Starlight configured
- Content collection schemas defined
- Base layout with navigation

## Phase 2: Core Pages (Week 3-4)

### Tasks

1. Build homepage with hero section
2. Build Learning Hub with sidebar navigation
3. Create KP article template
4. Create project card template
5. Create blog post template
6. Build /about pages

### Deliverables

- Homepage live
- Learning Hub structure
- KP rendering pipeline
- Project rendering pipeline
- Blog rendering pipeline

## Phase 3: Features (Week 5-6)

### Tasks

1. Integrate FlexSearch for full-text search
2. Implement dark mode toggle
3. Add progress tracking (localStorage)
4. Create social sharing components
5. Build table of contents component
6. Add breadcrumb navigation

### Deliverables

- Search working across all content
- Dark mode functional
- Progress tracking in place
- Social sharing buttons
- TOC auto-generated

## Phase 4: Content (Week 7-8)

### Tasks

1. Migrate KP-001 to MDX format
2. Create module pages for Level 1
3. Set up blog with first post
4. Create /social page with embeds
5. Set up RSS feed
6. Add newsletter signup

### Deliverables

- KP-001 live on website
- 5+ module pages
- Blog with 3+ posts
- Social hub page
- RSS feed working

## Phase 5: Polish (Week 9-10)

### Tasks

1. Performance optimization (Lighthouse audit)
2. SEO audit (meta tags, structured data)
3. Accessibility testing (WCAG 2.1 AA)
4. Analytics integration (Plausible)
5. Deploy to production
6. Submit to search engines

### Deliverables

- Lighthouse score 90+
- All meta tags in place
- WCAG 2.1 AA compliance
- Analytics tracking
- Production deployment
- Search engine submission

## Cost Analysis

### Hosting (Vercel Free Tier)

- Bandwidth: 100GB/month
- Builds: 1000/month
- Serverless functions: 100GB-hours
- **Cost: $0/month**

### Analytics (Plausible Cloud)

- Up to 10k pageviews/month: $9/month
- Or self-host: $0/month
- **Cost: $0-9/month**

### Search (FlexSearch)

- Client-side, no external service
- **Cost: $0/month**

### Email (Newsletter)

- Buttondown free tier: 100 subscribers
- Or self-host: $0/month
- **Cost: $0/month**

### Total Monthly Cost: $0-9/month

## Hardware Impact

### Build

- CPU: Low (static generation)
- RAM: 512MB
- Storage: 1GB
- Build time: 30-60 seconds

### Hosting

- CPU: None (static files)
- RAM: None
- Storage: 100MB
- Bandwidth: Scales with traffic

## Risk Assessment

### Low Risk

- Static generation (no server failures)
- CDN hosting (global availability)
- Zero JS (no client-side bugs)
- MIT license (no legal issues)

### Mitigation

- Git backup for all content
- Vercel automatic deployments
- Analytics for monitoring
- Search engine submission

## Success Metrics

### Performance

- Lighthouse score: 90+
- Core Web Vitals: All green
- Page load: < 2 seconds

### SEO

- Google indexing: 100% of pages
- Search rankings: Top 10 for "AI education"
- Organic traffic: 1000+ visits/month

### Engagement

- Time on page: 3+ minutes
- Bounce rate: < 50%
- Newsletter signups: 100+ month 1

## Decision

**Approve this recommendation** to build the Bhavya Foundation website using Astro + Starlight.

**Evidence:**

1. 66% CWV pass rate (best of any framework)
2. $0/month hosting cost
3. Content-first architecture matches KP model
4. 10-week timeline to production
5. Zero server costs (static generation)
6. MIT license (no vendor lock-in)

**Next steps:** Initialize project, begin Phase 1.
