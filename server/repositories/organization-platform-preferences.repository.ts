/**
 * Organization Platform Preferences Repository
 * Repository for organization_platform_preferences table operations
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export interface OrganizationPlatform {
  id: string
  organizationId: string
  platform: string
  isEnabled: boolean
  isDefault: boolean
}

/**
 * Get organization platforms
 */
export async function getOrganizationPlatforms(
  supabase: SupabaseClient,
  organizationId: string
): Promise<OrganizationPlatform[]> {
  const { data, error } = await supabase
    .from('app_organization_platforms')
    .select('*')
    .eq('organization_id', organizationId)

  if (error) {
    console.error('getOrganizationPlatforms error:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    organizationId: row.organization_id,
    platform: row.platform,
    isEnabled: row.is_enabled,
    isDefault: row.is_default
  }))
}

/**
 * Upsert organization platform preferences
 * Creates or updates platform preferences for selected platforms
 */
export async function upsertOrganizationPlatforms(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  platforms: string[]
): Promise<boolean> {
  // Delete existing platforms first
  const { error: deleteError } = await supabase
    .from('organization_platform_preferences')
    .delete()
    .eq('organization_id', organizationId)

  if (deleteError) {
    console.error('deleteError:', deleteError)
    return false
  }

  // Insert new platforms
  const inserts = platforms.map(platform => ({
    organization_id: organizationId,
    platform,
    is_enabled: true,
    is_default: true,
    created_by: userId,
    updated_by: userId
  }))

  const { error: insertError } = await supabase
    .from('organization_platform_preferences')
    .insert(inserts)

  if (insertError) {
    console.error('insertError:', insertError)
    return false
  }

  return true
}
