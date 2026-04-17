'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CalendarIcon, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DateRangeFieldsProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  errors: Record<string, string>
}

export function DateRangeFields({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  errors
}: DateRangeFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-3">
          <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <span>Start Date <span className="text-[#6366f1]">*</span></span>
          </Label>
          <div className="relative">
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={cn(
                "h-11 text-sm pl-4 pr-4 border-2 rounded-lg transition-all",
                "focus:border-green-500 focus:ring-4 focus:ring-green-500/10",
                "hover:border-green-400",
                "[&::-webkit-calendar-picker-indicator]:opacity-100",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                "[&::-webkit-calendar-picker-indicator]:p-2",
                "[&::-webkit-calendar-picker-indicator]:rounded-md",
                "[&::-webkit-calendar-picker-indicator]:hover:bg-green-50",
                errors.startDate ? 'border-destructive' : 'border-slate-200 dark:border-slate-700'
              )}
            />
          </div>
          {errors.startDate && (
            <p className="text-xs text-destructive flex items-center gap-1">
              {errors.startDate}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-3">
          <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <span>End Date <span className="text-[#6366f1]">*</span></span>
          </Label>
          <div className="relative">
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={cn(
                "h-11 text-sm pl-4 pr-4 border-2 rounded-lg transition-all",
                "focus:border-red-500 focus:ring-4 focus:ring-red-500/10",
                "hover:border-red-400",
                "[&::-webkit-calendar-picker-indicator]:opacity-100",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                "[&::-webkit-calendar-picker-indicator]:p-2",
                "[&::-webkit-calendar-picker-indicator]:rounded-md",
                "[&::-webkit-calendar-picker-indicator]:hover:bg-red-50",
                errors.endDate ? 'border-destructive' : 'border-slate-200 dark:border-slate-700'
              )}
            />
          </div>
          {errors.endDate && (
            <p className="text-xs text-destructive flex items-center gap-1">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {startDate && endDate && (() => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-950/20 dark:to-red-950/20 rounded-lg border-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="w-4 h-4 text-green-600" />
                <span className="text-green-700 dark:text-green-400">{start.toLocaleDateString()}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="w-4 h-4 text-red-600" />
                <span className="text-red-700 dark:text-red-400">{end.toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Days Counter */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">{diffDays}</div>
                    <div className="text-xs text-white/80 font-medium">
                      {diffDays === 1 ? 'Day' : 'Days'} Selected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
