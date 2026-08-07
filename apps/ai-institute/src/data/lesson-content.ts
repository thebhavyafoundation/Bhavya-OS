export interface NotebookCell {
  type: "code" | "markdown";
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LabStep {
  instruction: string;
  code?: string;
  hint?: string;
}

export interface AssignmentTask {
  task: string;
  criteria: string[];
}

export interface LessonContent {
  id: string;
  title: string;
  stageId: string;
  objectives: string[];
  prerequisites: string[];
  visualExplanation: string;
  codeExample: string;
  notebookCells: NotebookCell[];
  lab: {
    title: string;
    description: string;
    steps: LabStep[];
    expectedOutput: string;
  };
  quiz: QuizQuestion[];
  assignment: {
    title: string;
    description: string;
    tasks: AssignmentTask[];
  };
  miniProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
  capstoneLinkage: string;
  researchReferences: string[];
  githubImplementations: string[];
  commonMisconceptions: string[];
  interviewQuestions: string[];
  revisionSummary: string;
}

export const lessonContent: LessonContent[] = [
  {
    id: "defining-ai",
    title: "Defining AI",
    stageId: "stage-1-ai-foundations",
    objectives: [
      "Define artificial intelligence in your own words",
      "Distinguish between AI, machine learning, and deep learning",
      "Identify AI systems you already use daily",
      "Understand the taxonomy of intelligent systems",
      "Explain why AI definitions have shifted over time",
    ],
    prerequisites: [],
    visualExplanation:
      "Imagine a set of nested circles. The outermost circle is labeled Artificial Intelligence — the broadest field. Inside it is Machine Learning, a subset that learns from data. Inside ML is Deep Learning, which uses neural networks with many layers. Every deep learning system is machine learning, and every machine learning system is AI, but not every AI system uses machine learning.",
    codeExample: `# AI taxonomy demonstration
ai_types = {
    'rule_based': 'Expert systems, chess engines, spam filters',
    'machine_learning': 'Linear regression, decision trees, SVMs',
    'deep_learning': 'CNNs, RNNs, transformers, GANs'
}

def classify_system(system_name):
    if system_name in ai_types['deep_learning']:
        return 'Deep Learning'
    elif system_name in ai_types['machine_learning']:
        return 'Machine Learning'
    else:
        return 'AI'

print(classify_system('transformer'))
print(classify_system('linear regression'))`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# What is Artificial Intelligence?\n\nAI is the broad discipline of creating machines that perform tasks requiring human intelligence — perception, reasoning, learning, and decision-making.",
      },
      {
        type: "code",
        content: `# The AI taxonomy
ai_systems = {
    'AI': 'Any machine mimicking human intelligence',
    'ML': 'AI that learns from data',
    'DL': 'ML using neural networks with 3+ layers'
}

for level, definition in ai_systems.items():
    print(f'{level}: {definition}')`,
      },
      {
        type: "markdown",
        content:
          "## Every Day AI\nYou interact with AI constantly: voice assistants, recommendation engines, navigation apps, and email spam filters.",
      },
      {
        type: "code",
        content: `# Example: simple rule-based AI
def is_spam(email):
    spam_keywords = ['free', 'winner', 'click here']
    score = sum(1 for word in spam_keywords if word in email.lower())
    return score >= 2

print(is_spam('You are a winner! Click here for free money'))
print(is_spam('Meeting at 3pm tomorrow'))`,
      },
    ],
    lab: {
      title: "Classify Real-World Systems",
      description:
        "Given a list of real-world systems, classify each as AI, ML, or DL and justify your reasoning.",
      steps: [
        {
          instruction:
            "Create a dictionary mapping system names to their descriptions",
          code: `systems = {
    'Siri': 'Voice assistant using speech recognition',
    'Spam Filter': 'Rule-based email classification',
    'Netflix': 'Collaborative filtering algorithm',
    'ChatGPT': 'Large language model based on transformers',
    'Chess Engine': 'Minimax with alpha-beta pruning',
    'Self-Driving Car': 'Perception and planning with neural networks'
}`,
        },
        {
          instruction:
            "Write a function that classifies each system into the correct taxonomy tier",
          code: `def classify(name, description):
    dl_keywords = ['neural network', 'transformer', 'deep learning', 'CNN', 'RNN']
    ml_keywords = ['algorithm', 'learning', 'filtering', 'prediction']
    desc_lower = description.lower()
    for kw in dl_keywords:
        if kw.lower() in desc_lower:
            return 'Deep Learning'
    for kw in ml_keywords:
        if kw.lower() in desc_lower:
            return 'Machine Learning'
    return 'Rule-based AI'`,
        },
        {
          instruction:
            "Loop through all systems and print their classifications",
          hint: "Use items() to iterate over the dictionary",
        },
      ],
      expectedOutput:
        "A classified list showing each system mapped to its taxonomy tier with justification.",
    },
    quiz: [
      {
        question: "Which of the following is a subset of machine learning?",
        options: [
          "Artificial Intelligence",
          "Deep Learning",
          "Expert Systems",
          "Robotics",
        ],
        correctIndex: 1,
        explanation:
          "Deep learning is a subset of machine learning that uses neural networks with many layers to learn representations from data.",
      },
      {
        question: "A spam filter that uses keyword rules is an example of:",
        options: [
          "Deep Learning",
          "Machine Learning",
          "Rule-based AI",
          "Reinforcement Learning",
        ],
        correctIndex: 2,
        explanation:
          "Rule-based systems follow handcrafted if-then logic. They are a form of AI but do not learn from data.",
      },
      {
        question: "Why has the definition of AI shifted over time?",
        options: [
          "Because AI was originally about robots",
          "Because capabilities once considered intelligent became routine",
          "Because machines became less powerful",
          "Because researchers lost interest in AI",
        ],
        correctIndex: 1,
        explanation:
          "As tasks like chess or speech recognition became achievable, the bar for what counts as intelligent rose. This is sometimes called the AI effect.",
      },
      {
        question: "Which statement is true?",
        options: [
          "All deep learning is machine learning",
          "All machine learning is deep learning",
          "AI and ML are the same thing",
          "Deep learning does not use data",
        ],
        correctIndex: 0,
        explanation:
          "Deep learning is a specialized form of ML that uses deep neural networks. The relationship is: AI contains ML, which contains DL.",
      },
    ],
    assignment: {
      title: "AI Landscape Map",
      description:
        "Research and map the AI landscape in a domain of your choice (healthcare, finance, education, or transportation).",
      tasks: [
        {
          task: "Identify 5 AI systems used in your chosen domain",
          criteria: [
            "Each system must be real and currently deployed",
            "Include the company or organization behind each system",
          ],
        },
        {
          task: "Classify each system on the AI taxonomy",
          criteria: [
            "Correctly label as rule-based, ML, or DL",
            "Provide a one-sentence justification for each",
          ],
        },
        {
          task: "Write a 300-word analysis of how AI is transforming the domain",
          criteria: [
            "Mention at least 3 specific benefits",
            "Discuss at least 2 limitations or risks",
          ],
        },
      ],
    },
    miniProject: {
      title: "AI System Catalog",
      description:
        "Build a simple catalog of 20 AI systems across different industries. For each, record the name, company, what it does, and which taxonomy tier it belongs to.",
      deliverables: [
        "A structured dataset (JSON, CSV, or spreadsheet) with 20 entries",
        "A visual diagram showing the AI taxonomy with real examples in each tier",
        "A 200-word reflection on which category has the most real-world impact and why",
      ],
    },
    capstoneLinkage:
      "This lesson establishes the vocabulary for the entire program. Every subsequent course builds on the distinction between rule-based systems, machine learning, and deep learning.",
    researchReferences: [
      "Turing, A. M. (1950). Computing Machinery and Intelligence. Mind, 59(236), 433-460.",
      "McCarthy, J. (2007). What is Artificial Intelligence? Stanford University.",
      "Russell, S. J., and Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.",
      "Silver, D. et al. (2016). Mastering the game of Go with deep neural networks and tree search. Nature, 529(7587), 484-489.",
    ],
    githubImplementations: [
      "https://github.com/tensorflow/tensorflow",
      "https://github.com/pytorch/pytorch",
      "https://github.com/scikit-learn/scikit-learn",
      "https://github.com/huggingface/transformers",
    ],
    commonMisconceptions: [
      "AI is not the same as robots. AI is software intelligence; robots are physical embodiments.",
      "Machine learning does not think. It finds statistical patterns in data and uses those patterns to make predictions.",
      "Deep learning is not always better than simpler methods. For small datasets or interpretable models, traditional ML often outperforms deep learning.",
      "AI is not magic. Every AI system operates within constraints defined by its training data, architecture, and objective function.",
    ],
    interviewQuestions: [
      "Can you explain the difference between AI, ML, and deep learning to a non-technical stakeholder?",
      "Give an example of a task where rule-based AI would be preferable to machine learning.",
      "What are the limitations of current AI systems that are commonly called intelligent?",
      "How would you determine whether a problem is suitable for an ML approach versus a rule-based approach?",
    ],
    revisionSummary:
      "AI is the broad field of making machines perform tasks requiring human intelligence. Machine learning is a subset where systems learn from data. Deep learning is a further subset using multi-layered neural networks. Every real-world AI system fits into this taxonomy, and understanding which tier applies helps you choose the right tools and set realistic expectations.",
  },
  {
    id: "history-of-ai",
    title: "History of AI",
    stageId: "stage-1-ai-foundations",
    objectives: [
      "Trace the key milestones in AI history from the 1940s to present",
      "Understand the AI winters and their causes",
      "Recognize the breakthroughs that led to modern AI",
      "Connect historical developments to current technologies",
    ],
    prerequisites: ["defining-ai"],
    visualExplanation:
      "Picture a timeline stretching from 1943 to today. Early peaks (Turing's ideas, early perceptrons) are followed by valleys (AI winters in the 1970s and late 1980s) where funding dried up. The modern era begins around 2012 when deep learning won ImageNet, and the curve shoots upward through transformers (2017) and large language models (2020s).",
    codeExample: `# Timeline of AI milestones
milestones = [
    (1943, 'McCulloch-Pitts neuron', 'Mathematical model of a neuron'),
    (1950, 'Turing Test', 'Proposed test for machine intelligence'),
    (1956, 'Dartmouth Conference', 'AI coined as a field'),
    (1958, 'Perceptron', 'First learning machine (Rosenblatt)'),
    (1969, 'Perceptrons book', 'Minsky and Papert exposed limitations'),
    (1974, 'First AI Winter', 'Funding cuts due to unmet promises'),
    (1986, 'Backpropagation', 'Rumelhart, Hinton, Williams'),
    (1997, 'Deep Blue', 'IBM beats world chess champion'),
    (2012, 'AlexNet', 'Deep learning wins ImageNet'),
    (2017, 'Attention is All You Need', 'Transformer architecture paper'),
    (2022, 'ChatGPT', 'GPT-3.5 reaches mainstream audience'),
]

for year, event, detail in milestones:
    print(f'{year}: {event} - {detail}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# A Brief History of AI\n\nFrom Turing's 1950 paper to ChatGPT, the field has experienced cycles of excitement, disappointment, and breakthrough.",
      },
      {
        type: "code",
        content: `# Key eras of AI
eras = {
    '1943-1970': 'Foundations - neurons, perceptrons, early optimism',
    '1970-1993': 'Two AI winters - funding dried up after broken promises',
    '1993-2011': 'Practical ML - SVMs, random forests, statistical methods',
    '2012-present': 'Deep learning revolution - GPUs, big data, transformers'
}

for era, description in eras.items():
    print(f'{era}: {description}')`,
      },
      {
        type: "markdown",
        content:
          "## Why AI Winters Happened\n\nAI winters occurred when researchers over-promised and under-delivered. Expert systems of the 1980s were expensive to maintain and brittle. When their limitations became clear, funding collapsed.",
      },
      {
        type: "code",
        content: `# What enabled the modern AI revolution
factors = [
    'GPU computing (1000x speedup for neural nets)',
    'Big data (internet created massive datasets)',
    'Better algorithms (ReLU, batch norm, dropout)',
    'Open-source frameworks (TensorFlow, PyTorch)',
    'Transformer architecture (scales with data and compute)'
]

for i, factor in enumerate(factors, 1):
    print(f'{i}. {factor}')`,
      },
    ],
    lab: {
      title: "Build a Historical Timeline",
      description:
        "Create an interactive timeline of AI history and identify patterns that predict future developments.",
      steps: [
        {
          instruction:
            "Define a list of 15 AI milestones with year, name, and significance",
          code: `milestones = [
    {'year': 1943, 'name': 'McCulloch-Pitts neuron', 'significance': 'First mathematical model of a neuron'},
    {'year': 1956, 'name': 'Dartmouth Conference', 'significance': 'AI field officially founded'},
    {'year': 2012, 'name': 'AlexNet', 'significance': 'Deep learning proves superior on ImageNet'}
]`,
        },
        {
          instruction:
            "Write a function that identifies AI winters (gaps of 5+ years between major breakthroughs)",
          code: `def find_winters(milestones):
    years = sorted([m['year'] for m in milestones])
    winters = []
    for i in range(1, len(years)):
        gap = years[i] - years[i-1]
        if gap >= 5:
            winters.append((years[i-1], years[i], gap))
    return winters`,
        },
        {
          instruction:
            "Analyze whether breakthroughs cluster around specific time periods",
          hint: "Look at the distribution of milestones across decades",
        },
      ],
      expectedOutput:
        "A list of AI winters and a pattern analysis of breakthrough clusters.",
    },
    quiz: [
      {
        question: "In what year was the term Artificial Intelligence coined?",
        options: ["1943", "1950", "1956", "1969"],
        correctIndex: 2,
        explanation:
          "John McCarthy coined Artificial Intelligence at the Dartmouth Conference in 1956, marking the official founding of the field.",
      },
      {
        question: "What was the primary cause of the first AI winter?",
        options: [
          "Computers were too slow",
          "Unmet promises and reduced funding",
          "A global economic recession",
          "The internet did not exist yet",
        ],
        correctIndex: 1,
        explanation:
          "AI researchers over-promised capabilities. When expert systems proved expensive and brittle, funding agencies pulled back.",
      },
      {
        question:
          "Which event in 2012 is widely considered the start of the deep learning revolution?",
        options: [
          "IBM Watson on Jeopardy",
          "AlphaGo defeating a world champion",
          "AlexNet winning the ImageNet competition",
          "The publication of the transformer paper",
        ],
        correctIndex: 2,
        explanation:
          "AlexNet, a deep convolutional neural network, dramatically outperformed traditional methods on ImageNet, proving deep learning's practical potential.",
      },
      {
        question: "The transformer architecture was introduced in which paper?",
        options: [
          "Deep Residual Learning (2015)",
          "Attention Is All You Need (2017)",
          "ImageNet Classification with Deep CNNs (2012)",
          "Generative Adversarial Networks (2014)",
        ],
        correctIndex: 1,
        explanation:
          "Vaswani et al. published Attention Is All You Need in 2017, introducing the transformer which powers GPT, BERT, and most modern language models.",
      },
    ],
    assignment: {
      title: "AI History Analysis",
      description:
        "Write a research essay connecting historical AI developments to current technologies.",
      tasks: [
        {
          task: "Create a detailed timeline of at least 10 AI milestones",
          criteria: [
            "Include year, key figure, and technical contribution",
            "Cover at least 3 different decades",
          ],
        },
        {
          task: "Analyze the pattern of AI winters",
          criteria: [
            "Identify at least 2 distinct AI winter periods",
            "Explain the technical and economic causes",
            "Discuss how the current era avoids these pitfalls",
          ],
        },
        {
          task: "Connect a historical breakthrough to a modern application",
          criteria: [
            "Choose one specific historical moment",
            "Show how it directly enabled a technology used today",
            "Explain the chain of developments in between",
          ],
        },
      ],
    },
    miniProject: {
      title: "AI History Documentary Script",
      description:
        "Write a 10-minute documentary script covering the most important moments in AI history.",
      deliverables: [
        "A structured script with narration and visual cues for 10 key moments",
        "At least 3 direct quotes from pioneering researchers",
        "A final section connecting past developments to what you think will happen next",
      ],
    },
    capstoneLinkage:
      "Understanding where AI came from helps you anticipate where it is going. The patterns of hype, disappointment, and breakthrough recur — recognizing them is a professional skill.",
    researchReferences: [
      "Turing, A. M. (1950). Computing Machinery and Intelligence. Mind, 59(236), 433-460.",
      "Minsky, M., and Papert, S. (1969). Perceptrons: An Introduction to Computational Geometry. MIT Press.",
      "LeCun, Y., Bengio, Y., and Hinton, G. (2015). Deep learning. Nature, 521(7553), 436-444.",
      "Vaswani, A. et al. (2017). Attention is All You Need. Advances in Neural Information Processing Systems.",
    ],
    githubImplementations: [
      "https://github.com/microsoft/CNTK",
      "https://github.com/BVLC/caffe",
      "https://github.com/tensorflow/models",
      "https://github.com/pytorch/examples",
    ],
    commonMisconceptions: [
      "AI did not start with deep learning. Statistical and symbolic methods existed for decades before.",
      "AI winters were not failures — they were corrections that led to more realistic and robust approaches.",
      "The transformer was not the first attention mechanism. Bahdanau introduced attention for seq2seq models in 2014.",
      "Moore's Law alone did not enable modern AI. Algorithmic innovations were equally important.",
    ],
    interviewQuestions: [
      "What caused the AI winters, and how does the current era differ?",
      "How did the transformer architecture change the trajectory of NLP research?",
      "Which historical AI figure do you think had the most lasting impact, and why?",
      "What lessons from AI history should today's AI practitioners keep in mind?",
    ],
    revisionSummary:
      "AI began in the 1940s-50s with theoretical foundations. Two AI winters (1970s, late 1980s) followed cycles of over-promising. Practical ML emerged in the 1990s-2000s with statistical methods. The deep learning revolution began in 2012 with AlexNet, accelerated by GPUs and big data. The 2017 transformer paper launched the current era of large language models.",
  },
  {
    id: "types-of-ai-systems",
    title: "Types of AI Systems",
    stageId: "stage-1-ai-foundations",
    objectives: [
      "Classify AI systems by capability level",
      "Explain the difference between reactive and proactive AI",
      "Understand where current AI sits on the capability spectrum",
      "Distinguish between narrow AI and theoretical general AI",
    ],
    prerequisites: ["defining-ai", "history-of-ai"],
    visualExplanation:
      "Think of a spectrum from left to right. On the far left is Reactive AI — it responds to inputs with fixed rules (like a calculator). Moving right is Limited Memory AI — it uses recent data (like self-driving cars). Further right is Theory of Mind AI — systems that model other agents' beliefs (not yet achieved). On the far right is Self-Aware AI — machines with consciousness (purely theoretical). Current AI lives firmly in the Reactive to Limited Memory range.",
    codeExample: `# Classifying AI systems by capability
ai_levels = {
    'Type 1 - Reactive': {
        'description': 'No memory, no learning, pure reaction',
        'examples': ['IBM Deep Blue', 'Chess engines', 'Calculator'],
        'capability': 1
    },
    'Type 2 - Limited Memory': {
        'description': 'Uses recent past data for decisions',
        'examples': ['Self-driving cars', 'ChatGPT', 'Recommendation engines'],
        'capability': 2
    },
    'Type 3 - Theory of Mind': {
        'description': 'Models beliefs and emotions of others',
        'examples': ['Not yet achieved', 'Research prototypes'],
        'capability': 3
    },
    'Type 4 - Self-Aware': {
        'description': 'Consciousness and self-understanding',
        'examples': ['Purely theoretical'],
        'capability': 4
    }
}

for level, info in ai_levels.items():
    print(f'{level}: {info["description"]}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Types of AI Systems\n\nAI systems can be classified by their capability level, from simple reactive systems to theoretical self-aware machines.",
      },
      {
        type: "code",
        content: `# Capability spectrum
def assess_capability(system):
    capabilities = {
        'reactive': ['no memory', 'no learning', 'fixed rules'],
        'limited_memory': ['uses recent data', 'learns patterns', 'context-aware'],
        'theory_of_mind': ['models beliefs', 'understands emotions', 'predicts behavior'],
        'self_aware': ['consciousness', 'self-reflection', 'autonomous goals']
    }
    return capabilities.get(system, ['unknown'])

print(assess_capability('limited_memory'))`,
      },
      {
        type: "markdown",
        content:
          "## Where Current AI Stands\n\nAll commercial AI today is either reactive or limited memory. Systems like ChatGPT use limited memory (context windows) but do not have theory of mind or self-awareness.",
      },
    ],
    lab: {
      title: "Capability Assessment Framework",
      description:
        "Build a framework that evaluates any AI system against capability criteria and determines its classification.",
      steps: [
        {
          instruction: "Define criteria for each AI type",
          code: `criteria = {
    'reactive': ['responds to input only', 'no learning from data', 'fixed behavior'],
    'limited_memory': ['uses past experiences', 'adapts over time', 'context-dependent'],
    'theory_of_mind': ['models other minds', 'understands intent', 'empathetic response'],
    'self_aware': ['knows it exists', 'has goals', 'reflects on own thinking']
}`,
        },
        {
          instruction:
            "Write a scoring function that rates a system on each criterion",
          code: `def score_system(system_name, responses):
    scores = {}
    for ai_type, questions in criteria.items():
        score = sum(1 for q in questions if q in responses)
        scores[ai_type] = score
    return scores`,
        },
        {
          instruction: "Determine the highest matching capability tier",
          hint: "Find the tier with the highest score and verify it is at least 2 out of 3",
        },
      ],
      expectedOutput:
        "A classification of the given AI system into its capability tier with supporting evidence.",
    },
    quiz: [
      {
        question:
          "Which type of AI system can learn from past experiences but has no understanding of other minds?",
        options: [
          "Reactive AI",
          "Limited Memory AI",
          "Theory of Mind AI",
          "Self-Aware AI",
        ],
        correctIndex: 1,
        explanation:
          "Limited Memory AI uses past data to make decisions (like self-driving cars using recent sensor data) but does not model the beliefs of other agents.",
      },
      {
        question:
          "A chess engine that evaluates board positions without remembering previous games is an example of:",
        options: [
          "Limited Memory AI",
          "Reactive AI",
          "Theory of Mind AI",
          "General AI",
        ],
        correctIndex: 1,
        explanation:
          "Pure chess engines evaluate the current board position without memory of past games — they are reactive systems.",
      },
      {
        question: "What distinguishes narrow AI from general AI?",
        options: [
          "Narrow AI is more powerful",
          "Narrow AI excels at specific tasks; general AI can perform any intellectual task",
          "General AI does not use data",
          "Narrow AI is always rule-based",
        ],
        correctIndex: 1,
        explanation:
          "Narrow AI (like image classifiers or chatbots) performs specific tasks well. General AI (AGI) would match human flexibility across all cognitive domains.",
      },
      {
        question: "Theory of Mind AI would need to:",
        options: [
          "Process images faster",
          "Model the beliefs, desires, and intentions of other agents",
          "Have more training data",
          "Run on quantum computers",
        ],
        correctIndex: 1,
        explanation:
          "Theory of Mind AI would understand that other agents have different knowledge, beliefs, and goals — a key element of social intelligence that current AI lacks.",
      },
    ],
    assignment: {
      title: "AI Capability Audit",
      description:
        "Audit 10 real-world AI systems and classify each on the capability spectrum.",
      tasks: [
        {
          task: "Select 10 AI systems across different domains",
          criteria: [
            "Include at least 3 different industries",
            "Choose systems with publicly available documentation",
          ],
        },
        {
          task: "Classify each system by capability type",
          criteria: [
            "Assign each to reactive, limited memory, theory of mind, or self-aware",
            "Provide evidence from documentation or behavior",
          ],
        },
        {
          task: "Write a prediction for when theory of mind AI might emerge",
          criteria: [
            "Cite at least 2 current research directions",
            "Discuss technical barriers",
            "Be realistic rather than speculative",
          ],
        },
      ],
    },
    miniProject: {
      title: "AI Spectrum Visualizer",
      description:
        "Build a web page or visualization that maps 20 AI systems onto the capability spectrum, showing their capabilities and limitations.",
      deliverables: [
        "A visual diagram or interactive page showing the spectrum",
        "At least 20 AI systems mapped to their correct position",
        "A brief analysis of why no current system reaches Theory of Mind",
      ],
    },
    capstoneLinkage:
      "Knowing the capability type of an AI system helps you set realistic expectations and choose the right architecture. Most practical AI work involves limited memory systems.",
    researchReferences: [
      "Goertzel, B., and Pennachin, C. (2007). Artificial General Intelligence. Springer.",
      "Russell, S. (2019). Human Compatible: Artificial Intelligence and the Problem of Control. Viking.",
      "Chollet, F. (2019). On the Measure of Intelligence. arXiv:1911.01547.",
    ],
    githubImplementations: [
      "https://github.com/goertzel/gnosis",
      "https://github.com/openscientist/agi",
      "https://github.com/FacebookResearch/DeepEval",
    ],
    commonMisconceptions: [
      "Current AI is not almost general AI. The gap between narrow and general AI is qualitative, not just quantitative.",
      "ChatGPT is not theory of mind. It simulates understanding of beliefs through pattern matching, not actual mental modeling.",
      "Self-aware AI is not a near-term possibility. We do not yet have a scientific definition of consciousness, let alone a way to implement it.",
      "More parameters do not make an AI system more general. GPT-4 is still narrow — it excels at language but cannot drive a car or perform surgery.",
    ],
    interviewQuestions: [
      "Where does current commercial AI fall on the capability spectrum? Give examples.",
      "What would need to be true for an AI system to qualify as Theory of Mind?",
      "Is it possible to build general AI by scaling up narrow AI systems? Why or why not?",
      "How would you explain the difference between narrow and general AI to a CEO deciding on an AI investment?",
    ],
    revisionSummary:
      "AI systems range from reactive (no memory, fixed rules) through limited memory (uses past data, like ChatGPT and self-driving cars) to theoretical levels (Theory of Mind, Self-Aware) that do not yet exist. All current commercial AI is narrow — it excels at specific tasks but lacks the flexibility of human intelligence.",
  },
  {
    id: "the-ai-workflow",
    title: "The AI Workflow",
    stageId: "stage-1-ai-foundations",
    objectives: [
      "Map the end-to-end AI project lifecycle from problem to deployment",
      "Identify the key stages: data collection, preprocessing, training, evaluation, deployment",
      "Understand the iterative nature of AI development",
      "Recognize common failure points in the workflow",
    ],
    prerequisites: ["defining-ai"],
    visualExplanation:
      "Picture a circular flow: Problem Definition leads to Data Collection, which feeds into Data Preprocessing, then Model Training, then Evaluation. If evaluation fails, you loop back to earlier stages. If it passes, you deploy. After deployment, you monitor and collect feedback, which leads to the next iteration. The cycle never truly ends.",
    codeExample: `# The AI workflow as a pipeline
workflow_stages = [
    '1. Problem Definition',
    '2. Data Collection',
    '3. Data Preprocessing',
    '4. Feature Engineering',
    '5. Model Selection',
    '6. Model Training',
    '7. Evaluation',
    '8. Deployment',
    '9. Monitoring',
    '10. Iteration'
]

def run_workflow(stage):
    actions = {
        '1. Problem Definition': 'Define success metrics and constraints',
        '2. Data Collection': 'Gather raw data from relevant sources',
        '3. Data Preprocessing': 'Clean, normalize, handle missing values',
        '4. Feature Engineering': 'Extract meaningful features from raw data',
        '5. Model Selection': 'Choose architecture based on problem type',
        '6. Model Training': 'Fit model to training data using optimization',
        '7. Evaluation': 'Test on held-out data, check metrics',
        '8. Deployment': 'Package model, set up serving infrastructure',
        '9. Monitoring': 'Track performance, drift, and errors',
        '10. Iteration': 'Use insights to improve data, model, or process'
    }
    return actions.get(stage, 'Unknown stage')

for stage in workflow_stages:
    print(f'{stage}: {run_workflow(stage)}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# The AI Workflow\n\nBuilding an AI system is not a one-shot process. It is an iterative cycle of defining problems, collecting data, training models, evaluating, and improving.",
      },
      {
        type: "code",
        content: `# Common failure points in the AI workflow
failures = {
    'Problem Definition': 'Vague goals, no measurable success criteria',
    'Data Collection': 'Biased samples, insufficient volume, privacy violations',
    'Preprocessing': 'Data leakage, incorrect normalization',
    'Training': 'Overfitting, wrong hyperparameters, insufficient compute',
    'Evaluation': 'Wrong metrics, test set contamination',
    'Deployment': 'Model drift, latency issues, scalability problems',
    'Monitoring': 'No alerting, ignoring distribution shifts'
}

for stage, failure in failures.items():
    print(f'{stage}: {failure}')`,
      },
      {
        type: "markdown",
        content:
          "## Why Iteration Matters\n\nThe first model is rarely the best. Each cycle through the workflow reveals new insights about data quality, model limitations, and problem framing.",
      },
    ],
    lab: {
      title: "Plan an AI Project",
      description:
        "Given a real-world problem, plan every stage of the AI workflow including potential failure modes.",
      steps: [
        {
          instruction:
            "Define a concrete AI problem with measurable success criteria",
          code: `problem = {
    'domain': 'Education',
    'problem': 'Predict which students will fail a course',
    'success_metric': 'AUC-ROC >= 0.85',
    'constraints': ['must run in real-time', 'cannot use GPA data']
}`,
        },
        {
          instruction:
            "List the data sources you would need and potential biases in each",
          code: `data_sources = [
    {'source': 'LMS login frequency', 'bias': 'students without reliable internet'},
    {'source': 'Assignment submission times', 'bias': 'students with jobs may submit late'},
    {'source': 'Quiz scores', 'bias': 'does not capture understanding vs memorization'}
]`,
        },
        {
          instruction: "Write a monitoring plan for post-deployment",
          hint: "Consider data drift, concept drift, and fairness metrics",
        },
      ],
      expectedOutput:
        "A complete project plan covering all workflow stages with identified risks and mitigations.",
    },
    quiz: [
      {
        question:
          "Which stage comes immediately after data collection in a typical AI workflow?",
        options: [
          "Model training",
          "Data preprocessing",
          "Deployment",
          "Problem definition",
        ],
        correctIndex: 1,
        explanation:
          "After collecting raw data, you must clean and preprocess it — handling missing values, normalizing, encoding, and splitting into train/test sets.",
      },
      {
        question: "What is data leakage?",
        options: [
          "When data is lost during storage",
          "When information from the test set accidentally influences training",
          "When a model memorizes training data",
          "When data is shared without permission",
        ],
        correctIndex: 1,
        explanation:
          "Data leakage occurs when the model has access to information it should not have during training, leading to unrealistically high performance metrics that do not hold in production.",
      },
      {
        question: "Why is monitoring important after deployment?",
        options: [
          "To charge customers for API calls",
          "Models degrade over time due to data drift and changing conditions",
          "To collect more training data immediately",
          "Monitoring is optional for well-trained models",
        ],
        correctIndex: 1,
        explanation:
          "The world changes. User behavior shifts, data distributions drift, and models that performed well in testing can degrade silently in production.",
      },
      {
        question:
          "What should you do if your model evaluates well but fails in production?",
        options: [
          "Deploy it anyway since the metrics are good",
          "Check for data leakage, distribution shift, and evaluation methodology",
          "Retrain with more data immediately",
          "Switch to a different model architecture",
        ],
        correctIndex: 1,
        explanation:
          "A gap between evaluation and production performance usually indicates data leakage, evaluation set contamination, or a distribution shift between training and real-world data.",
      },
    ],
    assignment: {
      title: "AI Project Blueprint",
      description:
        "Design a complete AI project from problem definition to deployment monitoring.",
      tasks: [
        {
          task: "Select a real-world problem and define measurable success criteria",
          criteria: [
            "The problem must be specific and bounded",
            "Success metrics must be quantitative and testable",
          ],
        },
        {
          task: "Design the data collection and preprocessing pipeline",
          criteria: [
            "Identify at least 3 data sources",
            "Address at least 2 potential biases",
            "Specify preprocessing steps",
          ],
        },
        {
          task: "Create a monitoring and iteration plan",
          criteria: [
            "Define what metrics to track post-deployment",
            "Describe triggers for model retraining",
            "Include fairness monitoring",
          ],
        },
      ],
    },
    miniProject: {
      title: "Workflow Poster",
      description:
        "Create a visual poster or infographic of the AI workflow tailored to a specific industry.",
      deliverables: [
        "A clear visual representation of all workflow stages",
        "Industry-specific examples for each stage",
        "A decision tree for when to collect more data vs. try a new model",
      ],
    },
    capstoneLinkage:
      "Every project in the capstone follows this workflow. Mastering it now ensures you can execute the full pipeline independently.",
    researchReferences: [
      "Sculley, D. et al. (2015). Hidden Technical Debt in Machine Learning Systems. NIPS.",
      "Paleyes, A., Thang, M., and Lawrence, N. D. (2022). Challenges in Deploying Machine Learning: a Survey of Case Studies. ACM Computing Surveys.",
      "Amershi, S. et al. (2019). Software Engineering for Machine Learning: A Case Study. ICSE-SEIP.",
    ],
    githubImplementations: [
      "https://github.com/jeffheaton/t81_558_deep_learning",
      "https://github.com/microsoft/ML-For-Beginners",
      "https://github.com/fastai/fastbook",
    ],
    commonMisconceptions: [
      "AI is not 80% data work — it is closer to 90%. Data quality determines model performance more than algorithm choice.",
      "Deployment is not the end. Models require ongoing monitoring, retraining, and updating.",
      "The best model is not always the most complex. Simpler models are easier to debug, deploy, and maintain.",
      "You do not need massive datasets to start. Many projects begin with small pilot datasets to validate the approach.",
    ],
    interviewQuestions: [
      "Walk me through the AI workflow for a project you have worked on.",
      "What is data leakage and how do you prevent it?",
      "How do you decide when to collect more data versus trying a new model?",
      "What metrics would you track after deploying a recommendation system?",
    ],
    revisionSummary:
      "The AI workflow is iterative: define the problem, collect and preprocess data, engineer features, select and train a model, evaluate, deploy, and monitor. Each stage has common failure modes. The process never truly ends — monitoring feeds back into continuous improvement.",
  },
  {
    id: "ethics-in-ai",
    title: "Ethics in AI",
    stageId: "stage-1-ai-foundations",
    objectives: [
      "Identify sources of bias in AI systems",
      "Explain the concepts of fairness, transparency, and accountability",
      "Analyze real-world cases of AI causing harm",
      "Propose ethical guidelines for AI deployment",
    ],
    prerequisites: ["defining-ai", "the-ai-workflow"],
    visualExplanation:
      "Think of three pillars holding up responsible AI. The first is Fairness — ensuring the system does not discriminate against groups. The second is Transparency — being able to explain why the system made a particular decision. The third is Accountability — having clear ownership for the system's outcomes. If any pillar is missing, the structure of trust collapses.",
    codeExample: `# Detecting bias in a dataset
def check_demographic_balance(data, group_col):
    groups = {}
    for row in data:
        group = row[group_col]
        groups.setdefault(group, []).append(row)

    print('Group distribution in dataset:')
    total = len(data)
    for group, items in groups.items():
        count = len(items)
        pct = (count / total) * 100
        print(f'  {group}: {count} samples ({pct:.1f}%)')

    counts = [len(v) for v in groups.values()]
    imbalance = max(counts) / min(counts) if min(counts) > 0 else float('inf')
    if imbalance > 2:
        print(f'WARNING: Imbalance ratio of {imbalance:.1f}x detected')
    return groups

hiring_data = [
    {'name': 'Alice', 'gender': 'F', 'hired': True},
    {'name': 'Bob', 'gender': 'M', 'hired': True},
    {'name': 'Carol', 'gender': 'F', 'hired': False},
    {'name': 'David', 'gender': 'M', 'hired': True},
    {'name': 'Eve', 'gender': 'F', 'hired': True},
    {'name': 'Frank', 'gender': 'M', 'hired': True},
    {'name': 'Grace', 'gender': 'F', 'hired': False},
    {'name': 'Hank', 'gender': 'M', 'hired': True},
]

groups = check_demographic_balance(hiring_data, 'gender')
for gender, items in groups.items():
    hired = sum(1 for item in items if item['hired'])
    rate = hired / len(items)
    print(f'  {gender} hire rate: {rate:.2%}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Ethics in AI\n\nAs AI systems make more decisions affecting human lives, understanding bias, fairness, transparency, and accountability becomes essential.",
      },
      {
        type: "code",
        content: `# Sources of AI bias
bias_sources = {
    'Historical Bias': 'Training data reflects past discrimination',
    'Representation Bias': 'Certain groups are underrepresented',
    'Measurement Bias': 'Features proxy for protected attributes',
    'Aggregation Bias': 'One model fits diverse groups differently',
    'Evaluation Bias': 'Benchmarks do not reflect real-world diversity',
    'Deployment Bias': 'System used in contexts different from design'
}

for source, description in bias_sources.items():
    print(f'{source}: {description}')`,
      },
      {
        type: "markdown",
        content:
          "## Fairness Is Multidimensional\n\nThere is no single definition of fairness. Demographic parity, equalized odds, and calibration can mathematically conflict with each other.",
      },
      {
        type: "code",
        content: `# Fairness metrics can conflict
def demographic_parity(predictions, groups):
    rates = {}
    for group in set(groups):
        group_preds = [p for p, g in zip(predictions, groups) if g == group]
        rates[group] = sum(group_preds) / len(group_preds) if group_preds else 0
    return rates

predictions = [1, 0, 1, 1, 0, 1, 0, 1]
groups = ['F', 'M', 'F', 'M', 'F', 'M', 'F', 'M']
rates = demographic_parity(predictions, groups)
for g, r in rates.items():
    print(f'{g}: acceptance rate = {r:.2%}')`,
      },
    ],
    lab: {
      title: "Bias Audit Exercise",
      description:
        "Audit a hiring dataset for bias and compute fairness metrics across demographic groups.",
      steps: [
        {
          instruction: "Create a simulated hiring dataset with potential bias",
          code: `import random
random.seed(42)

n = 200
data = []
for i in range(n):
    gender = random.choice(['F', 'M'])
    experience = random.randint(0, 15)
    score = experience * 2 + random.randint(0, 10)
    hired = score > 15 and (gender == 'M' or random.random() > 0.3)
    data.append({'gender': gender, 'experience': experience, 'score': score, 'hired': hired})`,
        },
        {
          instruction: "Compute hire rates by gender",
          code: `def compute_rates(data, group_col):
    groups = {}
    for row in data:
        g = row[group_col]
        groups.setdefault(g, []).append(row['hired'])
    return {g: sum(v)/len(v) for g, v in groups.items()}

rates = compute_rates(data, 'gender')
for g, r in rates.items():
    print(f'{g} hire rate: {r:.2%}')`,
        },
        {
          instruction:
            "Analyze what the disparity means and suggest mitigations",
          hint: "Consider resampling, reweighting, or threshold adjustment",
        },
      ],
      expectedOutput:
        "A bias report showing hire rate disparities and at least two concrete mitigation strategies.",
    },
    quiz: [
      {
        question: "What is algorithmic bias?",
        options: [
          "A bug in the code",
          "Systematic and unfair discrimination resulting from AI decisions",
          "A preference for certain algorithms",
          "Bias in the training hardware",
        ],
        correctIndex: 1,
        explanation:
          "Algorithmic bias refers to systematic and repeatable errors in an AI system that create unfair outcomes, such as discriminating against certain demographic groups.",
      },
      {
        question: "What is the fairness-accuracy trade-off?",
        options: [
          "Fair models are always less accurate",
          "Optimizing for fairness can sometimes reduce accuracy metrics, and vice versa",
          "There is no relationship between fairness and accuracy",
          "Accuracy is more important than fairness",
        ],
        correctIndex: 1,
        explanation:
          "Making a model fairer (e.g., by equalizing error rates across groups) can sometimes reduce overall accuracy. The trade-off depends on the fairness definition and context.",
      },
      {
        question: "What is the main purpose of LIME?",
        options: [
          "To train models faster",
          "To explain individual predictions by approximating the model locally",
          "To compress model size",
          "To generate synthetic data",
        ],
        correctIndex: 1,
        explanation:
          "LIME explains individual predictions by fitting a simple, interpretable model in the neighborhood of the prediction, providing local explanations faithful to the complex model.",
      },
      {
        question: "What is a model card?",
        options: [
          "A credit card for AI services",
          "A documentation framework describing a model's intended use, limitations, and performance across groups",
          "A type of neural network architecture",
          "A hardware specification for running models",
        ],
        correctIndex: 1,
        explanation:
          "Model cards are documentation that includes a model's intended use, training data, evaluation metrics broken down by demographic groups, known limitations, and ethical considerations.",
      },
    ],
    assignment: {
      title: "Ethical Impact Assessment",
      description:
        "Conduct an ethical impact assessment for an AI system being deployed in a high-stakes domain.",
      tasks: [
        {
          task: "Select a real AI deployment scenario (hiring, lending, healthcare, criminal justice)",
          criteria: [
            "Choose a system currently in production",
            "Identify the affected population",
          ],
        },
        {
          task: "Identify at least 4 potential sources of bias in the system",
          criteria: [
            "Address data collection, feature selection, model training, and deployment",
            "Provide concrete examples for each",
          ],
        },
        {
          task: "Propose a fairness framework for the system",
          criteria: [
            "Select appropriate fairness metrics",
            "Define acceptable thresholds",
            "Describe a monitoring plan",
          ],
        },
      ],
    },
    miniProject: {
      title: "Bias Detection Toolkit",
      description:
        "Build a Python toolkit that can detect and visualize bias in tabular datasets.",
      deliverables: [
        "Functions to compute demographic parity, equalized odds, and disparate impact",
        "Visualizations of group-level disparities",
        "A sample report generated from a test dataset",
      ],
    },
    capstoneLinkage:
      "Every deployed system in the capstone must include an ethics section. This lesson provides the framework for evaluating fairness and documenting responsible use.",
    researchReferences: [
      "Barocas, S., and Selbst, A. D. (2016). Big Data's Disparate Impact. California Law Review, 104(3), 671-732.",
      "Mitchell, S. et al. (2019). Model Cards for Model Reporting. FAT*.",
      "Dwork, C. et al. (2012). Fairness through Awareness. ITCS.",
      "Corbett-Davies, S., and Goel, S. (2018). The Measure and Mismeasure of Fairness. arXiv:1808.00023.",
    ],
    githubImplementations: [
      "https://github.com/algorithmicfairness/fairlearn",
      "https://github.com/IBM/AIF360",
      "https://github.com/microsoft/responsible-ai-toolbox",
    ],
    commonMisconceptions: [
      "Bias is not only a data problem. It can also arise from feature selection, model architecture, and deployment context.",
      "Fairness metrics conflict with each other. You cannot simultaneously satisfy demographic parity, equalized odds, and calibration.",
      "Removing protected attributes does not eliminate bias. Other features often serve as proxies for race, gender, or age.",
      "AI bias is not always intentional. Most bias arises from historical patterns embedded in training data.",
    ],
    interviewQuestions: [
      "How would you detect bias in a machine learning model before deployment?",
      "Explain the difference between demographic parity and equalized odds.",
      "A model has 95% overall accuracy but 70% accuracy for one demographic group. What do you do?",
      "What is a model card and why is it important?",
    ],
    revisionSummary:
      "AI ethics centers on fairness, transparency, and accountability. Bias enters through data, features, models, and deployment. Multiple fairness metrics exist but they conflict mathematically. Practical mitigation requires selecting context-appropriate metrics, auditing across groups, and maintaining ongoing monitoring after deployment.",
  },
  {
    id: "python-basics",
    title: "Python Basics",
    stageId: "stage-2-python-for-ai",
    objectives: [
      "Write Python scripts with variables and types",
      "Use loops, conditionals, and functions",
      "Understand dynamic typing and mutable vs immutable types",
      "Write clean, readable Python following PEP 8 conventions",
    ],
    prerequisites: [],
    visualExplanation:
      "Python treats everything as an object. Variables are labels pointing to objects in memory. When you write x = 5, the label x points to an integer object. When you write y = x, both labels point to the same object. Immutable objects (int, str, tuple) cannot change in place; mutable objects (list, dict, set) can.",
    codeExample: `# Variables and types in Python
name = 'Ada Lovelace'
age = 36
height = 1.65
is_pioneer = True
subjects = ['math', 'programming', 'analysis']

print(type(name))
print(type(age))
print(type(height))
print(type(is_pioneer))
print(type(subjects))

# String operations
full_name = f'First computer programmer: {name}'
print(full_name.upper())
print(full_name.split())

# List operations
subjects.append('poetry')
print(subjects)
print(f'Total subjects: {len(subjects)}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Python Basics for AI\n\nPython is the lingua franca of AI. This lesson covers the fundamental building blocks: variables, types, control flow, and functions.",
      },
      {
        type: "code",
        content: `# Variables and dynamic typing
x = 10
print(type(x))

x = 'hello'
print(type(x))

# Lists vs tuples
my_list = [1, 2, 3]
my_tuple = (1, 2, 3)
print('Lists are mutable:', type(my_list))
print('Tuples are immutable:', type(my_tuple))`,
      },
      {
        type: "markdown",
        content:
          "## Control Flow\n\nPython uses indentation to define code blocks. This enforces readable code.",
      },
      {
        type: "code",
        content: `# Conditionals and loops
scores = [85, 92, 78, 95, 88]

for score in scores:
    if score >= 90:
        grade = 'A'
    elif score >= 80:
        grade = 'B'
    else:
        grade = 'C'
    print(f'Score {score}: Grade {grade}')`,
      },
      {
        type: "markdown",
        content:
          "## Functions\n\nFunctions in Python are first-class objects. They can be passed as arguments, returned from other functions, and assigned to variables.",
      },
      {
        type: "code",
        content: `# Functions as first-class objects
def square(n):
    return n ** 2

def apply_to_list(func, data):
    return [func(x) for x in data]

numbers = [1, 2, 3, 4, 5]
squared = apply_to_list(square, numbers)
print(squared)`,
      },
    ],
    lab: {
      title: "Build a Grade Calculator",
      description:
        "Write functions to calculate, classify, and summarize student grades.",
      steps: [
        {
          instruction:
            "Create a function that calculates the average of a list of scores",
          code: `def calculate_average(scores):
    if not scores:
        return 0
    return sum(scores) / len(scores)`,
        },
        {
          instruction:
            "Create a function that assigns letter grades based on numeric thresholds",
          code: `def letter_grade(score):
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    elif score >= 70:
        return 'C'
    elif score >= 60:
        return 'D'
    else:
        return 'F'`,
        },
        {
          instruction:
            "Write a function that takes a dictionary of student names to score lists and prints a summary",
          hint: "Use a for loop with .items() to iterate over the dictionary",
        },
      ],
      expectedOutput:
        "A formatted summary showing each student's average, letter grade, and class statistics.",
    },
    quiz: [
      {
        question: "What will print(type(1.0)) output?",
        options: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'decimal'>",
          "<class 'number'>",
        ],
        correctIndex: 1,
        explanation:
          "1.0 is a floating-point number in Python. The int type is for whole numbers without a decimal point.",
      },
      {
        question: "Which of the following is a mutable data type in Python?",
        options: ["Tuple", "String", "List", "Integer"],
        correctIndex: 2,
        explanation:
          "Lists are mutable — you can change their contents after creation. Tuples, strings, and integers are immutable.",
      },
      {
        question: "What is the output of: [1, 2, 3] + [4, 5]?",
        options: [
          "[1, 2, 3, 4, 5]",
          "Error",
          "[5, 7, 8]",
          "[[1, 2, 3], [4, 5]]",
        ],
        correctIndex: 0,
        explanation:
          "The + operator concatenates lists, creating a new list containing all elements from both.",
      },
      {
        question: "What does the range(5) function return?",
        options: [
          "[0, 1, 2, 3, 4]",
          "[1, 2, 3, 4, 5]",
          "[0, 1, 2, 3, 4, 5]",
          "Error",
        ],
        correctIndex: 0,
        explanation:
          "range(5) generates numbers from 0 up to (but not including) 5, producing 0, 1, 2, 3, 4.",
      },
    ],
    assignment: {
      title: "Python Data Processing Script",
      description:
        "Write a Python script that processes a list of student records and generates a report.",
      tasks: [
        {
          task: "Define a list of dictionaries, each with name, scores (list of 3), and attendance percentage",
          criteria: [
            "At least 10 student records",
            "Scores range from 0 to 100",
            "Attendance is a percentage",
          ],
        },
        {
          task: "Write functions to calculate GPA, determine pass/fail, and rank students",
          criteria: [
            "GPA uses standard 4.0 scale",
            "Pass threshold is 60% average",
            "Ranking is descending by GPA",
          ],
        },
        {
          task: "Print a formatted report with headers and aligned columns",
          criteria: [
            "Include student name, average, GPA, rank",
            "Handle ties in ranking",
            "Use f-strings for formatting",
          ],
        },
      ],
    },
    miniProject: {
      title: "Personal Budget Tracker",
      description:
        "Build a command-line budget tracker that lets users add expenses, categorize them, and view summaries.",
      deliverables: [
        "Functions to add, list, and summarize expenses",
        "Category-based spending analysis",
        "A monthly summary with totals per category",
      ],
    },
    capstoneLinkage:
      "Python proficiency is the foundation for every subsequent lesson. You will use these basics to write data pipelines, ML scripts, and AI applications throughout the program.",
    researchReferences: [
      "Van Rossum, G., and Drake, F. L. (2023). The Python Language Reference. Python Software Foundation.",
      "Lutz, M. (2013). Learning Python (5th ed.). O'Reilly Media.",
      "Ramalho, L. (2022). Fluent Python (2nd ed.). O'Reilly Media.",
    ],
    githubImplementations: [
      "https://github.com/python/cpython",
      "https://github.com/vinta/awesome-python",
      "https://github.com/practical-tutorials/project-based-learning#python",
    ],
    commonMisconceptions: [
      "Python is not slow because it is dynamically typed. Performance-critical code uses NumPy and C extensions.",
      "Indentation is not just style — it is part of the language syntax. Incorrect indentation causes SyntaxError.",
      "range() does not return a list. It returns a range object that generates numbers on demand (lazy evaluation).",
      "Functions do not need explicit return statements. If omitted, Python returns None.",
    ],
    interviewQuestions: [
      "What is the difference between a list and a tuple in Python?",
      "Explain Python's dynamic typing and its implications for large codebases.",
      "What are list comprehensions and when would you use them over regular loops?",
      "How does Python handle memory management for mutable vs immutable objects?",
    ],
    revisionSummary:
      "Python uses dynamic typing where variables are labels for objects. Lists are mutable sequences; tuples are immutable. Control flow uses indentation-based blocks. Functions are first-class objects that can be passed and returned. List comprehensions provide concise iteration. These fundamentals underpin all AI programming in Python.",
  },
  {
    id: "data-structures",
    title: "Data Structures",
    stageId: "stage-2-python-for-ai",
    objectives: [
      "Choose the right data structure for the problem",
      "Manipulate lists, dictionaries, sets, and tuples efficiently",
      "Use list comprehensions for data processing",
      "Understand time complexity of common operations",
    ],
    prerequisites: ["python-basics"],
    visualExplanation:
      "Think of data structures as containers optimized for different access patterns. Lists are ordered sequences (like a to-do list). Dictionaries are key-value mappings (like a phone book). Sets are unordered unique collections (like a guest list with no duplicates). Tuples are immutable lists (like coordinates that should never change).",
    codeExample: `# Data structures for AI work
import random

# List comprehension — the Pythonic way to transform data
raw_scores = [random.randint(40, 100) for _ in range(20)]
normalized = [(s - 40) / 60 for s in raw_scores]
passing = [s for s in raw_scores if s >= 60]

print(f'Raw scores: {raw_scores[:5]}...')
print(f'Normalized: {[round(n, 2) for n in normalized[:5]]}...')
print(f'Passing count: {len(passing)}')

# Dictionary for frequency counting
word_freq = {}
text = 'the cat sat on the mat the cat ate the rat'
for word in text.split():
    word_freq[word] = word_freq.get(word, 0) + 1
print(f'Word frequencies: {word_freq}')

# Set operations for deduplication
students_a = {'Alice', 'Bob', 'Carol', 'David'}
students_b = {'Bob', 'David', 'Eve', 'Frank'}
both = students_a & students_b
either = students_a | students_b
print(f'In both classes: {both}')
print(f'In either class: {either}')

# Dictionary comprehension
inverted = {v: k for k, v in word_freq.items() if v > 1}
print(f'Words appearing more than once: {inverted}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Data Structures for AI\n\nChoosing the right data structure affects both code readability and performance. Python offers powerful built-in structures.",
      },
      {
        type: "code",
        content: `# Lists — ordered, mutable, allow duplicates
features = [0.5, 1.2, 0.8, 2.1, 0.3]
print(f'Max: {max(features)}, Min: {min(features)}')
print(f'Index of max: {features.index(max(features))}')

# Slicing
first_three = features[:3]
reversed_list = features[::-1]
print(f'First three: {first_three}')
print(f'Reversed: {reversed_list}')`,
      },
      {
        type: "markdown",
        content:
          "## Dictionaries — Key-Value Mappings\n\nDictionaries are hash maps. Lookup by key is O(1) average case, making them ideal for caching and indexing.",
      },
      {
        type: "code",
        content: `# Dictionary operations
model_scores = {
    'linear_regression': 0.82,
    'random_forest': 0.89,
    'neural_network': 0.94,
    'svm': 0.86
}

# Sort by value
best = sorted(model_scores.items(), key=lambda x: x[1], reverse=True)
for model, score in best:
    print(f'{model}: {score:.2f}')

# defaultdict for automatic grouping
from collections import defaultdict
data = [('AI', 'course1'), ('ML', 'course2'), ('AI', 'course3'), ('DL', 'course4')]
grouped = defaultdict(list)
for category, item in data:
    grouped[category].append(item)
print(dict(grouped))`,
      },
      {
        type: "markdown",
        content:
          "## List Comprehensions\n\nComprehensions are concise, readable, and often faster than equivalent for-loops.",
      },
      {
        type: "code",
        content: `# Nested comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(f'Flattened: {flat}')

# Conditional comprehension
words = ['hello', 'world', 'ai', 'python', 'ml']
long_words = [w.upper() for w in words if len(w) > 3]
print(f'Long words: {long_words}')`,
      },
    ],
    lab: {
      title: "Data Processing Pipeline",
      description:
        "Process a dataset using the appropriate data structures at each stage.",
      steps: [
        {
          instruction:
            "Create a dataset of student records as a list of dictionaries",
          code: `students = [
    {'name': 'Alice', 'grades': [88, 92, 79], 'major': 'CS'},
    {'name': 'Bob', 'grades': [75, 81, 88], 'major': 'Math'},
    {'name': 'Carol', 'grades': [95, 89, 91], 'major': 'CS'},
    {'name': 'David', 'grades': [70, 65, 72], 'major': 'Math'},
]`,
        },
        {
          instruction:
            "Use a dictionary comprehension to compute average grades",
          code: `averages = {s['name']: sum(s['grades']) / len(s['grades']) for s in students}
print(averages)`,
        },
        {
          instruction: "Group students by major using defaultdict",
          hint: "Import defaultdict from collections",
        },
      ],
      expectedOutput:
        "A grouped summary showing students per major with their average grades.",
    },
    quiz: [
      {
        question:
          "What is the time complexity of looking up a key in a Python dictionary?",
        options: ["O(1) average", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 0,
        explanation:
          "Dictionary lookup uses hashing, giving O(1) average time complexity. Worst case is O(n) with many hash collisions, but this is rare in practice.",
      },
      {
        question:
          "Which comprehension creates a list of squares of even numbers from 1 to 10?",
        options: [
          "[x**2 for x in range(1, 11) if x % 2 == 0]",
          "[x**2 for x in range(1, 11) if x % 2 != 0]",
          "[x for x in range(1, 11) if x % 2 == 0]",
          "for x in range(1, 11): x**2",
        ],
        correctIndex: 0,
        explanation:
          "The comprehension filters even numbers (x % 2 == 0) and then applies x**2 to each.",
      },
      {
        question: "What does set({1, 2, 3}) & set({2, 3, 4}) return?",
        options: ["{1, 2, 3, 4}", "{2, 3}", "{1, 4}", "{1, 2, 3}"],
        correctIndex: 1,
        explanation:
          "The & operator returns the intersection — elements present in both sets: {2, 3}.",
      },
      {
        question: "Why might you prefer a tuple over a list?",
        options: [
          "Tuples are faster to iterate",
          "Tuples are immutable, making them safe as dictionary keys",
          "Tuples use less memory always",
          "Tuples support more operations",
        ],
        correctIndex: 1,
        explanation:
          "Tuples are hashable (if their contents are hashable), so they can be dictionary keys. Lists are mutable and therefore not hashable.",
      },
    ],
    assignment: {
      title: "Text Analysis Tool",
      description:
        "Build a text analysis tool that processes a document and extracts statistics.",
      tasks: [
        {
          task: "Count word frequencies, ignoring case and punctuation",
          criteria: [
            "Handle at least 100 words",
            "Strip punctuation properly",
            "Report the top 10 most common words",
          ],
        },
        {
          task: "Identify unique words using sets and compute vocabulary richness",
          criteria: [
            "Vocabulary richness = unique words / total words",
            "Show words appearing only once (hapax legomena)",
          ],
        },
        {
          task: "Group words by length using a dictionary",
          criteria: [
            "Key is word length, value is list of words",
            "Show count per length category",
          ],
        },
      ],
    },
    miniProject: {
      title: "Inverted Index Builder",
      description:
        "Build an inverted index that maps words to the documents containing them, similar to a search engine.",
      deliverables: [
        "A function to build an inverted index from a list of documents",
        "A search function that returns documents containing a query word",
        "Support for multi-word queries with intersection of results",
      ],
    },
    capstoneLinkage:
      "Efficient data structure selection is critical in AI pipelines where you process millions of data points. These patterns recur in feature engineering, data cleaning, and evaluation.",
    researchReferences: [
      "Goodrich, M. T., Tamassia, R., and Goldwasser, M. H. (2014). Data Structures and Algorithms in Python. Wiley.",
      "McGovern, G. (2023). High Performance Python (2nd ed.). O'Reilly Media.",
    ],
    githubImplementations: [
      "https://github.com/TheAlgorithms/Python",
      "https://github.com/keon/algorithms",
    ],
    commonMisconceptions: [
      "List comprehensions are not always faster. For complex logic, a regular loop may be more readable.",
      "Sets do not preserve insertion order. If order matters, use a list or dict.",
      "Dictionary keys must be immutable. You cannot use a list as a dictionary key.",
      "Using *args and **kwargs does not mean a function is poorly designed. They are standard Python patterns.",
    ],
    interviewQuestions: [
      "When would you use a set instead of a list?",
      "Explain the difference between shallow and deep copy in Python.",
      "What is the time complexity of appending to a list vs a deque?",
      "How would you deduplicate a list while preserving order?",
    ],
    revisionSummary:
      "Python provides lists (ordered mutable sequences), tuples (ordered immutable sequences), dictionaries (key-value hash maps), and sets (unordered unique collections). List comprehensions offer concise, readable data transformation. Choosing the right structure depends on access patterns, mutability needs, and whether ordering matters.",
  },
  {
    id: "numpy-fundamentals",
    title: "NumPy Fundamentals",
    stageId: "stage-2-python-for-ai",
    objectives: [
      "Create and manipulate NumPy arrays",
      "Perform vectorized operations that replace slow loops",
      "Apply broadcasting to operations on arrays of different shapes",
      "Use linear algebra operations for AI applications",
    ],
    prerequisites: ["python-basics", "data-structures"],
    visualExplanation:
      "NumPy arrays are like Python lists but stored in contiguous memory blocks. This allows operations to execute in compiled C code rather than Python loops, giving 10-100x speedups. A 2D NumPy array is like a spreadsheet — rows are samples, columns are features. Broadcasting lets you add a single number to an entire column without writing a loop.",
    codeExample: `import numpy as np

# Creating arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

print(f'1D array shape: {arr.shape}')
print(f'2D array shape: {matrix.shape}')
print(f'Data type: {matrix.dtype}')

# Vectorized operations (no loops needed)
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])
print(f'Element-wise sum: {a + b}')
print(f'Element-wise product: {a * b}')
print(f'Dot product: {np.dot(a, b)}')

# Broadcasting
matrix_plus_10 = matrix + 10
print(f'Matrix + 10:\\n{matrix_plus_10}')

# Statistical operations
data = np.random.randn(1000)
print(f'Mean: {data.mean():.4f}')
print(f'Std: {data.std():.4f}')
print(f'Percentiles: {np.percentile(data, [25, 50, 75])}')`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# NumPy: The Foundation of Scientific Python\n\nNumPy provides the ndarray — the fundamental data structure for all numerical computing in Python. Every ML library (scikit-learn, PyTorch, TensorFlow) builds on NumPy arrays.",
      },
      {
        type: "code",
        content: `import numpy as np

# Array creation methods
zeros = np.zeros((3, 4))
ones = np.ones((2, 3))
identity = np.eye(4)
random_arr = np.random.randn(3, 3)

print('Zeros:\\n', zeros)
print('Identity:\\n', identity)`,
      },
      {
        type: "markdown",
        content:
          "## Indexing and Slicing\n\nNumPy supports advanced indexing that makes data manipulation concise and fast.",
      },
      {
        type: "code",
        content: `# Advanced indexing
data = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Select rows 0 and 2
print(data[[0, 2], :])

# Select elements where condition is True
mask = data > 5
print(data[mask])

# Fancy indexing
col_indices = np.array([0, 2])
print(data[:, col_indices])`,
      },
      {
        type: "markdown",
        content:
          "## Broadcasting\n\nBroadcasting lets NumPy perform operations on arrays with different shapes without explicit loops.",
      },
      {
        type: "code",
        content: `# Broadcasting example
features = np.random.randn(100, 4)  # 100 samples, 4 features
means = features.mean(axis=0)        # mean of each feature
stds = features.std(axis=0)          # std of each feature

# Standardize: (data - mean) / std
standardized = (features - means) / stds
print(f'Original mean: {features.mean(axis=0).round(2)}')
print(f'Standardized mean: {standardized.mean(axis=0).round(2)}')`,
      },
    ],
    lab: {
      title: "Linear Algebra with NumPy",
      description:
        "Use NumPy to implement core linear algebra operations used in machine learning.",
      steps: [
        {
          instruction:
            "Create a 3x3 matrix and compute its determinant and inverse",
          code: `A = np.array([[2, 1, 1], [4, 3, 3], [8, 7, 9]])
det = np.linalg.det(A)
inv = np.linalg.inv(A)
print(f'Determinant: {det:.2f}')
print(f'Inverse:\\n{inv.round(4)}')`,
        },
        {
          instruction: "Compute eigenvalues and eigenvectors",
          code: `eigenvalues, eigenvectors = np.linalg.eig(A)
print(f'Eigenvalues: {eigenvalues.round(4)}')
print(f'Eigenvectors:\\n{eigenvectors.round(4)}')`,
        },
        {
          instruction: "Solve a system of linear equations Ax = b",
          hint: "Use np.linalg.solve()",
        },
      ],
      expectedOutput:
        "Matrix operations with determinants, inverses, eigenvalues, and equation solutions.",
    },
    quiz: [
      {
        question:
          "Why is NumPy faster than Python lists for numerical operations?",
        options: [
          "NumPy uses compiled C code and contiguous memory",
          "NumPy has built-in parallelism",
          "Python lists are not allowed in numerical code",
          "NumPy uses a special compiler",
        ],
        correctIndex: 0,
        explanation:
          "NumPy stores data in contiguous memory blocks and operations execute in optimized C code, avoiding Python interpreter overhead for each element.",
      },
      {
        question: "What does broadcasting allow?",
        options: [
          "Arrays to communicate over a network",
          "Operations on arrays of different shapes without explicit loops",
          "Automatic type conversion between arrays",
          "Parallel computation on multiple GPUs",
        ],
        correctIndex: 1,
        explanation:
          "Broadcasting automatically expands arrays to compatible shapes for element-wise operations, eliminating the need for manual looping or padding.",
      },
      {
        question: "What is the output of np.array([1,2,3]).reshape(3,1)?",
        options: ["[[1, 2, 3]]", "[[1], [2], [3]]", "[1, 2, 3]", "Error"],
        correctIndex: 1,
        explanation:
          "reshape(3,1) converts the 1D array into a column vector with 3 rows and 1 column.",
      },
      {
        question: "What does axis=0 mean in np.mean(array, axis=0)?",
        options: [
          "Compute the mean along columns",
          "Compute the mean along rows",
          "Compute the global mean",
          "Compute the mean of all elements",
        ],
        correctIndex: 0,
        explanation:
          "axis=0 means the operation collapses the first dimension (rows), computing the mean across rows for each column.",
      },
    ],
    assignment: {
      title: "Image as NumPy Array",
      description:
        "Load an image as a NumPy array and perform basic transformations.",
      tasks: [
        {
          task: "Create a 100x100 RGB image as a NumPy array filled with a gradient",
          criteria: [
            "Use np.linspace or broadcasting",
            "Values should range from 0 to 255",
            "Convert to uint8 dtype",
          ],
        },
        {
          task: "Apply transformations: grayscale conversion, horizontal flip, brightness adjustment",
          criteria: [
            "Grayscale uses weighted average (0.299R + 0.587G + 0.114B)",
            "Flip uses array slicing",
            "Brightness uses broadcasting",
          ],
        },
        {
          task: "Compute image statistics (mean, std, min, max per channel)",
          criteria: [
            "Use axis-based operations",
            "Print results with channel labels",
          ],
        },
      ],
    },
    miniProject: {
      title: "Distance Calculator",
      description:
        "Build a function that computes pairwise Euclidean distances between two sets of points efficiently using NumPy broadcasting.",
      deliverables: [
        "A function that computes all pairwise distances between set A (N points) and set B (M points)",
        "Output should be an NxM distance matrix",
        "Include a brute-force loop version and compare timing with the vectorized version",
      ],
    },
    capstoneLinkage:
      "NumPy arrays are the currency of AI. Every model in scikit-learn, PyTorch, and TensorFlow expects NumPy arrays as input. Mastery of vectorization and broadcasting is essential for writing performant AI code.",
    researchReferences: [
      "Harris, C. R. et al. (2020). Array programming with NumPy. Nature, 585(7825), 357-362.",
      "Van der Walt, S., Colbert, S. C., and Varoquaux, G. (2011). The NumPy Array. Computing in Science Engineering, 13(2), 22-30.",
    ],
    githubImplementations: [
      "https://github.com/numpy/numpy",
      "https://github.com/rougier/numpy-100",
    ],
    commonMisconceptions: [
      "NumPy is not just for math. It is used for image processing, signal processing, and any array-based computation.",
      "Broadcasting does not copy data. It creates views, making it memory-efficient.",
      "np.array() does not always copy data. Modifications to the original list may or may not affect the array depending on the context.",
      "Higher-dimensional arrays are not inherently slower. Performance depends on total elements, not dimensions.",
    ],
    interviewQuestions: [
      "Explain how NumPy broadcasting works with an example.",
      "What is the difference between np.dot() and the @ operator?",
      "How would you compute the cosine similarity between two vectors using NumPy?",
      "When would you use np.einsum over standard arithmetic operations?",
    ],
    revisionSummary:
      "NumPy provides the ndarray for fast numerical computing. Vectorized operations replace slow Python loops. Broadcasting enables operations on arrays of different shapes. Linear algebra operations (dot product, matrix multiplication, eigenvalues) are fundamental to AI. Axis-based operations let you compute statistics along specific dimensions.",
  },
  {
    id: "pandas-dataframes",
    title: "Pandas DataFrames",
    stageId: "stage-2-python-for-ai",
    objectives: [
      "Load and inspect datasets with Pandas",
      "Clean data: handle missing values, duplicates, and type errors",
      "Perform groupby operations and aggregations",
      "Merge and reshape DataFrames for analysis",
    ],
    prerequisites: ["python-basics", "numpy-fundamentals"],
    visualExplanation:
      "A DataFrame is a 2D labeled array — like a spreadsheet with named rows and columns. Each column is a Series (a 1D labeled array). You can think of it as a dictionary of Series objects sharing the same index. Pandas handles missing data gracefully with NaN values and provides intuitive methods for filtering, grouping, and aggregating.",
    codeExample: `import pandas as pd
import numpy as np

# Create a DataFrame
data = {
    'name': ['Alice', 'Bob', 'Carol', 'David', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'department': ['Engineering', 'Marketing', 'Engineering', 'Sales', 'Marketing'],
    'salary': [85000, 72000, 95000, 68000, 78000]
}
df = pd.DataFrame(data)

print(df.head())
print(f'Shape: {df.shape}')
print(f'Column types:\\n{df.dtypes}')
print(f'Describe:\\n{df.describe()}')

# Filtering
engineers = df[df['department'] == 'Engineering']
print(f'Engineers:\\n{engineers}')

# Groupby
dept_stats = df.groupby('department')['salary'].agg(['mean', 'median', 'count'])
print(f'Department stats:\\n{dept_stats}')

# Adding a column
df['bonus'] = df['salary'] * 0.1
print(df[['name', 'salary', 'bonus']])`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Pandas: Data Wrangling Made Easy\n\nPandas is the most important library for data manipulation in Python. DataFrames provide intuitive methods for loading, cleaning, transforming, and analyzing tabular data.",
      },
      {
        type: "code",
        content: `import pandas as pd

# Loading data
# df = pd.read_csv('data.csv')
# df = pd.read_excel('data.xlsx')
# df = pd.read_json('data.json')

# Quick inspection
df = pd.DataFrame({
    'feature_a': [1, 2, None, 4, 5],
    'feature_b': ['x', 'y', 'z', None, 'x'],
    'target': [0, 1, 0, 1, 0]
})
print(f'Shape: {df.shape}')
print(f'Info:')
print(df.info())`,
      },
      {
        type: "markdown",
        content:
          "## Handling Missing Data\n\nReal-world datasets always have missing values. Pandas provides multiple strategies for dealing with them.",
      },
      {
        type: "code",
        content: `# Missing data strategies
print(f'Missing values:\\n{df.isnull().sum()}')

# Drop rows with any missing values
df_dropped = df.dropna()

# Fill missing values
df_filled = df.fillna({
    'feature_a': df['feature_a'].mean(),
    'feature_b': 'unknown'
})

# Interpolate
df_interpolated = df.copy()
df_interpolated['feature_a'] = df_interpolated['feature_a'].interpolate()
print(f'After interpolation:\\n{df_interpolated}')`,
      },
      {
        type: "markdown",
        content:
          "## GroupBy and Aggregation\n\nGroupBy splits data into groups, applies a function to each group, and combines the results.",
      },
      {
        type: "code",
        content: `# GroupBy operations
sales = pd.DataFrame({
    'region': ['North', 'South', 'North', 'South', 'North'],
    'product': ['A', 'A', 'B', 'B', 'A'],
    'revenue': [100, 150, 200, 120, 180]
})

# Multiple aggregations
result = sales.groupby(['region', 'product'])['revenue'].agg(['sum', 'mean', 'count'])
print(result)

# Pivot table
pivot = sales.pivot_table(values='revenue', index='region', columns='product', aggfunc='sum')
print(pivot)`,
      },
    ],
    lab: {
      title: "Clean a Messy Dataset",
      description:
        "Given a dataset with various quality issues, clean it for analysis.",
      steps: [
        {
          instruction: "Create a messy dataset with common data quality issues",
          code: `messy = pd.DataFrame({
    'id': [1, 2, 2, 3, 4, 5, 5],
    'name': ['Alice', 'Bob', 'Bob', 'Carol', None, 'Eve', 'Eve'],
    'age': [25, 30, 30, -5, 28, 32, 32],
    'email': ['a@x.com', 'invalid', 'b@x.com', 'c@x.com', 'd@x.com', None, None],
    'score': [85, 92, 92, 78, None, 88, 88]
})`,
        },
        {
          instruction: "Remove duplicate rows based on id",
          code: `print(f'Before dedup: {len(messy)} rows')
cleaned = messy.drop_duplicates(subset='id')
print(f'After dedup: {len(cleaned)} rows')`,
        },
        {
          instruction:
            "Fix invalid ages (negative values) and fill missing emails with a default",
          hint: "Use .loc for conditional assignment",
        },
      ],
      expectedOutput:
        "A cleaned DataFrame with no duplicates, valid ages, and no missing emails.",
    },
    quiz: [
      {
        question: "What does df.dropna(axis=1) do?",
        options: [
          "Drops rows with any missing values",
          "Drops columns with any missing values",
          "Fills missing values with zero",
          "Returns a boolean mask of missing values",
        ],
        correctIndex: 1,
        explanation:
          "axis=1 refers to columns. dropna(axis=1) removes any column that contains at least one missing value.",
      },
      {
        question: "What is the difference between merge() and concat()?",
        options: [
          "merge() joins on keys; concat() stacks along an axis",
          "merge() is faster; concat() is slower",
          "merge() works only on DataFrames; concat() works on any object",
          "There is no difference",
        ],
        correctIndex: 0,
        explanation:
          "merge() joins DataFrames based on common columns (like SQL JOIN). concat() stacks DataFrames along rows or columns.",
      },
      {
        question: "How do you select rows where age is between 25 and 35?",
        options: [
          "df[df.age > 25 and df.age < 35]",
          "df[(df.age > 25) & (df.age < 35)]",
          "df.where(25 < age < 35)",
          "df.select(age between 25 and 35)",
        ],
        correctIndex: 1,
        explanation:
          "Pandas uses element-wise operators: & for AND, | for OR, ~ for NOT. Each condition must be wrapped in parentheses.",
      },
      {
        question: 'What does df.groupby("col").transform("mean") return?',
        options: [
          "A DataFrame with one row per group",
          "A Series with the group mean broadcast back to original index",
          "A DataFrame with a new column of means",
          "A dictionary of group means",
        ],
        correctIndex: 1,
        explanation:
          "transform() returns a Series aligned with the original DataFrame index, allowing you to add group-level statistics as a new column.",
      },
    ],
    assignment: {
      title: "Real-World Data Cleaning",
      description:
        "Download a real dataset and perform a complete data cleaning pipeline.",
      tasks: [
        {
          task: "Load a CSV dataset and perform initial inspection",
          criteria: [
            "Report shape, dtypes, missing value counts",
            "Identify columns with > 30% missing data",
            "Show first 5 rows and summary statistics",
          ],
        },
        {
          task: "Clean the dataset systematically",
          criteria: [
            "Remove exact duplicates",
            "Handle missing values with appropriate strategy per column",
            "Fix data type issues (e.g., strings that should be numbers)",
          ],
        },
        {
          task: "Engineer at least 2 new features from existing columns",
          criteria: [
            "At least one feature from combining columns",
            "At least one feature from binning or categorizing",
          ],
        },
      ],
    },
    miniProject: {
      title: "COVID-19 Data Analysis",
      description:
        "Analyze a public COVID-19 dataset to find trends, correlations, and anomalies.",
      deliverables: [
        "Load and clean the dataset with documented steps",
        "Visualize trends over time for at least 3 countries",
        "Compute and compare case fatality rates across regions",
      ],
    },
    capstoneLinkage:
      "Every AI project starts with data. Pandas is the tool you will use to load, clean, and prepare data for modeling. Skills learned here transfer directly to feature engineering in ML.",
    researchReferences: [
      "McKinney, W. (2022). Python for Data Analysis (3rd ed.). O'Reilly Media.",
      "Reback, J. et al. (2024). pandas documentation. pandas.pydata.org.",
    ],
    githubImplementations: [
      "https://github.com/pandas-dev/pandas",
      "https://github.com/pandas-dev/pandas/tree/main/doc",
    ],
    commonMisconceptions: [
      "Pandas is not slow for small datasets. It becomes slow only with millions of rows, where you should use chunked processing or switch to Dask.",
      "apply() is not vectorized. It is a Python loop under the hood. Prefer vectorized operations for performance.",
      "Setting df[new_col] = values does not always copy data. Pandas uses copy-on-write semantics.",
      "groupby() does not sort by default in recent versions. Use sort=True if you need sorted groups.",
    ],
    interviewQuestions: [
      "How do you handle missing data in a Pandas DataFrame?",
      "Explain the difference between merge, join, and concat in Pandas.",
      "What is the difference between loc and iloc?",
      "How would you optimize memory usage for a large DataFrame?",
    ],
    revisionSummary:
      "Pandas DataFrames are the primary tool for tabular data manipulation. Key operations include loading data from CSV/Excel/JSON, inspecting with info() and describe(), filtering with boolean masks, handling missing data with dropna/fillna, grouping with groupby, and merging with merge/concat. Vectorized operations are preferred over apply() for performance.",
  },
  {
    id: "data-visualization",
    title: "Data Visualization",
    stageId: "stage-2-python-for-ai",
    objectives: [
      "Create publication-quality plots with matplotlib",
      "Use seaborn for statistical visualizations",
      "Choose the right chart type for different data relationships",
      "Build dashboards with multiple coordinated plots",
    ],
    prerequisites: ["python-basics", "numpy-fundamentals", "pandas-dataframes"],
    visualExplanation:
      "Visualization is the bridge between data and understanding. matplotlib is the foundation — it gives you full control over every element. seaborn builds on matplotlib to make statistical plots (distributions, correlations, categories) easy. Together they cover everything from simple scatter plots to complex multi-panel dashboards.",
    codeExample: `import numpy as np
import matplotlib.pyplot as plt

# Line plot with multiple series
x = np.linspace(0, 10, 100)
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].plot(x, np.sin(x), label='sin(x)')
axes[0].plot(x, np.cos(x), label='cos(x)')
axes[0].set_title('Trigonometric Functions')
axes[0].legend()
axes[0].grid(True)

# Histogram
data = np.random.randn(1000)
axes[1].hist(data, bins=30, edgecolor='black', alpha=0.7)
axes[1].set_title('Normal Distribution')
axes[1].set_xlabel('Value')
axes[1].set_ylabel('Frequency')

# Scatter plot
np.random.seed(42)
x_scatter = np.random.randn(100)
y_scatter = 2 * x_scatter + np.random.randn(100)
axes[2].scatter(x_scatter, y_scatter, alpha=0.6, c='steelblue')
axes[2].set_title('Scatter Plot with Correlation')
axes[2].set_xlabel('X')
axes[2].set_ylabel('Y')

plt.tight_layout()
plt.savefig('visualizations.png', dpi=150)
plt.show()`,
    notebookCells: [
      {
        type: "markdown",
        content:
          "# Data Visualization\n\nVisualization transforms data into insight. The right chart reveals patterns that numbers alone cannot convey.",
      },
      {
        type: "code",
        content: `import matplotlib.pyplot as plt
import numpy as np

# Basic line plot
x = np.arange(0, 10)
y = x ** 2

plt.figure(figsize=(8, 5))
plt.plot(x, y, marker='o', linestyle='--', color='steelblue')
plt.title('Quadratic Growth')
plt.xlabel('Input')
plt.ylabel('Output')
plt.grid(True, alpha=0.3)
plt.show()`,
      },
      {
        type: "markdown",
        content:
          "## Seaborn: Statistical Visualization\n\nSeaborn makes complex statistical plots simple. It works natively with Pandas DataFrames.",
      },
      {
        type: "code",
        content: `import seaborn as sns
import pandas as pd

# Create sample data
np.random.seed(42)
df = pd.DataFrame({
    'x': np.random.randn(200),
    'y': np.random.randn(200),
    'category': np.random.choice(['A', 'B', 'C'], 200)
})

# Seaborn scatter plot with categories
sns.scatterplot(data=df, x='x', y='y', hue='category', alpha=0.7)
plt.title('Scatter Plot by Category')
plt.show()`,
      },
      {
        type: "markdown",
        content:
          "## Choosing the Right Chart\n\nDifferent data relationships call for different visualizations.",
      },
      {
        type: "code",
        content: `# Chart selection guide
chart_guide = {
    'Comparison': ['Bar chart', 'Grouped bar', 'Radar chart'],
    'Distribution': ['Histogram', 'Box plot', 'Violin plot'],
    'Relationship': ['Scatter plot', 'Heatmap', 'Bubble chart'],
    'Trend over time': ['Line chart', 'Area chart', 'Slope graph'],
    'Part of whole': ['Pie chart', 'Stacked bar', 'Treemap'],
}

for purpose, charts in chart_guide.items():
    print(f'{purpose}: {', '.join(charts)}')`,
      },
    ],
    lab: {
      title: "Build a Multi-Panel Dashboard",
      description:
        "Create a dashboard with four coordinated visualizations from a single dataset.",
      steps: [
        {
          instruction: "Create a dataset with multiple variable types",
          code: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300
df = pd.DataFrame({
    'age': np.random.randint(18, 65, n),
    'income': np.random.lognormal(10.5, 0.5, n),
    'score': np.random.normal(70, 15, n).clip(0, 100),
    'category': np.random.choice(['A', 'B', 'C'], n),
    'region': np.random.choice(['North', 'South', 'East', 'West'], n)
})`,
        },
        {
          instruction:
            "Create a 2x2 subplot grid with histogram, box plot, scatter, and bar chart",
          code: `fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Top-left: histogram of scores
axes[0, 0].hist(df['score'], bins=25, edgecolor='black', alpha=0.7, color='steelblue')
axes[0, 0].set_title('Score Distribution')

# Top-right: box plot of income by category
df.boxplot(column='income', by='category', ax=axes[0, 1])
axes[0, 1].set_title('Income by Category')

# Bottom-left: scatter of age vs income
axes[1, 0].scatter(df['age'], df['income'], alpha=0.4, s=10)
axes[1, 0].set_title('Age vs Income')
axes[1, 0].set_xlabel('Age')
axes[1, 0].set_ylabel('Income')

# Bottom-right: bar chart of region counts
region_counts = df['region'].value_counts()
axes[1, 1].bar(region_counts.index, region_counts.values, color=['#2196F3', '#4CAF50', '#FF9800', '#F44336'])
axes[1, 1].set_title('Samples per Region')

plt.tight_layout()
plt.savefig('dashboard.png', dpi=150)`,
        },
        {
          instruction: "Add a common title and adjust spacing",
          hint: "Use fig.suptitle() and plt.subplots_adjust()",
        },
      ],
      expectedOutput:
        "A saved dashboard image with four panels showing different aspects of the data.",
    },
    quiz: [
      {
        question:
          "Which chart type is best for showing the relationship between two continuous variables?",
        options: ["Bar chart", "Pie chart", "Scatter plot", "Line chart"],
        correctIndex: 2,
        explanation:
          "Scatter plots show the relationship between two continuous variables, revealing correlation, clustering, and outliers.",
      },
      {
        question: "What does alpha do in matplotlib?",
        options: [
          "Sets the font size",
          "Controls transparency (0=invisible, 1=opaque)",
          "Sets the line width",
          "Changes the color intensity",
        ],
        correctIndex: 1,
        explanation:
          "alpha controls the transparency of plot elements. Lower values make elements more see-through, useful for overlapping points.",
      },
      {
        question: "When should you use a box plot over a histogram?",
        options: [
          "When you want to show the full distribution shape",
          "When you want to compare distributions across categories",
          "When you have only one variable",
          "When showing time series data",
        ],
        correctIndex: 1,
        explanation:
          "Box plots are excellent for comparing distributions across categories. They show median, quartiles, and outliers in a compact format.",
      },
      {
        question: "What is the purpose of plt.tight_layout()?",
        options: [
          "Makes the figure smaller",
          "Automatically adjusts subplot spacing to prevent overlap",
          "Removes empty subplots",
          "Sets a consistent color theme",
        ],
        correctIndex: 1,
        explanation:
          "tight_layout() automatically adjusts the padding between subplots so labels and titles do not overlap.",
      },
    ],
    assignment: {
      title: "Exploratory Data Analysis Report",
      description:
        "Create a complete EDA report for a real dataset with at least 8 visualizations.",
      tasks: [
        {
          task: "Create univariate visualizations (histograms, box plots) for all numeric columns",
          criteria: [
            "One plot per numeric column",
            "Include titles and axis labels",
            "Handle outliers visually",
          ],
        },
        {
          task: "Create bivariate visualizations (scatter plots, heatmaps) showing relationships",
          criteria: [
            "Correlation heatmap of all numeric features",
            "At least 3 scatter plots showing key relationships",
            "Color-code by a categorical variable",
          ],
        },
        {
          task: "Write a narrative summary of insights discovered through visualization",
          criteria: [
            "Reference specific plots by name",
            "Identify at least 3 actionable insights",
            "Note any data quality issues revealed",
          ],
        },
      ],
    },
    miniProject: {
      title: "Model Performance Dashboard",
      description:
        "Build a visualization dashboard comparing multiple ML models on a dataset.",
      deliverables: [
        "Confusion matrices for at least 3 models",
        "ROC curves with AUC scores on a single plot",
        "Feature importance bar charts for tree-based models",
      ],
    },
    capstoneLinkage:
      "Visualization is essential for EDA, model evaluation, and presenting results. Every capstone project requires a comprehensive visual analysis of both data and model performance.",
    researchReferences: [
      "Wilke, C. O. (2019). Fundamentals of Data Visualization. O'Reilly Media.",
      "Waskom, M. (2021). seaborn: statistical data visualization. JOSS, 6(60), 3021.",
    ],
    githubImplementations: [
      "https://github.com/matplotlib/matplotlib",
      "https://github.com/mwaskom/seaborn",
      "https://github.com/plotly/plotly.py",
    ],
    commonMisconceptions: [
      "More colors do not make a better chart. Use color purposefully to highlight insights, not to decorate.",
      "Pie charts are rarely the best choice. Bar charts are almost always more readable for comparing values.",
      "Saving as PNG at 72 dpi is fine for screens, but publications need at least 300 dpi.",
      "plt.show() is not needed in Jupyter notebooks if you use %matplotlib inline.",
    ],
    interviewQuestions: [
      "How would you visualize the performance of a binary classifier?",
      "What chart would you use to show how a single numeric variable is distributed?",
      "How do you handle visualization of datasets with millions of points?",
      "Explain the difference between matplotlib and seaborn. When would you use each?",
    ],
    revisionSummary:
      "matplotlib provides full control over plot elements for any chart type. seaborn simplifies statistical visualizations like distributions, correlations, and categorical comparisons. Key chart types: histograms for distributions, scatter plots for relationships, box plots for comparisons, heatmaps for correlations. Always label axes, include titles, and use tight_layout() for multi-panel figures.",
  },
];
