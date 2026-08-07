# Community Model — AI Institute v1.0

**Date:** 2026-08-04
**Scope:** First version of community features

---

## Design Principles

1. **Not a social network** — Community serves learning, not engagement
2. **Support only** — Discussion, mentor access, peer feedback, showcase
3. **Everything else waits** — No feeds, no profiles, no messaging

---

## Community Features

### 1. Discussion Per Lesson

**Purpose:** Enable students to discuss lesson content

**Features:**

- Threaded discussion per lesson
- Ask questions about content
- Share insights and connections
- Upvote helpful responses

**Moderation:**

- AI-powered first-pass moderation
- Human review for flagged content
- Community guidelines enforced

**Integration:**

- Linked from lesson "Reflect" tab
- visible on dashboard
- Notifications for replies

### 2. Ask Mentor

**Purpose:** Enable students to get help from AI and human mentors

**Features:**

- AI mentor responds instantly
- Human mentor reviews periodically
- Questions are archived for reference
- Best answers are highlighted

**Flow:**

1. Student asks question
2. AI mentor responds immediately
3. Human mentor reviews when available
4. Response is archived and searchable

**Integration:**

- Available on all pages
- Linked from lesson, lab, project
- Dashboard shows mentor activity

### 3. Share Project

**Purpose:** Enable students to showcase their work

**Features:**

- Project gallery
- Live demos (when projects are executable)
- Student descriptions
- Peer feedback

**Requirements:**

- Project must be deployed
- Project must have README
- Student must provide description

**Integration:**

- Accessible from dashboard
- Featured on landing page
- Portfolio generation

### 4. Peer Feedback

**Purpose:** Enable students to give and receive feedback

**Features:**

- Structured feedback forms
- Rubric-based evaluation
- Constructive criticism guidelines
- Feedback reputation system

**Flow:**

1. Student submits project for peer review
2. Assigned to 3 peers
3. Each peer provides structured feedback
4. Student receives aggregated feedback

**Integration:**

- Part of project submission
- Dashboard shows feedback activity
- Portfolio includes peer reviews

### 5. Weekly Showcase

**Purpose:** Celebrate student achievements

**Features:**

- Weekly email digest
- Featured projects
- Student spotlights
- Mentor highlights

**Content:**

- Top projects of the week
- Student success stories
- Mentor Q&A highlights
- Community milestones

**Integration:**

- Email notification
- Dashboard showcase
- Landing page updates

---

## Community Architecture

### Technical Requirements

1. **Discussion System**
   - Threaded comments
   - Upvoting/downvoting
   - Search functionality
   - Moderation tools

2. **Mentor System**
   - AI mentor integration
   - Human mentor dashboard
   - Question routing
   - Response tracking

3. **Project Gallery**
   - Project metadata
   - Live demo embedding
   - Screenshot generation
   - Deployment integration

4. **Feedback System**
   - Structured forms
   - Rubric management
   - Aggregation logic
   - Reputation tracking

5. **Showcase System**
   - Email generation
   - Content curation
   - Analytics tracking
   - Scheduling

### Data Model

```
Discussion
├── id
├── lessonId
├── authorId
├── content
├── parentId (for threading)
├── upvotes
├── createdAt
└── updatedAt

MentorQuestion
├── id
├── authorId
├── question
├── aiResponse
├── humanResponse
├── status (pending/reviewed/answered)
├── createdAt
└── updatedAt

ProjectShare
├── id
├── projectId
├── authorId
├── description
├── demoUrl
├── screenshotUrl
├── feedbackCount
├── createdAt
└── updatedAt

PeerFeedback
├── id
├── projectId
├── authorId
├── rubricScores
├── comments
├── createdAt
└── updatedAt
```

---

## Community Guidelines

### Be Respectful

- Treat others with respect
- No harassment or discrimination
- Constructive criticism only

### Be Helpful

- Answer questions when you can
- Share resources and insights
- Celebrate others' successes

### Be Honest

- Give honest feedback
- Acknowledge mistakes
- Share real experiences

### Be Safe

- Don't share personal information
- Don't promote harmful content
- Report issues to moderators

---

## Moderation Strategy

### AI Moderation

- Automated content filtering
- Spam detection
- Off-topic detection
- Sentiment analysis

### Human Moderation

- Mentor oversight
- Community reporting
- Escalation process
- Appeal process

### Community Moderation

- Upvoting/downvoting
- Flagging system
- Community guidelines
- Reputation system

---

## Rollout Plan

### Phase 1: Discussion Per Lesson

- Add discussion to each lesson
- Basic threading
- AI moderation
- No mentor integration

### Phase 2: Ask Mentor

- Add AI mentor integration
- Human mentor dashboard
- Question routing
- Response tracking

### Phase 3: Share Project

- Add project gallery
- Live demo embedding
- Screenshot generation
- Basic feedback

### Phase 4: Peer Feedback

- Add structured feedback forms
- Rubric management
- Aggregation logic
- Reputation tracking

### Phase 5: Weekly Showcase

- Add email generation
- Content curation
- Analytics tracking
- Scheduling

---

## Success Metrics

### Engagement

- Discussion posts per lesson
- Mentor questions per week
- Project shares per week
- Peer feedback exchanges

### Quality

- Helpful response rate
- Mentor satisfaction
- Peer feedback quality
- Showcase engagement

### Community

- Active participants
- Return rate
- Referral rate
- Community health score

---

## Verdict

**Current State:** No community features
**Target State:** Support-only community for learning
**Gap:** Significant — requires full community architecture

**Recommendation:** Start with discussion per lesson, add features incrementally.
