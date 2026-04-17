import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getOrganizationProfile } from '@/server/repositories/organization-profiles.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { CreateCampaignGuidedForm } from '@/features/campaigns/components/CreateCampaignGuidedForm'
import { getDefaultCampaignData } from '@/features/campaigns/utils/create-campaign.defaults'

export default async function NewCampaignPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // Read the selected organization from cookie
  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value

  const orgContext = await getCurrentOrganizationContext(user, selectedOrgSlug)
  if (!orgContext) {
    redirect('/onboarding')
  }

  // Get organization profile for prefilling defaults
  const supabase = await getSupabaseServerClient()
  const orgProfile = await getOrganizationProfile(supabase, orgContext.organization.id)

  // Get default values from organization profile
  const defaults = getDefaultCampaignData({
    primaryGoal: orgProfile?.primaryGoal || null,
    targetAudience: orgProfile?.targetAudience || null
  })

  return (
    <CreateCampaignGuidedForm
      organizationId={orgContext.organization.id}
      organizationName={orgContext.organization.name}
      initialData={defaults}
    />
  )
}
