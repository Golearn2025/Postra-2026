/**
 * Organization Profiles Repository
 * Repository for organization_profiles table operations
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrganizationProfile, OrganizationOnboardingStatus } from '@/types/onboarding'

/**
 * Get organization onboarding status
 */
export async function getOrganizationOnboardingStatus(
  supabase: SupabaseClient,
  organizationId: string
): Promise<OrganizationOnboardingStatus | null> {
  const { data, error } = await supabase
    .from('app_organization_onboarding_status')
    .select('*')
    .eq('organization_id', organizationId)
    .single()

  if (error) {
    console.error('getOrganizationOnboardingStatus error:', error)
    return null
  }

  if (!data) return null

  return {
    organizationId: data.organization_id,
    organizationName: data.organization_name,
    organizationSlug: data.organization_slug,
    onboardingCompletedAt: data.onboarding_completed_at,
    isOnboardingCompleted: data.is_onboarding_completed
  }
}

/**
 * Get organization profile
 */
export async function getOrganizationProfile(
  supabase: SupabaseClient,
  organizationId: string
): Promise<OrganizationProfile | null> {
  const { data, error } = await supabase
    .from('app_organization_profile')
    .select('*')
    .eq('organization_id', organizationId)
    .single()

  if (error) {
    console.error('getOrganizationProfile error:', error)
    return null
  }

  if (!data) return null

  return {
    organizationId: data.organization_id,
    industry: data.industry,
    industryOtherText: data.industry_other_text,
    targetAudience: data.target_audience,
    targetAudienceOtherText: data.target_audience_other_text,
    primaryGoal: data.primary_goal,
    defaultTone: data.default_tone,
    defaultLanguage: data.default_language,
    onboardingCompletedAt: data.onboarding_completed_at
  }
}

/**
 * Update organization profile
 */
export async function updateOrganizationProfile(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  updates: {
    industry?: string
    industryOtherText?: string | null
    targetAudience?: string
    targetAudienceOtherText?: string | null
    primaryGoal?: string
    defaultTone?: string
  }
): Promise<boolean> {
  // Handle industry_other_text logic: null if industry != 'other', value if industry = 'other'
  // Handle target_audience_other_text logic: null if target_audience != 'other', value if target_audience = 'other'
  const finalUpdates = {
    industry: updates.industry,
    industry_other_text: updates.industry === 'other' ? updates.industryOtherText : null,
    target_audience: updates.targetAudience,
    target_audience_other_text: updates.targetAudience === 'other' ? updates.targetAudienceOtherText : null,
    primary_goal: updates.primaryGoal,
    default_tone: updates.defaultTone,
    updated_at: new Date().toISOString(),
    updated_by: userId
  }

  const { error } = await supabase
    .from('organization_profiles')
    .update(finalUpdates)
    .eq('organization_id', organizationId)

  if (error) {
    console.error('updateOrganizationProfile error:', error)
    return false
  }

  return true
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('organization_profiles')
    .update({
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: userId
    })
    .eq('organization_id', organizationId)

  if (error) {
    console.error('completeOnboarding error:', error)
    return false
  }

  return true
}
