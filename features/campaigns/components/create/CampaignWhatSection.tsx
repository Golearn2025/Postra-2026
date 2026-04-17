'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone, Lightbulb, Heart, BookOpen, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CAMPAIGN_PILLAR_OPTIONS, CAMPAIGN_GOAL_OPTIONS } from '../../constants/campaign-options'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignWhatSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const pillarIcons = {
  brand_awareness: Megaphone,
  service_promotion: Lightbulb,
  customer_trust: Heart,
  education_tips: BookOpen,
  seasonal_event: Calendar,
  brand_story: Users
} as const

export function CampaignWhatSection({
  formData,
  onChange,
  errors
}: CampaignWhatSectionProps) {
  return (
    <div className="space-y-8">
      {/* Premium Section Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-accent/60"></div>
          <h2 className="text-2xl font-bold tracking-tight">What are you creating?</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Start with a clear name and define the main content direction for your campaign. This will help guide all your content decisions.
        </p>
      </div>

      {/* Premium Campaign Name */}
      <div className="space-y-3">
        <Label htmlFor="campaignName" className="text-sm font-semibold text-foreground">
          Campaign Name <span className="text-accent">*</span>
        </Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="e.g., Summer Product Launch, Holiday Promotion"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={cn(
            "h-12 text-base border-border/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all duration-200",
            errors.name && "border-destructive focus:border-destructive/50 focus:ring-destructive/10"
          )}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Campaign Pillar */}
      <div className="space-y-3">
        <Label>Campaign Pillar *</Label>
        <p className="text-sm text-muted-foreground">
          What is the main focus of this campaign?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAMPAIGN_PILLAR_OPTIONS.map((option) => {
            const Icon = pillarIcons[option.value as keyof typeof pillarIcons]
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('campaignPillar', option.value)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${formData.campaignPillar === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
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
          {CAMPAIGN_GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('mainGoal', option.value)}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${formData.mainGoal === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        {errors.mainGoal && (
          <p className="text-sm text-destructive">{errors.mainGoal}</p>
        )}
      </div>
    </div>
  )
}
