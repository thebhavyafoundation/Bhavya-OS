# Cline — Knowledge Package

## Executive Summary

Cline is an autonomous coding agent available as a VS Code extension, JetBrains plugin, CLI tool, and SDK. With 63k+ GitHub stars, it's one of the most popular open-source AI coding tools. Cline's defining characteristic is its human-in-the-loop model: every consequential action (writing files, executing commands, browser actions) requires explicit user approval before execution. This makes it suitable for high-security and regulated environments where autonomous code modification is unacceptable.

Cline operates differently from IDE assistants like Continue — it's an autonomous agent that can plan, explore codebases, execute terminal commands, browse the web, and make coordinated multi-file changes. However, it maintains human oversight through approval prompts, diff views, checkpoints, and configurable rules. The Plan/Act mode toggle lets developers align on strategy before execution.

For Bhavya Foundation, Cline demonstrates the "agent with guardrails" pattern — autonomous capability combined with human control. Its SDK architecture also provides a reference for building custom AI agents with plugin systems, multi-agent teams, and scheduled automations.

## Architecture

### Multi-Runtime Support

Cline supports three primary runtime environments with a shared core engine:

| Runtime           | Entry Point                    | UI                        | Host Interface     |
| ----------------- | ------------------------------ | ------------------------- | ------------------ |
| VS Code Extension | `src/extension.ts`             | React webview             | VS Code API        |
| CLI               | `apps/cli/`                    | Ink terminal / plain text | Direct process I/O |
| Standalone (SDK)  | `src/standalone/cline-core.ts` | External webview          | gRPC host bridge   |

### Core Engine

The core engine consists of several key subsystems:

| Subsystem          | Class            | Role                                                            |
| ------------------ | ---------------- | --------------------------------------------------------------- |
| **Controller**     | `Controller`     | Long-lived orchestrator: owns Task, StateManager, McpHub        |
| **Task**           | `Task`           | Single AI session: manages agent loop, ApiHandler, ToolExecutor |
| **StateManager**   | `StateManager`   | In-memory state cache with debounced persistence                |
| **HostProvider**   | `HostProvider`   | Abstraction for terminal, diff view, window, workspace          |
| **ApiHandler**     | `ApiHandler`     | Interface for LLM providers with streaming support              |
| **PromptRegistry** | `PromptRegistry` | Assembles system prompts and tool definitions                   |
| **McpHub**         | `McpHub`         | Manages MCP server lifecycles and tool discovery                |
| **BrowserSession** | `BrowserSession` | Puppeteer-based web automation                                  |

### Communication Architecture

Cline uses gRPC-over-postMessage to bridge the React webview and extension backend:

| Direction           | Wrapper            | Key Fields              |
| ------------------- | ------------------ | ----------------------- |
| Webview → Extension | `WebviewMessage`   | `type: "grpc_request"`  |
| Extension → Webview | `ExtensionMessage` | `type: "grpc_response"` |

### SDK Architecture

The SDK (`@cline/sdk`) provides programmatic access:

- **ClineCore**: Stateful orchestration layer
- **Agent**: Stateless agent loop
- **ProviderGateway**: LLM provider abstraction
- **ToolOrchestrator**: Tool execution management

## AI Workflow

### Session Lifecycle

1. **Initialization** — `ClineCore` prepares workspace and starts session
2. **LLM Interaction** — Agent uses `ProviderGateway` for model communication
3. **Tool Execution** — `ToolOrchestrator` dispatches tool calls
4. **Human-in-the-Loop** — Loop suspends for approval-required tools
5. **Turn Continuation** — Results fed back for next reasoning step

### Plan/Act Mode

- **Plan Mode**: Explore codebase, ask questions, lay out strategy
- **Act Mode**: Execute the plan with approval gates
- **Toggle**: Switch between modes during a session
- **Auto-Approve**: Optional bypass for trusted operations

### Context Gathering

- Reads project structure and file relationships
- Monitors linter and compiler errors in real-time
- Executes terminal commands to understand build system
- Browses web for documentation and references
- Uses MCP servers for external tool access

## Tool Execution

### Built-in Tools

| Tool              | Description             | Approval Required |
| ----------------- | ----------------------- | ----------------- |
| `write_file`      | Create or modify files  | Yes               |
| `read_file`       | Read file contents      | No                |
| `execute_command` | Run terminal commands   | Yes               |
| `browse`          | Navigate web pages      | Yes               |
| `list_files`      | List directory contents | No                |
| `search_files`    | Search for patterns     | No                |
| `apply_diff`      | Apply code changes      | Yes               |
| `ask_question`    | Ask user for input      | Yes               |

