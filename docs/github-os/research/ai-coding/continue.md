# Continue — Knowledge Package

## Executive Summary

Continue is an open-source AI code assistant that operates as IDE extensions for VS Code and JetBrains. Unlike autonomous agent platforms, Continue focuses on enhancing the developer's existing workflow with AI-powered chat, code completion, inline editing, and agent mode. It supports 40+ LLM providers and emphasizes user control — developers choose their models, configure their context, and approve all changes.

Continue matters because it represents the "IDE-native" approach to AI coding. Rather than running in a separate sandbox, it integrates directly into the editor, providing autocomplete, chat, and edit capabilities within the developer's familiar environment. The architecture cleanly separates platform-specific code (VS Code/JetBrains adapters) from shared business logic, making it a good reference for cross-platform IDE integration.

For Bhavya Foundation, Continue demonstrates how to build a model-agnostic AI coding layer that works across IDEs, supports local models for privacy, and maintains clean separation between UI, business logic, and LLM providers.

## Architecture

### Four-Layer Architecture

Continue uses a layered architecture with strict separation between components:

```
IDE Layer → Core Layer → Configuration Layer → LLM Layer
    ↓            ↓              ↓                  ↓
VS Code     Business      Multi-source         Provider
JetBrains   Logic         Config (YAML/JSON)   Abstraction
CLI         Indexing      Profile Management   40+ Providers
```

### Core Backend

The `Core` class (`core/core.ts:89-124`) orchestrates all backend functionality:

- **Message Routing**: Uses `send()`/`on()` patterns for request/response and fire-and-forget
- **Service Management**: Initializes `ConfigHandler`, `CodebaseIndexer`, `DocsService`, `CompletionProvider`
- **Configuration Propagation**: Listens to config updates and notifies dependent services
- **Abort Signal Management**: Maintains `messageAbortControllers` for cancellable operations

### IDE Extensions

Platform-specific implementations share a common `IDE` interface:

| Component     | VS Code                 | JetBrains                   |
| ------------- | ----------------------- | --------------------------- |
| Entry Point   | `VsCodeExtension` class | `IntelliJIde` class         |
| Runtime       | In-process Node.js      | Separate Node.js process    |
| Communication | postMessage             | JSON over stdin/stdout      |
| LSP Access    | Direct via commands     | Limited (internal indexing) |
| File System   | `vscode.workspace.fs`   | `VirtualFileManager`        |

### React GUI

Shared React application with Redux state management:

- **Layout**: Root component managing routing and global UI state
- **ContinueInputBox**: TipTap-based rich text editor for chat input
- **Redux Store**: Centralized state for chat sessions, config, and indexing status
- **ModelSelect**: Dynamic model selection based on role (chat/edit)

### Communication Protocols

Typed protocol definitions for inter-process communication:

| Protocol            | Direction          | Purpose                     |
| ------------------- | ------------------ | --------------------------- |
| `ToCoreProtocol`    | IDE/Webview → Core | Requests to business logic  |
| `FromCoreProtocol`  | Core → IDE/Webview | Responses and notifications |
| `ToWebviewProtocol` | IDE/Core → GUI     | GUI state updates           |

Pass-through messages bypass the IDE layer for efficiency (e.g., `llm/streamChat`, `indexProgress`).

## AI Workflow

### Context Gathering

1. **Open File Context**: Reads currently active file in the editor
2. **Codebase Index**: Semantic search over indexed codebase
3. **@-Mentions**: User explicitly selects files, symbols, or URLs
4. **LSP Data**: Language Server Protocol provides type info and references
5. **Documentation Index**: Crawled external docs (optional)

### Suggestion Modes

- **Chat Mode**: Ask questions, get explanations, generate code
- **Edit Mode**: Modify code sections without leaving the current file
- **Agent Mode**: Multi-step task execution with tool use
- **Autocomplete**: Inline code suggestions as you type
- **Next Edit**: Predicts the next logical edit location (experimental)

### Review Flow

- All changes presented as inline diffs
- User accepts or rejects each change block-by-block
- No automatic file modifications without approval
- Full change history maintained in session

## Tool Execution

### Built-in Tools

