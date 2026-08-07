# Curriculum Engine Design — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Overview

Design the engine capable of representing the complete curriculum hierarchy. Integrates with existing Knowledge Graph.

---

## Hierarchy

```
Institution
└── Schools
    └── Programs
        └── Specializations
            └── Courses
                └── Modules
                    └── Lessons
                        └── Labs
                        └── Projects
                    └── Assessments
                └── Research
            └── Competencies
                └── Skills
                └── Career Paths
```

---

## Entity Schema

### Institution

```typescript
interface Institution {
  id: string;
  name: string; // "Bhavya AI Institute"
  description: string;
  mission: string;
  vision: string;
  schools: School[];
  metadata: {
    founded: string;
    website: string;
    logo: string;
  };
}
```

### School

```typescript
interface School {
  id: string;
  institutionId: string;
  name: string; // "School of Artificial Intelligence"
  description: string;
  dean: string;
  programs: Program[];
  metadata: {
    established: string;
    faculty: number;
    students: number;
  };
}
```

### Program

```typescript
interface Program {
  id: string;
  schoolId: string;
  name: string; // "AI Engineering Program"
  description: string;
  duration: string; // "16 weeks"
  level: "beginner" | "intermediate" | "advanced" | "expert";
  specializations: Specialization[];
  prerequisites: string[];
  outcomes: string[];
  metadata: {
    credits: number;
    format: "self-paced" | "cohort" | "hybrid";
    certification: string;
  };
}
```

### Specialization

```typescript
interface Specialization {
  id: string;
  programId: string;
  name: string; // "Machine Learning Engineering"
  description: string;
  courses: Course[];
  competencies: Competency[];
  careerPaths: CareerPath[];
  metadata: {
    duration: string;
    difficulty: "intermediate" | "advanced" | "expert";
    industryDemand: "high" | "medium" | "low";
  };
}
```

### Course

```typescript
interface Course {
  id: string;
  specializationId: string;
  name: string; // "Introduction to Machine Learning"
  description: string;
  modules: Module[];
  assessments: Assessment[];
  prerequisites: string[];
  outcomes: string[];
  metadata: {
    duration: string;
    level: "beginner" | "intermediate" | "advanced";
    format: "theory" | "practical" | "mixed";
    estimatedHours: number;
  };
}
```

### Module

```typescript
interface Module {
  id: string;
  courseId: string;
  name: string; // "Foundations"
  description: string;
  order: number;
  lessons: Lesson[];
  labs: Lab[];
  projects: Project[];
  assessment: Assessment;
  prerequisites: string[];
  metadata: {
    duration: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    objectives: string[];
  };
}
```

### Lesson

```typescript
interface Lesson {
  id: string;
  moduleId: string;
  name: string; // "Linear Regression"
  description: string;
  order: number;
  type: "concept" | "tutorial" | "workshop" | "review";
  content: LessonContent;
  checkpoints: Checkpoint[];
  prerequisites: string[];
  metadata: {
    duration: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    objectives: string[];
    keyTakeaways: string[];
  };
}

interface LessonContent {
  sections: ContentSection[];
  codeExamples: CodeExample[];
  diagrams: Diagram[];
  references: Reference[];
}

interface ContentSection {
  id: string;
  type: "text" | "code" | "diagram" | "video" | "interactive";
  title: string;
  content: string;
  order: number;
}

interface CodeExample {
  id: string;
  language: string;
  code: string;
  explanation: string;
  runnable: boolean;
}

interface Diagram {
  id: string;
  type: "static" | "interactive" | "animation";
  data: any;
  description: string;
}

interface Reference {
  id: string;
  type: "paper" | "book" | "tutorial" | "video";
  title: string;
  url: string;
  relevance: string;
}

interface Checkpoint {
  id: string;
  lessonId: string;
  question: string;
  type: "mcq" | "code" | "reflection" | "practical";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}
```

### Lab

