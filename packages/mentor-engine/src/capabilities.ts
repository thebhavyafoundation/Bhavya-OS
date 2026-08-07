interface StudyPlan {
  studentId: string;
  generatedAt: string;
  currentLevel: string;
  weeklyHours: number;
  duration: string;
  phases: StudyPhase[];
  milestones: Milestone[];
  resources: Resource[];
}

interface StudyPhase {
  name: string;
  weeks: number;
  topics: string[];
  objectives: string[];
  assessments: string[];
}

interface Milestone {
  week: number;
  goal: string;
  criteria: string[];
}

interface Resource {
  type: string;
  title: string;
  url: string;
  estimatedHours: number;
}

interface Misconception {
  detected: boolean;
  category: string;
  description: string;
  commonCause: string;
  recommendation: string;
  relatedConcepts: string[];
}

interface CodeReview {
  overallScore: number;
  issues: CodeIssue[];
  suggestions: string[];
  strengths: string[];
}

interface CodeIssue {
  line: number;
  severity: string;
  category: string;
  message: string;
  suggestion: string;
}

interface ProjectSuggestion {
  title: string;
  description: string;
  difficulty: string;
  skillsUsed: string[];
  estimatedHours: number;
  learningOutcomes: string[];
  resources: string[];
}

interface InterviewQuestion {
  question: string;
  type: string;
  difficulty: string;
  expectedTopics: string[];
  sampleAnswer: string;
  followUp: string[];
  evaluationCriteria: string[];
}

interface InterviewPrep {
  topic: string;
  questions: InterviewQuestion[];
  tips: string[];
  commonMistakes: string[];
}

interface AdaptiveRecommendation {
  currentMastery: number;
  strengths: string[];
  weaknesses: string[];
  recommendedTopic: string;
  reason: string;
  alternativeTopics: string[];
  estimatedTime: string;
}

interface StudentProgress {
  studentId: string;
  completedLessons: number;
  totalLessons: number;
  completedLabs: number;
  totalLabs: number;
  scores: Record<string, number>;
  timeSpent: Record<string, number>;
  strongTopics: string[];
  weakTopics: string[];
  currentStage: number;
}

interface TopicMastery {
  topic: string;
  score: number;
  attempts: number;
  lastPracticed: string;
  confidence: number;
}

export function generateStudyPlan(
  studentId: string,
  progress: StudentProgress,
  weeklyHours: number = 10,
): StudyPlan {
  const overallProgress =
    (progress.completedLessons + progress.completedLabs) /
    (progress.totalLessons + progress.totalLabs);

  let currentLevel = "Beginner";
  if (overallProgress > 0.6) currentLevel = "Advanced";
  else if (overallProgress > 0.3) currentLevel = "Intermediate";

  const totalWeeks = Math.ceil((1 - overallProgress) * 20);
  const phases: StudyPhase[] = [];

  if (progress.weakTopics.length > 0) {
    phases.push({
      name: "Foundation Strengthening",
      weeks: Math.max(2, Math.ceil(progress.weakTopics.length * 0.5)),
      topics: progress.weakTopics,
      objectives: progress.weakTopics.map((t) => `Master ${t} fundamentals`),
      assessments: progress.weakTopics.map((t) => `${t} quiz`),
    });
  }

  phases.push({
    name: "Core Curriculum",
    weeks: Math.max(
      4,
      totalWeeks - phases.reduce((a, p) => a + p.weeks, 0) - 2,
    ),
    topics: ["Machine Learning", "Deep Learning", "Data Engineering"],
    objectives: [
      "Complete all intermediate lessons",
      "Build 3 practical projects",
      "Score 80%+ on all assessments",
    ],
    assessments: [
      "Mid-term project",
      "Peer code review",
      "Technical presentation",
    ],
  });

  phases.push({
    name: "Advanced Topics",
    weeks: 2,
    topics:
      progress.strongTopics.length > 0
        ? progress.strongTopics.slice(0, 3)
        : ["Research Methods"],
    objectives: [
      "Specialize in chosen domain",
      "Complete capstone project",
      "Prepare portfolio",
    ],
    assessments: ["Capstone project", "Portfolio review", "Mock interview"],
  });

  const milestones: Milestone[] = [
    {
      week: Math.ceil(totalWeeks * 0.25),
      goal: "Complete foundation phase",
      criteria: ["All weak topics improved by 20%", "Weekly quiz average 75%+"],
    },
    {
      week: Math.ceil(totalWeeks * 0.5),
      goal: "Mid-program checkpoint",
      criteria: ["50% of remaining lessons complete", "1 project submitted"],
    },
    {
      week: Math.ceil(totalWeeks * 0.75),
      goal: "Advanced readiness",
      criteria: ["All core topics 70%+ mastery", "2 projects complete"],
    },
    {
      week: totalWeeks,
      goal: "Program completion",
      criteria: [
        "All lessons complete",
        "Capstone submitted",
        "Portfolio ready",
      ],
    },
  ];

  const resources: Resource[] = [
    {
      type: "video",
      title: "AI Fundamentals Review",
      url: "/courses/fundamentals",
      estimatedHours: 5,
    },
    {
      type: "practice",
      title: "Coding Challenges",
      url: "/labs/coding",
      estimatedHours: 10,
    },
    {
      type: "project",
      title: "Starter Templates",
      url: "/projects/templates",
      estimatedHours: 3,
    },
    {
      type: "reading",
      title: "Research Papers Collection",
      url: "/resources/papers",
      estimatedHours: 8,
    },
  ];

  return {
    studentId,
    generatedAt: new Date().toISOString(),
    currentLevel,
    weeklyHours,
    duration: `${totalWeeks} weeks`,
    phases,
    milestones,
    resources,
  };
}

