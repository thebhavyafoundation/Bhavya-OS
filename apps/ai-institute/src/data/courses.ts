export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  duration: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  keyConcepts: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: string;
  enrolledStudents: number;
  rating: number;
  instructor: string;
  modules: CourseModule[];
  skills: string[];
  prerequisites: string[];
}

export const courses: Course[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    subtitle: "Your first step into artificial intelligence",
    description:
      "A comprehensive introduction to AI concepts, history, and applications. No coding required — just curiosity.",
    difficulty: "Beginner",
    duration: "4 weeks",
    enrolledStudents: 12400,
    rating: 4.8,
    instructor: "Dr. Priya Sharma",
    skills: ["AI Literacy", "Data Thinking", "Problem Framing", "Ethics"],
    prerequisites: [],
    modules: [
      {
        id: "what-is-ai",
        title: "What is Artificial Intelligence?",
        description: "Understanding AI from first principles",
        duration: "2 hours",
        lessons: [
          {
            id: "ai-definition",
            title: "Defining AI",
            description: "What AI really means — beyond the hype",
            duration: "20 min",
            objectives: [
              "Define artificial intelligence in your own words",
              "Distinguish between AI, ML, and deep learning",
              "Identify AI systems you already use daily",
            ],
            keyConcepts: [
              "Artificial Intelligence",
              "Machine Learning",
              "Deep Learning",
              "Narrow AI",
              "General AI",
            ],
          },
          {
            id: "ai-history",
            title: "A Brief History of AI",
            description: "From Turing to transformers — the 70-year journey",
            duration: "25 min",
            objectives: [
              "Trace the key milestones in AI history",
              "Understand the AI winters and why they happened",
              "Recognize the breakthroughs that led to modern AI",
            ],
            keyConcepts: [
              "Turing Test",
              "Expert Systems",
              "AI Winter",
              "Deep Learning Revolution",
              "Transformer Architecture",
            ],
          },
          {
            id: "types-of-ai",
            title: "Types of AI Systems",
            description: "Narrow, general, and the spectrum in between",
            duration: "20 min",
            objectives: [
              "Classify AI systems by capability level",
              "Explain the difference between reactive and proactive AI",
              "Understand where current AI sits on the capability spectrum",
            ],
            keyConcepts: [
              "Reactive AI",
              "Limited Memory",
              "Theory of Mind",
              "Self-Aware AI",
              "Capability Spectrum",
            ],
          },
        ],
      },
      {
        id: "how-machines-learn",
        title: "How Machines Learn",
        description: "The fundamental mechanisms behind machine learning",
        duration: "3 hours",
        lessons: [
          {
            id: "supervised-learning",
            title: "Learning from Examples",
            description: "How supervised learning works",
            duration: "30 min",
            objectives: [
              "Explain the concept of training data",
              "Understand the difference between features and labels",
              "Describe how a model learns from labeled examples",
            ],
            keyConcepts: [
              "Training Data",
              "Features",
              "Labels",
              "Classification",
              "Regression",
            ],
          },
          {
            id: "unsupervised-learning",
            title: "Finding Patterns",
            description: "How machines discover structure without labels",
            duration: "25 min",
            objectives: [
              "Understand unsupervised learning and its applications",
              "Explain clustering and dimensionality reduction",
              "Identify use cases for unsupervised learning",
            ],
            keyConcepts: [
              "Clustering",
              "K-Means",
              "PCA",
              "Anomaly Detection",
              "Pattern Recognition",
            ],
          },
          {
            id: "reinforcement-learning",
            title: "Learning by Doing",
            description: "How agents learn through trial and error",
            duration: "25 min",
            objectives: [
              "Explain the agent-environment loop",
              "Understand rewards and penalties",
              "Describe exploration vs exploitation",
            ],
            keyConcepts: [
              "Agent",
              "Environment",
              "Reward",
              "Policy",
              "Exploration vs Exploitation",
            ],
          },
        ],
      },
      {
        id: "ai-in-practice",
        title: "AI in Practice",
        description: "Real-world AI applications and case studies",
        duration: "2.5 hours",
        lessons: [
          {
            id: "ai-healthcare",
            title: "AI in Healthcare",
            description: "How AI is transforming medicine",
            duration: "25 min",
            objectives: [
              "Identify AI applications in medical imaging",
              "Understand drug discovery with AI",
              "Discuss ethical considerations in medical AI",
            ],
            keyConcepts: [
              "Medical Imaging",
              "Drug Discovery",
              "Diagnostic AI",
              "Privacy",
              "Bias in Healthcare AI",
            ],
          },
          {
            id: "ai-finance",
            title: "AI in Finance",
            description: "Algorithmic trading, fraud detection, and beyond",
            duration: "20 min",
            objectives: [
              "Understand algorithmic trading with AI",
              "Explain fraud detection systems",
              "Discuss risk assessment with machine learning",
            ],
            keyConcepts: [
              "Algorithmic Trading",
              "Fraud Detection",
              "Risk Assessment",
              "Credit Scoring",
              "Market Prediction",
            ],
          },
          {
            id: "ai-creative",
            title: "AI in Creative Arts",
            description: "Generative AI, music, and the creative revolution",
            duration: "25 min",
            objectives: [
              "Explore generative AI models",
              "Understand AI in music and art creation",
              "Discuss the future of human-AI collaboration",
            ],
            keyConcepts: [
              "Generative AI",
              "GANs",
              "Diffusion Models",
              "Music Generation",
              "Human-AI Collaboration",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "python-for-ai",
    title: "Python for AI",
    subtitle: "The language of machine intelligence",
    description:
      "Master Python specifically for AI development. From data manipulation to model building.",
    difficulty: "Beginner",
    duration: "6 weeks",
    enrolledStudents: 9800,
    rating: 4.7,
    instructor: "Marcus Chen",
    skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Jupyter"],
    prerequisites: ["ai-foundations"],
    modules: [
      {
        id: "python-fundamentals",
        title: "Python Fundamentals",
        description: "Core Python for AI developers",
        duration: "4 hours",
        lessons: [
          {
            id: "python-basics",
            title: "Python Basics",
            description: "Variables, types, and control flow",
            duration: "45 min",
            objectives: [
              "Write Python scripts with variables and types",
              "Use loops and conditionals",
              "Define and call functions",
            ],
            keyConcepts: [
              "Variables",
              "Data Types",
              "Control Flow",
              "Functions",
              "Lists",
              "Dictionaries",
            ],
          },
          {
            id: "python-data-structures",
            title: "Data Structures for AI",
            description: "Lists, dictionaries, and sets in practice",
            duration: "40 min",
            objectives: [
              "Choose the right data structure for the problem",
              "Manipulate lists and dictionaries efficiently",
              "Use list comprehensions for data processing",
            ],
            keyConcepts: [
              "Lists",
              "Dictionaries",
              "Sets",
              "Tuples",
              "List Comprehensions",
            ],
          },
        ],
      },
      {
        id: "scientific-python",
        title: "Scientific Python",
        description: "NumPy, Pandas, and data manipulation",
        duration: "6 hours",
        lessons: [
          {
            id: "numpy-fundamentals",
            title: "NumPy: The Foundation",
            description: "Arrays, operations, and linear algebra",
            duration: "60 min",
            objectives: [
              "Create and manipulate NumPy arrays",
              "Perform vectorized operations",
              "Apply linear algebra operations",
            ],
            keyConcepts: [
              "ndarray",
              "Vectorization",
              "Broadcasting",
              "Linear Algebra",
              "Random Numbers",
            ],
          },
          {
            id: "pandas-dataframes",
            title: "Pandas: Data Wrangling",
            description: "DataFrames, cleaning, and analysis",
            duration: "60 min",
            objectives: [
              "Load and inspect datasets with Pandas",
              "Clean and transform data",
              "Perform groupby operations and aggregations",
            ],
            keyConcepts: [
              "DataFrame",
              "Series",
              "Data Cleaning",
              "GroupBy",
              "Merge",
              "Apply",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    subtitle: "From theory to production models",
    description:
      "A rigorous, hands-on course covering supervised, unsupervised, and evaluation methods.",
    difficulty: "Intermediate",
    duration: "10 weeks",
    enrolledStudents: 7200,
    rating: 4.9,
    instructor: "Dr. Elena Rodriguez",
    skills: [
      "Scikit-learn",
      "Regression",
      "Classification",
      "Clustering",
      "Model Evaluation",
    ],
    prerequisites: ["python-for-ai", "mathematics-for-ai"],
    modules: [
      {
        id: "linear-models",
        title: "Linear Models",
        description: "The workhorses of machine learning",
        duration: "5 hours",
        lessons: [
          {
            id: "linear-regression",
            title: "Linear Regression",
            description: "Fitting lines to data",
            duration: "45 min",
            objectives: [
              "Understand the linear regression equation",
              "Implement gradient descent from scratch",
              "Evaluate model fit with R-squared",
            ],
            keyConcepts: [
              "Linear Regression",
              "Cost Function",
              "Gradient Descent",
              "R-Squared",
              "Overfitting",
            ],
          },
          {
            id: "logistic-regression",
            title: "Logistic Regression",
            description: "Classification with probabilities",
            duration: "40 min",
            objectives: [
              "Understand the sigmoid function",
              "Implement logistic regression",
              "Interpret classification metrics",
            ],
            keyConcepts: [
              "Logistic Regression",
              "Sigmoid",
              "Binary Classification",
              "Cross-Entropy Loss",
            ],
          },
        ],
      },
      {
        id: "tree-models",
        title: "Tree-Based Models",
        description: "Decision trees and ensemble methods",
        duration: "6 hours",
        lessons: [
          {
            id: "decision-trees",
            title: "Decision Trees",
            description: "Learning by splitting",
            duration: "45 min",
            objectives: [
              "Understand how decision trees split data",
              "Explain impurity measures (Gini, Entropy)",
              "Prune trees to prevent overfitting",
            ],
            keyConcepts: [
              "Decision Tree",
              "Gini Impurity",
              "Entropy",
              "Information Gain",
              "Pruning",
            ],
          },
          {
            id: "random-forests",
            title: "Random Forests",
            description: "Ensemble power through diversity",
            duration: "40 min",
            objectives: [
              "Understand bagging and random feature selection",
              "Train and evaluate random forests",
              "Interpret feature importance",
            ],
            keyConcepts: [
              "Random Forest",
              "Bagging",
              "Feature Importance",
              "Ensemble Methods",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    subtitle: "Neural networks and beyond",
    description:
      "Build and train neural networks from scratch. CNNs, RNNs, transformers, and modern architectures.",
    difficulty: "Intermediate",
    duration: "12 weeks",
    enrolledStudents: 5400,
    rating: 4.8,
    instructor: "Dr. James Okafor",
    skills: [
      "PyTorch",
      "Neural Networks",
      "CNNs",
      "RNNs",
      "Transformers",
      "GPU Training",
    ],
    prerequisites: ["machine-learning", "python-for-ai"],
    modules: [
      {
        id: "neural-network-fundamentals",
        title: "Neural Network Fundamentals",
        description: "The building blocks of deep learning",
        duration: "8 hours",
        lessons: [
          {
            id: "perceptrons",
            title: "From Perceptrons to Networks",
            description: "How neurons compute and learn",
            duration: "45 min",
            objectives: [
              "Explain how a single perceptron makes decisions",
              "Understand activation functions and their purposes",
              "Build a multi-layer perceptron from scratch",
            ],
            keyConcepts: [
              "Perceptron",
              "Weights",
              "Bias",
              "Activation Functions",
              "Universal Approximation",
            ],
          },
          {
            id: "backpropagation",
            title: "Backpropagation",
            description: "How networks learn through gradient flow",
            duration: "50 min",
            objectives: [
              "Trace how gradients flow through a network",
              "Implement backpropagation manually",
              "Understand the vanishing gradient problem",
            ],
            keyConcepts: [
              "Chain Rule",
              "Gradient Descent",
              "Vanishing Gradients",
              "Exploding Gradients",
              "Learning Rate",
            ],
          },
          {
            id: "pytorch-intro",
            title: "PyTorch Fundamentals",
            description: "Tensors, autograd, and building models",
            duration: "60 min",
            objectives: [
              "Create and manipulate tensors in PyTorch",
              "Use autograd for automatic differentiation",
              "Define a neural network using nn.Module",
            ],
            keyConcepts: [
              "Tensors",
              "Autograd",
              "nn.Module",
              "Loss Functions",
              "Optimizers",
            ],
          },
        ],
      },
      {
        id: "convolutional-networks",
        title: "Convolutional Neural Networks",
        description: "Teaching machines to see",
        duration: "10 hours",
        lessons: [
          {
            id: "convolutions",
            title: "Convolutional Layers",
            description: "Filters, feature maps, and spatial hierarchies",
            duration: "50 min",
            objectives: [
              "Explain how convolutional filters detect features",
              "Understand stride, padding, and output dimensions",
              "Visualize what different filters learn",
            ],
            keyConcepts: [
              "Convolution",
              "Filters",
              "Feature Maps",
              "Stride",
              "Padding",
              "Pooling",
            ],
          },
          {
            id: "cnn-architectures",
            title: "Classic CNN Architectures",
            description: "LeNet, AlexNet, ResNet, and the evolution",
            duration: "45 min",
            objectives: [
              "Trace the evolution of CNN architectures",
              "Understand skip connections in ResNet",
              "Choose an architecture for a given problem",
            ],
            keyConcepts: [
              "LeNet",
              "AlexNet",
              "VGG",
              "ResNet",
              "Skip Connections",
              "Transfer Learning",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "natural-language-processing",
    title: "Natural Language Processing",
    subtitle: "Understanding and generating human language",
    description:
      "From tokenization to transformers. Build systems that understand, generate, and reason about text.",
    difficulty: "Advanced",
    duration: "14 weeks",
    enrolledStudents: 3800,
    rating: 4.9,
    instructor: "Dr. Aisha Patel",
    skills: [
      "Hugging Face",
      "Transformers",
      "BERT",
      "GPT",
      "Tokenization",
      "Fine-tuning",
    ],
    prerequisites: ["deep-learning", "machine-learning"],
    modules: [
      {
        id: "text-fundamentals",
        title: "Text Processing Fundamentals",
        description: "Making text machine-readable",
        duration: "6 hours",
        lessons: [
          {
            id: "tokenization",
            title: "Tokenization Strategies",
            description: "Words, subwords, and byte-pair encoding",
            duration: "45 min",
            objectives: [
              "Compare word-level, character-level, and subword tokenization",
              "Implement BPE tokenization",
              "Understand vocabulary size tradeoffs",
            ],
            keyConcepts: [
              "Tokenization",
              "BPE",
              "WordPiece",
              "SentencePiece",
              "Vocabulary",
            ],
          },
          {
            id: "word-embeddings",
            title: "Word Embeddings",
            description: "Dense representations of language",
            duration: "50 min",
            objectives: [
              "Understand word2vec and GloVe",
              "Explore semantic relationships in embedding space",
              "Apply pre-trained embeddings to downstream tasks",
            ],
            keyConcepts: [
              "Word2Vec",
              "GloVe",
              "Cosine Similarity",
              "Embedding Space",
              "Semantic Relationships",
            ],
          },
        ],
      },
      {
        id: "transformer-architecture",
        title: "The Transformer Architecture",
        description: "Attention is all you need",
        duration: "12 hours",
        lessons: [
          {
            id: "self-attention",
            title: "Self-Attention Mechanism",
            description: "How tokens attend to each other",
            duration: "60 min",
            objectives: [
              "Explain the query-key-value framework",
              "Compute scaled dot-product attention",
              "Understand multi-head attention",
            ],
            keyConcepts: [
              "Self-Attention",
              "Queries",
              "Keys",
              "Values",
              "Multi-Head Attention",
              "Scaled Dot Product",
            ],
          },
          {
            id: "bert-gpt",
            title: "BERT and GPT",
            description: "Encoder vs decoder architectures",
            duration: "55 min",
            objectives: [
              "Contrast BERT's masked language modeling with GPT's autoregressive approach",
              "Fine-tune BERT for classification",
              "Generate text with GPT models",
            ],
            keyConcepts: [
              "BERT",
              "GPT",
              "Masked Language Modeling",
              "Autoregressive Generation",
              "Fine-tuning",
              "Prompt Engineering",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ai-ethics",
    title: "AI Ethics & Safety",
    subtitle: "Building responsible AI systems",
    description:
      "Bias, fairness, transparency, and accountability in AI. Technical and philosophical perspectives.",
    difficulty: "Advanced",
    duration: "8 weeks",
    enrolledStudents: 4200,
    rating: 4.7,
    instructor: "Dr. Sarah Kim",
    skills: [
      "Fairness Metrics",
      "Explainable AI",
      "Bias Detection",
      "AI Governance",
      "Responsible Design",
    ],
    prerequisites: ["ai-foundations", "machine-learning"],
    modules: [
      {
        id: "bias-fairness",
        title: "Bias and Fairness",
        description: "Technical and social dimensions of algorithmic bias",
        duration: "8 hours",
        lessons: [
          {
            id: "sources-of-bias",
            title: "Sources of Bias in AI",
            description: "Where bias enters the pipeline",
            duration: "45 min",
            objectives: [
              "Identify bias in data collection, labeling, and feature engineering",
              "Understand historical and representation bias",
              "Map bias sources to real-world harm",
            ],
            keyConcepts: [
              "Selection Bias",
              "Representation Bias",
              "Measurement Bias",
              "Aggregation Bias",
              "Evaluation Bias",
            ],
          },
          {
            id: "fairness-metrics",
            title: "Fairness Metrics",
            description: "Measuring and quantifying fairness",
            duration: "50 min",
            objectives: [
              "Define demographic parity, equalized odds, and calibration",
              "Understand why fairness metrics can conflict",
              "Select appropriate metrics for a given context",
            ],
            keyConcepts: [
              "Demographic Parity",
              "Equalized Odds",
              "Calibration",
              "Individual Fairness",
              "Impossibility Theorems",
            ],
          },
        ],
      },
      {
        id: "explainability",
        title: "Explainable AI",
        description: "Making black boxes interpretable",
        duration: "6 hours",
        lessons: [
          {
            id: "xai-methods",
            title: "Explanation Methods",
            description: "LIME, SHAP, attention visualization",
            duration: "55 min",
            objectives: [
              "Apply LIME to explain individual predictions",
              "Use SHAP values for feature importance",
              "Critique explanations for faithfulness and stability",
            ],
            keyConcepts: [
              "LIME",
              "SHAP",
              "Feature Importance",
              "Attention Maps",
              "Counterfactual Explanations",
            ],
          },
        ],
      },
    ],
  },
];
