'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SCHEDULE_TYPE_OPTIONS } from '../../constants/campaign-options'
import { calculateDuration } from '../../utils/campaign-display-helpers'

interface EditCampaignWhenSectionProps {
  formData: {
    scheduleType: string
    startDate?: string
    endDate?: string
    selectedDates: string[]
  }
  onChange: (field: string, value: any) => void
  onAddDate: (date: string) => void
  onRemoveDate: (date: string) => void
  errors: Record<string, string>
}

export function EditCampaignWhenSection({
  formData,
  onChange,
  onAddDate,
  onRemoveDate,
  errors
}: EditCampaignWhenSectionProps) {
  const duration = formData.scheduleType === 'date_range' && formData.startDate && formData.endDate
    ? calculateDuration(formData.startDate, formData.endDate)
    : null

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">When will this run?</h2>
        <p className="text-sm text-muted-foreground">
          Set the campaign timeline and schedule
        </p>
      </div>

      {/* Schedule Type */}
      <div className="space-y-3">
        <Label>Schedule Type</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCHEDULE_TYPE_OPTIONS.map((option) => {
            const isSelected = formData.scheduleType === option.value
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('scheduleType', option.value)}
                className={cn(
                  "p-3 border-2 rounded-lg text-left transition-all duration-200",
                  isSelected 
                    ? "border-accent bg-accent/5 shadow-sm" 
                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                )}
              >
                <div className={cn(
                  "font-medium text-sm",
                  isSelected && "text-accent"
                )}>
                  {option.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Date Range */}
      {formData.scheduleType === 'date_range' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => onChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-destructive' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => onChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-destructive' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          {duration !== null && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Duration: {duration} {duration === 1 ? 'day' : 'days'}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Selected Dates */}
      {formData.scheduleType === 'selected_dates' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newDate">Add Date</Label>
            <div className="flex gap-2">
              <Input
                id="newDate"
                type="date"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const target = e.target as HTMLInputElement
                    if (target.value) {
                      onAddDate(target.value)
                      target.value = ''
                    }
                  }
                }}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to add date
            </p>
          </div>

          {formData.selectedDates.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Dates ({formData.selectedDates.length})</Label>
              <div className="flex flex-wrap gap-2">
                {formData.selectedDates.map((date) => (
                  <div
                    key={date}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-sm"
                  >
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveDate(date)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
