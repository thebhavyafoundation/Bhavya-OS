// Bhavya AI University — Complete Knowledge Graph
// Every AI concept with prerequisites, related concepts, and learning context

export interface KnowledgeNode {
  id: string;
  title: string;
  slug: string;
  category: KnowledgeCategory;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  whyItExists: string;
  history: string;
  prerequisites: string[];
  relatedConcepts: string[];
  examples: { title: string; description: string; code?: string }[];
  realWorldUseCases: string[];
  commonMistakes: string[];
  interviewQuestions: string[];
  glossary: { term: string; definition: string }[];
  references: {
    title: string;
    url: string;
    type: "paper" | "article" | "video" | "book";
  }[];
  estimatedMinutes: number;
  projects: string[];
}

export type KnowledgeCategory =
  | "fundamentals"
  | "machine-learning"
  | "deep-learning"
  | "nlp"
  | "computer-vision"
  | "generative-ai"
  | "llm"
  | "agents"
  | "rag"
  | "embeddings"
  | "infrastructure"
  | "deployment"
  | "ethics"
  | "product"
  | "research";

export const knowledgeGraph: KnowledgeNode[] = [
  // ───────────────────────────────────────────
  // FUNDAMENTALS
  // ───────────────────────────────────────────
  {
    id: "what-is-ai",
    title: "What is AI?",
    slug: "what-is-ai",
    category: "fundamentals",
    difficulty: "beginner",
    description:
      "Artificial Intelligence — software that learns from data to perform tasks requiring human intelligence.",
    whyItExists:
      "AI automates complex decision-making, pattern recognition, and language understanding at scales impossible for humans.",
    history:
      "1950: Turing Test → 1956: Dartmouth Conference → 1997: Deep Blue → 2012: AlexNet → 2017: Transformers → 2022: ChatGPT → 2024: GPT-4, Claude, Gemini",
    prerequisites: [],
    relatedConcepts: ["machine-learning", "deep-learning", "neural-networks"],
    examples: [
      {
        title: "Virtual Assistants",
        description: "Siri, Alexa understand speech and respond intelligently",
      },
      {
        title: "Recommendation Engines",
        description: "Netflix, Spotify predict what you'll enjoy",
      },
      {
        title: "Autonomous Vehicles",
        description: "Tesla, Waymo perceive and navigate the world",
      },
    ],
    realWorldUseCases: [
      "Healthcare diagnosis",
      "Financial fraud detection",
      "Language translation",
      "Code generation",
      "Image recognition",
    ],
    commonMistakes: [
      "Confusing AI with automation",
      "Thinking AI understands like humans",
      "Expecting AI to be perfect",
    ],
    interviewQuestions: [
      "What separates AI from traditional software?",
      "Name 3 types of AI applications",
      "What is the difference between AI and ML?",
    ],
    glossary: [
      {
        term: "AI",
        definition:
          "Software that learns from data to perform intelligent tasks",
      },
      {
        term: "ML",
        definition: "A subset of AI where systems improve through experience",
      },
      {
        term: "Model",
        definition:
          "A mathematical function trained on data to make predictions",
      },
    ],
    references: [
      {
        title: "Elements of AI",
        url: "https://www.elementsofai.com/",
        type: "book",
      },
      {
        title: "AI For Everyone",
        url: "https://www.coursera.org/learn/ai-for-everyone",
        type: "video",
      },
    ],
    estimatedMinutes: 20,
    projects: ["build-ai-assistant"],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    slug: "machine-learning",
    category: "fundamentals",
    difficulty: "beginner",
    description:
      "Systems that learn patterns from data without being explicitly programmed.",
    whyItExists:
      "ML enables computers to find patterns in massive datasets that humans cannot process manually.",
    history:
      "1957: Perceptron → 1986: Backpropagation → 1995: SVMs → 2001: Random Forests → 2012: Deep Learning revolution",
    prerequisites: ["what-is-ai"],
    relatedConcepts: [
      "deep-learning",
      "supervised-learning",
      "unsupervised-learning",
      "neural-networks",
    ],
    examples: [
      {
        title: "Spam Detection",
        description:
          "Email filters learn to identify spam from labeled examples",
        code: "spamClassifier.train(labeled_emails)",
      },
      {
        title: "Price Prediction",
        description:
          "Predict house prices from features like size, location, age",
      },
    ],
    realWorldUseCases: [
      "Credit scoring",
      "Medical diagnosis",
      "Stock prediction",
      "Customer segmentation",
      "Demand forecasting",
    ],
    commonMistakes: [
      "Overfitting to training data",
      "Ignoring data quality",
      "Using ML when rules work fine",
    ],
    interviewQuestions: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain overfitting",
      "When would you NOT use ML?",
    ],
    glossary: [
      {
        term: "Supervised Learning",
        definition: "Learning from labeled examples (input → known output)",
      },
      {
        term: "Unsupervised Learning",
        definition: "Finding patterns in unlabeled data",
      },
      {
        term: "Overfitting",
        definition:
          "Model memorizes training data instead of learning general patterns",
      },
    ],
    references: [
      {
        title: "Andrew Ng's ML Course",
        url: "https://www.coursera.org/learn/machine-learning",
        type: "video",
      },
    ],
    estimatedMinutes: 30,
    projects: ["ml-classifier"],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    slug: "neural-networks",
    category: "deep-learning",
    difficulty: "intermediate",
    description:
      "Computational systems inspired by biological neurons, arranged in layers that process information.",
    whyItExists:
      "Neural networks can learn complex, non-linear patterns that traditional algorithms cannot capture.",
    history:
      "1943: McCulloch-Pitts neuron → 1958: Perceptron → 1986: Backpropagation → 2012: Deep networks win ImageNet",
    prerequisites: ["machine-learning"],
    relatedConcepts: ["deep-learning", "cnn", "rnn", "transformers"],
    examples: [
      {
        title: "Image Classification",
        description: "Convolutional neural networks identify objects in images",
      },
      {
        title: "Language Model",
        description: "Transformer networks predict the next word in a sequence",
      },
    ],
    realWorldUseCases: [
      "Image recognition",
      "Speech recognition",
      "Language translation",
      "Game playing",
      "Drug discovery",
    ],
    commonMistakes: [
      "Using too many layers for simple problems",
      "Not enough training data",
      "Poor weight initialization",
    ],
    interviewQuestions: [
      "Explain backpropagation",
      "What is a activation function?",
      "Why do we need multiple layers?",
    ],
    glossary: [
      {
        term: "Neuron",
        definition:
          "A unit that computes a weighted sum of inputs and applies an activation function",
      },
      {
        term: "Layer",
        definition:
          "A group of neurons that process information at the same level",
      },
      {
        term: "Backpropagation",
        definition:
          "Algorithm for computing gradients to update network weights",
      },
    ],
    references: [
      {
        title: "3Blue1Brown: Neural Networks",
        url: "https://www.youtube.com/playlist?v=aircAruvnKk",
        type: "video",
      },
    ],
    estimatedMinutes: 40,
    projects: ["neural-network-from-scratch"],
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    slug: "deep-learning",
    category: "deep-learning",
    difficulty: "intermediate",
    description:
      "Neural networks with many layers that learn hierarchical representations of data.",
    whyItExists:
      "Deep learning achieves state-of-the-art performance on complex tasks like vision, language, and speech.",
    history:
      "2012: AlexNet wins ImageNet → 2014: VGG, GoogLeNet → 2015: ResNet → 2017: Transformers → 2020: GPT-3",
    prerequisites: ["neural-networks"],
    relatedConcepts: ["cnn", "rnn", "transformers", "generative-ai"],
    examples: [
      {
        title: "Self-Driving Cars",
        description:
          "Deep networks process camera feeds to detect lanes, signs, pedestrians",
      },
      {
        title: "ChatGPT",
        description:
          "Transformer-based deep learning generates human-like text",
      },
    ],
    realWorldUseCases: [
      "Autonomous driving",
      "Medical imaging",
      "Natural language processing",
      "Art generation",
      "Protein folding",
    ],
    commonMistakes: [
      "Not enough data for deep learning",
      "Training too long",
      "Ignoring computational cost",
    ],
    interviewQuestions: [
      "What makes deep learning different from traditional ML?",
      "Explain vanishing gradients",
      "When should you use deep learning?",
    ],
    glossary: [
      {
        term: "Deep Learning",
        definition: "ML using neural networks with multiple hidden layers",
      },
      {
        term: "Representation Learning",
        definition: "Automatically learning useful features from raw data",
      },
    ],
    references: [
      {
        title: "Deep Learning Book",
        url: "https://www.deeplearningbook.org/",
        type: "book",
      },
    ],
    estimatedMinutes: 35,
    projects: ["image-classifier"],
  },

  // ───────────────────────────────────────────
  // TRANSFORMERS & LLMs
  // ───────────────────────────────────────────
  {
    id: "transformers",
    title: "Transformers",
    slug: "transformers",
    category: "llm",
    difficulty: "intermediate",
    description:
      "The architecture behind modern LLMs. Uses self-attention to process sequences in parallel.",
    whyItExists:
      "Transformers solved the sequential processing bottleneck of RNNs, enabling massive parallelization and scaling.",
    history:
      "2017: 'Attention Is All You Need' paper by Vaswani et al. → GPT (2018) → BERT (2018) → GPT-2 (2019) → GPT-3 (2020) → ChatGPT (2022)",
    prerequisites: ["neural-networks", "deep-learning"],
    relatedConcepts: [
      "attention-mechanism",
      "self-attention",
      "llm",
      "bert",
      "gpt",
    ],
    examples: [
      {
        title: "Machine Translation",
        description:
          "Transformers translate text by attending to relevant words across languages",
      },
      {
        title: "Text Generation",
        description:
          "GPT models generate text by predicting the next token using attention",
      },
    ],
    realWorldUseCases: [
      "Chatbots",
      "Code generation",
      "Text summarization",
      "Image generation (ViT)",
      "Protein prediction (AlphaFold)",
    ],
    commonMistakes: [
      "Ignoring context window limits",
      "Not understanding tokenization",
      "Assuming attention is always better",
    ],
    interviewQuestions: [
      "Explain self-attention",
      "What is multi-head attention?",
      "Why are transformers better than RNNs?",
    ],
    glossary: [
      {
        term: "Self-Attention",
        definition:
          "Mechanism where each token attends to all other tokens in a sequence",
      },
      {
        term: "Multi-Head Attention",
        definition: "Multiple attention mechanisms running in parallel",
      },
      {
        term: "Positional Encoding",
        definition: "Adding sequence order information to tokens",
      },
    ],
    references: [
      {
        title: "Attention Is All You Need",
        url: "https://arxiv.org/abs/1706.03762",
        type: "paper",
      },
      {
        title: "Illustrated Transformer",
        url: "https://jalammar.github.io/illustrated-transformer/",
        type: "article",
      },
    ],
    estimatedMinutes: 45,
    projects: ["transformer-from-scratch"],
  },
  {
    id: "attention-mechanism",
    title: "Attention Mechanism",
    slug: "attention-mechanism",
    category: "llm",
    difficulty: "intermediate",
    description:
      "A mechanism that allows models to focus on relevant parts of the input when producing output.",
    whyItExists:
      "Attention solves the information bottleneck problem where all context must be compressed into a single fixed-size vector.",
    history:
      "2014: Bahdanau attention for NMT → 2015: Luong attention → 2017: Self-attention in Transformers",
    prerequisites: ["neural-networks"],
    relatedConcepts: ["self-attention", "transformers", "cross-attention"],
    examples: [
      {
        title: "Translation Attention",
        description:
          "When translating 'The cat sat on the mat', the model attends to 'cat' when generating 'le chat'",
      },
    ],
    realWorldUseCases: [
      "Machine translation",
      "Text summarization",
      "Image captioning",
      "Speech recognition",
    ],
    commonMistakes: [
      "Not masking future tokens in autoregressive models",
      "Ignoring attention visualization for debugging",
    ],
    interviewQuestions: [
      "How does attention work mathematically?",
      "What is the difference between self-attention and cross-attention?",
    ],
    glossary: [
      { term: "Query", definition: "What we're looking for" },
      { term: "Key", definition: "What we're matching against" },
      { term: "Value", definition: "What we retrieve when there's a match" },
    ],
    references: [
      {
        title:
          "Neural Machine Translation by Jointly Learning to Align and Translate",
        url: "https://arxiv.org/abs/1409.0473",
        type: "paper",
      },
    ],
    estimatedMinutes: 30,
    projects: [],
  },
  {
    id: "llm",
    title: "Large Language Models",
    slug: "large-language-models",
    category: "llm",
    difficulty: "intermediate",
    description:
      "Neural networks trained on trillions of tokens that can understand and generate human language.",
    whyItExists:
      "LLMs enable natural language interfaces to computation, making AI accessible to non-programmers.",
    history:
      "2018: GPT-1 (117M params) → 2020: GPT-3 (175B) → 2022: ChatGPT → 2023: GPT-4, Claude 2, Llama → 2024: Claude 3, Gemini",
    prerequisites: ["transformers", "deep-learning"],
    relatedConcepts: [
      "tokenization",
      "embeddings",
      "fine-tuning",
      "prompt-engineering",
      "rlhf",
    ],
    examples: [
      {
        title: "ChatGPT",
        description:
          "Conversational AI that can write, code, analyze, and reason",
      },
      {
        title: "Claude",
        description:
          "AI assistant focused on being helpful, harmless, and honest",
      },
      {
        title: "Llama",
        description: "Open-weight models that can be run locally",
      },
    ],
    realWorldUseCases: [
      "Customer support",
      "Content generation",
      "Code assistance",
      "Data analysis",
      "Education",
    ],
    commonMistakes: [
      "Trusting LLMs for factual accuracy",
      "Ignoring hallucination risk",
      "Not understanding token limits",
    ],
    interviewQuestions: [
      "How do LLMs generate text?",
      "What is hallucination?",
      "Explain the difference between GPT and BERT",
    ],
    glossary: [
      {
        term: "Token",
        definition:
          "A piece of text (word, subword, or character) used as input to the model",
      },
      {
        term: "Context Window",
        definition: "The maximum number of tokens a model can process at once",
      },
      {
        term: "Hallucination",
        definition:
          "When an LLM generates plausible-sounding but factually incorrect information",
      },
      {
        term: "Temperature",
        definition:
          "A parameter controlling randomness in generation (0 = deterministic, 1 = creative)",
      },
    ],
    references: [
      {
        title: "Language Models are Few-Shot Learners",
        url: "https://arxiv.org/abs/2005.14165",
        type: "paper",
      },
      {
        title: "LLM Course",
        url: "https://github.com/mlabonne/llm-course",
        type: "article",
      },
    ],
    estimatedMinutes: 40,
    projects: ["build-chatbot", "llm-comparison"],
  },
  {
    id: "tokenization",
    title: "Tokenization",
    slug: "tokenization",
    category: "llm",
    difficulty: "beginner",
    description:
      "Splitting text into tokens (words, subwords, or characters) that models can process.",
    whyItExists:
      "Models can't process raw text — they need numerical representations. Tokenization is the first step.",
    history:
      "Word-level → Character-level → BPE (2016) → WordPiece → SentencePiece → tiktoken",
    prerequisites: ["llm"],
    relatedConcepts: ["embeddings", "bpe", "vocabulary"],
    examples: [
      {
        title: "BPE Tokenization",
        description: "'unhappiness' → ['un', 'happi', 'ness']",
        code: "tokens = tokenizer.encode('unhappiness')\n# [1533, 7669, 849]",
      },
    ],
    realWorldUseCases: [
      "Text preprocessing",
      "Model input preparation",
      "Cost estimation (API pricing per token)",
    ],
    commonMistakes: [
      "Not accounting for token limits",
      "Ignoring multilingual tokenization differences",
    ],
    interviewQuestions: [
      "What is BPE?",
      "Why do tokens matter for cost?",
      "How does tokenization affect multilingual models?",
    ],
    glossary: [
      {
        term: "BPE",
        definition:
          "Byte Pair Encoding — iteratively merges the most frequent character pairs",
      },
      {
        term: "Vocabulary",
        definition: "The complete set of tokens a model can understand",
      },
    ],
    references: [
      {
        title: "tiktoken",
        url: "https://github.com/openai/tiktoken",
        type: "article",
      },
    ],
    estimatedMinutes: 20,
    projects: [],
  },
  {
    id: "embeddings",
    title: "Embeddings",
    slug: "embeddings",
    category: "embeddings",
    difficulty: "intermediate",
    description:
      "Dense vector representations of text, images, or other data that capture semantic meaning.",
    whyItExists:
      "Embeddings convert discrete data (words, sentences) into continuous vectors where similar items are close together.",
    history:
      "2013: Word2Vec → 2014: GloVe → 2018: ELMo → 2019: Sentence-BERT → 2023: OpenAI Embeddings",
    prerequisites: ["neural-networks", "llm"],
    relatedConcepts: ["vector-databases", "similarity-search", "rag"],
    examples: [
      {
        title: "Semantic Similarity",
        description: "'king' and 'queen' are close in vector space",
        code: "similarity(embed('king'), embed('queen'))  # 0.85",
      },
      {
        title: "Analogy",
        description:
          "vector('king') - vector('man') + vector('woman') ≈ vector('queen')",
      },
    ],
    realWorldUseCases: [
      "Search engines",
      "Recommendation systems",
      "RAG systems",
      "Semantic deduplication",
      "Anomaly detection",
    ],
    commonMistakes: [
      "Using cosine similarity for all use cases",
      "Not normalizing embeddings",
      "Ignoring embedding dimensions",
    ],
    interviewQuestions: [
      "What makes a good embedding?",
      "How do you measure embedding quality?",
      "What is the difference between sparse and dense embeddings?",
    ],
    glossary: [
      {
        term: "Vector",
        definition:
          "A list of numbers representing an item in high-dimensional space",
      },
      {
        term: "Cosine Similarity",
        definition:
          "Measuring the angle between two vectors (0 = orthogonal, 1 = identical)",
      },
      {
        term: "Dimension",
        definition:
          "The number of values in a vector (e.g., 1536 for text-embedding-3-small)",
      },
    ],
    references: [
      {
        title: "Word2Vec",
        url: "https://arxiv.org/abs/1301.3781",
        type: "paper",
      },
      {
        title: "OpenAI Embeddings Guide",
        url: "https://platform.openai.com/docs/guides/embeddings",
        type: "article",
      },
    ],
    estimatedMinutes: 30,
    projects: ["semantic-search"],
  },

  // ───────────────────────────────────────────
  // PROMPT ENGINEERING
  // ───────────────────────────────────────────
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    slug: "prompt-engineering",
    category: "fundamentals",
    difficulty: "beginner",
    description:
      "The art and science of designing inputs to AI models to get desired outputs.",
    whyItExists:
      "The quality of your prompt directly determines the quality of AI output. Better prompts = better results.",
    history:
      "2020: GPT-3 shows prompt sensitivity → 2021: Few-shot, chain-of-thought → 2022: ChatGPT popularizes prompting → 2023: Prompt engineering as a discipline",
    prerequisites: ["what-is-ai", "llm"],
    relatedConcepts: [
      "few-shot-learning",
      "chain-of-thought",
      "system-prompts",
    ],
    examples: [
      {
        title: "Zero-Shot",
        description: "No examples — just the task",
        code: "Translate 'hello' to French",
      },
      {
        title: "Few-Shot",
        description: "Provide examples",
        code: "cat → gato\ndog → perro\nhello →",
      },
      {
        title: "Chain-of-Thought",
        description: "Ask for reasoning",
        code: "Solve step by step: If x + 3 = 7, what is x?",
      },
    ],
    realWorldUseCases: [
      "Customer support automation",
      "Content generation",
      "Code review",
      "Data extraction",
      "Classification",
    ],
    commonMistakes: [
      "Being too vague",
      "Not providing context",
      "Ignoring output format",
      "Not iterating",
    ],
    interviewQuestions: [
      "What is chain-of-thought prompting?",
      "How do you handle hallucination in prompts?",
      "What is a system prompt?",
    ],
    glossary: [
      {
        term: "System Prompt",
        definition: "Instructions that set the AI's behavior and constraints",
      },
      {
        term: "Few-Shot",
        definition: "Providing a few examples to guide the model",
      },
      {
        term: "Chain-of-Thought",
        definition: "Asking the model to show its reasoning step by step",
      },
    ],
    references: [
      {
        title: "OpenAI Prompt Engineering Guide",
        url: "https://platform.openai.com/docs/guides/prompt-engineering",
        type: "article",
      },
      {
        title: "Anthropic Prompt Engineering",
        url: "https://docs.anthropic.com/claude/docs/prompt-engineering",
        type: "article",
      },
    ],
    estimatedMinutes: 25,
    projects: ["prompt-patterns"],
  },
  {
    id: "few-shot-learning",
    title: "Few-Shot Learning",
    slug: "few-shot-learning",
    category: "fundamentals",
    difficulty: "beginner",
    description:
      "Providing a small number of examples in the prompt to teach the model the desired pattern.",
    whyItExists:
      "Few-shot learning lets you customize model behavior without retraining — just add examples to your prompt.",
    history:
      "2020: GPT-3 paper demonstrated few-shot capabilities → Became standard prompting technique",
    prerequisites: ["prompt-engineering"],
    relatedConcepts: ["chain-of-thought", "prompt-engineering"],
    examples: [
      {
        title: "Sentiment Classification",
        description: "Classify reviews with 3 examples",
        code: "'Great product' → positive\n'Terrible service' → negative\n'Okay I guess' → neutral\n'Absolutely love it' →",
      },
    ],
    realWorldUseCases: [
      "Text classification",
      "Named entity recognition",
      "Format conversion",
      "Style transfer",
    ],
    commonMistakes: [
      "Too many examples (cluttered prompt)",
      "Inconsistent examples",
      "Not covering edge cases",
    ],
    interviewQuestions: [
      "How many examples are enough?",
      "What makes a good few-shot example?",
    ],
    glossary: [
      { term: "Shot", definition: "A single example provided in the prompt" },
      {
        term: "Zero-Shot",
        definition: "No examples provided — relying on pre-training",
      },
    ],
    references: [],
    estimatedMinutes: 20,
    projects: [],
  },
  {
    id: "chain-of-thought",
    title: "Chain-of-Thought Prompting",
    slug: "chain-of-thought",
    category: "fundamentals",
    difficulty: "intermediate",
    description:
      "Asking the model to show its reasoning process step by step before giving a final answer.",
    whyItExists:
      "CoT dramatically improves accuracy on complex reasoning tasks by making the model 'think' before answering.",
    history:
      "2022: Wei et al. 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models'",
    prerequisites: ["prompt-engineering"],
    relatedConcepts: ["few-shot-learning", "prompt-engineering"],
    examples: [
      {
        title: "Math Problem",
        description: "Force step-by-step reasoning",
        code: "Q: If a store has 15 apples and sells 7, then buys 12 more, how many?\nA: Let's think step by step.\n1. Start with 15\n2. Sell 7: 15 - 7 = 8\n3. Buy 12: 8 + 12 = 20\nAnswer: 20",
      },
    ],
    realWorldUseCases: [
      "Mathematical reasoning",
      "Logic puzzles",
      "Code debugging",
      "Complex analysis",
      "Multi-step planning",
    ],
    commonMistakes: [
      "Not explicitly asking for steps",
      "Rushing to the answer",
      "Using CoT for simple questions",
    ],
    interviewQuestions: [
      "Why does chain-of-thought work?",
      "When should you NOT use CoT?",
    ],
    glossary: [
      {
        term: "Chain-of-Thought",
        definition: "Prompting technique that elicits step-by-step reasoning",
      },
    ],
    references: [
      {
        title: "Chain-of-Thought Paper",
        url: "https://arxiv.org/abs/2201.11903",
        type: "paper",
      },
    ],
    estimatedMinutes: 25,
    projects: [],
  },

  // ───────────────────────────────────────────
  // RAG & VECTOR DATABASES
  // ───────────────────────────────────────────
  {
    id: "rag",
    title: "Retrieval-Augmented Generation",
    slug: "rag",
    category: "rag",
    difficulty: "intermediate",
    description:
      "Combining retrieval (searching a knowledge base) with generation (LLM) to produce grounded answers.",
    whyItExists:
      "RAG solves LLM hallucination by grounding responses in real, retrieved documents.",
    history:
      "2020: Facebook AI RAG paper → 2023: LangChain, LlamaIndex popularize RAG → 2024: Advanced RAG (hybrid, multi-hop)",
    prerequisites: ["llm", "embeddings"],
    relatedConcepts: [
      "vector-databases",
      "embeddings",
      "chunking",
      "hybrid-search",
    ],
    examples: [
      {
        title: "Document Q&A",
        description: "Ask questions about your PDFs and get grounded answers",
      },
      {
        title: "Customer Support",
        description: "Search help docs and generate personalized responses",
      },
    ],
    realWorldUseCases: [
      "Enterprise knowledge bases",
      "Customer support",
      "Legal research",
      "Medical documentation",
      "Code documentation",
    ],
    commonMistakes: [
      "Poor chunking strategy",
      "Not re-ranking retrieved results",
      "Ignoring context window limits",
      "No evaluation of retrieval quality",
    ],
    interviewQuestions: [
      "How does RAG differ from fine-tuning?",
      "What is chunking?",
      "How do you evaluate RAG quality?",
    ],
    glossary: [
      {
        term: "Retrieval",
        definition: "Finding relevant documents from a knowledge base",
      },
      {
        term: "Augmented",
        definition: "Enhancing the LLM's response with retrieved context",
      },
      {
        term: "Chunking",
        definition: "Splitting documents into smaller pieces for retrieval",
      },
      {
        term: "Reranking",
        definition: "Re-ordering retrieved chunks by relevance",
      },
    ],
    references: [
      {
        title:
          "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        url: "https://arxiv.org/abs/2005.11401",
        type: "paper",
      },
      {
        title: "LangChain RAG Tutorial",
        url: "https://python.langchain.com/docs/tutorials/rag/",
        type: "article",
      },
    ],
    estimatedMinutes: 45,
    projects: ["build-rag-system", "document-qa"],
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    slug: "vector-databases",
    category: "embeddings",
    difficulty: "intermediate",
    description:
      "Databases optimized for storing, indexing, and querying high-dimensional vectors.",
    whyItExists:
      "Traditional databases can't efficiently search by semantic similarity. Vector DBs enable fast similarity search at scale.",
    history:
      "2017: Facebook FAISS → 2019: Milvus → 2021: Pinecone, Weaviate → 2022: Chroma → 2023: pgvector",
    prerequisites: ["embeddings"],
    relatedConcepts: ["embeddings", "rag", "similarity-search"],
    examples: [
      {
        title: "Semantic Search",
        description: "Find documents similar in meaning, not just keywords",
      },
      {
        title: "Recommendation",
        description: "Find items similar to what a user likes",
      },
    ],
    realWorldUseCases: [
      "RAG systems",
      "Recommendation engines",
      "Image search",
      "Anomaly detection",
      "Duplicate detection",
    ],
    commonMistakes: [
      "Choosing wrong index type",
      "Not considering scale",
      "Ignoring metadata filtering",
    ],
    interviewQuestions: [
      "What is HNSW?",
      "How does approximate nearest neighbor work?",
      "When to use vector DB vs. traditional DB?",
    ],
    glossary: [
      {
        term: "ANN",
        definition:
          "Approximate Nearest Neighbor — fast but approximate similarity search",
      },
      {
        term: "HNSW",
        definition:
          "Hierarchical Navigable Small World — a popular vector index algorithm",
      },
      {
        term: "Index",
        definition: "Data structure that speeds up vector similarity search",
      },
    ],
    references: [
      { title: "Chroma", url: "https://docs.trychroma.com/", type: "article" },
      {
        title: "Weaviate",
        url: "https://weaviate.io/developers/weaviate",
        type: "article",
      },
    ],
    estimatedMinutes: 35,
    projects: ["vector-search-engine"],
  },
  {
    id: "chunking",
    title: "Document Chunking",
    slug: "chunking",
    category: "rag",
    difficulty: "intermediate",
    description:
      "Splitting documents into optimal-sized pieces for embedding and retrieval.",
    whyItExists:
      "LLMs have context limits. Documents must be chunked to fit, and good chunking improves retrieval quality.",
    history:
      "Fixed-size → Recursive splitting → Semantic chunking → Agentic chunking",
    prerequisites: ["rag", "embeddings"],
    relatedConcepts: ["rag", "embeddings", "vector-databases"],
    examples: [
      {
        title: "Fixed-Size Chunking",
        description: "Split every 500 characters with 50-character overlap",
      },
      {
        title: "Semantic Chunking",
        description: "Split at topic boundaries using embedding similarity",
      },
    ],
    realWorldUseCases: [
      "RAG preprocessing",
      "Document indexing",
      "Knowledge base creation",
    ],
    commonMistakes: [
      "Chunks too large (dilutes relevance)",
      "Chunks too small (loses context)",
      "Splitting mid-sentence",
    ],
    interviewQuestions: [
      "What size chunks should you use?",
      "How does overlap help?",
      "What is semantic chunking?",
    ],
    glossary: [
      {
        term: "Chunk Size",
        definition: "The number of characters or tokens per chunk",
      },
      {
        term: "Overlap",
        definition: "Characters shared between consecutive chunks",
      },
    ],
    references: [],
    estimatedMinutes: 20,
    projects: [],
  },

  // ───────────────────────────────────────────
  // AGENTS
  // ───────────────────────────────────────────
  {
    id: "agents",
    title: "AI Agents",
    slug: "ai-agents",
    category: "agents",
    difficulty: "advanced",
    description:
      "Autonomous systems that use LLMs to plan, reason, use tools, and take actions to achieve goals.",
    whyItExists:
      "Agents extend LLMs beyond text generation — they can interact with the real world, use tools, and complete multi-step tasks.",
    history:
      "2022: ReAct paper → 2023: AutoGPT, BabyAGI, LangChain Agents → 2024: CrewAI, AutoGen, Claude Computer Use",
    prerequisites: ["llm", "prompt-engineering"],
    relatedConcepts: ["tool-calling", "multi-agent", "planning", "memory"],
    examples: [
      {
        title: "Coding Agent",
        description:
          "An agent that reads code, finds bugs, writes fixes, and runs tests",
      },
      {
        title: "Research Agent",
        description:
          "An agent that searches the web, reads papers, and writes summaries",
      },
    ],
    realWorldUseCases: [
      "Automated coding",
      "Customer support",
      "Data analysis",
      "Workflow automation",
      "Personal assistants",
    ],
    commonMistakes: [
      "No error handling",
      "Infinite loops",
      "Not validating tool outputs",
      "Too much autonomy without oversight",
    ],
    interviewQuestions: [
      "What is the ReAct pattern?",
      "How do agents handle failure?",
      "What is the difference between an agent and a chain?",
    ],
    glossary: [
      {
        term: "Agent",
        definition:
          "An LLM-based system that can plan, reason, and take actions",
      },
      {
        term: "Tool",
        definition: "A function the agent can call (search, calculator, API)",
      },
      {
        term: "ReAct",
        definition:
          "Reasoning + Acting — interleaving thought and action steps",
      },
      {
        term: "Planning",
        definition: "Breaking a goal into subtasks before execution",
      },
    ],
    references: [
      {
        title: "ReAct: Synergizing Reasoning and Acting",
        url: "https://arxiv.org/abs/2210.03629",
        type: "paper",
      },
      {
        title: "LangChain Agents",
        url: "https://python.langchain.com/docs/concepts/agents/",
        type: "article",
      },
    ],
    estimatedMinutes: 50,
    projects: ["build-an-agent", "multi-agent-system"],
  },
  {
    id: "tool-calling",
    title: "Tool Calling",
    slug: "tool-calling",
    category: "agents",
    difficulty: "intermediate",
    description:
      "Enabling LLMs to invoke external functions, APIs, and tools during generation.",
    whyItExists:
      "LLMs can't access the internet, databases, or run code on their own. Tool calling bridges this gap.",
    history:
      "2023: OpenAI Function Calling → 2024: Tool use becomes standard across all major LLMs",
    prerequisites: ["llm", "agents"],
    relatedConcepts: ["agents", "mcp", "function-calling"],
    examples: [
      {
        title: "Weather Lookup",
        description:
          "LLM calls get_weather(city) to answer 'What's the weather in Delhi?'",
      },
      {
        title: "Database Query",
        description: "LLM generates and executes SQL to answer data questions",
      },
    ],
    realWorldUseCases: [
      "Chatbots with real-time data",
      "Automated workflows",
      "API integration",
      "Database assistants",
    ],
    commonMistakes: [
      "Not validating tool outputs",
      "Too many tools (confuses model)",
      "Not handling tool failures",
    ],
    interviewQuestions: [
      "How does the model decide which tool to use?",
      "What is function calling?",
    ],
    glossary: [
      {
        term: "Function Calling",
        definition:
          "The model outputs a structured call to a predefined function",
      },
      {
        term: "Tool Description",
        definition:
          "Natural language description helping the model understand when to use a tool",
      },
    ],
    references: [
      {
        title: "OpenAI Function Calling",
        url: "https://platform.openai.com/docs/guides/function-calling",
        type: "article",
      },
    ],
    estimatedMinutes: 30,
    projects: ["tool-using-agent"],
  },
  {
    id: "mcp",
    title: "Model Context Protocol",
    slug: "mcp",
    category: "agents",
    difficulty: "advanced",
    description:
      "An open protocol for connecting AI agents to external data sources and tools.",
    whyItExists:
      "MCP standardizes how AI models connect to tools, making integrations portable across different AI systems.",
    history:
      "2024: Anthropic introduces MCP → Open standard for agent-tool communication",
    prerequisites: ["agents", "tool-calling"],
    relatedConcepts: ["tool-calling", "agents", "rag"],
    examples: [
      {
        title: "File System Access",
        description: "Agent reads/writes files through MCP server",
      },
      {
        title: "Database Access",
        description:
          "Agent queries databases through standardized MCP interface",
      },
    ],
    realWorldUseCases: [
      "IDE integrations",
      "Database connectors",
      "API gateways",
      "Development tools",
    ],
    commonMistakes: [
      "Not securing MCP servers",
      "Over-permissioning",
      "Ignoring rate limits",
    ],
    interviewQuestions: [
      "What problem does MCP solve?",
      "How does MCP differ from function calling?",
    ],
    glossary: [
      {
        term: "MCP Server",
        definition:
          "A service that exposes tools and data through the MCP protocol",
      },
      {
        term: "MCP Client",
        definition: "An AI application that connects to MCP servers",
      },
    ],
    references: [
      {
        title: "MCP Specification",
        url: "https://spec.modelcontextprotocol.io/",
        type: "article",
      },
    ],
    estimatedMinutes: 30,
    projects: [],
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Systems",
    slug: "multi-agent-systems",
    category: "agents",
    difficulty: "expert",
    description:
      "Systems where multiple AI agents collaborate, each with specialized roles.",
    whyItExists:
      "Complex tasks benefit from specialization — one agent codes, another reviews, another tests.",
    history: "2023: AutoGen, CrewAI → 2024: Multi-agent frameworks mature",
    prerequisites: ["agents", "tool-calling"],
    relatedConcepts: ["agents", "planning", "orchestration"],
    examples: [
      {
        title: "Software Team",
        description:
          "PM agent defines requirements, coder agent builds, QA agent tests",
      },
      {
        title: "Research Team",
        description:
          "Search agent finds papers, analysis agent extracts insights, writer agent creates report",
      },
    ],
    realWorldUseCases: [
      "Software development",
      "Research automation",
      "Business process automation",
      "Creative workflows",
    ],
    commonMistakes: [
      "Too many agents (coordination overhead)",
      "No clear roles",
      "No conflict resolution",
    ],
    interviewQuestions: [
      "How do agents communicate?",
      "What is the orchestrator pattern?",
      "When to use multi-agent vs single agent?",
    ],
    glossary: [
      {
        term: "Orchestrator",
        definition: "A top-level agent that coordinates other agents",
      },
      {
        term: "Specialist Agent",
        definition: "An agent with expertise in a specific domain",
      },
    ],
    references: [
      { title: "CrewAI", url: "https://docs.crewai.com/", type: "article" },
      {
        title: "AutoGen",
        url: "https://microsoft.github.io/autogen/",
        type: "article",
      },
    ],
    estimatedMinutes: 45,
    projects: ["multi-agent-team"],
  },

  // ───────────────────────────────────────────
  // FINE-TUNING & TRAINING
  // ───────────────────────────────────────────
  {
    id: "fine-tuning",
    title: "Fine-Tuning",
    slug: "fine-tuning",
    category: "llm",
    difficulty: "advanced",
    description:
      "Additional training of a pre-trained model on domain-specific data to specialize its behavior.",
    whyItExists:
      "Fine-tuning customizes general-purpose models for specific tasks, domains, or styles without building from scratch.",
    history:
      "2018: Transfer learning → 2019: BERT fine-tuning → 2021: LoRA → 2023: QLoRA makes fine-tuning accessible",
    prerequisites: ["llm", "deep-learning"],
    relatedConcepts: ["rlhf", "lora", "training-data"],
    examples: [
      {
        title: "Domain Specialization",
        description: "Fine-tune on medical literature for healthcare AI",
      },
      {
        title: "Style Transfer",
        description: "Fine-tune on your writing style for personalized AI",
      },
    ],
    realWorldUseCases: [
      "Customer support bots",
      "Legal document analysis",
      "Medical diagnosis",
      "Code generation for specific frameworks",
    ],
    commonMistakes: [
      "Not enough training data",
      "Catastrophic forgetting",
      "Overfitting on small datasets",
      "Not evaluating properly",
    ],
    interviewQuestions: [
      "When should you fine-tune vs. prompt engineer?",
      "What is LoRA?",
      "How do you prevent catastrophic forgetting?",
    ],
    glossary: [
      {
        term: "Fine-Tuning",
        definition: "Continuing training on task-specific data",
      },
      {
        term: "LoRA",
        definition:
          "Low-Rank Adaptation — efficient fine-tuning with fewer parameters",
      },
      {
        term: "Catastrophic Forgetting",
        definition:
          "When fine-tuning causes the model to lose previously learned knowledge",
      },
    ],
    references: [
      {
        title: "LoRA Paper",
        url: "https://arxiv.org/abs/2106.09685",
        type: "paper",
      },
    ],
    estimatedMinutes: 40,
    projects: ["fine-tune-model"],
  },
  {
    id: "rlhf",
    title: "RLHF",
    slug: "rlhf",
    category: "llm",
    difficulty: "expert",
    description:
      "Reinforcement Learning from Human Feedback — training models to align with human preferences.",
    whyItExists:
      "RLHF makes AI assistants more helpful, harmless, and honest by learning from human ratings.",
    history:
      "2017: Christiano et al. → 2022: InstructGPT uses RLHF → ChatGPT popularizes the technique",
    prerequisites: ["fine-tuning", "llm"],
    relatedConcepts: ["fine-tuning", "alignment", "dpo"],
    examples: [
      {
        title: "Helpfulness",
        description: "Training the model to give more useful responses",
      },
      {
        title: "Safety",
        description: "Training the model to refuse harmful requests",
      },
    ],
    realWorldUseCases: [
      "Chatbot alignment",
      "Content moderation",
      "Safety training",
      "Style preference learning",
    ],
    commonMistakes: [
      "Reward hacking",
      "Expensive human labeling",
      "Biased feedback",
    ],
    interviewQuestions: [
      "How does RLHF work step by step?",
      "What is reward hacking?",
      "What is DPO?",
    ],
    glossary: [
      {
        term: "RLHF",
        definition:
          "Using human preferences to train a reward model, then using RL to optimize the LLM",
      },
      {
        term: "DPO",
        definition:
          "Direct Preference Optimization — simplifies RLHF by skipping the reward model",
      },
      {
        term: "Reward Model",
        definition:
          "A model trained to predict human preference between responses",
      },
    ],
    references: [
      {
        title: "InstructGPT Paper",
        url: "https://arxiv.org/abs/2203.02155",
        type: "paper",
      },
    ],
    estimatedMinutes: 45,
    projects: [],
  },

  // ───────────────────────────────────────────
  // DEPLOYMENT & INFRASTRUCTURE
  // ───────────────────────────────────────────
  {
    id: "inference",
    title: "Model Inference",
    slug: "inference",
    category: "deployment",
    difficulty: "intermediate",
    description:
      "Running a trained model to generate predictions or outputs from new inputs.",
    whyItExists:
      "Training creates the model; inference is where the model actually does useful work for users.",
    history:
      "GPU inference → Batch inference → Real-time inference → Edge inference → Serverless inference",
    prerequisites: ["llm"],
    relatedConcepts: ["deployment", "optimization", "quantization"],
    examples: [
      {
        title: "API Inference",
        description: "Sending a prompt to OpenAI and getting a response",
      },
      {
        title: "Local Inference",
        description: "Running Llama on your laptop with Ollama",
      },
    ],
    realWorldUseCases: [
      "Chatbots",
      "Content generation",
      "Image classification",
      "Speech recognition",
    ],
    commonMistakes: [
      "Ignoring latency",
      "Not batching requests",
      "Over-provisioning GPU resources",
    ],
    interviewQuestions: [
      "What affects inference latency?",
      "What is quantization?",
      "How do you optimize inference cost?",
    ],
    glossary: [
      {
        term: "Inference",
        definition: "Using a trained model to make predictions on new data",
      },
      { term: "Latency", definition: "Time from request to response" },
      {
        term: "Throughput",
        definition: "Number of requests processed per second",
      },
    ],
    references: [],
    estimatedMinutes: 25,
    projects: ["deploy-model"],
  },
  {
    id: "quantization",
    title: "Quantization",
    slug: "quantization",
    category: "deployment",
    difficulty: "advanced",
    description:
      "Reducing model precision (32-bit → 8-bit) to decrease memory and increase speed with minimal quality loss.",
    whyItExists:
      "Quantization makes large models runnable on consumer hardware and reduces inference costs.",
    history:
      "2022: GPTQ → 2023: GGUF, AWQ → 2024: 4-bit models become mainstream",
    prerequisites: ["inference", "deep-learning"],
    relatedConcepts: ["inference", "optimization", "gguf"],
    examples: [
      {
        title: "4-bit Quantization",
        description: "Llama 70B runs on a single GPU with 4-bit quantization",
      },
    ],
    realWorldUseCases: [
      "Edge deployment",
      "Cost reduction",
      "Consumer hardware inference",
      "Mobile AI",
    ],
    commonMistakes: [
      "Aggressive quantization degrades quality",
      "Not testing quality after quantization",
    ],
    interviewQuestions: [
      "What is the difference between Q4 and Q8?",
      "How does quantization affect quality?",
    ],
    glossary: [
      {
        term: "Quantization",
        definition:
          "Reducing the number of bits used to represent model weights",
      },
      {
        term: "GGUF",
        definition:
          "GPT-Generated Unified Format — optimized format for local inference",
      },
    ],
    references: [],
    estimatedMinutes: 25,
    projects: [],
  },

  // ───────────────────────────────────────────
  // ETHICS & SAFETY
  // ───────────────────────────────────────────
  {
    id: "ai-safety",
    title: "AI Safety & Ethics",
    slug: "ai-safety",
    category: "ethics",
    difficulty: "intermediate",
    description:
      "Ensuring AI systems are safe, fair, transparent, and aligned with human values.",
    whyItExists:
      "AI systems can cause harm through bias, privacy violations, misinformation, and misuse.",
    history:
      "2016: Algorithmic bias awareness → 2018: GDPR → 2021: AI ethics guidelines → 2023: EU AI Act",
    prerequisites: ["what-is-ai"],
    relatedConcepts: ["alignment", "bias", "fairness", "explainability"],
    examples: [
      {
        title: "Bias Detection",
        description:
          "Hiring AI discriminated against women — detected and corrected",
      },
      {
        title: "Privacy",
        description:
          "ChatGPT memorized and leaked personal data — privacy incident",
      },
    ],
    realWorldUseCases: [
      "Content moderation",
      "Fair lending",
      "Medical AI ethics",
      "Autonomous systems safety",
    ],
    commonMistakes: [
      "Ignoring bias in training data",
      "No human oversight",
      "Black-box deployment",
    ],
    interviewQuestions: [
      "What is algorithmic bias?",
      "How do you make AI explainable?",
      "What is the alignment problem?",
    ],
    glossary: [
      { term: "Bias", definition: "Systematic unfairness in AI predictions" },
      {
        term: "Fairness",
        definition: "Ensuring AI treats all groups equitably",
      },
      {
        term: "Explainability",
        definition: "Making AI decisions understandable to humans",
      },
      {
        term: "Alignment",
        definition: "Ensuring AI behavior matches human intentions and values",
      },
    ],
    references: [
      {
        title: "EU AI Act",
        url: "https://artificialintelligenceact.eu/",
        type: "article",
      },
    ],
    estimatedMinutes: 30,
    projects: ["bias-audit"],
  },

  // ───────────────────────────────────────────
  // PRODUCT & BUSINESS
  // ───────────────────────────────────────────
  {
    id: "ai-product",
    title: "Building AI Products",
    slug: "building-ai-products",
    category: "product",
    difficulty: "intermediate",
    description:
      "The process of taking AI from prototype to production product that users love.",
    whyItExists:
      "Most AI projects fail not because of technology, but because of product thinking.",
    history:
      "2020: AI product discipline emerges → 2023: AI-first product design → 2024: Agent-first products",
    prerequisites: ["llm", "prompt-engineering"],
    relatedConcepts: ["agents", "rag", "deployment"],
    examples: [
      {
        title: "GitHub Copilot",
        description: "AI pair programmer — solved a real developer pain point",
      },
      {
        title: "Notion AI",
        description: "AI writing assistant embedded in an existing product",
      },
    ],
    realWorldUseCases: [
      "SaaS products",
      "Developer tools",
      "Consumer apps",
      "Enterprise solutions",
    ],
    commonMistakes: [
      "Building tech first, product second",
      "Ignoring user feedback",
      "Over-engineering the solution",
    ],
    interviewQuestions: [
      "How do you validate an AI product idea?",
      "What makes AI products different from traditional products?",
    ],
    glossary: [
      {
        term: "PMF",
        definition:
          "Product-Market Fit — when your product satisfies market demand",
      },
      {
        term: "AI-First",
        definition:
          "Products where AI is the core value proposition, not an add-on",
      },
    ],
    references: [],
    estimatedMinutes: 30,
    projects: ["ai-product-prototype"],
  },
];

