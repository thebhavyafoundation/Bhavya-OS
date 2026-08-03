/**
 * @bhavya/providers — Git Provider Interface
 *
 * Abstract interface for Git operations (GitHub, GitLab, Bitbucket).
 */

export interface GitProvider {
  id: string;
  name: string;
  type: "github" | "gitlab" | "bitbucket" | "local";

  // Repository operations
  listRepos(owner: string): Promise<GitRepo[]>;
  getRepo(owner: string, repo: string): Promise<GitRepo>;
  createRepo(
    owner: string,
    name: string,
    options?: CreateRepoOptions,
  ): Promise<GitRepo>;

  // Branch operations
  listBranches(owner: string, repo: string): Promise<GitBranch[]>;
  getBranch(owner: string, repo: string, branch: string): Promise<GitBranch>;

  // Commit operations
  listCommits(
    owner: string,
    repo: string,
    branch?: string,
    limit?: number,
  ): Promise<GitCommit[]>;
  getCommit(owner: string, repo: string, sha: string): Promise<GitCommit>;

  // File operations
  getFile(
    owner: string,
    repo: string,
    path: string,
    ref?: string,
  ): Promise<GitFile>;
  createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
  ): Promise<void>;
  updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
  ): Promise<void>;

  // PR operations
  listPullRequests(
    owner: string,
    repo: string,
    state?: string,
  ): Promise<GitPullRequest[]>;
  createPullRequest(
    owner: string,
    repo: string,
    options: CreatePROptions,
  ): Promise<GitPullRequest>;

  // Health
  health(): Promise<{ status: string; latencyMs: number }>;
}

export interface GitRepo {
  id: string;
  name: string;
  fullName: string;
  url: string;
  description?: string;
  private: boolean;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitBranch {
  name: string;
  sha: string;
  isDefault: boolean;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitFile {
  path: string;
  content: string;
  sha: string;
  size: number;
}

export interface GitPullRequest {
  id: number;
  title: string;
  body: string;
  state: string;
  head: string;
  base: string;
  url: string;
}

export interface CreateRepoOptions {
  description?: string;
  private?: boolean;
  autoInit?: boolean;
}

export interface CreatePROptions {
  title: string;
  body: string;
  head: string;
  base: string;
}
