# Memory Engine

Domain-owned memory read/write operations.

## Domains
- project: Project state, apps, releases
- engineering: Stack, packages, patterns
- governance: ADRs, RFCs, policies, standards
- ui: Design tokens, components, accessibility
- agents: Agent roster, profiles, permissions

## Format
Each memory file is Markdown with YAML frontmatter:
- id: stable identifier
- type: memory
- domain: domain name
- owner: responsible agent
- last_updated: ISO date

## Usage
Agents read their domain's memory file. Write updates as needed.
Keep each file under 150 lines.
