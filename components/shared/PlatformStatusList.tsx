import { cn } from '@/lib/utils/cn'
import { PLATFORM_LABELS } from '@/lib/constants'
import { StatusBadge } from './StatusBadge'
import type { PlatformStatusItem } from '@/types/content'

interface PlatformStatusListProps {
  items: PlatformStatusItem[]
}

export function PlatformStatusList({ items }: PlatformStatusListProps) {
  if (!items.length) {
    return <p className="py-6 text-center text-[13px] text-gray-400">No social accounts connected</p>
  }

  return (
    <ul className="divide-y divide-canvas-border-subtle">
      {items.map((item) => (
        <li key={`${item.platform}-${item.accountName}`} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-[12px] font-bold text-gray-600">
              {PLATFORM_LABELS[item.platform].slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">{item.accountName}</p>
              <p className="text-[11px] text-gray-400">{PLATFORM_LABELS[item.platform]}</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </li>
      ))}
    </ul>
  )
}
