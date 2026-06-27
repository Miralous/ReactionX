import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FeedItem {
  id: string
  content: string
  date: string
  mood: string
  link: string | null
}

const ITEMS_PER_PAGE = 8

function FeedItemCard({ item, index }: { item: FeedItem; index: number }) {
  return (
    <div
      className={`hoverStyle group relative flex flex-col bg-background border border-border/40 rounded-lg ${
        index >= ITEMS_PER_PAGE ? 'hidden' : ''
      }`}
      data-dynamic-card
      data-dynamic-index={index}
    >
      <div className="p-5 pb-3 flex justify-between items-start gap-4">
        <span className="inline-flex items-center rounded-full bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground tracking-tight select-none">
          {item.mood}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
          {new Date(item.date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </span>
      </div>

      <div className="px-6 pt-1 flex-1 flex flex-col">
        <div
          className="relative max-h-[160px] transition-[max-height] duration-500 ease-in-out overflow-hidden"
          data-dynamic-collapse
        >
          <div
            className="*:!text-foreground prose prose-sm dark:prose-invert max-w-none prose-img:rounded-lg prose-img:border prose-img:border-border/40 prose-a:text-primary prose-p:leading-relaxed"
            data-dynamic-content
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" data-dynamic-fade />
        </div>

        <button
          type="button"
          className="mt-3 hidden items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors select-none self-start"
          data-dynamic-toggle
          aria-expanded="false"
        >
          <span className="icon-[ph--caret-down-bold] size-3.5" data-dynamic-toggle-icon></span>
          <span data-dynamic-toggle-text>Read more</span>
        </button>
      </div>

      <div className="px-5 pb-4 mt-4 flex items-center gap-4">
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center pt-1 gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span className="icon-[ph--link-bold] size-3.5"></span> Attachment Link
          </a>
        )}
      </div>
    </div>
  )
}

interface Props {
  items: FeedItem[]
}

export default function DynamicFeed({ items }: Props) {
  const hasMore = items.length > ITEMS_PER_PAGE

  return (
    <div className="flex flex-col relative min-h-[400px]" data-dynamic-feed data-items-per-page={ITEMS_PER_PAGE}>
      <div className="grid grid-cols-1 gap-6 relative">
        {items.map((item, index) => (
          <FeedItemCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 mb-4 flex justify-center fade-up" style={{ animationDelay: '100ms' }}>
          <button
            type="button"
            className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-primary/40 transition-all select-none"
            data-dynamic-load-more
          >
            <span>Load More</span>
            <span className="icon-[ph--arrow-down] size-3.5 group-hover:translate-y-0.5 transition-transform"></span>
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className={`mt-10 mb-4 justify-center fade-up ${hasMore ? 'hidden' : 'flex'}`} data-dynamic-end>
          <span className="text-[11px] font-medium text-muted-foreground/50 select-none">— End of signals —</span>
        </div>
      )}
    </div>
  )
}
