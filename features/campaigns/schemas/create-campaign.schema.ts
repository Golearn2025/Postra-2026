import { z } from 'zod'
import type { 
  CampaignPillar, 
  CampaignGoal, 
  TargetAudience, 
  ScheduleType, 
  CampaignStatus 
} from '@/types/campaigns'
import { 
  CAMPAIGN_PILLAR_OPTIONS, 
  CAMPAIGN_GOAL_OPTIONS, 
  TARGET_AUDIENCE_OPTIONS, 
  SCHEDULE_TYPE_OPTIONS 
} from '../constants/campaign-options'

// Extract enum values from options
const CAMPAIGN_PILLARS = CAMPAIGN_PILLAR_OPTIONS.map(opt => opt.value) as [CampaignPillar, ...CampaignPillar[]]
const CAMPAIGN_GOALS = CAMPAIGN_GOAL_OPTIONS.map(opt => opt.value) as [CampaignGoal, ...CampaignGoal[]]
const TARGET_AUDIENCES = TARGET_AUDIENCE_OPTIONS.map(opt => opt.value) as [TargetAudience, ...TargetAudience[]]
const SCHEDULE_TYPES = SCHEDULE_TYPE_OPTIONS.map(opt => opt.value) as [ScheduleType, ...ScheduleType[]]

export const createCampaignSchema = z.object({
  // Basic Setup
  name: z.string().min(1, 'Please enter a campaign name').max(100, 'Campaign name is too long'),
  campaignPillar: z.enum(CAMPAIGN_PILLARS, {
    errorMap: () => ({ message: 'Please choose a campaign pillar' })
  }).optional(),
  mainGoal: z.enum(CAMPAIGN_GOALS, {
    errorMap: () => ({ message: 'Please choose a main goal' })
  }).optional(),
  targetAudience: z.enum(TARGET_AUDIENCES, {
    errorMap: () => ({ message: 'Please choose a target audience' })
  }).optional(),
  targetMarket: z.string().optional(),
  
  // Schedule
  scheduleType: z.enum(SCHEDULE_TYPES, {
    errorMap: () => ({ message: 'Please choose how this campaign will be scheduled' })
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  selectedDates: z.array(z.string()).optional(),
  
  // Notes
  description: z.string().optional(),
  
  // Advanced
  slug: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived', 'expired'] as const, {
    errorMap: () => ({ message: 'Please choose a campaign status' })
  }),
}).refine((data) => {
  // Date range validation
  if (data.scheduleType === 'date_range') {
    if (!data.startDate || !data.endDate) {
      return false
    }
    if (new Date(data.endDate) < new Date(data.startDate)) {
      return false
    }
  }
  
  // Selected dates validation
  if (data.scheduleType === 'selected_dates') {
    if (!data.selectedDates || data.selectedDates.length === 0) {
      return false
    }
  }
  
  return true
}, {
  message: 'Please complete all required fields',
  path: []
}).refine((data) => {
  // Specific validation for date range
  if (data.scheduleType === 'date_range' && data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: 'End date cannot be before start date',
  path: ['endDate']
}).refine((data) => {
  // Specific validation for selected dates
  if (data.scheduleType === 'selected_dates') {
    return data.selectedDates && data.selectedDates.length > 0
  }
  return true
}, {
  message: 'Please select at least one date',
  path: ['selectedDates']
})

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
