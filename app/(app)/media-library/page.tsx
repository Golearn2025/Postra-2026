import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Upload, ImageIcon, Trash } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { MediaLibraryView } from '@/features/media-library/components/MediaLibraryView'
import { MediaFilters } from '@/features/media-library/components/MediaFilters'
import { softDeleteMediaAssetAction } from '@/server/actions/media-assets.actions'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getMediaAssetsListByOrganization } from '@/server/repositories/media-assets.repository'
import { getCampaignsListByOrganization } from '@/server/repositories/campaigns.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Media Library' }

interface MediaLibraryPageProps {
  searchParams: Promise<{ search?: string; type?: string; source?: string; status?: string; campaign_id?: string }>
}

export default async function MediaLibraryPage({ searchParams }: MediaLibraryPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) {
    return (
      <div className="space-y-6">
        <PageHeader title="Media Library" description="Manage your media assets." />
        <EmptyState icon={ImageIcon} title="No organization selected" description="Select an organization to view media." />
      </div>
    )
  }

  const params = await searchParams
  const supabase = await getSupabaseServerClient()
  
  // Fetch campaigns server-side to eliminate client-side fetch in MediaFilters
  const campaignsResult = await getCampaignsListByOrganization(
    supabase,
    orgContext.organization.id,
    {},
    { column: 'created_at', direction: 'desc' },
    { page: 1, pageSize: 100 }
  )
  
  const assets = await getMediaAssetsListByOrganization(supabase, orgContext.organization.id, {
    search: params.search,
    type: params.type,
    source: params.source,
    status: params.status,
    campaign_id: params.campaign_id,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description={`Manage images and videos for ${orgContext.organization.name}.`}
        actions={
          <Link href="/media-library/upload">
            <Button size="sm"><Upload className="mr-1.5 h-4 w-4" />Upload Media</Button>
          </Link>
        }
      />

      <Suspense>
        <MediaFilters campaigns={campaignsResult.data} />
      </Suspense>

      {assets.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media found"
          description={
            params.search || params.type || params.source || params.status
              ? 'No assets match your filters. Try adjusting them.'
              : 'Upload your first image or video to get started.'
          }
          action={
            !params.search && !params.type && !params.source && !params.status ? (
              <Link href="/media-library/upload">
                <Button size="sm"><Upload className="mr-1.5 h-4 w-4" />Upload Media</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <MediaLibraryView 
          assets={assets} 
          organizationId={orgContext.organization.id}
        />
      )}
    </div>
  )
}
