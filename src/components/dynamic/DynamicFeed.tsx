import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '~/lib/utils'

interface FeedItem {
  id: string
  content: string
  date: string
  mood: string
  link: string | null
}

const ITEMS_PER_PAGE = 8
const COLLAPSE_HEIGHT = 160

function FeedItemCard({ item, animationDelay }: { item: FeedItem; animationDelay: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const checkOverflow = () => {
      setHasOverflow(el.scrollHeight > COLLAPSE_HEIGHT)
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    return () => observer.disconnect()
  }, [item.content])

  return (
    <div className="group relative flex flex-col bg-background border border-border/40 rounded-lg fade-up" style={{ animationDelay }}>
      <div className="p-5 pb-3 flex justify-between items-start gap-4">
        <span className="inline-flex items-center rounded-full bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground tracking-tight select-none">
          {item.mood}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
          {new Date(item.date).toLocaleString('zh-CN', {
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
          className={cn(
            'relative transition-[max-height] duration-500 ease-in-out overflow-hidden',
            isExpanded ? 'max-h-[3000px]' : 'max-h-[160px]'
          )}
        >
          <div
            ref={contentRef}
            className="prose prose-sm dark:prose-invert max-w-none prose-img:rounded-lg prose-img:border prose-img:border-border/40 prose-a:text-primary prose-p:leading-relaxed"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
          </div>

          {!isExpanded && hasOverflow && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>

        {hasOverflow && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors select-none self-start"
          >
            {isExpanded ? (
              <>
                <span className="icon-[ph--caret-up-bold] size-3.5"></span> Show less
              </>
            ) : (
              <>
                <span className="icon-[ph--caret-down-bold] size-3.5"></span> Read more
              </>
            )}
          </button>
        )}
      </div>

      <div className="px-5 pb-4 mt-2 flex items-center gap-4">
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
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
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const visibleFeed = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  return (
    <div className="flex flex-col relative min-h-[400px]">
      <div className="grid grid-cols-1 gap-6 relative">
        {visibleFeed.map((item, index) => (
          <FeedItemCard key={item.id} item={item} animationDelay={`${(index % ITEMS_PER_PAGE) * 50}ms`} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 mb-4 flex justify-center fade-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-primary/40 transition-all select-none"
          >
            <span>Load More</span>
            <span className="icon-[ph--arrow-down] size-3.5 group-hover:translate-y-0.5 transition-transform"></span>
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="mt-10 mb-4 flex justify-center fade-up">
          <span className="text-[11px] font-medium text-muted-foreground/50 select-none">— End of signals —</span>
        </div>
      )}
    </div>
  )
}
