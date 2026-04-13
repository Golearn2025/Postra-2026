'use client'

import { CampaignForm } from './CampaignForm'
import { updateCampaignAction } from '@/server/actions/campaigns.actions'
import type { AppCampaignDetail } from '@/types/views'
import type { CampaignFormValues } from '../schemas/campaign.schema'

interface EditCampaignFormProps {
  campaign: AppCampaignDetail
  organizationId: string
}

export function EditCampaignForm({ campaign, organizationId }: EditCampaignFormProps) {
  const handleSubmit = async (values: CampaignFormValues) => {
    return updateCampaignAction(campaign.id, organizationId, values)
  }

  // Convert AppCampaignDetail to form-compatible values
  const formValues = {
    name: campaign.name || '',
    slug: campaign.slug || '',
    status: campaign.status,
    pillar: campaign.pillar,
    objective: campaign.objective || '',
    target_audience: campaign.target_audience || '',
    target_market: campaign.target_market || '',
    timezone: campaign.timezone || '',
    start_date: campaign.start_date,
    end_date: campaign.end_date,
    description: campaign.description || '',
  }

  return (
    <CampaignForm
      defaultValues={formValues}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
    />
  )
}
