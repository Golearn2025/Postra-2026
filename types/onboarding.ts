/**
 * Onboarding Types
 * Types for organization onboarding flow
 */

export const INDUSTRIES = [
  'ecommerce',
  'local_services',
  'professional_services',
  'hospitality_travel',
  'health_wellness',
  'real_estate',
  'education_coaching',
  'food_beverage',
  'beauty_personal_care',
  'events_entertainment',
  'finance_insurance',
  'other'
] as const

export const TARGET_AUDIENCES = [
  'general_audience',
  'young_adults',
  'families',
  'professionals',
  'business_clients',
  'luxury_clients',
  'tourists_visitors',
  'local_community',
  'students',
  'other'
] as const

export const PRIMARY_GOALS = [
  'brand_awareness',
  'more_sales',
  'more_bookings',
  'more_leads',
  'more_engagement',
  'promote_services',
  'product_launch',
  'build_trust',
  'drive_website_traffic'
] as const

export const DEFAULT_TONES = [
  'friendly',
  'professional',
  'premium',
  'playful',
  'inspirational',
  'trustworthy'
] as const

export const PLATFORMS = [
  'facebook',
  'instagram',
  'tiktok',
  'linkedin',
  'google_business',
  'youtube'
] as const

export type Industry = typeof INDUSTRIES[number]
export type TargetAudience = typeof TARGET_AUDIENCES[number]
export type PrimaryGoal = typeof PRIMARY_GOALS[number]
export type DefaultTone = typeof DEFAULT_TONES[number]
export type Platform = typeof PLATFORMS[number]

export interface IndustryOption {
  value: Industry
  label: string
  description: string
}

export interface TargetAudienceOption {
  value: TargetAudience
  label: string
  description: string
}

export interface PrimaryGoalOption {
  value: PrimaryGoal
  label: string
  description: string
}

export interface DefaultToneOption {
  value: DefaultTone
  label: string
  description: string
}

export interface PlatformOption {
  value: Platform
  label: string
  description: string
}

export interface OnboardingData {
  industry: Industry | null
  industryOtherText: string | null
  targetAudience: TargetAudience | null
  targetAudienceOtherText: string | null
  primaryGoal: PrimaryGoal | null
  defaultTone: DefaultTone | null
  platforms: Platform[]
}

export interface OrganizationOnboardingStatus {
  organizationId: string
  organizationName: string
  organizationSlug: string
  onboardingCompletedAt: string | null
  isOnboardingCompleted: boolean
}

export interface OrganizationProfile {
  organizationId: string
  industry: string | null
  industryOtherText: string | null
  targetAudience: string | null
  targetAudienceOtherText: string | null
  primaryGoal: string | null
  defaultTone: string | null
  defaultLanguage: string
  onboardingCompletedAt: string | null
}
