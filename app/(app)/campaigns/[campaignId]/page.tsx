import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getCampaignDetailById } from '@/server/repositories/campaigns.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'
import { CampaignViewEdit } from '@/features/campaigns/components/detail/CampaignViewEdit'
import { withRouteInstrumentation } from '@/server/lib/observability/route-instrumentation'

export const metadata: Metadata = { title: 'Campaign' }

interface CampaignDetailPageProps {
  params: Promise<{ campaignId: string }>
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  return withRouteInstrumentation(
    {
      route: '/campaigns/[id]',
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
        <CampaignViewEdit
          campaign={campaign}
          organizationName={orgContext!.organization.name}
        />
      )
    }
  )
}
