'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus, CalendarIcon, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SelectedDatesFieldsProps {
  selectedDates: string[]
  onDateToggle: (dateStr: string) => void
  errors: Record<string, string>
}

export function SelectedDatesFields({
  selectedDates,
  onDateToggle,
  errors
}: SelectedDatesFieldsProps) {
  const [newDate, setNewDate] = useState('')

  const handleAddDate = () => {
    if (newDate) {
      onDateToggle(newDate)
      setNewDate('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Date Input */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <span>Select Dates</span>
        </Label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Select a date"
              className={cn(
                "h-11 text-sm pl-4 pr-4 border-2 rounded-lg transition-all",
                "focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10",
                "hover:border-[#6366f1]/50",
                "[&::-webkit-calendar-picker-indicator]:opacity-100",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                "[&::-webkit-calendar-picker-indicator]:p-2",
                "[&::-webkit-calendar-picker-indicator]:rounded-md",
                "[&::-webkit-calendar-picker-indicator]:hover:bg-[#6366f1]/10",
                "border-slate-200 dark:border-slate-700"
              )}
            />
          </div>
          <Button 
            type="button" 
            onClick={handleAddDate} 
            disabled={!newDate}
            className="h-11 px-6 gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white shadow-lg shadow-[#6366f1]/25"
          >
            <Plus className="h-4 w-4" />
            Add Date
          </Button>
        </div>
      </div>

      {/* Selected Dates Display */}
      {selectedDates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">
              Selected Dates ({selectedDates.length})
            </Label>
            {selectedDates.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Click × to remove
              </span>
            )}
          </div>
          
          {/* Days Counter - Prominent Display */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{selectedDates.length}</div>
                  <div className="text-xs text-white/80 font-medium">
                    {selectedDates.length === 1 ? 'Day' : 'Days'} Selected
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border-2 border-[#6366f1] rounded-lg shadow-sm group hover:shadow-md transition-all"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#6366f1]" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDateToggle(date)}
                    className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedDates.length === 0 && (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="text-sm text-muted-foreground">
            No dates selected yet. Add specific dates above.
          </p>
        </div>
      )}

      {errors.selectedDates && (
        <p className="text-xs text-destructive">{errors.selectedDates}</p>
      )}
    </div>
  )
}
