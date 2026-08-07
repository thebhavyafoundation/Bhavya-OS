# Interaction Library — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Overview

Catalog of all interaction patterns used in the Bhavya AI Institute. Every interaction is intentional, accessible, and consistent.

---

## Interaction Categories

### 1. Navigation Interactions

| Interaction      | Trigger      | Feedback     | Animation            |
| ---------------- | ------------ | ------------ | -------------------- |
| Page transition  | Route change | Content load | fade (200ms)         |
| Sidebar toggle   | ⌘B or click  | Width change | spring (300ms)       |
| Breadcrumb click | Click        | Page load    | fade (200ms)         |
| Bottom nav tap   | Tap          | Page load    | scale-in (150ms)     |
| Command palette  | ⌘K           | Overlay open | fade + scale (200ms) |
| Search focus     | ⌘/ or click  | Input focus  | ring (150ms)         |

### 2. Content Interactions

| Interaction      | Trigger          | Feedback         | Animation              |
| ---------------- | ---------------- | ---------------- | ---------------------- |
| Section reveal   | Scroll into view | Content visible  | fade-in-up (300ms)     |
| Accordion expand | Click            | Content visible  | spring (300ms)         |
| Tab switch       | Click            | Content change   | fade (200ms)           |
| Code run         | ⌘Enter           | Output streaming | typewriter (real-time) |
| Diagram interact | Click/hover      | Highlight        | scale (200ms)          |
| Video play       | Click            | Playback         | fade (200ms)           |

### 3. Form Interactions

| Interaction     | Trigger         | Feedback          | Animation          |
| --------------- | --------------- | ----------------- | ------------------ |
| Input focus     | Tab/click       | Focus ring        | ring (150ms)       |
| Input error     | Validation fail | Error message     | shake (300ms)      |
| Input success   | Validation pass | Success indicator | scale-in (200ms)   |
| Checkbox toggle | Click           | Checkmark         | scale-in (150ms)   |
| Radio select    | Click           | Selection         | scale-in (150ms)   |
| Dropdown open   | Click           | Options list      | slide-down (200ms) |

### 4. Quiz Interactions

| Interaction        | Trigger      | Feedback            | Animation                     |
| ------------------ | ------------ | ------------------- | ----------------------------- |
| Option select      | Click        | Selection highlight | scale-in (150ms)              |
| Answer check       | Submit       | Correct/incorrect   | pulse (200ms) / shake (300ms) |
| Explanation reveal | After check  | Text visible        | slide-down (300ms)            |
| Progress update    | After answer | Progress bar fill   | fill (500ms)                  |
| Quiz complete      | All answered | Results             | confetti (1000ms)             |

### 5. Lab Interactions

| Interaction | Trigger   | Feedback         | Animation              |
| ----------- | --------- | ---------------- | ---------------------- |
| Code typing | Keystroke | Syntax highlight | instant                |
| Code run    | ⌘Enter    | Output streaming | typewriter (real-time) |
| Test pass   | Run tests | Green checkmark  | scale-in (200ms)       |
| Test fail   | Run tests | Red X            | shake (300ms)          |
| Hint reveal | Request   | Hint text        | slide-down (300ms)     |
| Lab submit  | Submit    | Confirmation     | fade (200ms)           |

### 6. AI Mentor Interactions

| Interaction      | Trigger    | Feedback       | Animation          |
| ---------------- | ---------- | -------------- | ------------------ |
| Message send     | Enter      | Message appear | fade-in-up (200ms) |
| Typing indicator | After send | Dots bounce    | bounce (1s loop)   |
| Message receive  | Response   | Message appear | fade-in-up (200ms) |
| Quick action     | Click      | Message insert | scale-in (150ms)   |
| Context panel    | Toggle     | Panel slide    | slide-in (300ms)   |

### 7. Graph Interactions

