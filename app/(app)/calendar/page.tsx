import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCalendarSlotsByOrganization, getCalendarStatsByOrganization } from '@/server/repositories/calendar.repository'
import { getCampaignsListByOrganization } from '@/server/repositories/campaigns.repository'
import { generateSignedUrl } from '@/server/services/media-assets.service'
import { PremiumCalendarPage } from '@/features/calendar/components/PremiumCalendarPage'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Calendar' }

export default async function CalendarPage() {
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
          <p className="text-gray-400">Please select an organization to view calendar.</p>
        </div>
      </div>
    )
  }

  const supabase = await getSupabaseServerClient()

  // Fetch calendar data and campaigns in parallel
  const [slotsResult, stats, campaignsResult] = await Promise.all([
    getCalendarSlotsByOrganization(
      supabase,
      orgContext.organization.id,
      {},
      { column: 'slot_date', direction: 'asc' },
      { page: 1, pageSize: 200 }
    ),
    getCalendarStatsByOrganization(supabase, orgContext.organization.id),
    getCampaignsListByOrganization(
      supabase,
      orgContext.organization.id,
      {},
      { column: 'created_at', direction: 'desc' },
      { page: 1, pageSize: 100 }
    )
  ])

  // Add thumbnail URLs for calendar slots with media using database view fields
  const slotsWithThumbnails = await Promise.all(
    slotsResult.data.map(async (slot) => {
      if (!slot.media_storage_path) {
        return { ...slot, thumbnailUrl: undefined }
      }

      // Use thumbnail path from database view with proper prioritization
      let thumbnailUrl: string | null = null
      
      // Prioritize small_storage_path (300x300px) for better quality previews
      if (slot.media_small_storage_path) {
        try {
          thumbnailUrl = await generateSignedUrl(supabase, slot.media_small_storage_path)
          if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
            thumbnailUrl = null
          }
        } catch {
          thumbnailUrl = null
        }
      }
      
      // Fallback to thumb_storage_path (150x150px)
      if (!thumbnailUrl && slot.media_thumb_storage_path) {
        try {
          thumbnailUrl = await generateSignedUrl(supabase, slot.media_thumb_storage_path)
          if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
            thumbnailUrl = null
          }
        } catch {
          thumbnailUrl = null
        }
      }
      
      // Final fallback to original signed URL (for old media or missing thumbnails)
      if (!thumbnailUrl) {
        try {
          thumbnailUrl = await generateSignedUrl(supabase, slot.media_storage_path)
          if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
            thumbnailUrl = null
          }
        } catch {
          thumbnailUrl = null
        }
      }

      return { ...slot, thumbnailUrl: thumbnailUrl || undefined }
    })
  )

  const campaigns = campaignsResult.data.map(c => ({
    id: c.id,
    name: c.name || 'Untitled Campaign'
  }))

  return (
    <PremiumCalendarPage 
      slots={slotsWithThumbnails}
      campaigns={campaigns}
      stats={stats}
    />
  )
}
