# Build System

**Purpose:** Compile knowledge into outputs

## Usage

```
bhavya build <target> <source>
```

## Targets

| Target | Input | Outputs |
|--------|-------|---------|
| `lesson` | Knowledge Objects | Web lesson, PDF, slides |
| `video` | Script | MP4, WebM, GIF, thumbnail |
| `website` | Content | Static site, offline package |
| `pdf` | Lesson | Workbook, teacher guide |
| `slides` | Lesson | PowerPoint, Google Slides |
| `quiz` | Knowledge Object | Quiz JSON, flashcards |
| `offline` | Any | USB/MicroSD package |

## Example

```
bhavya build lesson ai-001
```

Compiles `knowledge/objects/ko-ai-*.json` into:
- `build/lesson/output/ai-001/web/`
- `build/lesson/output/ai-001/pdf/`
- `build/lesson/output/ai-001/slides/`
- `build/lesson/output/ai-001/quiz.json`
- `build/lesson/output/ai-001/teacher-guide.md`

## Pipeline

```
Knowledge Objects
      ↓
  [Validator]
      ↓
  [Compiler]
      ↓
  ┌───────┬───────┬───────┬───────┐
  ↓       ↓       ↓       ↓       ↓
Lesson  Video   PDF   Slides  Quiz
  ↓       ↓       ↓       ↓       ↓
  └───────┴───────┴───────┴───────┘
      ↓
  [Distributor]
      ↓
  Website / Offline / Mobile
```
