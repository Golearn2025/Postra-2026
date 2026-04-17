/**
 * Centralized Campaign Display Labels
 * Single source of truth for all user-facing campaign labels
 */

// Campaign Pillar Labels (approved model)
export const PILLAR_LABELS: Record<string, string> = {
  brand_awareness: 'Brand Awareness',
  service_promotion: 'Service Promotion',
  customer_trust: 'Customer Trust',
  education_tips: 'Education & Tips',
  seasonal_event: 'Seasonal Event',
  brand_story: 'Brand Story'
}

// Campaign Goal Labels (approved model)
export const GOAL_LABELS: Record<string, string> = {
  brand_awareness: 'Brand Awareness',
  drive_engagement: 'Drive Engagement',
  generate_leads: 'Generate Leads',
  promote_offer: 'Promote an Offer',
  drive_bookings: 'Drive Bookings'
}

// Target Audience Labels (approved model)
export const AUDIENCE_LABELS: Record<string, string> = {
  general_audience: 'General Audience',
  business_clients: 'Business Clients',
  luxury_travelers: 'Luxury Travelers',
  hotel_guests: 'Hotel Guests',
  event_attendees: 'Event Attendees',
  tourists_visitors: 'Tourists & Visitors'
}

// Campaign Status Labels
export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  archived: 'Archived',
  expired: 'Expired'
}

// Schedule Type Labels
export const SCHEDULE_TYPE_LABELS: Record<string, string> = {
  date_range: 'Date Range',
  selected_dates: 'Selected Dates'
}

/**
 * Get user-friendly label for any campaign field
 * Returns "Not set" for missing/null values
 */
export function getPillarLabel(pillarValue: string | null | undefined): string {
  if (!pillarValue) return 'Not set'
  return PILLAR_LABELS[pillarValue] || pillarValue
}

export function getGoalLabel(goalValue: string | null | undefined): string {
  if (!goalValue) return 'Not set'
  return GOAL_LABELS[goalValue] || goalValue
}

export function getAudienceLabel(audienceValue: string | null | undefined): string {
  if (!audienceValue) return 'Not set'
  return AUDIENCE_LABELS[audienceValue] || audienceValue
}

export function getStatusLabel(statusValue: string | null | undefined): string {
  if (!statusValue) return 'Not set'
  return STATUS_LABELS[statusValue] || statusValue
}

export function getScheduleTypeLabel(scheduleType: string | null | undefined): string {
  if (!scheduleType) return 'Not set'
  return SCHEDULE_TYPE_LABELS[scheduleType] || scheduleType
}

/**
 * Get generic "Not set" fallback for missing text values
 */
export function getTextOrNotSet(value: string | null | undefined): string {
  if (!value || value.trim() === '') return 'Not set'
  return value
}

/**
 * Get status color variant for UI components
 */
export function getStatusVariant(status: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default' // Green - active campaigns
    case 'draft':
      return 'secondary' // Gray - draft campaigns
    case 'paused':
      return 'outline' // Yellow/Orange border - paused campaigns
    case 'completed':
      return 'default' // Blue - completed campaigns
    case 'archived':
      return 'secondary' // Gray - archived campaigns
    case 'expired':
      return 'destructive' // Red - expired campaigns
    default:
      return 'secondary'
  }
}

/**
 * Get custom status badge styling for better color differentiation
 */
export function getStatusBadgeStyle(status: string | null | undefined) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
    case 'archived':
      return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
  }
}
