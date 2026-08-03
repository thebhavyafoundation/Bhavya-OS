# Sourcegraph Cody — Knowledge Package

## Executive Summary

Sourcegraph Cody is an AI coding assistant built on Sourcegraph's Code Intelligence Platform. Unlike other tools that rely on local indexing or embeddings, Cody uses Sourcegraph's high-performance search engine to retrieve context from both local and remote codebases at enterprise scale. It supports multi-repository context, RBAC permissions, and integrates with GitHub, GitLab, and Bitbucket.

Cody matters because it solves the "enterprise context" problem. Most AI coding tools can only access the currently open repository, but enterprises often have hundreds or thousands of repositories. Cody's integration with Sourcegraph allows it to pull context from any indexed repository, making it suitable for large organizations with complex codebases spanning multiple repos.

For Bhavya Foundation, Cody demonstrates how to build AI coding tools that scale to massive codebases. Its search-based context retrieval (replacing embeddings) shows a practical approach to code intelligence at scale, and its enterprise features (RBAC, context filters, audit trails) provide patterns for secure deployment.

**Note**: As of July 2025, Cody Free and Pro plans have been discontinued. Cody Enterprise remains supported, and Sourcegraph has transitioned free users to their new product, Amp.

## Architecture

### Platform Stack

Cody is built on top of Sourcegraph's Code Intelligence Platform:

```
┌─────────────────────────────────────────────────────┐
│                    Cody Client                       │
│  (VS Code, JetBrains, Visual Studio, Web)           │
├─────────────────────────────────────────────────────┤
│              Sourcegraph Search API                   │
│  (High-performance code search engine)               │
├─────────────────────────────────────────────────────┤
│              Sourcegraph Platform                     │
│  (Repository indexing, code intelligence)             │
├─────────────────────────────────────────────────────┤
│              Code Hosts                              │
│  (GitHub, GitLab, Bitbucket, etc.)                  │
└─────────────────────────────────────────────────────┘
```

### Context Retrieval Architecture

Cody uses a two-phase approach:

**Phase 1: Query Understanding**

- Parses user query into tokens
- Extracts entities (file paths, symbols, keywords)
- Rewrites queries for better retrieval
- Uses lightweight LLM for query processing

**Phase 2: Search and Ranking**

- Sourcegraph Search API scans selected repositories
- BM25 ranking function adapted for code
- Multi-signal ranking (keyword, structural, semantic)
- Returns ranked file snippets

### Client Architecture

| Client        | Context Sources                       | Repository Support |
| ------------- | ------------------------------------- | ------------------ |
| VS Code       | Files, Symbols, URLs, Remote, OpenCtx | Multi-repo         |
| JetBrains     | Files, URLs, Remote                   | Multi-repo         |
| Visual Studio | Files, Symbols, URLs, Remote, OpenCtx | Multi-repo         |
| Cody Web      | Files, Symbols, URLs, Remote          | Multi-repo         |

### Enterprise Architecture

For enterprise deployments:

- **Sourcegraph Instance**: Self-hosted or managed server
- **Repository Indexing**: Automatic re-indexing of all connected repos
- **RBAC**: Role-based access control for repository access
- **Context Filters**: Admin-configurable repository exclusions
- **Audit Trails**: Usage tracking and compliance logging

## AI Workflow

### Chat Context Retrieval

1. **User Query**: Developer asks a question about code
2. **Query Understanding**: Parse and rewrite query
3. **Context Search**: Sourcegraph Search API finds relevant snippets
4. **Local Context**: Open files and recent tabs added
5. **Global Ranking**: Combine and rank all context sources
6. **Prompt Assembly**: Package context with user query
7. **LLM Generation**: Model generates response with context
8. **Source Citation**: Response includes links to source code

### Autocomplete Pipeline

1. **Intent Classification**: Tree-sitter analyzes cursor position
2. **Context Retrieval**: Local files, open tabs, recent files
3. **Jaccard Similarity**: Fast similarity matching
4. **LLM Generation**: Completions-tuned model generates suggestions
5. **Post-processing**: Filter and rank completions
6. **Ghost Text**: Display suggestions ahead of cursor

### Code Editing

1. **Selection**: User selects code block
2. **Context Assembly**: Surrounding code, diagnostics, @-mentions
3. **LLM Generation**: Model generates edited code
4. **Diff Presentation**: Show changes for review
5. **Apply**: User accepts changes

