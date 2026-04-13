import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/shared/PageHeader'
import { BulkEditForm } from '@/features/media-library/components/BulkEditForm'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'

interface BulkEditPageProps {
  searchParams: Promise<{ ids?: string }>
}

export default async function BulkEditPage({ searchParams }: BulkEditPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) {
    redirect('/media-library')
  }

  const params = await searchParams
  const assetIds = params.ids?.split(',').filter(Boolean) || []

  if (assetIds.length === 0) {
    redirect('/media-library')
  }

  const supabase = await getSupabaseServerClient()
  
  // Fetch selected assets
  const { data: assets, error } = await supabase
    .from('app_media_assets_list')
    .select('*')
    .in('id', assetIds)
    .eq('organization_id', orgContext.organization.id)

  if (error || !assets || assets.length === 0) {
    redirect('/media-library')
  }

  // Fetch campaigns for the organization
  const { data: campaigns, error: campaignsError } = await supabase
    .from('content_campaigns')
    .select('*')
    .eq('organization_id', orgContext.organization.id)
    .is('deleted_at', null)
    .order('name')

  if (campaignsError) {
    console.error('Failed to fetch campaigns:', campaignsError)
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bulk Edit Media Assets" 
        description={`Edit ${assets.length} selected asset${assets.length > 1 ? 's' : ''} in bulk`}
      />
      
      <Suspense fallback={<div>Loading...</div>}>
        <BulkEditForm 
          assets={assets}
          organizationId={orgContext.organization.id}
          campaigns={campaigns || []}
        />
      </Suspense>
    </div>
  )
}
