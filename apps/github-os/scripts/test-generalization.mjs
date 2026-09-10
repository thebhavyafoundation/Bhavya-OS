#!/usr/bin/env node
/**
 * Git OS — Generalization Tests (J15-J20)
 *
 * J15: Multi-ecosystem language detection
 * J16: Scoring calibration across ecosystems
 * J17: Technology stack detection accuracy
 * J18: Framework detection across ecosystems
 * J19: Pattern detection generalization
 * J20: Recommendation accuracy across score ranges
 *
 * Usage: node scripts/test-generalization.mjs
 */

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ ${testName}${details ? ` — ${details}` : ""}`);
  } else {
    totalFailed++;
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
  }
}

// ─── J15: LANGUAGE DETECTION ────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🌐 J15: MULTI-ECOSYSTEM LANGUAGE DETECTION");
console.log("═".repeat(60));

function detectLanguageFromFiles(files) {
  const extMap = {
    ".ts": "TypeScript", ".tsx": "TypeScript",
    ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript",
    ".py": "Python", ".pyw": "Python",
    ".rs": "Rust",
    ".go": "Go",
    ".java": "Java",
    ".rb": "Ruby",
    ".php": "PHP",
    ".cs": "C#",
    ".cpp": "C++", ".cc": "C++", ".cxx": "C++",
    ".c": "C",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".scala": "Scala",
    ".ex": "Elixir", ".exs": "Elixir",
    ".erl": "Erlang",
    ".hs": "Haskell",
    ".lua": "Lua",
    ".r": "R", ".R": "R",
    ".m": "Objective-C",
  };

  const counts = {};
  for (const file of files) {
    const ext = file.match(/\.[^.]+$/)?.[0]?.toLowerCase();
    if (ext && extMap[ext]) {
      const lang = extMap[ext];
      counts[lang] = (counts[lang] || 0) + 1;
    }
  }

  if (Object.keys(counts).length === 0) return null;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// Test: JavaScript ecosystem
assert(detectLanguageFromFiles(["index.js", "app.js", "utils.js"]) === "JavaScript", "JavaScript detection", ".js files");

// Test: TypeScript ecosystem
assert(detectLanguageFromFiles(["index.ts", "app.tsx", "utils.ts"]) === "TypeScript", "TypeScript detection", ".ts/.tsx files");

// Test: Python ecosystem
assert(detectLanguageFromFiles(["main.py", "utils.py", "test.py"]) === "Python", "Python detection", ".py files");

// Test: Rust ecosystem
assert(detectLanguageFromFiles(["main.rs", "lib.rs", "mod.rs"]) === "Rust", "Rust detection", ".rs files");

// Test: Go ecosystem
assert(detectLanguageFromFiles(["main.go", "handler.go", "server.go"]) === "Go", "Go detection", ".go files");

// Test: Mixed ecosystem (dominant language wins)
assert(detectLanguageFromFiles(["index.ts", "utils.ts", "helper.js"]) === "TypeScript", "Mixed ecosystem", "TypeScript dominant");

// Test: Empty file list
assert(detectLanguageFromFiles([]) === null, "Empty file list", "returns null");

// Test: Unknown extensions
assert(detectLanguageFromFiles(["data.xyz", "config.abc"]) === null, "Unknown extensions", "returns null");

// ─── J16: SCORING CALIBRATION ───────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 J16: SCORING CALIBRATION ACROSS ECOSYSTEMS");
console.log("═".repeat(60));

function calculateHealthScore(inspection) {
  let health = 50;
  if (inspection.hasReadme) health += 10;
  if (inspection.hasLicense) health += 8;
  if (inspection.hasTests) health += 12;
  if (inspection.hasCI) health += 8;
  if (inspection.hasChangelog) health += 4;
  if (inspection.hasDocumentation) health += 5;
  if (inspection.hasExamples) health += 3;
  return Math.min(100, health);
}

function calculateTechnologyScore(inspection) {
  let tech = 50;
  if (inspection.hasTypeScript) tech += 15;
  if (inspection.hasESLint) tech += 8;
  if (inspection.hasPrettier) tech += 5;
  if (inspection.framework) tech += 10;
  if (inspection.testFramework) tech += 10;
  return Math.min(100, tech);
}

function calculateBhavyaScore(health, tech, license, security, inspection) {
  let bhavya = 40;
  if (license.isOsiApproved && !license.isCopyleft) bhavya += 15;
  if (!security.credentialExposure) bhavya += 5;
  if (inspection.hasReadme) bhavya += 3;
  if (inspection.hasTests) bhavya += 4;
  if (inspection.hasCI) bhavya += 3;
  if (inspection.hasDocumentation) bhavya += 3;
  return Math.min(100, bhavya);
}

// Test: Minimal repo scores low
const minimalInspection = { hasReadme: false, hasLicense: false, hasTests: false, hasCI: false, hasTypeScript: false, hasESLint: false, hasPrettier: false, hasDocumentation: false, hasExamples: false, hasChangelog: false, framework: null, testFramework: null };
const minimalLicense = { isOsiApproved: false, isCopyleft: false };
const minimalSecurity = { credentialExposure: true };

const minimalHealth = calculateHealthScore(minimalInspection);
const minimalTech = calculateTechnologyScore(minimalInspection);
const minimalBhavya = calculateBhavyaScore(minimalHealth, minimalTech, minimalLicense, minimalSecurity, minimalInspection);

assert(minimalHealth <= 50, "Minimal repo health <= 50", `${minimalHealth}`);
assert(minimalTech <= 50, "Minimal repo tech <= 50", `${minimalTech}`);
assert(minimalBhavya <= 50, "Minimal repo bhavya <= 50", `${minimalBhavya}`);

// Test: Well-maintained repo scores high
const fullInspection = { hasReadme: true, hasLicense: true, hasTests: true, hasCI: true, hasTypeScript: true, hasESLint: true, hasPrettier: true, hasDocumentation: true, hasExamples: true, hasChangelog: true, framework: "React", testFramework: "Jest" };
const fullLicense = { isOsiApproved: true, isCopyleft: false };
const fullSecurity = { credentialExposure: false };

const fullHealth = calculateHealthScore(fullInspection);
const fullTech = calculateTechnologyScore(fullInspection);
const fullBhavya = calculateBhavyaScore(fullHealth, fullTech, fullLicense, fullSecurity, fullInspection);

assert(fullHealth >= 80, "Well-maintained repo health >= 80", `${fullHealth}`);
assert(fullTech >= 80, "Well-maintained repo tech >= 80", `${fullTech}`);
assert(fullBhavya >= 70, "Well-maintained repo bhavya >= 70", `${fullBhavya}`);

// Test: Score consistency — same inputs produce same outputs
const health1 = calculateHealthScore(fullInspection);
const health2 = calculateHealthScore(fullInspection);
assert(health1 === health2, "Score consistency", `${health1} === ${health2}`);

// Test: Score bounds — always 0-100
assert(minimalHealth >= 0 && minimalHealth <= 100, "Health score in bounds", `[${minimalHealth}]`);
assert(fullTech >= 0 && fullTech <= 100, "Tech score in bounds", `[${fullTech}]`);
assert(fullBhavya >= 0 && fullBhavya <= 100, "Bhavya score in bounds", `[${fullBhavya}]`);

// ─── J17: TECHNOLOGY STACK DETECTION ────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔧 J17: TECHNOLOGY STACK DETECTION");
console.log("═".repeat(60));

function detectTechStack(files, languages) {
  const stack = {};

  // Package manager
  if (files.includes("package-lock.json")) stack.packageManager = "npm";
  else if (files.includes("yarn.lock")) stack.packageManager = "yarn";
  else if (files.includes("pnpm-lock.yaml")) stack.packageManager = "pnpm";
  else if (files.includes("Cargo.lock")) stack.packageManager = "cargo";
  else if (files.includes("go.sum")) stack.packageManager = "go-modules";
  else if (files.includes("Pipfile.lock")) stack.packageManager = "pipenv";
  else if (files.includes("poetry.lock")) stack.packageManager = "poetry";

  // Framework detection
  if (files.includes("next.config.js") || files.includes("next.config.mjs")) stack.framework = "Next.js";
  else if (files.includes("nuxt.config.js") || files.includes("nuxt.config.ts")) stack.framework = "Nuxt";
  else if (files.includes("angular.json")) stack.framework = "Angular";
  else if (files.includes("vue.config.js")) stack.framework = "Vue.js";
  else if (files.includes("svelte.config.js")) stack.framework = "SvelteKit";
  else if (files.includes("vite.config.ts") || files.includes("vite.config.js")) stack.framework = "Vite";
  else if (files.includes("Cargo.toml")) stack.framework = "Rust/Cargo";
  else if (files.includes("go.mod")) stack.framework = "Go Modules";

  // Testing frameworks
  if (files.includes("jest.config.js") || files.includes("jest.config.ts")) stack.testFramework = "Jest";
  else if (files.includes("vitest.config.ts") || files.includes("vitest.config.js")) stack.testFramework = "Vitest";
  else if (files.includes(".mocharc.yml")) stack.testFramework = "Mocha";
  else if (files.includes("pytest.ini") || files.includes("pyproject.toml")) stack.testFramework = "pytest";

  // Linting
  if (files.includes(".eslintrc.js") || files.includes(".eslintrc.json") || files.includes("eslint.config.js")) stack.linter = "ESLint";
  else if (files.includes(".pylintrc") || files.includes("pylintrc")) stack.linter = "Pylint";
  else if (files.includes("clippy.toml")) stack.linter = "Clippy";

  // Build tools
  if (files.includes("webpack.config.js")) stack.buildTool = "Webpack";
  else if (files.includes("rollup.config.js")) stack.buildTool = "Rollup";
  else if (files.includes("esbuild.config.js")) stack.buildTool = "esbuild";
  else if (files.includes("Makefile")) stack.buildTool = "Make";
  else if (files.includes("CMakeLists.txt")) stack.buildTool = "CMake";

  return stack;
}

// Test: JavaScript/Node.js stack
const jsFiles = ["package.json", "package-lock.json", "next.config.js", "jest.config.js", ".eslintrc.js", "webpack.config.js"];
const jsStack = detectTechStack(jsFiles, ["JavaScript"]);
assert(jsStack.packageManager === "npm", "npm detected", jsStack.packageManager);
assert(jsStack.framework === "Next.js", "Next.js detected", jsStack.framework);
assert(jsStack.testFramework === "Jest", "Jest detected", jsStack.testFramework);
assert(jsStack.linter === "ESLint", "ESLint detected", jsStack.linter);
assert(jsStack.buildTool === "Webpack", "Webpack detected", jsStack.buildTool);

// Test: Rust stack
const rustFiles = ["Cargo.toml", "Cargo.lock", "clippy.toml"];
const rustStack = detectTechStack(rustFiles, ["Rust"]);
assert(rustStack.packageManager === "cargo", "Cargo detected", rustStack.packageManager);
assert(rustStack.framework === "Rust/Cargo", "Rust/Cargo detected", rustStack.framework);
assert(rustStack.linter === "Clippy", "Clippy detected", rustStack.linter);

// Test: Go stack
const goFiles = ["go.mod", "go.sum", "Makefile"];
const goStack = detectTechStack(goFiles, ["Go"]);
assert(goStack.packageManager === "go-modules", "Go modules detected", goStack.packageManager);
assert(goStack.framework === "Go Modules", "Go Modules detected", goStack.framework);
assert(goStack.buildTool === "Make", "Make detected", goStack.buildTool);

// Test: Python stack
const pyFiles = ["pyproject.toml", "Pipfile.lock", "pytest.ini"];
const pyStack = detectTechStack(pyFiles, ["Python"]);
assert(pyStack.packageManager === "pipenv", "Pipenv detected", pyStack.packageManager);
assert(pyStack.testFramework === "pytest", "pytest detected", pyStack.testFramework);

// Test: Empty file list
const emptyStack = detectTechStack([], []);
assert(Object.keys(emptyStack).length === 0, "Empty stack for empty files", "0 properties");

// ─── J18: FRAMEWORK DETECTION ───────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🏗️ J18: FRAMEWORK DETECTION ACROSS ECOSYSTEMS");
console.log("═".repeat(60));

function detectFramework(readmeContent, files) {
  const lower = readmeContent?.toLowerCase() || "";
  const fileNames = files.map((f) => f.toLowerCase());

  // JavaScript frameworks
  if (lower.includes("next.js") || lower.includes("nextjs") || fileNames.includes("next.config.js")) return "Next.js";
  if (lower.includes("nuxt") || fileNames.includes("nuxt.config.js")) return "Nuxt";
  if (lower.includes("angular") || fileNames.includes("angular.json")) return "Angular";
  if (lower.includes("vue.js") || lower.includes("vuejs") || fileNames.includes("vue.config.js")) return "Vue.js";
  if (lower.includes("svelte") || fileNames.includes("svelte.config.js")) return "SvelteKit";
  if (lower.includes("express") || lower.includes("expressjs")) return "Express.js";
  if (lower.includes("fastify")) return "Fastify";
  if (lower.includes("koa")) return "Koa";

  // Python frameworks
  if (lower.includes("django") || fileNames.includes("manage.py")) return "Django";
  if (lower.includes("flask")) return "Flask";
  if (lower.includes("fastapi")) return "FastAPI";

  // Go frameworks
  if (lower.includes("gin-gonic") || lower.includes("gin framework")) return "Gin";
  if (lower.includes("echo")) return "Echo";
  if (lower.includes("fiber")) return "Fiber";

  // Rust frameworks
  if (lower.includes("actix")) return "Actix";
  if (lower.includes("axum")) return "Axum";
  if (lower.includes("rocket")) return "Rocket";

  return null;
}

// Test: Express.js detection
assert(detectFramework("Express is a fast, unopinionated, minimalist web framework for Node.js", ["package.json"]) === "Express.js", "Express.js from README", "detected");

// Test: Django detection
assert(detectFramework("Django is a high-level Python web framework", ["manage.py"]) === "Django", "Django from README + manage.py", "detected");

// Test: Next.js detection
assert(detectFramework("", ["next.config.js", "package.json"]) === "Next.js", "Next.js from config file", "detected");

// Test: No framework
assert(detectFramework("A general purpose library", ["package.json"]) === null, "No framework detected", "null");

// ─── J19: PATTERN DETECTION GENERALIZATION ──────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔍 J19: PATTERN DETECTION GENERALIZATION");
console.log("═".repeat(60));

function detectPatterns(readmeContent, inspection) {
  const patterns = [];
  const lower = readmeContent?.toLowerCase() || "";

  // Universal patterns
  if (inspection.hasTests && inspection.hasCI) patterns.push({ name: "Test-Driven CI", ecosystem: "universal" });
  if (inspection.hasTypeScript) patterns.push({ name: "Type Safety", ecosystem: "universal" });
  if (inspection.hasDocumentation) patterns.push({ name: "Documentation-First", ecosystem: "universal" });

  // Ecosystem-specific patterns
  if (lower.includes("middleware")) patterns.push({ name: "Middleware Pattern", ecosystem: "web" });
  if (lower.includes("plugin")) patterns.push({ name: "Plugin Architecture", ecosystem: "modular" });
  if (lower.includes("mvc") || lower.includes("model-view-controller")) patterns.push({ name: "MVC", ecosystem: "web" });
  if (lower.includes("dependency injection") || lower.includes("di container")) patterns.push({ name: "Dependency Injection", ecosystem: "enterprise" });
  if (lower.includes("event-driven") || lower.includes("event sourcing")) patterns.push({ name: "Event-Driven", ecosystem: "distributed" });
  if (lower.includes("microservice")) patterns.push({ name: "Microservices", ecosystem: "distributed" });
  if (lower.includes("cQRS")) patterns.push({ name: "CQRS", ecosystem: "distributed" });

  return patterns;
}

// Test: Express.js patterns
const expressPatterns = detectPatterns("Express supports middleware for request processing", { hasTests: true, hasCI: true, hasTypeScript: false, hasDocumentation: true });
assert(expressPatterns.some((p) => p.name === "Middleware Pattern"), "Express: Middleware detected", "web pattern");
assert(expressPatterns.some((p) => p.name === "Test-Driven CI"), "Express: Test-Driven CI detected", "universal pattern");
assert(expressPatterns.some((p) => p.name === "Documentation-First"), "Express: Docs pattern detected", "universal pattern");

// Test: Django patterns
const djangoPatterns = detectPatterns("Django follows the model-view-controller pattern with dependency injection", { hasTests: true, hasCI: true, hasTypeScript: false, hasDocumentation: true });
assert(djangoPatterns.some((p) => p.name === "MVC"), "Django: MVC detected", "web pattern");
assert(djangoPatterns.some((p) => p.name === "Dependency Injection"), "Django: DI detected", "enterprise pattern");

// Test: Event-driven patterns
const eventPatterns = detectPatterns("This is an event-driven system with event sourcing", { hasTests: false, hasCI: false, hasTypeScript: false, hasDocumentation: false });
assert(eventPatterns.some((p) => p.name === "Event-Driven"), "Event-driven detected", "distributed pattern");

// Test: No patterns
const noPatterns = detectPatterns("A simple utility library", { hasTests: false, hasCI: false, hasTypeScript: false, hasDocumentation: false });
assert(noPatterns.length === 0, "No patterns for minimal repo", "0 patterns");

// ─── J20: RECOMMENDATION ACCURACY ───────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("💡 J20: RECOMMENDATION ACCURACY");
console.log("═".repeat(60));

function generateRecommendation(health, tech, bhavya, license) {
  const weighted = (health + tech + bhavya) / 300;
  let type;
  if (weighted > 0.7 && license.isOsiApproved && !license.isCopyleft) type = "adopt";
  else if (weighted > 0.5) type = "study";
  else if (weighted > 0.3) type = "reference";
  else if (weighted > 0.15) type = "monitor";
  else type = "archive";
  return { type, confidence: weighted };
}

// Test: High-quality repo → adopt
const adoptRec = generateRecommendation(90, 85, 80, { isOsiApproved: true, isCopyleft: false });
assert(adoptRec.type === "adopt", "High scores → ADOPT", adoptRec.type);

// Test: Medium quality → study
const studyRec = generateRecommendation(60, 55, 50, { isOsiApproved: true, isCopyleft: false });
assert(studyRec.type === "study", "Medium scores → STUDY", studyRec.type);

// Test: Low quality → reference
const refRec = generateRecommendation(40, 35, 30, { isOsiApproved: false, isCopyleft: false });
assert(refRec.type === "reference", "Low scores → REFERENCE", refRec.type);

// Test: Very low quality → archive
const archiveRec = generateRecommendation(10, 10, 10, { isOsiApproved: false, isCopyleft: false });
assert(archiveRec.type === "archive", "Very low scores → ARCHIVE", archiveRec.type);

// Test: GPL copyleft downgrades recommendation
const gplRec = generateRecommendation(90, 85, 80, { isOsiApproved: true, isCopyleft: true });
assert(gplRec.type !== "adopt", "GPL copyleft blocks ADOPT", gplRec.type);

// Test: Confidence correlates with scores
assert(adoptRec.confidence > studyRec.confidence, "Adopt confidence > Study confidence", `${adoptRec.confidence} > ${studyRec.confidence}`);
assert(studyRec.confidence > refRec.confidence, "Study confidence > Reference confidence", `${studyRec.confidence} > ${refRec.confidence}`);

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 GENERALIZATION TEST RESULTS");
console.log("═".repeat(60));
console.log(`  Total: ${totalTests} tests, ${totalPassed} passed, ${totalFailed} failed`);
console.log("═".repeat(60));
console.log(`\n🎉 Generalization Tests: ${totalFailed === 0 ? "PASS ✅" : "FAIL ❌"}`);
