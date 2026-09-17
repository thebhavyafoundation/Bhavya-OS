# Memory — Architecture

## Bhavya OS Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Bhavya OS                                 │
├─────────────────────────────────────────────────────────────┤
│  AI Brain (.ai/)                                            │
│  ├── Constitution, Mission, Vision, Values                  │
│  ├── Constraints, Style Guide, Coding Standard              │
│  └── Decision Rules                                         │
├─────────────────────────────────────────────────────────────┤
│  Agents (.agents/)                                          │
│  ├── 18 Autonomous Workers                                  │
│  └── Skills (.skills/)                                      │
├─────────────────────────────────────────────────────────────┤
│  Memory (.memory/)                                          │
│  ├── Projects, People, Knowledge, Architecture              │
│  └── History, Bugs, Lessons                                 │
├─────────────────────────────────────────────────────────────┤
│  Intelligence Engines                                       │
│  ├── Memory Engine | Decision Engine | Workflow Engine      │
│  ├── Planning Engine | Research Engine | Reasoning Engine   │
│  ├── Self Improvement Engine | Governance Engine            │
│  ├── Event Bus | Knowledge Graph                            │
├─────────────────────────────────────────────────────────────┤
│  Applications (apps/)                                       │
│  ├── website | admin | docs | forest | heritage             │
│  ├── knowledge | library | transparency | volunteer         │
│  └── design-system                                          │
├─────────────────────────────────────────────────────────────┤
│  Packages (packages/)                                       │
│  ├── ui | design-system | mission-runtime | ai-runtime      │
│  ├── sdk | analytics | seo | knowledge-engine               │
│  └── event-bus | agent-runtime | component-library          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User request → Agent
2. Agent → Memory Engine (recall)
3. Agent → Decision Engine (decide)
4. Agent → Workflow Engine (execute)
5. Agent → Knowledge Graph (learn)
6. Agent → Event Bus (notify)
7. Agent → Governance Engine (comply)

### Key Patterns

- **Event-Driven:** All communication via Event Bus
- **Memory-First:** Always check memory before acting
- **Governance:** All changes through approved process
- **Auditability:** Every action logged
