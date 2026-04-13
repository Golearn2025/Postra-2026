import { getSupabaseServerClient } from '@/server/supabase/server'
import { getAvailableOrganizationsForCurrentUser, getOrganizationBySlug, getMemberRole } from '@/server/repositories/organizations.repository'
import { getCurrentProfile } from '@/server/repositories/profiles.repository'
import type { AppUser } from '@/types/app'
import type { OrganizationSwitcherItem, OrgContext } from '@/types/organizations'

export async function getAvailableOrganizations(user: AppUser): Promise<OrganizationSwitcherItem[]> {
  const supabase = await getSupabaseServerClient()
  return getAvailableOrganizationsForCurrentUser(supabase, user.profile.id, user.isPlatformOwner)
}

export async function getCurrentOrganizationContext(
  user: AppUser,
  selectedSlug?: string
): Promise<OrgContext | null> {
  const supabase = await getSupabaseServerClient()
  
  // Get available organizations for this user
  const availableOrgs = await getAvailableOrganizations(user)
  if (availableOrgs.length === 0) return null

  // Determine which org to use
  let targetOrg: OrganizationSwitcherItem | null = null
  
  if (selectedSlug) {
    // Try to use the selected slug
    targetOrg = availableOrgs.find(org => org.slug === selectedSlug) ?? null
  }
  
  if (!targetOrg) {
    // Fall back to first available organization
    targetOrg = availableOrgs[0]
  }

  // Get full organization details
  const orgDetails = await getOrganizationBySlug(supabase, targetOrg.slug)
  if (!orgDetails) return null

  // Get member role (for non-owners) - parallel execution possible here
  const memberRole = user.isPlatformOwner 
    ? null 
    : await getMemberRole(supabase, orgDetails.id, user.profile.id)

  // Use profile from getCurrentUser() instead of duplicate lookup
  const profile = user.profile

  return {
    organization: orgDetails,
    member: memberRole ?? undefined,
    profile,
    isPlatformOwner: user.isPlatformOwner,
  }
}

export async function getOrganizationContextBySlug(
  user: AppUser,
  slug: string,
  availableOrgs: OrganizationSwitcherItem[]
): Promise<OrgContext | null> {
  const supabase = await getSupabaseServerClient()
  
  // Validate that the user has access to this organization
  const targetOrg = availableOrgs.find(org => org.slug === slug)
  if (!targetOrg) return null

  // Get full organization details
  const orgDetails = await getOrganizationBySlug(supabase, slug)
  if (!orgDetails) return null

  // Get member role (for non-owners)
  const memberRole = user.isPlatformOwner 
    ? null 
    : await getMemberRole(supabase, orgDetails.id, user.profile.id)

  // Use profile from getCurrentUser() instead of duplicate lookup
  const profile = user.profile

  return {
    organization: orgDetails,
    member: memberRole ?? undefined,
    profile,
    isPlatformOwner: user.isPlatformOwner,
  }
}
