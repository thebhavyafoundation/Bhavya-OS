# UX Architecture — Bhavya AI Institute

**Version:** 1.0 | **Status:** Draft | **Last Updated:** 2026-08-07

---

## Design Principles

1. **Learning-first** — Every pixel serves education
2. **Progressive disclosure** — Complexity reveals itself gradually
3. **Focus states** — Minimize distraction, maximize immersion
4. **Keyboard-first** — Power users never touch the mouse
5. **Responsive** — Mobile → Tablet → Desktop (not the other way)

---

## Navigation Architecture

### Primary Navigation (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────┐  ┌─────────────────────────────────────────────┐  │
│  │Logo │  │  Dashboard  Courses  Projects  Community    │  │
│  └─────┘  └─────────────────────────────────────────────┘  │
│           ┌──────────────────────────────┐  ┌───┬───┬───┐  │
│           │  🔍 Search...         ⌘K    │  │ 🔔│ 💬│ 👤│  │
│           └──────────────────────────────┘  └───┴───┴───┘  │
└─────────────────────────────────────────────────────────────┘
```

### Primary Navigation (Mobile)

```
┌─────────────────────────┐
│  ☰  Bhavya AI    🔔 👤  │
├─────────────────────────┤
│                         │
│      [Content]          │
│                         │
├─────────────────────────┤
│  🏠  📚  🔬  👥  👤   │
└─────────────────────────┘
```

### Sidebar Navigation (Course Context)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                        │
│                                                             │
│  Course: Introduction to Machine Learning                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Progress: 42%                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ▼ Module 1: Foundations                                    │
│    ✓ Lesson 1.1: What is ML?                               │
│    ✓ Lesson 1.2: Types of Learning                         │
│    ● Lesson 1.3: Linear Regression  ◄── Current            │
│    ○ Lesson 1.4: Model Evaluation                          │
│    ○ Lab 1: Build Your First Model                         │
│                                                             │
│  ▶ Module 2: Supervised Learning                           │
│  ▶ Module 3: Unsupervised Learning                         │
│  ▶ Module 4: Neural Networks                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 Ask AI Mentor                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen Specifications

### 1. Landing Experience

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Bhavya Logo]                            │
│                                                             │
│              Learn AI. Build AI. Master AI.                 │
│                                                             │
│     Join 2,400+ students mastering artificial intelligence  │
│     with personalized paths and expert AI mentorship.       │
│                                                             │
│     ┌─────────────────────┐  ┌─────────────────────┐       │
│     │  Start Free Assessment│  │  Explore Paths      │       │
│     └─────────────────────┘  └─────────────────────┘       │
│                                                             │
│  ┌───────────────┬───────────────┬───────────────┐         │
│  │  🔬 Explorer  │  ⚡ Builder   │  🔭 Researcher│         │
│  │               │               │               │         │
│  │  Learn the    │  Build real   │  Push the     │         │
│  │  fundamentals │  AI systems   │  boundaries   │         │
│  │               │               │               │         │
│  │  12 weeks     │  16 weeks     │  24 weeks     │         │
│  │  Beginner     │  Intermediate │  Advanced     │         │
│  └───────────────┴───────────────┴───────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Live Cohort Counter: 847 students learning now]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Hero text: fade-in-up on load (staggered words)
- Path cards: tilt-on-hover (subtle 3D)
- CTA buttons: scale-on-hover, pulse animation
- Cohort counter: live update (socket)

---

### 2. Learning Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, Sarah 👋                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Continue Learning                                   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                                                      │   │
│  │  ┌──────────────┐  Introduction to Machine Learning │   │
│  │  │  [Thumbnail] │  Lesson 1.3: Linear Regression    │   │
│  │  │   42% done   │  Est. 25 min remaining            │   │
│  │  └──────────────┘                                   │   │
│  │                                                      │   │
│  │  [Continue →]                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┬───────────────┬───────────────┐         │
│  │  📊 Stats     │  🔥 Streak    │  🏆 Level     │         │
│  │               │               │               │         │
│  │  12 lessons   │  7 days       │  Level 3      │         │
│  │  3 projects   │  Best: 14     │  2,450 XP     │         │
│  │  85% avg      │               │               │         │
│  └───────────────┴───────────────┴───────────────┘         │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │  📅 Schedule         │  │  💬 AI Mentor       │         │
│  │                      │  │                      │         │
│  │  Mon: Lesson 1.4    │  │  "Great progress on  │         │
│  │  Wed: Lab 1         │  │  linear regression!  │         │
│  │  Fri: Quiz 1        │  │  Ready for model     │         │
│  │                      │  │  evaluation?"        │         │
│  │  [View Full Week]   │  │  [Chat →]            │         │
│  └─────────────────────┘  └─────────────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🏅 Recent Achievements                              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  [Badge: First Lab] [Badge: 7-Day Streak] [Badge: ⭐]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Continue card: slide-in from left
- Stats: count-up animation on load
- Streak: flame animation (subtle pulse)
- Achievements: stagger reveal

---

### 3. Course Experience

```
┌─────────────────────────────────────────────────────────────┐
│  ← Courses                                                  │
│                                                             │
│  Introduction to Machine Learning                           │
│  Learn the fundamentals of ML from theory to practice       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Course Thumbnail / Video]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 12 Modules  │  ⏱️ 48 Hours  │  📈 Intermediate         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  What You'll Learn                                   │   │
│  │  • Build ML models from scratch                      │   │
│  │  • Evaluate model performance                        │   │
│  │  • Apply ML to real-world problems                   │   │
│  │  • Understand the ML workflow                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▼ Module 1: Foundations                    2h 30m   │   │
│  │    ✓ 1.1 What is ML? (15 min)                       │   │
│  │    ✓ 1.2 Types of Learning (20 min)                 │   │
│  │    ● 1.3 Linear Regression (25 min)                 │   │
│  │    ○ 1.4 Model Evaluation (20 min)                  │   │
│  │    ○ Lab 1: First Model (45 min)                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▶ Module 2: Supervised Learning            6h 00m  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▶ Module 3: Unsupervised Learning          5h 30m  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ▶ Module 4: Neural Networks                8h 00m  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Continue Learning →]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Modules: accordion expand/collapse (spring animation)
- Lessons: checkmark animation on complete
- Progress bar: animated fill

