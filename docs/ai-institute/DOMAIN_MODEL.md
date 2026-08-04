# Domain Model

Complete educational domain for AI Institute Content OS.

---

## Entity Overview

```
Learning Path
  └── Course
        └── Track
              └── Module
                    └── Lesson
                          └── Knowledge Package
                    └── Lab
                          └── Exercise
                    └── Prompt Challenge
                    └── Quiz
              └── Assessment
              └── Project
                    └── Capstone

People
  ├── Student
  ├── Mentor
  ├── Batch
  └── Cohort

Credentials
  ├── Certificate
  ├── Badge
  ├── Skill
  └── Competency

Portfolio
  └── Portfolio Item

Support
  ├── Resource
  ├── Dataset
  ├── Repository
  ├── AI Tool
  ├── MCP Server
  └── Rubric

Process
  ├── Prerequisite
  ├── Feedback
  ├── Reflection
  ├── Discussion
  └── Office Hours
```

---

## Core Entities

### Learning Path

**Purpose:** The complete journey from beginner to expert.

| Aspect           | Detail                                                          |
| ---------------- | --------------------------------------------------------------- |
| Responsibilities | Defines sequence of courses, tracks progress, adapts to student |
| Relationships    | Contains many Courses, has many Students                        |
| Lifecycle        | Created → Published → Active → Archived                         |
| Ownership        | Curriculum Team                                                 |
| Events           | Created, Updated, CourseAdded, CourseCompleted                  |

**Fields:**

- id, title, description
- difficulty (beginner, intermediate, advanced, expert)
- estimatedDuration
- prerequisites (list of Learning Paths)
- courses (ordered list)
- outcomes (what the student will achieve)

---

### Course

**Purpose:** A structured collection of tracks covering a domain.

| Aspect           | Detail                                                            |
| ---------------- | ----------------------------------------------------------------- |
| Responsibilities | Organizes tracks, defines completion criteria, manages enrollment |
| Relationships    | Belongs to Learning Path, contains many Tracks, has many Students |
| Lifecycle        | Draft → Review → Published → Active → Archived                    |
| Ownership        | Curriculum Team                                                   |
| Events           | Created, Updated, TrackAdded, StudentEnrolled, CourseCompleted    |

**Fields:**

- id, title, description
- difficulty
- estimatedDuration
- tracks (ordered list)
- outcomes
- enrollmentType (open, cohort, invite)
- maxStudents

---

### Track

**Purpose:** A focused area within a course (e.g., "Prompt Engineering", "Agent Architecture").

| Aspect           | Detail                                            |
| ---------------- | ------------------------------------------------- |
| Responsibilities | Groups related modules, defines skill progression |
| Relationships    | Belongs to Course, contains many Modules          |
| Lifecycle        | Draft → Review → Published → Active               |
| Ownership        | Content Authors                                   |
| Events           | Created, Updated, ModuleAdded                     |

**Fields:**

- id, title, description
- difficulty
- modules (ordered list)
- skills (list of Skills gained)
- outcomes

---

### Module

**Purpose:** A learning unit within a track (typically 1-2 weeks of content).

| Aspect           | Detail                                                        |
| ---------------- | ------------------------------------------------------------- |
| Responsibilities | Sequences lessons and labs, defines assessment criteria       |
| Relationships    | Belongs to Track, contains Lessons, Labs, Challenges, Quizzes |
| Lifecycle        | Draft → Review → Published → Active                           |
| Ownership        | Content Authors                                               |
| Events           | Created, Updated, LessonAdded, Completed                      |

**Fields:**

- id, title, description
- duration (hours)
- lessons (ordered list)
- labs (ordered list)
- challenges (list)
- quizzes (list)
- project (optional)
- prerequisites (list of Modules)
- outcomes

---

### Lesson

**Purpose:** A single learning unit with content, examples, and exercises.

| Aspect           | Detail                                                              |
| ---------------- | ------------------------------------------------------------------- |
| Responsibilities | Delivers content, checks understanding, links to Knowledge Packages |
| Relationships    | Belongs to Module, has many Knowledge Packages, links to Resources  |
| Lifecycle        | Draft → Review → Published → Active                                 |
| Ownership        | Content Authors                                                     |
| Events           | Created, Updated, Viewed, Completed                                 |

