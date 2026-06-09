import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface ProjectStatsProps {
  repoUrl?: string;
  initialStar?: number;
  initialFork?: number;
}

export default function ProjectStats({ repoUrl, initialStar = 0, initialFork = 0 }: ProjectStatsProps) {
  const [stats, setStats] = useState({ stars: initialStar, forks: initialFork });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!repoUrl) {
      setLoading(false);
      return;
    }

    const repoPath = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

    if (!repoPath || !repoPath.includes('/')) {
        setLoading(false);
        return;
    }

    const cacheKey = `gh_stats_${repoPath}`;

    const fetchStats = async () => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setStats(data);
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`https://api.github.com/repos/${repoPath}`);

        if (!res.ok) {
            throw new Error('GitHub API Error');
        }

        const data = await res.json();

        const newStats = {
          stars: data.stargazers_count ?? data.stars ?? 0,
          forks: data.forks_count ?? data.forks ?? 0
        };

        setStats(newStats);

        localStorage.setItem(cacheKey, JSON.stringify({
          data: newStats,
          timestamp: Date.now()
        }));

      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [repoUrl]);

  return (
    <div className={cn("flex gap-4 transition-all duration-500", loading ? "opacity-50" : "opacity-100")}>
      <div className="flex items-center gap-1" title="Stars">
        <span className={cn("icon-[ph--star-fill] size-3", error ? "text-muted-foreground" : "text-ctp-yellow/80")}></span>
        <span className="font-mono">{stats.stars}</span>
      </div>
      <div className="flex items-center gap-1" title="Forks">
        <span className="icon-[ph--git-fork-fill] size-3 text-muted-foreground"></span>
        <span className="font-mono">{stats.forks}</span>
      </div>
    </div>
  );
}