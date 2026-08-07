# AI Learning Runtime — Architecture

**Date:** 2026-08-04
**Purpose:** Reusable runtime that powers every lesson in AI Institute

---

## What Is the AI Learning Runtime?

The AI Learning Runtime is the engine that transforms lessons from content delivery into interactive learning experiences.

It is not an LMS. It is not a content management system. It is a **learning instrument**.

---

## Core Components

```
AI Learning Runtime
├── AI Playground (reusable sandbox)
├── Experiment Engine (attempt tracking)
├── Reflection System (journal + prompts)
├── AI Mentor (coaching engine)
├── Portfolio Generator (artifact creation)
└── Learning Analytics (capability tracking)
```

---

## Component Architecture

### 1. AI Playground

**Purpose:** Live environment for interacting with AI

**Capabilities:**

- Prompt input with syntax highlighting
- AI output display with formatting
- Version comparison (before/after)
- Experiment history
- Reflection journal
- AI suggestions
- Export to portfolio

**Interface:**

```typescript
interface PlaygroundConfig {
  provider: AIProvider; // AI backend
  systemMessage?: string; // Context for AI
  maxTokens?: number; // Response limit
  temperature?: number; // Creativity control
  enableHistory?: boolean; // Track attempts
  enableReflection?: boolean; // Require reflection
  enableComparison?: boolean; // Compare attempts
}

interface Experiment {
  id: string;
  prompt: string;
  context?: string;
  output: string;
  timestamp: Date;
  reflection?: Reflection;
  aiFeedback?: string;
  studentRating?: number; // 1-5 stars
}

interface Reflection {
  whatChanged: string;
  whyChanged: string;
  surprised: string;
  improveNext: string;
  timestamp: Date;
}
```

### 2. Experiment Engine

**Purpose:** Track every attempt, enable improvement visibility

**Capabilities:**

- Store all attempts
- Calculate improvement metrics
- Highlight best attempts
- Enable comparison
- Track iteration count

**Interface:**

```typescript
interface ExperimentEngine {
  experiments: Experiment[];

  addExperiment(experiment: Experiment): void;
  getExperiments(): Experiment[];
  getBestAttempt(): Experiment;
  getImprovement(): ImprovementMetrics;
  compareAttempts(id1: string, id2: string): Comparison;
}

interface ImprovementMetrics {
  totalAttempts: number;
  improvementRate: number; // % improvement over attempts
  bestScore: number;
  currentScore: number;
  trend: "improving" | "stable" | "declining";
}
```

### 3. Reflection System

**Purpose:** Turn experimentation into learning

**Capabilities:**

- Structured reflection prompts
- Reflection storage
- Reflection quality assessment
- Connection to experiments

**Interface:**

```typescript
interface ReflectionSystem {
  prompts: ReflectionPrompt[];

  getPrompts(): ReflectionPrompt[];
  submitReflection(experimentId: string, reflection: Reflection): void;
  getReflections(experimentId: string): Reflection[];
  assessQuality(reflection: Reflection): ReflectionAssessment;
}

interface ReflectionPrompt {
  id: string;
  question: string;
  followUp?: string;
  required: boolean;
}

interface ReflectionAssessment {
  depth: "surface" | "moderate" | "deep";
  specificity: "vague" | "specific" | "detailed";
  connectionToLearning: "none" | "partial" | "strong";
}
```

### 4. AI Mentor

**Purpose:** Coach students through Socratic questioning

**Capabilities:**

- Context-aware coaching
- Socratic questioning
- Encouragement
- Challenge
- Review

**Interface:**

```typescript
interface AIMentor {
  coach(experiment: Experiment, context: LessonContext): MentorResponse;
  review(artifact: PortfolioArtifact): ReviewResponse;
  encourage(improvement: ImprovementMetrics): string;
  challenge(currentLevel: string): string;
}

interface MentorResponse {
  type: "question" | "challenge" | "encouragement" | "suggestion";
  content: string;
  followUp?: string;
}

interface ReviewResponse {
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  score: number;
}
```

### 5. Portfolio Generator

**Purpose:** Turn experiments into career assets

**Capabilities:**

- Collect experiments
- Generate portfolio artifacts
- Include reflections
- Include experiment history
- Enable sharing

**Interface:**

```typescript
interface PortfolioGenerator {
  generateArtifact(
    lesson: Lesson,
    experiments: Experiment[],
  ): PortfolioArtifact;
  exportArtifact(
    artifact: PortfolioArtifact,
    format: "json" | "html" | "pdf",
  ): Blob;
  shareArtifact(artifact: PortfolioArtifact): ShareUrl;
}

interface PortfolioArtifact {
  id: string;
  title: string;
  description: string;
  skills: string[];
  knowledgePackages: string[];
  repositories: string[];
  technologies: string[];
  experiments: Experiment[];
  reflections: Reflection[];
  evidence: Evidence[];
  createdAt: Date;
}

interface Evidence {
  type: "experiment" | "reflection" | "artifact";
  content: string;
  timestamp: Date;
}
```

