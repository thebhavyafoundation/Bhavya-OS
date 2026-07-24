id: MEM-PROJECT
type: memory
domain: project
owner: Engineering
last_updated: 2026-07-23

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
- APP-001 (website): active, port 3000
- APP-002 (admin): active, port 3001
- APP-003 (docs): active, port 3002
- APP-004 (transparency): active, port 3003
- APP-005 (forest): shell, port 3004
- APP-006 (heritage): shell, port 3005
- APP-007 (volunteer): shell, port 3006
- APP-008 (knowledge): shell, port 3007
- APP-009 (library): shell, port 3008

## Architecture
Monorepo (Turborepo + pnpm). Apps → Mission Runtime → Shared Packages → Utilities.
No cyclic dependencies. All packages scoped @bhavya/*.