| Tool       | Description                          |
| ---------- | ------------------------------------ |
| File Read  | Read files from the workspace        |
| File Write | Create or modify files               |
| Terminal   | Execute shell commands               |
| LSP Query  | Get symbols, references, diagnostics |
| Web Search | Search documentation online          |
| Browser    | Fetch web content                    |

### MCP Integration

Continue supports Model Context Protocol for extending capabilities:

- Connect to external tool servers
- Register custom tools
- Dynamic tool discovery
- Configuration via YAML

### Agent Mode Tools

- **Codebase Search**: Semantic search over indexed code
- **File Operations**: Read, write, edit files
- **Terminal Commands**: Execute build/test commands
- **Web Browsing**: Fetch documentation and references
- **Diagnostics**: Get linting and compiler errors

## Context Management

### Codebase Indexing

The `CodebaseIndexer` maintains a semantic index:

- **Embeddings**: Converts code to vector representations
- **Vector Database**: Stores embeddings for similarity search
- **Incremental Updates**: Only re-indexes changed files
- **Pause/Resume**: Can pause indexing to save resources

### Documentation Indexing

The `DocsService` crawls and indexes external documentation:

- Configurable crawl targets
- Automatic re-crawling
- Semantic search over docs
- Integration with chat context

### Autocomplete Context

Context sources for inline completions:

1. Current file content
2. Open tabs and recently closed tabs
3. LSP symbols and references
4. Codebase index results
5. Language-specific heuristics

### Context Ranking

- Relevance scoring based on semantic similarity
- Token budget management
- Priority given to user-selected context (@-mentions)
- Automatic context pruning for long conversations

## Review Flow

### Inline Diffs

- Changes rendered as vertical diff blocks in the editor
- Green for additions, red for deletions
- Accept/reject individual blocks
- Apply all or selective changes

### Change Tracking

- Session history maintains all interactions
- Undo capability for applied changes
- Diff visualization for review
- Git integration for version control

### Quality Gates

- LSP diagnostics checked after changes
- Compiler errors detected and reported
- Linting results surfaced to user
- User approval required for all modifications

## Planning

### Agent Mode

- Toggle between Plan and Act modes
- Plan mode: Explore codebase, ask questions, lay out strategy
- Act mode: Execute the plan with approval gates
- Step-by-step task breakdown

### Architecture Assistance

- Codebase exploration via semantic search
- Dependency analysis
- Pattern detection
- Refactoring suggestions

## Repository Understanding

### Indexing System

- **Tree-sitter**: Syntax-aware parsing for code structure
- **Embeddings**: Semantic vector representations
- **LSP**: Type information, references, diagnostics
- **File Metadata**: Size, modification time, language

### Cross-Referencing

- Symbol definition and usage tracking
- Import/export analysis
- Dependency graph construction
- Test coverage mapping

## Installation & Setup

### VS Code Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "Continue"
4. Click Install

### JetBrains Installation

1. Open IntelliJ IDEA / PyCharm / WebStorm
2. Go to Settings → Plugins → Marketplace
3. Search "Continue"
4. Click Install

### Configuration

Continue uses a YAML configuration file (`~/.continue/config.yaml`):

```yaml
models:
  - name: Claude 4 Sonnet
    provider: anthropic
    model: claude-sonnet-4-20250514
    apiKey: ${{ secrets.ANTHROPIC_API_KEY }}
    roles:
      - chat
      - edit
      - apply

  - name: Ollama Local
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: http://localhost:11434
    roles:
      - chat
      - edit
      - autocomplete
```

### First-Time Setup

1. Install extension
2. Configure model provider (API key or local endpoint)
3. Select default model
4. Start coding with AI assistance

## Dependencies

### Required

- VS Code 1.84.0+ or JetBrains IDE
- Node.js (bundled with IDE)
- LLM provider access (API key or local model)

### Optional

- Ollama (for local models)
- LM Studio (for local models)
- llama.cpp (for local models)

### Model Support

| Provider  | Models                            |
| --------- | --------------------------------- |
| Anthropic | Claude 4 Sonnet, Claude 3.5 Haiku |
| OpenAI    | GPT-4o, o1, o3-mini               |
| Google    | Gemini 2.0, Gemini 1.5            |
| Local     | Ollama, LM Studio, llama.cpp      |
| 40+       | Various cloud and local providers |

