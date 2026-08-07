# Mentor Knowledge Specification

**Version:** 1.0 | **Status:** Complete | **Last Updated:** 2026-08-07

---

## Executive Summary

The AI Mentor's academic brain. It must know curriculum, competencies, misconceptions, prerequisite gaps, learning psychology, recommended projects, research pathways, interview preparation, and portfolio guidance.

No generic responses. Only curriculum-aware guidance.

---

## Knowledge Domains

### 1. Curriculum Knowledge

#### 1.1 Structure

```typescript
interface CurriculumKnowledge {
  institutions: Institution[];
  schools: School[];
  programs: Program[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  labs: Lab[];
  projects: Project[];
  assessments: Assessment[];
  competencies: Competency[];
  skills: Skill[];
  careerPaths: CareerPath[];
}
```

#### 1.2 Query Capabilities

| Query             | Example                                  | Response                                |
| ----------------- | ---------------------------------------- | --------------------------------------- |
| Get course        | "What is ML Fundamentals?"               | Course details, prerequisites, outcomes |
| Get prerequisites | "What do I need for Deep Learning?"      | Linear Algebra, Python, ML Fundamentals |
| Get learning path | "How do I become an ML Engineer?"        | Recommended courses, sequence           |
| Get competencies  | "What skills does an LLM Engineer need?" | Competency list with levels             |
| Get career path   | "What jobs can I get with these skills?" | Matching career paths                   |

#### 1.3 Curriculum Navigation

```
Student asks about topic
    ↓
Identify concept in knowledge graph
    ↓
Find course containing concept
    ↓
Check prerequisites
    ↓
Provide learning path
    ↓
Suggest related concepts
```

### 2. Competency Knowledge

#### 2.1 Competency Levels

| Level        | Description         | Indicators                                   |
| ------------ | ------------------- | -------------------------------------------- |
| Beginner     | Basic understanding | Can explain concepts, simple implementations |
| Intermediate | Working knowledge   | Can build projects, solve common problems    |
| Advanced     | Deep expertise      | Can optimize, architect, mentor others       |
| Expert       | Industry leader     | Can innovate, publish, lead teams            |

#### 2.2 Competency Assessment

```typescript
interface CompetencyAssessment {
  competencyId: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  evidence: Evidence[];
  gaps: string[];
  recommendations: string[];
}

interface Evidence {
  type: "quiz" | "lab" | "project" | "capstone" | "research";
  score: number;
  date: Date;
  details: string;
}
```

#### 2.3 Competency Gaps

```typescript
interface CompetencyGap {
  competencyId: string;
  currentLevel: string;
  targetLevel: string;
  gap: number;
  courses: Course[];
  projects: Project[];
  timeline: string;
}
```

### 3. Misconception Knowledge

#### 3.1 Common Misconceptions

| Concept            | Misconception                  | Correction                                    |
| ------------------ | ------------------------------ | --------------------------------------------- |
| Gradient Descent   | It always finds global minimum | It finds local minimum; learning rate matters |
| Overfitting        | More parameters = better       | Overfitting risk increases with parameters    |
| Bias-Variance      | Can eliminate both             | Tradeoff exists                               |
| Deep Learning      | Always better than ML          | Depends on data and problem                   |
| Transformers       | Attention is all you need      | Still need positional encoding                |
| LLMs               | They understand                | They predict next token                       |
| Agents             | They reason                    | They follow patterns                          |
| Fine-tuning        | Always improves performance    | Can degrade if done poorly                    |
| RAG                | Eliminates hallucinations      | Reduces but doesn't eliminate                 |
| Prompt Engineering | One prompt works for all       | Different models need different prompts       |

#### 3.2 Misconception Detection

```typescript
interface MisconceptionDetector {
  detect(studentResponse: string): DetectedMisconception[];
  explain(misconception: string): Explanation;
  suggest(misconception: string): Suggestion[];
}

interface DetectedMisconception {
  type: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  explanation: string;
  correction: string;
}
```

#### 3.3 Misconception Patterns

| Pattern             | Detection                                | Response                   |
| ------------------- | ---------------------------------------- | -------------------------- |
| Overgeneralization  | "All neural networks..."                 | Provide exceptions         |
| Undergeneralization | "This only works for..."                 | Show broader applicability |
| Confusion           | "What's the difference between X and Y?" | Compare and contrast       |
| Misapplication      | "I'll use deep learning for..."          | Evaluate appropriateness   |
| Simplification      | "It's just..."                           | Provide full picture       |

