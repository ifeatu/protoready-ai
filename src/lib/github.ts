import { Octokit } from '@octokit/rest'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string | null
  private: boolean
  size: number
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getUserProfile(): Promise<GitHubUser> {
    const { data } = await this.octokit.rest.users.getAuthenticated()
    return data as GitHubUser
  }

  async getUserRepos(options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    per_page?: number
    page?: number
  } = {}): Promise<GitHubRepo[]> {
    const {
      sort = 'updated',
      direction = 'desc',
      per_page = 30,
      page = 1
    } = options

    const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
      sort,
      direction,
      per_page,
      page,
      type: 'all'
    })

    return data as GitHubRepo[]
  }

  async getRepoDetails(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.get({
      owner,
      repo
    })
    return data
  }

  async getRepoLanguages(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.listLanguages({
      owner,
      repo
    })
    return data
  }

  async getRepoContributors(owner: string, repo: string) {
    const { data } = await this.octokit.rest.repos.listContributors({
      owner,
      repo,
      per_page: 10
    })
    return data
  }

  async getRepoCommits(owner: string, repo: string, options: {
    since?: string
    until?: string
    per_page?: number
  } = {}) {
    const { data } = await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      ...options
    })
    return data
  }

  async getRepoReadme(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.getReadme({
        owner,
        repo
      })
      return {
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
        encoding: data.encoding,
        size: data.size,
        sha: data.sha
      }
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  }

  async analyzeRepository(owner: string, repo: string) {
    try {
      const [repoData, languages, contributors, readme] = await Promise.all([
        this.getRepoDetails(owner, repo),
        this.getRepoLanguages(owner, repo),
        this.getRepoContributors(owner, repo),
        this.getRepoReadme(owner, repo)
      ])

      // Get recent commits for activity analysis
      const recentCommits = await this.getRepoCommits(owner, repo, {
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        per_page: 100
      })

      return {
        repository: repoData,
        languages,
        contributors,
        readme,
        recentActivity: {
          commits: recentCommits.length,
          lastCommit: recentCommits[0]?.commit?.committer?.date
        }
      }
    } catch (error) {
      console.error('Error analyzing repository:', error)
      throw error
    }
  }
}

export function createGitHubService(accessToken: string): GitHubService {
  return new GitHubService(accessToken)
}