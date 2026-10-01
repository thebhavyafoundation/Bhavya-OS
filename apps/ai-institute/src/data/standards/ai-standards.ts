import type { AIStandard } from "@/types/curriculum";

export const aiStandards: readonly AIStandard[] = [
  {
    id: "usa-ca-perception-k2",
    source: "USA.CA.AI",
    gradeBand: "K-2",
    concept: "Perception",
    description:
      "With guidance, learners notice that cameras, microphones, and other sensors let machines pick up sights and sounds, and that machines sort those inputs into simple meanings.",
  },
  {
    id: "usa-ca-perception-35",
    source: "USA.CA.AI",
    gradeBand: "3-5",
    concept: "Perception",
    description:
      "Learners explain that perception is the extraction of meaning from sensor data, using everyday examples such as photo tagging or voice commands.",
    prerequisites: ["usa-ca-perception-k2"],
  },
  {
    id: "usa-ca-perception-68",
    source: "USA.CA.AI",
    gradeBand: "6-8",
    concept: "Perception",
    description:
      "Learners describe how perception systems convert sensor signals into features, and compare human sensing with machine sensing.",
    prerequisites: ["usa-ca-perception-35"],
  },
  {
    id: "usa-ca-perception-912",
    source: "USA.CA.AI",
    gradeBand: "9-12",
    concept: "Perception",
    description:
      "Learners analyze how perception systems combine multiple senses and evaluate where they fail, such as in poor lighting or noisy audio.",
    prerequisites: ["usa-ca-perception-68"],
  },
  {
    id: "usa-ca-representation-k2",
    source: "USA.CA.AI",
    gradeBand: "K-2",
    concept: "Representation & Reasoning",
    description:
      "Learners use simple drawings and symbols to show how a machine might keep track of information and follow steps to solve a small puzzle.",
  },
  {
    id: "usa-ca-representation-35",
    source: "USA.CA.AI",
    gradeBand: "3-5",
    concept: "Representation & Reasoning",
    description:
      "Learners represent a problem with lists, tables, or diagrams and follow a clear rule-based procedure to reach a result.",
    prerequisites: ["usa-ca-representation-k2"],
  },
  {
    id: "usa-ca-representation-68",
    source: "USA.CA.AI",
    gradeBand: "6-8",
    concept: "Representation & Reasoning",
    description:
      "Learners explain that programs represent the world with data structures, and that reasoning algorithms derive new information from those representations.",
    prerequisites: ["usa-ca-representation-35"],
  },
  {
    id: "usa-ca-representation-912",
    source: "USA.CA.AI",
    gradeBand: "9-12",
    concept: "Representation & Reasoning",
    description:
      "Learners compare representations such as graphs, trees, and knowledge bases, and evaluate how the choice of representation limits the reasoning a system can do.",
    prerequisites: ["usa-ca-representation-68"],
  },
  {
    id: "usa-ca-learning-k2",
    source: "USA.CA.AI",
    gradeBand: "K-2",
    concept: "Learning",
    description:
      "Learners distinguish practice that people do from practice that machines do, and describe how a machine improves by looking at examples.",
  },
  {
    id: "usa-ca-learning-35",
    source: "USA.CA.AI",
    gradeBand: "3-5",
    concept: "Learning",
    description:
      "Learners describe machine learning as finding patterns in data and give an example of learning from labeled examples.",
    prerequisites: ["usa-ca-learning-k2"],
  },
  {
    id: "usa-ca-learning-68",
    source: "USA.CA.AI",
    gradeBand: "6-8",
    concept: "Learning",
    description:
      "Learners explain training data and features, distinguish memorizing from generalizing, and identify when a model needs more or better data.",
    prerequisites: ["usa-ca-learning-35"],
  },
  {
    id: "usa-ca-learning-912",
    source: "USA.CA.AI",
    gradeBand: "9-12",
    concept: "Learning",
    description:
      "Learners evaluate trained models with holdout data, diagnose errors such as bias or overfitting, and explain how data quality shapes results.",
    prerequisites: ["usa-ca-learning-68"],
  },
  {
    id: "usa-ca-interaction-k2",
    source: "USA.CA.AI",
    gradeBand: "K-2",
    concept: "Natural Interaction",
    description:
      "Learners follow and give simple instructions to an interactive system and notice that machines understand only certain kinds of requests.",
  },
  {
    id: "usa-ca-interaction-35",
    source: "USA.CA.AI",
    gradeBand: "3-5",
    concept: "Natural Interaction",
    description:
      "Learners interact with voice or chat assistants, formulate clear questions, and recognize that misunderstandings happen.",
    prerequisites: ["usa-ca-interaction-k2"],
  },
  {
    id: "usa-ca-interaction-68",
    source: "USA.CA.AI",
    gradeBand: "6-8",
    concept: "Natural Interaction",
    description:
      "Learners explain how language, gesture, and context help systems understand people, and describe limits such as ambiguity and missing common sense.",
    prerequisites: ["usa-ca-interaction-35"],
  },
  {
    id: "usa-ca-interaction-912",
    source: "USA.CA.AI",
    gradeBand: "9-12",
    concept: "Natural Interaction",
    description:
      "Learners evaluate dialogue and multimodal systems for reliability and inclusiveness, and for their ability to surface bias, misinformation, and inaccuracies in outputs.",
    prerequisites: ["usa-ca-interaction-68"],
  },
  {
    id: "usa-ca-society-k2",
    source: "USA.CA.AI",
    gradeBand: "K-2",
    concept: "Societal Impact",
    description:
      "Learners identify helpful and unhelpful ways machines are used at home and school, and practice asking an adult when something feels unfair.",
  },
  {
    id: "usa-ca-society-35",
    source: "USA.CA.AI",
    gradeBand: "3-5",
    concept: "Societal Impact",
    description:
      "Learners discuss how AI can help and harm people and give examples of fair and unfair treatment by automated systems.",
    prerequisites: ["usa-ca-society-k2"],
  },
  {
    id: "usa-ca-society-68",
    source: "USA.CA.AI",
    gradeBand: "6-8",
    concept: "Societal Impact",
    description:
      "Learners examine how bias in data can lead to unequal outcomes and propose criteria for fair and responsible use of AI.",
    prerequisites: ["usa-ca-society-35"],
  },
  {
    id: "usa-ca-society-912",
    source: "USA.CA.AI",
    gradeBand: "9-12",
    concept: "Societal Impact",
    description:
      "Learners analyze economic, cultural, and ethical impacts of AI systems and evaluate design and deployment choices against ethical criteria.",
    prerequisites: ["usa-ca-society-68"],
  },
  {
    id: "china-moe-intro-68-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Introductory Knowledge",
    description:
      "Compulsory Education (2022): learners understand the core ideas of artificial intelligence — what makes a system intelligent, its main development stages, and typical application domains.",
  },
  {
    id: "china-moe-intro-68-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Introductory Knowledge",
    description:
      "Compulsory Education (2022): learners identify AI systems in real-life scenarios and classify them by how they perceive, learn, and interact.",
    prerequisites: ["china-moe-intro-68-understand"],
  },
  {
    id: "china-moe-techniques-68-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Fundamental Techniques",
    description:
      "Compulsory Education (2022): learners understand the data, algorithms, and simple models behind common AI functions such as recognition and recommendation.",
  },
  {
    id: "china-moe-techniques-68-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Fundamental Techniques",
    description:
      "Compulsory Education (2022): learners work with data and simple rule-based or model-assisted processes to complete a small intelligent-application task.",
    prerequisites: ["china-moe-techniques-68-understand"],
  },
  {
    id: "china-moe-applications-68-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Applications",
    description:
      "Compulsory Education (2022): learners understand how AI is applied in smart living, study, and social services, including smart devices and smart communities.",
  },
  {
    id: "china-moe-applications-68-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Applications",
    description:
      "Compulsory Education (2022): learners use existing AI tools to solve a practical problem in their own learning or community context.",
    prerequisites: ["china-moe-applications-68-understand"],
  },
  {
    id: "china-moe-responsibility-68-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Responsible Use",
    description:
      "Compulsory Education (2022): learners understand the social responsibilities attached to information technology, including privacy, safety, and appropriate use of AI.",
  },
  {
    id: "china-moe-responsibility-68-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "6-8",
    concept: "Responsible Use",
    description:
      "Compulsory Education (2022): learners follow information ethics rules when using AI tools and discuss the impact of AI on individuals and society.",
    prerequisites: ["china-moe-responsibility-68-understand"],
  },
  {
    id: "china-moe-intro-912-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Introductory Knowledge",
    description:
      "High School IT (2017/2020): learners understand the definition, history, and system composition of artificial intelligence, including intelligent agents and knowledge representation.",
    prerequisites: ["china-moe-intro-68-understand"],
  },
  {
    id: "china-moe-intro-912-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Introductory Knowledge",
    description:
      "High School IT (2017/2020): learners analyze an AI application by identifying its sensing, learning, and decision components.",
    prerequisites: ["china-moe-intro-912-understand"],
  },
  {
    id: "china-moe-techniques-912-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Fundamental Techniques",
    description:
      "High School IT (2017/2020): learners understand fundamental techniques such as machine learning paradigms, knowledge representation and reasoning, and intelligent perception.",
    prerequisites: ["china-moe-techniques-68-understand"],
  },
  {
    id: "china-moe-techniques-912-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Fundamental Techniques",
    description:
      "High School IT (2017/2020): learners apply basic modeling and data-driven methods to build or evaluate a small AI solution.",
    prerequisites: ["china-moe-techniques-912-understand"],
  },
  {
    id: "china-moe-applications-912-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Applications",
    description:
      "High School IT (2017/2020): learners understand AI application systems in areas such as smart life, intelligent transportation, and healthcare, together with their engineering constraints.",
    prerequisites: ["china-moe-applications-68-understand"],
  },
  {
    id: "china-moe-applications-912-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Applications",
    description:
      "High School IT (2017/2020): learners design and implement a simple intelligent application system that solves a problem they have scoped.",
    prerequisites: ["china-moe-applications-912-understand"],
  },
  {
    id: "china-moe-responsibility-912-understand",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Responsible Use",
    description:
      "High School IT (2017/2020): learners understand the ethical, legal, and social issues of AI deployment, including data privacy, algorithmic fairness, and accountability.",
    prerequisites: ["china-moe-responsibility-68-understand"],
  },
  {
    id: "china-moe-responsibility-912-apply",
    source: "China.MOE.IT.AI",
    gradeBand: "9-12",
    concept: "Responsible Use",
    description:
      "High School IT (2017/2020): learners evaluate an AI system against fairness, safety, and accountability criteria and propose improvements.",
    prerequisites: ["china-moe-responsibility-912-understand"],
  },
  {
    id: "unesco-mindset-understand",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "A human-centred mindset",
    description:
      "Learners understand what AI is and is not, recognize their own agency in relation to AI systems, and articulate that humans remain responsible for decisions.",
  },
  {
    id: "unesco-mindset-apply",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "A human-centred mindset",
    description:
      "Learners decide when AI can and cannot support their goals and assert human judgement over AI suggestions in authentic tasks.",
    prerequisites: ["unesco-mindset-understand"],
  },
  {
    id: "unesco-mindset-create",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "A human-centred mindset",
    description:
      "Learners design habits and strategies that keep human needs, dignity, and wellbeing at the centre of their use of AI.",
    prerequisites: ["unesco-mindset-apply"],
  },
  {
    id: "unesco-ethics-understand",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "Ethics of AI",
    description:
      "Learners understand the core ethical issues raised by AI, including fairness, privacy, and their rights as users and subjects of AI systems.",
  },
  {
    id: "unesco-ethics-apply",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "Ethics of AI",
    description:
      "Learners apply principles of safe and responsible use when working with AI tools, including consent, credit, and verification of outputs.",
    prerequisites: ["unesco-ethics-understand"],
  },
  {
    id: "unesco-ethics-create",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "Ethics of AI",
    description:
      "Learners build ethics by design into the solutions they create, anticipating harms and adding safeguards before deployment.",
    prerequisites: ["unesco-ethics-apply"],
  },
  {
    id: "unesco-techniques-understand",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI techniques and applications",
    description:
      "Learners understand foundational AI concepts such as data, algorithms, and models, and how intelligent systems perceive, learn, and decide.",
  },
  {
    id: "unesco-techniques-apply",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI techniques and applications",
    description:
      "Learners apply selected AI tools and techniques to authentic tasks, adapting existing models or systems to solve problems.",
    prerequisites: ["unesco-techniques-understand"],
  },
  {
    id: "unesco-techniques-create",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI techniques and applications",
    description:
      "Learners create AI-assisted solutions using customizable datasets and tools, iterating on results with critical judgement.",
    prerequisites: ["unesco-techniques-apply"],
  },
  {
    id: "unesco-design-understand",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI system design",
    description:
      "Learners understand problem scoping, architecture, training, testing, and optimization as the stages of AI system design.",
  },
  {
    id: "unesco-design-apply",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI system design",
    description:
      "Learners design and test an AI solution for a scoped problem, using feedback loops to improve performance.",
    prerequisites: ["unesco-design-understand"],
  },
  {
    id: "unesco-design-create",
    source: "UNESCO.AI",
    gradeBand: "all",
    concept: "AI system design",
    description:
      "Learners create human-centred AI tools for real-world challenges and evaluate their impact on users and communities.",
    prerequisites: ["unesco-design-apply"],
  },
  {
    id: "oecd-engage-basic",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Engage with AI",
    description:
      "Learners recognize where AI appears in daily life and describe basic opportunities and risks of AI use.",
  },
  {
    id: "oecd-engage-intermediate",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Engage with AI",
    description:
      "Learners identify and access AI systems, evaluate AI outputs critically, and decide when AI use is appropriate.",
    prerequisites: ["oecd-engage-basic"],
  },
  {
    id: "oecd-engage-advanced",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Engage with AI",
    description:
      "Learners use AI intentionally and responsibly, reflecting on its impacts on themselves, their communities, and the environment.",
    prerequisites: ["oecd-engage-intermediate"],
  },
  {
    id: "oecd-create-basic",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Create with AI",
    description:
      "Learners experiment with AI tools as creative partners while producing work of their own.",
  },
  {
    id: "oecd-create-intermediate",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Create with AI",
    description:
      "Learners divide work intentionally between humans and AI, maintaining human agency over outcomes.",
    prerequisites: ["oecd-create-basic"],
  },
  {
    id: "oecd-create-advanced",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Create with AI",
    description:
      "Learners use AI to tackle open-ended challenges, justifying what they delegate to AI and what they keep human.",
    prerequisites: ["oecd-create-intermediate"],
  },
  {
    id: "oecd-manage-basic",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Manage AI",
    description:
      "Learners describe how AI systems are built and what data and design choices shape their behaviour.",
  },
  {
    id: "oecd-manage-intermediate",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Manage AI",
    description:
      "Learners adjust how they use AI — settings, prompts, verification habits — to manage risks and quality.",
    prerequisites: ["oecd-manage-basic"],
  },
  {
    id: "oecd-manage-advanced",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Manage AI",
    description:
      "Learners supervise AI-supported workflows, checking outputs and correcting course when AI misbehaves.",
    prerequisites: ["oecd-manage-intermediate"],
  },
  {
    id: "oecd-shape-basic",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Shape AI",
    description:
      "Learners explain that AI systems reflect the values and priorities of their makers.",
  },
  {
    id: "oecd-shape-intermediate",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Shape AI",
    description:
      "Learners give feedback on AI systems to improve fairness, accuracy, and inclusion.",
    prerequisites: ["oecd-shape-basic"],
  },
  {
    id: "oecd-shape-advanced",
    source: "OECD.AI",
    gradeBand: "all",
    concept: "Shape AI",
    description:
      "Learners propose improvements to AI systems so they better reflect human values and serve the common good.",
    prerequisites: ["oecd-shape-intermediate"],
  },
];
