# Registry Layer

**BICM Version:** 1.0.0  
**Purpose:** Single source of truth for reusable components  

## Philosophy

Everything reusable belongs in a registry. Nothing is hardcoded.

## Registry Structure

```
registries/
├── components/        # UI components
├── prompts/           # AI prompt templates
├── schemas/           # Data schemas
├── animations/        # Animation definitions
├── voice/             # Voice and tone rules
├── layouts/           # Page layouts
├── curriculum/        # Curriculum structures
├── teachers/          # Teacher resources
├── projects/          # Project templates
├── citations/         # Citation database
└── glossary/          # Terminology
```

## Registry Entry Format

Every registry entry is a JSON file:

```json
{
  "id": "reg-{type}-{name}",
  "version": "1.0.0",
  "type": "component",
  "name": "KnowledgeCard",
  "description": "Card component for displaying Knowledge Objects",
  "schema": "knowledge-card.schema.json",
  "variants": [
    {
      "name": "default",
      "description": "Standard knowledge card"
    },
    {
      "name": "compact",
      "description": "Compact knowledge card for lists"
    }
  ],
  "dependencies": [],
  "metadata": {
    "author": "Bhavya AI Lab",
    "created": "2026-07-30",
    "updated": "2026-07-30",
    "reviewStatus": "published"
  }
}
```

## Registry Rules

1. **Single source** — Each component exists once in registry
2. **Versioned** — Every change tracked
3. **Referenced** — Applications reference registry, never copy
4. **Validated** — Registry entries validated against schemas
5. **Discoverable** — Searchable by type, name, tags

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial registry layer |
