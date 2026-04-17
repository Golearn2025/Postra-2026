'use server'

import { revalidatePath } from 'next/cache'
import { updateOrganizationProfile } from '@/server/repositories/organization-profiles.repository'
import { upsertOrganizationPlatforms } from '@/server/repositories/organization-platform-preferences.repository'
import { getCurrentUser } from '@/server/services/auth.service'
import { getSupabaseServerClient } from '@/server/supabase/server'

/**
 * Update organization profile - separate save flow
 * Only handles profile fields, no platform logic
 */
export async function updateOrganizationProfileAction(
  organizationId: string,
  updates: {
    industry?: string
    industryOtherText?: string | null
    targetAudience?: string
    targetAudienceOtherText?: string | null
    primaryGoal?: string
    defaultTone?: string
  }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get Supabase client for server action
    const supabase = await getSupabaseServerClient()

    // Repository handles business logic for _other_text fields
    const success = await updateOrganizationProfile(
      supabase,
      organizationId,
      user.profile.id, // Fix: use user.profile.id instead of user.id
      updates
    )

    if (success) {
      revalidatePath('/organization')
      return { success: true }
    } else {
      return { success: false, error: 'Failed to update profile' }
    }
  } catch (error) {
    console.error('updateOrganizationProfileAction error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Update platform preferences - separate save flow
 * Only handles platform selection, no profile logic
 */
export async function updatePlatformPreferencesAction(
  organizationId: string,
  selectedPlatforms: string[]
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get Supabase client for server action
    const supabase = await getSupabaseServerClient()

    // Repository handles platform logic (is_enabled, is_default)
    const success = await upsertOrganizationPlatforms(
      supabase,
      organizationId,
      user.profile.id, // Fix: use user.profile.id instead of user.id
      selectedPlatforms
    )

    if (success) {
      revalidatePath('/organization')
      return { success: true }
    } else {
      return { success: false, error: 'Failed to update platforms' }
    }
  } catch (error) {
    console.error('updatePlatformPreferencesAction error:', error)
    return { success: false, error: 'Internal server error' }
  }
}
