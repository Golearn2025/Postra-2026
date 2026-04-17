import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Megaphone } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { CampaignsListClientWrapper } from '@/features/campaigns/components/list/CampaignsListClientWrapper'
import { CampaignsTabsWrapper } from '@/features/campaigns/components/CampaignsTabsWrapper'
import { CampaignFilters } from '@/features/campaigns/components/CampaignFilters'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getCampaignsListByOrganization, getCampaignsArchivedListByOrganization } from '@/server/repositories/campaigns.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { appConfig } from '@/config/app-config'
import { withRouteInstrumentation } from '@/server/lib/observability/route-instrumentation'


export const metadata: Metadata = { title: 'Campaigns' }

interface CampaignsPageProps {
  searchParams: Promise<{ 
    search?: string
    status?: string
    pillar?: string
    page?: string
    pageSize?: string
    sortBy?: string
    sortDir?: string
    success?: string
    tab?: 'active' | 'archived'
  }>
}

export default async function CampaignsPage({ searchParams }: CampaignsPageProps) {
  return withRouteInstrumentation(
    {
      route: '/campaigns',
      userId: undefined, // Will be set after getCurrentUser
      organizationId: undefined // Will be set after getCurrentOrganizationContext
    },
    async () => {
      const user = await getCurrentUser()
      if (!user) redirect(appConfig.routes.login)

      const cookieStore = await cookies()
      const selectedOrgSlug = cookieStore.get('selected-org')?.value
      const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
      if (!orgContext) {
        return (
          <div className="space-y-6">
            <PageHeader title="Campaigns" description="Manage your content campaigns." />
            <EmptyState icon={Megaphone} title="No organization selected" description="Select an organization to view campaigns." />
          </div>
        )
      }

      const params = await searchParams
      const supabase = await getSupabaseServerClient()
      const activeTab = params.tab || 'active'
      
      // Fetch data based on active tab
      const result = activeTab === 'archived' 
        ? await getCampaignsArchivedListByOrganization(
            supabase,
            orgContext.organization.id,
            {
              search: params.search,
              status: params.status,
              pillar: params.pillar,
            },
            {
              column: params.sortBy,
              direction: params.sortDir as 'asc' | 'desc' | undefined,
            },
            {
              page: params.page ? parseInt(params.page) : 1,
              pageSize: params.pageSize ? parseInt(params.pageSize) : 25,
            }
          )
        : await getCampaignsListByOrganization(
            supabase,
            orgContext.organization.id,
            {
              search: params.search,
              status: params.status,
              pillar: params.pillar,
            },
            {
              column: params.sortBy,
              direction: params.sortDir as 'asc' | 'desc' | undefined,
            },
            {
              page: params.page ? parseInt(params.page) : 1,
              pageSize: params.pageSize ? parseInt(params.pageSize) : 25,
            }
          )

      const campaigns = result.data

      return (
        <div className="space-y-6">
          <PageHeader
            title="Campaigns"
            description={`Manage content campaigns for ${orgContext.organization.name}.`}
            actions={
              <Link href="/campaigns/new">
                <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />New Campaign</Button>
              </Link>
            }
          />

          {params.success === 'updated' && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              × Campaign updated successfully
            </div>
          )}

          <Suspense>
            <div className="flex items-center justify-between gap-4">
              <CampaignFilters />
              <CampaignsTabsWrapper activeTab={activeTab} />
            </div>
          </Suspense>

          {campaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns found"
              description={
                params.search || params.status || params.pillar
                  ? 'No campaigns match your current filters. Try adjusting them.'
                  : 'Create your first campaign to start organizing content.'
              }
              action={
                !params.search && !params.status && !params.pillar ? (
                  <Link href="/campaigns/new">
                    <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />New Campaign</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <CampaignsListClientWrapper 
              campaigns={campaigns}
              activeTab={activeTab}
              initialPage={result.page}
              totalPages={Math.ceil(result.total / result.pageSize)}
              totalItems={result.total}
              itemsPerPage={result.pageSize}
            />
          )}
        </div>
      )
    }
  )
}
