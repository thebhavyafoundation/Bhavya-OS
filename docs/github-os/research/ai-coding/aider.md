# Aider — Knowledge Package

## Executive Summary

Aider is a terminal-based AI pair programming tool that connects LLMs to real codebases. Unlike IDE extensions, Aider runs entirely in the terminal and automatically commits changes to git with descriptive messages. Its signature innovation is the "repo map" — a PageRank-based graph of every symbol definition and reference across the codebase, used to select the most relevant code context for each task within a configurable token budget.

Aider matters because it demonstrates the "minimalist but powerful" approach to AI coding. There's no GUI, no IDE integration, no Docker sandbox — just a Python CLI that talks to LLMs and edits files. Yet it achieves state-of-the-art benchmark results through its sophisticated context management, multi-model support, and self-healing edit loops. The Architect/Editor two-model workflow is particularly innovative.

For Bhavya Foundation, Aider provides patterns for terminal-based AI coding, efficient codebase context management via repo maps, and cost-optimized multi-model workflows. Its git-first approach (every edit is a commit) offers a natural audit trail for AI-generated code.

## Architecture

### Core Architecture

Aider follows a layered architecture with the `Coder` class as the central orchestrator:

```
┌─────────────────────────────────────────────────────┐
│                    Main Loop                         │
│  (aider/main.py: entry point, initialization)       │
├─────────────────────────────────────────────────────┤
│                    Coder Class                        │
│  (aider/coders/base_coder.py: orchestration)         │
├─────────────────────────────────────────────────────┤
│                    Subsystems                         │
│  Commands │ Models │ GitRepo │ InputOutput │ Linter  │
└─────────────────────────────────────────────────────┘
```

### Coder Class

The `Coder` class (`aider/coders/base_coder.py:88-2257`) manages the entire chat-edit-commit loop:

- **Context Assembly**: Builds prompts with repo map, file contents, chat history
- **LLM Communication**: Sends prompts and receives edit instructions
- **File Operations**: Applies edits to files
- **Git Integration**: Auto-commits changes with descriptive messages
- **Linting**: Runs linter after edits and feeds errors back to LLM

### Factory Pattern

`Coder.create()` instantiates the appropriate coder subclass based on `edit_format`:

| Edit Format | Description           | Best For                   |
| ----------- | --------------------- | -------------------------- |
| `diff`      | SEARCH/REPLACE blocks | Default, most models       |
| `udiff`     | Unified diff format   | Code review-trained models |
| `whole`     | Whole file rewrites   | Simple changes             |
| `patch`     | Patch format          | Targeted changes           |
| `architect` | Two-model workflow    | Complex refactoring        |

### Three-Tier Model System

| Model Role       | Purpose                        | Examples                                |
| ---------------- | ------------------------------ | --------------------------------------- |
| **Main Model**   | Primary code editor            | Claude Sonnet, GPT-4o, DeepSeek Chat V3 |
| **Weak Model**   | Commit messages, summarization | GPT-4o-mini, Claude Haiku               |
| **Editor Model** | Executes architect's plan      | Same as main or dedicated model         |

### Subsystem Components

| Component     | File                | Role                                    |
| ------------- | ------------------- | --------------------------------------- |
| `Commands`    | `aider/commands.py` | Slash command processing                |
| `Model`       | `aider/models.py`   | LLM configuration and API communication |
| `GitRepo`     | `aider/repo.py`     | Git operations with attribution         |
| `InputOutput` | `aider/io.py`       | Terminal interaction and formatting     |
| `ChatSummary` | `aider/history.py`  | Conversation history compression        |

## AI Workflow

### Request Processing Flow

1. **User Input**: Natural language request via terminal
2. **Context Assembly**: Repo map + file contents + chat history
3. **Prompt Construction**: System prompt + context + user message
4. **LLM Call**: Send to model, receive edit instructions
5. **Parse Edits**: Extract SEARCH/REPLACE blocks or diffs
6. **Apply Changes**: Modify files with fuzzy matching
7. **Lint Check**: Run linter on changed files
8. **Self-Correction**: If errors found, feed back to LLM
9. **Git Commit**: Auto-commit with descriptive message
10. **Output**: Show results to user

### Repo Map Generation

The repo map is Aider's signature innovation:

1. **Tree-sitter Parsing**: Extract definitions and references from all files
2. **Graph Construction**: Build MultiDiGraph with symbols as nodes
3. **PageRank Ranking**: Personalized PageRank to rank symbol importance
4. **Token Budgeting**: Fit within configurable token limit (default: 1024)
5. **Context Selection**: Select most relevant code for current task

### Ranking Weights

| Factor                  | Weight | Purpose                           |
| ----------------------- | ------ | --------------------------------- |
| Files in chat           | 50x    | Prioritize active files           |
| Mentioned identifiers   | 10x    | Context from conversation         |
| Long symbols (8+ chars) | 10x    | Specific references               |
| Reference count         | sqrt() | Prevent high-frequency domination |

