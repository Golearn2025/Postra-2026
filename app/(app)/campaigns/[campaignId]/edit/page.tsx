import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getCampaignDetailById } from '@/server/repositories/campaigns.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'
import { EditCampaignFormGuided } from '@/features/campaigns/components/EditCampaignFormGuided'
import { withRouteInstrumentation } from '@/server/lib/observability/route-instrumentation'

export const metadata: Metadata = { title: 'Edit Campaign' }

interface EditCampaignPageProps {
  params: Promise<{ campaignId: string }>
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  return withRouteInstrumentation(
    {
      route: '/campaigns/[id]/edit',
      userId: undefined, // Will be set after getCurrentUser
      organizationId: undefined // Will be set after getCurrentOrganizationContext
    },
    async () => {
      const user = await getCurrentUser()
      if (!user) redirect(appConfig.routes.login)

      const cookieStore = await cookies()
      const selectedOrgSlug = cookieStore.get('selected-org')?.value
      const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
      if (!orgContext) redirect('/campaigns')

      const { campaignId } = await params
      const supabase = await getSupabaseServerClient()
      const campaign = await getCampaignDetailById(supabase, campaignId, orgContext!.organization.id)
      if (!campaign) notFound()

      return (
        <EditCampaignFormGuided
          campaign={campaign}
          organizationId={orgContext.organization.id}
        />
      )
    }
  )
}