**Fields:**

- id, title, description
- objectives (list)
- prerequisites (list of Lessons)
- estimatedTime (minutes)
- difficulty
- content (structured: reading, video, interactive)
- codeExamples (list)
- knowledgePackages (list)
- repositoryReferences (list)
- mcpReferences (list)
- assessments (list)
- reflection (prompt)
- mentorNotes (for mentors)
- studentNotes (for students)
- revisionHistory (list)

---

### Knowledge Package

**Purpose:** An atomic, reusable unit of knowledge.

| Aspect           | Detail                                                                       |
| ---------------- | ---------------------------------------------------------------------------- |
| Responsibilities | Encapsulates one concept, links to related packages, versioned               |
| Relationships    | Linked by Lessons, Labs, Assessments; links to many other Knowledge Packages |
| Lifecycle        | Created → Reviewed → Published → Versioned                                   |
| Ownership        | Content Authors + Research Engine                                            |
| Events           | Created, Updated, Linked, VersionBumped                                      |

**Fields:**

- id, title, domain
- content (structured explanation)
- concepts (list)
- definitions (list)
- examples (list)
- misconceptions (list)
- exercises (list)
- links (to other Knowledge Packages)
- confidence (0-100)
- version
- sources (research references)

---

### Lab

**Purpose:** A hands-on practical exercise with validation.

| Aspect           | Detail                                                   |
| ---------------- | -------------------------------------------------------- |
| Responsibilities | Provides environment, validates completion, offers hints |
| Relationships    | Belongs to Module, has Exercises, uses Datasets          |
| Lifecycle        | Draft → Review → Published → Active                      |
| Ownership        | Content Authors + Lab Engineers                          |
| Events           | Created, Updated, Started, Completed, Failed             |

**Fields:**

- id, title, description
- instructions (step-by-step)
- objectives
- difficulty
- estimatedTime
- dataset (reference)
- starterProject (repository reference)
- validation (tests/checks)
- hints (progressive)
- rubric
- aiMentorConfig (how AI should assist)

---

### Exercise

**Purpose:** A specific task within a lab.

| Aspect           | Detail                                      |
| ---------------- | ------------------------------------------- |
| Responsibilities | Defines specific task, validates completion |
| Relationships    | Belongs to Lab                              |
| Lifecycle        | Draft → Published                           |
| Ownership        | Content Authors                             |

**Fields:**

- id, title, description
- type (code, prompt, reflection, research)
- instructions
- expectedOutput
- validation (automated check)
- hints

---

### Prompt Challenge

**Purpose:** A focused exercise in prompt engineering.

| Aspect           | Detail                                                    |
| ---------------- | --------------------------------------------------------- |
| Responsibilities | Tests prompt engineering skills, evaluates output quality |
| Relationships    | Belongs to Module, uses AI Tool                           |
| Lifecycle        | Draft → Review → Published                                |
| Ownership        | Content Authors                                           |

**Fields:**

- id, title, description
- task (what the prompt should accomplish)
- constraints (limitations)
- evaluation (criteria for quality)
- sampleSolutions (for reference)
- rubric

---

### Quiz

**Purpose:** A knowledge check for understanding verification.

| Aspect           | Detail                                           |
| ---------------- | ------------------------------------------------ |
| Responsibilities | Tests comprehension, reinforces learning         |
| Relationships    | Belongs to Module, draws from Knowledge Packages |
| Lifecycle        | Draft → Review → Published                       |
| Ownership        | Content Authors                                  |

**Fields:**

- id, title, description
- questions (list)
- timeLimit (optional)
- passingScore
- retakePolicy
- knowledgePackages (drawn from)

---

## Assessment Entities

### Assessment

**Purpose:** A comprehensive evaluation of student competency.

| Aspect           | Detail                                                |
| ---------------- | ----------------------------------------------------- |
| Responsibilities | Evaluates multiple skills, produces competency rating |
| Relationships    | Belongs to Module or Course, uses Rubrics             |
| Lifecycle        | Draft → Review → Published → Active                   |
| Ownership        | Assessment Team                                       |

**Fields:**

- id, title, description
- type (quiz, promptChallenge, codeReview, architectureReview, projectEvaluation, peerReview, reflection, portfolioReview)
- rubric
- criteria (evaluation dimensions)
- passingScore
- weight (in overall grade)

