export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived'

export type CampaignPillar = 
  | 'brand_awareness'
  | 'service_promotion' 
  | 'customer_trust'
  | 'education_tips'
  | 'seasonal_event'
  | 'brand_story'

export type CampaignGoal = 
  | 'brand_awareness'
  | 'drive_engagement'
  | 'generate_leads'
  | 'promote_offer'
  | 'drive_bookings'

export type TargetAudience = 
  | 'general_audience'
  | 'business_clients'
  | 'luxury_travelers'
  | 'hotel_guests'
  | 'event_attendees'
  | 'tourists_visitors'

export type ScheduleType = 'date_range' | 'selected_dates'

export interface CreateCampaignFormData {
  // Basic Setup
  name: string
  campaignPillar: CampaignPillar | undefined
  mainGoal: CampaignGoal | undefined
  targetAudience: TargetAudience | undefined
  targetMarket: string
  
  // Schedule
  scheduleType: ScheduleType
  startDate?: string
  endDate?: string
  selectedDates: string[]
  
  // Notes
  description: string
  
  // Advanced
  slug: string
  status: CampaignStatus
}

export interface CampaignPillarOption {
  value: CampaignPillar
  label: string
  description: string
}

export interface CampaignGoalOption {
  value: CampaignGoal
  label: string
}

export interface TargetAudienceOption {
  value: TargetAudience
  label: string
}

export interface ScheduleTypeOption {
  value: ScheduleType
  label: string
  description: string
}

export interface OrganizationProfileDefaults {
  primaryGoal: string | null
  targetAudience: string | null
}
