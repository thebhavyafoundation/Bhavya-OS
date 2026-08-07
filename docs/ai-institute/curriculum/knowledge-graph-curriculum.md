# Knowledge Graph Curriculum

**Version:** 1.0 | **Status:** Complete | **Last Updated:** 2026-08-07

---

## Executive Summary

The canonical knowledge graph maps every concept in the Bhavya AI Curriculum. Each node includes prerequisites, difficulty, dependencies, research, implementations, labs, projects, assessments, and career relevance.

---

## Graph Structure

### Node Schema

```typescript
interface ConceptNode {
  id: string;
  name: string;
  school: string;
  course: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  prerequisites: string[];
  dependencies: string[];
  research: Research[];
  implementations: Implementation[];
  labs: Lab[];
  projects: Project[];
  assessments: Assessment[];
  careerRelevance: CareerRelevance;
}
```

---

## Level 1: Mathematics

### 1.1 Linear Algebra

```
Linear Algebra
├── Vectors
│   ├── Vector Addition
│   ├── Scalar Multiplication
│   ├── Dot Product
│   ├── Cross Product
│   └── Norms
├── Matrices
│   ├── Matrix Addition
│   ├── Matrix Multiplication
│   ├── Transpose
│   ├── Inverse
│   └── Determinant
├── Linear Transformations
│   ├── Rotation
│   ├── Scaling
│   ├── Shearing
│   └── Projection
├── Eigenvalues and Eigenvectors
│   ├── Characteristic Equation
│   ├── Diagonalization
│   └── Spectral Decomposition
├── Singular Value Decomposition
│   ├── SVD Algorithm
│   ├── Low-rank Approximation
│   └── Applications
└── Applications in ML
    ├── Feature Spaces
    ├── Dimensionality Reduction
    └── Matrix Factorization
```

**Prerequisites:** None
**Difficulty:** Beginner → Intermediate
**Career Relevance:** Essential for all AI roles

### 1.2 Calculus

```
Calculus
├── Derivatives
│   ├── Definition
│   ├── Rules
│   ├── Chain Rule
│   └── Partial Derivatives
├── Gradients
│   ├── Gradient Vector
│   ├── Directional Derivative
│   └── Gradient Descent
├── Optimization
│   ├── Local Minima
│   ├── Global Minima
│   ├── Convexity
│   └── Constrained Optimization
├── Integration
│   ├── Definite Integral
│   ├── Probability Density
└── Applications in ML
    ├── Backpropagation
    ├── Loss Functions
    └── Regularization
```

**Prerequisites:** None
**Difficulty:** Beginner → Intermediate
**Career Relevance:** Essential for all AI roles

### 1.3 Probability and Statistics

```
Probability and Statistics
├── Probability Basics
│   ├── Sample Space
│   ├── Events
│   ├── Conditional Probability
│   └── Bayes Theorem
├── Distributions
│   ├── Bernoulli
│   ├── Binomial
│   ├── Gaussian
│   ├── Poisson
│   └── Exponential
├── Statistical Inference
│   ├── Estimation
│   ├── Confidence Intervals
│   ├── Hypothesis Testing
│   └── p-values
├── Bayesian Statistics
│   ├── Prior
│   ├── Likelihood
│   ├── Posterior
│   └── MAP Estimation
└── Applications in ML
    ├── Naive Bayes
    ├── Bayesian Networks
    └── Probabilistic Models
```

**Prerequisites:** None
**Difficulty:** Beginner → Intermediate
**Career Relevance:** Essential for all AI roles

### 1.4 Discrete Mathematics

```
Discrete Mathematics
├── Logic
│   ├── Propositional Logic
│   ├── Predicate Logic
│   └── Proofs
├── Set Theory
│   ├── Sets
│   ├── Relations
│   └── Functions
├── Graph Theory
│   ├── Graphs
│   ├── Trees
│   ├── Paths
│   └── Connectivity
└── Combinatorics
    ├── Permutations
    ├── Combinations
    └── Counting
```

**Prerequisites:** None
**Difficulty:** Beginner → Intermediate
**Career Relevance:** Important for algorithms, knowledge graphs

---

## Level 2: Programming

### 2.1 Python

