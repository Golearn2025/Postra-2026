'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

interface SelectedDatesFieldsProps {
  selectedDates: string[]
  onAddDate: (dateStr: string) => void
  onRemoveDate: (dateStr: string) => void
  errors: Record<string, string>
}

export function SelectedDatesFields({
  selectedDates,
  onAddDate,
  onRemoveDate,
  errors
}: SelectedDatesFieldsProps) {
  const [newDate, setNewDate] = useState('')

  const handleAddDate = () => {
    if (newDate) {
      onAddDate(newDate)
      setNewDate('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Add Specific Dates</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="Select a date"
          />
          <Button type="button" onClick={handleAddDate} disabled={!newDate}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {selectedDates.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Dates ({selectedDates.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date) => (
              <div
                key={date}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md"
              >
                <span className="text-sm">{date}</span>
                <button
                  type="button"
                  onClick={() => onRemoveDate(date)}
                  className="text-primary/60 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.selectedDates && (
        <p className="text-sm text-destructive">{errors.selectedDates}</p>
      )}
    </div>
  )
}
