# Project Runtime

## Overview

The Project Runtime is a reusable engine for project-based learning. It makes projects first-class citizens in the AI Institute.

## Architecture

```
Project Runtime
├── ProjectEngine          — CRUD, milestone tracking, task management
├── AIProjectCoach         — Project-aware AI coaching
├── PortfolioExporter      — Export as JSON/Markdown/LinkedIn/GitHub
└── Core Types             — Project, Milestone, Task, Reflection, etc.
```

## Core Concepts

### Project

A project is a container for learning. It has:

- Title and description
- Problem statement
- Objectives
- Milestones (ordered)
- Knowledge packages
- Resources
- Status (not-started, in-progress, completed)

### Milestone

A milestone is a phase of the project. It has:

- Title and description
- Tasks (ordered)
- Reflection (after completion)
- Status (locked, available, in-progress, completed)
- Evidence (optional)

### Task

A task is a unit of work within a milestone. It has:

- Title and description
- Type (research, design, build, test, document, reflect)
- Status (pending, in-progress, completed)
- Output (optional)
- Knowledge package references (optional)

### Reflection

Reflection happens after each milestone. It captures:

- What was difficult
- What changed
- What would be redesigned
- Which AI suggestion helped
- Which suggestion was rejected

### Knowledge Package

Knowledge packages are resources that support learning. Types:

- repository (GitHub repos)
- pattern (design patterns)
- mcp (MCP servers)
- cli (CLI tools)
- article (documentation)
- lesson (AI Institute lessons)
- lab (AI Institute labs)

## Portfolio Export

### JSON Export

Structured data for programmatic use.

### Markdown Export

Human-readable document with all project details.

### LinkedIn Post

Pre-formatted post for sharing on LinkedIn.

### GitHub Repository

Complete repository structure with README, architecture docs, and learning journal.

## Project DNA

Every project follows a consistent structure:

- Mission
- Real-world problem
- Learning objectives
- Skills gained
- Knowledge packages used
- Engineering patterns demonstrated
- AI capabilities practiced
- Portfolio outcome
- Open-source contribution path
- Extension ideas