```
Python
├── Basics
│   ├── Variables
│   ├── Data Types
│   ├── Control Flow
│   └── Functions
├── Data Structures
│   ├── Lists
│   ├── Dictionaries
│   ├── Sets
│   └── Tuples
├── Object-Oriented Programming
│   ├── Classes
│   ├── Inheritance
│   ├── Polymorphism
│   └── Encapsulation
├── Libraries
│   ├── NumPy
│   ├── Pandas
│   ├── Matplotlib
│   └── Scikit-learn
└── Advanced
    ├── Decorators
    ├── Generators
    ├── Context Managers
    └── Async/Await
```

**Prerequisites:** None
**Difficulty:** Beginner → Advanced
**Career Relevance:** Essential for all AI roles

### 2.2 SQL

```
SQL
├── Basics
│   ├── SELECT
│   ├── INSERT
│   ├── UPDATE
│   └── DELETE
├── Advanced
│   ├── JOINs
│   ├── Subqueries
│   ├── Window Functions
│   └── CTEs
├── Optimization
│   ├── Indexes
│   ├── Query Planning
│   └── Performance
└── Data Modeling
    ├── Normalization
    ├── Star Schema
    └── Data Warehousing
```

**Prerequisites:** None
**Difficulty:** Beginner → Advanced
**Career Relevance:** Essential for data engineering, ML engineering

### 2.3 JavaScript/TypeScript

```
JavaScript/TypeScript
├── JavaScript Basics
│   ├── Variables
│   ├── Functions
│   ├── DOM Manipulation
│   └── Async/Await
├── TypeScript
│   ├── Types
│   ├── Interfaces
│   ├── Generics
│   └── Utilities
├── Node.js
│   ├── Express
│   ├── REST APIs
│   └── WebSockets
└── Frontend
    ├── React/Next.js
    ├── State Management
    └── Styling
```

**Prerequisites:** None
**Difficulty:** Beginner → Advanced
**Career Relevance:** Important for AI product, API development

### 2.4 C++

```
C++
├── Basics
│   ├── Variables
│   ├── Control Flow
│   ├── Functions
│   └── Classes
├── Advanced
│   ├── Templates
│   ├── Memory Management
│   ├── STL
│   └── Move Semantics
├── CUDA
│   ├── GPU Programming
│   ├── Kernel Functions
│   └── Memory Management
└── Performance
    ├── Optimization
    ├── Profiling
    └── Low-level Optimization
```

**Prerequisites:** Python
**Difficulty:** Intermediate → Expert
**Career Relevance:** Important for CUDA engineering, performance optimization

---

## Level 3: ML Fundamentals

### 3.1 Supervised Learning

```
Supervised Learning
├── Linear Regression
│   ├── Simple Linear Regression
│   ├── Multiple Linear Regression
│   ├── Regularization (Ridge, Lasso)
│   └── Evaluation Metrics
├── Logistic Regression
│   ├── Binary Classification
│   ├── Multi-class Classification
│   ├── Regularization
│   └── Evaluation Metrics
├── Decision Trees
│   ├── ID3
│   ├── C4.5
│   ├── CART
│   └── Pruning
├── Random Forests
│   ├── Bagging
│   ├── Feature Randomness
│   └── Ensemble Methods
├── Support Vector Machines
│   ├── Linear SVM
│   ├── Kernel SVM
│   ├── Soft Margin
│   └── Optimization
├── K-Nearest Neighbors
│   ├── Distance Metrics
│   ├── K Selection
│   └── Weighted KNN
└── Evaluation Metrics
    ├── Accuracy
    ├── Precision
    ├── Recall
    ├── F1 Score
    ├── ROC AUC
    └── Confusion Matrix
```

**Prerequisites:** Linear Algebra, Calculus, Python
**Difficulty:** Beginner → Intermediate
**Career Relevance:** Essential for all ML roles

### 3.2 Unsupervised Learning

```
Unsupervised Learning
├── Clustering
│   ├── K-Means
│   ├── Hierarchical Clustering
│   ├── DBSCAN
│   └── Gaussian Mixture Models
├── Dimensionality Reduction
│   ├── PCA
│   ├── t-SNE
│   ├── UMAP
│   └── Autoencoders
├── Association Rules
│   ├── Apriori
│   └── FP-Growth
└── Anomaly Detection
    ├── Statistical Methods
    ├── Isolation Forest
    └── One-Class SVM
```

**Prerequisites:** Linear Algebra, Python
**Difficulty:** Intermediate
**Career Relevance:** Important for ML roles

