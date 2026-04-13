'use client'

import { CampaignForm } from './CampaignForm'
import { createCampaignAction } from '@/server/actions/campaigns.actions'
import type { CampaignFormValues } from '../schemas/campaign.schema'

interface NewCampaignFormProps {
  organizationId: string
}

export function NewCampaignForm({ organizationId }: NewCampaignFormProps) {
  const handleSubmit = async (values: CampaignFormValues) => {
    return createCampaignAction(organizationId, values)
  }

  return (
    <CampaignForm
      onSubmit={handleSubmit}
      submitLabel="Create Campaign"
    />
  )
}
