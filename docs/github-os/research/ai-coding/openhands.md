# OpenHands — Knowledge Package

## Executive Summary

OpenHands (formerly OpenDevin) is an open-source platform for building AI software development agents. It provides a complete runtime environment where AI agents can write code, execute commands, browse the web, and interact with development tools — mimicking the workflow of a human software engineer. The platform is MIT-licensed, has 64k+ GitHub stars, and has attracted contributions from 188+ contributors across academia and industry.

OpenHands is architecturally distinct from other AI coding tools because it provides a full sandboxed execution environment. Rather than just suggesting code changes, agents run inside Docker containers with access to a bash terminal, Jupyter notebook, and Chromium browser. This makes it suitable for autonomous multi-step tasks like refactoring entire codebases, fixing bugs from issue trackers, and performing complex maintenance operations.

The platform matters for Bhavya Foundation because it demonstrates a production-grade pattern for sandboxed AI code execution — a critical capability for any GitHub OS project that needs to safely run AI-generated code without risking host system integrity.

## Architecture

### Core SDK Architecture

OpenHands V1 is built on the **Software Agent SDK**, a composable Python/REST framework with nine interlocking components:

1. **Event-Sourced State Management** — Immutable conversation state with deterministic replay. Each operation returns a new Conversation instance, enabling serialization to disk or database.

2. **Agent (Reasoning Loop)** — Stateless reasoning engine that processes messages, consults the LLM, validates and executes tool calls, then loops until completion. The default `CodeActAgent` uses code execution as its primary action space.

3. **LLM Integration** — Provider-agnostic interface supporting OpenAI, Anthropic, and 100+ providers via unified API. Handles streaming, retries, and error recovery.

4. **Tool System** — Typed action/observation pattern with three components: Action (input schema), Observation (output schema), and ToolExecutor (transformation logic). Auto-generates JSON schemas for LLM tool calling.

5. **Workspace Abstraction** — Abstracts execution environments (LocalWorkspace, DockerWorkspace, RemoteAPIWorkspace). Same agent code runs locally or in containers without changes.

6. **Condenser (Memory Management)** — Manages conversation length by summarizing older messages while preserving important context.

7. **MCP Integration** — Connects to Model Context Protocol tool servers for external tool access.

8. **Skills (Microagents)** — Composable behavior modules that modify agent decision-making for specific tasks.

9. **Security** — Input validation, command sanitization, path traversal prevention, and resource limits.

### Runtime Environment

The runtime consists of a Docker-sandboxed OS with:

- **Bash shell** — Full command-line access within the container
- **Jupyter/IPython server** — Interactive Python code execution
- **Chromium browser (Playwright)** — Web browsing with accessibility tree access
- **REST API server** — Listens for action execution requests from the event stream

### Deployment Architecture

- **Local**: `openhands serve` launches GUI server via Docker
- **Remote**: Agent Server module exposes REST/WebSocket endpoints
- **Cloud**: OpenHands Cloud provides managed multi-tenant deployment
- **Containerized**: Each agent instance runs in an independent container with dedicated filesystem

### Multi-Agent Delegation

The SDK supports hierarchical agent coordination through a delegation tool. Sub-agents operate as independent conversations inheriting the parent's model configuration and workspace context, enabling structured parallelism and isolation.

## AI Workflow

### Context Gathering

- Agent receives a natural language task description
- Reads project files from the mounted workspace directory
- Can browse the web for documentation and references
- Uses the Jupyter kernel for exploratory code analysis

### Suggestion Generation

- The CodeActAgent generates code as executable actions (bash commands, Python code, browser interactions)
- Actions are validated by the security layer before execution
- Observations from tool execution are fed back into the reasoning loop

### Review Flow

- Every action goes through the security analyzer
- Human-in-the-loop approval for sensitive operations (configurable)
- Agent monitors linter/compiler output and self-corrects
- Conversation history provides full audit trail

## Tool Execution

OpenHands agents have access to a rich set of tools:

