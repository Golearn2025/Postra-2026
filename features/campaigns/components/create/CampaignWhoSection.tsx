'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TARGET_AUDIENCE_OPTIONS } from '../../constants/campaign-options'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignWhoSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function CampaignWhoSection({
  formData,
  onChange,
  errors
}: CampaignWhoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Who are you targeting?</h2>
        <p className="text-sm text-muted-foreground">
          Define your target audience and market to focus your campaign effectively
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <Label>Target Audience</Label>
        <p className="text-sm text-muted-foreground">
          Who is your primary audience for this campaign?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TARGET_AUDIENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('targetAudience', option.value)}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${formData.targetAudience === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        {errors.targetAudience && (
          <p className="text-sm text-destructive">{errors.targetAudience}</p>
        )}
      </div>

      {/* Target Market */}
      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market (Optional)</Label>
        <Input
          id="targetMarket"
          type="text"
          placeholder="e.g., Local market, National market, Specific regions"
          value={formData.targetMarket}
          onChange={(e) => onChange('targetMarket', e.target.value)}
          className={errors.targetMarket ? 'border-destructive' : ''}
        />
        <p className="text-sm text-muted-foreground">
          Specify the geographic scope or market segment
        </p>
        {errors.targetMarket && (
          <p className="text-sm text-destructive">{errors.targetMarket}</p>
        )}
      </div>
    </div>
  )
}
