# Social OS — Product Requirements Document

## Overview

Social OS is a standalone Bhavya application that manages the complete lifecycle of social media publishing — from content queue to published post to analytics feedback.

## Users

| User            | Role                                                                |
| --------------- | ------------------------------------------------------------------- |
| Founder         | Approves all publications, reviews analytics                        |
| OpenCode (AI)   | Generates content, creates publication requests, monitors analytics |
| Content Factory | Produces artifacts that feed the publication queue                  |
| GitHub OS       | Discovers trends, consumes analytics feedback                       |

## Requirements

### R1 — Publication Queue

- Accept publication requests from Content Factory
- Store publication drafts with platform-specific formatting
- Track publication status (draft → pending_approval → approved → publishing → published → analytics_collected)
- Support priority ordering and scheduling

### R2 — Platform Management

- Connect to Postiz as the publishing provider
- Support 12+ platforms through Postiz's native integrations
- Track platform-specific constraints (character limits, media requirements)
- Handle platform authentication through Postiz OAuth

### R3 — Human Approval

- Present pending publications to founder for review
- Support approve, reject, edit, and reschedule actions
- Maintain approval audit trail
- Support batch approval for scheduled content

### R4 — Autonomous Publishing

- Auto-format content for each platform (via Postiz)
- Schedule publications at optimal times
- Handle publishing errors with retry logic
- Notify on success/failure

### R5 — Analytics Collection

- Collect engagement metrics from Postiz API
- Store analytics per publication
- Feed analytics back to GitHub OS for research
- Generate weekly analytics reports

### R6 — Governance

- Trace every publication to its originating Knowledge Package
- Store version, review status, and approval history
- Maintain constitutional compliance records
- Support audit exports

### R7 — Integration

- Accept events from Content Factory
- Publish to Postiz via API/MCP
- Feed analytics to GitHub OS
- Display status on Website
- Consume Constitution SDK for compliance checks

## Non-Requirements

- NOT a content creation tool (Content Factory handles this)
- NOT a social media dashboard (Postiz provides this)
- NOT a social listening tool (GitHub OS handles research)
- NOT a standalone application (integrates with Bhavya OS ecosystem)

## Technical Constraints

- Must run as a Bhavya OS application (apps/social-os/)
- Must use Postiz as the publishing provider (with provider interface for future swappability)
- Must comply with BEE 2.0 engineering principles
- Must integrate with Constitution SDK for governance
- Must be event-driven (no polling)
