# Performance Plan

## Current State

The Bhavya Foundation website has:

- Static site generation (Astro)
- Basic optimization
- Pagefind search

**Maturity: 7/10**

## Target Metrics

| Metric                    | Target  | Current |
| ------------------------- | ------- | ------- |
| Lighthouse Performance    | 95+     | ~85     |
| Lighthouse Accessibility  | 100     | ~90     |
| Lighthouse Best Practices | 100     | ~90     |
| Lighthouse SEO            | 100     | ~90     |
| First Contentful Paint    | < 1.0s  | ~1.5s   |
| Largest Contentful Paint  | < 2.5s  | ~3.0s   |
| Total Blocking Time       | < 200ms | ~300ms  |
| Cumulative Layout Shift   | < 0.1   | ~0.1    |

## Performance Optimization

### 1. Image Optimization

```astro
---
// Use Astro's built-in image optimization
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<Image
  src={heroImage}
  alt="Bhavya Foundation"
  width={1200}
  height={630}
  loading="eager"
  decoding="async"
/>
```

### 2. Font Optimization

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/jetbrains-mono-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<style>
  @font-face {
    font-family: "Inter";
    src: url("/fonts/inter-var.woff2") format("woff2");
    font-display: swap;
  }

  @font-face {
    font-family: "JetBrains Mono";
    src: url("/fonts/jetbrains-mono-var.woff2") format("woff2");
    font-display: swap;
  }
</style>
```

### 3. Critical CSS

```html
<!-- Inline critical CSS -->
<style>
  /* Critical CSS here */
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
  .hero {
    padding: 4rem 2rem;
  }
</style>

<!-- Defer non-critical CSS -->
<link
  rel="preload"
  href="/styles.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

### 4. JavaScript Optimization

```html
<!-- Defer non-critical JS -->
<script src="/analytics.js" defer></script>

<!-- Use type="module" for modern JS -->
<script type="module" src="/app.js"></script>
```

### 5. Caching Strategy

```nginx
# Netlify/_headers
/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

### 6. Prefetching

```html
<!-- Prefetch next page -->
<link rel="prefetch" href="/ai-institute" />

<!-- Prefetch on hover -->
<script>
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = link.href;
      document.head.appendChild(prefetch);
    });
  });
</script>
```

### 7. Service Worker

```javascript
// sw.js
const CACHE_NAME = "bhavya-v1";
const ASSETS = ["/", "/styles.css", "/app.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
```

### 8. Bundle Analysis

```bash
# Analyze bundle
npx astro build --analyze

# Check bundle size
npx source-map-explorer dist/**/*.js
```

## Performance Checklist

### Images

- [ ] Use WebP format
- [ ] Lazy load below-fold images
- [ ] Set explicit width/height
- [ ] Use responsive images
- [ ] Optimize SVGs

### Fonts

- [ ] Preload critical fonts
- [ ] Use font-display: swap
- [ ] Subset fonts
- [ ] Use variable fonts

### CSS

- [ ] Inline critical CSS
- [ ] Defer non-critical CSS
- [ ] Remove unused CSS
- [ ] Use CSS containment

### JavaScript

- [ ] Defer non-critical JS
- [ ] Use type="module"
- [ ] Tree-shake unused code
- [ ] Code-split large bundles

### Caching

- [ ] Set cache headers
- [ ] Use immutable caching for assets
- [ ] Implement service worker
- [ ] Use CDN

### Network

- [ ] Enable compression
- [ ] Use HTTP/2
- [ ] Prefetch next pages
- [ ] Preconnect to origins

## Monitoring

```javascript
// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    const timing = performance.getEntriesByType("navigation")[0];
    console.log("FCP:", timing.domContentLoadedEventEnd - timing.fetchStart);
    console.log(
      "LCP:",
      performance.getEntriesByType("largest-contentful-paint")[0]?.startTime,
    );
  });
}
```

## Priority

| Task               | Priority | Effort |
| ------------------ | -------- | ------ |
| Image optimization | P0       | Medium |
| Font optimization  | P0       | Low    |
| Critical CSS       | P0       | Medium |
| JS optimization    | P1       | Medium |
| Caching strategy   | P1       | Low    |
| Prefetching        | P1       | Low    |
| Service worker     | P2       | High   |
| Bundle analysis    | P2       | Low    |