---

### 4. Lesson Reader

````
┌─────────────────────────────────────────────────────────────┐
│  ← Module 1                                                │
│                                                             │
│  Lesson 1.3: Linear Regression                              │
│  ⏱️ 25 min  │  📊 Intermediate  │  🎯 3 objectives          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Objectives                                          │   │
│  │  • Understand the linear regression equation         │   │
│  │  • Implement gradient descent                        │   │
│  │  • Evaluate model performance                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ## What is Linear Regression?                              │
│                                                             │
│  Linear regression models the relationship between a        │
│  dependent variable and one or more independent variables.  │
│                                                             │
│  [Interactive Diagram: scatter plot with regression line]   │
│                                                             │
│  The equation: y = mx + b                                   │
│                                                             │
│  Where:                                                     │
│  • y = predicted value                                      │
│  • m = slope (weight)                                       │
│  • x = input feature                                        │
│  • b = bias (intercept)                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💡 Checkpoint                                       │   │
│  │  What does the slope (m) represent?                  │   │
│  │                                                      │   │
│  │  ○ The intercept                                     │   │
│  │  ● The rate of change                                │   │
│  │  ○ The prediction error                              │   │
│  │  ○ The data point                                    │   │
│  │                                                      │   │
│  │  [Check Answer]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ## Gradient Descent                                        │
│                                                             │
│  [Code Block: Python implementation]                        │
│                                                             │
│  ```python                                                  │
│  def gradient_descent(X, y, learning_rate=0.01, epochs=100):│
│      m, b = 0, 0                                            │
│      n = len(X)                                             │
│      for _ in range(epochs):                                │
│          y_pred = m * X + b                                 │
│          dm = (-2/n) * sum(X * (y - y_pred))               │
│          db = (-2/n) * sum(y - y_pred)                      │
│          m -= learning_rate * dm                            │
│          b -= learning_rate * db                            │
│      return m, b                                            │
│  ```                                                        │
│                                                             │
│  [▶ Run Code] [📋 Copy] [💬 Ask About This]                │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ## Key Takeaways                                          │
│                                                             │
│  • Linear regression finds the best-fit line                │
│  • Gradient descent minimizes prediction error              │
│  • Learning rate controls step size                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Next: Model Evaluation →]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
````

