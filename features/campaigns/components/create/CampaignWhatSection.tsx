'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone, Lightbulb, Heart, BookOpen, Calendar, Users, TrendingUp, MessageCircle, UserPlus, Tag, CalendarCheck } from 'lucide-react'
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

const goalIcons = {
  brand_awareness: TrendingUp,
  drive_engagement: MessageCircle,
  generate_leads: UserPlus,
  promote_offer: Tag,
  drive_bookings: CalendarCheck
} as const

export function CampaignWhatSection({
  formData,
  onChange,
  errors
}: CampaignWhatSectionProps) {
  return (
    <div className="space-y-6">
      {/* Premium Section Header - Compact */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#6366f1] to-[#4f46e5]"></div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">What are you creating?</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Define your campaign name and core focus.
        </p>
      </div>

      {/* Campaign Name - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="campaignName" className="text-sm font-semibold text-foreground">
          Campaign Name <span className="text-[#6366f1]">*</span>
        </Label>
        <Input
          id="campaignName"
          type="text"
          placeholder="e.g., Summer Product Launch, Holiday Promotion"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={cn(
            "h-11 text-sm border-border focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10",
            errors.name && "border-destructive focus:border-destructive/50"
          )}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Two Column Layout for Pillar & Goal */}
      <div className="grid grid-cols-2 gap-6">
        {/* Campaign Pillar - Left Column */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Campaign Pillar <span className="text-[#6366f1]">*</span></Label>
          <p className="text-xs text-muted-foreground">
            Select your campaign focus
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {CAMPAIGN_PILLAR_OPTIONS.map((option) => {
              const Icon = pillarIcons[option.value as keyof typeof pillarIcons]
              const isSelected = formData.campaignPillar === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange('campaignPillar', option.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left group",
                    isSelected
                      ? 'border-[#6366f1] bg-[#eef2ff] dark:bg-[#6366f1]/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-[#6366f1]/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      isSelected 
                        ? "bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#6366f1]/10"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected && "text-[#6366f1]"
                    )}>{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {errors.campaignPillar && (
            <p className="text-xs text-destructive">{errors.campaignPillar}</p>
          )}
        </div>

        {/* Main Goal - Right Column */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Main Goal <span className="text-[#6366f1]">*</span></Label>
          <p className="text-xs text-muted-foreground">
            Choose your primary objective
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {CAMPAIGN_GOAL_OPTIONS.map((option) => {
              const Icon = goalIcons[option.value as keyof typeof goalIcons]
              const isSelected = formData.mainGoal === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange('mainGoal', option.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left group",
                    isSelected
                      ? 'border-[#6366f1] bg-[#eef2ff] dark:bg-[#6366f1]/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-[#6366f1]/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      isSelected 
                        ? "bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#6366f1]/10"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected && "text-[#6366f1]"
                    )}>{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
          {errors.mainGoal && (
            <p className="text-xs text-destructive">{errors.mainGoal}</p>
          )}
        </div>
      </div>
    </div>
  )
}
