import type { DbProfile } from './database'
import type { OrganizationContext } from './organizations'

export interface AppUser {
  profile: DbProfile
  isPlatformOwner: boolean
}

export interface AppSession {
  user: AppUser
  activeOrg: OrganizationContext | null
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResult<T> {
  data: T | null
  error: string | null
}

export interface SelectOption {
  value: string
  label: string
}
