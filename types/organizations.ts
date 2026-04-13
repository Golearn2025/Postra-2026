import type {
  DbOrganization,
  DbOrganizationMember,
  DbOrganizationSettings,
  DbOrganizationSubscription,
  OrganizationMemberRole,
} from './database'

export interface OrganizationWithMember {
  organization: DbOrganization
  member: DbOrganizationMember
}

export interface OrganizationContext {
  organization: DbOrganization
  role: OrganizationMemberRole
  settings: DbOrganizationSettings | null
  subscription: DbOrganizationSubscription | null
}

export interface OrgContext {
  organization: DbOrganization
  member?: DbOrganizationMember
  profile: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
  isPlatformOwner: boolean
}

export interface OrganizationSwitcherItem {
  id: string
  name: string
  slug: string
  logo_url: string | null
  role?: OrganizationMemberRole  // undefined for platform owners
  isPlatformOwner?: boolean      // explicit flag for platform owners
}