### 3.3 Model Evaluation

```
Model Evaluation
├── Cross-Validation
│   ├── K-Fold
│   ├── Stratified K-Fold
│   └── Leave-One-Out
├── Bias-Variance Tradeoff
│   ├── Bias
│   ├── Variance
│   └── Regularization
├── Hyperparameter Tuning
│   ├── Grid Search
│   ├── Random Search
│   ├── Bayesian Optimization
│   └── Early Stopping
├── Model Selection
│   ├── Information Criteria
│   ├── Cross-Validation
│   └── Statistical Tests
└── Evaluation Metrics
    ├── Regression Metrics
    ├── Classification Metrics
    └── Ranking Metrics
```

**Prerequisites:** Supervised Learning
**Difficulty:** Intermediate
**Career Relevance:** Essential for all ML roles

---

## Level 4: Deep Learning

### 4.1 Neural Networks

```
Neural Networks
├── Architecture
│   ├── Perceptron
│   ├── Multi-Layer Perceptron
│   ├── Activation Functions
│   └── Network Design
├── Training
│   ├── Backpropagation
│   ├── Gradient Descent
│   ├── Optimizers (SGD, Adam)
│   └── Learning Rate Scheduling
├── Regularization
│   ├── Dropout
│   ├── Batch Normalization
│   ├── Weight Decay
│   └── Early Stopping
├── Loss Functions
│   ├── Cross-Entropy
│   ├── MSE
│   ├── MAE
│   └── Custom Losses
└── Implementation
    ├── PyTorch
    ├── TensorFlow
    └── From Scratch
```

**Prerequisites:** Supervised Learning, Linear Algebra, Calculus
**Difficulty:** Intermediate → Advanced
**Career Relevance:** Essential for deep learning roles

### 4.2 Convolutional Neural Networks

```
CNNs
├── Architecture
│   ├── Convolution Layers
│   ├── Pooling Layers
│   ├── Fully Connected Layers
│   └── Skip Connections
├── Architectures
│   ├── LeNet
│   ├── AlexNet
│   ├── VGG
│   ├── ResNet
│   ├── EfficientNet
│   └── Vision Transformers
├── Applications
│   ├── Image Classification
│   ├── Object Detection
│   ├── Image Segmentation
│   └── Style Transfer
└── Techniques
    ├── Transfer Learning
    ├── Data Augmentation
    └── Fine-tuning
```

**Prerequisites:** Neural Networks
**Difficulty:** Intermediate → Advanced
**Career Relevance:** Essential for computer vision roles

### 4.3 Recurrent Neural Networks

```
RNNs
├── Architecture
│   ├── Simple RNN
│   ├── LSTM
│   ├── GRU
│   └── Bidirectional RNN
├── Training
│   ├── BPTT
│   ├── Gradient Clipping
│   └── Teacher Forcing
├── Applications
│   ├── Sequence Classification
│   ├── Sequence Generation
│   ├── Time Series
│   └── Speech Recognition
└── Limitations
    ├── Vanishing Gradients
    ├── Long Dependencies
    └── Parallelization
```

**Prerequisites:** Neural Networks
**Difficulty:** Intermediate → Advanced
**Career Relevance:** Important for sequence modeling roles

### 4.4 Transformers

```
Transformers
├── Architecture
│   ├── Self-Attention
│   ├── Multi-Head Attention
│   ├── Positional Encoding
│   ├── Encoder-Decoder
│   └── Layer Normalization
├── Variants
│   ├── BERT (Encoder)
│   ├── GPT (Decoder)
│   ├── T5 (Encoder-Decoder)
│   ├── Vision Transformers
│   └── Multi-Modal Transformers
├── Training
│   ├── Pre-training
│   ├── Fine-tuning
│   ├── Masked Language Modeling
│   └── Next Token Prediction
└── Applications
    ├── NLP
    ├── Computer Vision
    ├── Speech
    └── Multi-Modal
```

**Prerequisites:** Neural Networks, RNNs
**Difficulty:** Advanced
**Career Relevance:** Essential for modern AI roles

---

## Level 5: LLMs

### 5.1 LLM Architecture

