# Retrieval Engine

Context-aware file retrieval with scoring.

## Rules
1. Never recursively scan the repository.
2. Prefer index.yaml for file lookups.
3. Load files listed by context-loader.md only.
4. Stop loading once enough context is available.
5. Use entity IDs instead of repeating names.

## Scoring
Files are scored by:
- Relevance to current task (from task graph)
- Layer (L0 > L1 > L2 > L3)
- Recency of modification
