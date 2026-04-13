import type { AppCalendarSlotListItem } from '@/types/views'

export interface CalendarPostMetadata {
  primaryTopic?: string
  hashtags?: string[]
  targetGoal?: string
  plannerDay?: number
}

export interface CalendarPostCardProps {
  slot: AppCalendarSlotListItem
  compact?: boolean
  showActions?: boolean
  onClick?: () => void
  onView?: () => void
  onEdit?: () => void
  onPause?: () => void
}

export interface CalendarPostMediaPreviewProps {
  slot: AppCalendarSlotListItem
  compact?: boolean
  onImageError?: () => void
}

export interface CalendarPostActionsProps {
  compact?: boolean
  onView?: () => void
  onEdit?: () => void
  onPause?: () => void
}
