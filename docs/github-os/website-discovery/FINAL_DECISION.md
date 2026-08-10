# Final Decision

## Decision

**Build the Bhavya Foundation website using Astro + Starlight.**

## Evidence Summary

### Framework Evidence

| Criterion         | Astro + Starlight | Next.js    | Docusaurus | Nextra    |
| ----------------- | ----------------- | ---------- | ---------- | --------- |
| Performance (CWV) | 66% pass          | 30% pass   | ~50% pass  | ~50% pass |
| Content-first     | Yes               | No         | Yes        | Yes       |
| MDX Support       | Native            | Via plugin | Native     | Native    |
| Static Generation | Yes               | Optional   | Yes        | Yes       |
| Search            | Built-in          | Via plugin | Algolia    | Built-in  |
| Dark Mode         | Built-in          | Manual     | Built-in   | Built-in  |
| i18n              | Built-in          | Manual     | Built-in   | Built-in  |
| Stars             | 50k+              | 130k+      | 55k+       | 11k+      |
| License           | MIT               | MIT        | MIT        | MIT       |
| Monthly Cost      | $0                | $20+       | $0         | $20+      |

### Website Pattern Evidence

| Pattern                | Source                        | Recommendation                 |
| ---------------------- | ----------------------------- | ------------------------------ |
| Hero section           | Vercel, Stripe, Linear        | Bold headline + CTA + visual   |
| Sidebar navigation     | Starlight, Docusaurus         | For learning/docs content      |
| Command palette search | Vercel, Linear, Stripe        | ⌘K pattern with FlexSearch     |
| Dark mode first        | Vercel, Linear, GitHub        | Default dark, toggle available |
| Card-based layout      | Stripe, DeepLearning.AI       | KP cards, project cards        |
| Mega menu              | Vercel, Stripe, GitHub        | For complex navigation         |
| Social proof           | All elite sites               | Metrics, testimonials, logos   |
| Footer sitemap         | Stripe, Vercel                | Comprehensive links            |
| RSS feed               | DeepLearning.AI, Hugging Face | Newsletter distribution        |
| Version history        | GitHub, Docusaurus            | Git-based, edit links          |

### Cost Evidence

| Item      | Astro            | Next.js           | Docusaurus        |
| --------- | ---------------- | ----------------- | ----------------- |
| Hosting   | $0 (Vercel free) | $20+ (Vercel pro) | $0 (Netlify free) |
| Build     | $0               | $0                | $0                |
| Search    | $0 (FlexSearch)  | $0-50             | $0 (Algolia free) |
| Analytics | $0-9 (Plausible) | $0-50             | $0-9              |
| **Total** | **$0-9/mo**      | **$20-120/mo**    | **$0-9/mo**       |

### Maintenance Evidence

| Factor            | Astro         | Next.js          | Docusaurus    |
| ----------------- | ------------- | ---------------- | ------------- |
| Build complexity  | Low           | Medium           | Low           |
| Deployment        | Static (easy) | Server (complex) | Static (easy) |
| Updates           | Minimal       | Frequent         | Moderate      |
| Community support | Strong        | Very strong      | Strong        |
| Learning curve    | Low           | Medium           | Low           |

## Why Astro + Starlight

### 1. Performance

- 66% CWV pass rate (highest of any framework)
- Zero JavaScript by default
- Static generation with edge CDN
- Instant page loads

### 2. Content-first

- Native MDX support
- Content Collections with TypeScript validation
- Built for documentation and content sites
- Matches Knowledge Package model

### 3. Cost

- $0/month hosting (Vercel free tier)
- No server costs
- No external service dependencies
- Scales with traffic at no cost

### 4. Developer Experience

- Simple setup
- Hot reload
- TypeScript support
- Great documentation

### 5. Ecosystem

- 50k+ GitHub stars
- Strong community
- Active development
- Used by Anthropic, Google, Netlify

## Why Not Next.js

- 30% CWV pass rate (performance concern)
- $20+/month hosting (server costs)
- Overkill for content-only sites
- More complex deployment
- Server rendering overhead for static content

## Why Not Docusaurus

- Older architecture
- Less performant than Astro
- Limited to docs pattern
- Less flexible for custom pages
- React-based (heavier than Astro)

## Why Not Nextra

- Requires Next.js (inherits its costs/complexity)
- Smaller community
- Less performant
- More complex setup

## Implementation Plan

| Phase      | Duration  | Deliverables                      |
| ---------- | --------- | --------------------------------- |
| Foundation | Week 1-2  | Astro project, Starlight, schemas |
| Core Pages | Week 3-4  | Homepage, Learning Hub, templates |
| Features   | Week 5-6  | Search, dark mode, progress       |
| Content    | Week 7-8  | KP-001, modules, blog             |
| Polish     | Week 9-10 | Performance, SEO, deployment      |

**Total:** 10 weeks to production

## Cost Summary

| Item                  | Monthly  | Annual     |
| --------------------- | -------- | ---------- |
| Hosting (Vercel)      | $0       | $0         |
| Analytics (Plausible) | $0-9     | $0-108     |
| Search (FlexSearch)   | $0       | $0         |
| Email (Buttondown)    | $0       | $0         |
| **Total**             | **$0-9** | **$0-108** |

## Success Criteria

| Metric       | Target    | Measurement    |
| ------------ | --------- | -------------- |
| Lighthouse   | 90+       | Monthly audit  |
| CWV          | All green | Plausible      |
| Indexing     | 100%      | Search Console |
| Traffic      | 1000+/mo  | Analytics      |
| Bounce rate  | <50%      | Analytics      |
| Time on page | 3+ min    | Analytics      |

## Permanent Rule

Add to BEE 2.0:

> **No major implementation begins until GitHub OS has completed a discovery sprint and produced evidence-backed recommendations.**

## Decision

**Approved.** Begin Phase 1 immediately.
