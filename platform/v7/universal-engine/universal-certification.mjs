/**
 * Universal Engineering Certification
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Generate:
 * - Maturity score
 * - Architecture score
 * - Health score
 * - Readiness score
 * - Security score
 * - Debt score
 * - Roadmap score
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Certification {
  id: string;
  repositoryId: string;
  timestamp: string;
  maturityScore: number;
  architectureScore: number;
  healthScore: number;
  readinessScore: number;
  securityScore: number;
  debtScore: number;
  roadmapScore: number;
  overallScore: number;
  grade: string;
  recommendations: string[];
}

export class UniversalCertification {
  private certifications: Map<string, Certification> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadCertifications();
  }

  private loadCertifications(): void {
    const certsFile = join(this.dataDir, 'certifications.json');
    if (existsSync(certsFile)) {
      const data = JSON.parse(readFileSync(certsFile, 'utf-8'));
      for (const [id, cert] of Object.entries(data)) {
        this.certifications.set(id, cert as Certification);
      }
    }
  }

  private saveCertifications(): void {
    const data: Record<string, Certification> = {};
    for (const [id, cert] of this.certifications) {
      data[id] = cert;
    }
    writeFileSync(join(this.dataDir, 'certifications.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Generate certification
   */
  async generateCertification(repositoryId: string, repoPath: string): Promise<Certification> {
    const certification: Certification = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repositoryId,
      timestamp: new Date().toISOString(),
      maturityScore: await this.calculateMaturityScore(repoPath),
      architectureScore: await this.calculateArchitectureScore(repoPath),
      healthScore: await this.calculateHealthScore(repoPath),
      readinessScore: await this.calculateReadinessScore(repoPath),
      securityScore: await this.calculateSecurityScore(repoPath),
      debtScore: await this.calculateDebtScore(repoPath),
      roadmapScore: await this.calculateRoadmapScore(repoPath),
      overallScore: 0,
      grade: '',
      recommendations: []
    };

    certification.overallScore = this.calculateOverallScore(certification);
    certification.grade = this.calculateGrade(certification.overallScore);
    certification.recommendations = this.generateRecommendations(certification);

    this.certifications.set(certification.id, certification);
    this.saveCertifications();
    return certification;
  }

  private async calculateMaturityScore(repoPath: string): Promise<number> {
    let score = 50;

    if (existsSync(join(repoPath, 'README.md'))) score += 10;
    if (existsSync(join(repoPath, 'package.json'))) score += 10;
    if (existsSync(join(repoPath, '.gitignore'))) score += 5;
    if (existsSync(join(repoPath, 'src'))) score += 10;
    if (existsSync(join(repoPath, 'tests'))) score += 10;
    if (existsSync(join(repoPath, '.github'))) score += 5;

    return Math.min(100, score);
  }

  private async calculateArchitectureScore(repoPath: string): Promise<number> {
    let score = 50;

    if (existsSync(join(repoPath, 'src', 'components'))) score += 15;
    if (existsSync(join(repoPath, 'src', 'utils'))) score += 10;
    if (existsSync(join(repoPath, 'src', 'services'))) score += 10;
    if (existsSync(join(repoPath, 'src', 'hooks'))) score += 10;
    if (existsSync(join(repoPath, 'src', 'types'))) score += 5;

    return Math.min(100, score);
  }

  private async calculateHealthScore(repoPath: string): Promise<number> {
    let score = 70;

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.scripts?.test) score += 10;
      if (pkg.scripts?.lint) score += 10;
      if (pkg.scripts?.build) score += 10;
    }

    return Math.min(100, score);
  }

  private async calculateReadinessScore(repoPath: string): Promise<number> {
    let score = 60;

    if (existsSync(join(repoPath, 'Dockerfile'))) score += 10;
    if (existsSync(join(repoPath, 'vercel.json'))) score += 10;
    if (existsSync(join(repoPath, '.github', 'workflows'))) score += 10;
    if (existsSync(join(repoPath, 'docker-compose.yml'))) score += 10;

    return Math.min(100, score);
  }

  private async calculateSecurityScore(repoPath: string): Promise<number> {
    let score = 70;

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.devDependencies?.eslint) score += 10;
      if (pkg.devDependencies?.prettier) score += 5;
      if (pkg.devDependencies?.husky) score += 5;
    }

    if (existsSync(join(repoPath, '.env.example'))) score += 10;

    return Math.min(100, score);
  }

  private async calculateDebtScore(repoPath: string): Promise<number> {
    let score = 80;

    const packageJsonPath = join(repoPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = Object.keys(pkg.dependencies || {}).length;
      if (deps > 30) score -= 10;
      if (deps > 50) score -= 20;
    }

    return Math.max(0, score);
  }

  private async calculateRoadmapScore(repoPath: string): Promise<number> {
    let score = 50;

    if (existsSync(join(repoPath, 'ROADMAP.md'))) score += 20;
    if (existsSync(join(repoPath, 'CHANGELOG.md'))) score += 15;
    if (existsSync(join(repoPath, 'CONTRIBUTING.md'))) score += 15;

    return Math.min(100, score);
  }

  private calculateOverallScore(cert: Certification): number {
    return Math.round(
      (cert.maturityScore * 0.2) +
      (cert.architectureScore * 0.2) +
      (cert.healthScore * 0.15) +
      (cert.readinessScore * 0.15) +
      (cert.securityScore * 0.15) +
      (cert.debtScore * 0.1) +
      (cert.roadmapScore * 0.05)
    );
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
  }

  private generateRecommendations(cert: Certification): string[] {
    const recommendations: string[] = [];

    if (cert.maturityScore < 70) recommendations.push('Add README and project documentation');
    if (cert.architectureScore < 70) recommendations.push('Create proper directory structure');
    if (cert.healthScore < 70) recommendations.push('Add testing and linting');
    if (cert.readinessScore < 70) recommendations.push('Add deployment configuration');
    if (cert.securityScore < 70) recommendations.push('Add security tooling');
    if (cert.debtScore < 70) recommendations.push('Reduce dependency count');
    if (cert.roadmapScore < 70) recommendations.push('Add roadmap and changelog');

    return recommendations;
  }

  /**
   * Get certification
   */
  getCertification(id: string): Certification | undefined {
    return this.certifications.get(id);
  }

  /**
   * Get all certifications
   */
  getAllCertifications(): Certification[] {
    return Array.from(this.certifications.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalCertifications: number;
    avgScore: number;
    gradeDistribution: Record<string, number>;
  } {
    const certs = Array.from(this.certifications.values());
    const gradeDistribution: Record<string, number> = {};

    for (const cert of certs) {
      gradeDistribution[cert.grade] = (gradeDistribution[cert.grade] || 0) + 1;
    }

    return {
      totalCertifications: certs.length,
      avgScore: certs.length > 0 ? Math.round(certs.reduce((sum, c) => sum + c.overallScore, 0) / certs.length) : 0,
      gradeDistribution
    };
  }
}

// Singleton instance
let instance: UniversalCertification | null = null;

export function getUniversalCertification(dataDir: string): UniversalCertification {
  if (!instance) {
    instance = new UniversalCertification(dataDir);
  }
  return instance;
}
