# Knowledge Package Rendering

## Current State

The KP-001 page has:

- Good content structure
- Basic Starlight components
- Code blocks with syntax highlighting
- Callouts

**Maturity: 6/10**

## Elite Documentation Patterns

### Notion

- **Typography:** Beautiful, readable
- **Layout:** Optimal line length (65-75 chars)
- **Images:** Inline with text
- **Tables:** Styled with hover effects
- **Callouts:** Custom icons, colored backgrounds

### Stripe Docs

- **Code blocks:** Copy button, line numbers, titles
- **Tabs:** For multiple languages
- **Callouts:** Warning, info, success variants
- **Navigation:** Table of contents + breadcrumbs
- **Search:** Cmd+K with instant results

### Linear Docs

- **Clean layout:** Minimal distractions
- **Progressive disclosure:** Collapsible sections
- **Interactive:** Live code examples
- **Search:** Instant, keyboard-first

## Recommended KP Rendering

### Typography

- **Title:** Display size, weight 800
- **H2:** 2rem, weight 700, margin-top 3rem
- **H3:** 1.5rem, weight 600, margin-top 2rem
- **Body:** 1rem, line-height 1.7, max-width 65ch
- **Code:** 0.875rem, JetBrains Mono

### Layout

```css
.kp-content {
  max-width: 65ch;
  margin: 0 auto;
}

.kp-content h2 {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}
```

### Components

#### Learning Outcomes

```mdx
:::note[Learning Outcomes]
By the end of this package, you will be able to:

1. Explain tokenization
2. Describe attention mechanisms
3. Apply prompt engineering
   :::
```

#### Concept Cards

```mdx
<div class="concept-card">
  <h3>Tokenization</h3>
  <p>How LLMs process text into tokens.</p>
  <span class="concept-tag">Core Concept</span>
</div>
```

#### Interactive Code

````mdx
```python copy title="tokenization.py"
def tokenize(text):
    return text.split()
```
````

````

#### Progress Indicator
```mdx
<div class="kp-progress">
  <div class="progress-bar" style="width: 60%"></div>
  <span>60% complete</span>
</div>
````

### Navigation

- **Table of contents:** Sticky sidebar
- **Breadcrumbs:** KP-001 > Tokenization
- **Previous/Next:** Previous KP | Next KP
- **Progress:** Reading progress bar

### Interactive Elements

- **Copy code:** One-click copy
- **Run code:** Live code execution
- **Quiz:** Inline knowledge check
- **Reflection:** Journal prompt

## Implementation

### CSS Variables

```css
:root {
  --kp-max-width: 65ch;
  --kp-spacing: 2rem;
  --kp-border-radius: 8px;
}
```

### Component Styles

```css
.kp-content {
  max-width: var(--kp-max-width);
  margin: 0 auto;
}

.concept-card {
  border: 1px solid var(--color-border);
  border-radius: var(--kp-border-radius);
  padding: var(--kp-spacing);
  margin: var(--kp-spacing) 0;
  transition: border-color 0.2s;
}

.concept-card:hover {
  border-color: var(--color-primary);
}

.concept-tag {
  display: inline-block;
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.kp-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-border);
  z-index: 100;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.2s;
}
```

## Priority

| Task                    | Priority | Effort |
| ----------------------- | -------- | ------ |
| Typography improvements | P0       | Low    |
| Layout optimization     | P0       | Low    |
| Copy code button        | P0       | Low    |
| Table of contents       | P1       | Medium |
| Breadcrumbs             | P1       | Low    |
| Progress indicator      | P1       | Medium |
| Concept cards           | P2       | Medium |
| Interactive code        | P2       | High   |