### Self-Healing Edit Loop

1. LLM generates code changes
2. Aider applies changes to files
3. Linter runs on modified files
4. If errors found:
   - Package errors with contextual code
   - Feed back to LLM for correction
   - LLM generates fixes
   - Repeat until clean

## Tool Execution

### Built-in Tools

| Tool      | Description                          |
| --------- | ------------------------------------ |
| File Edit | Apply SEARCH/REPLACE or diff changes |
| File Read | Read file contents                   |
| Linter    | Run language-specific linter         |
| Git       | Commit, diff, undo operations        |
| Model     | Switch models during session         |

### Slash Commands

| Command         | Description                  |
| --------------- | ---------------------------- |
| `/add`          | Add files to chat            |
| `/drop`         | Remove files from chat       |
| `/model`        | Switch main model            |
| `/weak-model`   | Switch weak model            |
| `/editor-model` | Switch editor model          |
| `/undo`         | Undo last change             |
| `/diff`         | Show current changes         |
| `/commit`       | Commit changes               |
| `/ask`          | Ask question without editing |
| `/code`         | Generate code                |

### Linting Integration

- Automatic linting after every edit
- Language-specific linter detection
- Error packaging with context
- Self-correction loop

## Context Management

### Repo Map

- **Algorithm**: Personalized PageRank on MultiDiGraph
- **Token Budget**: Configurable (default: 1024 tokens)
- **Cache**: SQLite-backed disk cache keyed by file mtime
- **Fallback**: Pygments lexer for incomplete tree-sitter grammars

### Context Window Allocation

| Component      | Allocation   | Description             |
| -------------- | ------------ | ----------------------- |
| Repo map       | 1/8 of total | Codebase context        |
| Chat history   | Dynamic      | Recent conversation     |
| File contents  | On-demand    | Files added to chat     |
| System prompts | Fixed        | Instructions and format |

### Chat History Management

When history exceeds token limit:

1. Split at assistant-message boundary
2. "Head" sent to LLM for summarization
3. "Tail" preserved verbatim
4. Repeat if still too long

### File Context

- Files explicitly added to chat get full content
- Repo map provides overview of rest of codebase
- Recently edited files prioritized
- Import/export analysis for dependencies

## Review Flow

### Git Integration

- Every edit auto-committed with descriptive message
- Commit messages generated by weak model
- Full audit trail of AI changes
- Easy undo via `/undo` command

### Diff Visualization

- `/diff` shows current uncommitted changes
- Standard git diff format
- Can use familiar git tools for review
- Checkpoint system for rollback

### Quality Gates

- Linter runs after every edit
- Errors fed back to LLM for correction
- Test execution optional (via lint/test integration)
- Manual review encouraged

## Planning

### Architect Mode

Two-model workflow for complex tasks:

1. **Architect Model**: Plans changes in natural language
2. **Editor Model**: Implements the plan using concrete edit format
3. **User Review**: Approve plan before execution
4. **Iterative Refinement**: Adjust plan based on results

### Task Decomposition

- Agent breaks complex tasks into steps
- Each step validated before execution
- Context maintained across steps
- Git history provides rollback capability

## Repository Understanding

### Tree-Sitter Integration

- **Definition Extraction**: Classes, functions, methods
- **Reference Tracking**: Symbol usage across codebase
- **Language Support**: 100+ languages via tree-sitter grammars
- **Fallback**: Pygments lexer for unsupported languages

### Code Graph

- **MultiDiGraph**: Directed multigraph for symbol relationships
- **PageRank**: Ranks symbol importance
- **Edge Weights**: sqrt(reference_count) prevents domination
- **Cross-File Analysis**: Import/export relationships

### Indexing

- **Disk Cache**: SQLite-backed, keyed by file mtime
- **Incremental**: Only re-parses changed files
- **Fast**: Sub-second for most codebases
- **Configurable**: Cache strategy (auto, manual, files, always)

## Installation & Setup

### Requirements

- Python 3.10 or higher
- Git (required for commit integration)
- LLM API key or local model

### Installation

```bash
# Recommended: aider-install
python -m pip install aider-install
aider-install

# Or with uv
python -m pip install uv
uv tool install --force --python python3.12 --with pip aider-chat@latest

# Or with pipx
python -m pip install pipx
pipx install aider-chat

# Or with pip (use virtual environment)
python -m pip install -U aider-chat
```

### Quick Start

```bash
# Change directory to your project
cd /to/your/project

# Start with a model
aider --model sonnet --api-key anthropic=<key>

# Or with DeepSeek
aider --model deepseek --api-key deepseek=<key>

# Or with local Ollama
aider --model ollama_chat/qwen2.5-coder:7b
```

### Configuration

Aider uses a YAML configuration file (`.aider.conf.yml`):

