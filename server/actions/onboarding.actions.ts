'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { 
  getOrganizationOnboardingStatus,
  getOrganizationProfile,
  updateOrganizationProfile,
  completeOnboarding
} from '@/server/repositories/organization-profiles.repository'
import { upsertOrganizationPlatforms } from '@/server/repositories/organization-platform-preferences.repository'
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  onboardingStep4Schema,
  onboardingStep5Schema,
  completeOnboardingSchema,
  type CompleteOnboardingInput
} from '@/features/onboarding/schemas/onboarding.schema'

/**
 * Get onboarding status for an organization
 */
export async function getOnboardingStatusAction(organizationId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const supabase = await getSupabaseServerClient()
  const status = await getOrganizationOnboardingStatus(supabase, organizationId)

  if (!status) {
    return { error: 'Organization not found' }
  }

  return { status }
}

/**
 * Get organization profile
 */
export async function getOrganizationProfileAction(organizationId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const supabase = await getSupabaseServerClient()
  const profile = await getOrganizationProfile(supabase, organizationId)

  return { profile }
}

/**
 * Update onboarding step 1: Industry
 */
export async function updateOnboardingStep1Action(
  organizationId: string,
  data: { industry: string; industryOtherText?: string }
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const parsed = onboardingStep1Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const success = await updateOrganizationProfile(
    supabase,
    organizationId,
    user.profile.id,
    { 
      industry: parsed.data.industry,
      industryOtherText: parsed.data.industryOtherText || null
    }
  )

  if (!success) {
    return { error: 'Failed to update industry' }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

/**
 * Update onboarding step 2: Target Audience
 */
export async function updateOnboardingStep2Action(
  organizationId: string,
  data: { targetAudience: string; targetAudienceOtherText?: string }
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const parsed = onboardingStep2Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const success = await updateOrganizationProfile(
    supabase,
    organizationId,
    user.profile.id,
    { 
      targetAudience: parsed.data.targetAudience,
      targetAudienceOtherText: parsed.data.targetAudienceOtherText || null
    }
  )

  if (!success) {
    return { error: 'Failed to update target audience' }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

/**
 * Update onboarding step 3: Primary Goal
 */
export async function updateOnboardingStep3Action(
  organizationId: string,
  data: { primaryGoal: string }
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const parsed = onboardingStep3Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const success = await updateOrganizationProfile(
    supabase,
    organizationId,
    user.profile.id,
    { primaryGoal: parsed.data.primaryGoal }
  )

  if (!success) {
    return { error: 'Failed to update primary goal' }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

/**
 * Update onboarding step 4: Default Tone
 */
export async function updateOnboardingStep4Action(
  organizationId: string,
  data: { defaultTone: string }
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const parsed = onboardingStep4Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const success = await updateOrganizationProfile(
    supabase,
    organizationId,
    user.profile.id,
    { defaultTone: parsed.data.defaultTone }
  )

  if (!success) {
    return { error: 'Failed to update default tone' }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

/**
 * Complete onboarding with all data
 */
export async function completeOnboardingAction(
  organizationId: string,
  data: CompleteOnboardingInput
) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const parsed = completeOnboardingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()

  // Update profile fields
  const profileSuccess = await updateOrganizationProfile(
    supabase,
    organizationId,
    user.profile.id,
    {
      industry: parsed.data.industry,
      industryOtherText: parsed.data.industryOtherText || null,
      targetAudience: parsed.data.targetAudience,
      targetAudienceOtherText: parsed.data.targetAudienceOtherText || null,
      primaryGoal: parsed.data.primaryGoal,
      defaultTone: parsed.data.defaultTone
    }
  )

  if (!profileSuccess) {
    return { error: 'Failed to update organization profile' }
  }

  // Update platforms
  const platformsSuccess = await upsertOrganizationPlatforms(
    supabase,
    organizationId,
    user.profile.id,
    parsed.data.platforms
  )

  if (!platformsSuccess) {
    return { error: 'Failed to update platform preferences' }
  }

  // Mark onboarding as complete
  const completeSuccess = await completeOnboarding(
    supabase,
    organizationId,
    user.profile.id
  )

  if (!completeSuccess) {
    return { error: 'Failed to complete onboarding' }
  }

  revalidatePath('/onboarding')
  revalidatePath('/dashboard')
  revalidatePath('/campaigns')

  // Redirect to first campaign creation
  redirect('/campaigns/new')
}
