import { useEffect, useState } from 'react'

interface Repository {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  archived: boolean
  language: string | null
  stargazers_count: number
  forks_count: number
}

const CACHE_KEY = 'gh_projects_data'
const CACHE_DURATION = 60 * 60 * 1000
let repoFetchPromise: Promise<Repository[]> | null = null

function getCached(): Repository[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp < CACHE_DURATION) return data as Repository[]
  } catch {
    // ignore invalid cache
  }
  return null
}

async function fetchRepos(username: string): Promise<Repository[]> {
  const headers: Record<string, string> = {}
  const token = import.meta.env.PUBLIC_GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&type=owner`, { headers })
  if (!response.ok) throw new Error(`GitHub API ${response.status}`)

  const all: Repository[] = await response.json()
  const repos = all.filter((repo) => repo.name !== '.github' && repo.name.toLowerCase() !== username.toLowerCase())
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() }))
  return repos
}

async function getRepos(username: string): Promise<Repository[]> {
  const cached = getCached()
  if (cached) return cached

  if (!repoFetchPromise) {
    repoFetchPromise = fetchRepos(username).finally(() => {
      repoFetchPromise = null
    })
  }
  return repoFetchPromise
}

function useGithubRepos(username: string) {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    const cached = getCached()
    if (cached) {
      setRepos(cached)
      setLoading(false)
    }

    getRepos(username)
      .then((data) => {
        if (!cancelled) {
          setRepos(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return { repos, loading, error }
}

export function RepoCount({ username }: { username: string }) {
  const { repos, loading } = useGithubRepos(username)
  const display = loading && repos.length === 0 ? '--' : repos.length.toString().padStart(2, '0')

  return (
    <span className="text-2xl font-semibold text-foreground tracking-tight" id="repo-count">
      {display}
    </span>
  )
}

export default function GithubProjectGrid({ username }: { username: string }) {
  const { repos, loading, error } = useGithubRepos(username)

  if (loading && repos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <span className="text-sm">Loading modules…</span>
      </div>
    )
  }

  if (error && repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <span className="icon-[ph--warning-circle] size-10 text-ctp-yellow/80 mb-3" />
        <p className="text-sm">Unable to load repositories. Refresh to retry.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-8">
      {repos.map((repo, i) => (
        <div
          key={repo.name}
          className="hoverStyle group relative flex flex-col bg-background/50 border border-border/40 rounded-lg hover:bg-muted/20 duration-300"
        >
          <div className="p-6 pb-2 relative z-10 flex justify-between items-start">
            <div className="size-12 flex items-center justify-center rounded-md bg-muted/30 border border-border/40">
              <span className="icon-[mdi--github] size-6 text-foreground/80" />
            </div>
            <div className="flex gap-2">
              {repo.html_url ? (
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center size-8 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <span className="icon-[mdi--github] size-4" />
                </a>
              ) : null}
              {repo.homepage ? (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center size-8 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <span className="icon-[ph--arrow-up-right] size-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="p-6 pt-2 flex-1 relative z-10">
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="block">
              <h3 className="text-base font-semibold text-foreground tracking-tight">{repo.name}</h3>
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{repo.description || 'No description'}</p>
          </div>

          <div className="mt-auto border-t border-border/40 px-6 py-2 bg-muted/10 rounded-b-lg flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className={`size-1.5 rounded-full ${repo.archived ? 'bg-ctp-yellow' : 'bg-ctp-green'}`} />
              {repo.archived ? 'Archived' : 'Active'}
            </span>
            <div className="flex gap-4 transition-all duration-500 opacity-100 font-mono">
              <span className="flex items-center gap-1">
                <span className="icon-[ph--star-fill] size-3 bg-ctp-yellow" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <span className="icon-[ph--git-fork-fill] size-3" />
                {repo.forks_count}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
