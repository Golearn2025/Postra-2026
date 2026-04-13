import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbContentCampaign } from '@/types/database'
import type { CampaignFormValues } from '@/features/campaigns/schemas/campaign.schema'
import type { AppCampaignsListItem, AppCampaignDetail } from '@/types/views'

export type CampaignFilters = {
  search?: string
  status?: string
  pillar?: string
}

export type CampaignSortOptions = {
  column?: string
  direction?: 'asc' | 'desc'
}

export type CampaignPaginationOptions = {
  page?: number
  pageSize?: number
}

export type CampaignsListResult = {
  data: AppCampaignsListItem[]
  total: number
  page: number
  pageSize: number
}

export async function getCampaignsListByOrganization(
  supabase: SupabaseClient,
  organizationId: string,
  filters: CampaignFilters = {},
  sort: CampaignSortOptions = {},
  pagination: CampaignPaginationOptions = {}
): Promise<CampaignsListResult> {
  // Get total count first
  let countQuery = supabase
    .from('app_campaigns_list')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  if (filters.search) {
    countQuery = countQuery.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.status) countQuery = countQuery.eq('status', filters.status)
  if (filters.pillar) countQuery = countQuery.eq('pillar', filters.pillar)

  const { count } = await countQuery

  // Build main query
  let query = supabase
    .from('app_campaigns_list')
    .select('*')
    .eq('organization_id', organizationId)

  // Apply filters
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.pillar) query = query.eq('pillar', filters.pillar)

  // Apply sorting - default to created_at DESC (newest first)
  const sortColumn = sort.column || 'created_at'
  const sortDirection = sort.direction || 'desc'
  query = query.order(sortColumn, { ascending: sortDirection === 'asc' })

  // Apply pagination
  const page = pagination.page || 1
  const pageSize = pagination.pageSize || 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error } = await query
  if (error) {
    console.error('getCampaignsListByOrganization error:', error)
    return { data: [], total: 0, page, pageSize }
  }

  return {
    data: data as AppCampaignsListItem[],
    total: count || 0,
    page,
    pageSize,
  }
}

export async function getCampaignDetailById(
  supabase: SupabaseClient,
  campaignId: string,
  organizationId: string
): Promise<AppCampaignDetail | null> {
  const { data, error } = await supabase
    .from('app_campaign_detail')
    .select('*')
    .eq('id', campaignId)
    .eq('organization_id', organizationId)
    .single()

  if (error) {
    console.error('getCampaignDetailById error:', error)
    return null
  }
  return data as AppCampaignDetail
}

export async function createCampaign(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  values: CampaignFormValues
): Promise<DbContentCampaign | null> {
  // Check if slug already exists and generate unique slug if needed
  let uniqueSlug = values.slug
  let slugExists = true
  let attempts = 0
  const maxAttempts = 5

  while (slugExists && attempts < maxAttempts) {
    const { data: existingCampaign, error: checkError } = await supabase
      .from('content_campaigns')
      .select('slug')
      .eq('organization_id', organizationId)
      .eq('slug', uniqueSlug)
      .is('deleted_at', null)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // No existing campaign found, slug is unique
      slugExists = false
    } else if (checkError) {
      console.error('Error checking slug uniqueness:', checkError)
      return null
    } else {
      // Slug exists, generate new one
      attempts++
      uniqueSlug = attempts === 1 ? `${values.slug}-${Date.now()}` : `${values.slug}-${Date.now()}-${attempts}`
    }
  }

  if (attempts >= maxAttempts) {
    console.error('Could not generate unique slug after', maxAttempts, 'attempts')
    return null
  }

  const insertData = {
    organization_id: organizationId,
    created_by: userId,
    updated_by: userId,
    metadata: {},
    ...values,
    slug: uniqueSlug,
    pillar: values.pillar ?? null,
  }

  const { data, error } = await supabase
    .from('content_campaigns')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('createCampaign error:', error)
    return null
  }

  return data as DbContentCampaign
}

export async function updateCampaign(
  supabase: SupabaseClient,
  campaignId: string,
  organizationId: string,
  userId: string,
  values: Partial<CampaignFormValues>
): Promise<DbContentCampaign | null> {
  const { data, error } = await supabase
    .from('content_campaigns')
    .update({
      ...values,
      pillar: values.pillar ?? null,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('updateCampaign error:', error)
    return null
  }
  return data as DbContentCampaign
}
