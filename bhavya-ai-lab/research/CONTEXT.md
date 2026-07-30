# CONTEXT — Research Workspace

## Purpose
Transform topic requests into structured research briefs with key points, sources, and local relevance.

## Audience
Curriculum developers, teachers, content creators.

## Current Goal
Build initial research pipeline for AI education topics.

## Inputs
- Topic request from user
- References from `_config/registries/`
- Existing knowledge from `knowledge/`

## Outputs
- Research brief (JSON)
- Source list with citations
- Local relevance assessment

## Dependencies
- `knowledge/` — Existing knowledge objects
- `_config/voice.md` — Voice rules
- `_config/skills/research/` — Research patterns

## Constraints
- No internet required
- Use local references when possible
- All outputs must be versioned

## Quality Standard
- At least 3 sources per topic
- Local examples required
- Misconceptions documented

## Recent Decisions
- 2026-07-30: Use JSON for knowledge objects, not markdown

## Last Updated
2026-07-30
