import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AppCampaignDetail } from '@/types/views'

interface EditCampaignFormData {
  name: string
  campaignPillar?: string
  mainGoal?: string
  targetAudience?: string
  targetMarket: string
  scheduleType: string
  startDate?: string
  endDate?: string
  selectedDates: string[]
  description: string
  slug: string
  status: string
}

export function useEditCampaignForm(campaign: AppCampaignDetail, organizationId: string) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<EditCampaignFormData>({
    name: campaign.name || '',
    campaignPillar: campaign.campaign_pillar || undefined,
    mainGoal: campaign.objective || undefined,
    targetAudience: campaign.target_audience || undefined,
    targetMarket: campaign.target_market || '',
    scheduleType: campaign.schedule_type || 'date_range',
    startDate: campaign.start_date || '',
    endDate: campaign.end_date || '',
    selectedDates: campaign.selected_dates || [],
    description: campaign.description || '',
    slug: campaign.slug || '',
    status: campaign.status || 'draft'
  })

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
    if (!formData.selectedDates.includes(date)) {
      setFormData(prev => ({
        ...prev,
        selectedDates: [...prev.selectedDates, date].sort()
      }))
    }
  }

  const handleRemoveDate = (date: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDates: prev.selectedDates.filter(d => d !== date)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Campaign name is required'
    if (!formData.campaignPillar) newErrors.campaignPillar = 'Please select a campaign pillar'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          name: formData.name,
          campaign_pillar: formData.campaignPillar,
          objective: formData.mainGoal,
          target_audience: formData.targetAudience,
          target_market: formData.targetMarket,
          schedule_type: formData.scheduleType,
          start_date: formData.scheduleType === 'date_range' ? formData.startDate : undefined,
          end_date: formData.scheduleType === 'date_range' ? formData.endDate : undefined,
          selected_dates: formData.scheduleType === 'selected_dates' ? formData.selectedDates : undefined,
          slug: formData.slug,
          status: formData.status,
          description: formData.description,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update campaign')
      }

      router.push('/campaigns')
      router.refresh()
    } catch (error) {
      console.error('Failed to update campaign:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to update campaign' })
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleAddDate,
    handleRemoveDate,
    handleSubmit
  }
}
