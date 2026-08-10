import type { Problem } from "../types";

export const problemLibrary: Problem[] = [
  {
    id: "prob-1",
    title: "Rural Student Access to AI Tutoring",
    category: "education",
    statement:
      "Students in rural areas lack access to personalized AI tutoring that can help them learn at their own pace, especially in STEM subjects.",
    stakeholders: [
      "Rural students (ages 10-18)",
      "Teachers in under-resourced schools",
      "Parents with limited internet access",
    ],
    background:
      "According to UNESCO, 260 million children worldwide lack access to quality education. Rural areas are disproportionately affected due to infrastructure limitations and teacher shortages. AI tutoring can bridge this gap by providing personalized learning experiences.",
    constraints: [
      "Must work on low-bandwidth connections",
      "Must support offline mode",
      "Must be accessible on low-end devices",
      "Must support multiple languages",
    ],
    successCriteria: [
      "Student can access tutoring without internet",
      "Tutoring adapts to student's learning pace",
      "Teacher can monitor student progress",
      "System works on 2G connections",
    ],
    knowledgePackages: ["kp-ai-tutoring", "kp-offline-first", "kp-accessibility"],
    relatedRepositories: ["open-source-tutor", "offline-ai", "rural-edu"],
    suggestedAITechniques: [
      "Adaptive learning algorithms",
      "Offline model deployment",
      "Low-resource NLP",
    ],
    difficulty: "intermediate",
    estimatedDuration: "4-6 weeks",
    openSourceOpportunity:
      "Create an open-source AI tutoring framework that can be deployed in rural schools worldwide",
    origin: "library",
  },
  {
    id: "prob-2",
    title: "Small Farmer Crop Disease Detection",
    category: "agriculture",
    statement:
      "Small-scale farmers in developing countries lose 30-40% of their crops to diseases that could be detected early with AI-powered image recognition.",
    stakeholders: [
      "Small-scale farmers (1-5 acre plots)",
      "Agricultural extension workers",
      "Local cooperatives",
      "Food security organizations",
    ],
    background:
      "The FAO estimates that crop diseases cause $220 billion in annual losses globally. Small farmers lack access to plant pathologists and diagnostic tools. AI-powered image recognition can provide instant disease diagnosis using just a smartphone camera.",
    constraints: [
      "Must work on basic smartphones",
      "Must support local languages",
      "Must work offline in remote areas",
      "Must be accurate enough to be useful",
    ],
    successCriteria: [
      "Farmer can photograph a plant and get diagnosis",
      "System identifies top 20 crop diseases in the region",
      "Diagnosis is accurate within 80% of expert assessment",
      "System works without internet",
    ],
    knowledgePackages: ["kp-image-recognition", "kp-agriculture-ai", "kp-mobile-first"],
    relatedRepositories: ["plant-disease-detector", "farm-ai", "agri-helper"],
    suggestedAITechniques: [
      "Transfer learning for image classification",
      "Edge AI deployment",
      "Multilingual interfaces",
    ],
    difficulty: "intermediate",
    estimatedDuration: "3-5 weeks",
    openSourceOpportunity:
      "Build an open-source crop disease detection app that can be used by farmers worldwide",
    origin: "library",
  },
  {
    id: "prob-3",
    title: "Elderly Companion Chatbot",
    category: "healthcare",
    statement:
      "Elderly people living alone experience loneliness and cognitive decline. An AI companion can provide conversation, reminders, and mental stimulation.",
    stakeholders: [
      "Elderly people living alone",
      "Caregivers and family members",
      "Healthcare providers",
      "Senior living facilities",
    ],
    background:
      "The WHO reports that social isolation affects 25% of older adults globally. Loneliness is associated with a 26% increase in mortality risk. AI companions can provide daily conversation, cognitive exercises, medication reminders, and connection to family.",
    constraints: [
      "Must be extremely easy to use (voice-first)",
      "Must respect privacy and data security",
      "Must not replace human connection",
      "Must be affordable or free",
    ],
    successCriteria: [
      "User can have natural voice conversations",
      "System provides daily cognitive exercises",
      "System sends medication reminders",
      "Family can monitor engagement",
    ],
    knowledgePackages: ["kp-conversational-ai", "kp-voice-interface", "kp-privacy-design"],
    relatedRepositories: ["elder-companion", "voice-ai", "cognitive-exercises"],
    suggestedAITechniques: [
      "Conversational AI",
      "Voice recognition and synthesis",
      "Sentiment analysis",
      "Behavioral pattern detection",
    ],
    difficulty: "advanced",
    estimatedDuration: "6-8 weeks",
    openSourceOpportunity:
      "Create an open-source elderly companion platform that senior centers can deploy locally",
    origin: "library",
  },
  {
    id: "prob-4",
    title: "NGO Impact Measurement Dashboard",
    category: "ngos",
    statement:
      "NGOs struggle to measure and report their impact. An AI-powered dashboard can analyze their data and generate insights for donors and stakeholders.",
    stakeholders: [
      "NGO program managers",
      "Donors and grantmakers",
      "Beneficiaries",
      "Board members",
    ],
    background:
      "NGOs spend 15-20% of their time on reporting and donor communication. Most lack data analysis capabilities. AI can automate impact measurement, generate reports, and identify patterns that humans might miss.",
    constraints: [
      "Must integrate with existing data collection tools",
      "Must generate donor-ready reports",
      "Must protect beneficiary privacy",
      "Must work with messy, incomplete data",
    ],
    successCriteria: [
      "Dashboard shows real-time impact metrics",
      "System generates monthly impact reports",
      "AI identifies trends and outliers",
      "Reports are donor-ready in one click",
    ],
    knowledgePackages: ["kp-data-analysis", "kp-dashboard-design", "kp-privacy-protection"],
    relatedRepositories: ["ngo-dashboard", "impact-measurement", "donor-reports"],
    suggestedAITechniques: [
      "Natural language generation for reports",
      "Anomaly detection in impact data",
      "Predictive analytics for program outcomes",
    ],
    difficulty: "intermediate",
    estimatedDuration: "4-6 weeks",
    openSourceOpportunity:
      "Build an open-source impact measurement framework that any NGO can use",
    origin: "library",
  },
  {
    id: "prob-5",
    title: "Local Government Service Chatbot",
    category: "local-government",
    statement:
      "Citizens struggle to navigate local government services. An AI chatbot can help them find information, fill forms, and understand their rights.",
    stakeholders: [
      "Citizens seeking government services",
      "Government service desk staff",
      "Local government administrators",
      "Community organizations",
    ],
    background:
      "Citizens spend an average of 4 hours per year trying to navigate government services. Most government websites are difficult to use and lack search functionality. AI chatbots can provide 24/7 assistance and reduce wait times.",
    constraints: [
      "Must be accessible in multiple languages",
      "Must work on basic phones (USSD fallback)",
      "Must protect citizen privacy",
      "Must be accurate (government information must be correct)",
    ],
    successCriteria: [
      "Citizen can ask questions in natural language",
      "System provides accurate information from official sources",
      "System helps fill common forms",
      "System reduces service desk calls by 30%",
    ],
    knowledgePackages: ["kp-chatbot-design", "kp-government-services", "kp-multilingual-ai"],
    relatedRepositories: ["gov-chatbot", "citizen-services", "form-helper"],
    suggestedAITechniques: [
      "Retrieval-augmented generation",
      "Multilingual NLP",
      "Form understanding and extraction",
    ],
    difficulty: "intermediate",
    estimatedDuration: "4-6 weeks",
    openSourceOpportunity:
      "Create an open-source government service chatbot framework for local governments worldwide",
    origin: "library",
  },
  {
    id: "prob-6",
    title: "Disaster Response Coordination",
    category: "environment",
    statement:
      "During natural disasters, coordination between agencies is chaotic. An AI system can help prioritize responses, allocate resources, and communicate with affected populations.",
    stakeholders: [
      "Emergency responders",
      "Affected populations",
      "Relief organizations",
      "Government agencies",
    ],
    background:
      "The UN reports that 218 million people are affected by natural disasters annually. Response coordination is often slow and inefficient. AI can help process real-time information, predict needs, and optimize resource allocation.",
    constraints: [
      "Must work in low-connectivity environments",
      "Must handle multilingual communications",
      "Must be reliable when lives are at stake",
      "Must integrate with existing emergency systems",
    ],
    successCriteria: [
      "System processes real-time disaster reports",
      "AI prioritizes response needs",
      "System generates multilingual public alerts",
      "Resource allocation is optimized",
    ],
    knowledgePackages: [
      "kp-real-time-systems",
      "kp-disaster-response",
      "kp-multilingual-communication",
    ],
    relatedRepositories: ["disaster-coordinator", "emergency-ai", "response-optimizer"],
    suggestedAITechniques: [
      "Real-time data processing",
      "Priority classification",
      "Multilingual text generation",
      "Resource optimization algorithms",
    ],
    difficulty: "advanced",
    estimatedDuration: "6-10 weeks",
    openSourceOpportunity:
      "Build an open-source disaster response coordination platform for humanitarian organizations",
    origin: "library",
  },
  {
    id: "prob-7",
    title: "Small Business Inventory Optimizer",
    category: "small-business",
    statement:
      "Small businesses lose money from overstocking and stockouts. An AI system can predict demand and optimize inventory levels.",
    stakeholders: [
      "Small business owners",
      "Shop managers",
      "Suppliers",
      "Customers",
    ],
    background:
      "Small businesses lose 4-8% of revenue due to inventory issues. Most lack the tools and expertise to optimize inventory. AI can analyze sales patterns, predict demand, and suggest optimal stock levels.",
    constraints: [
      "Must work with existing point-of-sale systems",
      "Must be simple enough for non-technical users",
      "Must work offline (many small shops have limited internet)",
      "Must provide clear, actionable recommendations",
    ],
    successCriteria: [
      "System predicts demand with 80% accuracy",
      "Inventory costs decrease by 15%",
      "Stockouts decrease by 50%",
      "System provides daily recommendations",
    ],
    knowledgePackages: ["kp-demand-forecasting", "kp-inventory-management", "kp-simple-ai"],
    relatedRepositories: ["inventory-optimizer", "demand-predictor", "small-business-ai"],
    suggestedAITechniques: [
      "Time series forecasting",
      "Clustering for product categories",
      "Recommendation systems",
    ],
    difficulty: "beginner",
    estimatedDuration: "2-4 weeks",
    openSourceOpportunity:
      "Create an open-source inventory optimization tool for small businesses in developing countries",
    origin: "library",
  },
  {
    id: "prob-8",
    title: "Accessible Document Reader",
    category: "accessibility",
    statement:
      "People with visual impairments struggle to access printed documents. An AI system can read documents aloud, describe images, and provide alternative formats.",
    stakeholders: [
      "People with visual impairments",
      "Students with reading difficulties",
      "Elderly people with vision loss",
      "Libraries and educational institutions",
    ],
    background:
      "The WHO estimates 2.2 billion people have vision impairment. Most printed documents are not accessible. AI can convert text to speech, describe images, and provide alternative formats for people with different needs.",
    constraints: [
      "Must work on basic smartphones",
      "Must support multiple languages",
      "Must be fast enough for real-time use",
      "Must handle various document formats",
    ],
    successCriteria: [
      "System reads documents aloud with natural voice",
      "System describes images and charts",
      "System supports 10+ languages",
      "Response time is under 2 seconds",
    ],
    knowledgePackages: ["kp-accessibility-ai", "kp-text-to-speech", "kp-image-description"],
    relatedRepositories: ["accessible-reader", "document-ai", "tts-engine"],
    suggestedAITechniques: [
      "Optical character recognition",
      "Text-to-speech synthesis",
      "Image captioning",
      "Document layout analysis",
    ],
    difficulty: "intermediate",
    estimatedDuration: "4-6 weeks",
    openSourceOpportunity:
      "Build an open-source accessible document reader that can be deployed on basic devices",
    origin: "library",
  },
];
