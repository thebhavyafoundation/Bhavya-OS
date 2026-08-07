# @bhavya/content-engine

The canonical content production system for Bhavya AI Institute. This package provides a complete infrastructure for creating, managing, validating, and distributing educational content.

## Features

### Core Components

1. **ContentEngine** - Core CRUD operations for knowledge packages
2. **LessonGenerationPipeline** - Editorial workflow with 11 stages
3. **KnowledgeAcquisitionEngine** - Source discovery and quality scoring
4. **ContentCatalog** - Search, recommendations, and learning paths
5. **QualityValidator** - 12 validation rules for content quality
6. **ContentVersioning** - Version snapshots and rollback
7. **ContentExporter/Importer** - JSON and Markdown export/import
8. **CurriculumOrganizer** - School → Program → Course → Module → Lesson hierarchy

### Content Structure

Each knowledge package contains:

- **Metadata**: Title, school, course, difficulty, learning outcomes
- **Content**: Sections, visual explanations, code examples, glossary
- **Assessment**: Quizzes, labs, projects, assignments
- **Resources**: Papers, GitHub references, benchmarks, datasets
- **Quality Metrics**: Accuracy, effectiveness, technical correctness

### Quality Validation

12 built-in validation rules:

- Title and learning outcomes required
- Minimum 3 content sections
- Quiz questions and lab exercises required
- Quality score minimum of 70
- Content accuracy minimum of 80

### Version Control

- Create snapshots of any package version
- Compare versions with diff analysis
- Rollback to previous versions
- Version timeline tracking

### Search & Discovery

- Full-text search across all content
- Filter by school, course, difficulty, tags
- Get recommendations based on content similarity
- Build prerequisite chains
- Create custom learning paths

## Usage

```typescript
import {
  contentEngine,
  lessonPipeline,
  knowledgeAcquisition,
  contentCatalog,
  qualityValidator,
  contentVersioning,
  contentExporter,
  curriculumOrganizer,
} from "@bhavya/content-engine";

// Create a knowledge package
const pkg = await contentEngine.createPackage(
  metadata,
  content,
  assessment,
  resources,
);

// Validate the package
const report = await qualityValidator.validatePackage(pkg);

// Create a version snapshot
const snapshot = await contentVersioning.createSnapshot(
  pkg,
  "Author",
  "Description",
  ["tags"],
);

// Export to markdown
const markdown = await contentExporter.exportPackage(pkg.id, "markdown");

// Build curriculum structure
const school = await curriculumOrganizer.createSchool(
  "ai-foundations",
  "AI Foundations",
  "Core AI education",
  "brain",
  "#1a3a2a",
  metadata,
);
```

## Architecture

```
content-engine/
├── src/
│   ├── types.ts           # All type definitions
│   ├── engine.ts          # Core ContentEngine
│   ├── pipeline.ts        # Editorial workflow
│   ├── acquisition.ts     # Knowledge acquisition
│   ├── catalog.ts         # Search & discovery
│   ├── validation.ts      # Quality validation
│   ├── versioning.ts      # Version control
│   ├── export.ts          # Export/import
│   ├── organizer.ts       # Curriculum structure
│   ├── test.ts            # Test suite
│   └── index.ts           # Exports
```

## Integration

This package integrates with:

- `@bhavya/shared` - Shared types and utilities
- `@bhavya/knowledge-graph` - Knowledge graph entities
- `@bhavya/platform-ui` - UI components
- `@bhavya/design-system` - Design tokens

## Constitutional Compliance

All content created through this system must comply with:

- **Curriculum Constitution** - 18 articles, 12 schools
- **Content Governance** - Quality standards and review processes
- **Academic Standards** - Learning outcomes and assessment criteria
