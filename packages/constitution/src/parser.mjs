/**
 * Constitution Parser — Extracts structured data from document content
 * 
 * Parses markdown content into structured sections, articles, definitions,
 * policies, responsibilities, and other constitutional elements.
 */

/**
 * Parse a constitutional document into structured sections
 * @param {string} content - Markdown content
 * @returns {Object} Parsed document structure
 */
export function parseDocument(content) {
  const sections = extractSections(content);
  const articles = extractArticles(content);
  const definitions = extractDefinitions(content);
  const policies = extractPolicies(content);
  const responsibilities = extractResponsibilities(content);
  const principles = extractPrinciples(content);
  const procedures = extractProcedures(content);

  return {
    sections,
    articles,
    definitions,
    policies,
    responsibilities,
    principles,
    procedures,
    metadata: {
      totalSections: sections.length,
      totalArticles: articles.length,
      totalDefinitions: definitions.length,
      totalPolicies: policies.length,
      totalResponsibilities: responsibilities.length,
      totalPrinciples: principles.length,
      totalProcedures: procedures.length
    }
  };
}

/**
 * Extract top-level sections from markdown
 */
export function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match ## headings as sections
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      if (currentSection) {
        currentSection.endLine = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: match[1].trim(),
        startLine: i,
        endLine: null,
        level: 2
      };
    }
  }

  if (currentSection) {
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extract articles (numbered provisions)
 */
export function extractArticles(content) {
  const articles = [];
  const articleRegex = /(?:^|\n)(?:Article\s+(\d+(?:\.\d+)?)\s*[:\.]?\s*(.+?)(?:\n|$)|(\d+(?:\.\d+)?)\.\s+(.+?)(?:\n|$))/g;
  let match;

  while ((match = articleRegex.exec(content)) !== null) {
    const number = match[1] || match[3];
    const title = (match[2] || match[4]).trim();
    
    // Extract content until next article
    const startIdx = match.index + match[0].length;
    const nextArticleMatch = content.slice(startIdx).match(/(?:Article\s+\d+|^\d+\.\d+\s)/m);
    const endIdx = nextArticleMatch ? startIdx + nextArticleMatch.index : content.length;
    const articleContent = content.slice(startIdx, endIdx).trim();

    articles.push({
      number,
      title,
      content: articleContent,
      lineIndex: content.slice(0, match.index).split('\n').length
    });
  }

  return articles;
}

/**
 * Extract definitions (defined terms)
 */
export function extractDefinitions(content) {
  const definitions = [];
  const defPatterns = [
    /['"]([^'"]+)['"]\s*(?:means|refers to|is defined as)\s+(.+?)(?:\n|$)/gi,
    /^(\d+(?:\.\d+)?)\.\s*['"]([^'"]+)['"]\s*[:—]\s*(.+?)(?:\n|$)/gm,
    /\*\*([^*]+)\*\*\s*[:—]\s*(.+?)(?:\n|$)/g
  ];

  for (const pattern of defPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const term = match[1] || match[2];
      const definition = (match[2] || match[3]).trim();
      
      if (term && definition && definition.length > 10) {
        definitions.push({
          term: term.replace(/^['"]|['"]$/g, ''),
          definition: definition.replace(/^['"]|['"]$/g, ''),
          lineIndex: content.slice(0, match.index).split('\n').length
        });
      }
    }
  }

  // Deduplicate by term
  const seen = new Set();
  return definitions.filter(def => {
    const key = def.term.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Extract policies (rules and requirements)
 */
export function extractPolicies(content) {
  const policies = [];
  const policyKeywords = [
    'must', 'shall', 'required', 'mandatory', 'prohibited',
    'not permitted', 'not allowed', 'forbidden', 'obligation'
  ];

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length < 20) continue;

    const lowerLine = line.toLowerCase();
    const matchedKeyword = policyKeywords.find(kw => lowerLine.includes(kw));
    
    if (matchedKeyword) {
      // Get surrounding context
      const contextStart = Math.max(0, i - 1);
      const contextEnd = Math.min(lines.length - 1, i + 1);
      const context = lines.slice(contextStart, contextEnd + 1).join(' ').trim();

      policies.push({
        statement: line,
        keyword: matchedKeyword,
        context,
        lineNumber: i + 1,
        confidence: calculatePolicyConfidence(line, matchedKeyword)
      });
    }
  }

  // Sort by confidence and return top policies
  return policies
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 100);
}

/**
 * Calculate confidence score for a policy statement
 */
function calculatePolicyConfidence(line, keyword) {
  let score = 0.5;
  
  // Stronger keywords get higher scores
  if (['must', 'shall', 'mandatory', 'prohibited'].includes(keyword)) {
    score += 0.3;
  } else if (['required', 'not permitted', 'forbidden'].includes(keyword)) {
    score += 0.2;
  }

  // Longer, more specific statements are more likely to be policies
  if (line.length > 50) score += 0.1;
  if (line.length > 100) score += 0.1;

  return Math.min(1.0, score);
}

/**
 * Extract responsibilities and duties
 */
export function extractResponsibilities(content) {
  const responsibilities = [];
  const respPatterns = [
    /(?:shall|must|is responsible for|is responsible to)\s+(.+?)(?:\.|$)/gi,
    /(?:responsibilities|duties|obligations)\s*(?:include|are|include)\s*(.+?)(?:\.|$)/gi,
    /(?:trustee|officer|employee|volunteer|partner)\s+(?:shall|must|is expected to)\s+(.+?)(?:\.|$)/gi
  ];

  for (const pattern of respPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const statement = match[0].trim();
      if (statement.length > 20) {
        responsibilities.push({
          statement,
          lineIndex: content.slice(0, match.index).split('\n').length
        });
      }
    }
  }

  return responsibilities;
}

/**
 * Extract principles and values
 */
export function extractPrinciples(content) {
  const principles = [];
  const principlePatterns = [
    /(?:core values?|principles?|beliefs?|ethics?)\s*[:—]\s*(.+?)(?:\n|$)/gi,
    /(?:we believe|we are committed to|we uphold)\s+(.+?)(?:\.|$)/gi,
    /\*\*([^*]+)\*\*\s*[:—]\s*(.+?)(?:\n|$)/g
  ];

  for (const pattern of principlePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const principle = match[1] || match[2];
      if (principle && principle.length > 10) {
        principles.push({
          statement: principle.trim(),
          lineIndex: content.slice(0, match.index).split('\n').length
        });
      }
    }
  }

  return principles;
}

/**
 * Extract procedures and processes
 */
export function extractProcedures(content) {
  const procedures = [];
  const procedurePatterns = [
    /(?:step\s+\d+|procedure|process|workflow)\s*[:—]?\s*(.+?)(?:\n|$)/gi,
    /(?:1\)|1\.|a\))\s+(.+?)(?:\n|$)/gi
  ];

  for (const pattern of procedurePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const step = match[1] || match[0];
      if (step.length > 10) {
        procedures.push({
          step: step.trim(),
          lineIndex: content.slice(0, match.index).split('\n').length
        });
      }
    }
  }

  return procedures;
}

/**
 * Generate a summary of parsed content
 */
export function generateSummary(parsed) {
  const { metadata } = parsed;
  return {
    totalElements: Object.values(metadata).reduce((a, b) => a + b, 0),
    breakdown: metadata,
    topPolicies: parsed.policies.slice(0, 10).map(p => p.statement),
    keyDefinitions: parsed.definitions.slice(0, 10).map(d => d.term),
    principles: parsed.principles.slice(0, 5).map(p => p.statement)
  };
}

export default {
  parseDocument,
  extractSections,
  extractArticles,
  extractDefinitions,
  extractPolicies,
  extractResponsibilities,
  extractPrinciples,
  extractProcedures,
  generateSummary
};
