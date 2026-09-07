export const builders = [
  {
    id: "lesson",
    name: "Lesson Builder",
    description: "Build structured lessons from Knowledge Objects",
    capability: "lesson_generation",
    inputType: "knowledge-object",
    outputType: "lesson-content",
    icon: "book",
  },
  {
    id: "assessment",
    name: "Assessment Builder",
    description: "Generate quizzes and assessments from lesson content",
    capability: "quiz_generation",
    inputType: "lesson-content",
    outputType: "assessment",
    icon: "clipboard-check",
  },
  {
    id: "teacher-guide",
    name: "Teacher Guide Builder",
    description:
      "Create comprehensive teacher guides with answer keys and timing",
    capability: "lesson_generation",
    inputType: "lesson-content",
    outputType: "teacher-guide",
    icon: "graduation-cap",
  },
  {
    id: "workbook",
    name: "Workbook Builder",
    description: "Generate printable student workbooks with exercises",
    capability: "lesson_generation",
    inputType: "lesson-content",
    outputType: "workbook",
    icon: "file-text",
  },
  {
    id: "website",
    name: "Website Builder",
    description: "Publish lessons as interactive web pages",
    capability: "website_generation",
    inputType: "lesson-content",
    outputType: "website",
    icon: "globe",
  },
  {
    id: "video",
    name: "Video Builder",
    description: "Create animated explainer videos from lesson content",
    capability: "video_generation",
    inputType: "lesson-content",
    outputType: "video",
    icon: "video",
  },
  {
    id: "slides",
    name: "Slides Builder",
    description: "Generate presentation slides for classroom use",
    capability: "slides_generation",
    inputType: "lesson-content",
    outputType: "slides",
    icon: "presentation",
  },
  {
    id: "pdf",
    name: "PDF Builder",
    description: "Export lesson materials as printable PDFs",
    capability: "pdf_generation",
    inputType: "lesson-content",
    outputType: "pdf",
    icon: "file",
  },
];

export function getBuilder(id: string) {
  return builders.find((b) => b.id === id);
}

export function getBuildersForCapability(capability: string) {
  return builders.filter((b) => b.capability === capability);
}

export const capabilityNames: Record<string, string> = {
  lesson_generation: "Lesson Generation",
  quiz_generation: "Quiz Generation",
  video_generation: "Video Generation",
  website_generation: "Website Generation",
  slides_generation: "Slides Generation",
  pdf_generation: "PDF Generation",
  animation_generation: "Animation Generation",
  diagram_generation: "Diagram Generation",
  research_analysis: "Research Analysis",
  translation: "Translation",
};

export const builderColors: Record<string, string> = {
  lesson: "bg-accent-gold",
  assessment: "bg-green-500",
  "teacher-guide": "bg-forest",
  workbook: "bg-orange-500",
  website: "bg-teal-500",
  video: "bg-red-500",
  slides: "bg-indigo-500",
  pdf: "bg-gray-500",
};