```
LLM Architecture
├── Transformer Variants
│   ├── Decoder-only (GPT)
│   ├── Encoder-only (BERT)
│   └── Encoder-Decoder (T5)
├── Scaling Laws
│   ├── Chinchilla
│   ├── Kaplan
│   └── Compute-Optimal
├── Tokenization
│   ├── BPE
│   ├── WordPiece
│   └── SentencePiece
├── Context Windows
│   ├── Sliding Window
│   ├── Sparse Attention
│   └── Linear Attention
└── Efficiency
    ├── Flash Attention
    ├── KV Cache
    └── Speculative Decoding
```

**Prerequisites:** Transformer Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for LLM roles

### 5.2 Fine-tuning

```
Fine-tuning
├── Full Fine-tuning
│   ├── Full Parameter Updates
│   ├── Learning Rate Scheduling
│   └── Regularization
├── Parameter-Efficient Fine-tuning
│   ├── LoRA
│   ├── QLoRA
│   ├── Adapter
│   └── Prefix Tuning
├── Instruction Tuning
│   ├── Instruction Datasets
│   ├── Chat Templates
│   └── Alignment
└── Domain-Specific
    ├── Code Generation
    ├── Medical
    ├── Legal
    └── Finance
```

**Prerequisites:** LLM Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for LLM roles

### 5.3 Alignment

```
Alignment
├── RLHF
│   ├── Reward Modeling
│   ├── PPO
│   └── Human Feedback
├── DPO
│   ├── Preference Data
│   ├── Direct Optimization
│   └── Comparison
├── Constitutional AI
│   ├── Principles
│   ├── Self-Critique
│   └── Iterative Improvement
└── Safety
    ├── Red Teaming
    ├── Jailbreak Prevention
    └── Content Filtering
```

**Prerequisites:** LLM Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for AI safety roles

### 5.4 LLM Applications

```
LLM Applications
├── Prompt Engineering
│   ├── Zero-shot
│   ├── Few-shot
│   ├── Chain-of-Thought
│   └── Tree-of-Thought
├── RAG
│   ├── Retrieval
│   ├── Generation
│   ├── Chunking
│   └── Embeddings
├── Function Calling
│   ├── Tool Definition
│   ├── Parameter Extraction
│   └── Result Processing
├── Multi-Modal
│   ├── Vision-Language
│   ├── Audio-Language
│   └── Video-Language
└── Agents
    ├── ReAct
    ├── Plan-and-Execute
    └── Multi-Agent
```

**Prerequisites:** LLM Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for AI engineer roles

---

## Level 6: AI Agents

### 6.1 Agent Architecture

```
Agent Architecture
├── Patterns
│   ├── ReAct
│   ├── Plan-and-Execute
│   ├── Reflexion
│   └── LATS
├── Components
│   ├── Planning Module
│   ├── Memory Module
│   ├── Tool Use Module
│   └── Reflection Module
├── Frameworks
│   ├── LangChain
│   ├── LlamaIndex
│   ├── AutoGen
│   └── Custom
└── Evaluation
    ├── Task Completion
    ├── Efficiency
    ├── Safety
    └── Robustness
```

**Prerequisites:** LLM Applications
**Difficulty:** Advanced
**Career Relevance:** Essential for AI agent roles

### 6.2 Tool Use

```
Tool Use
├── Function Calling
│   ├── Function Definition
│   ├── Parameter Extraction
│   └── Result Processing
├── MCP Servers
│   ├── Protocol
│   ├── Implementation
│   └── Testing
├── APIs
│   ├── REST APIs
│   ├── GraphQL
│   └── gRPC
└── Code Execution
    ├── Sandboxing
    ├── Security
    └── Monitoring
```

**Prerequisites:** Agent Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for AI agent roles

### 6.3 Memory Systems

```
Memory Systems
├── Short-term Memory
│   ├── Context Window
│   ├── Conversation History
│   └── Scratchpad
├── Long-term Memory
│   ├── Vector Databases
│   ├── Knowledge Graphs
│   └── File Systems
├── Episodic Memory
│   ├── Experience Logging
│   ├── Pattern Recognition
│   └── Learning from Experience
└── Semantic Memory
    ├── Facts
    ├── Concepts
    └── Relationships
```

**Prerequisites:** Agent Architecture
**Difficulty:** Advanced
**Career Relevance:** Essential for AI agent roles

### 6.4 Multi-Agent Systems

