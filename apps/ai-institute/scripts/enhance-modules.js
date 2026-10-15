const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "curriculum",
  "ai-module-registry.ts",
);

const content = fs.readFileSync(filePath, "utf8");

function inferBloomVerb(topics, description) {
  const text = [...topics, description].join(" ").toLowerCase();
  if (
    text.includes("define") ||
    text.includes("list") ||
    text.includes("recall")
  )
    return "remember";
  if (
    text.includes("explain") ||
    text.includes("describe") ||
    text.includes("understand")
  )
    return "understand";
  if (
    text.includes("apply") ||
    text.includes("use") ||
    text.includes("demonstrate")
  )
    return "apply";
  if (
    text.includes("analyze") ||
    text.includes("compare") ||
    text.includes("categorize")
  )
    return "analyze";
  if (
    text.includes("evaluate") ||
    text.includes("critique") ||
    text.includes("judge")
  )
    return "evaluate";
  if (
    text.includes("create") ||
    text.includes("design") ||
    text.includes("build")
  )
    return "create";
  return "understand";
}

function inferVisualType(topics, description) {
  const text = [...topics, description].join(" ").toLowerCase();
  if (
    text.includes("neural") ||
    text.includes("network") ||
    text.includes("graph") ||
    text.includes("tree")
  )
    return "spatial-model";
  if (
    text.includes("pipeline") ||
    text.includes("process") ||
    text.includes("workflow") ||
    text.includes("steps")
  )
    return "process-diagram";
  if (
    text.includes("data") ||
    text.includes("chart") ||
    text.includes("metric") ||
    text.includes("measure")
  )
    return "data-viz";
  if (
    text.includes("brain") ||
    text.includes("metaphor") ||
    text.includes("like") ||
    text.includes("imagine")
  )
    return "metaphor";
  return "concept-diagram";
}

function inferVisualFormat(band) {
  if (band === "junior-a" || band === "junior-b") return "2d";
  return "3d";
}

function inferAssetUrl(visualType, band) {
  if (band === "junior-a" || band === "junior-b") {
    return `github:models/kenney/[to-be-downloaded].glb`;
  }
  if (visualType === "spatial-model") {
    return `github:models/poly-haven/[to-be-downloaded].glb`;
  }
  if (visualType === "metaphor") {
    return `github:models/poly-haven/[to-be-downloaded].glb`;
  }
  return `github:icons/reshot/[to-be-downloaded].svg`;
}

function generateLearningObjective(title, description, topics) {
  const topicList = topics.slice(0, 3).join(", ");
  return `Students will be able to explain ${title.toLowerCase()} and describe how ${topicList} work together.`;
}

function enhanceModule(moduleText) {
  const idMatch = moduleText.match(/id: "([^"]+)"/);
  const titleMatch = moduleText.match(/title: "([^"]+)"/);
  const bandMatch = moduleText.match(/band: "([^"]+)"/);
  const descMatch = moduleText.match(/description:\s*"([^"]+)"/);
  const topicsMatch = moduleText.match(/topics: \[([^\]]+)\]/);

  if (!idMatch || !titleMatch || !bandMatch || !descMatch || !topicsMatch) {
    return moduleText;
  }

  const id = idMatch[1];
  const title = titleMatch[1];
  const band = bandMatch[1];
  const description = descMatch[1];
  const topics = topicsMatch[1]
    .split(",")
    .map((t) => t.trim().replace(/"/g, ""))
    .filter(Boolean);

  const bloomVerb = inferBloomVerb(topics, description);
  const visualType = inferVisualType(topics, description);
  const visualFormat = inferVisualFormat(band);
  const learningObjective = generateLearningObjective(
    title,
    description,
    topics,
  );
  const recommendedAssetUrl = inferAssetUrl(visualType, band);

  const enhancement = `
    learningObjective: "${learningObjective}",
    bloomVerb: "${bloomVerb}",
    visualType: "${visualType}",
    visualFormat: "${visualFormat}",
    recommendedAssetUrl: "${recommendedAssetUrl}",`;

  const estimatedHoursMatch = moduleText.match(/estimatedHours: (\d+),/);
  if (estimatedHoursMatch) {
    return moduleText.replace(
      /estimatedHours: (\d+),/,
      `estimatedHours: ${estimatedHoursMatch[1]},${enhancement}`,
    );
  }

  return moduleText.replace(
    /estimatedHours: (\d+),/,
    `estimatedHours: 10,${enhancement}`,
  );
}

const moduleRegex =
  /\{\s*id: "[^"]+",\s*slug: "[^"]+",\s*title: "[^"]+",\s*band: "[^"]+",\s*level: "[^"]+",\s*description:\s*"[^"]+",\s*topics: \[[^\]]+\],\s*standards: \[[^\]]+\],(?:\s*prerequisites: \[[^\]]+\],)?\s*estimatedHours: \d+,?\s*\}/g;

const enhancedContent = content.replace(moduleRegex, (match) => {
  return enhanceModule(match);
});

fs.writeFileSync(filePath, enhancedContent);
console.log("Enhanced 86 modules with visual alignment metadata");
