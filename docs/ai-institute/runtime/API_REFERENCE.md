# Runtime API Reference

## LearningRuntime

Main orchestrator class.

```typescript
class LearningRuntime {
  constructor(provider: AIProvider);

  // Lesson management
  startLesson(lessonId: string): Promise<void>;

  // Experiments
  runExperiment(prompt: string, context?: string): Promise<Experiment>;
  getExperiments(lessonId: string): Experiment[];
  getBestExperiment(lessonId: string): Experiment | null;
  getMetrics(lessonId: string): ExperimentMetrics;
  compareAttempts(
    id1: string,
    id2: string,
  ): { a: Experiment; b: Experiment } | null;

  // Mentor
  getMentorFeedback(experiment: Experiment): Promise<MentorResponse>;

  // Reflection
  submitReflection(
    experimentId: string,
    reflection: Omit<Reflection, "timestamp">,
  ): Reflection;

  // Portfolio
  generateArtifact(params: ArtifactParams): PortfolioArtifact;
  exportArtifactJSON(artifact: PortfolioArtifact): string;
  exportArtifactHTML(artifact: PortfolioArtifact): string;

  // Analytics
  getAnalytics(): CapabilityScore;
  getTimeDistribution(lessonId: string): TimeDistribution;

  // State
  getState(): RuntimeState;
}
```

## ExperimentEngine

```typescript
class ExperimentEngine {
  create(
    lessonId: string,
    prompt: string,
    context: string | undefined,
    output: string,
  ): Experiment;
  update(id: string, updates: Partial<Experiment>): Experiment | null;
  getByLesson(lessonId: string): Experiment[];
  getById(id: string): Experiment | null;
  getBest(lessonId: string): Experiment | null;
  getMetrics(lessonId: string): ExperimentMetrics;
  score(prompt: string): number;
}
```

## ReflectionEngine

```typescript
class ReflectionEngine {
  submit(
    experimentId: string,
    reflection: Omit<Reflection, "timestamp">,
  ): Reflection;
  getByExperiment(experimentId: string): Reflection[];
  getAll(): Reflection[];
  assessDepth(reflection: Reflection): "surface" | "moderate" | "deep";
  getAverageDepth(): number;
}
```

## AIMentor

```typescript
class AIMentor {
  constructor(provider: AIProvider);
  coach(
    experiment: Experiment,
    metrics: ExperimentMetrics,
  ): Promise<MentorResponse>;
  review(
    prompt: string,
    output: string,
  ): Promise<{ score: number; feedback: string }>;
}
```

## PortfolioGenerator

```typescript
class PortfolioGenerator {
  generate(params: ArtifactParams): PortfolioArtifact;
  exportJSON(artifact: PortfolioArtifact): string;
  exportHTML(artifact: PortfolioArtifact): string;
}
```

## LearningAnalytics

```typescript
class LearningAnalytics {
  trackExperiment(lessonId: string, durationMs: number): void;
  trackReflection(lessonId: string, durationMs: number): void;
  getCapabilityScore(params: {
    experiments;
    reflections;
    artifacts;
  }): CapabilityScore;
  getTimeDistribution(lessonId: string): TimeDistribution;
}
```

## React Hooks

```typescript
// useRuntime — direct runtime access
const { runtime, startLesson, runExperiment, getMentorFeedback } = useRuntime();

// usePlayground — playground state management
const {
  prompt,
  setPrompt,
  execute,
  experiments,
  mentorFeedback,
  isRunning,
  reflection,
  submitReflection,
} = usePlayground(lessonId);
```

## React Components

```tsx
<AIPlayground
  lessonId="lesson-1"
  systemMessage="You are a helpful AI."
  title="Experiment 1"
/>
```
