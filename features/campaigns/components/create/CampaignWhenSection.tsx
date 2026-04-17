'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ScheduleTypeSelector } from './ScheduleTypeSelector'
import { DateRangeFields } from './DateRangeFields'
import { SelectedDatesFields } from './SelectedDatesFields'
import { SCHEDULE_TYPE_OPTIONS } from '../../constants/campaign-options'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignWhenSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function CampaignWhenSection({
  formData,
  onChange,
  errors
}: CampaignWhenSectionProps) {
  const handleAddDate = (dateStr: string) => {
    if (!dateStr) return
    if (!formData.selectedDates.includes(dateStr)) {
      onChange('selectedDates', [...formData.selectedDates, dateStr].sort())
    }
  }

  const handleRemoveDate = (dateStr: string) => {
    onChange('selectedDates', formData.selectedDates.filter((d: string) => d !== dateStr))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">When will this run?</h2>
        <p className="text-sm text-muted-foreground">
          Set the timing and schedule for your campaign
        </p>
      </div>

      {/* Schedule Type */}
      <ScheduleTypeSelector
        value={formData.scheduleType}
        onChange={(value: any) => onChange('scheduleType', value)}
        errors={errors}
      />

      {/* Date Fields based on schedule type */}
      {formData.scheduleType === 'date_range' && (
        <DateRangeFields
          startDate={formData.startDate || ''}
          endDate={formData.endDate || ''}
          onStartDateChange={(value: string) => onChange('startDate', value)}
          onEndDateChange={(value: string) => onChange('endDate', value)}
          errors={errors}
        />
      )}

      {formData.scheduleType === 'selected_dates' && (
        <SelectedDatesFields
          selectedDates={formData.selectedDates}
          onAddDate={handleAddDate}
          onRemoveDate={handleRemoveDate}
          errors={errors}
        />
      )}

      {/* Continuous schedule info */}
          </div>
  )
}
