'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone, Lightbulb, Heart, BookOpen, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CAMPAIGN_PILLAR_OPTIONS, CAMPAIGN_GOAL_OPTIONS } from '../../constants/campaign-options'
import type { CampaignPillar } from '@/types/campaigns'

interface EditCampaignWhatSectionProps {
  formData: {
    name: string
    description: string
    campaignPillar?: string
    mainGoal?: string
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const pillarIcons: Record<string, any> = {
  brand_awareness: Megaphone,
  service_promotion: Lightbulb,
  customer_trust: Heart,
  education_tips: BookOpen,
  seasonal_event: Calendar,
  brand_story: Users
}

export function EditCampaignWhatSection({
  formData,
  onChange,
  errors
}: EditCampaignWhatSectionProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">What are you creating?</h2>
        <p className="text-sm text-muted-foreground">
          Update the name and main content direction for your campaign
        </p>
      </div>

      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaignName">Campaign Name *</Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="e.g., Summer Product Launch, Holiday Promotion"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Campaign Pillar */}
      <div className="space-y-3">
        <Label>Campaign Pillar *</Label>
        <p className="text-sm text-muted-foreground">
          What is the main focus of the campaign?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAMPAIGN_PILLAR_OPTIONS.map((option) => {
            const Icon = pillarIcons[option.value] || Megaphone
            const isSelected = formData.campaignPillar === option.value
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('campaignPillar', option.value)}
                className={cn(
                  "flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all duration-200",
                  isSelected 
                    ? "border-accent bg-accent/5 shadow-sm" 
                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  isSelected ? "text-accent" : "text-muted-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm mb-1",
                    isSelected && "text-accent"
                  )}>
                    {option.label}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {option.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        {errors.campaignPillar && (
          <p className="text-sm text-destructive">{errors.campaignPillar}</p>
        )}
      </div>

      {/* Main Goal */}
      <div className="space-y-3">
        <Label>Main Goal</Label>
        <p className="text-sm text-muted-foreground">
          What specific outcome do you want to achieve?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAMPAIGN_GOAL_OPTIONS.map((option) => {
            const isSelected = formData.mainGoal === option.value
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('mainGoal', option.value)}
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
    </Card>
  )
}
