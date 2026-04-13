import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { CalendarPostCard } from './CalendarPostCard'
import { 
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
  List
} from 'lucide-react'
import type { AppCalendarSlotListItem } from '@/types/views'
import { cn } from '@/lib/utils/cn'

interface CalendarUpcomingPanelProps {
  upcomingSlots: AppCalendarSlotListItem[]
  onViewFullAgenda?: () => void
}

export function CalendarUpcomingPanel({ 
  upcomingSlots, 
  onViewFullAgenda 
}: CalendarUpcomingPanelProps) {
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '10:00 AM'
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateStr: string) => {
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      published: 'bg-green-500/20 text-green-400 border-green-500/30',
      canceled: 'bg-red-500/20 text-red-400 border-red-500/30',
      empty: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      skipped: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    }
    return colors[status] || colors.empty
  }

  // Group by date
  const groupedByDate = upcomingSlots.reduce((acc, slot) => {
    const dateStr = slot.slot_date
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(slot)
    return acc
  }, {} as Record<string, AppCalendarSlotListItem[]>)

  return (
    <div className="space-y-6">
      {/* Upcoming Posts */}
      <PremiumCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Upcoming (Next 7 Days)</h3>
          </div>
          
          {upcomingSlots.length > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {upcomingSlots.length}
            </Badge>
          )}
        </div>
        
        <div className="space-y-4">
          {upcomingSlots.length > 0 ? (
            Object.entries(groupedByDate).map(([dateStr, slots]) => (
              <div key={dateStr} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(dateStr)}
                </div>
                
                {/* Slots for this date */}
                {slots
                  .sort((a, b) => (a.slot_time || '').localeCompare(b.slot_time || ''))
                  .map((slot) => {
                    const meta = slot.post_metadata as Record<string, unknown> | null ?? {}
                    
                    return (
                      <div
                        key={slot.id}
                        className="bg-[#111113] border border-[#2A2A2E] rounded-lg p-3 hover:border-blue-500/50 cursor-pointer transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Media Preview */}
                          <div className="flex-shrink-0">
                            {slot.media_storage_path ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-blue-500/30">
                                <img 
                                  src={slot.thumbnailUrl || slot.signedUrl}
                                  alt={slot.post_title || 'Post thumbnail'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                          <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                        </div>
                                      `
                                    }
                                  }}
                                />
                              </div>
                            ) : slot.primary_media_asset_id ? (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-blue-400" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#2A2A2E] border border-[#3A3A3E] flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-blue-400 font-medium">
                                {formatTime(slot.slot_time)}
                              </span>
                              <Badge className={cn('text-xs', getStatusColor(slot.slot_status))}>
                                {slot.slot_status}
                              </Badge>
                            </div>
                            
                            <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">
                              {slot.post_title || 'Untitled Post'}
                            </h4>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {slot.campaign_name && (
                                <span className="bg-[#2A2A2E] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                                  {slot.campaign_name}
                                </span>
                              )}
                              {(meta.primaryTopic as string) && (
                                <span className="truncate">{meta.primaryTopic as string}</span>
                              )}
                            </div>

                            {/* Preview hashtags */}
                            {(meta.hashtags as string[]) && Array.isArray(meta.hashtags) && meta.hashtags.length > 0 && (
                              <div className="mt-2 flex gap-1">
                                {meta.hashtags.slice(0, 2).map((tag: string, idx: number) => (
                                  <span key={idx} className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">
                                    {tag}
                                  </span>
                                ))}
                                {meta.hashtags.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{meta.hashtags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-[#2A2A2E]"
                              // onClick={() => handleEdit(slot)}
                            >
                              <div className="h-3 w-3 bg-current rounded-sm" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No upcoming posts</p>
              <p className="text-gray-500 text-xs mt-1">Posts scheduled for the next 7 days will appear here</p>
            </div>
          )}
        </div>
        
        {upcomingSlots.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#2A2A2E]">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewFullAgenda}
              className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
            >
              <List className="h-4 w-4 mr-2" />
              View Full Agenda
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        )}
      </PremiumCard>

      {/* Quick Actions */}
      <PremiumCard variant="dark" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white justify-start"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white justify-start"
          >
            <Clock className="h-4 w-4 mr-2" />
            Reschedule
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white justify-start"
          >
            <div className="h-4 w-4 mr-2 bg-current rounded-sm" />
            Upload Media
          </Button>
        </div>
      </PremiumCard>
    </div>
  )
}
