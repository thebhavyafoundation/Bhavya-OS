export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  concept: string;
}

export const assessments: Record<string, AssessmentQuestion[]> = {
  "ai-foundations": [
    {
      id: "q1",
      question:
        "What is the primary difference between AI and machine learning?",
      type: "multiple-choice",
      options: [
        "AI is a subset of machine learning",
        "Machine learning is a subset of AI",
        "They are the same thing",
        "AI only refers to robots",
      ],
      correctAnswer: 1,
      explanation:
        "Machine learning is a subset of AI. AI is the broader concept of machines being able to carry out tasks in a way that would typically require human intelligence, while ML is a specific approach to achieving AI through learning from data.",
      difficulty: "easy",
      concept: "AI Definition",
    },
    {
      id: "q2",
      question: "Which type of learning uses labeled training data?",
      type: "multiple-choice",
      options: [
        "Unsupervised learning",
        "Reinforcement learning",
        "Supervised learning",
        "Transfer learning",
      ],
      correctAnswer: 2,
      explanation:
        "Supervised learning uses labeled data — each training example comes with an input and the desired output (label). The model learns to map inputs to outputs.",
      difficulty: "easy",
      concept: "Supervised Learning",
    },
    {
      id: "q3",
      question: "An AI system that can only play chess is an example of:",
      type: "multiple-choice",
      options: [
        "Artificial General Intelligence",
        "Narrow AI",
        "Reinforcement AI",
        "Deep AI",
      ],
      correctAnswer: 1,
      explanation:
        "Narrow AI (also called Weak AI) is designed to perform a specific task. A chess-playing AI is narrow because it excels at one thing — chess — but cannot generalize to other tasks.",
      difficulty: "medium",
      concept: "Types of AI",
    },
    {
      id: "q4",
      question: "True or False: Deep learning is a subset of machine learning.",
      type: "true-false",
      correctAnswer: "true",
      explanation:
        "Deep learning is indeed a subset of machine learning that uses neural networks with many layers (hence 'deep') to learn representations from data.",
      difficulty: "easy",
      concept: "AI Hierarchy",
    },
    {
      id: "q5",
      question: "What was the 'AI Winter'?",
      type: "multiple-choice",
      options: [
        "A period when AI became very popular",
        "A period of reduced funding and interest in AI",
        "When AI was first invented",
        "A type of AI algorithm",
      ],
      correctAnswer: 1,
      explanation:
        "AI Winters were periods (notably in the 1970s and late 1980s) when AI research lost funding and interest because promised capabilities failed to materialize.",
      difficulty: "medium",
      concept: "AI History",
    },
    {
      id: "q6",
      question:
        "In reinforcement learning, what is the trade-off between exploration and exploitation?",
      type: "short-answer",
      correctAnswer:
        "Exploration means trying new actions to discover their effects, while exploitation means using known actions that yield high rewards. The agent must balance trying new things with using what already works.",
      explanation:
        "The exploration-exploitation trade-off is fundamental to reinforcement learning. Too much exploration wastes time on suboptimal actions; too much exploitation may miss better strategies.",
      difficulty: "medium",
      concept: "Reinforcement Learning",
    },
    {
      id: "q7",
      question:
        "Which of these is NOT a real-world application of AI in healthcare?",
      type: "multiple-choice",
      options: [
        "Medical imaging analysis",
        "Drug discovery",
        "Performing surgery autonomously without human oversight",
        "Predicting patient readmission risk",
      ],
      correctAnswer: 2,
      explanation:
        "While AI assists in medical imaging, drug discovery, and risk prediction, autonomous surgery without human oversight is not a current real-world application. Surgical robots are guided by surgeons, not fully autonomous.",
      difficulty: "medium",
      concept: "AI in Healthcare",
    },
    {
      id: "q8",
      question:
        "True or False: A neural network with more layers is always better than one with fewer layers.",
      type: "true-false",
      correctAnswer: "false",
      explanation:
        "More layers can lead to overfitting, longer training times, and vanishing gradient problems. The optimal depth depends on the task, data size, and architecture design.",
      difficulty: "medium",
      concept: "Neural Networks",
    },
    {
      id: "q9",
      question: "What is transfer learning?",
      type: "multiple-choice",
      options: [
        "Training a model from scratch on a new dataset",
        "Transferring data between databases",
        "Using a pre-trained model as a starting point for a new task",
        "Moving a model from one server to another",
      ],
      correctAnswer: 2,
      explanation:
        "Transfer learning takes a model trained on one task and adapts it for a different but related task. It dramatically reduces training time and data requirements.",
      difficulty: "easy",
      concept: "Transfer Learning",
    },
    {
      id: "q10",
      question:
        "Name one ethical concern that arises when deploying AI in criminal justice.",
      type: "short-answer",
      correctAnswer:
        "Algorithmic bias leading to unfair sentencing or profiling of specific demographic groups.",
      explanation:
        "AI systems used in criminal justice (e.g., risk assessment tools) can perpetuate or amplify historical biases in training data, leading to discriminatory outcomes against marginalized communities.",
      difficulty: "hard",
      concept: "AI Ethics",
    },
  ],

  "machine-learning": [
    {
      id: "ml-q1",
      question: "In linear regression, what does the cost function measure?",
      type: "multiple-choice",
      options: [
        "How fast the model trains",
        "The difference between predictions and actual values",
        "The number of features",
        "The model's accuracy",
      ],
      correctAnswer: 1,
      explanation:
        "The cost function (typically Mean Squared Error) measures the average squared difference between the model's predictions and the actual target values. The goal of training is to minimize this cost.",
      difficulty: "medium",
      concept: "Cost Function",
    },
    {
      id: "ml-q2",
      question: "What is overfitting?",
      type: "multiple-choice",
      options: [
        "When a model performs well on both training and test data",
        "When a model learns noise in training data and performs poorly on new data",
        "When a model is too simple to capture patterns",
        "When a model takes too long to train",
      ],
      correctAnswer: 1,
      explanation:
        "Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor generalization to unseen data.",
      difficulty: "medium",
      concept: "Model Evaluation",
    },
    {
      id: "ml-q3",
      question:
        "Which metric is most appropriate for imbalanced classification?",
      type: "multiple-choice",
      options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-Squared"],
      correctAnswer: 1,
      explanation:
        "F1 Score is the harmonic mean of precision and recall, making it more informative than accuracy for imbalanced datasets where one class dominates.",
      difficulty: "hard",
      concept: "Model Evaluation",
    },
    {
      id: "ml-q4",
      question:
        "What is the main advantage of using random forests over a single decision tree?",
      type: "multiple-choice",
      options: [
        "They are faster to train",
        "They require less memory",
        "They reduce variance through ensemble averaging",
        "They are easier to interpret",
      ],
      correctAnswer: 2,
      explanation:
        "Random forests reduce variance by training multiple trees on different subsets of data and features, then averaging their predictions. This makes them more robust and less prone to overfitting than individual trees.",
      difficulty: "medium",
      concept: "Ensemble Methods",
    },
    {
      id: "ml-q5",
      question: "What does the sigmoid function output?",
      type: "multiple-choice",
      options: [
        "A value between -infinity and +infinity",
        "A value between 0 and 1",
        "A binary 0 or 1",
        "A value between -1 and 1",
      ],
      correctAnswer: 1,
      explanation:
        "The sigmoid function squashes any real number to a value between 0 and 1, making it useful for converting logits to probabilities in logistic regression.",
      difficulty: "easy",
      concept: "Logistic Regression",
    },
    {
      id: "ml-q6",
      question:
        "Explain the difference between precision and recall. When would you prioritize one over the other?",
      type: "short-answer",
      correctAnswer:
        "Precision measures how many selected items are relevant (TP / (TP + FP)). Recall measures how many relevant items are selected (TP / (TP + FN)). Prioritize precision when false positives are costly (e.g., spam detection). Prioritize recall when false negatives are costly (e.g., cancer screening).",
      explanation:
        "Precision and recall are trade-offs. In medical diagnosis, missing a disease (low recall) is worse than a false alarm (low precision). In spam filtering, marking legitimate email as spam (low precision) is worse than letting some spam through.",
      difficulty: "hard",
      concept: "Model Evaluation",
    },
    {
      id: "ml-q7",
      question: "What is gradient descent?",
      type: "multiple-choice",
      options: [
        "A method to find the maximum of a function",
        "An optimization algorithm that iteratively adjusts parameters to minimize a cost function",
        "A way to visualize data in 2D",
        "A preprocessing technique for scaling features",
      ],
      correctAnswer: 1,
      explanation:
        "Gradient descent is an optimization algorithm that computes the gradient of the cost function and updates parameters in the opposite direction, iteratively moving toward the minimum.",
      difficulty: "medium",
      concept: "Optimization",
    },
    {
      id: "ml-q8",
      question:
        "True or False: Feature scaling is important for K-nearest neighbors but not for decision trees.",
      type: "true-false",
      correctAnswer: "true",
      explanation:
        "KNN relies on distance calculations, so features with larger ranges will dominate. Decision trees make splits based on individual features and are invariant to feature scaling.",
      difficulty: "medium",
      concept: "Feature Engineering",
    },
    {
      id: "ml-q9",
      question: "What is cross-validation used for?",
      type: "multiple-choice",
      options: [
        "To speed up model training",
        "To generate more training data",
        "To get a more reliable estimate of model performance",
        "To reduce the number of features",
      ],
      correctAnswer: 2,
      explanation:
        "Cross-validation splits data into multiple folds and trains/evaluates on different combinations, providing a more robust estimate of how the model will perform on unseen data.",
      difficulty: "easy",
      concept: "Model Evaluation",
    },
    {
      id: "ml-q10",
      question:
        "Describe a scenario where a random forest might perform worse than a single decision tree.",
      type: "short-answer",
      correctAnswer:
        "When interpretability is critical (e.g., regulatory requirements demanding explainable decisions), or when the dataset is very small and the ensemble overhead provides no benefit, or when the problem requires capturing very specific decision boundaries that a single deep tree handles better.",
      explanation:
        "Random forests trade interpretability for performance. In domains like healthcare or finance where decisions must be explained to stakeholders, a single interpretable tree may be preferred despite lower accuracy.",
      difficulty: "hard",
      concept: "Ensemble Methods",
    },
  ],

  "deep-learning": [
    {
      id: "dl-q1",
      question:
        "What is the purpose of an activation function in a neural network?",
      type: "multiple-choice",
      options: [
        "To initialize weights",
        "To introduce non-linearity",
        "To normalize the input data",
        "To reduce the learning rate",
      ],
      correctAnswer: 1,
      explanation:
        "Activation functions introduce non-linearity into the network, allowing it to learn complex patterns. Without them, a neural network would be equivalent to a linear model regardless of depth.",
      difficulty: "easy",
      concept: "Activation Functions",
    },
    {
      id: "dl-q2",
      question: "What problem does batch normalization solve during training?",
      type: "multiple-choice",
      options: [
        "Overfitting",
        "Internal covariate shift",
        "Missing data",
        "Vanishing gradients only",
      ],
      correctAnswer: 1,
      explanation:
        "Batch normalization addresses internal covariate shift by normalizing layer inputs, which stabilizes training, allows higher learning rates, and acts as a regularizer.",
      difficulty: "medium",
      concept: "Batch Normalization",
    },
    {
      id: "dl-q3",
      question: "In a CNN, what is the purpose of a pooling layer?",
      type: "multiple-choice",
      options: [
        "To increase the number of parameters",
        "To reduce spatial dimensions and computational cost",
        "To add more non-linearity",
        "To initialize the network weights",
      ],
      correctAnswer: 1,
      explanation:
        "Pooling layers reduce the spatial dimensions of feature maps, decreasing computational cost and helping the network become invariant to small translations in the input.",
      difficulty: "easy",
      concept: "CNN Architecture",
    },
    {
      id: "dl-q4",
      question: "What is dropout?",
      type: "multiple-choice",
      options: [
        "Removing data from the training set",
        "Randomly deactivating neurons during training to prevent overfitting",
        "A method to speed up training",
        "A technique for feature selection",
      ],
      correctAnswer: 1,
      explanation:
        "Dropout randomly sets a fraction of neurons to zero during each training step, preventing co-adaptation and acting as an ensemble method that improves generalization.",
      difficulty: "easy",
      concept: "Regularization",
    },
    {
      id: "dl-q5",
      question: "What is the vanishing gradient problem?",
      type: "multiple-choice",
      options: [
        "Gradients become too large and explode",
        "Gradients shrink exponentially in early layers, making them hard to update",
        "The model cannot find the gradient",
        "The learning rate is too small",
      ],
      correctAnswer: 1,
      explanation:
        "In deep networks, gradients can shrink exponentially as they propagate backward through many layers, making early layers learn extremely slowly. This was a major barrier before techniques like ReLU and residual connections.",
      difficulty: "medium",
      concept: "Training Challenges",
    },
    {
      id: "dl-q6",
      question:
        "Explain why residual connections (skip connections) in ResNet help train very deep networks.",
      type: "short-answer",
      correctAnswer:
        "Residual connections allow gradients to flow directly through skip connections, bypassing intermediate layers. This creates a 'gradient highway' that prevents vanishing gradients and allows networks to learn identity mappings when deeper layers are not needed.",
      explanation:
        "Without skip connections, gradients must pass through every layer during backpropagation, diminishing with each step. Skip connections provide a shortcut, enabling gradients to reach early layers even in networks with hundreds of layers.",
      difficulty: "hard",
      concept: "Architecture Design",
    },
    {
      id: "dl-q7",
      question: "What is transfer learning in the context of deep learning?",
      type: "multiple-choice",
      options: [
        "Moving data between GPUs",
        "Using pre-trained weights from one task as initialization for another",
        "Transferring models between frameworks",
        "Sharing parameters between layers",
      ],
      correctAnswer: 1,
      explanation:
        "Transfer learning uses a model trained on a large dataset (e.g., ImageNet) as a starting point, then fine-tunes it for a specific task with less data.",
      difficulty: "easy",
      concept: "Transfer Learning",
    },
    {
      id: "dl-q8",
      question: "What does the 'attention' mechanism in transformers compute?",
      type: "multiple-choice",
      options: [
        "The distance between tokens",
        "A weighted sum of values based on similarity between queries and keys",
        "The frequency of each token",
        "The position of each token in the sequence",
      ],
      correctAnswer: 1,
      explanation:
        "Attention computes compatibility scores between queries and keys, converts them to weights via softmax, and uses those weights to compute a weighted sum of values — allowing each token to focus on relevant others.",
      difficulty: "medium",
      concept: "Attention Mechanism",
    },
    {
      id: "dl-q9",
      question:
        "Why is data augmentation important for training deep learning models?",
      type: "short-answer",
      correctAnswer:
        "Data augmentation increases the effective size and diversity of training data by applying transformations (rotations, flips, crops, color changes), which helps prevent overfitting and improves generalization.",
      explanation:
        "Deep networks are data-hungry and prone to overfitting. Augmentation teaches the model invariance to irrelevant variations (orientation, lighting) while preserving label-relevant information.",
      difficulty: "medium",
      concept: "Data Augmentation",
    },
    {
      id: "dl-q10",
      question:
        "What is the key difference between BERT and GPT architectures?",
      type: "multiple-choice",
      options: [
        "BERT is larger than GPT",
        "BERT uses bidirectional attention (encoder), GPT uses unidirectional attention (decoder)",
        "GPT requires labeled data, BERT does not",
        "They use different tokenization methods",
      ],
      correctAnswer: 1,
      explanation:
        "BERT is an encoder model that attends to both left and right context (bidirectional), making it strong for understanding tasks. GPT is a decoder model that attends only to left context (autoregressive), making it strong for generation tasks.",
      difficulty: "medium",
      concept: "Transformer Architectures",
    },
  ],

  "natural-language-processing": [
    {
      id: "nlp-q1",
      question:
        "What is the main advantage of subword tokenization over word-level tokenization?",
      type: "multiple-choice",
      options: [
        "It produces shorter sequences",
        "It handles out-of-vocabulary words and morphological variation",
        "It is faster to compute",
        "It eliminates the need for embeddings",
      ],
      correctAnswer: 1,
      explanation:
        "Subword tokenization (BPE, WordPiece) breaks rare or unknown words into meaningful subword units, handling out-of-vocabulary words and capturing morphological patterns like prefixes and suffixes.",
      difficulty: "medium",
      concept: "Tokenization",
    },
    {
      id: "nlp-q2",
      question:
        "In the transformer architecture, what is the purpose of positional encoding?",
      type: "multiple-choice",
      options: [
        "To normalize the input",
        "To provide information about token order since attention is permutation-invariant",
        "To reduce the sequence length",
        "To increase model depth",
      ],
      correctAnswer: 1,
      explanation:
        "Self-attention treats input as a set and has no inherent notion of order. Positional encodings inject information about token position, allowing the model to distinguish 'the cat sat' from 'sat the cat'.",
      difficulty: "medium",
      concept: "Transformers",
    },
    {
      id: "nlp-q3",
      question:
        "What is the difference between extractive and abstractive summarization?",
      type: "multiple-choice",
      options: [
        "Extractive is faster, abstractive is slower",
        "Extractive selects existing sentences; abstractive generates new sentences",
        "Extractive uses AI, abstractive does not",
        "There is no meaningful difference",
      ],
      correctAnswer: 1,
      explanation:
        "Extractive summarization picks the most important sentences from the source text verbatim. Abstractive summarization generates new sentences that capture the meaning, requiring deeper language understanding.",
      difficulty: "medium",
      concept: "Text Summarization",
    },
    {
      id: "nlp-q4",
      question:
        "What is the key innovation of attention over earlier seq2seq models?",
      type: "multiple-choice",
      options: [
        "Faster training",
        "It allows the decoder to attend to different parts of the input at each step",
        "It eliminates the need for an encoder",
        "It works without embeddings",
      ],
      correctAnswer: 1,
      explanation:
        "Earlier seq2seq models compressed the entire input into a fixed-length vector. Attention lets the decoder look at all encoder hidden states, focusing on the most relevant input positions at each decoding step.",
      difficulty: "medium",
      concept: "Attention History",
    },
    {
      id: "nlp-q5",
      question: "What is a language model's perplexity measuring?",
      type: "multiple-choice",
      options: [
        "How fast the model generates text",
        "How surprised the model is by a sequence of tokens",
        "The model's accuracy on a classification task",
        "The number of parameters in the model",
      ],
      correctAnswer: 1,
      explanation:
        "Perplexity measures how well a probability model predicts a sample. Lower perplexity means the model is less 'surprised' by the text, indicating better predictions. It is the exponentiated average negative log-likelihood.",
      difficulty: "hard",
      concept: "Language Modeling",
    },
    {
      id: "nlp-q6",
      question:
        "Explain the difference between fine-tuning and prompt engineering for using large language models.",
      type: "short-answer",
      correctAnswer:
        "Fine-tuning updates the model's weights on domain-specific data to adapt its behavior. Prompt engineering designs inputs (prompts) to elicit desired outputs without modifying the model. Fine-tuning requires data and compute; prompt engineering requires domain expertise and creativity.",
      explanation:
        "Fine-tuning is better for consistent domain-specific behavior at scale. Prompt engineering is faster to iterate and preserves the original model capabilities. Many applications combine both approaches.",
      difficulty: "hard",
      concept: "LLM Usage",
    },
    {
      id: "nlp-q7",
      question: "What is named entity recognition (NER)?",
      type: "multiple-choice",
      options: [
        "Translating text between languages",
        "Identifying and classifying entities like persons, organizations, and locations in text",
        "Generating summaries of documents",
        "Sentiment analysis of social media posts",
      ],
      correctAnswer: 1,
      explanation:
        "NER is a sequence labeling task that identifies spans of text referring to named entities (people, organizations, locations, dates) and classifies them into predefined categories.",
      difficulty: "easy",
      concept: "Text Classification",
    },
    {
      id: "nlp-q8",
      question:
        "Why is evaluation in NLP often harder than in computer vision?",
      type: "short-answer",
      correctAnswer:
        "Language is inherently ambiguous — multiple valid outputs exist for the same input. Metrics like BLEU or ROUGE only capture surface-level overlap, not semantic correctness. Human evaluation is expensive and subjective.",
      explanation:
        "A translation can be correct in multiple ways. A summary can capture meaning differently. Computer vision tasks like classification have clearer ground truth labels, making automated evaluation more reliable.",
      difficulty: "hard",
      concept: "NLP Evaluation",
    },
    {
      id: "nlp-q9",
      question: "What is the catastrophic forgetting problem in fine-tuning?",
      type: "multiple-choice",
      options: [
        "The model runs out of memory",
        "The model loses previously learned knowledge when trained on new data",
        "The model forgets to apply attention",
        "The tokenizer loses vocabulary",
      ],
      correctAnswer: 1,
      explanation:
        "When fine-tuning on a narrow task, the model can lose general capabilities learned during pre-training. Techniques like LoRA, adapter layers, and rehearsal help mitigate this.",
      difficulty: "medium",
      concept: "Fine-tuning Challenges",
    },
    {
      id: "nlp-q10",
      question: "What is retrieval-augmented generation (RAG)?",
      type: "multiple-choice",
      options: [
        "A method to generate training data",
        "Combining a language model with external knowledge retrieval at inference time",
        "A type of data augmentation",
        "A model compression technique",
      ],
      correctAnswer: 1,
      explanation:
        "RAG retrieves relevant documents from an external knowledge base and provides them as context to the language model, enabling grounded, up-to-date responses without retraining.",
      difficulty: "medium",
      concept: "RAG Systems",
    },
  ],

  "ai-ethics": [
    {
      id: "ethics-q1",
      question: "What is algorithmic bias?",
      type: "multiple-choice",
      options: [
        "A bug in the code",
        "Systematic and unfair discrimination resulting from AI decisions",
        "A preference for certain algorithms",
        "Bias in the training hardware",
      ],
      correctAnswer: 1,
      explanation:
        "Algorithmic bias refers to systematic and repeatable errors in an AI system that create unfair outcomes, such as discriminating against certain demographic groups.",
      difficulty: "easy",
      concept: "Algorithmic Bias",
    },
    {
      id: "ethics-q2",
      question: "What is the 'fairness-accuracy trade-off'?",
      type: "multiple-choice",
      options: [
        "Fair models are always less accurate",
        "Optimizing for fairness can sometimes reduce accuracy metrics, and vice versa",
        "There is no relationship between fairness and accuracy",
        "Accuracy is more important than fairness",
      ],
      correctAnswer: 1,
      explanation:
        "Making a model fairer (e.g., by equalizing error rates across groups) can sometimes reduce overall accuracy. The trade-off depends on the fairness definition and context, requiring careful ethical consideration.",
      difficulty: "medium",
      concept: "Fairness Trade-off",
    },
    {
      id: "ethics-q3",
      question:
        "What is the main purpose of LIME (Local Interpretable Model-agnostic Explanations)?",
      type: "multiple-choice",
      options: [
        "To train models faster",
        "To explain individual predictions by approximating the model locally",
        "To compress model size",
        "To generate synthetic data",
      ],
      correctAnswer: 1,
      explanation:
        "LIME explains individual predictions by fitting a simple, interpretable model in the neighborhood of the prediction, providing local explanations that are faithful to the complex model's behavior.",
      difficulty: "medium",
      concept: "Explainable AI",
    },
    {
      id: "ethics-q4",
      question: "What is a 'model card'?",
      type: "multiple-choice",
      options: [
        "A credit card for AI services",
        "A documentation framework describing a model's intended use, limitations, and performance across groups",
        "A type of neural network architecture",
        "A hardware specification for running models",
      ],
      correctAnswer: 1,
      explanation:
        "Model cards are documentation that includes a model's intended use, training data, evaluation metrics broken down by demographic groups, known limitations, and ethical considerations.",
      difficulty: "easy",
      concept: "AI Governance",
    },
    {
      id: "ethics-q5",
      question: "What is differential privacy in the context of AI?",
      type: "multiple-choice",
      options: [
        "Different models for different users",
        "A mathematical framework that provides guarantees about individual privacy in data analysis",
        "Using different privacy settings for each feature",
        "Encrypting model weights",
      ],
      correctAnswer: 1,
      explanation:
        "Differential privacy provides a mathematical guarantee that the output of an analysis will be approximately the same whether or not any individual's data is included, limiting privacy leakage.",
      difficulty: "hard",
      concept: "Privacy",
    },
    {
      id: "ethics-q6",
      question:
        "Describe a real-world case where AI bias caused measurable harm. What was the bias, and how could it have been mitigated?",
      type: "short-answer",
      correctAnswer:
        "COMPAS (Correctional Offender Management Profiling) was shown to falsely flag Black defendants as high-risk at nearly twice the rate of white defendants. The bias originated from historical arrest data that reflected systemic policing disparities. Mitigation could include using fairness-aware training, auditing across demographic groups, and supplementing data with non-arrest-based risk indicators.",
      explanation:
        "The ProPublica analysis of COMPAS demonstrated how historical data biases propagate into AI decisions that directly affect people's lives, highlighting the need for rigorous fairness auditing.",
      difficulty: "hard",
      concept: "Real-world Bias",
    },
    {
      id: "ethics-q7",
      question: "What is the 'right to explanation' in AI ethics?",
      type: "multiple-choice",
      options: [
        "The right to see the source code",
        "The right to receive meaningful information about the logic behind an AI decision",
        "The right to delete your data",
        "The right to choose which AI to use",
      ],
      correctAnswer: 1,
      explanation:
        "The right to explanation (referenced in GDPR) means individuals affected by automated decisions should receive clear, meaningful explanations of how the decision was made and what factors were considered.",
      difficulty: "medium",
      concept: "AI Rights",
    },
    {
      id: "ethics-q8",
      question:
        "Why might a model that is fair according to demographic parity still be considered unfair?",
      type: "short-answer",
      correctAnswer:
        "Demographic parity only ensures equal acceptance rates across groups, but ignores whether the model is equally accurate for each group. A model could satisfy demographic parity while having much higher error rates for a minority group.",
      explanation:
        "Fairness is multidimensional. A hiring model could accept equal percentages from all groups but misclassify qualified candidates from one group at a higher rate. Multiple fairness criteria must be evaluated together.",
      difficulty: "hard",
      concept: "Fairness Metrics",
    },
    {
      id: "ethics-q9",
      question: "What is the environmental impact of training large AI models?",
      type: "multiple-choice",
      options: [
        "Negligible — AI runs on clean energy",
        "Training large models can emit significant carbon, comparable to the lifetime emissions of several cars",
        "AI has no environmental impact",
        "Only the inference phase has environmental impact",
      ],
      correctAnswer: 1,
      explanation:
        "Training large language models can emit hundreds of tons of CO2, equivalent to several cars' lifetime emissions. This raises ethical questions about resource allocation and the need for efficiency research.",
      difficulty: "medium",
      concept: "AI Sustainability",
    },
    {
      id: "ethics-q10",
      question:
        "What organizational practices would you recommend for responsible AI development?",
      type: "short-answer",
      correctAnswer:
        "Key practices include: establishing an AI ethics board, conducting bias audits before deployment, implementing diverse testing teams, creating model cards and documentation, establishing feedback mechanisms for affected users, regular monitoring for emerging biases, and training teams on responsible AI principles.",
      explanation:
        "Responsible AI requires both technical practices (bias testing, documentation) and organizational structures (ethics boards, diverse teams, feedback loops) to ensure ongoing accountability.",
      difficulty: "medium",
      concept: "AI Governance",
    },
  ],
};