### Terminal Integration

- Executes commands in developer's terminal
- Watches output in real-time
- Handles long-running processes (dev servers, tests)
- Reacts to compilation errors and test failures
- Manages package installation and build scripts

### Browser Automation

- Puppeteer-based headless browser
- Navigate URLs, fill forms, click elements
- Screenshot capture for visual verification
- Useful for testing web apps and fetching documentation

### MCP Integration

- Model Context Protocol for external tools
- Database access, API calls, infrastructure management
- One-click install marketplace
- Custom tool registration via SDK

## Context Management

### Codebase Understanding

- **File Tree**: Project structure analysis
- **Dependency Graph**: Import/export relationships
- **LSP Integration**: Type information and references
- **Real-time Monitoring**: Linter and compiler output

### Context Assembly

- Active file content
- Related files (imports, dependencies)
- Terminal output and errors
- Browser context (when browsing)
- MCP server results

### Token Management

- Automatic context pruning
- Priority given to recent context
- File size limits for large files
- Smart truncation for long outputs

## Review Flow

### Approval System

| Mechanism            | Implementation               | Effect                        |
| -------------------- | ---------------------------- | ----------------------------- |
| Approval prompts     | `ask()`/`onEvent`            | Suspends agent loop           |
| Diff view            | `apply_patch`/`editor`       | Shows changes before applying |
| Checkpoints          | Git-based snapshots          | Diffing and rollback          |
| Rules & .clineignore | `.clinerules`/`.clineignore` | Behavior guidance             |
| Command Permissions  | `CLINE_COMMAND_PERMISSIONS`  | Shell command restrictions    |

### Diff Visualization

- Inline diffs in VS Code
- Side-by-side comparison
- Accept/reject individual changes
- Undo capability via checkpoints

### Self-Correction

- Monitors linter output after changes
- Catches missing imports and type errors
- Automatically retries with fixes
- Reports errors to user for guidance

## Planning

### Task Decomposition

- Agent explores codebase before acting
- Lays out multi-step plan in Plan mode
- Breaks complex tasks into manageable steps
- User approves plan before execution

### Architecture Decisions

- Codebase exploration via file tree and search
- Dependency analysis
- Pattern detection
- Refactoring suggestions with rationale

## Repository Understanding

### Static Analysis

- **Tree-sitter**: Syntax-aware parsing
- **LSP**: Type information, references, diagnostics
- **File Metadata**: Size, modification time, language
- **Import Graph**: Dependency relationships

### Dynamic Analysis

- **Terminal Output**: Build errors, test results
- **Runtime Behavior**: Debugging, profiling
- **Web Context**: Documentation, API references

## Installation & Setup

### VS Code Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "Cline" (extension ID: `saoudrizwan.claude-dev`)
4. Click Install
5. Click Cline icon in Activity Bar

### JetBrains Installation

1. Open IntelliJ IDEA / PyCharm / WebStorm
2. Go to Settings → Plugins → Marketplace
3. Search "Cline"
4. Click Install
5. Restart IDE
6. View → Tool Windows → Cline

### CLI Installation

```bash
# Requires Node.js 20+
npm install -g cline

# Or use npx
npx cline
```

### SDK Installation

```bash
npm install @cline/sdk
```

### Configuration

1. Open Cline panel
2. Click settings gear
3. Select API Provider (Anthropic, OpenAI, Ollama, etc.)
4. Enter API key or base URL
5. Select model
6. Configure approval settings

### Rules Configuration

Create `.clinerules` in project root:

```markdown
# Project Rules

- Use TypeScript strict mode
- Follow Airbnb style guide
- Write unit tests for all new functions
- Use conventional commits
```

## Dependencies

### Required

- VS Code 1.84.0+ or JetBrains IDE (for extension)
- Node.js 20+ (for CLI/SDK)
- LLM provider access (API key or local model)

### Optional

- Ollama (for local models)
- LM Studio (for local models)
- Docker (for sandboxed execution)

### Model Support