---

### Project

**Purpose:** A real-world application of learned skills.

| Aspect           | Detail                                               |
| ---------------- | ---------------------------------------------------- |
| Responsibilities | Tests integrated skills, produces portfolio artifact |
| Relationships    | Belongs to Module, produces Portfolio Item           |
| Lifecycle        | Draft → Review → Published                           |
| Ownership        | Content Authors                                      |

**Fields:**

- id, title, description
- objectives
- requirements (list)
- deliverables
- rubric
- estimatedTime
- resources (datasets, repositories, tools)
- aiMentorConfig

---

### Capstone

**Purpose:** A comprehensive final project demonstrating mastery.

| Aspect           | Detail                                                   |
| ---------------- | -------------------------------------------------------- |
| Responsibilities | Integrates all skills, produces certification evidence   |
| Relationships    | Belongs to Course or Learning Path, produces Certificate |
| Lifecycle        | Draft → Review → Published                               |
| Ownership        | Curriculum Team                                          |

**Fields:**

- id, title, description
- objectives
- requirements
- deliverables
- rubric
- estimatedTime
- resources
- mentorReview (required)
- peerReview (optional)

---

## People Entities

### Student

**Purpose:** A learner in the AI Institute.

| Aspect           | Detail                                                               |
| ---------------- | -------------------------------------------------------------------- |
| Responsibilities | Completes learning path, builds portfolio, participates in community |
| Relationships    | Enrolled in Courses, assigned to Batch, has Mentor, builds Portfolio |
| Lifecycle        | Visitor → Enrolled → Active → Completed → Contributor → Mentor       |
| Ownership        | Student themselves                                                   |

**Fields:**

- id, name, email
- enrollmentDate
- learningPath (reference)
- courses (list)
- batch (reference)
- mentor (reference)
- portfolio (reference)
- skills (list of Competencies)
- badges (list)
- certificates (list)
- progress (per course)

---

### Mentor

**Purpose:** An expert guiding students.

| Aspect           | Detail                                                    |
| ---------------- | --------------------------------------------------------- |
| Responsibilities | Guides students, reviews projects, provides career advice |
| Relationships    | Assigned to Students, belongs to Batch                    |
| Lifecycle        | Invited → Active → Senior → Lead                          |
| Ownership        | Bhavya Team                                               |

**Fields:**

- id, name, email
- expertise (list of domains)
- students (list)
- batches (list)
- availability
- officeHours
- feedback (from students)

---

### Batch

**Purpose:** A group of students learning together.

| Aspect           | Detail                                                           |
| ---------------- | ---------------------------------------------------------------- |
| Responsibilities | Creates cohort effect, schedules sessions, tracks group progress |
| Relationships    | Contains Students, has Mentors, follows Cohort                   |
| Lifecycle        | Created → Active → Completed                                     |
| Ownership        | Operations Team                                                  |

**Fields:**

- id, name
- startDate, endDate
- students (list)
- mentors (list)
- cohort (reference)
- schedule (class times)
- capacity

---

### Cohort

**Purpose:** A scheduled instance of the learning path.

| Aspect           | Detail                                          |
| ---------------- | ----------------------------------------------- |
| Responsibilities | Defines timing, coordinates curriculum delivery |
| Relationships    | Contains Batches, follows Learning Path         |
| Lifecycle        | Planned → Open → Active → Completed             |
| Ownership        | Operations Team                                 |

**Fields:**

- id, name
- learningPath (reference)
- startDate, endDate
- batches (list)
- enrollmentOpen
- capacity

---

## Credential Entities

### Certificate

**Purpose:** Formal recognition of competency completion.

| Aspect           | Detail                                             |
| ---------------- | -------------------------------------------------- |
| Responsibilities | Verifies competency, provides shareable proof      |
| Relationships    | Issued to Student, based on Capstone or Assessment |
| Lifecycle        | Pending → Issued → Verified → Expired (optional)   |
| Ownership        | Bhavya Foundation                                  |

**Fields:**

- id, title
- student (reference)
- competency (reference)
- issuedDate
- expiryDate (optional)
- verificationUrl
- evidence (what was completed)

