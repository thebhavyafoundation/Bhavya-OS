# Research Constitution

**Document:** 13 | **Version:** 1.0 | **Effective:** 2026-08-07 | **Status:** Constitutional

---

## Preamble

This document establishes the research standards of the Bhavya AI Institute. Every topic must link to foundational papers, state-of-the-art research, benchmarks, datasets, implementations, and reproducibility resources.

Research is not optional. It is the foundation of all knowledge.

---

## Article 1: Research Philosophy

### 1.1 Core Principle

**"Every claim must be backed by evidence. Every implementation must be reproducible."**

### 1.2 Research Standards

1. **Evidence-based** — Claims backed by papers
2. **Reproducible** — Results can be replicated
3. **Transparent** — Methods and data shared
4. **Rigorous** — Evaluation is thorough
5. **Ethical** — Research follows ethical guidelines

---

## Article 2: Research Requirements

### 2.1 Every Topic Must Link To

| Resource                  | Purpose              | Requirement      |
| ------------------------- | -------------------- | ---------------- |
| Foundational Papers       | Historical context   | Minimum 2        |
| State-of-the-Art          | Current advances     | Minimum 3        |
| Benchmarks                | Evaluation standards | Where applicable |
| Datasets                  | Training/evaluation  | Where applicable |
| GitHub Implementations    | Practical reference  | Where available  |
| Reproducibility Resources | Validation           | Where possible   |
| Historical Context        | Evolution            | Brief overview   |
| Current Limitations       | Honest assessment    | Required         |
| Open Research Questions   | Future directions    | Required         |

### 2.2 Research Quality Criteria

| Criterion       | Description           | Weight |
| --------------- | --------------------- | ------ |
| Novelty         | Original contribution | 25%    |
| Rigor           | Methodology quality   | 25%    |
| Impact          | Potential influence   | 20%    |
| Reproducibility | Can be replicated     | 15%    |
| Clarity         | Communication quality | 15%    |

---

## Article 3: Foundational Papers

### 3.1 Mathematics

| Topic              | Papers                                             | Year | Impact       |
| ------------------ | -------------------------------------------------- | ---- | ------------ |
| Linear Algebra     | Strang, "Linear Algebra and Its Applications"      | 1988 | Foundational |
| Calculus           | Stewart, "Calculus: Early Transcendentals"         | 1987 | Foundational |
| Probability        | Jaynes, "Probability Theory: The Logic of Science" | 2003 | Foundational |
| Information Theory | Shannon, "A Mathematical Theory of Communication"  | 1948 | Foundational |
| Optimization       | Boyd, "Convex Optimization"                        | 2004 | Foundational |

### 3.2 Machine Learning

| Topic               | Papers                                              | Year | Impact       |
| ------------------- | --------------------------------------------------- | ---- | ------------ |
| Linear Regression   | Legendre, "Nouvelles méthodes"                      | 1805 | Foundational |
| Logistic Regression | Cox, "The Regression Analysis of Binary Sequences"  | 1958 | Foundational |
| Decision Trees      | Quinlan, "Induction of Decision Trees"              | 1986 | Foundational |
| Random Forests      | Breiman, "Random Forests"                           | 2001 | Foundational |
| SVMs                | Vapnik, "The Nature of Statistical Learning Theory" | 1995 | Foundational |
| Gradient Boosting   | Friedman, "Greedy Function Approximation"           | 2001 | Foundational |
| XGBoost             | Chen, "XGBoost: A Scalable Tree Boosting System"    | 2016 | High         |

### 3.3 Deep Learning

| Topic               | Papers                                                           | Year | Impact       |
| ------------------- | ---------------------------------------------------------------- | ---- | ------------ |
| Neural Networks     | Rumelhart, "Learning representations by back-propagating errors" | 1986 | Foundational |
| CNNs                | LeCun, "Gradient-based learning applied to document recognition" | 1998 | Foundational |
| AlexNet             | Krizhevsky, "ImageNet Classification with Deep CNNs"             | 2012 | Breakthrough |
| ResNet              | He, "Deep Residual Learning"                                     | 2015 | Breakthrough |
| Batch Normalization | Ioffe, "Batch Normalization"                                     | 2015 | High         |
| Dropout             | Srivastava, "Dropout: A Simple Way to Prevent Overfitting"       | 2014 | High         |
| Adam                | Kingma, "Adam: A Method for Stochastic Optimization"             | 2014 | High         |

### 3.4 Sequence Models

| Topic   | Papers                                                           | Year | Impact       |
| ------- | ---------------------------------------------------------------- | ---- | ------------ |
| RNNs    | Elman, "Finding Structure in Time"                               | 1990 | Foundational |
| LSTM    | Hochreiter, "Long Short-Term Memory"                             | 1997 | Foundational |
| GRU     | Cho, "Learning Phrase Representations using RNN Encoder-Decoder" | 2014 | High         |
| Seq2Seq | Sutskever, "Sequence to Sequence Learning with Neural Networks"  | 2014 | High         |

