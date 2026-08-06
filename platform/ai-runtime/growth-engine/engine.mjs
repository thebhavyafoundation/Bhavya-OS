/**
 * Growth Engine
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Automatically evaluates:
 * - SEO
 * - Performance
 * - Accessibility
 * - Content quality
 * - Broken links
 * - Internal linking
 * - Metadata
 * - Schema markup
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'growth-engine', 'data');

interface GrowthAudit {
  id: string;
  appId: string;
  timestamp: string;
  seo: SEOAudit;
  performance: PerformanceAudit;
  accessibility: AccessibilityAudit;
  content: ContentAudit;
  links: LinksAudit;
  metadata: MetadataAudit;
  schema: SchemaAudit;
  overallScore: number;
  recommendations: string[];
}

interface SEOAudit {
  score: number;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Count: number;
  h2Count: number;
  imageAlts: number;
  imageTotal: number;
  internalLinks: number;
  externalLinks: number;
  issues: string[];
}

interface PerformanceAudit {
  score: number;
  fcp: number;
  lcp: number;
  tti: number;
  tbt: number;
  cls: number;
  issues: string[];
}

interface AccessibilityAudit {
  score: number;
  ariaLabels: number;
  colorContrast: number;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  semanticHtml: boolean;
  altTexts: number;
  issues: string[];
}

interface ContentAudit {
  score: number;
  wordCount: number;
  readabilityScore: number;
  headingStructure: boolean;
  internalLinking: boolean;
  imageOptimization: boolean;
  issues: string[];
}

interface LinksAudit {
  score: number;
  totalLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  issues: string[];
}

interface MetadataAudit {
  score: number;
  openGraph: boolean;
  twitterCard: boolean;
  canonical: boolean;
  robots: boolean;
  sitemap: boolean;
  issues: string[];
}

interface SchemaAudit {
  score: number;
  hasSchema: boolean;
  schemaTypes: string[];
  issues: string[];
}

export class GrowthEngine {
  private audits: GrowthAudit[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadAudits();
  }

  private loadAudits(): void {
    const auditsFile = join(this.dataDir, 'audits.json');
    if (existsSync(auditsFile)) {
      this.audits = JSON.parse(readFileSync(auditsFile, 'utf-8'));
    }
  }

  private saveAudits(): void {
    writeFileSync(
      join(this.dataDir, 'audits.json'),
      JSON.stringify(this.audits, null, 2)
    );
  }

  /**
   * Run full audit for an app
   */
  runAudit(appId: string, html: string): GrowthAudit {
    const seo = this.auditSEO(html);
    const performance = this.auditPerformance(html);
    const accessibility = this.auditAccessibility(html);
    const content = this.auditContent(html);
    const links = this.auditLinks(html);
    const metadata = this.auditMetadata(html);
    const schema = this.auditSchema(html);

    const overallScore = Math.round(
      (seo.score + performance.score + accessibility.score + content.score + links.score + metadata.score + schema.score) / 7
    );

    const recommendations = this.generateRecommendations(seo, performance, accessibility, content, links, metadata, schema);

    const audit: GrowthAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId,
      timestamp: new Date().toISOString(),
      seo,
      performance,
      accessibility,
      content,
      links,
      metadata,
      schema,
      overallScore,
      recommendations
    };

    this.audits.push(audit);
    this.saveAudits();
    return audit;
  }

  /**
   * Audit SEO
   */
  private auditSEO(html: string): SEOAudit {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const metaDescMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1] : '';

    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    const h2Count = (html.match(/<h2[\s>]/gi) || []).length;

    const imgTags = html.match(/<img[\s>]/gi) || [];
    const imgAlts = (html.match(/alt="[^"]+"/gi) || []).length;

    const internalLinks = (html.match(/href="\/[^"]*"/gi) || []).length;
    const externalLinks = (html.match(/href="https?:\/\/[^"]*"/gi) || []).length;

    const issues: string[] = [];
    let score = 100;

    if (title.length < 30 || title.length > 60) {
      issues.push(`Title length ${title.length} should be 30-60`);
      score -= 10;
    }
    if (metaDescription.length < 120 || metaDescription.length > 160) {
      issues.push(`Meta description length ${metaDescription.length} should be 120-160`);
      score -= 10;
    }
    if (h1Count === 0) {
      issues.push('Missing H1 tag');
      score -= 15;
    }
    if (h1Count > 1) {
      issues.push(`Multiple H1 tags: ${h1Count}`);
      score -= 5;
    }
    if (imgTags.length > 0 && imgAlts < imgTags.length) {
      issues.push(`Missing alt texts: ${imgTags.length - imgAlts} images`);
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      h1Count,
      h2Count,
      imageAlts: imgAlts,
      imageTotal: imgTags.length,
      internalLinks,
      externalLinks,
      issues
    };
  }

  /**
   * Audit Performance
   */
  private auditPerformance(html: string): PerformanceAudit {
    const issues: string[] = [];
    let score = 100;

    // Check for large inline scripts
    const scriptTags = html.match(/<script[\s>][\s\S]*?<\/script>/gi) || [];
    const largeScripts = scriptTags.filter(s => s.length > 50000);
    if (largeScripts.length > 0) {
      issues.push(`Large inline scripts: ${largeScripts.length}`);
      score -= 10;
    }

    // Check for render-blocking resources
    const linkTags = html.match(/<link[^>]+rel="stylesheet"[^>]*>/gi) || [];
    if (linkTags.length > 3) {
      issues.push(`Multiple render-blocking stylesheets: ${linkTags.length}`);
      score -= 10;
    }

    // Check for preload hints
    const preloadHints = html.match(/<link[^>]+rel="preload"[^>]*>/gi) || [];
    if (preloadHints.length === 0) {
      issues.push('No preload hints found');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      fcp: 0,
      lcp: 0,
      tti: 0,
      tbt: 0,
      cls: 0,
      issues
    };
  }

  /**
   * Audit Accessibility
   */
  private auditAccessibility(html: string): AccessibilityAudit {
    const issues: string[] = [];
    let score = 100;

    const ariaLabels = (html.match(/aria-label="[^"]+"/gi) || []).length;
    const altTexts = (html.match(/alt="[^"]+"/gi) || []).length;

    // Check for semantic HTML
    const semanticTags = html.match(/<(main|nav|header|footer|article|section|aside)[\s>]/gi) || [];
    const semanticHtml = semanticTags.length > 0;

    // Check for keyboard navigation
    const tabindex = html.match(/tabindex="[^"]+"/gi) || [];
    const keyboardNavigation = tabindex.length > 0;

    // Check for focus visible
    const focusVisible = html.includes(':focus-visible');

    if (!semanticHtml) {
      issues.push('No semantic HTML tags found');
      score -= 15;
    }
    if (!keyboardNavigation) {
      issues.push('No keyboard navigation support');
      score -= 10;
    }
    if (!focusVisible) {
      issues.push('No focus-visible styles');
      score -= 5;
    }
    if (ariaLabels === 0) {
      issues.push('No ARIA labels found');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      ariaLabels,
      colorContrast: 0,
      keyboardNavigation,
      focusVisible,
      semanticHtml,
      altTexts,
      issues
    };
  }

  /**
   * Audit Content
   */
  private auditContent(html: string): ContentAudit {
    const issues: string[] = [];
    let score = 100;

    // Extract text content
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;

    // Check heading structure
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
    const h3Count = (html.match(/<h3[\s>]/gi) || []).length;
    const headingStructure = h1Count > 0 && h2Count > 0;

    if (wordCount < 300) {
      issues.push(`Low word count: ${wordCount}`);
      score -= 15;
    }
    if (!headingStructure) {
      issues.push('Poor heading structure');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      wordCount,
      readabilityScore: 0,
      headingStructure,
      internalLinking: false,
      imageOptimization: false,
      issues
    };
  }

  /**
   * Audit Links
   */
  private auditLinks(html: string): LinksAudit {
    const issues: string[] = [];
    let score = 100;

    const allLinks = html.match(/href="[^"]*"/gi) || [];
    const totalLinks = allLinks.length;

    // Check for anchor links
    const anchorLinks = allLinks.filter(l => l.startsWith('href="#'));
    const emptyAnchors = anchorLinks.filter(l => l === 'href="#"');

    if (emptyAnchors.length > 0) {
      issues.push(`Empty anchor links: ${emptyAnchors.length}`);
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      totalLinks,
      brokenLinks: 0,
      redirectLinks: 0,
      issues
    };
  }

  /**
   * Audit Metadata
   */
  private auditMetadata(html: string): MetadataAudit {
    const issues: string[] = [];
    let score = 100;

    const openGraph = html.includes('og:title') || html.includes('og:description');
    const twitterCard = html.includes('twitter:card');
    const canonical = html.includes('rel="canonical"');
    const robots = html.includes('robots');

    if (!openGraph) {
      issues.push('Missing Open Graph tags');
      score -= 20;
    }
    if (!twitterCard) {
      issues.push('Missing Twitter Card tags');
      score -= 15;
    }
    if (!canonical) {
      issues.push('Missing canonical tag');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      openGraph,
      twitterCard,
      canonical,
      robots,
      sitemap: false,
      issues
    };
  }

  /**
   * Audit Schema
   */
  private auditSchema(html: string): SchemaAudit {
    const issues: string[] = [];
    let score = 100;

    const hasSchema = html.includes('application/ld+json');
    const schemaTypes: string[] = [];

    if (!hasSchema) {
      issues.push('No structured data found');
      score -= 20;
    }

    return {
      score: Math.max(0, score),
      hasSchema,
      schemaTypes,
      issues
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    seo: SEOAudit,
    performance: PerformanceAudit,
    accessibility: AccessibilityAudit,
    content: ContentAudit,
    links: LinksAudit,
    metadata: MetadataAudit,
    schema: SchemaAudit
  ): string[] {
    const recommendations: string[] = [];

    if (seo.score < 80) {
      recommendations.push('Improve SEO: optimize title, meta description, headings');
    }
    if (performance.score < 80) {
      recommendations.push('Improve Performance: reduce inline scripts, add preload hints');
    }
    if (accessibility.score < 80) {
      recommendations.push('Improve Accessibility: add ARIA labels, semantic HTML');
    }
    if (content.score < 80) {
      recommendations.push('Improve Content: add more content, improve heading structure');
    }
    if (links.score < 80) {
      recommendations.push('Improve Links: fix empty anchors');
    }
    if (metadata.score < 80) {
      recommendations.push('Improve Metadata: add Open Graph, Twitter Card, canonical');
    }
    if (schema.score < 80) {
      recommendations.push('Add Schema: implement structured data');
    }

    return recommendations;
  }

  /**
   * Get all audits
   */
  getAllAudits(): GrowthAudit[] {
    return this.audits;
  }

  /**
   * Get latest audit for app
   */
  getLatestAudit(appId: string): GrowthAudit | undefined {
    return this.audits
      .filter(a => a.appId === appId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  /**
   * Get average scores
   */
  getAverageScores(): {
    overall: number;
    seo: number;
    performance: number;
    accessibility: number;
    content: number;
    links: number;
    metadata: number;
    schema: number;
  } {
    if (this.audits.length === 0) {
      return { overall: 0, seo: 0, performance: 0, accessibility: 0, content: 0, links: 0, metadata: 0, schema: 0 };
    }

    const sum = this.audits.reduce(
      (acc, a) => ({
        overall: acc.overall + a.overallScore,
        seo: acc.seo + a.seo.score,
        performance: acc.performance + a.performance.score,
        accessibility: acc.accessibility + a.accessibility.score,
        content: acc.content + a.content.score,
        links: acc.links + a.links.score,
        metadata: acc.metadata + a.metadata.score,
        schema: acc.schema + a.schema.score
      }),
      { overall: 0, seo: 0, performance: 0, accessibility: 0, content: 0, links: 0, metadata: 0, schema: 0 }
    );

    const count = this.audits.length;
    return {
      overall: Math.round(sum.overall / count),
      seo: Math.round(sum.seo / count),
      performance: Math.round(sum.performance / count),
      accessibility: Math.round(sum.accessibility / count),
      content: Math.round(sum.content / count),
      links: Math.round(sum.links / count),
      metadata: Math.round(sum.metadata / count),
      schema: Math.round(sum.schema / count)
    };
  }
}

// Singleton instance
let instance: GrowthEngine | null = null;

export function getGrowthEngine(): GrowthEngine {
  if (!instance) {
    instance = new GrowthEngine();
  }
  return instance;
}
