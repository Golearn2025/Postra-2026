import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbContentCampaign } from '@/types/database'
import type { AppCampaignsListItem, AppCampaignDetail } from '@/types/views'
import type { CreateCampaignInput } from '@/features/campaigns/schemas/create-campaign.schema'
import { performanceMonitor } from '@/server/lib/observability/performance'

// Legacy pillar enum values for validation
const LEGACY_PILLARS = [
  'luxury', 'airport', 'corporate', 'wedding', 'testimonial',
  'promo', 'educational', 'seasonal', 'general'
] as const

/**
 * Check if a pillar value is a legacy enum value
 */
function isLegacyPillar(pillar: string | null | undefined): pillar is typeof LEGACY_PILLARS[number] {
  if (!pillar) return false
  return LEGACY_PILLARS.includes(pillar as typeof LEGACY_PILLARS[number])
}

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
  return performanceMonitor.measureDbQuery(
    {
      functionName: 'getCampaignsListByOrganization',
      sourceType: 'view',
      sourceName: 'app_campaigns_list',
      organizationId
    },
    async () => {
      // Get total count first
      let countQuery = supabase
        .from('app_campaigns_list')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      if (filters.search) {
        countQuery = countQuery.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters.status) countQuery = countQuery.eq('status', filters.status)
      if (filters.pillar) countQuery = countQuery.eq('campaign_pillar', filters.pillar)

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
      if (filters.pillar) query = query.eq('campaign_pillar', filters.pillar)

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
  )
}

export async function getCampaignDetailById(
  supabase: SupabaseClient,
  campaignId: string,
  organizationId: string
): Promise<AppCampaignDetail | null> {
  return performanceMonitor.measureDbQuery(
    {
      functionName: 'getCampaignDetailById',
      sourceType: 'view',
      sourceName: 'app_campaign_detail',
      organizationId
    },
    async () => {
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
  )
}

export async function createLegacyCampaign(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  values: CreateCampaignInput
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
    campaign_pillar: values.campaignPillar ?? null,
    objective: values.mainGoal,
    target_audience: values.targetAudience,
    target_market: values.targetMarket,
    schedule_type: values.scheduleType,
    start_date: values.scheduleType === 'date_range' ? values.startDate : null,
    end_date: values.scheduleType === 'date_range' ? values.endDate : null,
    description: values.description,
    slug: uniqueSlug,
    status: values.status,
  }

  const { data, error } = await supabase
    .from('content_campaigns')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    // Handle duplicate key error by retrying with a new slug
    if (error.code === '23505' && error.message?.includes('content_campaigns_organization_id_slug_key')) {
      console.log('Duplicate slug detected, retrying with new slug...')
      // Generate a new slug with timestamp
      const newSlug = `${values.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const { data: retryData, error: retryError } = await supabase
        .from('content_campaigns')
        .insert({
          ...insertData,
          slug: newSlug
        })
        .select()
        .single()

      if (retryError) {
        console.error('createCampaign retry error:', retryError)
        return null
      }

      return retryData as DbContentCampaign
    }
    
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
  values: Partial<CreateCampaignInput>
): Promise<DbContentCampaign | null> {
  const updateData: any = {
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }
    
    // Map only the fields that exist in the approved model
    if (values.campaignPillar !== undefined) updateData.campaign_pillar = values.campaignPillar
    if (values.mainGoal !== undefined) updateData.objective = values.mainGoal
    if (values.targetAudience !== undefined) updateData.target_audience = values.targetAudience
    if (values.targetMarket !== undefined) updateData.target_market = values.targetMarket
    if (values.scheduleType !== undefined) updateData.schedule_type = values.scheduleType
    if (values.name !== undefined) updateData.name = values.name
    if (values.description !== undefined) updateData.description = values.description
    if (values.slug !== undefined) updateData.slug = values.slug
    if (values.status !== undefined) updateData.status = values.status
    
    // Handle date fields based on schedule type
    if (values.scheduleType === 'date_range') {
      if (values.startDate !== undefined) updateData.start_date = values.startDate
      if (values.endDate !== undefined) updateData.end_date = values.endDate
    }

  const { data, error } = await supabase
    .from('content_campaigns')
    .update(updateData)
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

/**
 * Create a new campaign with the redesigned schema
 */
export async function createCampaign(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  data: CreateCampaignInput
): Promise<DbContentCampaign | null> {
  // Prepare campaign data with proper typing
  const campaignData: any = {
    organization_id: organizationId,
    name: data.name,
    slug: data.slug || null,
    status: data.status,
    campaign_pillar: data.campaignPillar,
    objective: data.mainGoal,
    target_audience: data.targetAudience,
    target_market: data.targetMarket || null,
    schedule_type: data.scheduleType,
    description: data.description || null,
    created_by: userId,
    updated_by: userId
  }

  // Add date fields only for date_range mode
  if (data.scheduleType === 'date_range') {
    campaignData.start_date = data.startDate
    campaignData.end_date = data.endDate
  }

  const { data: campaign, error } = await supabase
    .from('content_campaigns')
    .insert(campaignData)
    .select()
    .single()

  if (error) {
    console.error('[DB ERROR] Campaign insert failed:', error.message, error.details)
    return null
  }

  // If selected_dates mode, create campaign date rows
  if (data.scheduleType === 'selected_dates' && data.selectedDates && data.selectedDates.length > 0) {
    const campaignDates = data.selectedDates.map(date => ({
      organization_id: organizationId,
      campaign_id: campaign.id,
      scheduled_date: date,
      created_by: userId,
      updated_by: userId
    }))

    const { error: datesError } = await supabase
      .from('content_campaign_dates')
      .insert(campaignDates)

    if (datesError) {
      console.error('[DB ERROR] Campaign dates insert failed:', datesError.message)
      // Rollback campaign creation
      await supabase
        .from('content_campaigns')
        .delete()
        .eq('id', campaign.id)
      return null
    }
  }

  return campaign as DbContentCampaign
}
