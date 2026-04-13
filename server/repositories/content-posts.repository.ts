import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppPostsListItem } from '@/types/views'

export type PostsFilters = {
  search?: string
  status?: string
  campaignId?: string
}

export type PostsSortOptions = {
  column?: string
  direction?: 'asc' | 'desc'
}

export type PostsPaginationOptions = {
  page?: number
  pageSize?: number
}

export type PostsListResult = {
  data: AppPostsListItem[]
  total: number
  page: number
  pageSize: number
}

export async function getPostById(
  supabase: SupabaseClient,
  postId: string
): Promise<{ data: AppPostsListItem | null }> {
  const { data, error } = await supabase
    .from('app_posts_list')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) {
    console.error('getPostById error:', error)
    return { data: null }
  }

  return { data: data as AppPostsListItem | null }
}

export async function getPostsListByOrganization(
  supabase: SupabaseClient,
  organizationId: string,
  filters: PostsFilters = {},
  sort: PostsSortOptions = {},
  pagination: PostsPaginationOptions = {}
): Promise<PostsListResult> {
  const page = pagination.page ?? 1
  const pageSize = pagination.pageSize ?? 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const sortColumn = sort.column ?? 'created_at'
  const sortDir = sort.direction ?? 'desc'

  // Count query
  let countQuery = supabase
    .from('app_posts_list')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  if (filters.search) countQuery = countQuery.ilike('title', `%${filters.search}%`)
  if (filters.status) countQuery = countQuery.eq('status', filters.status)
  if (filters.campaignId) countQuery = countQuery.eq('campaign_id', filters.campaignId)

  const { count } = await countQuery

  // Data query
  let query = supabase
    .from('app_posts_list')
    .select('*')
    .eq('organization_id', organizationId)

  if (filters.search) query = query.ilike('title', `%${filters.search}%`)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.campaignId) query = query.eq('campaign_id', filters.campaignId)

  const { data, error } = await query
    .order(sortColumn, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (error) {
    console.error('getPostsListByOrganization error:', error)
    return { data: [], total: 0, page, pageSize }
  }

  return {
    data: (data ?? []) as AppPostsListItem[],
    total: count ?? 0,
    page,
    pageSize,
  }
}
