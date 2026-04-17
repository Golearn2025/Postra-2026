'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { TARGET_AUDIENCE_OPTIONS } from '../../constants/campaign-options'

interface EditCampaignWhoSectionProps {
  formData: {
    targetAudience?: string
    targetMarket: string
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function EditCampaignWhoSection({
  formData,
  onChange,
  errors
}: EditCampaignWhoSectionProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Who is this for?</h2>
        <p className="text-sm text-muted-foreground">
          Define your target audience and market
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <Label>Target Audience</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TARGET_AUDIENCE_OPTIONS.map((option) => {
            const isSelected = formData.targetAudience === option.value
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('targetAudience', option.value)}
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

      {/* Target Market */}
      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market / Location</Label>
        <Input
          id="targetMarket"
          type="text"
          placeholder="e.g., United States, Europe, Global"
          value={formData.targetMarket}
          onChange={(e) => onChange('targetMarket', e.target.value)}
        />
      </div>
    </Card>
  )
}