// Helper functions
export function getNodeById(id: string): KnowledgeNode | undefined {
  return knowledgeGraph.find((n) => n.id === id);
}

export function getNodeBySlug(slug: string): KnowledgeNode | undefined {
  return knowledgeGraph.find((n) => n.slug === slug);
}

export function getNodesByCategory(
  category: KnowledgeCategory,
): KnowledgeNode[] {
  return knowledgeGraph.filter((n) => n.category === category);
}

export function getNodesByDifficulty(
  difficulty: KnowledgeNode["difficulty"],
): KnowledgeNode[] {
  return knowledgeGraph.filter((n) => n.difficulty === difficulty);
}

export function getPrerequisites(id: string): KnowledgeNode[] {
  const node = getNodeById(id);
  if (!node) return [];
  return node.prerequisites
    .map((p) => getNodeById(p))
    .filter(Boolean) as KnowledgeNode[];
}

export function getRelated(id: string): KnowledgeNode[] {
  const node = getNodeById(id);
  if (!node) return [];
  return node.relatedConcepts
    .map((r) => getNodeById(r))
    .filter(Boolean) as KnowledgeNode[];
}

export function getRootConcepts(): KnowledgeNode[] {
  return knowledgeGraph.filter((n) => n.prerequisites.length === 0);
}

export function getCategories(): {
  id: KnowledgeCategory;
  label: string;
  count: number;
}[] {
  const categories = new Map<KnowledgeCategory, number>();
  for (const node of knowledgeGraph) {
    categories.set(node.category, (categories.get(node.category) || 0) + 1);
  }
  return Array.from(categories.entries()).map(([id, count]) => ({
    id,
    label: id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    count,
  }));
}