---

### Badge

**Purpose:** Recognition of specific skills or achievements.

| Aspect           | Detail                                   |
| ---------------- | ---------------------------------------- |
| Responsibilities | Motivates, recognizes micro-achievements |
| Relationships    | Awarded to Student, linked to Skill      |
| Lifecycle        | Designed → Awarded                       |
| Ownership        | Bhavya Team                              |

**Fields:**

- id, title, description
- icon
- criteria (what earns this badge)
- skill (reference)
- rarity (common, uncommon, rare, legendary)

---

### Skill

**Purpose:** A specific capability a student can demonstrate.

| Aspect           | Detail                                          |
| ---------------- | ----------------------------------------------- |
| Responsibilities | Tracks competency level, guides learning path   |
| Relationships    | Linked to Competencies, assessed by Assessments |
| Lifecycle        | Defined → Assessed → Mastered                   |
| Ownership        | Curriculum Team                                 |

**Fields:**

- id, title, description
- domain
- level (beginner, intermediate, advanced, expert)
- prerequisites (other Skills)
- assessmentMethods (how to prove competency)

---

### Competency

**Purpose:** Evidence-based rating of a student's skill level.

| Aspect           | Detail                                     |
| ---------------- | ------------------------------------------ |
| Responsibilities | Quantifies ability, guides recommendations |
| Relationships    | Belongs to Student, linked to Skill        |
| Lifecycle        | Inferred → Assessed → Verified             |
| Ownership        | Assessment System                          |

**Fields:**

- id
- student (reference)
- skill (reference)
- level (1-10)
- evidence (assessments, projects)
- lastAssessed
- confidence (0-100)

---

## Portfolio Entity

### Portfolio

**Purpose:** A curated collection of the student's best work.

| Aspect           | Detail                                               |
| ---------------- | ---------------------------------------------------- |
| Responsibilities | Demonstrates competency, supports career advancement |
| Relationships    | Belongs to Student, contains Portfolio Items         |
| Lifecycle        | Created → Updated → Shared → Verified                |
| Ownership        | Student                                              |

**Fields:**

- id
- student (reference)
- items (list of Portfolio Items)
- visibility (private, mentors, public)
- lastUpdated

---

### Portfolio Item

**Purpose:** A specific piece of work in the portfolio.

| Aspect           | Detail                                        |
| ---------------- | --------------------------------------------- |
| Responsibilities | Showcases specific skill, provides evidence   |
| Relationships    | Belongs to Portfolio, links to Project or Lab |
| Lifecycle        | Added → Reviewed → Verified                   |
| Ownership        | Student                                       |

**Fields:**

- id, title, description
- type (project, lab, contribution, reflection)
- link (repository, URL)
- evidence (what it demonstrates)
- feedback (from mentors/peers)
- dateAdded

---

## Support Entities

### Resource

**Purpose:** A reference material for learning.

| Aspect           | Detail                                           |
| ---------------- | ------------------------------------------------ |
| Responsibilities | Provides additional context, supports self-study |
| Relationships    | Linked by Lessons and Knowledge Packages         |
| Lifecycle        | Discovered → Added → Verified                    |
| Ownership        | Content Authors                                  |

**Fields:**

