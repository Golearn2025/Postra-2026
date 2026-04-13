'use client'

import { Button } from '@/components/ui/button'
import { Eye, Edit2, Pause } from 'lucide-react'
import type { CalendarPostActionsProps } from './calendar-post-card.types'

export function CalendarPostActions({ 
  compact = false,
  onView,
  onEdit,
  onPause
}: CalendarPostActionsProps) {
  const buttonSize = compact ? 'h-6 w-6' : 'h-8 w-8'
  const iconSize = compact ? 'h-3 w-3' : 'h-4 w-4'

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`${buttonSize} text-gray-400 hover:text-white hover:bg-[#2A2A2E]`}
        onClick={(e) => {
          e.stopPropagation()
          onView?.()
        }}
      >
        <Eye className={iconSize} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`${buttonSize} text-gray-400 hover:text-white hover:bg-[#2A2A2E]`}
        onClick={(e) => {
          e.stopPropagation()
          onEdit?.()
        }}
      >
        <Edit2 className={iconSize} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`${buttonSize} text-gray-400 hover:text-orange-400 hover:bg-orange-500/10`}
        onClick={(e) => {
          e.stopPropagation()
          onPause?.()
        }}
      >
        <Pause className={iconSize} />
      </Button>
    </div>
  )
}