**Interactions:**

- Checkpoint: instant feedback (correct: green pulse, incorrect: red shake)
- Code block: syntax highlighting, run button (sandbox)
- Takeaways: stagger reveal
- Next button: slide-in on scroll

---

### 5. Interactive Lab

```
┌─────────────────────────────────────────────────────────────┐
│  ← Lesson 1.3                                              │
│                                                             │
│  Lab 1: Build Your First Model                              │
│  ⏱️ 45 min  │  🎯 Real-world problem                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Problem Statement                                   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  Predict house prices based on square footage.       │   │
│  │  Use the provided dataset and implement linear       │   │
│  │  regression from scratch.                            │   │
│  │                                                      │   │
│  │  Dataset: houses.csv (1000 samples)                  │   │
│  │  Columns: sqft, bedrooms, bathrooms, price           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────┬─────────────────────────┐   │
│  │  📝 Code Editor            │  📤 Output              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━  │  ━━━━━━━━━━━━━━━━━━━━━ │   │
│  │  [Monaco Editor]           │  [Output Panel]         │   │
│  │                            │                         │   │
│  │  def train_model(data):    │  > Loading dataset...   │   │
│  │      # Your code here      │  > Training model...    │   │
│  │      pass                  │  > MSE: 0.234           │   │
│  │                            │  > R²: 0.87             │   │
│  │                            │                         │   │
│  │  [▶ Run] [🔄 Reset]       │  [✓ Tests Passed: 3/5]  │   │
│  └───────────────────────────┴─────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💡 Hints (2 remaining)                              │   │
│  │  • Hint 1: Start by loading the CSV file             │   │
│  │  • Hint 2: Split data into features and target       │   │
│  │  • Hint 3: [Locked]                                  │   │
│  │                                                      │   │
│  │  [Request Hint]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 AI Mentor                                        │   │
│  │  "I see you're loading the data. What features       │   │
│  │  do you think will be most predictive of price?"     │   │
│  │                                                      │   │
│  │  [Ask a question...]                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Submit Lab] [Save Progress]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Editor: syntax highlighting, autocomplete, error underlines
- Run: real-time output streaming
- Hints: progressive reveal (spring animation)
- AI Mentor: typing indicator, context-aware suggestions
- Submit: validation, confirmation modal

---

### 6. AI Mentor Workspace

```
┌─────────────────────────────────────────────────────────────┐
│  ← Dashboard                                                │
│                                                             │
│  AI Mentor                                                  │
│  Your personal AI learning companion                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Context Panel                                       │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  📚 Current: Lesson 1.3 - Linear Regression         │   │
│  │  📊 Progress: 42% complete                           │   │
│  │  🔥 Streak: 7 days                                   │   │
│  │  💪 Strengths: Python, Statistics                    │   │
│  │  📈 Weaknesses: Gradient Descent                     │   │
│  │  🎯 Goal: Complete Module 1 this week               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Chat Interface                                      │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                                                      │   │
│  │  👤 You: Can you explain gradient descent simply?    │   │
│  │                                                      │   │
│  │  🤖 Mentor: Imagine you're hiking down a mountain    │   │
│  │  blindfolded. You can feel the slope under your      │   │
│  │  feet. Gradient descent is like taking steps in      │   │
│  │  the steepest downhill direction. Each step gets     │   │
│  │  you closer to the bottom (the minimum).            │   │
│  │                                                      │   │
│  │  The learning rate is how big your steps are.        │   │
│  │  Too big → you might overshoot. Too small →          │   │
│  │  you'll take forever.                                │   │
│  │                                                      │   │
│  │  👤 You: That makes sense! What about the            │   │
│  │  learning rate?                                      │   │
│  │                                                      │   │
│  │  🤖 Mentor: [Typing...]                              │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  Ask a question...                    [Send]    │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │  Quick actions:                                      │   │
│  │  [Explain concept] [Quiz me] [Show example]         │   │
│  │  [Review my code] [Suggest next steps]               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Chat: message bubbles (fade-in), typing indicator (dots)
- Context panel: collapsible
- Quick actions: hover tooltip, click to insert

