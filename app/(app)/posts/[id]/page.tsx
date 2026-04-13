import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getPostById } from '@/server/repositories/content-posts.repository'
import { appConfig } from '@/config/app-config'
import { PostDetailPage } from '../PostDetailPage'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Post Detail' }

export default async function PostDetail({ params }: PostDetailPageProps) {
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
          <p className="text-gray-400">Please select an organization to view post.</p>
        </div>
      </div>
    )
  }

  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const postResult = await getPostById(supabase, id)
  
  if (!postResult.data) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-gray-400">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <PostDetailPage post={postResult.data} organizationId={orgContext.organization.id} userId={user.profile.id} />
}