| Tool                       | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `CmdRunAction`             | Execute arbitrary bash commands in the sandbox |
| `IPythonRunCellAction`     | Run Python code in Jupyter kernel              |
| `BrowserInteractiveAction` | Navigate, click, type, scroll in web browser   |
| `BrowserObserveAction`     | Get HTML, DOM, accessibility tree, screenshots |
| `FileReadAction`           | Read files from the workspace                  |
| `FileWriteAction`          | Create or modify files                         |
| `AgentDelegateAction`      | Spawn sub-agents for parallel tasks            |

### Browser Automation

- Full Chromium browser with Playwright integration
- Domain-specific language for browsing (BrowserGym)
- Actions: navigation, clicking, typing, scrolling
- Observations: HTML, DOM, accessibility tree, screenshots, opened tabs

## Context Management

### State Model

- **Event Stream**: Chronological collection of actions and observations
- **Immutable State**: Each operation produces a new state snapshot
- **Serializable**: Can be saved to disk or database and restored
- **Cost Tracking**: Accumulative cost of LLM calls

### Memory Management

- **Condenser**: Automatically compresses conversation history when it exceeds token limits
- **Skills**: Provide domain-specific context for specialized tasks
- **Workspace Context**: Files mounted from the host system provide persistent context

### Context Window Optimization

- Agents receive full conversation history plus current workspace state
- Context compression preserves important information while reducing token usage
- Sub-agents inherit parent context but maintain separate execution streams

## Review Flow

### Security Analysis

- Input validation on all tool calls
- Command sanitization to prevent injection attacks
- Path traversal prevention
- Resource limits (CPU, memory, execution time)

### Human Oversight

- Configurable approval requirements for different action types
- Real-time visualization of agent actions in the GUI
- Full event log for post-hoc review
- Checkpoint system for rollback capability

### Self-Correction

- Agent monitors linter output after code changes
- Catches compilation errors and missing imports
- Automatically retries with corrections
- Feeds error observations back into the reasoning loop

## Planning

### Task Decomposition

- Agent breaks complex tasks into sequential steps
- Each step is validated before execution
- Sub-agent delegation for parallelizable subtasks
- Conversation history maintains full context across steps

### Architecture Decisions

- Agent can browse documentation and search the web
- Exploratory code analysis via Jupyter notebook
- Iterative refinement based on execution results
- Skills provide domain-specific guidance

## Repository Understanding

### Code Analysis

- Direct file system access within the sandbox
- Tree-sitter based parsing for code understanding
- LSP integration for type information and references
- Web browsing for documentation lookup

### Cross-Referencing

- Multi-file editing with dependency tracking
- Import resolution and type checking
- Test execution to verify changes
- Git integration for version control

## Installation & Setup

### System Requirements

- **OS**: macOS (with Docker Desktop), Linux, Windows (with WSL2 + Docker Desktop)
- **RAM**: Minimum 4GB, 8GB+ recommended
- **Docker**: Required for sandboxed execution
- **Disk**: ~2GB for Docker images
- **Network**: Required for initial setup and LLM API calls

### Quick Start

```bash
# Install via uv (recommended)
uv tool install openhands --python 3.12

# Launch GUI server
openhands serve

# Or with GPU support
openhands serve --gpu

# Or mount current directory
openhands serve --mount-cwd
```

### Docker Installation

```bash
# macOS/Linux
export PROJECTS_PATH="$HOME/projects"
mkdir -p "$PROJECTS_PATH" "$HOME/.openhands"

docker run -it --rm \
  -p 8000:8000 \
  -v "$HOME/.openhands:/home/openhands/.openhands" \
  -v "${PROJECTS_PATH}:/projects" \
  ghcr.io/openhands/agent-canvas:1.8.0
```

### Configuration

- LLM settings via environment variables or GUI
- `LLM_API_KEY` — Your API key
- `LLM_MODEL` — Model to use (e.g., `claude-3-5-sonnet-20241022`)
- `SANDBOX_VOLUMES` — Mount paths for workspace access

## Dependencies

### Required

- Docker Desktop or Docker Engine
- Node.js 22.12.x+ (for npm launcher)
- Python 3.12 (for uv launcher)
- LLM API key (OpenAI, Anthropic, etc.)

### Optional

- NVIDIA GPU + Container Toolkit (for GPU acceleration)
- nvidia-docker2 (for GPU passthrough)

### Model Support

