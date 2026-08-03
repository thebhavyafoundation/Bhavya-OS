import { writeFileSync } from 'fs';

/**
 * Website Builder — generates a complete documentation-ready site from artifacts.
 * Outputs: HTML pages, MDX content, navigation, SEO metadata, OG tags,
 * structured data, search index, RSS feed, sitemap.
 */
export class WebsiteBuilder {
  /**
   * Build a complete website from a Knowledge Package.
   * @param {import('../knowledge-package.mjs').KnowledgePackage} pkg
   * @returns {Object} website output
   */
  build(pkg) {
    const pages = [];
    const searchIndex = [];

    // Lesson page
    if (pkg.lesson) {
      const html = this.#renderLessonPage(pkg);
      const mdx = this.#renderLessonMDX(pkg);
      pages.push({ path: 'index.html', title: 'Lesson', type: 'lesson', html, mdx });
      searchIndex.push(...this.#indexContent('lesson', pkg.lesson, 'lesson'));
    }

    // Assessment page
    if (pkg.assessment) {
      const html = this.#renderAssessmentPage(pkg);
      const mdx = this.#renderAssessmentMDX(pkg);
      pages.push({ path: 'assessment.html', title: 'Assessment', type: 'assessment', html, mdx });
      searchIndex.push(...this.#indexContent('assessment', pkg.assessment, 'assessment'));
    }

    // Teacher Guide page
    if (pkg.teacherGuide) {
      const html = this.#renderGuidePage(pkg);
      const mdx = this.#renderGuideMDX(pkg);
      pages.push({ path: 'guide.html', title: 'Teacher Guide', type: 'guide', html, mdx });
      searchIndex.push(...this.#indexContent('guide', pkg.teacherGuide, 'guide'));
    }

    // Workbook page
    if (pkg.workbook) {
      const html = this.#renderWorkbookPage(pkg);
      const mdx = this.#renderWorkbookMDX(pkg);
      pages.push({ path: 'workbook.html', title: 'Workbook', type: 'workbook', html, mdx });
      searchIndex.push(...this.#indexContent('workbook', pkg.workbook, 'workbook'));
    }

    // Metadata
    const nav = this.#buildNav(pages);
    const seo = this.#buildSEO(pkg);
    const structuredData = this.#buildStructuredData(pkg);
    const sitemap = this.#buildSitemap(pkg, pages);
    const rss = this.#buildRSS(pkg, pages);

    return {
      id: `web-${pkg.id}`,
      pages, nav, seo, structuredData, searchIndex, sitemap, rss,
      totalPages: pages.length,
      formats: ['html', 'mdx'],
      createdAt: new Date().toISOString(),
    };
  }

  // ─── HTML Renderers ────────────────────────────────

  #renderLessonPage(pkg) {
    const l = pkg.lesson;
    const nav = this.#buildNavHTML(pkg);
    return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${l.title} - Knowledge Studio</title>
<meta name="description" content="${l.learningOutcomes?.[0]?.description || l.title}">
<meta property="og:title" content="${l.title}">
<meta property="og:type" content="article">
<meta property="og:description" content="${l.description || l.title}">
<script type="application/ld+json">${JSON.stringify(this.#buildStructuredData(pkg))}</script>
<style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.7;max-width:800px;margin:0 auto;padding:24px;color:#1a1a1a}
h1{font-size:2rem;border-bottom:2px solid #2563eb;padding-bottom:12px}
h2{font-size:1.4rem;margin-top:32px;color:#2563eb}
.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0}
.meta{color:#64748b;font-size:0.85rem}nav{display:flex;gap:8px;margin:20px 0;flex-wrap:wrap}
nav a{padding:8px 16px;background:#f1f5f9;border-radius:8px;text-decoration:none;color:#475569;font-size:0.9rem;border:1px solid #e2e8f0}
nav a.active{background:#2563eb;color:#fff;border-color:#2563eb}</style>
</head><body>
${nav}
<h1>${l.title}</h1>
<p class="meta">${l.subject || 'General'} | Grade ${l.grade || 'N/A'} | ${l.duration || 'N/A'} min</p>
${l.learningOutcomes?.length ? `<h2>Learning Outcomes</h2><ul>${l.learningOutcomes.map(o => `<li>${o.description || o}</li>`).join('')}</ul>` : ''}
${l.sections?.map(s => `<div class="card"><h3>${s.title}</h3><p class="meta">${s.type}</p><p>${s.content || ''}</p></div>`).join('') || ''}
${l.vocabulary?.length ? `<h2>Vocabulary</h2><ul>${l.vocabulary.map(v => `<li>${v}</li>`).join('')}</ul>` : ''}
</body></html>`;
  }

  #renderAssessmentPage(pkg) {
    const a = pkg.assessment;
    const nav = this.#buildNavHTML(pkg);
    return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Assessment - ${pkg.lesson?.title || pkg.title}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.7;max-width:800px;margin:0 auto;padding:24px;color:#1a1a1a}
h1{font-size:2rem;border-bottom:2px solid #2563eb;padding-bottom:12px}
h2{font-size:1.4rem;margin-top:32px;color:#2563eb}
.meta{color:#64748b;font-size:0.85rem}nav{display:flex;gap:8px;margin:20px 0;flex-wrap:wrap}
nav a{padding:8px 16px;background:#f1f5f9;border-radius:8px;text-decoration:none;color:#475569;font-size:0.9rem;border:1px solid #e2e8f0}
nav a.active{background:#2563eb;color:#fff;border-color:#2563eb}
ol{padding-left:1.2rem}li{margin:12px 0;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px}
.options{color:#64748b;font-size:0.85rem;margin-top:6px}</style>
</head><body>
${nav}
<h1>Assessment</h1>
<p class="meta">${a.questionCount || a.questions?.length || 0} questions | ${a.totalPoints || 0} points | Passing: ${a.passingScore || 0}</p>
<ol>${(a.questions || []).map(q => `<li><p><strong>${q.prompt}</strong></p>
${q.options ? `<p class="options">${q.options.join(' | ')}</p>` : ''}
<p class="meta">${q.type} | ${q.difficulty || 'N/A'} | Bloom: ${q.bloomLevel || 'N/A'}</p></li>`).join('')}</ol>
</body></html>`;
  }

  #renderGuidePage(pkg) {
    const g = pkg.teacherGuide;
    const nav = this.#buildNavHTML(pkg);
    return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Teacher Guide - ${pkg.lesson?.title || pkg.title}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.7;max-width:800px;margin:0 auto;padding:24px;color:#1a1a1a}
h1{font-size:2rem;border-bottom:2px solid #2563eb;padding-bottom:12px}
h2{font-size:1.4rem;margin-top:32px;color:#2563eb}
.meta{color:#64748b;font-size:0.85rem}nav{display:flex;gap:8px;margin:20px 0;flex-wrap:wrap}
nav a{padding:8px 16px;background:#f1f5f9;border-radius:8px;text-decoration:none;color:#475569;font-size:0.9rem;border:1px solid #e2e8f0}
nav a.active{background:#2563eb;color:#fff;border-color:#2563eb}
table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #e2e8f0;padding:10px;text-align:left}
th{background:#f1f5f9;font-weight:600}</style>
</head><body>
${nav}
<h1>Teacher Guide</h1>
${g.objectives?.length ? `<h2>Objectives</h2><ul>${g.objectives.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
${g.vocabulary?.length ? `<h2>Vocabulary</h2><ul>${g.vocabulary.map(v => `<li>${v}</li>`).join('')}</ul>` : ''}
${g.materials?.length ? `<h2>Materials</h2><ul>${g.materials.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
${g.discussionPrompts?.length ? `<h2>Discussion</h2><ul>${g.discussionPrompts.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
${g.timingGuide?.length ? `<h2>Timing</h2><table><tr><th>Section</th><th>Duration</th><th>Activity</th></tr>${g.timingGuide.map(t => `<tr><td>${t.section}</td><td>${t.duration} min</td><td>${t.activity}</td></tr>`).join('')}</table>` : ''}
</body></html>`;
  }

  #renderWorkbookPage(pkg) {
    const w = pkg.workbook;
    const nav = this.#buildNavHTML(pkg);
    return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Workbook - ${pkg.lesson?.title || pkg.title}</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.7;max-width:800px;margin:0 auto;padding:24px;color:#1a1a1a}
h1{font-size:2rem;border-bottom:2px solid #2563eb;padding-bottom:12px}
h2{font-size:1.4rem;margin-top:32px;color:#2563eb}
.meta{color:#64748b;font-size:0.85rem}nav{display:flex;gap:8px;margin:20px 0;flex-wrap:wrap}
nav a{padding:8px 16px;background:#f1f5f9;border-radius:8px;text-decoration:none;color:#475569;font-size:0.9rem;border:1px solid #e2e8f0}
nav a.active{background:#2563eb;color:#fff;border-color:#2563eb}
.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0}</style>
</head><body>
${nav}
<h1>Workbook</h1>
<p class="meta">${w.totalPages || w.pages?.length || 0} pages | ${w.totalPoints || 0} points</p>
${(w.pages || []).map(p => `<div class="card"><h3>${p.title}</h3>
${(p.questions || []).map(q => `<p><strong>${q.prompt}</strong> <span class="meta">(${q.type}, ${q.points || 0} pts)</span></p>`).join('')}</div>`).join('')}
</body></html>`;
  }

  // ─── MDX Renderers ────────────────────────────────

  #renderLessonMDX(pkg) {
    const l = pkg.lesson;
    return `---
title: "${l.title}"
subject: "${l.subject || 'General'}"
grade: "${l.grade || 'N/A'}"
duration: "${l.duration || 'N/A'} min"
---

# ${l.title}

${l.learningOutcomes?.length ? `## Learning Outcomes\n\n${l.learningOutcomes.map(o => `- ${o.description || o}`).join('\n')}` : ''}

${l.sections?.map(s => `## ${s.title}\n\n*${s.type}*\n\n${s.content || ''}`).join('\n\n') || ''}

${l.vocabulary?.length ? `## Vocabulary\n\n${l.vocabulary.map(v => `- ${v}`).join('\n')}` : ''}
`;
  }

  #renderAssessmentMDX(pkg) {
    const a = pkg.assessment;
    return `---
title: "Assessment"
questions: ${a.questionCount || a.questions?.length || 0}
points: ${a.totalPoints || 0}
---

# Assessment

${(a.questions || []).map((q, i) => `### Q${i + 1}. ${q.prompt}\n\n*${q.type} | ${q.difficulty || 'N/A'}*\n\n${q.options ? q.options.map(o => `- ${o}`).join('\n') : ''}`).join('\n\n')}
`;
  }

  #renderGuideMDX(pkg) {
    const g = pkg.teacherGuide;
    return `---
title: "Teacher Guide"
---

# Teacher Guide

${g.objectives?.length ? `## Objectives\n\n${g.objectives.map(o => `- ${o}`).join('\n')}` : ''}

${g.materials?.length ? `## Materials\n\n${g.materials.map(m => `- ${m}`).join('\n')}` : ''}

${g.discussionPrompts?.length ? `## Discussion\n\n${g.discussionPrompts.map(d => `- ${d}`).join('\n')}` : ''}
`;
  }

  #renderWorkbookMDX(pkg) {
    const w = pkg.workbook;
    return `---
title: "Workbook"
pages: ${w.totalPages || w.pages?.length || 0}
points: ${w.totalPoints || 0}
---

# Workbook

${(w.pages || []).map(p => `## ${p.title}\n\n${(p.questions || []).map(q => `- ${q.prompt} *(${q.type}, ${q.points || 0} pts)*`).join('\n')}`).join('\n\n')}
`;
  }

  // ─── Navigation & SEO ────────────────────────────

  #buildNav(pages) {
    return pages.map(p => ({ path: p.path, label: p.title, type: p.type }));
  }

  #buildNavHTML(pkg) {
    const items = [
      { path: 'index.html', label: 'Lesson' },
      { path: 'assessment.html', label: 'Assessment' },
      { path: 'guide.html', label: 'Guide' },
      { path: 'workbook.html', label: 'Workbook' },
    ];
    return `<nav>${items.map(n => `<a href="${n.path}">${n.label}</a>`).join('')}</nav>`;
  }

  #buildSEO(pkg) {
    const title = pkg.lesson?.title || pkg.title;
    return {
      title: `${title} - Knowledge Studio`,
      description: pkg.description || pkg.lesson?.learningOutcomes?.[0]?.description || title,
      keywords: [pkg.subject, pkg.domain, `grade ${pkg.gradeLevel}`, 'education', 'lesson'].filter(Boolean),
      og: { title, type: 'article', description: pkg.description || title },
    };
  }

  #buildStructuredData(pkg) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: pkg.lesson?.title || pkg.title,
      description: pkg.description,
      educationalLevel: `Grade ${pkg.gradeLevel || 'N/A'}`,
      about: { '@type': 'Thing', name: pkg.subject || pkg.domain },
      learningResourceType: 'Lesson Plan',
      provider: { '@type': 'Organization', name: 'Bhavya Foundation' },
    };
  }

  #buildSitemap(pkg, pages) {
    const base = `https://knowledge.bhavyafoundation.org/${pkg.id}`;
    const urls = pages.map(p => `${base}/${p.path}`);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
  }

  #buildRSS(pkg, pages) {
    const items = pages.map(p => `    <item>
      <title>${p.title} - ${pkg.lesson?.title || pkg.title}</title>
      <link>https://knowledge.bhavyafoundation.org/${pkg.id}/${p.path}</link>
      <description>${pkg.description || pkg.title}</description>
      <pubDate>${pkg.createdAt}</pubDate>
    </item>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Knowledge Studio - ${pkg.title}</title>
  <link>https://knowledge.bhavyafoundation.org/${pkg.id}</link>
  <description>${pkg.description}</description>
${items}
</channel></rss>`;
  }

  // ─── Search Indexing ────────────────────────────────

  #indexContent(section, data, type) {
    const entries = [];
    if (data.title) entries.push({ section, type, title: data.title, content: data.title, boost: 2 });
    if (data.sections) {
      for (const s of data.sections) {
        entries.push({ section, type, title: s.title, content: `${s.title} ${s.content || ''}`, boost: 1 });
      }
    }
    if (data.questions) {
      for (const q of data.questions) {
        entries.push({ section, type, title: q.prompt?.slice(0, 60), content: q.prompt, boost: 0.5 });
      }
    }
    if (data.objectives) {
      for (const o of data.objectives) {
        entries.push({ section, type, title: o?.slice(0, 60), content: o, boost: 0.8 });
      }
    }
    return entries;
  }
}
