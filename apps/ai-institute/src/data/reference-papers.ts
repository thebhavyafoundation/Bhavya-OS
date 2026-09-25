export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  tags: string[];
  url: string;
  source: "external";
}

export const referencePapers: Paper[] = [
  {
    id: "attention",
    title: "Attention Is All You Need",
    authors: ["Vaswani", "Shazeer", "Parmar", "et al."],
    year: 2017,
    abstract:
      "Introduced the Transformer architecture, which has become the foundation for modern large language models.",
    tags: ["Transformers", "Architecture"],
    url: "https://arxiv.org/abs/1706.03762",
    source: "external",
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin", "Chang", "Lee", "Toutanova"],
    year: 2018,
    abstract:
      "Bidirectional encoder representation model that revolutionized NLU tasks.",
    tags: ["NLU", "Pre-training"],
    url: "https://arxiv.org/abs/1810.04805",
    source: "external",
  },
  {
    id: "gpt3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Brown", "Mann", "Ryder", "et al."],
    year: 2020,
    abstract:
      "Demonstrated GPT-3's ability to perform tasks with minimal examples.",
    tags: ["LLM", "Few-shot"],
    url: "https://arxiv.org/abs/2005.14165",
    source: "external",
  },
  {
    id: "dalle",
    title: "Zero-Shot Text-to-Image Generation",
    authors: ["Ramesh", "Pavlov", "Goh", "et al."],
    year: 2021,
    abstract:
      "Introduced DALL-E for text-to-image generation using a diffusion model.",
    tags: ["Multimodal", "Image Generation"],
    url: "https://arxiv.org/abs/2102.12092",
    source: "external",
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    authors: ["Kaplan", "McCandlish", "Henighan", "et al."],
    year: 2020,
    abstract:
      "Explored how model performance scales with compute, data, and parameters.",
    tags: ["Scaling", "LLM"],
    url: "https://arxiv.org/abs/2001.08361",
    source: "external",
  },
  {
    id: "rlhf",
    title:
      "Training Language Models to Follow Instructions with Human Feedback",
    authors: ["Ouyang", "Wu", "Jiang", "et al."],
    year: 2022,
    abstract:
      "Introduced InstructGPT and RLHF for aligning language models with human intent.",
    tags: ["Alignment", "RLHF"],
    url: "https://arxiv.org/abs/2203.02155",
    source: "external",
  },
  {
    id: "diffusion",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Ho", "Jain", "Abbeel"],
    year: 2020,
    abstract:
      "Foundational paper on diffusion models for high-quality image generation.",
    tags: ["Diffusion", "Image Generation"],
    url: "https://arxiv.org/abs/2006.11239",
    source: "external",
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Lewis", "Perez", "Piktus", "et al."],
    year: 2020,
    abstract:
      "Combined retrieval and generation for more accurate, fact-based outputs.",
    tags: ["RAG", "Knowledge"],
    url: "https://arxiv.org/abs/2005.11401",
    source: "external",
  },
  {
    id: "chain-of-thought",
    title:
      "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: ["Wei", "Wang", "Schuurmans", "et al."],
    year: 2022,
    abstract:
      "Showed how step-by-step reasoning improves LLM performance on complex tasks.",
    tags: ["Reasoning", "Prompting"],
    url: "https://arxiv.org/abs/2201.11903",
    source: "external",
  },
  {
    id: "mixture-of-experts",
    title: "Scaling Sparse Mixture of Experts",
    authors: ["Fedus", "Zoph", "Shazeer"],
    year: 2022,
    abstract:
      "Demonstrated how sparse MoE architectures enable efficient scaling of LLMs.",
    tags: ["MoE", "Scaling"],
    url: "https://arxiv.org/abs/2101.03961",
    source: "external",
  },
];
