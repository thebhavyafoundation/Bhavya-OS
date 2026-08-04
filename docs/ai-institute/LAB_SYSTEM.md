# Lab System

Practical labs for hands-on learning.

---

## Lab Types

### 1. Guided Lab

- Step-by-step instructions
- Immediate validation at each step
- Hints available
- Lowest difficulty

**Use for:** Foundation level, introducing new tools

### 2. Semi-Guided Lab

- High-level objectives
- Some hints available
- Student decides approach
- Medium difficulty

**Use for:** Core AI level, applying concepts

### 3. Open Lab

- Problem statement only
- No hints
- Student designs solution
- Highest difficulty

**Use for:** Advanced levels, capstone preparation

---

## Lab Catalog

### Prompt Engineering Lab

**Objective:** Master prompt design patterns.

| Exercise         | Task                                | Validation                        |
| ---------------- | ----------------------------------- | --------------------------------- |
| Basic Prompts    | Write prompts for 5 different tasks | AI evaluation of quality          |
| Chain of Thought | Design prompts that use CoT         | Output contains reasoning steps   |
| Few-Shot         | Create few-shot prompts             | Examples improve output           |
| System Messages  | Design system prompts               | Role is maintained                |
| Evaluation       | Build a prompt evaluation rubric    | Rubric produces consistent scores |

**Dataset:** Collection of tasks requiring different prompt strategies.

---

### LangGraph Lab

**Objective:** Build agent workflows with LangGraph.

| Exercise            | Task                        | Validation                |
| ------------------- | --------------------------- | ------------------------- |
| Basic Graph         | Build a simple 3-node graph | Graph executes correctly  |
| Conditional Routing | Add branching logic         | Correct branch taken      |
| Tool Integration    | Add tool nodes              | Tools called correctly    |
| State Management    | Manage shared state         | State persists correctly  |
| Error Handling      | Add retry and fallback      | Errors handled gracefully |

**Starter Project:** Empty LangGraph project with dependencies.

---

### MCP Lab

**Objective:** Build and use MCP servers.

| Exercise            | Task                           | Validation                |
| ------------------- | ------------------------------ | ------------------------- |
| Client Usage        | Connect to existing MCP server | Resources accessed        |
| Server Basics       | Build a simple MCP server      | Server responds correctly |
| Resource Management | Expose custom resources        | Resources listed and read |
| Tool Implementation | Implement custom tools         | Tools execute correctly   |
| Advanced Features   | Add prompts and subscriptions  | All features work         |

**Starter Project:** MCP server template with examples.

---

### Playwright Lab

**Objective:** Automate browser interactions.

| Exercise         | Task                      | Validation                     |
| ---------------- | ------------------------- | ------------------------------ |
| Navigation       | Navigate and extract data | Correct data extracted         |
| Form Interaction | Fill and submit forms     | Forms submitted correctly      |
| Waiting          | Handle dynamic content    | Content waited for correctly   |
| Screenshots      | Capture visual evidence   | Screenshots match expectations |
| AI Integration   | Use AI to interpret pages | AI provides correct analysis   |

**Starter Project:** Playwright project with test fixtures.

---

### Browser Automation Lab

**Objective:** Build AI-powered browser agents.

| Exercise           | Task                            | Validation                      |
| ------------------ | ------------------------------- | ------------------------------- |
| Task Decomposition | Break complex tasks into steps  | Steps are correct               |
| Element Selection  | Find and interact with elements | Correct elements selected       |
| Error Recovery     | Handle unexpected situations    | Recovery attempted              |
| Multi-tab          | Handle multiple tabs            | Tabs managed correctly          |
| Complex Workflows  | Build end-to-end workflows      | Workflows complete successfully |

**Starter Project:** Browser automation framework with AI integration.

---

### Knowledge Studio Lab

**Objective:** Create and manage Knowledge Packages.

| Exercise           | Task                         | Validation                 |
| ------------------ | ---------------------------- | -------------------------- |
| Package Creation   | Create a Knowledge Package   | Package follows schema     |
| Linking            | Link related packages        | Links are correct          |
| Versioning         | Update and version packages  | Version history maintained |
| Quality Assessment | Evaluate package quality     | Score meets threshold      |
| Curation           | Select and organize packages | Organization is logical    |

**Starter Project:** Knowledge Studio template.

---

### GitHub OS Lab

**Objective:** Use GitHub Intelligence Lab for learning.

