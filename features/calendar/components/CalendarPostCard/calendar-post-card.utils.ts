import type { AppCalendarSlotListItem } from '@/types/views'
import type { CalendarPostMetadata } from './calendar-post-card.types'

export const CALENDAR_STATUS_COLORS = {
  empty: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  published: 'bg-green-500/20 text-green-400 border-green-500/30',
  canceled: 'bg-red-500/20 text-red-400 border-red-500/30',
  skipped: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
} as const

export function formatSlotTime(timeStr: string | null): string {
  if (!timeStr) return '10:00 AM'
  
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  
  return `${displayHour}:${minutes} ${ampm}`
}

export function getCalendarPostMetadata(metadata: Record<string, unknown> | null): CalendarPostMetadata {
  return {
    primaryTopic: metadata?.primaryTopic as string | undefined,
    hashtags: Array.isArray(metadata?.hashtags) ? metadata.hashtags as string[] : [],
    targetGoal: metadata?.targetGoal as string | undefined,
    plannerDay: metadata?.plannerDay as number | undefined,
  }
}

export function getCalendarStatusVariant(status: string): string {
  return CALENDAR_STATUS_COLORS[status as keyof typeof CALENDAR_STATUS_COLORS] || CALENDAR_STATUS_COLORS.empty
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }
}