```typescript
interface Lab {
  id: string;
  moduleId: string;
  name: string; // "Build Your First Model"
  description: string;
  objective: string;
  problemStatement: string;
  dataset: Dataset;
  requirements: Requirement[];
  hints: Hint[];
  solution: Solution;
  tests: Test[];
  metadata: {
    duration: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    prerequisites: string[];
  };
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  format: string;
  size: string;
  columns: Column[];
}

interface Column {
  name: string;
  type: "numerical" | "categorical" | "text" | "date";
  description: string;
  nullable: boolean;
}

interface Requirement {
  id: string;
  description: string;
  type: "functional" | "performance" | "correctness";
  criteria: string;
}

interface Hint {
  id: string;
  level: 1 | 2 | 3;
  content: string;
  revealAfter: number; // attempts
}

interface Solution {
  code: string;
  explanation: string;
  alternatives: string[];
}

interface Test {
  id: string;
  description: string;
  input: any;
  expectedOutput: any;
  type: "unit" | "integration" | "e2e";
}
```

### Project

```typescript
interface Project {
  id: string;
  moduleId: string;
  name: string; // "House Price Predictor"
  description: string;
  brief: string;
  milestones: Milestone[];
  rubric: Rubric;
  submission: SubmissionGuidelines;
  metadata: {
    duration: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    teamSize: number;
    realWorld: boolean;
  };
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  week: number;
  deliverables: string[];
  criteria: string[];
}

interface Rubric {
  categories: RubricCategory[];
  passingScore: number;
}

interface RubricCategory {
  name: string;
  weight: number;
  criteria: RubricCriterion[];
}

interface RubricCriterion {
  description: string;
  levels: {
    excellent: string;
    good: string;
    satisfactory: string;
    needsImprovement: string;
  };
}

interface SubmissionGuidelines {
  format: string;
  deadline: string;
  latePolicy: string;
  plagiarismPolicy: string;
}
```

### Assessment

```typescript
interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  name: string;
  type: "quiz" | "exam" | "project" | "peer-review" | "portfolio";
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  metadata: {
    difficulty: "easy" | "medium" | "hard";
    adaptive: boolean;
    proctored: boolean;
  };
}

interface Question {
  id: string;
  type: "mcq" | "code" | "short-answer" | "reflection" | "practical";
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  concepts: string[];
}
```

### Research

```typescript
interface Research {
  id: string;
  specializationId: string;
  name: string;
  description: string;
  type: "survey" | "experiment" | "implementation" | "analysis";
  topics: string[];
  resources: Resource[];
  deliverables: Deliverable[];
  metadata: {
    duration: string;
    difficulty: "advanced" | "expert";
    mentorRequired: boolean;
  };
}

interface Resource {
  id: string;
  type: "paper" | "dataset" | "tool" | "tutorial";
  title: string;
  url: string;
  relevance: string;
}

interface Deliverable {
  id: string;
  name: string;
  description: string;
  format: string;
  criteria: string[];
}
```

### Competency

```typescript
interface Competency {
  id: string;
  specializationId: string;
  name: string; // "Machine Learning Engineering"
  description: string;
  skills: Skill[];
  level: "beginner" | "intermediate" | "advanced" | "expert";
  assessment: Assessment;
  metadata: {
    industryAligned: boolean;
    certificationEligible: boolean;
  };
}
```

### Skill

```typescript
interface Skill {
  id: string;
  competencyId: string;
  name: string; // "Linear Regression"
  description: string;
  type: "knowledge" | "skill" | "ability";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  concepts: string[]; // Knowledge graph node IDs
  assessment: Assessment;
  metadata: {
    demand: "high" | "medium" | "low";
    marketSalary: string;
  };
}
```

### Career Path

```typescript
interface CareerPath {
  id: string;
  specializationId: string;
  title: string; // "Machine Learning Engineer"
  description: string;
  salaryRange: string;
  demand: "high" | "medium" | "low";
  skills: string[]; // Skill IDs
  companies: string[];
  growthPotential: string;
  metadata: {
    entryLevel: boolean;
    remoteFriendly: boolean;
    requiredExperience: string;
  };
}
```

