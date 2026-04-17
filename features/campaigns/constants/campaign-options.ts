import type { 
  CampaignPillar, 
  CampaignPillarOption,
  CampaignGoal,
  CampaignGoalOption,
  TargetAudience,
  TargetAudienceOption,
  ScheduleType,
  ScheduleTypeOption
} from '@/types/campaigns'

export const CAMPAIGN_PILLAR_OPTIONS: CampaignPillarOption[] = [
  {
    value: 'brand_awareness',
    label: 'Brand Awareness',
    description: 'Introduce your brand and increase recognition'
  },
  {
    value: 'service_promotion',
    label: 'Service Promotion',
    description: 'Highlight a service, offer, or core value'
  },
  {
    value: 'customer_trust',
    label: 'Customer Trust',
    description: 'Build credibility through reassurance, proof, and reliability'
  },
  {
    value: 'education_tips',
    label: 'Education & Tips',
    description: 'Share useful advice, insights, or guidance'
  },
  {
    value: 'seasonal_event',
    label: 'Seasonal / Event',
    description: 'Create content around a season, holiday, or special event'
  },
  {
    value: 'brand_story',
    label: 'Brand Story',
    description: 'Share your story, mission, or behind-the-scenes content'
  }
]

export const CAMPAIGN_GOAL_OPTIONS: CampaignGoalOption[] = [
  {
    value: 'brand_awareness',
    label: 'Brand Awareness'
  },
  {
    value: 'drive_engagement',
    label: 'Drive Engagement'
  },
  {
    value: 'generate_leads',
    label: 'Generate Leads'
  },
  {
    value: 'promote_offer',
    label: 'Promote an Offer'
  },
  {
    value: 'drive_bookings',
    label: 'Drive Bookings'
  }
]

export const TARGET_AUDIENCE_OPTIONS: TargetAudienceOption[] = [
  {
    value: 'general_audience',
    label: 'General Audience'
  },
  {
    value: 'business_clients',
    label: 'Business Clients'
  },
  {
    value: 'luxury_travelers',
    label: 'Luxury Travelers'
  },
  {
    value: 'hotel_guests',
    label: 'Hotel Guests'
  },
  {
    value: 'event_attendees',
    label: 'Event Attendees'
  },
  {
    value: 'tourists_visitors',
    label: 'Tourists & Visitors'
  }
]

export const SCHEDULE_TYPE_OPTIONS: ScheduleTypeOption[] = [
  {
    value: 'date_range',
    label: 'Consecutive Date Range',
    description: 'Best for campaigns that run continuously between a start and end date'
  },
  {
    value: 'selected_dates',
    label: 'Specific Selected Dates',
    description: 'Best for campaigns that should run only on chosen dates'
  }
]

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' }
] as const
