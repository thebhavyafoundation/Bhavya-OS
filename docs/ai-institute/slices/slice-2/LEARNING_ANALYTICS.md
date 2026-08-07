# Learning Analytics — Capability Tracking

**Date:** 2026-08-04
**Purpose:** Track demonstrated capability, not content consumption

---

## What Gets Tracked

### Learning Metrics (What Matters)

| Metric                      | Definition                           | Why It Matters        |
| --------------------------- | ------------------------------------ | --------------------- |
| Experiments completed       | Total experiments across all lessons | Shows active learning |
| Iterations per experiment   | Average attempts per experiment      | Shows persistence     |
| Reflection quality          | Depth and specificity of reflections | Shows metacognition   |
| Prompt improvement          | % improvement over attempts          | Shows learning        |
| Portfolio artifacts         | Number of artifacts created          | Shows creation        |
| Time creating vs. consuming | Ratio of active to passive time      | Shows engagement type |

### Does Not Track (What Doesn't Matter)

| Metric             | Why It Doesn't Matter        |
| ------------------ | ---------------------------- |
| Time spent reading | Reading is not learning      |
| Video watch time   | Watching is not learning     |
| Login frequency    | Login is not learning        |
| Content completion | Completion is not capability |
| Quiz scores        | Recall is not skill          |

---

## Capability Score

```typescript
interface CapabilityScore {
  // Active learning
  experimentsCompleted: number;
  totalIterations: number;
  averageIterations: number;

  // Quality
  reflectionDepth: number; // 0-100
  promptImprovement: number; // % improvement

  // Creation
  portfolioArtifacts: number;
  skillsDemonstrated: string[];

  // Engagement
  timeCreating: number; // minutes
  timeConsuming: number; // minutes
  creationRatio: number; // % time creating

  // Overall
  overallScore: number; // 0-100
  trend: "improving" | "stable" | "declining";
}
```

---

## Score Calculation

### Experiments Score (0-30)

```
experimentsCompleted * 2 points each
Max: 30 points (15 experiments)
```

### Iterations Score (0-20)

```
averageIterations * 5 points each
Max: 20 points (4 iterations per experiment)
```

### Reflection Score (0-20)

```
reflectionDepth * 0.2 points per quality level
Max: 20 points (deep reflections)
```

### Improvement Score (0-15)

```
promptImprovement * 0.15 points per % improvement
Max: 15 points (100% improvement)
```

### Portfolio Score (0-15)

```
portfolioArtifacts * 3 points each
Max: 15 points (5 artifacts)
```

### Overall Score

```
experimentsScore + iterationsScore + reflectionScore + improvementScore + portfolioScore
Max: 100 points
```

---

## Time Distribution Tracking

```typescript
interface TimeDistribution {
  // Active time (good)
  experimenting: number; // minutes in AI Playground
  reflecting: number; // minutes in Reflection
  building: number; // minutes in Mini Project
  iterating: number; // minutes improving work

  // Passive time (less good)
  reading: number; // minutes reading content
  watching: number; // minutes watching videos

  // Calculated
  totalActive: number; // experimenting + reflecting + building + iterating
  totalPassive: number; // reading + watching
  creationRatio: number; // totalActive / (totalActive + totalPassive)
}
```

**Target:** 70% creation ratio

---

## Dashboard Display

```
┌─────────────────────────────────────────────────────────────┐
│ Learning Analytics                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Capability Score: 72/100                    Trend: ↑        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Experiments: 12 completed                              │ │
│ │ ████████████████████░░░░░░░░░░ 60%                     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Iterations: 3.2 per experiment                         │ │
│ │ ████████████████████████████░░ 80%                     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Reflections: Deep                                     │ │
│ │ ██████████████████████████░░░░ 75%                     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Improvement: +85% from first attempt                   │ │
│ │ ████████████████████████████░░ 85%                     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Portfolio: 4 artifacts created                         │ │
│ │ ██████████████████████░░░░░░░░ 55%                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Time Distribution                                           │
│ Creating: 72% | Consuming: 28%                              │
│ ████████████████████████████░░░░ 72% creation              │
│                                                             │
│ Skills Demonstrated                                         │
│ • Prompt Engineering (3 artifacts)                          │
│ • Audience Awareness (2 artifacts)                          │
│ • Iterative Improvement (4 artifacts)                       │
│ • AI Interaction (5 artifacts)                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Improvement Tracking

```typescript
interface ImprovementMetrics {
  // Per experiment
  firstAttemptScore: number;
  bestAttemptScore: number;
  improvementRate: number; // % improvement