## Hardware Impact

### RAM

- **Extension**: ~100-200MB (IDE overhead)
- **Local Models**: 8GB+ for 7B models, 16GB+ for 14B, 32GB+ for 30B+
- **Indexing**: Additional memory during codebase indexing

### CPU

- Minimal for extension operation
- Significant for local model inference
- Indexing uses background processing

### GPU

- **Not required** for cloud LLM usage
- **Recommended** for local models
- Apple Silicon Metal acceleration
- NVIDIA CUDA support

### Disk

- Extension: ~50MB
- Local models: 4-40GB depending on model
- Index cache: Varies by codebase size

## Security Notes

### Data Privacy

- Code stays on local machine (unless using cloud LLM)
- No automatic training on user code
- User controls what context is sent to LLM
- Telemetry can be disabled

### Local Model Support

- Full offline capability with Ollama
- No data leaves the machine
- Air-gapped environment compatible
- Configurable telemetry settings

### Configuration Security

- API keys stored in IDE secret storage
- No keys in source code
- Environment variable support
- Profile-based configuration

## Offline Support

**Yes** — Full offline capability with local models:

1. Install Ollama and download models
2. Configure Continue to use Ollama endpoint
3. Disable telemetry in VS Code settings
4. All processing happens locally

### Offline Configuration

```yaml
models:
  - name: Local Coder
    provider: ollama
    model: qwen2.5-coder:7b
    apiBase: http://localhost:11434
    roles:
      - chat
      - edit
      - apply
      - autocomplete
```

## Browser Automation Alternative

**Limited** — Continue does not include built-in browser automation. However:

- Can fetch web content via documentation index
- Web URLs can be added as context via @-mentions
- MCP servers can provide browser capabilities
- Not designed for autonomous web interaction

## CLI Alternative

### Continue CLI (`cn`)

Continue offers a CLI tool for terminal-native AI coding:

```bash
# Install
npm install -g @anthropic-ai/continue-cli

# Use
cn chat "explain this codebase"
cn edit src/main.ts "add error handling"
```

### Comparison

- CLI provides terminal-native experience
- IDE extensions offer richer UI
- Same backend logic and model support
- CLI suitable for scripting and automation

## Bhavya Score

| Criterion       | Score      | Notes                                                            |
| --------------- | ---------- | ---------------------------------------------------------------- |
| Usefulness      | 80/100     | Excellent IDE integration, model-agnostic                        |
| Maintenance     | 85/100     | Active development, clean architecture, good docs                |
| Hardware Impact | 75/100     | Lightweight extension, local models optional                     |
| Offline Support | 90/100     | Full offline with Ollama, air-gapped compatible                  |
| **Overall**     | **82/100** | Best-in-class IDE integration, excellent for developer workflows |

## Reusable Ideas

1. **IDE Interface Abstraction** — Common interface across VS Code and JetBrains
2. **Message-Passing Architecture** — Clean separation via typed protocols
3. **Pass-Through Messages** — Direct Webview-Core communication for efficiency
4. **Multi-Source Configuration** — YAML/JSON config with profile management
5. **Role-Based Model Selection** — Different models for chat vs edit vs autocomplete
6. **Inline Diff Review** — Block-by-block accept/reject for code changes
7. **Codebase Indexing** — Semantic search with incremental updates
8. **Autocomplete Pipeline** — Context-aware inline completions

## Evidence

- **Source**: https://github.com/continuedev/continue, https://docs.continue.dev
- **Date collected**: 2026-08-03
- **Why it matters**: Continue is the leading open-source IDE-native AI coding assistant with clean architecture and model agnosticism
- **Trade-offs**:
  - Pros: Excellent IDE integration, 40+ providers, offline support, clean architecture, active community
  - Cons: No autonomous agent capabilities, limited browser automation, requires IDE
- **Expected value**: Reference architecture for cross-platform IDE integration and model-agnostic AI coding
- **Maintenance burden**: Moderate — active development but clean codebase
- **Hardware impact**: Minimal for extension, significant for local models