---

## Knowledge Graph Integration

### Concept Mapping

```typescript
// Each lesson concept maps to a knowledge graph node
interface ConceptMapping {
  lessonId: string;
  conceptId: string; // Knowledge graph node ID
  relationship: "introduces" | "builds-on" | "applies" | "extends";
  depth: "surface" | "moderate" | "deep";
}

// Example
const mappings: ConceptMapping[] = [
  {
    lessonId: "lesson-1-3",
    conceptId: "kg-linear-regression",
    relationship: "introduces",
    depth: "moderate",
  },
  {
    lessonId: "lesson-2-1",
    conceptId: "kg-linear-regression",
    relationship: "builds-on",
    depth: "deep",
  },
];
```

### Prerequisite Graph

```typescript
// Prerequisites form a directed acyclic graph (DAG)
interface Prerequisite {
  entityId: string;
  entityType: "course" | "module" | "lesson" | "lab" | "project";
  requiredId: string;
  requiredType: "course" | "module" | "lesson" | "lab" | "project";
  required: boolean; // true = must complete, false = recommended
}

// Example
const prerequisites: Prerequisite[] = [
  {
    entityId: "course-ml-101",
    entityType: "course",
    requiredId: "course-python-basics",
    requiredType: "course",
    required: true,
  },
  {
    entityId: "module-2",
    entityType: "module",
    requiredId: "module-1",
    requiredType: "module",
    required: true,
  },
];
```

### Mastery Tracking

```typescript
// Track mastery across the hierarchy
interface MasteryRecord {
  studentId: string;
  entityId: string;
  entityType:
    "lesson" | "lab" | "project" | "module" | "course" | "skill" | "competency";
  score: number; // 0-100
  level:
    "not-started" | "attempting" | "developing" | "proficient" | "mastered";
  attempts: number;
  lastAttempt: Date;
  history: MasteryEvent[];
}

interface MasteryEvent {
  date: Date;
  action: "started" | "completed" | "failed" | "reviewed";
  score: number;
  duration: number; // minutes
}
```

---

## Curriculum Engine API

### Query Operations

```typescript
// Get complete curriculum
async function getCurriculum(): Promise<Institution>;

// Get course with modules
async function getCourse(courseId: string): Promise<Course>;

// Get learning path
async function getLearningPath(
  studentId: string,
  specializationId: string,
): Promise<LearningPath>;

// Get prerequisites
async function getPrerequisites(entityId: string): Promise<Prerequisite[]>;

// Get mastery
async function getMastery(
  studentId: string,
  entityId: string,
): Promise<MasteryRecord>;

// Get recommendations
async function getRecommendations(studentId: string): Promise<Recommendation[]>;
```

### Mutation Operations

```typescript
// Enroll in course
async function enrollCourse(
  studentId: string,
  courseId: string,
): Promise<Enrollment>;

// Start lesson
async function startLesson(
  studentId: string,
  lessonId: string,
): Promise<LessonProgress>;

// Complete lesson
async function completeLesson(
  studentId: string,
  lessonId: string,
  score: number,
): Promise<MasteryRecord>;

// Submit lab
async function submitLab(
  studentId: string,
  labId: string,
  submission: LabSubmission,
): Promise<LabResult>;

// Submit project
async function submitProject(
  studentId: string,
  projectId: string,
  submission: ProjectSubmission,
): Promise<ProjectResult>;
```

---

## Data Storage

### File Structure

