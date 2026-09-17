id: MEM-PROJECT
type: memory
domain: project
owner: Engineering
last_updated: 2026-09-17

# Project Memory

## Mission

Build a digital operating system for Bhavya Foundation — a public charitable institution serving Nature, Knowledge, Heritage, and Community with radical transparency.

## Status

- v0.5 Certified — Mission Applications
- Next: v0.6 — Public APIs & Integrations

## Key Decisions

- DEC-001: .ai/ as AI Operating System
- DEC-002: Context Loader Routing
- DEC-003: Context Layers L0-L3
- DEC-004: Entity ID System

## Active Apps

- APP-001 (ai-institute): active, port 3030
- APP-002 (admin): active, port 3003
- APP-003 (docs): active, port 3002
- APP-004 (bhavya-intelligence-network): active, port 3050
- APP-005 (design-system): active, port 3010
- APP-006 (github-os): active, port 3070
- APP-007 (ioc): active, port 3090
- APP-008 (social-os): active, port 3080

## Architecture

Monorepo (Turborepo + pnpm). Apps → Mission Runtime → Shared Packages → Utilities.
No cyclic dependencies. All packages scoped @bhavya/*.
