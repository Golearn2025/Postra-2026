// Wrapper pentru componenta modulara CalendarPostCard
import { CalendarPostCard as ModularCalendarPostCard } from '@/features/calendar/components/CalendarPostCard/CalendarPostCard'
import type { AppCalendarSlotListItem } from '@/types/views'

interface CalendarPostCardProps {
  slot: AppCalendarSlotListItem
  compact?: boolean
  showActions?: boolean
  onClick?: () => void
  onView?: () => void
  onEdit?: () => void
  onPause?: () => void
}

export function CalendarPostCard(props: CalendarPostCardProps) {
  return <ModularCalendarPostCard {...props} />
}