- **Cloud**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Open Source**: Qwen, Devstral, CodeLlama, DeepSeek
- **Local**: Any OpenAI-compatible endpoint (Ollama, LM Studio)

## Hardware Impact

### RAM

- **Minimum**: 4GB (host system)
- **Recommended**: 8GB+ (host system)
- **Docker overhead**: ~500MB-1GB for container
- **GPU tasks**: Additional VRAM for local models

### CPU

- Containerized execution isolates agent CPU usage
- LLM inference happens on API servers (not local)
- Local model inference requires significant CPU/GPU

### GPU

- **Not required** for cloud LLM usage
- **Optional** for local model inference
- NVIDIA GPU with CUDA support for acceleration
- Apple Silicon Metal support available

### Disk

- ~2GB for Docker images
- Additional space for workspace files
- Model storage for local inference

## Security Notes

### Sandboxing

- All execution occurs inside Docker containers
- Container isolation prevents host system access
- Configurable resource limits (CPU, memory, time)
- Filesystem mounted read-write only for specified directories

### Data Privacy

- Code stays on local machine during execution
- LLM API calls send code snippets to chosen provider
- No automatic training on user code
- Full audit trail of all actions

### Validation Layers

- Input validation on all tool calls
- Command sanitization
- Path traversal prevention
- Security analyzer for agent actions

## Offline Support

**Partial** — Requires internet for:

- LLM API calls (unless using local models)
- Docker image pulls (first time only)
- Model downloads for local inference

**Works offline** with:

- Local models via Ollama or LM Studio
- Pre-pulled Docker images
- Pre-downloaded model weights

## Browser Automation Alternative

**Yes** — OpenHands includes full browser automation via Playwright:

- Chromium browser running inside the sandbox
- Can navigate websites, fill forms, click elements
- DOM inspection and accessibility tree access
- Screenshots for visual verification
- Useful for testing web applications and fetching documentation

## CLI Alternative

### `openhands` CLI

```bash
# Run in CLI mode (no Docker needed)
openhands web

# Run a single task
openhands --task "fix the bug in main.py"

# Interactive mode
openhands
```

### Comparison

- CLI mode is lightweight (no Docker overhead)
- GUI mode provides richer interaction
- Both use the same agent backend
- CLI suitable for scripting and automation

## Bhavya Score

| Criterion       | Score      | Notes                                                         |
| --------------- | ---------- | ------------------------------------------------------------- |
| Usefulness      | 85/100     | Excellent for autonomous coding tasks, full sandbox           |
| Maintenance     | 75/100     | Active community, frequent releases, but complex architecture |
| Hardware Impact | 60/100     | Requires Docker, 4GB+ RAM, optional GPU                       |
| Offline Support | 50/100     | Requires local models for full offline capability             |
| **Overall**     | **67/100** | Strong platform, best for autonomous agent workflows          |

## Reusable Ideas

1. **Sandboxed Execution Pattern** — Docker-based isolation for safe code execution
2. **Event-Sourced State** — Immutable conversation state with replay capability
3. **Action/Observation Tool Pattern** — Typed tool system with schema generation
4. **Workspace Abstraction** — Same agent code works locally and remotely
5. **Multi-Agent Delegation** — Hierarchical task decomposition with sub-agents
6. **Security Analyzer** — Input validation and command sanitization
7. **Skills System** — Composable behavior modules for specialization
8. **Condenser Pattern** — Automatic context compression for long conversations

## Evidence

- **Source**: https://github.com/All-Hands-AI/OpenHands, https://docs.openhands.dev
- **Date collected**: 2026-08-03
- **Why it matters**: OpenHands is the leading open-source platform for autonomous AI coding agents with full sandboxed execution
- **Trade-offs**:
  - Pros: Full sandbox, multi-agent support, rich tool ecosystem, active community, MIT licensed
  - Cons: Docker dependency adds complexity, higher resource usage, steep learning curve
- **Expected value**: Pattern for sandboxed AI execution applicable to GitHub OS safe-run capabilities
- **Maintenance burden**: Active maintenance required for Docker images, SDK updates, and security patches
- **Hardware impact**: 4GB+ RAM, Docker overhead, optional GPU for local models
