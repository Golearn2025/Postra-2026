import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getCampaignsListByOrganization } from '@/server/repositories/campaigns.repository'
import { getMediaAssetsListByOrganization } from '@/server/repositories/media-assets.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'
import { CampaignPlannerClient } from './CampaignPlannerClient'

export const metadata: Metadata = { title: 'Campaign Planner' }

export default async function CampaignPlannerPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  
  if (!orgContext) {
    redirect(appConfig.routes.home)
  }

  // Fetch campaigns and media assets server-side to eliminate client-side fetches
  const supabase = await getSupabaseServerClient()
  const campaigns = await getCampaignsListByOrganization(
    supabase,
    orgContext.organization.id,
    {},
    { column: 'created_at', direction: 'desc' },
    { page: 1, pageSize: 100 }
  )

  const mediaAssets = await getMediaAssetsListByOrganization(supabase, orgContext.organization.id, {})

  return <CampaignPlannerClient 
    organizationId={orgContext.organization.id} 
    userId={user.profile.id} 
    campaigns={campaigns.data}
    mediaAssets={mediaAssets}
  />
}
