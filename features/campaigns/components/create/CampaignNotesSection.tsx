'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignNotesSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function CampaignNotesSection({
  formData,
  onChange,
  errors
}: CampaignNotesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Additional Notes</h2>
        <p className="text-sm text-muted-foreground">
          Add any extra details or context for your campaign
        </p>
      </div>

      {/* Campaign Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Campaign Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Provide additional context, goals, or details about this campaign..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        <p className="text-sm text-muted-foreground">
          Describe the campaign's purpose, key messages, or any important context
        </p>
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>
    </div>
  )
}
