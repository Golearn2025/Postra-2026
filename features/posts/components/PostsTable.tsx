'use client'

import { Badge } from '@/components/ui/badge'
import type { AppPostsListItem } from '@/types/views'

interface PostsTableProps {
  posts: AppPostsListItem[]
}

const STATUS_STYLES: Record<string, string> = {
  draft:     'bg-slate-100 text-slate-700',
  imported:  'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved:  'bg-green-100 text-green-700',
  scheduled: 'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700',
  failed:    'bg-red-100 text-red-700',
  archived:  'bg-gray-100 text-gray-500',
}

const SOURCE_LABEL: Record<string, string> = {
  manual:                'Manual',
  chatgpt_imported:      'AI Planner',
  ai_platform_generated: 'AI Generated',
  bulk_imported:         'Bulk Import',
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Topic</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Day</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const meta = post.metadata as Record<string, unknown> | null ?? {}
              const primaryTopic = meta.primaryTopic as string | null
              const plannerDay = meta.plannerDay as number | null

              return (
                <tr key={post.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[260px]">
                    <span className="line-clamp-2 leading-snug">{post.title}</span>
                    {post.caption_master && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.caption_master}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {post.campaign_name ?? <span className="italic">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[post.status] ?? STATUS_STYLES.draft}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {SOURCE_LABEL[post.source] ?? post.source}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {primaryTopic ?? <span className="italic text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-center">
                    {plannerDay != null ? `Day ${plannerDay}` : <span className="italic text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
