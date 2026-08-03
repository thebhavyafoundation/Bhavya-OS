/**
 * Search Engine — full-text, semantic, knowledge graph traversal, capability-aware.
 */
export class SearchEngine {
  constructor() {
    this.index = new Map();
    this.knowledgeGraph = new Map(); // entity → relationships
  }

  /** Index a Knowledge Package */
  indexPackage(pkg) {
    const entries = [];

    // Index all text content
    for (const section of ['lesson', 'assessment', 'teacherGuide', 'workbook']) {
      const data = pkg[section];
      if (!data) continue;

      if (data.title) entries.push(this.#entry(pkg.id, section, 'title', data.title, 3));
      if (data.sections) data.sections.forEach(s => {
        entries.push(this.#entry(pkg.id, section, 'heading', s.title, 2));
        if (s.content) entries.push(this.#entry(pkg.id, section, 'content', s.content, 1));
      });
      if (data.questions) data.questions.forEach(q => {
        entries.push(this.#entry(pkg.id, section, 'question', q.prompt, 1.5));
        if (q.options) q.options.forEach(o => entries.push(this.#entry(pkg.id, section, 'option', o, 0.5)));
      });
      if (data.objectives) data.objectives.forEach(o => entries.push(this.#entry(pkg.id, section, 'objective', o, 1.2)));
      if (data.vocabulary) data.vocabulary.forEach(v => entries.push(this.#entry(pkg.id, section, 'vocabulary', v, 1.5)));
      if (data.materials) data.materials.forEach(m => entries.push(this.#entry(pkg.id, section, 'material', m, 1)));
      if (data.discussionPrompts) data.discussionPrompts.forEach(d => entries.push(this.#entry(pkg.id, section, 'discussion', d, 1)));
    }

    // Index metadata
    if (pkg.title) entries.push(this.#entry(pkg.id, 'meta', 'title', pkg.title, 4));
    if (pkg.description) entries.push(this.#entry(pkg.id, 'meta', 'description', pkg.description, 2));
    if (pkg.subject) entries.push(this.#entry(pkg.id, 'meta', 'subject', pkg.subject, 1.5));
    if (pkg.domain) entries.push(this.#entry(pkg.id, 'meta', 'domain', pkg.domain, 1));

    // Add to knowledge graph
    this.knowledgeGraph.set(pkg.id, {
      title: pkg.title, domain: pkg.domain, subject: pkg.subject,
      gradeLevel: pkg.gradeLevel, artifacts: ['lesson', 'assessment', 'teacherGuide', 'workbook'].filter(s => pkg[s]),
      provenance: pkg.getProvenanceChain().map(p => p.capabilityId),
    });

    this.index.set(pkg.id, entries);
    return entries.length;
  }

  /** Full-text search */
  search(query, opts = {}) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = [];

    for (const [pkgId, entries] of this.index) {
      let score = 0;
      const matches = [];

      for (const entry of entries) {
        const text = entry.text.toLowerCase();
        let entryScore = 0;
        for (const term of terms) {
          if (text.includes(term)) {
            entryScore += entry.boost * (text.startsWith(term) ? 2 : 1);
          }
        }
        if (entryScore > 0) { score += entryScore; matches.push({ section: entry.section, type: entry.type, text: entry.text.slice(0, 100), score: entryScore }); }
      }

      if (score > 0) results.push({ packageId: pkgId, score, matches: matches.slice(0, 5), ...this.knowledgeGraph.get(pkgId) });
    }

    results.sort((a, b) => b.score - a.score);
    if (opts.limit) results.length = opts.limit;
    return results;
  }

  /** Capability-aware search — find packages that used specific capabilities */
  searchByCapability(capabilityId) {
    const results = [];
    for (const [pkgId, graph] of this.knowledgeGraph) {
      if (graph.provenance?.includes(capabilityId)) results.push({ packageId: pkgId, ...graph });
    }
    return results;
  }

  /** Knowledge graph traversal — find related packages */
  getRelated(packageId, depth = 1) {
    const graph = this.knowledgeGraph.get(packageId);
    if (!graph) return [];
    const related = [];
    for (const [id, data] of this.knowledgeGraph) {
      if (id === packageId) continue;
      const similarity = this.#similarity(graph, data);
      if (similarity > 0) related.push({ packageId: id, similarity, ...data });
    }
    related.sort((a, b) => b.similarity - a.similarity);
    return related.slice(0, depth * 5);
  }

  /** Domain search */
  searchByDomain(domain) {
    const results = [];
    for (const [pkgId, data] of this.knowledgeGraph) {
      if (data.domain === domain) results.push({ packageId: pkgId, ...data });
    }
    return results;
  }

  /** Get search index for a package (for static export) */
  getIndex(packageId) {
    return this.index.get(packageId) || [];
  }

  /** Get full search index (for static export) */
  getFullIndex() {
    const all = [];
    for (const entries of this.index.values()) all.push(...entries);
    return all;
  }

  #entry(pkgId, section, type, text, boost) {
    return { pkgId, section, type, text, boost };
  }

  #similarity(a, b) {
    let score = 0;
    if (a.domain === b.domain) score += 0.5;
    if (a.subject === b.subject) score += 0.3;
    const aArts = new Set(a.artifacts);
    const bArts = new Set(b.artifacts);
    const overlap = [...aArts].filter(x => bArts.has(x)).length;
    score += (overlap / Math.max(aArts.size, bArts.size)) * 0.2;
    return score;
  }
}
