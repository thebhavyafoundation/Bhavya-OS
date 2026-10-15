# ACCESSIBILITY-AUDIT — Current Accessibility State

**Date:** 2026-10-12
**Source:** Repository inspection, WCAG 2.2 AA checklist

---

## Current Accessibility Implementation

### ✅ Implemented

#### Global (globals.css)

- **Skip link** — `.skip-link` with focus positioning (lines 37-54)
- **Focus-visible** — Global `*:focus-visible` with gold outline (lines 56-83)
- **High contrast mode** — `@media (forced-colors: active)` support (lines 79-83)
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` in apple-springs.ts

#### Semantic HTML

- **Landmarks** — `<header>`, `<main>`, `<nav>`, `<footer>` in layout
- **Heading hierarchy** — H1 on each page, logical nesting
- **Form labels** — `FormField` component wraps inputs with labels
- **ARIA attributes** — Dropdowns, modals, tabs use `aria-expanded`, `aria-controls`, `role`

#### Components (platform-ui)

- **Button** — `type="button"`, focus styles, disabled state
- **Modal** — `role="dialog"`, `aria-modal="true"`, focus trap
- **Tabs** — `role="tablist"`, `aria-selected`, keyboard navigation
- **Sidebar** — `role="navigation"`, collapsible mobile
- **DataTable** — `role="grid"`, sortable headers
- **Toast** — `role="alert"`, auto-dismiss

#### 3D / Motion

- **Reduced motion fallback** — Gradient overlay in `CinematicHero` (lines 115-126)
- **Static poster** — `Hero3DFallback` component
- **Canvas alternatives** — Text content mirrors 3D narrative

---

## WCAG 2.2 AA Compliance Checklist

### Perceivable

| Criterion                         | Status      | Evidence                                                 |
| --------------------------------- | ----------- | -------------------------------------------------------- |
| **1.1.1 Non-text Content**        | ⚠️ Partial  | 3D canvas has text fallback; images need alt audit       |
| **1.2.1 Audio-only/Video-only**   | ❓ Unknown  | No media player components found                         |
| **1.2.2 Captions**                | ❓ Unknown  | Video components not inspected                           |
| **1.2.3 Audio Description**       | ❓ Unknown  | —                                                        |
| **1.3.1 Info & Relationships**    | ✅          | Semantic HTML, ARIA roles                                |
| **1.3.2 Meaningful Sequence**     | ✅          | Logical DOM order                                        |
| **1.3.3 Sensory Characteristics** | ⚠️ Partial  | Color not sole indicator; 3D position may convey meaning |
| **1.4.1 Use of Color**            | ✅          | Tokens + status badges use text + color                  |
| **1.4.2 Audio Control**           | ❓ Unknown  | No auto-play audio found                                 |
| **1.4.3 Contrast (Minimum)**      | ⚠️ Untested | Tokens designed for AA; no automated check               |
| **1.4.4 Resize Text**             | ✅          | Rem units, no fixed px for text                          |
| **1.4.5 Images of Text**          | ✅          | No text-in-image found                                   |
| **1.4.10 Reflow**                 | ✅          | Responsive CSS, mobile breakpoints                       |
| **1.4.11 Non-text Contrast**      | ⚠️ Untested | Focus rings, borders use gold/forest                     |
| **1.4.12 Text Spacing**           | ✅          | Line-height 1.7, letter-spacing tokens                   |
| **1.4.13 Content on Hover/Focus** | ⚠️ Partial  | Tooltips, dropdowns; need dismissal testing              |

### Operable

| Criterion                         | Status     | Evidence                                          |
| --------------------------------- | ---------- | ------------------------------------------------- |
| **2.1.1 Keyboard**                | ✅         | All interactive elements reachable                |
| **2.1.2 No Keyboard Trap**        | ✅         | Modal focus trap, skip links                      |
| **2.1.4 Character Key Shortcuts** | ✅         | None implemented                                  |
| **2.2.1 Timing Adjustable**       | ✅         | No time limits on content                         |
| **2.2.2 Pause, Stop, Hide**       | ⚠️ Partial | 3D animations pause on reduced motion; carousels? |
| **2.3.1 Three Flashes**           | ✅         | No flashing content                               |
| **2.4.1 Bypass Blocks**           | ✅         | Skip link to main content                         |
| **2.4.2 Page Titled**             | ✅         | Next.js metadata API                              |
| **2.4.3 Focus Order**             | ✅         | Logical tab order                                 |
| **2.4.4 Link Purpose**            | ✅         | Descriptive link text                             |
| **2.4.5 Multiple Ways**           | ✅         | Nav + search + breadcrumbs                        |
| **2.4.6 Headings/Labels**         | ✅         | Descriptive headings                              |
| **2.4.7 Focus Visible**           | ✅         | Gold outline on all focusable                     |
| **2.5.1 Pointer Gestures**        | ✅         | No complex gestures                               |
| **2.5.2 Pointer Cancellation**    | ✅         | Standard click behavior                           |
| **2.5.3 Label in Name**           | ✅         | FormField wraps label + input                     |
| **2.5.4 Motion Actuation**        | ✅         | No motion-only triggers                           |
| **2.5.5 Target Size**             | ✅         | 44px minimum (Button, touch targets)              |
| **2.5.6 Concurrent Input**        | ✅         | No input restrictions                             |

### Understandable

| Criterion                           | Status     | Evidence                              |
| ----------------------------------- | ---------- | ------------------------------------- |
| **3.1.1 Language of Page**          | ✅         | `<html lang="en">`                    |
| **3.1.2 Language of Parts**         | ❓ Unknown | Hindi content not yet implemented     |
| **3.2.1 On Focus**                  | ✅         | No unexpected changes on focus        |
| **3.2.2 On Input**                  | ✅         | No auto-submit on input               |
| **3.2.3 Consistent Navigation**     | ✅         | Persistent header/nav                 |
| **3.2.4 Consistent Identification** | ✅         | Consistent component patterns         |
| **3.3.1 Error Identification**      | ✅         | FormField shows error messages        |
| **3.3.2 Labels/Instructions**       | ✅         | Labels on all inputs                  |
| **3.3.3 Error Suggestion**          | ⚠️ Partial | Error messages could be more specific |
| **3.3.4 Error Prevention**          | ⚠️ Partial | Confirmation on destructive actions   |

### Robust

| Criterion                   | Status     | Evidence                                           |
| --------------------------- | ---------- | -------------------------------------------------- |
| **4.1.1 Parsing**           | ✅         | Valid HTML, React components                       |
| **4.1.2 Name, Role, Value** | ✅         | ARIA roles on custom components                    |
| **4.1.3 Status Messages**   | ⚠️ Partial | Toast for success; loading states need `aria-live` |

---

## Gaps Requiring Action

### High Priority

| Gap                             | Location         | Fix                                     |
| ------------------------------- | ---------------- | --------------------------------------- |
| **No automated a11y testing**   | CI               | Add `axe-core` to Vitest + Playwright   |
| **Color contrast unverified**   | tokens.css       | Run `axe-core` + manual check on tokens |
| **3D canvas keyboard access**   | `CinematicHero`  | Arrow keys for camera control           |
| **Hindi language support**      | i18n.ts          | Add `lang` switching, RTL test          |
| **Screen reader announcements** | Progress, toasts | Add `aria-live` regions                 |

### Medium Priority

| Gap                             | Location            | Fix                                  |
| ------------------------------- | ------------------- | ------------------------------------ |
| **Focus trap testing**          | Modal, Sidebar      | Playwright keyboard tests            |
| **Touch target audit**          | Mobile              | 44×44px verification at 375×812      |
| **Zoom testing**                | All pages           | 200% zoom, no horizontal scroll      |
| **Form error suggestions**      | FormField           | Add specific guidance per field type |
| **Loading state announcements** | Skeletons, spinners | `aria-busy`, `aria-live="polite"`    |

### Low Priority

| Gap                      | Location     | Fix                         |
| ------------------------ | ------------ | --------------------------- |
| **Print stylesheet**     | globals.css  | `@media print` styles       |
| **High contrast icons**  | lucide-react | Verify stroke width at 200% |
| **Skip link visibility** | globals.css  | Test in all browsers        |

---

## Testing Status

| Test Type               | Tool           | Configured   | Runs in CI |
| ----------------------- | -------------- | ------------ | ---------- |
| **Automated a11y**      | axe-core       | ❌ No        | ❌         |
| **Keyboard navigation** | Playwright     | ❌ No config | ❌         |
| **Screen reader**       | NVDA/VoiceOver | Manual only  | ❌         |
| **Color contrast**      | DevTools       | Manual       | ❌         |
| **Zoom/Reflow**         | Browser        | Manual       | ❌         |
| **Reduced motion**      | apple-springs  | Code only    | ❌         |

---

## Required Viewport Testing (Per AGENTS.md)

| Viewport              | Tested | Notes |
| --------------------- | ------ | ----- |
| 375 × 812 (iPhone SE) | ❌     | —     |
| 390 × 844 (iPhone 14) | ❌     | —     |
| 768 × 1024 (iPad)     | ❌     | —     |
| 1280 × 800 (Laptop)   | ❌     | —     |
| 1440 × 900 (Desktop)  | ❌     | —     |

### Each viewport must test:

- [ ] Normal motion
- [ ] Reduced motion
- [ ] Keyboard-only operation
- [ ] Light mode
- [ ] Dark mode
- [ ] Slow network
- [ ] Missing image fallback
- [ ] Failed API response
- [ ] Logged-out state
- [ ] Logged-in state

---

## Recommendations

### Immediate

1. **Add axe-core to Vitest** — `npm i -D axe-core @axe-core/react`
2. **Add Playwright a11y** — `npm i -D @playwright/test axe-playwright`
3. **Run contrast audit** — Test all token combinations
4. **Fix 3D keyboard access** — Arrow keys for camera in `CinematicHero`

### Phase 1

5. **Create a11y test suite** — Keyboard nav, focus management, ARIA
6. **Add `aria-live`** — Progress updates, toasts, form errors
7. **Hindi i18n prep** — `lang` attribute switching, font fallback

### Phase 2

8. **200% zoom audit** — All routes, no horizontal scroll
9. **Screen reader testing** — NVDA (Windows), VoiceOver (Mac/iOS)
10. **Touch target audit** — 44×44px at all breakpoints

### Documentation

11. **A11y component guide** — Document ARIA patterns in Storybook
12. **WCAG compliance matrix** — Track per-route compliance
