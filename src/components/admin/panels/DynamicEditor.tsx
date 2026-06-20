import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '~/lib/utils';
import { useAdmin } from '../AdminContext';

interface DynamicEditorProps {
  showPreview: boolean;
}

export default function DynamicEditor({ showPreview }: DynamicEditorProps) {
  const { dynamicMeta, setDynamicMeta, body, setBody, stageForWrite } = useAdmin();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    const newText = textarea.value.substring(0, start) + before + selection + after + textarea.value.substring(end);
    setBody(newText);
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newCursorPos = start + before.length + selection.length + after.length;
        textarea.setSelectionRange(start === end ? start + before.length : start, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); insertText('**', '**'); break;
        case 'i': e.preventDefault(); insertText('*', '*'); break;
        case 's': e.preventDefault(); stageForWrite(); break;
      }
    }
  };

  return (
    <>
      {!showPreview && (
        <div className="bg-muted/10 border-b border-border/40 p-4 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">ID</label>
              <input value={dynamicMeta.id} onChange={e => setDynamicMeta({ ...dynamicMeta, id: e.target.value })} className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" placeholder="dyn-01" />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
              <input type="datetime-local" value={dynamicMeta.date} onChange={e => setDynamicMeta({ ...dynamicMeta, date: e.target.value })} className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mood</label>
              <input value={dynamicMeta.mood} onChange={e => setDynamicMeta({ ...dynamicMeta, mood: e.target.value })} className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" placeholder="Update, Dev Log, etc." />
            </div>
            <div className="sm:col-span-12">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Link (optional)</label>
              <input value={dynamicMeta.link} onChange={e => setDynamicMeta({ ...dynamicMeta, link: e.target.value })} className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" placeholder="https://..." />
            </div>
          </div>
        </div>
      )}

      {!showPreview && (
        <div className="border-b border-border/40 bg-background shrink-0 px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { icon: 'icon-[ph--text-b]', label: 'Bold', action: () => insertText('**', '**') },
            { icon: 'icon-[ph--text-italic]', label: 'Italic', action: () => insertText('*', '*') },
            { icon: 'icon-[ph--code]', label: 'Code', action: () => insertText('`', '`') },
            { icon: 'icon-[ph--list-bullets]', label: 'List', action: () => insertText('- ', '') },
            { icon: 'icon-[ph--text-h-two]', label: 'H2', action: () => insertText('## ', '') },
          ].map((tool, i) => (
            <button key={i} onClick={tool.action} title={tool.label} className="p-2 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center">
              <span className={cn("size-4", tool.icon)}></span>
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 relative flex flex-col min-h-0 bg-background">
        {showPreview ? (
          <div className="absolute inset-0 overflow-y-auto w-full p-6 sm:p-10 custom-scrollbar">
            <div className="mx-auto prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={body}
            onChange={e => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-6 sm:p-10 bg-transparent text-sm sm:text-base leading-relaxed resize-none focus:outline-none custom-scrollbar placeholder:text-muted-foreground/30"
            placeholder="Write your update content here... (Markdown supported)"
            spellCheck={false}
          />
        )}
      </div>
    </>
  );
}