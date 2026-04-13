import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getPostsListByOrganization } from '@/server/repositories/content-posts.repository'
import { getCampaignsListByOrganization } from '@/server/repositories/campaigns.repository'
import { EnterprisePostsPage } from '@/features/posts/components/EnterprisePostsPage'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Posts' }

interface PostsPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user, selectedOrgSlug)

  if (!orgContext) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Organization Selected</h2>
          <p className="text-gray-400">Please select an organization to view posts.</p>
        </div>
      </div>
    )
  }

  const params = await searchParams
  const supabase = await getSupabaseServerClient()

  // Fetch posts and campaigns in parallel
  const [postsResult, campaignsResult] = await Promise.all([
    getPostsListByOrganization(
      supabase,
      orgContext.organization.id,
      {
        search: params.search,
        status: params.status,
      },
      { column: 'created_at', direction: 'desc' },
      { page: params.page ? parseInt(params.page) : 1, pageSize: 100 }
    ),
    getCampaignsListByOrganization(
      supabase,
      orgContext.organization.id,
      {},
      { column: 'created_at', direction: 'desc' },
      { page: 1, pageSize: 100 }
    )
  ])

  const campaigns = campaignsResult.data.map(c => ({
    id: c.id,
    name: c.name || 'Untitled Campaign'
  }))

  return (
    <EnterprisePostsPage 
      posts={postsResult.data}
      campaigns={campaigns}
    />
  )
}