```
packages/
└── curriculum/
    └── src/
        ├── index.ts
        ├── engine.ts
        ├── types.ts
        ├── queries.ts
        ├── mutations.ts
        └── validators.ts

data/
└── curriculum/
    ├── institution.json
    ├── schools/
    │   ├── school-ai.json
    │   └── school-data.json
    ├── programs/
    │   ├── program-ai-engineering.json
    │   └── program-data-science.json
    ├── specializations/
    │   ├── spec-ml-engineering.json
    │   └── spec-nlp.json
    ├── courses/
    │   ├── course-ml-101.json
    │   └── course-dl-201.json
    ├── modules/
    │   ├── module-1-1.json
    │   └── module-1-2.json
    ├── lessons/
    │   ├── lesson-1-3.json
    │   └── lesson-1-4.json
    ├── labs/
    │   ├── lab-1.json
    │   └── lab-2.json
    ├── projects/
    │   ├── project-1.json
    │   └── project-2.json
    ├── assessments/
    │   ├── quiz-1-1.json
    │   └── exam-module-1.json
    ├── competencies/
    │   ├── comp-ml.json
    │   └── comp-dl.json
    ├── skills/
    │   ├── skill-linear-regression.json
    │   └── skill-gradient-descent.json
    └── career-paths/
        ├── path-ml-engineer.json
        └── path-data-scientist.json
```

### Migration from Existing

```typescript
// Map existing knowledge graph to curriculum
function migrateKnowledgeGraph(kg: KnowledgeGraph): Curriculum {
  return {
    institution: createInstitution(),
    schools: createSchools(kg),
    programs: createPrograms(kg),
    specializations: createSpecializations(kg),
    courses: createCourses(kg),
    modules: createModules(kg),
    lessons: createLessons(kg),
    labs: createLabs(kg),
    projects: createProjects(kg),
    assessments: createAssessments(kg),
    competencies: createCompetencies(kg),
    skills: createSkills(kg),
    careerPaths: createCareerPaths(kg),
  };
}
```

---

## Validation Rules

### Hierarchy Integrity

```typescript
// Every entity must have a valid parent
function validateHierarchy(curriculum: Curriculum): ValidationError[] {
  const errors: ValidationError[] = [];

  // Schools must belong to institution
  for (const school of curriculum.schools) {
    if (school.institutionId !== curriculum.institution.id) {
      errors.push({
        type: "invalid-parent",
        entity: school.id,
        message: "School does not belong to institution",
      });
    }
  }

  // Programs must belong to school
  for (const program of curriculum.programs) {
    const school = curriculum.schools.find((s) => s.id === program.schoolId);
    if (!school) {
      errors.push({
        type: "invalid-parent",
        entity: program.id,
        message: "Program does not belong to any school",
      });
    }
  }

  // Continue for all entity types...
  return errors;
}
```

### Prerequisite Integrity

```typescript
// No circular dependencies
function validatePrerequisites(curriculum: Curriculum): ValidationError[] {
  const errors: ValidationError[] = [];
  const graph = buildPrerequisiteGraph(curriculum);

  if (hasCycle(graph)) {
    errors.push({
      type: "circular-dependency",
      entity: findCycle(graph),
      message: "Circular prerequisite detected",
    });
  }

  return errors;
}
```

### Completeness

```typescript
// Every course must have at least one module
function validateCompleteness(curriculum: Curriculum): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const course of curriculum.courses) {
    const modules = curriculum.modules.filter((m) => m.courseId === course.id);
    if (modules.length === 0) {
      errors.push({
        type: "incomplete",
        entity: course.id,
        message: "Course has no modules",
      });
    }
  }

  // Continue for all entity types...
  return errors;
}
```

---

## Implementation Checklist

- [ ] Create curriculum package (`packages/curriculum/`)
- [ ] Define TypeScript types
- [ ] Implement curriculum engine
- [ ] Implement query operations
- [ ] Implement mutation operations
- [ ] Implement validators
- [ ] Create initial curriculum data
- [ ] Migrate from knowledge graph
- [ ] Add API endpoints
- [ ] Add UI components
- [ ] Test hierarchy integrity
- [ ] Test prerequisite integrity
- [ ] Test completeness

---

_The curriculum engine represents the complete educational hierarchy. Every entity is typed, validated, and connected._
