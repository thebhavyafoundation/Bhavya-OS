# Bhavya Digital Institution — Product Definition

**Status:** Canonical source of truth
**Last updated:** 2026-08-10

---

## Core Principle

Bhavya is a DIGITAL INSTITUTION. Not a website + academy + dashboard. One product. One account. One design system. One community. One knowledge graph. One contribution graph. Different roles unlock different capabilities.

---

## Product Model

```
BHAVYA FOUNDATION
        │
        ├── PUBLIC EXPERIENCE
        │
        └── BHAVYA APPLICATION
                 │
                 └── ROLE / CAPABILITY ENGINE
                         │
       ┌─────────┬───────┼────────┬─────────┬──────────┐
       │         │       │        │         │          │
    Student  Volunteer  Donor  Researcher Mentor   Educator
       │         │       │        │         │          │
       └─────────┴───────┴────────┴─────────┴──────────┘
                         │
                    SAME ACCOUNT
                         │
                   SAME APPLICATION
                         │
                    DIFFERENT HOME
```

---

## Public → Application Transition

Anonymous visitor explores public pages, then joins Bhavya. The transition should feel like entering the same institution, not navigating to a different website.

## My Bhavya

Authenticated home at `/app`. Dashboard is role-aware:

- **Student:** Continue Learning, Upcoming Class, Current Course, Assignment, Progress, Community, Recommended Knowledge
- **Volunteer:** Current Opportunities, Upcoming Event, My Contributions, Mission Updates, Community
- **Donor:** Giving Overview, Projects Supported, Impact Updates, Reports, Receipts
- **Researcher:** Active Research, Knowledge Objects, Publications, Collaborations, Research Updates
- **Multi-role:** My Bhavya with tabs for Learning, Volunteering, Research, Giving, Community

## Roles ≠ Separate Products

Roles are capabilities. A user has `roles: [student, volunteer, researcher]`. The application computes permissions, navigation, home modules, notifications, recommendations, available actions.

## Community Layer

Core objects: Person, Profile, Group, Post, Comment, Reaction, Event, Announcement, Resource, Project, Discussion. Community connects directly to learning, missions, research, knowledge, volunteering.

## Learning Community

Courses support: Course, Module, Lesson, Video, Assessment, Project, Discussion, Instructor, Learner, Progress, Credential. Learning becomes social and institutional.

## Contribution System

Every meaningful action becomes a contribution. Student: course project, research contribution, peer mentoring. Volunteer: field activity, event, mission contribution. Researcher: publication, knowledge object, review. Donor: funding, project support. Educator: course, lesson, mentoring.

Model: Person → Contribution → Artifact/Activity → Evidence → Impact. This becomes the Bhavya Contribution Graph.

## Profile System

Meaningful institutional profile: Identity, Interests, Learning, Projects, Contributions, Credentials, Research, Volunteering, Community, Impact. Users build an institutional portfolio.

## Credentials

Course completion, skill mastery, project completion, research, volunteer contribution, leadership, mentorship, community contribution. Future: verifiable credentials, DID, wallet. Web2 users see "My Credentials" without needing blockchain.

## Notification System

One institutional notification center. Do not build independent notification systems for every subsystem.

## Mobile Application Experience

Mobile primary navigation: Home, Learn, Community, Explore, Profile. Desktop expands to: Home, Learn, Community, Knowledge, Missions, Research, Projects, etc. Same application, different responsive navigation.

## PWA

Progressive installable: manifest, icons, standalone mode, offline shell, cached learning content, push notification architecture, mobile safe areas, deep links.

## Web3

Future capability layer for identity, credentials, provenance, contribution verification, governance. Core application remains fully functional in Web2.

## Design System

Public: editorial, cinematic, institutional, nature, heritage, knowledge. Authenticated: more functional, denser, interactive. Same colors, typography, iconography, motion language, surfaces, components, identity. Authenticated app can become more application-like without becoming a generic SaaS dashboard.

## Information Architecture

```
Public:           Authenticated:      Institutional:
/                 /app                /os
/about            /app/learn          /os/studio
/missions         /app/community      /os/governance
/knowledge        /app/knowledge      /os/admin
/academy          /app/missions
/research         /app/research
/community        /app/projects
                  /app/credentials
                  /app/contributions
                  /app/profile
```

## Acceptance Test

- New user: "What is Bhavya?" within seconds
- Student: "What should I learn next?"
- Volunteer: "How can I contribute?"
- Donor: "What am I supporting and what happened?"
- Researcher: "What knowledge and projects can I contribute to?"
- Community member: "Who are my people and what are we doing?"

## Design Proof

Build three reference experiences:
A. PUBLIC: `/`
B. STUDENT: `/app?role=student`
C. VOLUNTEER: `/app?role=volunteer`
D. DONOR: `/app?role=donor`

They must demonstrate ONE APPLICATION with different role-aware experiences.

---

## Final Definition

BHAVYA IS NOT: a website + an academy + a dashboard + a volunteer portal + a donor portal + a research portal.

BHAVYA IS: ONE DIGITAL INSTITUTION. The website is the public entrance. The application is the institutional home. The community connects the people. The Academy develops people. The Knowledge Graph connects knowledge. The Mission system connects action. The Contribution Graph records participation. Credentials recognize achievement. Governance provides trust. Web3 can eventually provide verifiable identity, provenance and credentials.

ONE FOUNDATION. ONE APPLICATION. MANY PEOPLE. MANY ROLES. ONE SHARED INSTITUTION.