### 4. Prerequisite Gap Knowledge

#### 4.1 Gap Detection

```typescript
interface PrerequisiteGapDetector {
  detect(studentId: string, targetConcept: string): Gap[];
  suggestRemediation(gap: Gap): Remediation[];
}

interface Gap {
  concept: string;
  required: boolean;
  currentMastery: number;
  requiredMastery: number;
  gap: number;
  courses: Course[];
}
```

#### 4.2 Gap Remediation

| Gap             | Remediation | Timeline |
| --------------- | ----------- | -------- |
| Linear Algebra  | Course 102  | 3 weeks  |
| Calculus        | Course 103  | 2 weeks  |
| Python          | Course 101  | 4 weeks  |
| ML Fundamentals | Course 201  | 6 weeks  |
| Deep Learning   | Course 301  | 5 weeks  |

### 5. Learning Psychology Knowledge

#### 5.1 Learning Principles

| Principle               | Application                            |
| ----------------------- | -------------------------------------- |
| Active Recall           | Checkpoint quizzes after every concept |
| Spaced Repetition       | Review schedule system                 |
| Mastery Learning        | Mastery levels and progression         |
| Flow State              | Adaptive difficulty                    |
| Progressive Disclosure  | Expandable sections                    |
| Visual Learning         | Interactive diagrams                   |
| Project-Based           | Real-world projects                    |
| Adaptive Difficulty     | Performance-based adjustment           |
| Knowledge Reinforcement | Regular review system                  |

#### 5.2 Learning Style Adaptation

```typescript
interface LearningStyleAdapter {
  detectStyle(studentId: string): LearningStyle;
  adaptContent(style: LearningStyle, content: Content): AdaptedContent;
}

interface LearningStyle {
  visual: number; // 0-1
  auditory: number; // 0-1
  reading: number; // 0-1
  kinesthetic: number; // 0-1
}
```

#### 5.3 Cognitive Load Management

| Load Type  | Management Strategy                                   |
| ---------- | ----------------------------------------------------- |
| Intrinsic  | Chunking, sequencing, prerequisites                   |
| Extraneous | Minimal UI, consistent layout, progressive disclosure |
| Germane    | Active learning, visualization, connection-making     |

### 6. Project Recommendation Knowledge

#### 6.1 Project Matching

```typescript
interface ProjectMatcher {
  match(studentId: string, competency: string): Project[];
  matchAll(studentId: string): Project[];
  matchDifficulty(studentId: string, difficulty: string): Project[];
}

interface ProjectRecommendation {
  project: Project;
  relevance: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  skills: string[];
  careerRelevance: string;
}
```

#### 6.2 Project Categories

| Category       | Purpose                  | Examples                     |
| -------------- | ------------------------ | ---------------------------- |
| Skill Building | Practice specific skills | Coding exercises, algorithms |
| Portfolio      | Demonstrate ability      | End-to-end projects          |
| Career         | Job preparation          | Interview projects           |
| Research       | Original contribution    | Papers, open source          |
| Capstone       | Mastery demonstration    | Major projects               |

### 7. Research Pathway Knowledge

#### 7.1 Research Paths

```typescript
interface ResearchPath {
  topic: string;
  papers: Paper[];
  datasets: Dataset[];
  implementations: Implementation[];
  benchmarks: Benchmark[];
  openQuestions: string[];
}

interface Paper {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  impact: "foundational" | "high" | "medium" | "low";
  url: string;
}
```

#### 7.2 Research Guidance

| Stage             | Guidance                          |
| ----------------- | --------------------------------- |
| Topic Selection   | Identify gaps in current research |
| Literature Review | Systematic search and analysis    |
| Experiment Design | Rigorous methodology              |
| Implementation    | Reproducible code                 |
| Evaluation        | Comprehensive metrics             |
| Writing           | Clear communication               |
| Submission        | Venue selection                   |

### 8. Interview Preparation Knowledge

#### 8.1 Interview Types

| Type             | Focus                | Preparation                |
| ---------------- | -------------------- | -------------------------- |
| Technical        | Coding, algorithms   | LeetCode, system design    |
| ML System Design | Architecture         | ML system design patterns  |
| Behavioral       | Soft skills          | STAR method, stories       |
| Research         | Papers, methodology  | Paper discussion, critique |
| Portfolio        | Projects, experience | Demo preparation           |