export function detectMisconceptions(
  studentAnswer: string,
  correctAnswer: string,
  topic: string = "",
): Misconception {
  const normalizedStudent = studentAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();

  if (normalizedStudent === normalizedCorrect) {
    return {
      detected: false,
      category: "",
      description: "Answer is correct",
      commonCause: "",
      recommendation: "",
      relatedConcepts: [],
    };
  }

  const misconceptionPatterns: Record<
    string,
    {
      patterns: RegExp[];
      category: string;
      cause: string;
      recommendation: string;
    }
  > = {
    confusion: {
      patterns: [/swap|reverse|opposite|instead of/i],
      category: "Conceptual Confusion",
      cause: "Similar concepts not clearly distinguished",
      recommendation:
        "Review definitions side-by-side and create comparison tables",
    },
    simplification: {
      patterns: [/skip|missing|forgot|partial/i],
      category: "Oversimplification",
      cause: "Missing key components of the answer",
      recommendation: "Break down the concept into all required components",
    },
    overgeneralization: {
      patterns: [/always|never|all|none|every/i],
      category: "Overgeneralization",
      cause: "Applying rules too broadly without exceptions",
      recommendation: "Study edge cases and exceptions to the rule",
    },
    terminology: {
      patterns: [/call|named|called|term/i],
      category: "Terminology Error",
      cause: "Incorrect or imprecise terminology usage",
      recommendation: "Review glossary and use precise technical terms",
    },
    application: {
      patterns: [/use|apply|implement|practical/i],
      category: "Application Error",
      cause: "Understanding theory but misapplying in practice",
      recommendation: "Work through more hands-on exercises",
    },
  };

  let detectedCategory = "";
  let _matchedPattern = "";

  for (const [key, config] of Object.entries(misconceptionPatterns)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedStudent)) {
        detectedCategory = key;
        _matchedPattern = pattern.source;
        break;
      }
    }
    if (detectedCategory) break;
  }

  if (!detectedCategory) {
    if (normalizedStudent.length < normalizedCorrect.length * 0.5) {
      detectedCategory = "incomplete";
    } else if (normalizedStudent.length > normalizedCorrect.length * 2) {
      detectedCategory = "overcomplicated";
    } else {
      detectedCategory = "factual";
    }
  }

  const categoryConfig = misconceptionPatterns[detectedCategory] || {
    category: "Factual Error",
    cause: "Incorrect understanding of the concept",
    recommendation: "Review the source material and try similar problems",
  };

  const relatedConcepts: string[] = [];
  if (topic) {
    relatedConcepts.push(topic);
  }

  return {
    detected: true,
    category: categoryConfig.category || detectedCategory,
    description: `Student answer differs from correct answer. Detected pattern: ${detectedCategory}`,
    commonCause: categoryConfig.cause,
    recommendation: categoryConfig.recommendation,
    relatedConcepts,
  };
}

