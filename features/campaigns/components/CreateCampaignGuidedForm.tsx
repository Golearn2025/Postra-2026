'use client'

import { useRouter } from 'next/navigation'
import { CampaignFormShell } from './create/CampaignFormShell'
import { CampaignFormRoot } from './create/CampaignFormRoot'
import { createCampaignSchema } from '../schemas/create-campaign.schema'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CreateCampaignGuidedFormProps {
  organizationId: string
  organizationName: string
  initialData?: Partial<CreateCampaignFormData>
}

export function CreateCampaignGuidedForm({
  organizationId,
  organizationName,
  initialData
}: CreateCampaignGuidedFormProps) {
  const router = useRouter()

  const handleSubmit = async (data: CreateCampaignFormData) => {
    try {
      // Validate data
      const parsed = createCampaignSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message ?? 'Invalid data')
      }

      // Submit to API
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: parsed.data,
          organizationId
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create campaign')
      }

      router.push('/campaigns')
    } catch (error) {
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/campaigns')
  }

  return (
    <CampaignFormShell 
      organizationName={organizationName}
      onCancel={handleCancel}
    >
      <CampaignFormRoot
        organizationId={organizationId}
        organizationName={organizationName}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </CampaignFormShell>
  )
}
