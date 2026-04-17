import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getAvailableOrganizations } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getOrganizationOnboardingStatus } from '@/server/repositories/organization-profiles.repository'
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader'
import { appConfig } from '@/config/app-config'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(appConfig.routes.login)
  }

  // Get organization from cookie to check onboarding status
  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value

  if (!selectedOrgSlug) {
    redirect(appConfig.routes.login)
  }

  const supabase = await getSupabaseServerClient()
  
  // Get organization ID from slug
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('slug', selectedOrgSlug)
    .single()

  if (!org) {
    redirect(appConfig.routes.login)
  }

  // Get available organizations for platform owner switcher
  const availableOrgs = await getAvailableOrganizations(user!)

  // Check onboarding status
  const onboardingStatus = await getOrganizationOnboardingStatus(supabase, org.id)

  // If onboarding is completed, redirect to dashboard
  if (onboardingStatus?.isOnboardingCompleted) {
    redirect(appConfig.routes.home)
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingHeader 
        organizationName={org.name}
        organizationId={org.id}
        user={user!}
        organizations={availableOrgs}
      />
      {children}
    </div>
  )
}
