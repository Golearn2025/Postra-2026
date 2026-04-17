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
  archived: 'Archived'
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
      return 'default'
    case 'draft':
      return 'secondary'
    case 'paused':
      return 'outline'
    case 'completed':
      return 'default'
    case 'archived':
      return 'secondary'
    default:
      return 'secondary'
  }
}
