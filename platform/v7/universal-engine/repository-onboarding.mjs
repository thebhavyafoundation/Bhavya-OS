/**
 * Repository Onboarding
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Accept any Git repository.
 * Automatically discover:
 * - Language
 * - Framework
 * - Package manager
 * - Architecture
 * - Dependencies
 * - Applications
 * - Libraries
 * - CI/CD
 * - Deployment
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';

export interface RepositoryProfile {
  id: string;
  name: string;
  url: string;
  path: string;
  onboardedAt: string;
  discovery: DiscoveryResult;
  status: 'onboarding' | 'active' | 'archived';
}

export interface DiscoveryResult {
  language: LanguageInfo;
  framework: FrameworkInfo;
  packageManager: PackageManagerInfo;
  architecture: ArchitectureInfo;
  dependencies: DependencyInfo;
  applications: ApplicationInfo[];
  libraries: LibraryInfo[];
  cicd: CICDInfo;
  deployment: DeploymentInfo;
}

export interface LanguageInfo {
  primary: string;
  languages: { name: string; percentage: number; files: number }[];
  totalFiles: number;
  totalLines: number;
}

export interface FrameworkInfo {
  name: string;
  version: string;
  type: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'library';
  features: string[];
}

export interface PackageManagerInfo {
  name: string;
  lockFile: string;
  totalDependencies: number;
  devDependencies: number;
  scripts: string[];
}

export interface ArchitectureInfo {
  pattern: 'monolith' | 'microservices' | 'monorepo' | 'serverless' | 'static' | 'jamstack';
  structure: string;
  modules: string[];
  layers: string[];
}

export interface DependencyInfo {
  total: number;
  production: number;
  development: number;
  outdated: number;
  vulnerable: number;
  dependencies: { name: string; version: string; latest: string; type: 'production' | 'development' }[];
}

export interface ApplicationInfo {
  name: string;
  type: string;
  path: string;
  framework: string;
  entryPoint: string;
}

export interface LibraryInfo {
  name: string;
  path: string;
  type: string;
  exports: string[];
}

export interface CICDInfo {
  provider: string;
  configFiles: string[];
  pipelines: string[];
}

export interface DeploymentInfo {
  platform: string;
  configFiles: string[];
  environment: string[];
}

export class RepositoryOnboarding {
  private repositories: Map<string, RepositoryProfile> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadRepositories();
  }

  private loadRepositories(): void {
    const reposFile = join(this.dataDir, 'repositories.json');
    if (existsSync(reposFile)) {
      const data = JSON.parse(readFileSync(reposFile, 'utf-8'));
      for (const [id, repo] of Object.entries(data)) {
        this.repositories.set(id, repo as RepositoryProfile);
      }
    }
  }

  private saveRepositories(): void {
    const data: Record<string, RepositoryProfile> = {};
    for (const [id, repo] of this.repositories) {
      data[id] = repo;
    }
    writeFileSync(join(this.dataDir, 'repositories.json'), JSON.stringify(data, null, 2));
  }

  /**
   * Onboard a repository
   */
  async onboardRepository(repoPath: string, url?: string): Promise<RepositoryProfile> {
    const repoName = basename(repoPath);
    const id = `repo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const profile: RepositoryProfile = {
      id,
      name: repoName,
      url: url || '',
      path: repoPath,
      onboardedAt: new Date().toISOString(),
      discovery: await this.discoverRepository(repoPath),
      status: 'active'
    };

    this.repositories.set(id, profile);
    this.saveRepositories();
    return profile;
  }

  /**
   * Discover repository characteristics
   */
  private async discoverRepository(repoPath: string): Promise<DiscoveryResult> {
    return {
      language: await this.discoverLanguages(repoPath),
      framework: await this.discoverFramework(repoPath),
      packageManager: await this.discoverPackageManager(repoPath),
      architecture: await this.discoverArchitecture(repoPath),
      dependencies: await this.discoverDependencies(repoPath),
      applications: await this.discoverApplications(repoPath),
      libraries: await this.discoverLibraries(repoPath),
      cicd: await this.discoverCICD(repoPath),
      deployment: await this.discoverDeployment(repoPath)
    };
  }

  /**
   * Discover languages
   */
  private async discoverLanguages(repoPath: string): Promise<LanguageInfo> {
    const extensions: Record<string, number> = {};
    let totalFiles = 0;
    let totalLines = 0;

    const scanDir = (dir: string) => {
      try {
        const items = readdirSync(dir);
        for (const item of items) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist' || item === 'build') continue;
          
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else {
            const ext = extname(item);
            if (ext) {
              extensions[ext] = (extensions[ext] || 0) + 1;
              totalFiles++;
            }
          }
        }
      } catch (e) {
        // Skip inaccessible directories
      }
    };

    scanDir(repoPath);

    const languageMap: Record<string, string> = {
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.py': 'Python',
      '.rs': 'Rust',
      '.go': 'Go',
      '.java': 'Java',
      '.rb': 'Ruby',
      '.php': 'PHP',
      '.cs': 'C#',
      '.cpp': 'C++',
      '.c': 'C',
      '.swift': 'Swift',
      '.kt': 'Kotlin'
    };

    const languageCounts: Record<string, number> = {};
    for (const [ext, count] of Object.entries(extensions)) {
      const lang = languageMap[ext] || ext;
      languageCounts[lang] = (languageCounts[lang] || 0) + count;
    }

    const languages = Object.entries(languageCounts)
      .map(([name, files]) => ({
        name,
        percentage: Math.round((files / totalFiles) * 100),
        files
      }))
      .sort((a, b) => b.files - a.files);

    return {
      primary: languages[0]?.name || 'Unknown',
      languages,
      totalFiles,
      totalLines
    };
  }

  /**
   * Discover framework
   */
  private async discoverFramework(repoPath: string): Promise<FrameworkInfo> {
    const packageJsonPath = join(repoPath, 'package.json');
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['next']) {
        return { name: 'Next.js', version: deps['next'], type: 'fullstack', features: ['SSR', 'SSG', 'API Routes'] };
      }
      if (deps['react']) {
        return { name: 'React', version: deps['react'], type: 'frontend', features: ['Components', 'Hooks'] };
      }
      if (deps['vue']) {
        return { name: 'Vue.js', version: deps['vue'], type: 'frontend', features: ['Components', 'Reactivity'] };
      }
      if (deps['angular']) {
        return { name: 'Angular', version: deps['angular'], type: 'frontend', features: ['Components', 'DI'] };
      }
      if (deps['express']) {
        return { name: 'Express', version: deps['express'], type: 'backend', features: ['Middleware', 'Routing'] };
      }
    }

    const cargoPath = join(repoPath, 'Cargo.toml');
    if (existsSync(cargoPath)) {
      return { name: 'Rust', version: 'unknown', type: 'backend', features: ['Systems', 'Performance'] };
    }

    const goModPath = join(repoPath, 'go.mod');
    if (existsSync(goModPath)) {
      return { name: 'Go', version: 'unknown', type: 'backend', features: ['Concurrency', 'Performance'] };
    }

    const requirementsPath = join(repoPath, 'requirements.txt');
    if (existsSync(requirementsPath)) {
      return { name: 'Python', version: 'unknown', type: 'backend', features: ['Data Science', 'ML'] };
    }

    return { name: 'Unknown', version: 'unknown', type: 'backend', features: [] };
  }

  /**
   * Discover package manager
   */
  private async discoverPackageManager(repoPath: string): Promise<PackageManagerInfo> {
    const lockFiles: Record<string, string> = {
      'package-lock.json': 'npm',
      'yarn.lock': 'yarn',
      'pnpm-lock.yaml': 'pnpm',
      'Cargo.lock': 'cargo',
      'go.sum': 'go',
      'poetry.lock': 'poetry',
      'Pipfile.lock': 'pipenv'
    };

    for (const [lockFile, name] of Object.entries(lockFiles)) {
      if (existsSync(join(repoPath, lockFile))) {
        const packageJsonPath = join(repoPath, 'package.json');
        let scripts: string[] = [];
        let totalDeps = 0;
        let devDeps = 0;

        if (existsSync(packageJsonPath)) {
          const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          scripts = Object.keys(pkg.scripts || {});
          totalDeps = Object.keys(pkg.dependencies || {}).length;
          devDeps = Object.keys(pkg.devDependencies || {}).length;
        }

        return {
          name,
          lockFile,
          totalDependencies: totalDeps + devDeps,
          devDependencies: devDeps,
          scripts
        };
      }
    }

    return { name: 'unknown', lockFile: '', totalDependencies: 0, devDependencies: 0, scripts: [] };
  }

  /**
   * Discover architecture
   */
  private async discoverArchitecture(repoPath: string): Promise<ArchitectureInfo> {
    const hasMonorepo = existsSync(join(repoPath, 'packages')) || existsSync(join(repoPath, 'apps'));
    const hasMicroservices = existsSync(join(repoPath, 'services'));
    const hasServerless = existsSync(join(repoPath, 'functions')) || existsSync(join(repoPath, 'serverless.yml'));

    let pattern: ArchitectureInfo['pattern'] = 'monolith';
    if (hasMonorepo) pattern = 'monorepo';
    if (hasMicroservices) pattern = 'microservices';
    if (hasServerless) pattern = 'serverless';

    return {
      pattern,
      structure: this.analyzeStructure(repoPath),
      modules: this.discoverModules(repoPath),
      layers: this.discoverLayers(repoPath)
    };
  }

  private analyzeStructure(repoPath: string): string {
    const items = readdirSync(repoPath).filter(i => !i.startsWith('.'));
    return items.join(', ');
  }

  private discoverModules(repoPath: string): string[] {
    const modules: string[] = [];
    const packagesDir = join(repoPath, 'packages');
    const appsDir = join(repoPath, 'apps');

    if (existsSync(packagesDir)) {
      modules.push(...readdirSync(packagesDir));
    }
    if (existsSync(appsDir)) {
      modules.push(...readdirSync(appsDir));
    }

    return modules;
  }

  private discoverLayers(repoPath: string): string[] {
    const layers: string[] = [];
    const srcDir = join(repoPath, 'src');
    
    if (existsSync(srcDir)) {
      layers.push(...readdirSync(srcDir).filter(i => !i.startsWith('.')));
    }

    return layers;
  }

  /**
   * Discover dependencies
   */
  private async discoverDependencies(repoPath: string): Promise<DependencyInfo> {
    const packageJsonPath = join(repoPath, 'package.json');
    
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = Object.entries(pkg.dependencies || {}).map(([name, version]) => ({
        name,
        version: version as string,
        latest: 'unknown',
        type: 'production' as const
      }));
      const devDeps = Object.entries(pkg.devDependencies || {}).map(([name, version]) => ({
        name,
        version: version as string,
        latest: 'unknown',
        type: 'development' as const
      }));

      return {
        total: deps.length + devDeps.length,
        production: deps.length,
        development: devDeps.length,
        outdated: 0,
        vulnerable: 0,
        dependencies: [...deps, ...devDeps]
      };
    }

    return { total: 0, production: 0, development: 0, outdated: 0, vulnerable: 0, dependencies: [] };
  }

  /**
   * Discover applications
   */
  private async discoverApplications(repoPath: string): Promise<ApplicationInfo[]> {
    const apps: ApplicationInfo[] = [];
    const appsDir = join(repoPath, 'apps');

    if (existsSync(appsDir)) {
      for (const app of readdirSync(appsDir)) {
        const appPath = join(appsDir, app);
        const packageJsonPath = join(appPath, 'package.json');
        
        if (existsSync(packageJsonPath)) {
          const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          apps.push({
            name: app,
            type: pkg.main ? 'library' : 'application',
            path: `apps/${app}`,
            framework: Object.keys(pkg.dependencies || {})[0] || 'unknown',
            entryPoint: pkg.main || 'index.js'
          });
        }
      }
    }

    return apps;
  }

  /**
   * Discover libraries
   */
  private async discoverLibraries(repoPath: string): Promise<LibraryInfo[]> {
    const libs: LibraryInfo[] = [];
    const packagesDir = join(repoPath, 'packages');

    if (existsSync(packagesDir)) {
      for (const pkg of readdirSync(packagesDir)) {
        const pkgPath = join(packagesDir, pkg);
        const packageJsonPath = join(pkgPath, 'package.json');
        
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          libs.push({
            name: pkg,
            path: `packages/${pkg}`,
            type: packageJson.type || 'module',
            exports: Object.keys(packageJson.exports || {})
          });
        }
      }
    }

    return libs;
  }

  /**
   * Discover CI/CD
   */
  private async discoverCICD(repoPath: string): Promise<CICDInfo> {
    const cicdFiles: string[] = [];
    const pipelines: string[] = [];

    const cicdPaths = [
      '.github/workflows',
      '.gitlab-ci.yml',
      'Jenkinsfile',
      '.circleci',
      '.travis.yml',
      'azure-pipelines.yml'
    ];

    for (const path of cicdPaths) {
      const fullPath = join(repoPath, path);
      if (existsSync(fullPath)) {
        cicdFiles.push(path);
      }
    }

    return {
      provider: cicdFiles[0]?.includes('github') ? 'GitHub Actions' : cicdFiles[0] || 'none',
      configFiles: cicdFiles,
      pipelines
    };
  }

  /**
   * Discover deployment
   */
  private async discoverDeployment(repoPath: string): Promise<DeploymentInfo> {
    const configFiles: string[] = [];
    const environment: string[] = [];

    const deploymentPaths = [
      'vercel.json',
      'netlify.toml',
      'Dockerfile',
      'docker-compose.yml',
      'serverless.yml',
      'appspec.yml',
      'buildspec.yml',
      'fly.toml',
      'render.yaml'
    ];

    for (const path of deploymentPaths) {
      if (existsSync(join(repoPath, path))) {
        configFiles.push(path);
      }
    }

    const envFiles = ['.env', '.env.local', '.env.production'];
    for (const env of envFiles) {
      if (existsSync(join(repoPath, env))) {
        environment.push(env);
      }
    }

    let platform = 'unknown';
    if (configFiles.includes('vercel.json')) platform = 'Vercel';
    else if (configFiles.includes('netlify.toml')) platform = 'Netlify';
    else if (configFiles.includes('Dockerfile')) platform = 'Docker';
    else if (configFiles.includes('fly.toml')) platform = 'Fly.io';
    else if (configFiles.includes('render.yaml')) platform = 'Render';

    return { platform, configFiles, environment };
  }

  /**
   * Get repository
   */
  getRepository(id: string): RepositoryProfile | undefined {
    return this.repositories.get(id);
  }

  /**
   * Get all repositories
   */
  getAllRepositories(): RepositoryProfile[] {
    return Array.from(this.repositories.values());
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalRepositories: number;
    byStatus: Record<string, number>;
    byLanguage: Record<string, number>;
    byFramework: Record<string, number>;
  } {
    const byStatus: Record<string, number> = {};
    const byLanguage: Record<string, number> = {};
    const byFramework: Record<string, number> = {};

    for (const repo of this.repositories.values()) {
      byStatus[repo.status] = (byStatus[repo.status] || 0) + 1;
      byLanguage[repo.discovery.language.primary] = (byLanguage[repo.discovery.language.primary] || 0) + 1;
      byFramework[repo.discovery.framework.name] = (byFramework[repo.discovery.framework.name] || 0) + 1;
    }

    return {
      totalRepositories: this.repositories.size,
      byStatus,
      byLanguage,
      byFramework
    };
  }
}

// Singleton instance
let instance: RepositoryOnboarding | null = null;

export function getRepositoryOnboarding(dataDir: string): RepositoryOnboarding {
  if (!instance) {
    instance = new RepositoryOnboarding(dataDir);
  }
  return instance;
}