```
Multi-Agent Systems
├── Communication
│   ├── Message Passing
│   ├── Shared Memory
│   └── Blackboard
├── Coordination
│   ├── Task Allocation
│   ├── Consensus
│   └── Conflict Resolution
├── Workflows
│   ├── Sequential
│   ├── Parallel
│   ├── Conditional
│   └── Hierarchical
└── Evaluation
    ├── System-level Metrics
    ├── Individual Agent Metrics
    └── Robustness
```

**Prerequisites:** Agent Architecture
**Difficulty:** Expert
**Career Relevance:** Important for advanced agent roles

---

## Level 7: Production

### 7.1 MLOps

```
MLOps
├── Data Pipelines
│   ├── ETL/ELT
│   ├── Data Validation
│   └── Feature Engineering
├── Model Training
│   ├── Training Pipelines
│   ├── Experiment Tracking
│   └── Model Registry
├── Model Deployment
│   ├── Serving
│   ├── A/B Testing
│   └── Canary Deployments
├── Monitoring
│   ├── Model Performance
│   ├── Data Drift
│   └── Alerting
└── Automation
    ├── CI/CD
    ├── AutoML
    └── Self-healing
```

**Prerequisites:** ML Fundamentals
**Difficulty:** Intermediate → Advanced
**Career Relevance:** Essential for ML engineering roles

### 7.2 Infrastructure

```
Infrastructure
├── Containers
│   ├── Docker
│   ├── Container Orchestration
│   └── Security
├── Cloud
│   ├── AWS
│   ├── GCP
│   ├── Azure
│   └── Multi-cloud
├── GPU Management
│   ├── GPU Scheduling
│   ├── Memory Management
│   └── Optimization
└── Monitoring
    ├── Prometheus
    ├── Grafana
    └── Logging
```

**Prerequisites:** Linux, Networking
**Difficulty:** Advanced
**Career Relevance:** Essential for AI infrastructure roles

### 7.3 Security

```
Security
├── Authentication
│   ├── OAuth
│   ├── JWT
│   └── API Keys
├── Authorization
│   ├── RBAC
│   ├── ABAC
│   └── Policy Enforcement
├── Data Privacy
│   ├── Encryption
│   ├── Anonymization
│   └── Differential Privacy
├── Adversarial Attacks
│   ├── Prompt Injection
│   ├── Jailbreaking
│   └── Data Poisoning
└── Defense
    ├── Input Validation
    ├── Output Filtering
    └── Monitoring
```

**Prerequisites:** Programming
**Difficulty:** Advanced
**Career Relevance:** Essential for all AI roles

---

## Level 8: Research

### 8.1 Research Methods

```
Research Methods
├── Problem Formulation
│   ├── Research Questions
│   ├── Hypotheses
│   └── Scope
├── Literature Review
│   ├── Search Strategies
│   ├── Critical Analysis
│   └── Synthesis
├── Experiment Design
│   ├── Variables
│   ├── Controls
│   ├── Metrics
│   └── Statistical Power
├── Implementation
│   ├── Code Organization
│   ├── Reproducibility
│   └── Documentation
└── Communication
    ├── Paper Writing
    ├── Presentations
    └── Peer Review
```

**Prerequisites:** Advanced AI courses
**Difficulty:** Advanced
**Career Relevance:** Essential for research roles

### 8.2 Reproducibility

```
Reproducibility
├── Code
│   ├── Version Control
│   ├── Dependencies
│   └── Environment
├── Data
│   ├── Versioning
│   ├── Documentation
│   └── Access
├── Experiments
│   ├── Random Seeds
│   ├── Hyperparameters
│   └── Logs
└── Documentation
    ├── README
    ├── Methods
    └── Results
```

**Prerequisites:** Research Methods
**Difficulty:** Advanced
**Career Relevance:** Essential for research roles

---

## Level 9: Open Source

### 9.1 Open Source Contribution

```
Open Source Contribution
├── Git/GitHub
│   ├── Forking
│   ├── Branching
│   ├── Pull Requests
│   └── Code Review
├── Communication
│   ├── Issues
│   ├── Discussions
│   └── Documentation
├── Quality
│   ├── Tests
│   ├── CI/CD
│   └── Linting
└── Community
    ├── Contributing Guidelines
    ├── Code of Conduct
    └── License
```

**Prerequisites:** Python
**Difficulty:** Intermediate
**Career Relevance:** Important for all AI roles

### 9.2 Open Source Maintenance