## Tool Execution

### Built-in Tools

| Tool           | Description                          |
| -------------- | ------------------------------------ |
| Chat           | Ask questions about code             |
| Auto-edit      | Suggest code changes based on cursor |
| Commands       | Reusable prompts for common tasks    |
| Debug          | Identify and fix errors              |
| Generate Tests | Create unit tests for code           |

### Commands

Cody provides customizable commands:

- `/explain` — Explain code
- `/fix` — Fix bugs
- `/test` — Generate tests
- `/docstring` — Add documentation
- Custom commands via configuration

### Context Sources

| Source            | Description               |
| ----------------- | ------------------------- |
| @-mention Files   | Specific file context     |
| @-mention Symbols | Specific symbol context   |
| @-mention URLs    | Web documentation         |
| @-mention Repos   | Remote repository context |
| OpenCtx           | External integrations     |

## Context Management

### Search-Based Context (Current)

Cody Enterprise uses Sourcegraph Search instead of embeddings:

**Advantages**:

- No code sent to external embedding API
- Scales to massive codebases (100k+ repos)
- Always fresh (re-indexed regularly)
- RBAC enforcement
- Lower maintenance

**How it works**:

1. User query is parsed and rewritten
2. Sourcegraph Search API scans indexed repositories
3. BM25 ranking identifies relevant snippets
4. Snippets ranked by relevance
5. Top N snippets sent to LLM

### Embedding-Based Context (Legacy)

Previously used OpenAI text-embedding-ada-002:

- Code converted to vectors
- Vector similarity search
- Required sending code to external API
- Being replaced by search-based approach

### Autocomplete Context

For fast autocomplete:

- Local file content
- Open tabs and recently closed tabs
- Sliding window Jaccard similarity
- No embeddings (too slow)
- Tree-sitter for syntax awareness

### Token Management

- Configurable context window size
- Admin can set maximum tokens
- Automatic context pruning
- Priority given to @-mentioned context

## Review Flow

### Inline Suggestions

- Ghost text ahead of cursor
- Accept with Tab
- Reject by continuing to type
- Multi-line suggestions for supported languages

### Chat Responses

- Source citations with links
- Code blocks with syntax highlighting
- Diff visualization for edits
- Follow-up question support

### Quality Controls

- Context filtering by admin
- Repository access permissions
- LLM provider data policies
- No training on enterprise code

## Planning

### Codebase Exploration

- Search across multiple repositories
- Symbol definition and usage tracking
- Dependency analysis
- Pattern detection

### Architecture Assistance

- Cross-repository dependencies
- API usage patterns
- Code migration planning
- Refactoring suggestions

## Repository Understanding

### Sourcegraph Platform

- **Code Intelligence**: Parsing and indexing all code
- **Search Engine**: High-performance text search
- **Code Navigation**: Definition and reference tracking
- **Cross-Repo Context**: Dependencies across repositories

### Indexing

- Automatic repository indexing
- Regular re-indexing for freshness
- Supports 100k+ repositories
- Handles monorepos up to 90GB+

### Code Graph

- Class and method relationships
- Import/export analysis
- Call graph construction
- Type hierarchy tracking

## Installation & Setup

### VS Code Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "Cody"
4. Click Install
5. Sign in with Sourcegraph account

### JetBrains Installation

1. Open IntelliJ IDEA / PyCharm / WebStorm
2. Go to Settings → Plugins → Marketplace
3. Search "Cody"
4. Click Install
5. Restart IDE
6. Sign in with Sourcegraph account

### Enterprise Setup

1. Deploy Sourcegraph instance
2. Connect code hosts (GitHub, GitLab, Bitbucket)
3. Configure repository access
4. Set up RBAC policies
5. Configure context filters
6. Install IDE extensions

### Configuration

```json
{
  "cody.contextFilters": {
    "exclude": ["private-repo", "sensitive-*"]
  },
  "cody.advanced": {
    "chatContextLimit": 28000
  }
}
```

## Dependencies

### Required

- Sourcegraph instance (managed or self-hosted)
- IDE (VS Code, JetBrains, Visual Studio)
- LLM provider access (Anthropic, OpenAI, or Sourcegraph-managed)

### Optional

- OpenCtx providers for external integrations
- Custom commands and prompts
- Context filter rules

