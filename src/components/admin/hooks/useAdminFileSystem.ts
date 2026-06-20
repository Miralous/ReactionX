import { useState, useEffect, useCallback } from 'react';
import { REPO_CONFIG, CONTENT_COLLECTIONS, DEFAULT_META, DEFAULT_DYNAMIC_META, DEFAULT_FRIEND_META, type RemoteFile, type QueueItem, type MobileView, type CollectionTab } from '../types';
import type { ToastType } from './useAdminToast';

function collectionPath(tab: CollectionTab): string {
  return CONTENT_COLLECTIONS[tab]?.path || CONTENT_COLLECTIONS.post.path;
}

export function useAdminFileSystem(
  showToast: (msg: string, type?: ToastType) => void,
  getAuthHeaders: () => any,
  handleLogout: () => void,
  editor: any,
  setMobileView: (v: MobileView) => void,
  currentCollection: CollectionTab,
  setCurrentCollection: (v: CollectionTab) => void
) {
  const [remoteFiles, setRemoteFiles] = useState<RemoteFile[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(false);

  useEffect(() => {
    const savedQueue = localStorage.getItem('admin_queue_v1');
    if (savedQueue) { try { setQueue(JSON.parse(savedQueue)); } catch {} }
  }, []);

  useEffect(() => { localStorage.setItem('admin_queue_v1', JSON.stringify(queue)); }, [queue]);

  const parseContent = (raw: string) => {
    try {
      const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = raw.match(regex);
      if (!match) return { meta: DEFAULT_META, body: raw };
      const yamlBlock = match[1];
      const bodyContent = match[2].trim();
      const extract = (key: string, isString = true) => {
        const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
        const m = yamlBlock.match(regex);
        if (!m) return '';
        let val = m[1].trim();
        if (isString && val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1).replace(/''/g, "'");
        return val;
      };
      const tags = extract('tags', false).replace(/^\[|\]$/g, '').split(',').map((t: string) => t.trim().replace(/^'|'$/g, '')).join(', ');
      const newMeta = {
        title: extract('title'), description: extract('description'),
        pubDate: extract('pubDate', false), author: extract('author'),
        tags: tags, recommend: extract('recommend', false) === 'true',
        heroImage: extract('heroImage', false) === 'none' ? '' : extract('heroImage', false),
        ogImage: extract('ogImage', false) === 'none' ? '' : extract('ogImage', false),
        heroImageAspectRatio: extract('heroImageAspectRatio') || '16/9'
      };
      return { meta: { ...DEFAULT_META, ...newMeta }, body: bodyContent };
    } catch (e) { return { meta: DEFAULT_META, body: raw }; }
  };

  const parseDynamicContent = (raw: string) => {
    try {
      const regex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = raw.match(regex);
      const bodyContent = match ? match[2].trim() : raw;
      if (!match) return { meta: DEFAULT_DYNAMIC_META, body: raw };
      const yamlBlock = match[1];
      const extract = (key: string) => {
        const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
        const m = yamlBlock.match(regex);
        if (!m) return '';
        let val = m[1].trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1);
        return val;
      };
      return {
        meta: {
          id: extract('id'),
          date: extract('date'),
          mood: extract('mood'),
          link: extract('link'),
        },
        body: bodyContent
      };
    } catch (e) { return { meta: DEFAULT_DYNAMIC_META, body: raw }; }
  };

  const parseYamlFriend = (raw: string) => {
    try {
      const extract = (key: string) => {
        const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
        const m = raw.match(regex);
        if (!m) return '';
        let val = m[1].trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1);
        return val;
      };
      return {
        name: extract('name'),
        author: extract('author'),
        url: extract('url'),
        avatar: extract('avatar'),
        description: extract('description'),
        directory: extract('directory'),
      };
    } catch (e) { return DEFAULT_FRIEND_META; }
  };

  const fetchRemoteFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const path = collectionPath(currentCollection);
      const res = await fetch('/api/list-files', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ config: REPO_CONFIG, path }),
      });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      const data = await res.json();
      if (data.files) setRemoteFiles(data.files);
    } catch (e: any) {
      if (e.message === 'UNAUTHORIZED') handleLogout();
      else showToast('Failed to fetch files', 'error');
    } finally { setIsLoadingFiles(false); }
  }, [getAuthHeaders, handleLogout, showToast, currentCollection]);

  const loadFile = async (name: string) => {
    if (editor.body?.length > 50 && editor.currentMode !== currentCollection && !confirm("Override current workspace?")) return;
    setIsFetchingContent(true);
    try {
      const path = collectionPath(currentCollection);
      const fullPath = `${path}${name}`;
      const res = await fetch('/api/get-content', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ config: REPO_CONFIG, absolutePath: fullPath }),
      });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();

      if (currentCollection === 'friend') {
        const parsed = parseYamlFriend(data.content);
        editor.setFilename(name.replace('.yaml', ''));
        editor.setFriendMeta(parsed);
        editor.setCurrentMode('friend');
      } else if (currentCollection === 'dynamic') {
        const { meta: parsedMeta, body: parsedBody } = parseDynamicContent(data.content);
        editor.setFilename(name.replace('.md', ''));
        editor.setDynamicMeta(parsedMeta);
        editor.setBody(parsedBody);
        editor.setCurrentMode('dynamic');
      } else {
        const { meta: parsedMeta, body: parsedBody } = parseContent(data.content);
        editor.setFilename(name);
        editor.setMeta(parsedMeta);
        editor.setBody(parsedBody);
        editor.setCurrentMode('post');
      }
      setMobileView('editor');
      showToast(`Loaded ${name}`, 'success');
    } catch (e: any) {
      if (e.message === 'UNAUTHORIZED') handleLogout();
      else showToast('Failed to load file', 'error');
    } finally { setIsFetchingContent(false); }
  };

  const stageForWrite = () => {
    let content = '';
    let finalFilename = '';

    if (currentCollection === 'friend') {
      const fm = editor.friendMeta;
      if (!editor.filename || !fm.name) { showToast('Filename and Name are required', 'error'); return; }
      const dirLine = fm.directory ? `\ndirectory: ${fm.directory}` : '';
      content = `name: ${fm.name}\nauthor: ${fm.author}\nurl: ${fm.url}\navatar: ${fm.avatar}\ndescription: ${fm.description}${dirLine}\n`;
      finalFilename = `${collectionPath('friend')}${editor.filename.endsWith('.yaml') ? editor.filename : `${editor.filename}.yaml`}`;
    } else if (currentCollection === 'dynamic') {
      const dm = editor.dynamicMeta;
      if (!editor.filename) { showToast('Filename is required', 'error'); return; }
      const linkLine = dm.link ? `\nlink: ${dm.link}` : '';
      content = `---\nid: ${dm.id}\ndate: ${dm.date}\nmood: ${dm.mood}${linkLine}\n---\n\n${editor.body}`;
      finalFilename = `${collectionPath('dynamic')}${editor.filename.endsWith('.md') ? editor.filename : `${editor.filename}.md`}`;
    } else {
      if (!editor.filename || !editor.meta.title) { showToast('Filename and Title are required', 'error'); return; }
      finalFilename = editor.filename.endsWith('.md') ? editor.filename : `${editor.filename}.md`;
      content = `---\ntitle: '${editor.meta.title.replace(/'/g, "''")}'\ndescription: '${editor.meta.description.replace(/'/g, "''")}'\npubDate: ${editor.meta.pubDate}\nauthor: '${editor.meta.author}'\ntags: [${editor.meta.tags.split(/[,，]/).map((t: string) => `'${t.trim()}'`).filter(Boolean).join(', ')}]\nrecommend: ${editor.meta.recommend}\nheroImage: ${editor.meta.heroImage || 'none'}\nogImage: ${editor.meta.ogImage || 'none'}\nheroImageAspectRatio: '${editor.meta.heroImageAspectRatio}'\n---\n\n${editor.body}`;
    }

    setQueue(prev => {
      const newItem: QueueItem = { id: Date.now().toString(), type: 'write', filename: finalFilename, content, status: 'pending', isDataFile: currentCollection !== 'post' };
      const existingIndex = prev.findIndex(p => p.filename === finalFilename);
      if (existingIndex !== -1) { const newQueue = [...prev]; newQueue[existingIndex] = newItem; return newQueue; }
      return [...prev, newItem];
    });
    showToast('Staged for commit', 'success');
  };

  const stageForDelete = (file: RemoteFile) => {
    if (!confirm(`DELETE ${file.name}?`)) return;
    const isData = currentCollection !== 'post';
    setQueue(prev => {
      const newItem: QueueItem = {
        id: Date.now().toString(), type: 'delete',
        filename: isData ? file.path : file.name,
        sha: file.sha, status: 'pending',
        isDataFile: isData,
      };
      const existingIndex = prev.findIndex(p => p.filename === (isData ? file.path : file.name));
      if (existingIndex !== -1) { const newQueue = [...prev]; newQueue[existingIndex] = newItem; return newQueue; }
      return [...prev, newItem];
    });
    showToast('Staged for deletion', 'success');
  };

  const processQueue = async () => {
    if (queue.length === 0 || !confirm(`EXECUTE ${queue.length} OPERATIONS?`)) return;
    setIsProcessingQueue(true);
    try {
      const res = await fetch('/api/batch-commit', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ config: REPO_CONFIG, operations: queue }) });
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      if (!res.ok) throw new Error('BATCH FAILED');
      setQueue([]);
      localStorage.removeItem('admin_queue_v1');
      showToast('Operations committed successfully', 'success');
      await fetchRemoteFiles();
    } catch (error: any) {
      if (error.message === 'UNAUTHORIZED') handleLogout();
      else showToast('Batch commit failed', 'error');
    } finally { setIsProcessingQueue(false); }
  };

  const handleNewContent = async () => {
    if (editor.body?.length > 20 && !confirm("CLEAR WORKSPACE?")) return;
    if (currentCollection === 'friend') {
      editor.setCurrentMode('friend');
      editor.setFilename('');
      editor.setFriendMeta(DEFAULT_FRIEND_META);
    } else if (currentCollection === 'dynamic') {
      editor.setCurrentMode('dynamic');
      editor.setFilename('');
      editor.setBody('');
      editor.setDynamicMeta(DEFAULT_DYNAMIC_META);
    } else {
      editor.setCurrentMode('post');
      editor.setFilename('');
      editor.setBody('');
      editor.setMeta(DEFAULT_META);
    }
    showToast('Workspace cleared', 'info');
    setMobileView('editor');
  };

  const loadFromQueue = (item: QueueItem) => {
    if (item.type === 'delete') return;
    if ((editor.body?.length > 20 || editor.jsonContent?.length > 20) && !confirm("DISCARD CHANGES?")) return;
    try {
      const displayFilename = item.filename.includes('/') ? item.filename.split('/').pop() || item.filename : item.filename;
      editor.setFilename(displayFilename);
      if (item.isDataFile) {
        editor.setCurrentMode('data');
        editor.setJsonContent(item.content || '');
        try { editor.setParsedJson(JSON.parse(item.content || '[]')); editor.setEditorMode('visual'); } catch { editor.setEditorMode('raw'); }
      } else {
        editor.setCurrentMode('post');
        const { meta: m, body: b } = parseContent(item.content || '');
        editor.setMeta(m);
        editor.setBody(b);
      }
      setMobileView('editor');
      showToast('Loaded from queue', 'info');
    } catch (e) {}
  };

  const removeFromQueue = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQueue(prev => prev.filter(item => item.id !== id));
    showToast('Removed from queue', 'info');
  };

  return {
    remoteFiles, queue, isLoadingFiles, isProcessingQueue, isFetchingContent,
    fetchRemoteFiles, loadFile, stageForWrite, stageForDelete,
    processQueue, handleNewContent, loadFromQueue, removeFromQueue
  };
}