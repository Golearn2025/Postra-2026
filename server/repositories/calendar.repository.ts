import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppCalendarSlotListItem } from '@/types/views'

export type CalendarFilters = {
  campaignId?: string
  slotStatus?: string
  postStatus?: string
  startDate?: string
  endDate?: string
}

export type CalendarSortOptions = {
  column?: string
  direction?: 'asc' | 'desc'
}

export type CalendarPaginationOptions = {
  page?: number
  pageSize?: number
}

export type CalendarSlotsListResult = {
  data: AppCalendarSlotListItem[]
  total: number
  page: number
  pageSize: number
}

export async function getCalendarSlotsByOrganization(
  supabase: SupabaseClient,
  organizationId: string,
  filters: CalendarFilters = {},
  sort: CalendarSortOptions = {},
  pagination: CalendarPaginationOptions = {}
): Promise<CalendarSlotsListResult> {
  const page = pagination.page ?? 1
  const pageSize = pagination.pageSize ?? 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const sortColumn = sort.column ?? 'slot_date'
  const sortDir = sort.direction ?? 'asc'

  // Count query
  let countQuery = supabase
    .from('app_calendar_slots')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  if (filters.campaignId) countQuery = countQuery.eq('campaign_id', filters.campaignId)
  if (filters.slotStatus) countQuery = countQuery.eq('slot_status', filters.slotStatus)
  if (filters.postStatus) countQuery = countQuery.eq('post_status', filters.postStatus)
  if (filters.startDate) countQuery = countQuery.gte('slot_date', filters.startDate)
  if (filters.endDate) countQuery = countQuery.lte('slot_date', filters.endDate)

  const { count } = await countQuery

  // Data query
  let query = supabase
    .from('app_calendar_slots')
    .select('*')
    .eq('organization_id', organizationId)

  if (filters.campaignId) query = query.eq('campaign_id', filters.campaignId)
  if (filters.slotStatus) query = query.eq('slot_status', filters.slotStatus)
  if (filters.postStatus) query = query.eq('post_status', filters.postStatus)
  if (filters.startDate) query = query.gte('slot_date', filters.startDate)
  if (filters.endDate) query = query.lte('slot_date', filters.endDate)

  const { data, error } = await query
    .order(sortColumn, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (error) {
    console.error('getCalendarSlotsByOrganization error:', error)
    return { data: [], total: 0, page, pageSize }
  }

  return {
    data: (data ?? []) as AppCalendarSlotListItem[],
    total: count ?? 0,
    page,
    pageSize,
  }
}

export async function getCalendarStatsByOrganization(
  supabase: SupabaseClient,
  organizationId: string
): Promise<{
  activeCampaigns: number
  plannedPosts: number
  nextPublish: { date: string; time: string; title: string } | null
  publishedThisMonth: number
}> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Active campaigns
  const { count: activeCampaigns } = await supabase
    .from('content_campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .in('status', ['draft', 'active'])

  // Planned posts (slots with planned status and assigned posts)
  const { count: plannedPosts } = await supabase
    .from('app_calendar_slots')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('slot_status', 'planned')
    .not('assigned_post_id', 'is', null)

  // Next publish (next planned slot)
  const { data: nextPublishData } = await supabase
    .from('app_calendar_slots')
    .select('slot_date, slot_time, post_title')
    .eq('organization_id', organizationId)
    .eq('slot_status', 'planned')
    .not('assigned_post_id', 'is', null)
    .gte('slot_date', now.toISOString().split('T')[0])
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })
    .limit(1)
    .single()

  const nextPublish = nextPublishData ? {
    date: nextPublishData.slot_date,
    time: nextPublishData.slot_time || '10:00:00',
    title: nextPublishData.post_title || 'Untitled Post',
  } : null

  // Published this month
  const { count: publishedThisMonth } = await supabase
    .from('app_calendar_slots')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('slot_status', 'published')
    .gte('slot_date', startOfMonth.toISOString().split('T')[0])
    .lte('slot_date', endOfMonth.toISOString().split('T')[0])

  return {
    activeCampaigns: activeCampaigns ?? 0,
    plannedPosts: plannedPosts ?? 0,
    nextPublish,
    publishedThisMonth: publishedThisMonth ?? 0,
  }
}
