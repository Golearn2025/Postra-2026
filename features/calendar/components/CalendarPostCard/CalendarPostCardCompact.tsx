'use client'

import { cn } from '@/lib/utils/cn'
import type { AppCalendarSlotListItem } from '@/types/views'
import { CalendarPostMediaPreview } from './CalendarPostMediaPreview'
import { formatSlotTime, truncateText } from './calendar-post-card.utils'

interface CalendarPostCardCompactProps {
  slot: AppCalendarSlotListItem
  onClick?: () => void
}

export function CalendarPostCardCompact({ slot, onClick }: CalendarPostCardCompactProps) {
  return (
    <div
      className={cn(
        'bg-[#111113] border border-[#2A2A2E] rounded-lg p-2 hover:border-blue-500/50 cursor-pointer transition-all duration-200',
        'flex flex-col items-center justify-center text-center min-h-[80px]'
      )}
      onClick={onClick}
    >
      {/* Media Preview - Centered */}
      <CalendarPostMediaPreview slot={slot} compact={true} />
      
      {/* Title - Short, Centered */}
      <h3 className="font-semibold text-white text-xs mt-2 line-clamp-2 px-1">
        {truncateText(slot.post_title || 'Untitled Post', 25)}
      </h3>
      
      {/* Time - Small, Centered */}
      <span className="text-xs text-blue-400 mt-1">
        {formatSlotTime(slot.slot_time)}
      </span>
    </div>
  )
}
