'use client'

import { useState } from 'react'
import type { AppCampaignDetail } from '@/types/views'
import type { CreateCampaignFormData, CampaignPillar, CampaignGoal, TargetAudience, ScheduleType } from '@/types/campaigns'
import { EditCampaignWhatSection } from '../edit/EditCampaignWhatSection'
import { EditCampaignWhoSection } from '../edit/EditCampaignWhoSection'
import { EditCampaignWhenSection } from '../edit/EditCampaignWhenSection'
import { EditCampaignNotesSection } from '../edit/EditCampaignNotesSection'

interface CampaignEditModeProps {
  campaign: AppCampaignDetail
  onSave: (data: CreateCampaignFormData) => void
  isSaving: boolean
}

export function CampaignEditMode({ campaign, onSave, isSaving }: CampaignEditModeProps) {
  const [formData, setFormData] = useState<CreateCampaignFormData>({
    name: campaign.name || '',
    campaignPillar: (campaign.campaign_pillar as CampaignPillar) || undefined,
    mainGoal: (campaign.objective as CampaignGoal) || undefined,
    targetAudience: (campaign.target_audience as TargetAudience) || undefined,
    targetMarket: campaign.target_market || undefined,
    scheduleType: (campaign.schedule_type as ScheduleType) || 'date_range',
    startDate: campaign.start_date || undefined,
    endDate: campaign.end_date || undefined,
    selectedDates: campaign.selected_dates || undefined,
    description: campaign.description || undefined,
    slug: campaign.slug || undefined,
    status: campaign.status
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddDate = (date: string) => {
    const currentDates = formData.selectedDates || []
    if (!currentDates.includes(date)) {
      setFormData(prev => ({ ...prev, selectedDates: [...currentDates, date].sort() }))
    }
  }

  const handleRemoveDate = (date: string) => {
    const currentDates = formData.selectedDates || []
    setFormData(prev => ({ ...prev, selectedDates: currentDates.filter(d => d !== date) }))
  }

  return (
    <div className="h-full overflow-y-auto">
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - What */}
          <div className="space-y-6">
            <EditCampaignWhatSection
              formData={formData as any}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* Middle Column - When */}
          <div className="space-y-6">
            <EditCampaignWhenSection
              formData={formData as any}
              onChange={handleChange}
              onAddDate={handleAddDate}
              onRemoveDate={handleRemoveDate}
              errors={errors}
            />
          </div>

          {/* Right Column - Who & Notes */}
          <div className="space-y-6">
            <EditCampaignWhoSection
              formData={formData as any}
              onChange={handleChange}
              errors={errors}
            />
            <EditCampaignNotesSection
              formData={formData as any}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
