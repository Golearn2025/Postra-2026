import type { 
  CreateCampaignFormData, 
  CampaignStatus, 
  ScheduleType 
} from '@/types/campaigns'
import type { OrganizationProfileDefaults } from '@/types/campaigns'

export function getDefaultCampaignData(
  orgDefaults: OrganizationProfileDefaults
): Partial<CreateCampaignFormData> {
  return {
    // Basic Setup - prefill from org defaults
    mainGoal: mapOrgGoalToCampaignGoal(orgDefaults.primaryGoal),
    targetAudience: mapOrgAudienceToCampaignAudience(orgDefaults.targetAudience),
    
    // Schedule defaults
    scheduleType: 'date_range',
    selectedDates: [],
    
    // Status defaults
    status: 'draft',
    
    // Clear fields that user must fill
    name: '',
    campaignPillar: undefined,
    targetMarket: '',
    description: '',
    slug: ''
  }
}

function mapOrgGoalToCampaignGoal(orgGoal: string | null): any {
  if (!orgGoal) return undefined
  
  // Map organization goal to campaign goal if they match
  const goalMap: Record<string, any> = {
    'brand_awareness': 'brand_awareness',
    'drive_engagement': 'drive_engagement', 
    'generate_leads': 'generate_leads',
    'promote_offer': 'promote_offer',
    'drive_bookings': 'drive_bookings'
  }
  
  return goalMap[orgGoal]
}

function mapOrgAudienceToCampaignAudience(orgAudience: string | null): any {
  if (!orgAudience) return undefined
  
  // Map organization audience to campaign audience if they match
  const audienceMap: Record<string, any> = {
    'general_audience': 'general_audience',
    'business_clients': 'business_clients',
    'luxury_travelers': 'luxury_travelers',
    'hotel_guests': 'hotel_guests',
    'event_attendees': 'event_attendees',
    'tourists_visitors': 'tourists_visitors'
  }
  
  return audienceMap[orgAudience]
}

export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}
