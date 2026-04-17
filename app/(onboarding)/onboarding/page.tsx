import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getOrganizationOnboardingStatus, getOrganizationProfile } from '@/server/repositories/organization-profiles.repository'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'
import { appConfig } from '@/config/app-config'
import type { Industry, TargetAudience, PrimaryGoal, DefaultTone } from '@/types/onboarding'
import { withRouteInstrumentation } from '@/server/lib/observability/route-instrumentation'

export default async function OnboardingPage() {
  return withRouteInstrumentation(
    {
      route: '/onboarding',
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
        redirect('/login')
      }

      const supabase = await getSupabaseServerClient()
      
      // Get onboarding status
      const onboardingStatus = await getOrganizationOnboardingStatus(
        supabase,
        orgContext.organization.id
      )

      // If onboarding is already completed, redirect to dashboard
      if (onboardingStatus?.isOnboardingCompleted) {
        redirect('/dashboard')
      }

      // Get existing profile data if any
      const profile = await getOrganizationProfile(
        supabase,
        orgContext.organization.id
      )

      const initialData = profile ? {
        industry: profile.industry as Industry,
        industryOtherText: profile.industryOtherText,
        targetAudience: profile.targetAudience as TargetAudience,
        targetAudienceOtherText: profile.targetAudienceOtherText,
        primaryGoal: profile.primaryGoal as PrimaryGoal,
        defaultTone: profile.defaultTone as DefaultTone,
        platforms: []
      } : undefined

      return (
        <OnboardingWizard
          organizationId={orgContext.organization.id}
          organizationName={orgContext.organization.name}
          initialData={initialData}
        />
      )
    }
  )
}
