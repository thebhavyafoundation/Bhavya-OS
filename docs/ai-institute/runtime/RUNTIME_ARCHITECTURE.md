# AI Learning Runtime — Architecture

The runtime is a reusable subsystem that powers every lesson, lab, project, and AI interaction.

## Structure

```
packages/learning-runtime/src/
├── types/           Core interfaces
├── providers/       AI provider implementations (mock, future: openai, anthropic)
├── experiments/     Experiment engine (attempt tracking, scoring)
├── reflection/      Reflection engine (structured prompts, quality assessment)
├── mentor/          AI mentor (Socratic coaching, review)
├── portfolio/       Portfolio generator (artifacts, export)
├── analytics/       Learning analytics (capability scoring, time distribution)
├── runtime/         Main orchestrator (LearningRuntime class)
├── components/      React components (AIPlayground)
└── hooks/           React hooks (useRuntime, usePlayground)
```

## Data Flow

```
Lesson calls runtime.startLesson(lessonId)
    ↓
Student writes prompt in AIPlayground
    ↓
runtime.runExperiment(prompt, context)
    ↓
Provider returns output
    ↓
Experiment stored with attempt history
    ↓
runtime.getMentorFeedback(experiment)
    ↓
Mentor returns coaching response
    ↓
Student reflects on experiment
    ↓
runtime.submitReflection(experimentId, reflection)
    ↓
Student iterates (repeats above)
    ↓
runtime.generateArtifact(...)
    ↓
Portfolio artifact created
    ↓
runtime.getAnalytics()
    ↓
Capability score updated
```

## Usage in Lessons

```tsx
import { usePlayground } from "@bhavya/learning-runtime";

function MyLesson() {
  const { prompt, setPrompt, execute, experiments, mentorFeedback } =
    usePlayground("lesson-1");

  return (
    <AIPlayground lessonId="lesson-1" systemMessage="You are a helpful AI." />
  );
}
```

## Provider Interface

Swap AI providers without changing lesson code:

```typescript
import { LearningRuntime, MockProvider } from "@bhavya/learning-runtime";

// Slice 2: Mock
const runtime = new LearningRuntime(new MockProvider());

// Slice 3: Real AI
// const runtime = new LearningRuntime(new OpenAIProvider({ apiKey: "..." }));
```
