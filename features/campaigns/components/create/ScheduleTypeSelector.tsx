'use client'

import { Label } from '@/components/ui/label'
import { SCHEDULE_TYPE_OPTIONS } from '../../constants/campaign-options'
import type { ScheduleType } from '@/types/campaigns'

interface ScheduleTypeSelectorProps {
  value: ScheduleType
  onChange: (value: ScheduleType) => void
  errors: Record<string, string>
}

export function ScheduleTypeSelector({
  value,
  onChange,
  errors
}: ScheduleTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Schedule Type *</Label>
      <p className="text-sm text-muted-foreground">
        How do you want to schedule this campaign?
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SCHEDULE_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="font-medium">{option.label}</div>
          </button>
        ))}
      </div>
      {errors.scheduleType && (
        <p className="text-sm text-destructive">{errors.scheduleType}</p>
      )}
    </div>
  )
}