### Model Support

| Provider    | Models                            |
| ----------- | --------------------------------- |
| Anthropic   | Claude 3.5 Sonnet, Claude 3 Haiku |
| OpenAI      | GPT-4o, GPT-4 Turbo               |
| Sourcegraph | DeepSeek-Coder-V2 (autocomplete)  |
| Custom      | Configurable per enterprise       |

## Hardware Impact

### RAM

- **Extension**: ~100-200MB (IDE overhead)
- **Sourcegraph Instance**: 8GB+ recommended for server
- **Local Processing**: Minimal

### CPU

- Minimal for extension operation
- Significant for Sourcegraph server
- Search indexing requires background processing

### GPU

- **Not required** for client
- **Optional** for Sourcegraph server optimization
- Local model inference optional

### Disk

- Extension: ~50MB
- Sourcegraph server: Varies by codebase size
- Local embeddings cache: Optional

## Security Notes

### Data Privacy

- **Enterprise**: Code not sent to third-party LLM providers without consent
- **RBAC**: Enforced repository access permissions
- **Context Filters**: Admin-configurable exclusions
- **Audit Trails**: Usage tracking for compliance

### LLM Provider Policies

- Anthropic: No training on enterprise data
- OpenAI: No training on enterprise data
- Sourcegraph-managed: Single-tenant inference

### Self-Hosted Option

- Sourcegraph can be self-hosted
- All code stays within organization's infrastructure
- Custom LLM endpoints supported
- Air-gapped deployment possible

## Offline Support

**Limited** — Requires Sourcegraph instance:

- Client needs connection to Sourcegraph server
- Sourcegraph server needs connection to code hosts
- LLM calls require internet (unless using local models)
- Search indexing requires repository access

**Works offline** with:

- Local Sourcegraph instance
- Local LLM models (Ollama)
- Pre-indexed repositories

## Browser Automation Alternative

**No** — Cody does not include browser automation. However:

- Can fetch web documentation via @-mention URLs
- OpenCtx protocol for external integrations
- Not designed for autonomous web interaction

## CLI Alternative

### Sourcegraph CLI (`src`)

```bash
# Search code
src search "function:calculateTotal"

# Browse repositories
src repos list

# Get file contents
src api get repos/owner/name/contents/file.ts
```

### Amp (Cody's Successor)

Sourcegraph has launched Amp as the successor to Cody Free/Pro:

- Agentic coding tool
- Team collaboration features
- VS Code compatible
- CLI available

## Bhavya Score

| Criterion       | Score      | Notes                                                                    |
| --------------- | ---------- | ------------------------------------------------------------------------ |
| Usefulness      | 80/100     | Excellent for enterprise codebases, multi-repo context                   |
| Maintenance     | 70/100     | Enterprise-focused, less community activity                              |
| Hardware Impact | 85/100     | Minimal client requirements, server-side processing                      |
| Offline Support | 40/100     | Requires Sourcegraph instance and LLM connection                         |
| **Overall**     | **69/100** | Best for enterprise deployments, less suitable for individual developers |

## Reusable Ideas

1. **Search-Based Context** — BM25 ranking instead of embeddings for code retrieval
2. **Multi-Repo Context** — Cross-repository code intelligence
3. **Intent Classification** — Tree-sitter for autocomplete planning
4. **Jaccard Similarity** — Fast local context matching for autocomplete
5. **OpenCtx Protocol** — External context integration standard
6. **Context Filters** — Admin-configurable repository exclusions
7. **RBAC Integration** — Permission-aware context retrieval
8. **Source Citation** — Response links to source code

## Evidence

- **Source**: https://sourcegraph.com/cody, https://sourcegraph.com/docs/cody
- **Date collected**: 2026-08-03
- **Why it matters**: Cody demonstrates enterprise-scale AI coding with search-based context retrieval
- **Trade-offs**:
  - Pros: Enterprise scale, multi-repo context, RBAC, search-based retrieval, no embeddings required
  - Cons: Requires Sourcegraph infrastructure, enterprise pricing, less suitable for individuals, Free/Pro discontinued
- **Expected value**: Pattern for enterprise-scale code intelligence applicable to GitHub OS
- **Maintenance burden**: High — requires Sourcegraph server administration
- **Hardware impact**: Minimal client, significant server requirements
