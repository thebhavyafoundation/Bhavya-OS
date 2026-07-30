# Layer 3 — Knowledge

**BICM Version:** 1.0.0  
**Purpose:** Atomic units of knowledge  

## Philosophy

Knowledge exists once. Everything else is compiled from it.

## Structure

```
layer-3-knowledge/
├── objects/           # Individual Knowledge Objects
│   ├── ai/            # AI domain objects
│   ├── programming/   # Programming domain objects
│   ├── robotics/      # Robotics domain objects
│   └── ...
├── graph/             # Relationship mappings
│   ├── edges.json     # Connections between objects
│   └── clusters.json  # Related object groups
└── domains/           # Domain definitions
    ├── ai.json        # AI domain metadata
    ├── programming.json
    └── ...
```

## Knowledge Object Format

Every Knowledge Object is a JSON file with this structure:

```json
{
  "id": "ko-{domain}-{slug}",
  "version": "1.0.0",
  "domain": "ai",
  "concept": "What is Artificial Intelligence?",
  "definition": "AI is the ability of computers to perform tasks that normally require human intelligence.",
  "examples": [
    {
      "type": "analogy",
      "content": "Like a village elder who learns from experience"
    },
    {
      "type": "application",
      "content": "Email spam filters that learn what you mark as spam"
    }
  ],
  "misconceptions": [
    "AI is not magic — it's mathematics and statistics"
  ],
  "difficulty": "beginner",
  "prerequisites": [],
  "relatedObjects": ["ko-ai-types-of-ai", "ko-ai-how-it-works"],
  "projects": ["ko-project-simple-decision-tree"],
  "references": [
    {
      "type": "url",
      "title": "Khan Academy AI",
      "url": "https://www.khanacademy.org/computing"
    }
  ],
  "metadata": {
    "author": "Bhavya AI Lab",
    "created": "2026-07-30",
    "updated": "2026-07-30",
    "reviewStatus": "draft",
    "educationalLevel": "foundation",
    "localRelevance": "High — applicable to farming, weather prediction"
  }
}
```

## Knowledge Graph

The graph maps relationships between objects:

```json
{
  "edges": [
    {
      "source": "ko-ai-what-is-ai",
      "target": "ko-ai-types-of-ai",
      "type": "prerequisite",
      "weight": 1.0
    },
    {
      "source": "ko-ai-what-is-ai",
      "target": "ko-ai-how-it-works",
      "type": "related",
      "weight": 0.8
    }
  ],
  "clusters": [
    {
      "id": "ai-fundamentals",
      "name": "AI Fundamentals",
      "objects": ["ko-ai-what-is-ai", "ko-ai-types-of-ai", "ko-ai-how-it-works"]
    }
  ]
}
```

## Domain Definitions

Each domain has a metadata file:

```json
{
  "id": "ai",
  "name": "Artificial Intelligence",
  "description": "Core AI concepts, machine learning, neural networks",
  "icon": "🤖",
  "color": "#8b5cf6",
  "objectCount": 20,
  "domains": ["ai", "programming", "robotics", "data-science", "ethics", "digital-literacy"]
}
```

## Validation

A Knowledge Object passes validation when:
- [ ] All required fields present
- [ ] Definition is clear and accurate
- [ ] At least 2 examples provided
- [ ] Misconceptions documented
- [ ] Prerequisites identified
- [ ] Related objects linked
- [ ] References cited
- [ ] Metadata complete

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial knowledge layer |