```
Open Source Maintenance
├── Project Setup
│   ├── Repository Structure
│   ├── README
│   ├── License
│   └── Contributing Guidelines
├── Community Management
│   ├── Issue Triage
│   ├── Pull Request Review
│   └── Release Management
├── CI/CD
│   ├── Automated Testing
│   ├── Automated Deployment
│   └── Monitoring
└── Governance
    ├── Decision Making
    ├── Conflict Resolution
    └── Roadmap
```

**Prerequisites:** Open Source Contribution
**Difficulty:** Advanced
**Career Relevance:** Important for senior roles

---

## Career Path Mapping

### AI Engineer

```
Required Concepts:
├── Python (Expert)
├── ML Fundamentals (Expert)
├── LLMs (Advanced)
├── Prompt Engineering (Advanced)
├── RAG (Advanced)
├── API Development (Advanced)
├── MLOps (Intermediate)
└── Security (Intermediate)

Recommended Path:
1. AI Foundations Certificate
2. ML Fundamentals
3. LLM Fundamentals
4. LLM Applications
5. MLOps Fundamentals
6. Projects: Chatbot, RAG System, MCP Server
```

### LLM Engineer

```
Required Concepts:
├── Python (Expert)
├── Deep Learning (Expert)
├── Transformers (Expert)
├── LLM Architecture (Expert)
├── Fine-tuning (Expert)
├── RLHF/DPO (Advanced)
├── Inference Optimization (Advanced)
└── Research (Advanced)

Recommended Path:
1. AI Foundations Certificate
2. ML Fundamentals
3. Deep Learning Fundamentals
4. Transformer Architecture
5. LLM Fundamentals
6. Fine-tuning LLMs
7. RLHF and Alignment
8. Projects: Fine-tuned Model, Custom Tokenizer
```

### ML Engineer

```
Required Concepts:
├── Python (Expert)
├── ML Fundamentals (Expert)
├── Data Engineering (Advanced)
├── Model Training (Expert)
├── Model Deployment (Advanced)
├── MLOps (Expert)
├── Cloud Platforms (Advanced)
└── Monitoring (Advanced)

Recommended Path:
1. AI Foundations Certificate
2. ML Fundamentals
3. Unsupervised Learning
4. Advanced ML Techniques
5. ML System Design
6. MLOps Fundamentals
7. Cloud AI Services
8. Projects: ML Pipeline, Real-time System
```

### Research Engineer

```
Required Concepts:
├── Python (Expert)
├── PyTorch (Expert)
├── Research Papers (Expert)
├── Implementation (Expert)
├── Experiment Design (Advanced)
├── Reproducibility (Expert)
├── Distributed Training (Advanced)
└── CUDA (Intermediate)

Recommended Path:
1. AI Foundations Certificate
2. ML Fundamentals
3. Deep Learning Fundamentals
4. Transformer Architecture
5. Research Methods
6. Reproducible Research
7. Research Project
8. Projects: Paper Implementations, Research Tools
```

### AI Agent Engineer

```
Required Concepts:
├── Python (Expert)
├── LLMs (Expert)
├── Agent Architecture (Expert)
├── Tool Use (Expert)
├── Memory Systems (Advanced)
├── Planning (Advanced)
├── Multi-Agent (Advanced)
├── MCP Servers (Expert)
└── Safety (Advanced)

Recommended Path:
1. AI Foundations Certificate
2. ML Fundamentals
3. Deep Learning Fundamentals
4. LLM Fundamentals
5. LLM Applications
6. Agent Architecture
7. Memory and Planning
8. Multi-Agent Systems
9. MCP Servers
10. Projects: Coding Agent, Multi-Agent Workflow, MCP Server
```

---

## Graph Visualization

```
                    Mathematics
                        │
                        ▼
                    Programming
                        │
                        ▼
                ┌───────┴───────┐
                │               │
                ▼               ▼
        ML Fundamentals    Data Engineering
                │               │
                ▼               │
        Deep Learning           │
                │               │
        ┌───────┴───────┐       │
        │               │       │
        ▼               ▼       │
    LLMs          Computer      │
        │         Vision         │
        │               │       │
        ▼               │       │
    AI Agents           │       │
        │               │       │
        │       ┌───────┴───────┘
        │       │
        ▼       ▼
    Production
        │
    ┌───┴───┐
    │       │
    ▼       ▼
Research  Open Source
```

---

_Every concept is mapped. Every prerequisite is enforced. Every career path is defined._