  // Over time
  weeklyImprovement: number; // % improvement per week
  monthlyImprovement: number; // % improvement per month

  // Trend
  trend: "improving" | "stable" | "declining";
  trendData: TrendPoint[];
}

interface TrendPoint {
  date: Date;
  score: number;
  experiments: number;
}
```

---

## Analytics Display

### Capability Overview

```
Capability Score: 72/100
Trend: Improving (+15% this week)

Top Skills:
1. Prompt Engineering (85/100)
2. Iterative Improvement (78/100)
3. AI Interaction (75/100)
4. Reflection (70/100)
5. Portfolio Creation (65/100)
```

### Improvement Over Time

```
Week 1: 45/100 (10 experiments, 2.1 iterations avg)
Week 2: 58/100 (15 experiments, 2.8 iterations avg)
Week 3: 72/100 (22 experiments, 3.2 iterations avg)

Improvement: +60% in 3 weeks
```

### Time Distribution

```
This Week:
Creating: 72% (18 hours)
Consuming: 28% (7 hours)

Target: 70% creation
Status: On track
```

---

## Learning Streaks

```typescript
interface LearningStreak {
  currentStreak: number; // days
  longestStreak: number; // days
  streakDefinition: string; // what counts as a "day"
}
```

**Streak Definition:** A day counts if the student:

1. Completes at least 1 experiment, OR
2. Writes at least 1 reflection, OR
3. Creates at least 1 artifact

**Not:** Login, time spent, content completion

---

## Integration with Runtime

### Data Collection

```typescript
// Experiment Engine
experimentEngine.onExperimentComplete((experiment) => {
  analytics.trackExperiment(experiment);
});

// Reflection System
reflectionSystem.onReflectionSubmitted((reflection) => {
  analytics.trackReflection(reflection);
});

// Portfolio Generator
portfolioGenerator.onArtifactCreated((artifact) => {
  analytics.trackArtifact(artifact);
});
```

### Data Storage

```typescript
// localStorage (Slice 2)
interface AnalyticsStorage {
  capabilityScore: CapabilityScore;
  timeDistribution: TimeDistribution;
  improvement: ImprovementMetrics;
  streak: LearningStreak;
}

// Backend API (Slice 3+)
interface AnalyticsAPI {
  getCapabilityScore(studentId: string): Promise<CapabilityScore>;
  getTimeDistribution(studentId: string): Promise<TimeDistribution>;
  getImprovement(studentId: string): Promise<ImprovementMetrics>;
  getStreak(studentId: string): Promise<LearningStreak>;
}
```

---

## Privacy

### What's Tracked

- Experiments, reflections, artifacts (student work)
- Time spent (aggregate, not granular)
- Scores (capability, not personal)

### What's Not Tracked

- Personal information
- Browsing history
- Location
- Device information
- External activity

### Student Control

- Students can view all their data
- Students can export all their data
- Students can delete all their data
- Students control sharing

---

## Success Criteria

The Learning Analytics system is complete when:

1. ✅ Tracks experiments, iterations, reflections
2. ✅ Calculates capability score
3. ✅ Shows improvement over time
4. ✅ Displays time distribution
5. ✅ Tracks learning streaks
6. ✅ Does not track content consumption
7. ✅ Respects student privacy
8. ✅ Design system is preserved
9. ✅ Build passes