#### 8.2 Interview Questions

| Category      | Sample Questions                     |
| ------------- | ------------------------------------ |
| ML Basics     | Explain bias-variance tradeoff       |
| Deep Learning | How does backpropagation work?       |
| LLMs          | Explain attention mechanism          |
| Agents        | How would you design a coding agent? |
| MLOps         | Describe your ML pipeline            |
| System Design | Design a recommendation system       |

### 9. Portfolio Guidance Knowledge

#### 9.1 Portfolio Structure

```
Portfolio
├── Projects
│   ├── Skill Building (3-5)
│   ├── Portfolio Projects (3-5)
│   ├── Capstone (1-2)
│   └── Research (0-2)
├── Open Source
│   ├── Contributions (5-10)
│   └── Maintained Projects (1-2)
├── Blog Posts (5-10)
├── Presentations (2-5)
└── Recommendations (3-5)
```

#### 9.2 Portfolio Quality Criteria

| Criterion | Description                      | Target               |
| --------- | -------------------------------- | -------------------- |
| Breadth   | Multiple domains                 | 3+ domains           |
| Depth     | At least one deep specialization | Expert level         |
| Quality   | Production-grade work            | Deployed, tested     |
| Impact    | Real-world use                   | Users, contributions |
| Growth    | Progression over time            | Visible improvement  |

---

## Knowledge Retrieval

### 1.1 Query Processing

```typescript
interface QueryProcessor {
  parse(query: string): ParsedQuery;
  retrieve(parsed: ParsedQuery): Knowledge[];
  synthesize(knowledge: Knowledge[]): Response;
}

interface ParsedQuery {
  intent: "learn" | "practice" | "understand" | "apply" | "review";
  topic: string;
  context: {
    currentLesson?: string;
    currentModule?: string;
    currentCourse?: string;
    masteryLevel?: string;
    learningStyle?: string;
  };
}
```

### 1.2 Response Generation

```typescript
interface ResponseGenerator {
  generate(knowledge: Knowledge[], context: Context): Response;
  adapt(response: Response, style: LearningStyle): AdaptedResponse;
  validate(response: Response): ValidatedResponse;
}

interface Response {
  content: string;
  type: "explanation" | "example" | "exercise" | "suggestion";
  sources: Source[];
  confidence: number;
  followUp: string[];
}
```

### 1.3 Context Awareness

| Context         | Usage                                  |
| --------------- | -------------------------------------- |
| Current lesson  | Answer questions about current content |
| Mastery level   | Adjust difficulty and depth            |
| Learning style  | Adapt presentation                     |
| Recent activity | Reference recent work                  |
| Weaknesses      | Target weak areas                      |
| Strengths       | Build on strengths                     |
| Goals           | Align with career goals                |

---

## Knowledge Update

### 1.1 Update Sources

| Source             | Update Type           | Frequency    |
| ------------------ | --------------------- | ------------ |
| Curriculum changes | Structure updates     | When changed |
| New papers         | Research updates      | Weekly       |
| Student feedback   | Misconception updates | Continuous   |
| Industry trends    | Competency updates    | Monthly      |
| New projects       | Project updates       | When created |

### 1.2 Update Process

```
New knowledge arrives
    ↓
Validate source
    ↓
Classify knowledge type
    ↓
Check for conflicts
    ↓
Merge with existing knowledge
    ↓
Update knowledge graph
    ↓
Test knowledge retrieval
    ↓
Deploy to production
```

---

## Knowledge Quality

### 1.1 Quality Metrics

| Metric       | Target        | Measurement        |
| ------------ | ------------- | ------------------ |
| Accuracy     | > 95%         | Expert review      |
| Completeness | > 90%         | Coverage analysis  |
| Relevance    | > 85%         | Student feedback   |
| Currency     | < 30 days old | Update frequency   |
| Consistency  | > 95%         | Conflict detection |

### 1.2 Quality Assurance

1. **Expert Review** — Faculty review of knowledge
2. **Student Feedback** — Effectiveness measurement
3. **Automated Testing** — Retrieval accuracy
4. **Conflict Detection** — Consistency checking
5. **Currency Check** — Outdated content detection

---

_The AI Mentor's knowledge is the curriculum itself. No generic responses. Only curriculum-aware guidance._