### 3.5 Transformers

| Topic              | Papers                                                                            | Year | Impact       |
| ------------------ | --------------------------------------------------------------------------------- | ---- | ------------ |
| Attention          | Bahdanau, "Neural Machine Translation by Jointly Learning to Align and Translate" | 2014 | Foundational |
| Transformer        | Vaswani, "Attention Is All You Need"                                              | 2017 | Breakthrough |
| BERT               | Devlin, "BERT: Pre-training of Deep Bidirectional Transformers"                   | 2018 | Breakthrough |
| GPT-2              | Radford, "Language Models are Unsupervised Multitask Learners"                    | 2019 | High         |
| GPT-3              | Brown, "Language Models are Few-Shot Learners"                                    | 2020 | Breakthrough |
| Vision Transformer | Dosovitskiy, "An Image is Worth 16x16 Words"                                      | 2020 | High         |

### 3.6 LLMs

| Topic             | Papers                                                                        | Year | Impact       |
| ----------------- | ----------------------------------------------------------------------------- | ---- | ------------ |
| Scaling Laws      | Kaplan, "Scaling Laws for Neural Language Models"                             | 2020 | High         |
| Chinchilla        | Hoffmann, "Training Compute-Optimal Large Language Models"                    | 2022 | High         |
| RLHF              | Ouyang, "Training language models to follow instructions with human feedback" | 2022 | Breakthrough |
| DPO               | Rafailov, "Direct Preference Optimization"                                    | 2023 | High         |
| Constitutional AI | Bai, "Constitutional AI: Harmlessness from AI Feedback"                       | 2022 | High         |
| Flash Attention   | Dao, "FlashAttention: Fast and Memory-Efficient Exact Attention"              | 2022 | High         |

### 3.7 AI Agents

| Topic             | Papers                                                                  | Year | Impact |
| ----------------- | ----------------------------------------------------------------------- | ---- | ------ |
| ReAct             | Yao, "ReAct: Synergizing Reasoning and Acting in Language Models"       | 2022 | High   |
| Toolformer        | Schick, "Toolformer: Language Models Can Teach Themselves to Use Tools" | 2023 | High   |
| Reflexion         | Shinn, "Reflexion: Language Agents with Verbal Reinforcement Learning"  | 2023 | High   |
| Generative Agents | Park, "Generative Agents: Interactive Simulacra of Human Behavior"      | 2023 | High   |

---

## Article 4: State-of-the-Art

### 4.1 Current Frontiers (2026)

| Domain          | SOTA                         | Key Advance                   |
| --------------- | ---------------------------- | ----------------------------- |
| LLMs            | GPT-4, Claude 3, Gemini      | Multi-modal, reasoning        |
| Computer Vision | DINOv2, SAM                  | Self-supervised, segmentation |
| NLP             | Llama 3, Mistral             | Open-source, efficient        |
| RL              | PPO improvements             | Stability, sample efficiency  |
| Generative      | Stable Diffusion 3, DALL-E 3 | Quality, control              |
| Agents          | AutoGPT, CrewAI              | Autonomously, multi-agent     |
| Multimodal      | GPT-4V, Gemini Pro           | Vision-language integration   |

### 4.2 Benchmarks

| Benchmark  | Task                  | Current SOTA   |
| ---------- | --------------------- | -------------- |
| MMLU       | Knowledge             | GPT-4 (86.4%)  |
| HumanEval  | Code                  | GPT-4 (67.0%)  |
| GSM8K      | Math                  | GPT-4 (92.0%)  |
| TruthfulQA | Truthfulness          | GPT-4 (59.0%)  |
| ImageNet   | Image Classification  | DINOv2 (88.0%) |
| COCO       | Object Detection      | SAM (62.0 AP)  |
| SQuAD      | Reading Comprehension | Human parity   |

### 4.3 Datasets

| Dataset      | Task                  | Size             |
| ------------ | --------------------- | ---------------- |
| ImageNet     | Image Classification  | 14M images       |
| COCO         | Object Detection      | 330K images      |
| SQuAD        | Reading Comprehension | 150K examples    |
| Common Crawl | Pre-training          | 600B tokens      |
| The Pile     | Pre-training          | 800GB            |
| Red Pajama   | Pre-training          | 1.2T tokens      |
| LMSYS-Chat   | Instruction Tuning    | 1M conversations |

---

## Article 5: GitHub Implementations

### 5.1 Essential Repositories

