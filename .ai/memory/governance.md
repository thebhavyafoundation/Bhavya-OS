id: MEM-GOVERNANCE
type: memory
domain: governance
owner: Governance
last_updated: 2026-07-23

# Governance Memory

## ADRs

- ADR-0001: Architectural Decision Records Standard (Accepted)
- ADR-0002: Provider-Agnostic AI Gateway (Accepted)
- ADR-0003: Deterministic Registry Generation Protocol (Approved)
- ADR-0004: Domain-Owned Memory System Architecture (Approved)

## RFCs

- RFC-0001: Volunteer Portal Architecture (Proposed)
- RFC-0002: Forest GIS & Environmental Mapping (Proposed)
- RFC-0003: AI Gateway Abstraction & Routing (Accepted)

## Constitutional Documents (15 docs)

**Single Source of Truth:** `packages/constitution/src/registry.mjs`

| #   | Document                                  | Authority   | Level |
| --- | ----------------------------------------- | ----------- | ----- |
| 01  | The Constitution                          | Supreme     | 100   |
| 02  | Public Charitable Trust Deed              | Legal       | 95    |
| 03  | The Founder's Charter                     | Visionary   | 90    |
| 04  | Board of Trustees Charter                 | Governance  | 85    |
| 05  | Governance Manual                         | Operational | 80    |
| 06  | Code of Ethics & Professional Conduct     | Ethical     | 85    |
| 07  | Conflict of Interest Policy               | Compliance  | 80    |
| 08  | Financial Management & Procurement Policy | Financial   | 85    |
| 09  | Donation Acceptance Policy                | Financial   | 75    |
| 10  | Volunteer Management Policy               | Community   | 70    |
| 11  | Child Protection & Safeguarding Policy    | Protection  | 90    |
| 12  | Environmental Conservation Policy         | Mission     | 75    |
| 13  | AI Ethics & Responsible AI Policy         | Technology  | 85    |
| 14  | Digital Library Policy                    | Knowledge   | 75    |
| 15  | Brand Constitution                        | Identity    | 80    |

**SDK:** `@bhavya/constitution` — APIs: getDocument, search, cite, queryKnowledgeGraph

## Standards (16)

STD-001 through STD-016 covering accessibility through testing.

## Release Governance

8-phase progression to v1.0. Snapshot-based certification. Immutable releases.
Registry regeneration required before every release.
