import { CMS_CONFIG } from '~/config.mjs'

export const REPO_CONFIG = {
  owner: CMS_CONFIG.owner,
  repo: CMS_CONFIG.repo,
  branch: CMS_CONFIG.branch,
  pathPrefix: CMS_CONFIG.pathPrefix,
}

export const CONTENT_COLLECTIONS: Record<string, { path: string; ext: string }> = {
  post: { path: CMS_CONFIG.pathPrefix, ext: '.md,.mdx' },
  dynamic: { path: 'src/content/data/dynamic/', ext: '.md' },
  friend: { path: 'src/content/data/friends/', ext: '.yaml' },
}

export const DEFAULT_META = {
  title: '',
  description: '',
  pubDate: new Date().toISOString().split('T')[0],
  author: CMS_CONFIG.owner,
  tags: '',
  recommend: false,
  heroImage: '',
  ogImage: '',
  heroImageAspectRatio: '16/9',
}

export const DEFAULT_DYNAMIC_META = {
  id: '',
  date: new Date().toISOString(),
  mood: '',
  link: '',
}

export const DEFAULT_FRIEND_META = {
  name: '',
  author: '',
  url: '',
  avatar: '',
  description: '',
  directory: '',
}

export type FileType = 'post' | 'dynamic' | 'friend' | 'data'
export type MobileView = 'files' | 'editor' | 'queue'
export type EditorMode = 'visual' | 'raw'
export type CollectionTab = 'post' | 'dynamic' | 'friend'

export type QueueItem = {
  id: string
  type: 'write' | 'delete'
  filename: string
  content?: string
  sha?: string
  status: 'pending' | 'processing' | 'done' | 'error'
  isDataFile?: boolean
}

export type RemoteFile = { name: string; sha: string; path: string }

export interface MetaType {
  title: string
  description: string
  pubDate: string
  author: string
  tags: string
  recommend: boolean
  heroImage: string
  ogImage: string
  heroImageAspectRatio: string
}

export interface DynamicMeta {
  id: string
  date: string
  mood: string
  link: string
}

export interface FriendMeta {
  name: string
  author: string
  url: string
  avatar: string
  description: string
  directory: string
}