| Repository               | Purpose                 | Stars |
| ------------------------ | ----------------------- | ----- |
| pytorch/pytorch          | Deep learning framework | 80k+  |
| huggingface/transformers | Transformer models      | 130k+ |
| langchain-ai/langchain   | LLM applications        | 80k+  |
| vllm-project/vllm        | LLM serving             | 20k+  |
| compvis/stable-diffusion | Image generation        | 60k+  |
| microsoft/DeepSpeed      | Distributed training    | 30k+  |
| facebookresearch/llama   | LLM models              | 50k+  |
| mlc-ai/mlc-llm           | LLM deployment          | 20k+  |

### 5.2 Implementation Quality Criteria

| Criterion       | Description                          |
| --------------- | ------------------------------------ |
| Code Quality    | Clean, documented, tested            |
| Reproducibility | Results can be replicated            |
| Documentation   | Clear README, examples               |
| Community       | Active maintenance, issues addressed |
| License         | Open source, permissive              |

---

## Article 6: Reproducibility

### 6.1 Reproducibility Requirements

1. **Code** — All code available
2. **Data** — All data available or reproducible
3. **Environment** — Dependencies specified
4. **Seeds** — Random seeds fixed
5. **Hyperparameters** — All parameters documented
6. **Results** — Results can be regenerated

### 6.2 Reproducibility Checklist

- [ ] Code available on GitHub
- [ ] README with instructions
- [ ] Requirements.txt or environment.yml
- [ ] Random seeds fixed
- [ ] Hyperparameters documented
- [ ] Results table included
- [ ] Instructions to reproduce results
- [ ] License specified

---

## Article 7: Research Ethics

### 7.1 Ethical Principles

1. **Honesty** — No fabrication or falsification
2. **Transparency** — Methods and data shared
3. **Fairness** — No plagiarism
4. **Respect** — Human subjects protected
5. **Responsibility** — Consider societal impact

### 7.2 Prohibited Practices

1. **Fabrication** — Making up data or results
2. **Falsification** — Manipulating data or results
3. **Plagiarism** — Using others' work without credit
4. **Ghostwriting** — Having others write without credit
5. **P-hacking** — Manipulating analysis to get desired results

### 7.3 Ethical Review

All research involving:

- Human subjects → IRB review
- Sensitive data → Privacy review
- Potentially harmful → Safety review

---

## Article 8: Research Communication

### 8.1 Publication Venues

| Venue Type        | Examples            | When to Use                   |
| ----------------- | ------------------- | ----------------------------- |
| Top Conference    | NeurIPS, ICML, ICLR | Novel, high-impact            |
| Workshop          | NeurIPS workshops   | Preliminary work              |
| ArXiv             | arxiv.org           | Pre-print, fast dissemination |
| Journal           | JMLR, TPAMI         | Comprehensive work            |
| Blog              | Personal blog       | Tutorial, explanation         |
| Bhavya AI Journal | Internal            | Student work                  |

### 8.2 Paper Structure

1. **Abstract** — 150-250 words
2. **Introduction** — Problem, motivation, contributions
3. **Related Work** — Prior research
4. **Method** — Technical approach
5. **Experiments** — Evaluation
6. **Results** — Findings
7. **Discussion** — Implications
8. **Conclusion** — Summary, future work
9. **References** — Citations

### 8.3 Presentation

1. **Talks** — 15-20 minutes + Q&A
2. **Posters** — Visual summary
3. **Demos** — Live demonstration
4. **Videos** — Recorded explanation

---

## Article 9: Research Governance

### 9.1 Research Committee

The Research Committee oversees:

1. **Research Standards** — Quality criteria
2. **Ethical Compliance** — Ethical review
3. **Publication** — Venue selection
4. **Reproducibility** — Validation
5. **Impact** — Assessment

### 9.2 Research Review

All research undergoes:

1. **Internal Review** — Faculty review
2. **Peer Review** — External review (for publications)
3. **Ethical Review** — When required
4. **Reproducibility Review** — Validation

### 9.3 Research Recognition

Outstanding research is recognized through:

1. **Bhavya AI Prize** — Annual award
2. **Publication Support** — Conference travel
3. **Mentorship** — Faculty mentorship
4. **Portfolio** — Showcase

---

## Article 10: Amendment Process

### 10.1 Proposal

Amendments may be proposed by:

1. Faculty
2. Students
3. Research Committee
4. Industry partners

### 10.2 Review

Amendments undergo:

1. **Academic review** — Faculty committee
2. **Ethical review** — Ethics board
3. **Student review** — Student government

### 10.3 Approval

Amendments require:

1. **Two-thirds faculty vote**
2. **Research Committee approval**

---

## Article 11: Constitutional Authority

This constitution is the supreme research authority of the Bhavya AI Institute.

All research must adhere to this constitution.

No research is complete until it meets these standards.

---

_Research is the foundation of all knowledge. Every claim must be backed by evidence._
