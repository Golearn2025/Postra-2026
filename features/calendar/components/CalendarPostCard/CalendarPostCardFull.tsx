'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import type { AppCalendarSlotListItem } from '@/types/views'
import { CalendarPostMediaPreview } from './CalendarPostMediaPreview'
import { CalendarPostActions } from './CalendarPostActions'
import { CalendarPostMeta } from './CalendarPostMeta'
import { formatSlotTime, getCalendarStatusVariant } from './calendar-post-card.utils'

interface CalendarPostCardFullProps {
  slot: AppCalendarSlotListItem
  showActions?: boolean
  onClick?: () => void
  onView?: () => void
  onEdit?: () => void
  onPause?: () => void
}

export function CalendarPostCardFull({ 
  slot, 
  showActions = true,
  onClick,
  onView,
  onEdit,
  onPause
}: CalendarPostCardFullProps) {
  const statusColor = getCalendarStatusVariant(slot.slot_status)

  return (
    <div
      className={cn(
        'bg-[#111113] border border-[#2A2A2E] rounded-xl p-4 hover:border-blue-500/50 cursor-pointer transition-all duration-200 hover:shadow-xl',
        'group'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Media Preview */}
        <CalendarPostMediaPreview slot={slot} compact={false} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Time and Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-400 font-medium">
              {formatSlotTime(slot.slot_time)}
            </span>
            <Badge className={statusColor}>
              {slot.slot_status}
            </Badge>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-white mb-2 text-lg line-clamp-2">
            {slot.post_title || 'Untitled Post'}
          </h3>
          
          {/* Metadata */}
          <CalendarPostMeta 
            slot={slot} 
            showCaption={true}
            showHashtags={true}
            maxCaptionLength={100}
          />
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-[#2A2A2E] flex justify-end">
          <CalendarPostActions
            compact={false}
            onView={onView}
            onEdit={onEdit}
            onPause={onPause}
          />
        </div>
      )}
    </div>
  )
}