- id, title, type (article, video, documentation, paper)
- url
- description
- relevance (why it's useful)
- difficulty

---

### Dataset

**Purpose:** Data used in labs and projects.

| Aspect           | Detail                               |
| ---------------- | ------------------------------------ |
| Responsibilities | Provides realistic data for practice |
| Relationships    | Used by Labs and Projects            |
| Lifecycle        | Created → Validated → Published      |
| Ownership        | Lab Engineers                        |

**Fields:**

- id, title, description
- source
- format
- size
- license
- documentation

---

### Repository

**Purpose:** A GitHub repository used in learning.

| Aspect           | Detail                                            |
| ---------------- | ------------------------------------------------- |
| Responsibilities | Provides real code context, supports contribution |
| Relationships    | Linked by Lessons, Labs, Projects                 |
| Lifecycle        | Identified → Added → Active                       |
| Ownership        | Content Authors + Open Source Community           |

**Fields:**

- id, name, url
- description
- language
- difficulty
- relevance
- contributionGuide

---

### AI Tool

**Purpose:** An AI service used in labs and learning.

| Aspect           | Detail                                          |
| ---------------- | ----------------------------------------------- |
| Responsibilities | Provides AI capabilities for learning exercises |
| Relationships    | Used by Labs, Prompt Challenges, AI Mentor      |
| Lifecycle        | Integrated → Active → Updated                   |
| Ownership        | Platform Team                                   |

**Fields:**

- id, name, type (LLM, API, service)
- provider
- capabilities
- limitations
- costModel
- apiReference

---

### MCP Server

**Purpose:** A Model Context Protocol server for AI integration.

| Aspect           | Detail                              |
| ---------------- | ----------------------------------- |
| Responsibilities | Provides structured AI interactions |
| Relationships    | Used by Labs, AI Mentor, Lessons    |
| Lifecycle        | Developed → Tested → Deployed       |
| Ownership        | Platform Team                       |

**Fields:**

- id, name, description
- capabilities
- endpoints
- documentation
- version

---

### Rubric

**Purpose:** Evaluation criteria for assessments.

| Aspect           | Detail                                                   |
| ---------------- | -------------------------------------------------------- |
| Responsibilities | Defines quality standards, ensures consistent evaluation |
| Relationships    | Used by Assessments, Projects, Labs                      |
| Lifecycle        | Draft → Review → Published                               |
| Ownership        | Assessment Team                                          |

**Fields:**

- id, title, description
- dimensions (list)
  - name
  - weight
  - criteria (what each level looks like)
  - levels (1-5 with descriptions)
- passingScore

---

## Process Entities

### Prerequisite

**Purpose:** Defines what must be completed before proceeding.

| Aspect           | Detail                                |
| ---------------- | ------------------------------------- |
| Responsibilities | Ensures proper learning sequence      |
| Relationships    | Links any learnable entity to another |
| Lifecycle        | Defined → Active                      |
| Ownership        | Curriculum Team                       |

**Fields:**

- id
- source (what requires the prerequisite)
- target (what must be completed)
- type (hard, soft)
- validation (how to check completion)

---

### Feedback

**Purpose:** Response to student work.

| Aspect           | Detail                                                |
| ---------------- | ----------------------------------------------------- |
| Responsibilities | Guides improvement, recognizes quality                |
| Relationships    | Given by Mentor/Peer to Student, linked to Assessment |
| Lifecycle        | Draft → Delivered → Acknowledged                      |
| Ownership        | Mentors, Peers, AI                                    |

**Fields:**

- id
- from (Student, Mentor, or AI)
- to (Student)
- type (assessment, project, reflection)
- content
- actionable (boolean)
- timestamp

---

### Reflection

**Purpose:** Student's self-assessment of learning.

| Aspect           | Detail                                         |
| ---------------- | ---------------------------------------------- |
| Responsibilities | Encourages metacognition, tracks understanding |
| Relationships    | Belongs to Student, linked to Lesson or Module |
| Lifecycle        | Written → Reviewed                             |
| Ownership        | Student                                        |

**Fields:**

- id
- student (reference)
- linkedTo (Lesson, Module, Project)
- prompt (what to reflect on)
- response
- timestamp
- insights (extracted themes)

---

### Discussion

**Purpose:** Community conversation about learning content.

| Aspect           | Detail                                                 |
| ---------------- | ------------------------------------------------------ |
| Responsibilities | Facilitates peer learning, surfaces questions          |
| Relationships    | Participated by Students, optionally joined by Mentors |
| Lifecycle        | Created → Active → Resolved → Archived                 |
| Ownership        | Community                                              |

**Fields:**

- id, title, content
- author (Student)
- linkedTo (Lesson, Lab, Project)
- replies (list)
- resolved (boolean)
- upvotes

---

### Office Hours

**Purpose:** Scheduled time for mentor-student interaction.

| Aspect           | Detail                                 |
| ---------------- | -------------------------------------- |
| Responsibilities | Provides direct access to experts      |
| Relationships    | Hosted by Mentor, attended by Students |
| Lifecycle        | Scheduled → Active → Completed         |
| Ownership        | Mentors                                |

**Fields:**

- id
- mentor (reference)
- scheduledTime
- duration
- attendees (list)
- topics (list)
- notes
- recording (optional)
