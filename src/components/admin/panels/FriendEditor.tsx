import React from 'react'
import { useAdmin } from '../AdminContext'

export default function FriendEditor() {
  const { friendMeta, setFriendMeta } = useAdmin()

  return (
    <div className="overflow-y-auto custom-scrollbar flex-1">
      <div className="bg-muted/10 border-b border-border/40 p-6 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
            <input
              value={friendMeta.name}
              onChange={(e) => setFriendMeta({ ...friendMeta, name: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="Site Name"
            />
          </div>
          <div className="sm:col-span-6">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Author</label>
            <input
              value={friendMeta.author}
              onChange={(e) => setFriendMeta({ ...friendMeta, author: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="Author Name"
            />
          </div>
          <div className="sm:col-span-8">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">URL</label>
            <input
              value={friendMeta.url}
              onChange={(e) => setFriendMeta({ ...friendMeta, url: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="https://example.com"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Directory</label>
            <input
              value={friendMeta.directory}
              onChange={(e) => setFriendMeta({ ...friendMeta, directory: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="Normal"
            />
          </div>
          <div className="sm:col-span-12">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Avatar</label>
            <input
              value={friendMeta.avatar}
              onChange={(e) => setFriendMeta({ ...friendMeta, avatar: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              placeholder="https://wsrv.nl/?url=..."
            />
          </div>
          <div className="sm:col-span-12">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
            <textarea
              value={friendMeta.description}
              onChange={(e) => setFriendMeta({ ...friendMeta, description: e.target.value })}
              className="w-full bg-background border border-border/40 rounded-xs px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              rows={2}
              placeholder="A brief description of the site..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
