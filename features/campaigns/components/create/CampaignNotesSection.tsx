'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'
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
      {/* Section Header - Compact */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#6366f1] to-[#4f46e5]"></div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Additional Notes</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Add extra details or context for your campaign.
        </p>
      </div>

      {/* Campaign Description - Compact */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-semibold">Campaign Description</Label>
        <Textarea
          id="description"
          placeholder="Provide additional context, goals, or details about this campaign..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={6}
          className={cn(
            "text-sm resize-none",
            errors.description && 'border-destructive'
          )}
        />
        <p className="text-xs text-muted-foreground">
          Describe the campaign's purpose, key messages, or important context
        </p>
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>
    </div>
  )
}
