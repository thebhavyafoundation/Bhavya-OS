# Implementation Plan

Technical implementation details for AI Institute.

---

## Technology Stack

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js or Hono
- **Database:** PostgreSQL 16
- **ORM:** Drizzle ORM or Prisma
- **Cache:** Redis (optional)
- **Queue:** BullMQ (for async tasks)

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI:** @bhavya/platform-ui
- **State:** React hooks + context
- **Styling:** Tailwind CSS

### AI Integration

- **LLM:** Bhavya AI Platform (existing)
- **Code Analysis:** GitHub Intelligence Lab (existing)
- **Knowledge:** Content OS Knowledge Packages

### Infrastructure

- **Hosting:** Vercel (frontend) + Railway/Fly.io (backend)
- **Storage:** PostgreSQL + S3 (for media)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics + custom

---

## Database Schema

### Core Tables

```sql
-- Learning Paths
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_duration INTERVAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  learning_path_id UUID REFERENCES learning_paths(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  estimated_duration INTERVAL,
  enrollment_type TEXT DEFAULT 'open',
  max_students INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY,
  track_id UUID REFERENCES tracks(id),
  title TEXT NOT NULL,
  description TEXT,
  duration INTERVAL,
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT[],
  estimated_time INTEGER, -- minutes
  difficulty TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Packages (from Content OS)
CREATE TABLE knowledge_packages (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT,
  content JSONB,
  confidence FLOAT,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Labs
CREATE TABLE labs (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  instructions JSONB,
  validation JSONB,
  rubric JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('quiz', 'promptChallenge', 'codeReview', 'project', 'peerReview', 'reflection')),
  rubric JSONB,
  passing_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  learning_path_id UUID REFERENCES learning_paths(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Progress
CREATE TABLE student_progress (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  entity_type TEXT, -- lesson, lab, assessment, project
  entity_id UUID,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competencies
CREATE TABLE competencies (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  skill TEXT NOT NULL,
  level INTEGER CHECK (level BETWEEN 1 AND 5),
  evidence JSONB,
  last_assessed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  type TEXT CHECK (type IN ('foundation', 'specialist', 'professional', 'mentor')),
  title TEXT NOT NULL,
  competencies JSONB,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  verification_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Items
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('project', 'lab', 'contribution', 'reflection', 'certification')),
  link TEXT,
  evidence JSONB,
  feedback JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints

### Learning Paths

```
GET    /api/learning-paths           # List all
GET    /api/learning-paths/:id       # Get one
POST   /api/learning-paths           # Create
PUT    /api/learning-paths/:id       # Update
DELETE /api/learning-paths/:id       # Delete
```

### Courses

```
GET    /api/courses                  # List all
GET    /api/courses/:id              # Get one
POST   /api/courses                  # Create
PUT    /api/courses/:id              # Update
DELETE /api/courses/:id              # Delete
GET    /api/courses/:id/tracks       # List tracks
```

### Lessons

```
GET    /api/lessons                  # List all
GET    /api/lessons/:id              # Get one
POST   /api/lessons                  # Create
PUT    /api/lessons/:id              # Update
DELETE /api/lessons/:id              # Delete
GET    /api/lessons/:id/knowledge    # Get knowledge packages
```

### Labs

```
GET    /api/labs                     # List all
GET    /api/labs/:id                 # Get one
POST   /api/labs                     # Create
PUT    /api/labs/:id                 # Update
DELETE /api/labs/:id                 # Delete
POST   /api/labs/:id/validate        # Validate lab completion
```

### Students

```
GET    /api/students                 # List all
GET    /api/students/:id             # Get one
POST   /api/students                 # Enroll
GET    /api/students/:id/progress    # Get progress
GET    /api/students/:id/portfolio   # Get portfolio
GET    /api/students/:id/competencies # Get competencies
```

### Assessments

```
GET    /api/assessments              # List all
GET    /api/assessments/:id          # Get one
POST   /api/assessments              # Create
PUT    /api/assessments/:id          # Update
POST   /api/assessments/:id/submit   # Submit assessment
GET    /api/assessments/:id/results  # Get results
```

### Certificates

```
GET    /api/certificates             # List all
GET    /api/certificates/:id         # Get one
POST   /api/certificates             # Issue
GET    /api/certificates/verify/:id  # Verify
```

### Knowledge Packages

```
GET    /api/knowledge                # List all
GET    /api/knowledge/:id            # Get one
POST   /api/knowledge                # Create
PUT    /api/knowledge/:id            # Update
GET    /api/knowledge/:id/links      # Get linked packages
```

---

## Integration Points

### Bhavya AI Platform

```typescript
// AI Mentor
const aiMentor = {
  explain: (concept: string) => ai.explain(concept),
  answer: (question: string) => ai.answer(question),
  reviewCode: (code: string) => ai.reviewCode(code),
  reviewPrompt: (prompt: string) => ai.reviewPrompt(prompt),
  evaluate: (work: any, rubric: any) => ai.evaluate(work, rubric),
  hint: (context: any) => ai.generateHint(context),
};
```

### GitHub Intelligence Lab

```typescript
// Repository Analysis
const repoAnalysis = {
  analyze: (repoUrl: string) => githubIntel.analyze(repoUrl),
  detectPatterns: (repoUrl: string) => githubIntel.detectPatterns(repoUrl),
  reviewArchitecture: (repoUrl: string) =>
    githubIntel.reviewArchitecture(repoUrl),
};
```

### Content OS

```typescript
// Knowledge Packages
const knowledgeOS = {
  get: (id: string) => contentOS.getKnowledgePackage(id),
  create: (data: any) => contentOS.createKnowledgePackage(data),
  link: (id1: string, id2: string) => contentOS.linkPackages(id1, id2),
  search: (query: string) => contentOS.searchPackages(query),
};
```

---

## Development Order

1. Database schema and migrations
2. Core entity CRUD APIs
3. Knowledge Package integration
4. Learning path engine
5. Student enrollment and progress
6. Lesson viewer
7. Lab system
8. Assessment system
9. AI mentor integration
10. Portfolio system
11. Certification system
12. Community features
13. Analytics
14. Admin dashboard

---

## Testing Strategy

### Unit Tests

- Entity validation
- Business logic
- API handlers

### Integration Tests

- API endpoints
- Database operations
- External integrations

### E2E Tests

- Student enrollment flow
- Lesson completion flow
- Lab completion flow
- Assessment flow
- Certification flow

### Performance Tests

- API response times
- Database query performance
- Concurrent user handling