### 6. Learning Analytics

**Purpose:** Track demonstrated capability, not content consumption

**Capabilities:**

- Track experiments
- Track iterations
- Track reflections
- Track artifacts
- Calculate capability score

**Interface:**

```typescript
interface LearningAnalytics {
  trackExperiment(experiment: Experiment): void;
  trackReflection(reflection: Reflection): void;
  trackArtifact(artifact: PortfolioArtifact): void;

  getCapabilityScore(): CapabilityScore;
  getImprovementTrend(): ImprovementTrend;
  getTimeDistribution(): TimeDistribution;
}

interface CapabilityScore {
  experimentsCompleted: number;
  averageIterations: number;
  reflectionDepth: number;        // average quality
  portfolioArtifacts: number;
  overallScore: number;           // 0-100
}

interface TimeDistribution {
  creating: number;               // % time in experiments
  reflecting: number;             // % time in reflection
  consuming: number;              // % time reading/watching
  building: number;               % time building artifacts
}
```

---

## Data Flow

```
Student opens lesson
    ↓
Lesson loads with AI Playground
    ↓
Student writes prompt
    ↓
AI returns output
    ↓
Student reflects on output
    ↓
Student revises prompt (iteration)
    ↓
AI returns improved output
    ↓
Student reflects on improvement
    ↓
Student builds artifact from experiments
    ↓
AI reviews artifact
    ↓
Portfolio artifact generated
    ↓
Learning analytics updated
```

---

## Provider Interface

The runtime supports multiple AI providers through a common interface:

```typescript
interface AIProvider {
  name: string;
  complete(request: CompletionRequest): Promise<CompletionResponse>;
}

interface CompletionRequest {
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
}

interface CompletionResponse {
  content: string;
  usage: Usage;
  model: string;
}

// Supported providers (initial)
interface MockProvider extends AIProvider {} // Slice 2: simulated
interface OpenAIProvider extends AIProvider {} // Future: real API
interface AnthropicProvider extends AIProvider {} // Future: real API
```

**Slice 2:** Uses MockProvider (simulated AI responses)
**Slice 3+:** Plug in real AI providers without redesign

---

## Integration with Platform-UI

The runtime uses only @bhavya/platform-ui components:

| Runtime Component  | Platform-UI Component      |
| ------------------ | -------------------------- |
| Playground Layout  | AppLayout                  |
| Prompt Input       | Custom (textarea + syntax) |
| Output Display     | Card                       |
| Experiment History | DataTable                  |
| Reflection Form    | Card + Form                |
| AI Feedback        | Card + Badge               |
| Comparison View    | Side-by-side Cards         |
| Export Button      | Button                     |
| Analytics Display  | Progress + Badge           |

No new foundational components created.

---

## Storage Model

### Slice 2: localStorage

```typescript
interface RuntimeStorage {
  experiments: Experiment[];
  reflections: Reflection[];
  artifacts: PortfolioArtifact[];
  analytics: CapabilityScore;
}
```

### Slice 3+: Backend API

```typescript
interface RuntimeAPI {
  // Experiments
  saveExperiment(experiment: Experiment): Promise<void>;
  getExperiments(lessonId: string): Promise<Experiment[]>;

  // Reflections
  saveReflection(reflection: Reflection): Promise<void>;
  getReflections(experimentId: string): Promise<Reflection[]>;

  // Artifacts
  saveArtifact(artifact: PortfolioArtifact): Promise<void>;
  getArtifacts(studentId: string): Promise<PortfolioArtifact[]>;

  // Analytics
  getCapabilityScore(studentId: string): Promise<CapabilityScore>;
}
```

---

## Slice 2 Scope

### Must Build

1. AI Playground component
2. Experiment Engine
3. Reflection System
4. Mock AI Provider
5. Portfolio Generator (basic)
6. Learning Analytics (basic)

### Must Not Build

1. Real AI provider integration (Slice 3)
2. Backend API (Slice 3)
3. Authentication (Slice 4)
4. Instructor dashboard (Slice 4)
5. Cohort management (Slice 5)

---

## Success Criteria

Slice 2 is complete when:

1. ✅ AI Playground works in browser
2. ✅ Students can write prompts, see output
3. ✅ Students can iterate and compare attempts
4. ✅ Students can reflect on experiments
5. ✅ Portfolio artifacts are generated
6. ✅ Learning analytics track capability
7. ✅ Runtime is reusable across lessons
8. ✅ Design system is preserved
9. ✅ Build passes
10. ✅ Mission validation passes

---

## Verdict

The AI Learning Runtime transforms Bhavya AI Institute from an LMS into an AI-native learning platform.

**Slice 2 builds the runtime.**
**Slice 3 plugs in real AI.**
**Every future lesson uses the runtime.**

This is the foundation of the operating system for creating AI engineers.
