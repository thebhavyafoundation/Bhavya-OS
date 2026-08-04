# AI Institute — Product Requirements Document

## Overview

AI Institute is a learning platform that transforms curious individuals into capable AI builders, open source contributors, and future teachers. It consumes the Content OS rather than embedding content logic.

---

## Users

### Primary: Student

- Wants to learn AI but doesn't know where to start
- Needs structured path from zero to competent
- Wants to build real things, not just watch videos
- Needs proof of skills for career advancement

### Secondary: Mentor

- Expert guiding students through the curriculum
- Needs visibility into student progress
- Needs tools for feedback and assessment
- Wants to contribute to curriculum improvement

### Tertiary: Bhavya Team

- Needs to manage curriculum and content
- Needs analytics on student outcomes
- Needs to maintain quality standards
- Needs to iterate based on data

---

## Core Capabilities

### 1. Learning Path System

- AI Readiness Assessment
- Personalized roadmap generation
- Adaptive difficulty based on progress
- Prerequisite validation

### 2. Content Delivery

- Lessons with multiple formats (text, video, interactive)
- Knowledge Packages as atomic units
- Progressive disclosure
- Offline support

### 3. Lab System

- Environment provisioning
- Starter projects
- Validation engine
- AI-powered hints
- Rubric-based evaluation

### 4. Assessment System

- Knowledge quizzes
- Prompt challenges
- Code reviews
- Architecture reviews
- Project evaluations
- Peer reviews
- Portfolio reviews
- Certification exams

### 5. AI Mentor

- Explain concepts
- Answer questions
- Review code
- Review prompts
- Recommend resources
- Generate hints
- Evaluate projects
- Suggest improvements
- Encourage reflection

### 6. Progress Tracking

- Skill competency tracking
- Portfolio building
- Badge and certification management
- Learning analytics

### 7. Community

- Discussion forums
- Peer learning groups
- Study groups
- Office hours scheduling
- Mentor matching

### 8. Content Management

- Curriculum authoring
- Version control
- Review workflows
- Publication pipeline
- Feedback collection

---

## Technical Requirements

### Content OS Integration

- All content stored in Content OS
- All progress tracked in Content OS
- All assessments evaluated through Content OS
- All certifications issued through Content OS

### Platform Integration

- Uses `@bhavya/platform-ui` exclusively
- Uses Bhavya OS authentication
- Uses GitHub Intelligence Lab for repository-based learning
- Uses Knowledge Studio for content creation

### Performance

- Page load < 2s
- Lab provisioning < 30s
- AI response < 5s
- Offline support for lessons

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

---

## Success Metrics

| Metric                 | Target | Timeframe |
| ---------------------- | ------ | --------- |
| Student enrollment     | 100    | 3 months  |
| Course completion rate | 60%    | 6 months  |
| Lab completion rate    | 70%    | 6 months  |
| Assessment pass rate   | 75%    | 6 months  |
| Student satisfaction   | 4.5/5  | 6 months  |
| Mentor satisfaction    | 4.5/5  | 6 months  |
| Portfolio completion   | 80%    | 9 months  |
| Certification rate     | 50%    | 12 months |
| Contributor conversion | 20%    | 12 months |
| Mentor conversion      | 10%    | 12 months |

---

## Constraints

1. No separate AI subsystem — reuse existing AI platform
2. No content duplication — everything through Content OS
3. No feature creep — follow BEE 2.0 protocol
4. No UI until Content OS architecture is complete
5. Research-backed every decision

---

## Timeline

### Phase 1: Content OS Architecture (Weeks 1-4)

- Domain model
- Content model
- Learning philosophy
- Curriculum architecture

### Phase 2: Content OS Foundation (Weeks 5-8)

- Core entities
- API design
- Storage layer
- Integration layer

### Phase 3: AI Institute MVP (Weeks 9-12)

- Student dashboard
- Learning path
- Lesson delivery
- Basic assessments

### Phase 4: Labs and Projects (Weeks 13-16)

- Lab system
- Project system
- AI mentor integration
- Portfolio building

### Phase 5: Community and Certification (Weeks 17-20)

- Discussion system
- Peer review
- Certification system
- Mentor tools