```yaml
model: sonnet
auto-commits: true
dirty-commits: true
lint: true
test-cmd: pytest
map-tokens: 1024
```

## Dependencies

### Required

- Python 3.10+
- Git
- LLM API key (or local model)

### Optional

- Tree-sitter (for repo map)
- Pygments (for fallback parsing)
- Rich (for terminal formatting)
- prompt_toolkit (for input completion)
- sounddevice + pydub (for voice input)

### Model Support

| Provider  | Models                           |
| --------- | -------------------------------- |
| Anthropic | Claude 3.7 Sonnet, Claude 3 Opus |
| OpenAI    | GPT-4o, o1, o3-mini              |
| DeepSeek  | DeepSeek R1, DeepSeek Chat V3    |
| Google    | Gemini 2.0, Gemini 1.5           |
| Local     | Ollama, any OpenAI-compatible    |

## Hardware Impact

### RAM

- **Aider Itself**: ~50-100MB
- **Local Models**: 8GB+ for 7B, 16GB+ for 14B, 32GB+ for 30B+
- **Tree-sitter Parsing**: Temporary memory for large codebases

### CPU

- Minimal for Aider operation
- Significant for local model inference
- Tree-sitter parsing is fast

### GPU

- **Not required** for cloud LLM usage
- **Recommended** for local models
- Apple Silicon Metal acceleration
- NVIDIA CUDA support

### Disk

- Aider: ~50MB
- Local models: 4-40GB depending on model
- SQLite cache: Varies by codebase size

## Security Notes

### Git-First Approach

- Every edit is a commit
- Full audit trail of AI changes
- Easy undo via git
- Descriptive commit messages

### Data Privacy

- Code stays on local machine (unless using cloud LLM)
- No automatic training on user code
- User controls what files are added to chat
- API keys stored in environment variables

### Local Model Support

- Full offline capability with Ollama
- No data leaves the machine
- Air-gapped environment compatible
- Configurable API endpoints

## Offline Support

**Yes** — Full offline capability with local models:

1. Install Ollama and download models
2. Configure Aider to use Ollama endpoint
3. All processing happens locally

### Offline Configuration

```bash
# Set Ollama API endpoint
export OLLAMA_API_BASE=http://127.0.0.1:11434

# Start Ollama with increased context
OLLAMA_CONTEXT_LENGTH=8192 ollama serve

# Use Aider with local model
aider --model ollama_chat/qwen2.5-coder:7b
```

## Browser Automation Alternative

**Limited** — Aider includes experimental browser UI:

```bash
# Launch browser-based version
aider --browser
```

- Experimental web interface
- Same functionality as terminal
- Copy/paste workflow for web chat
- Not full browser automation

## CLI Alternative

### Aider IS the CLI

Aider is designed as a terminal-first tool:

```bash
# Interactive mode
aider

# Single task mode
aider --message "add error handling to main.py"

# Watch mode (for IDE integration)
aider --watch

# Voice input
aider --voice
```

### Watch Mode

Monitors files for AI comment markers:

- `// ai!` — Code edits
- `# ai?` — Questions
- Integrates with any IDE
- Auto-adds changed files to chat

## Bhavya Score

| Criterion       | Score      | Notes                                                      |
| --------------- | ---------- | ---------------------------------------------------------- |
| Usefulness      | 85/100     | Excellent terminal-based pair programming                  |
| Maintenance     | 85/100     | Active development, clean codebase, good docs              |
| Hardware Impact | 80/100     | Lightweight CLI, local models optional                     |
| Offline Support | 90/100     | Full offline with Ollama, simple setup                     |
| **Overall**     | **85/100** | Best terminal-based AI coding tool, excellent architecture |

## Reusable Ideas

1. **Repo Map Innovation** — PageRank-based symbol ranking for context selection
2. **Three-Tier Model System** — Main/weak/editor model optimization
3. **Self-Healing Edits** — Lint-check-correction loop
4. **Git-First Approach** — Every edit is a commit with audit trail
5. **Architect/Editor Pattern** — Two-model workflow for complex tasks
6. **Tree-Sitter Integration** — Fast, accurate code parsing
7. **SQLite Caching** — Efficient incremental indexing
8. **Watch Mode** — IDE-agnostic file monitoring

## Evidence

- **Source**: https://github.com/Aider-AI/aider, https://aider.chat
- **Date collected**: 2026-08-03
- **Why it matters**: Aider demonstrates terminal-based AI coding with innovative repo map and self-healing edits
- **Trade-offs**:
  - Pros: Terminal-first, git integration, repo map innovation, multi-model support, active community
  - Cons: No GUI, requires terminal comfort, limited browser automation, Python dependency
- **Expected value**: Pattern for terminal-based AI coding and efficient context management
- **Maintenance burden**: Low — simple Python package, clean architecture
- **Hardware impact**: Minimal for CLI, significant for local models