| Interaction | Trigger      | Feedback            | Animation         |
| ----------- | ------------ | ------------------- | ----------------- |
| Node hover  | Hover        | Node scale          | scale (200ms)     |
| Node select | Click        | Node glow + details | glow (300ms)      |
| Edge hover  | Hover        | Edge highlight      | highlight (200ms) |
| Zoom        | Scroll/pinch | Graph scale         | smooth (100ms)    |
| Pan         | Drag         | Graph move          | smooth (100ms)    |
| Layout      | Load         | Force-directed      | settle (1000ms)   |

### 8. Project Interactions

| Interaction     | Trigger     | Feedback       | Animation          |
| --------------- | ----------- | -------------- | ------------------ |
| Tab switch      | Click       | Content change | fade (200ms)       |
| Milestone check | Complete    | Checkmark      | scale-in (200ms)   |
| File browser    | Click       | File list      | slide-down (200ms) |
| Code view       | Select file | Code display   | fade (200ms)       |
| Project submit  | Submit      | Confirmation   | confetti (1000ms)  |

---

## Keyboard Shortcuts

### Global

| Shortcut | Action              |
| -------- | ------------------- |
| ⌘K       | Command palette     |
| ⌘/       | Search              |
| ⌘B       | Toggle sidebar      |
| ⌘M       | Toggle AI Mentor    |
| ⌘?       | Help                |
| Escape   | Close modal/overlay |

### Lesson

| Shortcut | Action           |
| -------- | ---------------- |
| ⌘]       | Next lesson      |
| ⌘[       | Previous lesson  |
| ⌘Enter   | Run code         |
| ⌘N       | Toggle notes     |
| Space    | Pause/play video |

### Lab

| Shortcut | Action               |
| -------- | -------------------- |
| ⌘Enter   | Run code             |
| ⌘S       | Save                 |
| ⌘H       | Request hint         |
| ⌘/       | Ask AI Mentor        |
| Tab      | Switch editor/output |

### Quiz

| Shortcut | Action             |
| -------- | ------------------ |
| 1-4      | Select option      |
| Enter    | Submit answer      |
| Space    | Reveal explanation |
| ⌘]       | Next question      |

---

## Gesture Support

### Mobile

| Gesture     | Action          |
| ----------- | --------------- |
| Swipe left  | Next lesson     |
| Swipe right | Previous lesson |
| Pull down   | Refresh         |
| Pinch       | Zoom graph      |
| Tap         | Select          |
| Long press  | Context menu    |

### Tablet

| Gesture           | Action    |
| ----------------- | --------- |
| Swipe left/right  | Navigate  |
| Swipe up/down     | Scroll    |
| Pinch             | Zoom      |
| Two-finger scroll | Pan graph |

---

## Loading States

| State        | Duration | Animation      |
| ------------ | -------- | -------------- |
| Initial load | < 200ms  | None (instant) |
| Short load   | 200ms-1s | Spinner        |
| Medium load  | 1-3s     | Skeleton       |
| Long load    | > 3s     | Progress bar   |
| Streaming    | Variable | Typewriter     |

---

## Error States

| Error Type       | Display     | Action        |
| ---------------- | ----------- | ------------- |
| Network error    | Toast       | Retry         |
| Validation error | Inline      | Fix input     |
| Permission error | Modal       | Contact admin |
| Not found        | Empty state | Go back       |
| Server error     | Page        | Retry         |

---

## Empty States

| State            | Display             | Action           |
| ---------------- | ------------------- | ---------------- |
| No courses       | Illustration + text | Browse courses   |
| No projects      | Illustration + text | Start project    |
| No achievements  | Illustration + text | Complete lessons |
| No notifications | Text                | —                |

---

## Accessibility Interactions

| Interaction | Keyboard    | Screen Reader          |
| ----------- | ----------- | ---------------------- |
| Focus       | Tab         | "Focused on [element]" |
| Activate    | Enter/Space | "Activated [element]"  |
| Expand      | Enter/Space | "Expanded/Collapsed"   |
| Select      | Arrow keys  | "Selected [option]"    |
| Dismiss     | Escape      | "Closed [dialog]"      |

---

_Every interaction is documented, accessible, and consistent._