---

### 7. Knowledge Graph Explorer

```
┌─────────────────────────────────────────────────────────────┐
│  ← Dashboard                                                │
│                                                             │
│  Knowledge Graph                                            │
│  Explore AI concepts and their relationships                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🔍 Search concepts...                    [Filter]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Interactive Graph Visualization]                   │   │
│  │                                                      │   │
│  │              ┌─────────┐                             │   │
│  │              │   ML    │                             │   │
│  │              └────┬────┘                             │   │
│  │         ┌─────────┼─────────┐                        │   │
│  │         ▼         ▼         ▼                        │   │
│  │    ┌────────┐ ┌────────┐ ┌────────┐                 │   │
│  │    │  DL    │ │  RL    │ │  NLP   │                 │   │
│  │    └───┬────┘ └────────┘ └───┬────┘                 │   │
│  │        ▼                     ▼                       │   │
│  │    ┌────────┐           ┌────────┐                   │   │
│  │    │ CNN    │           │Transfr│                   │   │
│  │    └────────┘           └────────┘                   │   │
│  │                                                      │   │
│  │  [Zoom] [Pan] [Reset]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Concept Details (selected: Linear Regression)       │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  📊 Mastery: 72%                                     │   │
│  │  🔗 Prerequisites: Statistics, Python Basics         │   │
│  │  📚 Lessons: 3 (1.3, 2.1, 2.4)                      │   │
│  │  🔬 Labs: 1 (Lab 1)                                  │   │
│  │  📝 Projects: 1 (Housing Prices)                     │   │
│  │                                                      │   │
│  │  [Start Lesson] [Review] [Practice]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Graph: D3 force-directed, click to select, drag to pan
- Nodes: color-coded by mastery (red → yellow → green)
- Edges: animated particles showing prerequisite flow
- Details: slide-in panel

---

### 8. Project Studio

```
┌─────────────────────────────────────────────────────────────┐
│  ← Projects                                                │
│                                                             │
│  Project: House Price Predictor                             │
│  ⏱️ 2 weeks  │  📊 Intermediate  │  🎯 Real-world          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Brief                                               │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  Build an ML model that predicts house prices.       │   │
│  │  Deploy as a web API. Present to industry panel.     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Milestones                                          │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  ✓ Week 1: Data exploration & preprocessing         │   │
│  │  ● Week 2: Model training & evaluation              │   │
│  │  ○ Week 3: API development                          │   │
│  │  ○ Week 4: Deployment & presentation                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Repository                                          │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  GitHub: sarah/house-price-predictor                 │   │
│  │  Last commit: 2 hours ago                            │   │
│  │  Branch: main                                        │   │
│  │                                                      │   │
│  │  [Open in GitHub] [Clone] [View Diff]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 AI Mentor Review                                 │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  "Your data exploration looks solid. I noticed you   │   │
│  │  haven't handled missing values yet. Consider using  │   │
│  │  mean imputation for numerical columns."             │   │
│  │                                                      │   │
│  │  [View Full Review] [Ask Question]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Submit Milestone] [Save Progress]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 9. Research Library

