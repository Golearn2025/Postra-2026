'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Users, Briefcase, Plane, Building, PartyPopper, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { TARGET_AUDIENCE_OPTIONS } from '../../constants/campaign-options'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignWhoSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const audienceIcons = {
  general_audience: Users,
  business_clients: Briefcase,
  luxury_travelers: Plane,
  hotel_guests: Building,
  event_attendees: PartyPopper,
  tourists_visitors: MapPin
} as const

export function CampaignWhoSection({
  formData,
  onChange,
  errors
}: CampaignWhoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header - Compact */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#6366f1] to-[#4f46e5]"></div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Who are you targeting?</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Define your target audience and market.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Target Audience - Left Column */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Target Audience</Label>
          <p className="text-xs text-muted-foreground">
            Select your primary audience
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {TARGET_AUDIENCE_OPTIONS.map((option) => {
              const Icon = audienceIcons[option.value as keyof typeof audienceIcons]
              const isSelected = formData.targetAudience === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange('targetAudience', option.value)}
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
          {errors.targetAudience && (
            <p className="text-xs text-destructive">{errors.targetAudience}</p>
          )}
        </div>

        {/* Target Market - Right Column */}
        <div className="space-y-3">
          <Label htmlFor="targetMarket" className="text-sm font-semibold">Target Market</Label>
          <p className="text-xs text-muted-foreground">
            Geographic scope or market segment
          </p>
          <Input
            id="targetMarket"
            type="text"
            placeholder="e.g., Local, National, Specific regions"
            value={formData.targetMarket}
            onChange={(e) => onChange('targetMarket', e.target.value)}
            className={cn(
              "h-11 text-sm",
              errors.targetMarket && 'border-destructive'
            )}
          />
          {errors.targetMarket && (
            <p className="text-xs text-destructive">{errors.targetMarket}</p>
          )}
        </div>
      </div>
    </div>
  )
}
