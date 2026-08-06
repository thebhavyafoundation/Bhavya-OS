/**
 * Autonomous Code Review
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Review every change:
 * - Architecture
 * - Style
 * - Performance
 * - Security
 * - Maintainability
 * - Accessibility
 * - Documentation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface CodeReview {
  id: string;
  repositoryId: string;
  changeId: string;
  timestamp: string;
  summary: ReviewSummary;
  architecture: ReviewCategory;
  style: ReviewCategory;
  performance: ReviewCategory;
  security: ReviewCategory;
  maintainability: ReviewCategory;
  accessibility: ReviewCategory;
  documentation: ReviewCategory;
  score: number;
  verdict: 'approve' | 'request-changes' | 'comment';
}

export interface ReviewSummary {
  filesChanged: number;
  additions: number;
  deletions: number;
  issues: number;
  suggestions: number;
}

export interface ReviewCategory {
  score: number;
  issues: ReviewIssue[];
  suggestions: ReviewSuggestion[];
}

export interface ReviewIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  file: string;
  line?: number;
  message: string;
  rule: string;
  fix?: string;
}

export interface ReviewSuggestion {
  id: string;
  type: 'improvement' | 'optimization' | 'best-practice';
  file: string;
  line?: number;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export class AutonomousCodeReview {
  private reviews: Map<string, CodeReview> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadReviews();
  }

  private loadReviews(): void {
    const reviewsFile = join(this.dataDir, 'code-reviews.json');
    if (existsSync(reviewsFile)) {
      const data = JSON.parse(readFileSync(reviewsFile, 'utf-8'));
      for (const [id, review] of Object.entries(data)) {
        this.reviews.set(id, review as CodeReview);
      }
    }
  }

  private saveReviews(): void {
    const data: Record<string, CodeReview> = {};
    for (const [id, review] of this.reviews) {
      data[id] = review;
    }
    writeFileSync(join(this.dataDir, 'code-reviews.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Review code change
   */
  async reviewChange(repositoryId: string, changeId: string, files: { path: string; content: string }[]): Promise<CodeReview> {
    const review: CodeReview = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      changeId,
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(files),
      architecture: await this.reviewArchitecture(files),
      style: await this.reviewStyle(files),
      performance: await this.reviewPerformance(files),
      security: await this.reviewSecurity(files),
      maintainability: await this.reviewMaintainability(files),
      accessibility: await this.reviewAccessibility(files),
      documentation: await this.reviewDocumentation(files),
      score: 0,
      verdict: 'comment'
    };

    review.score = this.calculateScore(review);
    review.verdict = review.score >= 80 ? 'approve' : review.score >= 60 ? 'comment' : 'request-changes';

    this.reviews.set(review.id, review);
    this.saveReviews();
    return review;
  }

  private generateSummary(files: { path: string; content: string }[]): ReviewSummary {
    let additions = 0;
    let deletions = 0;

    for (const file of files) {
      const lines = file.content.split('\n');
      for (const line of lines) {
        if (line.startsWith('+')) additions++;
        if (line.startsWith('-')) deletions++;
      }
    }

    return {
      filesChanged: files.length,
      additions,
      deletions,
      issues: 0,
      suggestions: 0
    };
  }

  private async reviewArchitecture(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      if (file.content.includes('import') && file.content.length > 10000) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity: 'warning',
          file: file.path,
          message: 'Large file with many imports - consider splitting',
          rule: 'architecture/size',
          fix: 'Split into smaller modules'
        });
      }

      if (file.content.includes('any') && file.path.endsWith('.ts')) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'best-practice',
          file: file.path,
          message: 'Consider using specific types instead of "any"',
          impact: 'medium'
        });
      }
    }

    const score = Math.max(0, 100 - issues.length * 10);
    return { score, issues, suggestions };
  }

  private async reviewStyle(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.length > 120) {
          issues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            severity: 'warning',
            file: file.path,
            line: index + 1,
            message: 'Line exceeds 120 characters',
            rule: 'style/line-length'
          });
        }

        if (line.includes('\t') && line.includes('  ')) {
          issues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            severity: 'info',
            file: file.path,
            line: index + 1,
            message: 'Mixed tabs and spaces',
            rule: 'style/indentation'
          });
        }
      });
    }

    const score = Math.max(0, 100 - issues.length * 5);
    return { score, issues, suggestions };
  }

  private async reviewPerformance(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      if (file.content.includes('useEffect') && !file.content.includes('cleanup')) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'optimization',
          file: file.path,
          message: 'useEffect without cleanup may cause memory leaks',
          impact: 'medium'
        });
      }

      if (file.content.includes('JSON.parse') && file.content.includes('forEach')) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'optimization',
          file: file.path,
          message: 'Consider caching parsed JSON',
          impact: 'low'
        });
      }
    }

    const score = Math.max(0, 100 - issues.length * 10);
    return { score, issues, suggestions };
  }

  private async reviewSecurity(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      if (file.content.includes('eval(')) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity: 'error',
          file: file.path,
          message: 'eval() is a security risk',
          rule: 'security/eval',
          fix: 'Remove eval() usage'
        });
      }

      if (file.content.includes('innerHTML') && !file.content.includes('sanitize')) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity: 'warning',
          file: file.path,
          message: 'innerHTML without sanitization may cause XSS',
          rule: 'security/xss',
          fix: 'Sanitize input before setting innerHTML'
        });
      }

      if (file.content.includes('API_KEY') || file.content.includes('SECRET')) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity: 'error',
          file: file.path,
          message: 'Potential secret in code',
          rule: 'security/secrets',
          fix: 'Move to environment variables'
        });
      }
    }

    const score = Math.max(0, 100 - issues.length * 15);
    return { score, issues, suggestions };
  }

  private async reviewMaintainability(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      const functions = lines.filter(l => l.includes('function') || l.includes('=>'));
      
      if (functions.length > 20) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'improvement',
          file: file.path,
          message: 'File has many functions - consider splitting',
          impact: 'medium'
        });
      }

      if (file.content.includes('TODO') || file.content.includes('FIXME')) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          severity: 'info',
          file: file.path,
          message: 'Unresolved TODO/FIXME',
          rule: 'maintainability/todo'
        });
      }
    }

    const score = Math.max(0, 100 - issues.length * 5);
    return { score, issues, suggestions };
  }

  private async reviewAccessibility(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      if (file.path.endsWith('.tsx') || file.path.endsWith('.jsx')) {
        if (file.content.includes('<img') && !file.content.includes('alt=')) {
          issues.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            severity: 'warning',
            file: file.path,
            message: 'Image without alt attribute',
            rule: 'accessibility/alt',
            fix: 'Add alt attribute to image'
          });
        }

        if (file.content.includes('onClick') && !file.content.includes('onKeyDown')) {
          suggestions.push({
            id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'best-practice',
            file: file.path,
            message: 'Consider adding keyboard event handler',
            impact: 'medium'
          });
        }
      }
    }

    const score = Math.max(0, 100 - issues.length * 10);
    return { score, issues, suggestions };
  }

  private async reviewDocumentation(files: { path: string; content: string }[]): Promise<ReviewCategory> {
    const issues: ReviewIssue[] = [];
    const suggestions: ReviewSuggestion[] = [];

    for (const file of files) {
      if (file.path.endsWith('.ts') || file.path.endsWith('.tsx')) {
        const exports = file.content.match(/export\s+(function|class|const|interface)\s+(\w+)/g);
        if (exports && exports.length > 0) {
          const documented = file.content.match(/\/\*\*[\s\S]*?\*\//g);
          if (!documented || documented.length < exports.length / 2) {
            suggestions.push({
              id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'improvement',
              file: file.path,
              message: 'Consider adding JSDoc comments to exports',
              impact: 'low'
            });
          }
        }
      }
    }

    const score = Math.max(0, 100 - issues.length * 5);
    return { score, issues, suggestions };
  }

  private calculateScore(review: CodeReview): number {
    const weights = {
      architecture: 0.2,
      style: 0.1,
      performance: 0.15,
      security: 0.25,
      maintainability: 0.15,
      accessibility: 0.05,
      documentation: 0.1
    };

    return Math.round(
      review.architecture.score * weights.architecture +
      review.style.score * weights.style +
      review.performance.score * weights.performance +
      review.security.score * weights.security +
      review.maintainability.score * weights.maintainability +
      review.accessibility.score * weights.accessibility +
      review.documentation.score * weights.documentation
    );
  }

  /**
   * Get review
   */
  getReview(id: string): CodeReview | undefined {
    return this.reviews.get(id);
  }

  /**
   * Get all reviews
   */
  getAllReviews(): CodeReview[] {
    return Array.from(this.reviews.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalReviews: number;
    avgScore: number;
    approvals: number;
    changesRequested: number;
    comments: number;
  } {
    const reviews = Array.from(this.reviews.values());
    return {
      totalReviews: reviews.length,
      avgScore: reviews.length > 0 ? Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) : 0,
      approvals: reviews.filter(r => r.verdict === 'approve').length,
      changesRequested: reviews.filter(r => r.verdict === 'request-changes').length,
      comments: reviews.filter(r => r.verdict === 'comment').length
    };
  }
}

// Singleton instance
let instance: AutonomousCodeReview | null = null;

export function getAutonomousCodeReview(dataDir: string): AutonomousCodeReview {
  if (!instance) {
    instance = new AutonomousCodeReview(dataDir);
  }
  return instance;
}
