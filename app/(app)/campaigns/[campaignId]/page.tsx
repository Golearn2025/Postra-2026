import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { CampaignStatusBadge } from '@/features/campaigns/components/CampaignStatusBadge'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getCampaignDetailById } from '@/server/repositories/campaigns.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'
import { CampaignDetailContent } from '@/features/campaigns/components/detail/CampaignDetailContent'
import { formatDate } from '@/lib/formatters/date'
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
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              href="/campaigns"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </Link>
          </div>

          <PageHeader
            title={campaign.name || 'Untitled Campaign'}
            description={`Last updated ${formatDate(campaign.updated_at || '')}`}
            actions={
              <div className="flex items-center gap-3">
                <CampaignStatusBadge status={campaign.status} />
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Campaign
                  </Button>
                </Link>
              </div>
            }
          />

          <div className="mx-auto max-w-5xl">
            <CampaignDetailContent campaign={campaign} />
          </div>
        </div>
      )
    }
  )
}
