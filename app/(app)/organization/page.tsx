import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { OrganizationSettingsClient } from '@/features/organization/components/OrganizationSettingsClient'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getOrganizationProfile } from '@/server/repositories/organization-profiles.repository'
import { getOrganizationPlatforms } from '@/server/repositories/organization-platform-preferences.repository'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Organization Settings' }

export default async function OrganizationPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) redirect('/dashboard')

  // Server-side data fetching - single source of truth
  const supabase = await getSupabaseServerClient()
  const [profile, platforms] = await Promise.all([
    getOrganizationProfile(supabase, orgContext.organization.id),
    getOrganizationPlatforms(supabase, orgContext.organization.id)
  ])

  return (
    <OrganizationSettingsClient 
      organizationId={orgContext.organization.id}
      organizationName={orgContext.organization.name}
      initialProfile={profile}
      initialPlatforms={platforms}
    />
  )
}
