import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbOrganization, DbOrganizationMember } from '@/types/database'
import type { OrganizationSwitcherItem } from '@/types/organizations'
import { performanceMonitor } from '@/server/lib/observability/performance'

export async function getOrganizationsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<OrganizationSwitcherItem[]> {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      role,
      is_active,
      organizations (
        id,
        name,
        slug,
        brand_logo_url
      )
    `)
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error || !data) return []

  return data
    .filter((row: any) => row.organizations)
    .map((row: any) => ({
      id: row.organizations.id,
      name: row.organizations.name,
      slug: row.organizations.slug,
      logo_url: row.organizations.brand_logo_url,
      role: row.role,
      isPlatformOwner: false,  // Regular members are not platform owners
    }))
}

export async function getOrganizationBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<DbOrganization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as DbOrganization
}

export async function getAvailableOrganizationsForCurrentUser(
  supabase: SupabaseClient,
  userId: string,
  isPlatformOwner: boolean
): Promise<OrganizationSwitcherItem[]> {
  return performanceMonitor.measureDbQuery(
    {
      functionName: 'getAvailableOrganizationsForCurrentUser',
      sourceType: isPlatformOwner ? 'table' : 'table',
      sourceName: isPlatformOwner ? 'organizations' : 'organization_members',
      userId
    },
    async () => {
      if (isPlatformOwner) {
        // Platform owners can see all organizations
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, slug, brand_logo_url')
          .order('name')

        if (error || !data) return []

        return data.map((org: any) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo_url: org.brand_logo_url,
          role: undefined,  // Platform owners don't have a member role
          isPlatformOwner: true,
        }))
      }

      // Regular users only see organizations they're active members of
      return getOrganizationsForUser(supabase, userId)
    }
  )
}

export async function getMemberRole(
  supabase: SupabaseClient,
  orgId: string,
  userId: string
): Promise<DbOrganizationMember | null> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as DbOrganizationMember
}
