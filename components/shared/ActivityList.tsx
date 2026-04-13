import { formatRelative } from '@/lib/formatters/date'
import { cn } from '@/lib/utils/cn'
import type { ActivityItem } from '@/types/content'

const activityDotColors: Record<ActivityItem['type'], string> = {
  post_created: 'bg-accent',
  post_published: 'bg-status-success',
  campaign_created: 'bg-blue-500',
  import_completed: 'bg-amber-500',
  media_uploaded: 'bg-purple-500',
}

interface ActivityListProps {
  items: ActivityItem[]
  className?: string
}

export function ActivityList({ items, className }: ActivityListProps) {
  if (!items.length) {
    return <p className="py-6 text-center text-[13px] text-gray-400">No recent activity</p>
  }

  return (
    <ul className={cn('space-y-0', className)}>
      {items.map((item, idx) => (
        <li key={item.id} className="flex gap-3 py-3">
          <div className="relative flex flex-col items-center">
            <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', activityDotColors[item.type])} />
            {idx < items.length - 1 && (
              <span className="mt-1.5 w-px flex-1 bg-canvas-border" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <p className="text-[13px] font-medium text-gray-800">{item.title}</p>
            <p className="mt-0.5 text-[12px] text-gray-400">{item.description}</p>
            <p className="mt-1 text-[11px] text-gray-400">{formatRelative(item.timestamp)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