| Exercise            | Task                   | Validation            |
| ------------------- | ---------------------- | --------------------- |
| Repository Analysis | Analyze a repository   | Analysis complete     |
| Pattern Detection   | Identify patterns      | Patterns are real     |
| Architecture Review | Review architecture    | Review is insightful  |
| Learning Path       | Generate learning path | Path is logical       |
| Contribution        | Make a contribution    | Contribution accepted |

**Starter Project:** GitHub Intelligence Lab connection.

---

## Lab Structure

Every lab has:

### Instructions

```yaml
instructions:
  - step: 1
    title: "Setup"
    action: "Install dependencies and configure environment"
    expected: "Project runs without errors"
    validation:
      type: "command"
      command: "npm test"
      expected: "All tests pass"
  - step: 2
    title: "Implementation"
    action: "Implement the core function"
    expected: "Function produces correct output"
    validation:
      type: "output"
      input: "test input"
      expected: "expected output"
```

### Dataset

```yaml
dataset:
  name: "Lab data"
  source: "path/to/data"
  format: "JSON"
  size: "10MB"
  documentation: "README.md"
  license: "MIT"
```

### Starter Project

```yaml
starterProject:
  repository: "https://github.com/bhavya-foundation/lab-template"
  branch: "main"
  setup:
    - command: "npm install"
      description: "Install dependencies"
    - command: "cp .env.example .env"
      description: "Configure environment"
  files:
    - path: "src/index.ts"
      description: "Main entry point"
    - path: "src/types.ts"
      description: "Type definitions"
    - path: "tests/index.test.ts"
      description: "Test file"
```

### Validation

```yaml
validation:
  type: "tests" | "output" | "manual" | "ai"
  tests:
    - name: "Test 1"
      description: "What this tests"
      command: "npm test -- --testNamePattern='Test 1'"
      expected: "PASS"
  output:
    - input: "test input"
      expected: "expected output"
      exact: false  # or true for exact match
  manual:
    - description: "What the mentor checks"
      criteria: "Quality criteria"
  ai:
    - description: "What AI evaluates"
      prompt: "Evaluate this code for..."
      criteria:
        - "Correctness"
        - "Readability"
        - "Efficiency"
```

### Hints

```yaml
hints:
  - level: 1
    title: "Thinking point"
    content: "Consider how this relates to..."
    revealAfter: 30 # minutes
  - level: 2
    title: "Direction"
    content: "Try looking at..."
    revealAfter: 60
  - level: 3
    title: "Solution approach"
    content: "The key is to..."
    revealAfter: 120
```

### AI Mentor Config

```yaml
aiMentor:
  personality: "supportive" # supportive, challenging, Socratic
  hintStyle: "progressive" # progressive, direct, Socratic
  evaluationCriteria:
    - "Correctness"
    - "Code quality"
    - "Problem-solving approach"
  feedbackStyle: "detailed" # detailed, concise, Socratic
```

### Rubric

```yaml
rubric:
  dimensions:
    - name: "Correctness"
      weight: 40
      levels:
        1: "Does not work"
        2: "Partially works"
        3: "Mostly works"
        4: "Works correctly"
        5: "Works perfectly with edge cases"
    - name: "Code Quality"
      weight: 20
      levels:
        1: "Unreadable"
        2: "Hard to read"
        3: "Readable"
        4: "Clean and organized"
        5: "Exemplary"
    - name: "Problem Solving"
      weight: 20
      levels:
        1: "No clear approach"
        2: "Unclear approach"
        3: "Reasonable approach"
        4: "Good approach"
        5: "Excellent approach"
    - name: "Documentation"
      weight: 20
      levels:
        1: "None"
        2: "Minimal"
        3: "Adequate"
        4: "Good"
        5: "Comprehensive"
  passingScore: 3.0 # average across dimensions
```

---

## Lab Lifecycle

```
Draft
  ↓
Review (Content + Technical)
  ↓
Testing (Beta students)
  ↓
Revision
  ↓
Publication
  ↓
Active
  ↓
Feedback Collection
  ↓
Iteration
  ↓
Version Bump
```

---

## Lab Metrics

| Metric          | Target                 |
| --------------- | ---------------------- |
| Completion rate | ≥ 70%                  |
| Average time    | Within 20% of estimate |
| Hint usage      | < 50% of students      |
| Satisfaction    | ≥ 4/5                  |
| Retry rate      | < 30%                  |
