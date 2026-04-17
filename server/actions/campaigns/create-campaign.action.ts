'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { getOrganizationProfile } from '@/server/repositories/organization-profiles.repository'
import { createCampaign } from '@/server/repositories/campaigns.repository'
import { createCampaignSchema } from '@/features/campaigns/schemas/create-campaign.schema'
import { getDefaultCampaignData } from '@/features/campaigns/utils/create-campaign.defaults'
import type { CreateCampaignInput } from '@/features/campaigns/schemas/create-campaign.schema'

export async function createCampaignAction(
  organizationId: string,
  data: CreateCampaignInput
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validate input
  const parsed = createCampaignSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  
  // Get organization defaults for context (but don't override user input)
  const orgProfile = await getOrganizationProfile(supabase, organizationId)
  const defaults = getDefaultCampaignData({
    primaryGoal: orgProfile?.primaryGoal || null,
    targetAudience: orgProfile?.targetAudience || null
  })

  // Create campaign with validated data
  const campaign = await createCampaign(
    supabase,
    organizationId,
    user.profile.id,
    parsed.data
  )

  if (!campaign) {
    return { error: 'Failed to create campaign' }
  }

  revalidatePath('/campaigns')
  return { success: true, campaign }
}
