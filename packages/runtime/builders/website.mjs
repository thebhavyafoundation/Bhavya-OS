function renderHTML({ pageType, title, data, lessonTitle }) {
  const css = `body{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a}
h1{font-size:1.8rem;border-bottom:2px solid #2563eb;padding-bottom:8px}
h2{font-size:1.3rem;margin-top:24px;color:#2563eb}
.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:12px 0}
.meta{color:#64748b;font-size:0.9rem}
nav{display:flex;gap:8px;margin:16px 0;flex-wrap:wrap}
nav a{padding:6px 14px;background:#f1f5f9;border-radius:6px;text-decoration:none;color:#475569;font-size:0.9rem;border:1px solid #e2e8f0}
nav a:hover{background:#e2e8f0}
.questions li{margin:8px 0;padding:8px;background:#fff;border:1px solid #e2e8f0;border-radius:4px}
table{width:100%;border-collapse:collapse;margin:12px 0}
td,th{border:1px solid #e2e8f0;padding:8px;text-align:left;font-size:0.9rem}
th{background:#f1f5f9}
.prompt{font-weight:500}
.options{color:#64748b;font-size:0.85rem;margin-top:4px}`;

  const navItems = [
    { path: "index.html", label: "Lesson" },
    { path: "assessment.html", label: "Assessment" },
    { path: "guide.html", label: "Teacher Guide" },
    { path: "workbook.html", label: "Workbook" },
  ];

  const nav = `<nav>${navItems.map(n =>
    `<a href="${n.path}"${n.label === title ? ' style="background:#2563eb;color:#fff"' : ''}>${n.label}</a>`
  ).join("")}</nav>`;

  let body = "";

  if (pageType === "lesson") {
    body = `<h1>${data.title}</h1>
<p class="meta">Subject: ${data.subject || "General"} | Grade: ${data.grade || "N/A"} | Duration: ${data.duration || "N/A"} min</p>
${nav}
${(data.outcomes || []).length > 0 ? `<h2>Learning Outcomes</h2><ul>${data.outcomes.map(o => `<li>${o.description || o}</li>`).join("")}</ul>` : ""}
${(data.sections || []).map(s => `
<div class="card">
  <h3>${s.title}</h3>
  <p class="meta">${s.type}</p>
  <p>${s.content || ""}</p>
</div>`).join("")}`;
  } else if (pageType === "assessment") {
    body = `<h1>Assessment: ${lessonTitle}</h1>${nav}
<p class="meta">${data.questions?.length || 0} questions | ${data.totalPoints || 0} points total | Passing: ${data.passingScore || 0} points</p>
<ol class="questions">${(data.questions || []).map(q => `
<li><p class="prompt">${q.prompt}</p>
${q.options ? `<p class="options">Options: ${q.options.join(" | ")}</p>` : ""}
<p class="meta">Type: ${q.type} | Difficulty: ${q.difficulty || "N/A"} | Bloom: ${q.bloomLevel || "N/A"}</p></li>`).join("")}</ol>`;
  } else if (pageType === "guide") {
    body = `<h1>Teacher Guide: ${lessonTitle}</h1>${nav}
${data.objectives?.length > 0 ? `<h2>Objectives</h2><ul>${data.objectives.map(o => `<li>${o}</li>`).join("")}</ul>` : ""}
${data.vocabulary?.length > 0 ? `<h2>Vocabulary</h2><ul>${data.vocabulary.map(v => `<li>${v}</li>`).join("")}</ul>` : ""}
${data.materials?.length > 0 ? `<h2>Materials</h2><ul>${data.materials.map(m => `<li>${m}</li>`).join("")}</ul>` : ""}
${data.discussionPrompts?.length > 0 ? `<h2>Discussion Prompts</h2><ul>${data.discussionPrompts.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}
${data.timingGuide?.length > 0 ? `<h2>Timing Guide</h2><table><tr><th>Section</th><th>Duration</th><th>Activity</th></tr>${data.timingGuide.map(t => `<tr><td>${t.section}</td><td>${t.duration} min</td><td>${t.activity}</td></tr>`).join("")}</table>` : ""}
${data.commonMisconceptions?.length > 0 ? `<h2>Common Misconceptions</h2><ul>${data.commonMisconceptions.map(m => `<li>${m}</li>`).join("")}</ul>` : ""}`;
  } else if (pageType === "workbook") {
    body = `<h1>Workbook: ${lessonTitle}</h1>${nav}
<p class="meta">${data.pages?.length || 0} pages</p>
${(data.pages || []).map(p => `
<div class="card">
  <h3>${p.title}</h3>
  ${(p.questions || []).map(q => `<p><strong>${q.prompt}</strong> <span class="meta">(${q.type}, ${q.points || 0} pts)</span></p>`).join("")}
</div>`).join("")}`;
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - ${lessonTitle}</title><style>${css}</style></head><body>${body}</body></html>`;
}

export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || {};
  const assessment = input.assessment || {};
  const guide = input.teacherGuide || {};
  const workbook = input.workbook || {};

  const title = lesson.title || "Untitled";

  const htmlPages = [];

  // Lesson page
  htmlPages.push({
    path: "index.html",
    title: "Lesson",
    type: "lesson",
    html: renderHTML({
      pageType: "lesson",
      title: "Lesson",
      data: {
        title: lesson.title || "Lesson",
        subject: lesson.subject,
        grade: lesson.grade,
        duration: lesson.duration,
        outcomes: lesson.learningOutcomes || [],
        sections: lesson.sections || [],
      },
      lessonTitle: title,
    }),
  });

  // Assessment page
  if (assessment.questions?.length > 0) {
    htmlPages.push({
      path: "assessment.html",
      title: "Assessment",
      type: "assessment",
      html: renderHTML({
        pageType: "assessment",
        title: "Assessment",
        data: {
          questions: assessment.questions,
          totalPoints: assessment.totalPoints,
          passingScore: assessment.passingScore,
        },
        lessonTitle: title,
      }),
    });
  }

  // Teacher Guide page
  if (guide.objectives?.length > 0 || guide.timingGuide?.length > 0) {
    htmlPages.push({
      path: "guide.html",
      title: "Teacher Guide",
      type: "guide",
      html: renderHTML({
        pageType: "guide",
        title: "Teacher Guide",
        data: {
          objectives: guide.objectives,
          vocabulary: guide.vocabulary,
          materials: guide.materials,
          discussionPrompts: guide.discussionPrompts,
          timingGuide: guide.timingGuide,
          commonMisconceptions: guide.commonMisconceptions,
        },
        lessonTitle: title,
      }),
    });
  }

  // Workbook page
  if (workbook.pages?.length > 0) {
    htmlPages.push({
      path: "workbook.html",
      title: "Workbook",
      type: "workbook",
      html: renderHTML({
        pageType: "workbook",
        title: "Workbook",
        data: { pages: workbook.pages },
        lessonTitle: title,
      }),
    });
  }

  if (htmlPages.length === 1) {
    warnings.push({ message: "Only lesson page generated. Add assessments, guides, or workbooks for richer content." });
  }

  return {
    success: errors.length === 0,
    output: {
      website: {
        id: `website-${Date.now()}`,
        lessonId: lesson.id || `lesson-${Date.now()}`,
        title: `Lesson: ${title}`,
        pages: htmlPages,
        totalPages: htmlPages.length,
        assets: ["css/styles.css", "js/main.js"],
        formats: ["static-site", "offline-package"],
        createdAt: new Date().toISOString(),
        version: "0.1.0",
      },
    },
    errors,
    warnings,
    duration: Date.now() - start,
  };
}

export async function validate(input) {
  const errors = [];
  if (!input.lesson?.title) errors.push({ field: "lesson.title", message: "Lesson title required" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.website) return null;
  return {
    title: output.website.title,
    pages: output.website.totalPages,
    hasAssessment: output.website.pages.some(p => p.type === "assessment"),
    hasGuide: output.website.pages.some(p => p.type === "guide"),
    hasWorkbook: output.website.pages.some(p => p.type === "workbook"),
  };
}

export async function status(execId) {
  return { builder: "website", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "website", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "website", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
