'use client'

import { Badge } from '@/components/ui/badge'
import type { AppCalendarSlotListItem } from '@/types/views'
import { getCalendarPostMetadata, truncateText } from './calendar-post-card.utils'

interface CalendarPostMetaProps {
  slot: AppCalendarSlotListItem
  showCaption?: boolean
  showHashtags?: boolean
  maxCaptionLength?: number
}

export function CalendarPostMeta({ 
  slot, 
  showCaption = false,
  showHashtags = false,
  maxCaptionLength = 60
}: CalendarPostMetaProps) {
  const meta = getCalendarPostMetadata(slot.post_metadata)

  return (
    <div className="space-y-2">
      {/* Campaign Badge */}
      {slot.campaign_name && (
        <span className="bg-[#2A2A2E] px-2 py-1 rounded-full text-xs text-gray-300 inline-block">
          {truncateText(slot.campaign_name, 20)}
        </span>
      )}

      {/* Primary Topic */}
      {meta.primaryTopic && (
        <span className="text-xs text-gray-400">
          {truncateText(meta.primaryTopic, 25)}
        </span>
      )}

      {/* Caption Preview */}
      {showCaption && slot.post_caption_master && (
        <p className="text-gray-400 text-sm line-clamp-2">
          {truncateText(slot.post_caption_master, maxCaptionLength)}
        </p>
      )}

      {/* Hashtags */}
      {showHashtags && meta.hashtags && meta.hashtags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {meta.hashtags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
              {truncateText(tag, 10)}
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
  )
}
