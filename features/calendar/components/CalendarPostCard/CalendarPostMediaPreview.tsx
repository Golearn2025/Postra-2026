'use client'

import { useState, memo, useCallback } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { AppCalendarSlotListItem } from '@/types/views'
import type { CalendarPostMediaPreviewProps } from './calendar-post-card.types'

const CalendarPostMediaPreview = memo(function CalendarPostMediaPreview({ 
  slot, 
  compact = false,
  onImageError 
}: CalendarPostMediaPreviewProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const size = compact ? 'w-12 h-12' : 'w-16 h-16'
  const iconSize = compact ? 'h-6 w-6' : 'h-8 w-8'
  const borderRadius = compact ? 'rounded-lg' : 'rounded-xl'

  // Handle image error with proper React state
  const handleImageError = useCallback(() => {
    setImageFailed(true)
    onImageError?.()
  }, [onImageError])

  // Show fallback if no media or image failed
  if (!slot.media_storage_path || imageFailed) {
    return (
      <div className={`${size} ${borderRadius} bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0`}>
        <CalendarIcon className={`${iconSize} text-blue-400`} />
      </div>
    )
  }

  // Show real image
  return (
    <div className={`${size} ${borderRadius} overflow-hidden border border-blue-500/30 flex-shrink-0`}>
      <img 
        src={slot.thumbnailUrl || slot.signedUrl}
        alt={slot.post_title || 'Post thumbnail'}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
})

export { CalendarPostMediaPreview }