```
┌─────────────────────────────────────────────────────────────┐
│  ← Dashboard                                                │
│                                                             │
│  Research Library                                            │
│  Explore papers, datasets, and resources                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🔍 Search papers, datasets, tutorials...            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Filters                                             │   │
│  │  Type: [All] [Papers] [Datasets] [Tutorials]        │   │
│  │  Topic: [ML] [DL] [NLP] [CV] [Robotics]            │   │
│  │  Level: [Beginner] [Intermediate] [Advanced]        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Results (247 items)                                 │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                                                      │   │
│  │  📄 Attention Is All You Need                        │   │
│  │     Vaswani et al., 2017                             │   │
│  │     Transformers, NLP                                │   │
│  │     [Read] [Cite] [Save]                             │   │
│  │                                                      │   │
│  │  📊 ImageNet Large Scale Visual Recognition Challenge│   │
│  │     Dataset, 1M+ images                              │   │
│  │     [Download] [Preview] [Save]                      │   │
│  │                                                      │   │
│  │  📝 Building Neural Networks from Scratch            │   │
│  │     Tutorial, 45 min                                 │   │
│  │     [Read] [Bookmark] [Save]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 10. Notebook Workspace

````
┌─────────────────────────────────────────────────────────────┐
│  ← Notebooks                                               │
│                                                             │
│  My Notebook: Linear Regression Experiments                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Cell 1: Markdown]                                  │   │
│  │  ## Experiment: Effect of Learning Rate              │   │
│  │  Testing different learning rates on convergence.    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Cell 2: Code]                                      │   │
│  │  ```python                                           │   │
│  │  import numpy as np                                  │   │
│  │  import matplotlib.pyplot as plt                     │   │
│  │                                                      │   │
│  │  # Generate sample data                              │   │
│  │  X = np.random.randn(100, 1)                         │   │
│  │  y = 2 * X + 1 + np.random.randn(100, 1) * 0.1      │   │
│  │  ```                                                 │   │
│  │  [▶ Run] [🔄 Reset]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Cell 3: Output]                                    │   │
│  │  [Chart: Learning rate comparison]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [+ Add Cell] [Save] [Share] [Export]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
````

---

### 11. Portfolio Showcase

```
┌─────────────────────────────────────────────────────────────┐
│  ← Dashboard                                                │
│                                                             │
│  My Portfolio                                               │
│  sarah.bhavya.ai                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Header                                              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  👩‍💻 Sarah Chen                                       │   │
│  │  AI Builder | Level 3 | 2,450 XP                     │   │
│  │  Specialization: Machine Learning                    │   │
│  │                                                      │   │
│  │  [Edit Profile] [Share] [Export PDF]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Skills Visualization                                │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  [Radar Chart: Python, ML, DL, Statistics, MLOps]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Projects (6)                                        │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ [Image]  │ │ [Image]  │ │ [Image]  │            │   │
│  │  │ House    │ │ Sentiment│ │ Image    │            │   │
│  │  │ Price    │ │ Analysis │ │ Classifier│           │   │
│  │  │ Predictor│ │          │ │          │            │   │
│  │  │ [View]   │ │ [View]   │ │ [View]   │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Research (2)                                        │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  📄 Attention Mechanisms Survey                      │   │
│  │  📄 Transfer Learning in NLP                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 12. Progress Center

```
┌─────────────────────────────────────────────────────────────┐
│  ← Dashboard                                                │
│                                                             │
│  Progress Center                                            │
│  Track your learning journey                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Overview                                            │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  📊 42% Complete  │  🔥 7 Day Streak  │  🏆 Level 3  │   │
│  │  📚 12 Lessons    │  🔬 3 Labs        │  📝 2 Projects│  │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Timeline                                            │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  [Interactive timeline visualization]                 │   │
│  │                                                      │   │
│  │  Week 1: ●●●●●○○○○○○○ (5/10 lessons)                │   │
│  │  Week 2: ●●●○○○○○○○○○ (3/10 lessons)                │   │
│  │  Week 3: ●●○○○○○○○○○○ (2/10 lessons)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Achievements                                        │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  [Badge] [Badge] [Badge] [Badge] [Locked] [Locked]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Learning Analytics                                  │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  [Chart: Study time by day]                          │   │
│  │  [Chart: Completion by topic]                        │   │
│  │  [Chart: Quiz scores over time]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Keyboard Navigation

| Action           | Shortcut |
| ---------------- | -------- |
| Command palette  | ⌘K       |
| Search           | ⌘/       |
| Next lesson      | ⌘]       |
| Previous lesson  | ⌘[       |
| Run code         | ⌘Enter   |
| Save             | ⌘S       |
| Toggle sidebar   | ⌘B       |
| Toggle AI Mentor | ⌘M       |
| Fullscreen       | ⌘F       |
| Help             | ⌘?       |

---

## Responsive Breakpoints

| Breakpoint | Width      | Layout                           |
| ---------- | ---------- | -------------------------------- |
| Mobile     | < 640px    | Single column, bottom nav        |
| Tablet     | 640-1024px | Two columns, collapsible sidebar |
| Desktop    | > 1024px   | Full layout, persistent sidebar  |
| Wide       | > 1440px   | Max-width container              |

---

_Every screen is designed for learning. Every interaction is intentional._
