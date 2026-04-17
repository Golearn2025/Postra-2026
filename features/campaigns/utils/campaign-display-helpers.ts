import type { AppCampaignsListItem, AppCampaignDetail } from '@/types/views'
import { formatDate } from '@/lib/formatters/date'
import { 
  getPillarLabel as getPillarLabelFromValue,
  getGoalLabel,
  getAudienceLabel,
  getTextOrNotSet
} from './campaign-labels'

/**
 * Get user-friendly pillar label from campaign data
 */
export function getPillarLabel(campaign: AppCampaignsListItem | AppCampaignDetail): string {
  return getPillarLabelFromValue(campaign.campaign_pillar)
}

/**
 * Get user-friendly goal/objective label from campaign data
 */
export function getObjectiveLabel(campaign: AppCampaignDetail): string {
  return getGoalLabel(campaign.objective)
}

/**
 * Get user-friendly audience label from campaign data
 */
export function getTargetAudienceLabel(campaign: AppCampaignDetail): string {
  return getAudienceLabel(campaign.target_audience)
}

/**
 * Get target market with fallback
 */
export function getTargetMarket(campaign: AppCampaignsListItem | AppCampaignDetail): string {
  return getTextOrNotSet(campaign.target_market)
}

/**
 * Format schedule for table/card display
 * Example: "17 Apr 2026 → 16 May 2026 · 30 days" or "4 selected dates"
 */
export function formatScheduleDisplay(campaign: AppCampaignsListItem): string {
  if (campaign.schedule_type === 'date_range' && campaign.start_date && campaign.end_date) {
    const duration = campaign.campaign_duration_days || calculateDuration(campaign.start_date, campaign.end_date)
    const durationText = formatDuration(duration)
    return `${formatDate(campaign.start_date)} → ${formatDate(campaign.end_date)} · ${durationText}`
  }
  
  if (campaign.schedule_type === 'selected_dates') {
    const count = campaign.selected_dates_count || 0
    if (count === 0) return 'Not set'
    return `${count} selected date${count === 1 ? '' : 's'}`
  }
  
  return 'Not set'
}

/**
 * Calculate duration between two dates (inclusive)
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Inclusive of both dates
}

/**
 * Format duration for display
 */
export function formatDuration(days: number): string {
  return `${days} day${days === 1 ? '' : 's'}`
}

/**
 * Get campaign status color class
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50'
    case 'draft': return 'text-gray-600 bg-gray-50'
    case 'paused': return 'text-yellow-600 bg-yellow-50'
    case 'completed': return 'text-blue-600 bg-blue-50'
    case 'archived': return 'text-gray-500 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}