| Provider    | Models                                   |
| ----------- | ---------------------------------------- |
| Anthropic   | Claude 4 Sonnet, Claude 3.5 Haiku        |
| OpenAI      | GPT-4o, o1, o3-mini                      |
| Google      | Gemini 2.0, Gemini 1.5                   |
| OpenRouter  | 200+ models via one API                  |
| AWS Bedrock | Claude, Llama models                     |
| Local       | Ollama, LM Studio, any OpenAI-compatible |

## Hardware Impact

### RAM

- **Extension**: ~150-300MB (IDE overhead)
- **Local Models**: 16GB+ for small/quantized, 32GB+ for mid-size, 64GB+ for large
- **Browser Automation**: Additional memory for Puppeteer

### CPU

- Minimal for extension operation
- Significant for local model inference
- Terminal command execution

### GPU

- **Not required** for cloud LLM usage
- **Recommended** for local models
- Apple Silicon Metal acceleration
- NVIDIA CUDA support

### Disk

- Extension: ~100MB
- Local models: 4-40GB depending on model
- Project workspace: Varies

## Security Notes

### Human-in-the-Loop

- Every file write requires approval
- Terminal commands need explicit permission
- Browser actions require confirmation
- Auto-approve optional for trusted operations

### Data Privacy

- Code stays on local machine (unless using cloud LLM)
- No automatic training on user code
- User controls what context is sent to LLM
- Telemetry can be disabled

### Access Control

- `.clineignore` prevents access to sensitive files
- Command permissions restrict shell operations
- File write approval prevents unauthorized changes
- Checkpoint system enables rollback

### Enterprise Features

- Centralized model endpoints
- Team usage tracking
- SSO integration
- Compliance-ready audit trails

## Offline Support

**Yes** — Full offline capability with local models:

1. Install Ollama and download models
2. Configure Cline to use Ollama endpoint
3. Disable telemetry
4. All processing happens locally

### Offline Configuration

1. Open Cline Settings
2. Set API Provider to "Ollama"
3. Set Base URL to `http://localhost:11434`
4. Select local model
5. Enable "Use Compact Prompt"

## Browser Automation Alternative

**Yes** — Cline includes built-in browser automation:

- Puppeteer-based headless browser
- Navigate URLs, fill forms, click elements
- Screenshot capture
- DOM inspection
- Useful for testing web apps and fetching documentation

## CLI Alternative

### Cline CLI

```bash
# Install
npm install -g cline

# Interactive mode
cline

# Headless mode for CI/CD
cline --headless --task "fix lint errors"

# JSON output
cline --json --task "add tests"
```

### Comparison

- CLI provides terminal-native experience
- Extensions offer richer UI with diff views
- Same core engine and model support
- CLI suitable for scripting and automation

## Bhavya Score

| Criterion       | Score      | Notes                                                                      |
| --------------- | ---------- | -------------------------------------------------------------------------- |
| Usefulness      | 85/100     | Excellent autonomous agent with human control                              |
| Maintenance     | 80/100     | Active development, large community, frequent updates                      |
| Hardware Impact | 65/100     | Lightweight extension, local models require significant RAM                |
| Offline Support | 90/100     | Full offline with Ollama, air-gapped compatible                            |
| **Overall**     | **80/100** | Best balance of autonomy and control, excellent for regulated environments |

## Reusable Ideas

1. **Human-in-the-Loop Pattern** — Approval prompts for all consequential actions
2. **Plan/Act Mode Toggle** — Strategy alignment before execution
3. **Checkpoint System** — Git-based snapshots for rollback
4. **Rules Engine** — `.clinerules` for project-specific behavior
5. **SDK Architecture** — Programmatic agent access for custom integrations
6. **Multi-Agent Teams** — Coordinator agents delegating to specialists
7. **Scheduled Automations** — Cron-based recurring tasks
8. **MCP Integration** — Extensible tool system via Model Context Protocol

## Evidence

- **Source**: https://github.com/cline/cline, https://cline.bot
- **Date collected**: 2026-08-03
- **Why it matters**: Cline is the most popular open-source autonomous coding agent with human-in-the-loop safety
- **Trade-offs**:
  - Pros: Human control, multi-runtime support, SDK for custom agents, active community
  - Cons: Approval prompts can slow workflow, local models need significant RAM, learning curve
- **Expected value**: Pattern for safe autonomous coding agents applicable to GitHub OS
- **Maintenance burden**: Moderate — active development, frequent releases
- **Hardware impact**: Minimal for extension, 16GB+ RAM for local models
