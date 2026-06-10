import { CMS_CONFIG } from '~/config';

export const REPO_CONFIG = {
  owner: CMS_CONFIG.owner,
  repo: CMS_CONFIG.repo,
  branch: CMS_CONFIG.branch,
  pathPrefix: CMS_CONFIG.pathPrefix
};

export const DEFAULT_META = {
  title: '', description: '', pubDate: new Date().toISOString().split('T')[0],
  author: CMS_CONFIG.owner, tags: '', recommend: false,
  heroImage: '', ogImage: '', heroImageAspectRatio: '16/9'
};

export type FileType = 'post' | 'data';
export type MobileView = 'files' | 'editor' | 'queue';
export type EditorMode = 'visual' | 'raw';

export type QueueItem = {
  id: string; type: 'write' | 'delete'; filename: string;
  content?: string; sha?: string; status: 'pending' | 'processing' | 'done' | 'error';
  isDataFile?: boolean;
};

export type RemoteFile = { name: string; sha: string; path: string; };

export interface MetaType {
    title: string;
    description: string;
    pubDate: string;
    author: string;
    tags: string;
    recommend: boolean;
    heroImage: string;
    ogImage: string;
    heroImageAspectRatio: string;
}
