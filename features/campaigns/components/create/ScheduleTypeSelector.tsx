'use client'

import { Label } from '@/components/ui/label'
import { CalendarRange, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SCHEDULE_TYPE_OPTIONS } from '../../constants/campaign-options'
import type { ScheduleType } from '@/types/campaigns'

interface ScheduleTypeSelectorProps {
  value: ScheduleType
  onChange: (value: ScheduleType) => void
  errors: Record<string, string>
}

const scheduleIcons = {
  date_range: CalendarRange,
  selected_dates: CalendarDays
} as const

export function ScheduleTypeSelector({
  value,
  onChange,
  errors
}: ScheduleTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">Schedule Type <span className="text-[#6366f1]">*</span></Label>
      <p className="text-xs text-muted-foreground">
        Choose how to schedule this campaign
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {SCHEDULE_TYPE_OPTIONS.map((option) => {
          const Icon = scheduleIcons[option.value as keyof typeof scheduleIcons]
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left group relative overflow-hidden",
                isSelected
                  ? 'border-[#6366f1] bg-gradient-to-br from-[#eef2ff] to-white dark:from-[#6366f1]/10 dark:to-transparent shadow-lg shadow-[#6366f1]/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-[#6366f1]/50 hover:shadow-md'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  isSelected 
                    ? "bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#6366f1]/10"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-sm mb-1",
                    isSelected && "text-[#6366f1]"
                  )}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {errors.scheduleType && (
        <p className="text-xs text-destructive">{errors.scheduleType}</p>
      )}
    </div>
  )
}
