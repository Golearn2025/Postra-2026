'use client'

import type { AppCalendarSlotListItem } from '@/types/views'
import type { CalendarPostCardProps } from './calendar-post-card.types'
import { CalendarPostCardCompact } from './CalendarPostCardCompact'
import { CalendarPostCardFull } from './CalendarPostCardFull'

export function CalendarPostCard({ 
  slot, 
  compact = false, 
  showActions = true,
  onClick,
  onView,
  onEdit,
  onPause
}: CalendarPostCardProps) {
  // Choose the appropriate card based on compact prop
  if (compact) {
    return (
      <CalendarPostCardCompact 
        slot={slot} 
        onClick={onClick}
      />
    )
  }

  return (
    <CalendarPostCardFull 
      slot={slot}
      showActions={showActions}
      onClick={onClick}
      onView={onView}
      onEdit={onEdit}
      onPause={onPause}
    />
  )
}