export function reviewCode(code: string): CodeReview {
  const lines = code.split("\n");
  const issues: CodeIssue[] = [];
  const suggestions: string[] = [];
  const strengths: string[] = [];
  let score = 100;

  if (code.trim().length === 0) {
    return {
      overallScore: 0,
      issues: [
        {
          line: 1,
          severity: "error",
          category: "empty",
          message: "Code is empty",
          suggestion: "Add implementation",
        },
      ],
      suggestions: ["Write code to review"],
      strengths: [],
    };
  }

  const hasComments = /^\/\*|^\s*\/\//m.test(code);
  if (hasComments) {
    strengths.push("Code includes comments");
  } else {
    suggestions.push("Add comments to explain complex logic");
    score -= 5;
  }

  const functionCount = (code.match(/function\s+\w+|=>\s*\{|=>\s*[^{]/g) || [])
    .length;
  if (functionCount > 0) {
    strengths.push("Code is modularized into functions");
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.length > 100) {
      issues.push({
        line: index + 1,
        severity: "warning",
        category: "readability",
        message: "Line exceeds 100 characters",
        suggestion: "Break into multiple lines for readability",
      });
      score -= 2;
    }

    if (/console\.(log|debug|warn|error)/.test(trimmed)) {
      issues.push({
        line: index + 1,
        severity: "warning",
        category: "debugging",
        message: "Console statement left in code",
        suggestion: "Remove debug statements or use a logger",
      });
      score -= 1;
    }

    if (/var\s+/.test(trimmed)) {
      issues.push({
        line: index + 1,
        severity: "info",
        category: "modernization",
        message: "Using 'var' instead of 'const' or 'let'",
        suggestion: "Use const for immutable values and let for mutable",
      });
      score -= 1;
    }

    if (/(?:==|!=)\s*[^=]/.test(trimmed) && !/===|!==/.test(trimmed)) {
      issues.push({
        line: index + 1,
        severity: "warning",
        category: "comparison",
        message: "Loose equality operator used",
        suggestion: "Use strict equality (=== or !==)",
      });
      score -= 2;
    }

    if (/TODO|FIXME|HACK|XXX/.test(trimmed)) {
      issues.push({
        line: index + 1,
        severity: "info",
        category: "todo",
        message: "Unresolved TODO/FIXME comment",
        suggestion: "Address before merging",
      });
    }
  });

  const errorHandling = /try\s*\{|\.catch\(|throw\s+/g.test(code);
  if (functionCount > 2 && !errorHandling) {
    suggestions.push("Consider adding error handling for complex functions");
    score -= 3;
  }

  if (code.includes("async") && !code.includes("await")) {
    suggestions.push("Async function without await - verify this is intended");
    score -= 2;
  }

  const uniqueVars = new Set(
    (code.match(/\b(?:const|let|var)\s+(\w+)/g) || []).map(
      (m) => m.split(/\s+/)[1],
    ),
  );
  if (uniqueVars.size > 10) {
    suggestions.push(
      "Many variables declared - consider breaking into smaller functions",
    );
    score -= 2;
  }

  if (strengths.length === 0) {
    strengths.push("Code is syntactically valid");
  }

  return {
    overallScore: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
    strengths,
  };
}

export function suggestProjects(
  skills: string[],
  level: string = "intermediate",
): ProjectSuggestion[] {
  const projects: ProjectSuggestion[] = [];

  const projectTemplates: Record<string, ProjectSuggestion[]> = {
    beginner: [
      {
        title: "Simple Classification Model",
        description:
          "Build a basic classifier using scikit-learn to categorize data",
        difficulty: "beginner",
        skillsUsed: ["python", "scikit-learn", "data-preprocessing"],
        estimatedHours: 8,
        learningOutcomes: [
          "Understand train/test split",
          "Implement basic classification",
          "Evaluate model performance",
        ],
        resources: ["scikit-learn documentation", "Kaggle datasets"],
      },
      {
        title: "Data Visualization Dashboard",
        description: "Create an interactive dashboard showing key metrics",
        difficulty: "beginner",
        skillsUsed: ["python", "pandas", "matplotlib"],
        estimatedHours: 6,
        learningOutcomes: [
          "Master data manipulation",
          "Create informative visualizations",
          "Build interactive displays",
        ],
        resources: ["Pandas documentation", "Matplotlib examples"],
      },
    ],
    intermediate: [
      {
        title: "End-to-End ML Pipeline",
        description:
          "Build a complete machine learning pipeline from data ingestion to deployment",
        difficulty: "intermediate",
        skillsUsed: ["python", "ml-pipeline", "docker", "api"],
        estimatedHours: 20,
        learningOutcomes: [
          "Design ML workflows",
          "Containerize models",
          "Build prediction APIs",
        ],
        resources: ["MLflow documentation", "FastAPI tutorial"],
      },
      {
        title: "NLP Text Analyzer",
        description:
          "Develop a text analysis tool with sentiment and entity recognition",
        difficulty: "intermediate",
        skillsUsed: ["python", "nlp", "transformers"],
        estimatedHours: 15,
        learningOutcomes: [
          "Implement text preprocessing",
          "Use pre-trained models",
          "Build NLP applications",
        ],
        resources: ["Hugging Face documentation", "spaCy docs"],
      },
    ],
    advanced: [
      {
        title: "Real-Time Object Detection",
        description:
          "Build a real-time object detection system using deep learning",
        difficulty: "advanced",
        skillsUsed: ["python", "pytorch", "computer-vision", "optimization"],
        estimatedHours: 30,
        learningOutcomes: [
          "Implement CNN architectures",
          "Optimize for inference",
          "Handle real-time data",
        ],
        resources: ["PyTorch tutorials", "YOLO documentation"],
      },
      {
        title: "Distributed Training System",
        description: "Create a distributed training setup for large models",
        difficulty: "advanced",
        skillsUsed: ["python", "distributed-computing", "pytorch"],
        estimatedHours: 40,
        learningOutcomes: [
          "Understand distributed systems",
          "Implement data parallelism",
          "Optimize training speed",
        ],
        resources: ["PyTorch Distributed docs", "Ray documentation"],
      },
    ],
  };

  const levelProjects =
    projectTemplates[level] || projectTemplates.intermediate;
  projects.push(...levelProjects);

  if (skills.includes("web")) {
    projects.push({
      title: "AI-Powered Web Application",
      description: "Build a full-stack web app with ML model integration",
      difficulty: level,
      skillsUsed: [...skills.slice(0, 3), "web-development"],
      estimatedHours: 25,
      learningOutcomes: [
        "Integrate ML with web apps",
        "Build RESTful APIs",
        "Handle user interactions",
      ],
      resources: ["React documentation", "Flask/FastAPI docs"],
    });
  }

  if (skills.includes("data")) {
    projects.push({
      title: "Data Pipeline Project",
      description: "Create an automated data processing pipeline",
      difficulty: level,
      skillsUsed: [...skills.slice(0, 3), "data-engineering"],
      estimatedHours: 18,
      learningOutcomes: [
        "Design data workflows",
        "Implement ETL processes",
        "Handle data quality",
      ],
      resources: ["Apache Airflow docs", "dbt documentation"],
    });
  }

  return projects;
}

export function interviewPrep(topic: string): InterviewPrep {
  const questionBank: Record<string, InterviewQuestion[]> = {
    "machine-learning": [
      {
        question: "Explain the bias-variance tradeoff and how to address it.",
        type: "conceptual",
        difficulty: "intermediate",
        expectedTopics: [
          "bias",
          "variance",
          "overfitting",
          "underfitting",
          "regularization",
        ],
        sampleAnswer:
          "Bias is error from oversimplified assumptions, variance from sensitivity to training data. Tradeoff: increasing model complexity reduces bias but increases variance. Address with cross-validation, regularization, ensemble methods.",
        followUp: [
          "How does this relate to model complexity?",
          "Give an example of high bias vs high variance",
        ],
        evaluationCriteria: [
          "Clear definition of both terms",
          "Understanding of tradeoff",
          "Practical solutions mentioned",
        ],
      },
      {
        question:
          "Compare supervised and unsupervised learning with use cases.",
        type: "comparison",
        difficulty: "beginner",
        expectedTopics: [
          "labeled data",
          "clustering",
          "classification",
          "regression",
        ],
        sampleAnswer:
          "Supervised uses labeled data for prediction (classification, regression). Unsupervised finds patterns in unlabeled data (clustering, dimensionality reduction). Supervised: spam detection. Unsupervised: customer segmentation.",
        followUp: [
          "When would you use semi-supervised?",
          "What about self-supervised learning?",
        ],
        evaluationCriteria: [
          "Correct definitions",
          "Appropriate examples",
          "Understanding of when to use each",
        ],
      },
      {
        question: "How would you handle missing data in a dataset?",
        type: "practical",
        difficulty: "intermediate",
        expectedTopics: [
          "imputation",
          "deletion",
          "missing mechanisms",
          "multiple imputation",
        ],
        sampleAnswer:
          "First identify missing mechanism (MCAR, MAR, MNAR). Options: deletion (listwise/pairwise), imputation (mean/median/mode, KNN, MICE), or model-based methods. Choose based on missingness pattern and data size.",
        followUp: [
          "What are the assumptions of each method?",
          "How does missing data affect model performance?",
        ],
        evaluationCriteria: [
          "Identifies missing mechanisms",
          "Knows multiple methods",
          "Considers impact on analysis",
        ],
      },
    ],
    "deep-learning": [
      {
        question:
          "Explain backpropagation and its importance in neural networks.",
        type: "conceptual",
        difficulty: "intermediate",
        expectedTopics: [
          "gradient descent",
          "chain rule",
          "weights",
          "loss function",
        ],
        sampleAnswer:
          "Backpropagation computes gradients of loss w.r.t. weights using chain rule, propagating error backwards from output to input. Essential for training neural networks via gradient descent optimization.",
        followUp: [
          "What is the vanishing gradient problem?",
          "How do modern architectures address this?",
        ],
        evaluationCriteria: [
          "Understands chain rule application",
          "Explains gradient flow",
          "Knows optimization role",
        ],
      },
      {
        question: "Design a CNN architecture for image classification.",
        type: "design",
        difficulty: "advanced",
        expectedTopics: [
          "convolution",
          "pooling",
          "architecture",
          "regularization",
        ],
        sampleAnswer:
          "Start with convolutional layers (increasing filters), pooling for downsampling, batch normalization, dropout for regularization, fully connected layers for classification. Consider ResNet skip connections for deeper networks.",
        followUp: [
          "How do you choose hyperparameters?",
          "What about transfer learning?",
        ],
        evaluationCriteria: [
          "Appropriate layer selection",
          "Understanding of regularization",
          "Architecture justification",
        ],
      },
    ],
    "data-structures": [
      {
        question: "When would you use a hash map vs a tree map?",
        type: "comparison",
        difficulty: "intermediate",
        expectedTopics: ["time complexity", "ordering", "collision handling"],
        sampleAnswer:
          "Hash map for O(1) average lookup when ordering doesn't matter. Tree map for O(log n) with sorted iteration. Hash map for frequent lookups, tree map for range queries or ordered data.",
        followUp: [
          "How do collisions affect hash map performance?",
          "What are balanced BST variants?",
        ],
        evaluationCriteria: [
          "Correct complexity analysis",
          "Understands trade-offs",
          "Appropriate use cases",
        ],
      },
    ],
    "system-design": [
      {
        question: "Design a recommendation system for an e-commerce platform.",
        type: "design",
        difficulty: "advanced",
        expectedTopics: [
          "collaborative filtering",
          "content-based",
          "hybrid",
          "scalability",
        ],
        sampleAnswer:
          "Use hybrid approach: collaborative filtering for user-item interactions, content-based for item features, combine with weighted scoring. Handle cold start with content-based. Scale with approximate nearest neighbors.",
        followUp: [
          "How do you handle the cold start problem?",
          "How to evaluate recommendation quality?",
        ],
        evaluationCriteria: [
          "Knows multiple approaches",
          "Considers scalability",
          "Addresses cold start",
        ],
      },
    ],
  };

  const normalizedTopic = topic.toLowerCase().replace(/\s+/g, "-");
  let questions = questionBank[normalizedTopic] || [];

  if (questions.length === 0) {
    for (const [key, qs] of Object.entries(questionBank)) {
      if (
        key.includes(normalizedTopic) ||
        normalizedTopic.includes(key.split("-")[0])
      ) {
        questions = qs;
        break;
      }
    }
  }

  if (questions.length === 0) {
    questions = [
      {
        question: `Explain a key concept in ${topic} and its practical application.`,
        type: "conceptual",
        difficulty: "intermediate",
        expectedTopics: [topic.toLowerCase()],
        sampleAnswer: `Demonstrate understanding of ${topic} fundamentals and how they apply in real scenarios.`,
        followUp: ["Can you elaborate?", "What are the limitations?"],
        evaluationCriteria: [
          "Clear explanation",
          "Practical example",
          "Awareness of limitations",
        ],
      },
    ];
  }

  return {
    topic,
    questions,
    tips: [
      "Practice explaining concepts out loud",
      "Prepare specific examples from your projects",
      "Be ready to discuss trade-offs and alternatives",
      "Practice whiteboard coding if applicable",
      "Research the company's tech stack",
    ],
    commonMistakes: [
      "Giving overly theoretical answers without examples",
      "Not asking clarifying questions",
      "Rushing through implementation details",
      "Ignoring edge cases",
      "Not discussing testing and deployment",
    ],
  };
}

export function adaptiveRecommendation(
  progress: StudentProgress,
  topicMastery: TopicMastery[] = [],
): AdaptiveRecommendation {
  const _overallProgress =
    (progress.completedLessons + progress.completedLabs) /
    (progress.totalLessons + progress.totalLabs);

  let currentMastery = 0;
  if (topicMastery.length > 0) {
    currentMastery =
      topicMastery.reduce((sum, t) => sum + t.score, 0) / topicMastery.length;
  } else if (progress.scores) {
    const scores = Object.values(progress.scores);
    if (scores.length > 0) {
      currentMastery = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
  }

  const strengths = [...progress.strongTopics];
  const weaknesses = [...progress.weakTopics];

  if (topicMastery.length > 0) {
    const sorted = [...topicMastery].sort((a, b) => b.score - a.score);
    strengths.push(...sorted.slice(0, 3).map((t) => t.topic));
    weaknesses.push(...sorted.slice(-3).map((t) => t.topic));
  }

  const uniqueStrengths = [...new Set(strengths)].slice(0, 5);
  const uniqueWeaknesses = [...new Set(weaknesses)].slice(0, 5);

  let recommendedTopic = "";
  let reason = "";

  if (uniqueWeaknesses.length > 0) {
    recommendedTopic = uniqueWeaknesses[0];
    reason =
      "This is an area that needs improvement based on your recent performance";
  } else if (currentMastery < 70) {
    recommendedTopic = "Fundamentals Review";
    reason = "Strengthening foundations will help with advanced topics";
  } else if (currentMastery < 90) {
    recommendedTopic = "Advanced Applications";
    reason = "You're ready to tackle more challenging material";
  } else {
    recommendedTopic = "Capstone Project";
    reason = "Your strong mastery qualifies you for the final project";
  }

  const alternativeTopics = uniqueWeaknesses.slice(1, 4);
  if (alternativeTopics.length === 0) {
    alternativeTopics.push(
      "Research Methods",
      "Project Documentation",
      "Peer Review",
    );
  }

  let estimatedTime = "2-3 hours";
  if (recommendedTopic === "Capstone Project") estimatedTime = "20-30 hours";
  else if (currentMastery < 50) estimatedTime = "5-8 hours";

  return {
    currentMastery: Math.round(currentMastery * 100) / 100,
    strengths: uniqueStrengths,
    weaknesses: uniqueWeaknesses,
    recommendedTopic,
    reason,
    alternativeTopics,
    estimatedTime,
  };
}
