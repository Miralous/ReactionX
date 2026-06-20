import { cn } from '~/lib/utils';
import { useAdmin } from '../AdminContext';
import { CONTENT_COLLECTIONS, type CollectionTab } from '../types';

const TABS: { key: CollectionTab; label: string }[] = [
  { key: 'post', label: 'Posts' },
  { key: 'dynamic', label: 'Dynamic' },
  { key: 'friend', label: 'Friends' },
];

export default function DataPanel() {
  const {
    mobileView, showLeftPanel, handleNewContent,
    fetchRemoteFiles, loadFile, filename, isLoadingFiles,
    remoteFiles, stageForDelete, currentCollection, setCurrentCollection
  } = useAdmin();

  return (
    <div className={cn(
      "flex-col bg-background rounded-lg border border-border/40 transition-all duration-300 relative overflow-hidden",
      mobileView === 'files' ? 'flex h-[calc(100vh-12rem)]' : 'hidden',
      showLeftPanel ? 'lg:flex lg:col-span-3 xl:col-span-2' : 'lg:hidden',
      "lg:h-auto lg:min-h-[400px] lg:max-h-[calc(100vh-8rem)]"
    )}>
      <div className="shrink-0">
        <div className="flex border-b border-border/40 bg-muted/10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurrentCollection(tab.key)}
              className={cn(
                "flex-1 py-2 text-xs font-medium transition-all text-center",
                currentCollection === tab.key
                  ? "bg-background text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-10 px-4 border-b border-border/40 flex justify-between items-center bg-muted/20">
          <span className="text-xs font-semibold text-foreground">
            {currentCollection === 'post' ? 'Posts' : currentCollection === 'dynamic' ? 'Updates' : 'Links'}
          </span>
          <div className="flex gap-1">
            <button onClick={handleNewContent} className="px-2 py-0.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="New">
              <span className="icon-[ph--plus] size-3.5"></span>
            </button>
            <button onClick={() => fetchRemoteFiles()} className="px-2 py-0.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Refresh">
              <span className="icon-[ph--arrows-clockwise] size-3.5"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 min-h-0">
        <div className="space-y-0.5">
          {isLoadingFiles ? (
            <div className="p-4 flex justify-center"><span className="icon-[ph--spinner] animate-spin text-muted-foreground size-5"></span></div>
          ) : remoteFiles.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No files found</div>
          ) : remoteFiles.map(f => (
            <div
              key={f.sha}
              className={cn(
                "group flex justify-between items-center text-sm px-3 py-2 rounded-xs cursor-pointer transition-colors",
                filename === f.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <span className={cn(
                  "size-4 shrink-0",
                  filename === f.name ? "text-primary" : "text-muted-foreground/60",
                  currentCollection === 'friend' ? "icon-[ph--link]" : currentCollection === 'dynamic' ? "icon-[ph--waveform]" : "icon-[ph--file-text]"
                )}></span>
                <span onClick={() => loadFile(f.name)} className="truncate flex-1">
                  {f.name.replace(/\.(md|mdx|yaml)$/, '')}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); stageForDelete(f); }}
                className="text-muted-foreground/40 hover:text-red-500 p-1 rounded-xs hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                title="Delete"
              >
                <span className="icon-[ph--trash] size-3.5"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}