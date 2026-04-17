import { z } from 'zod'
import { INDUSTRIES, TARGET_AUDIENCES, PRIMARY_GOALS, DEFAULT_TONES, PLATFORMS } from '@/types/onboarding'

export const onboardingStep1Schema = z.object({
  industry: z.enum(INDUSTRIES),
  industryOtherText: z.string().min(5, 'Please provide at least 5 characters').max(140, 'Maximum 140 characters').optional()
}).refine((data) => {
  if (data.industry === 'other') {
    return data.industryOtherText && data.industryOtherText.trim().length >= 5
  }
  return true
}, {
  message: 'Please tell us more about your business (minimum 5 characters)',
  path: ['industryOtherText']
})

export const onboardingStep2Schema = z.object({
  targetAudience: z.enum(TARGET_AUDIENCES),
  targetAudienceOtherText: z.string().min(5, 'Please provide at least 5 characters').max(140, 'Maximum 140 characters').optional()
}).refine((data) => {
  if (data.targetAudience === 'other') {
    return data.targetAudienceOtherText && data.targetAudienceOtherText.trim().length >= 5
  }
  return true
}, {
  message: 'Please tell us more about your audience (minimum 5 characters)',
  path: ['targetAudienceOtherText']
})

export const onboardingStep3Schema = z.object({
  primaryGoal: z.enum(PRIMARY_GOALS)
})

export const onboardingStep4Schema = z.object({
  defaultTone: z.enum(DEFAULT_TONES)
})

export const onboardingStep5Schema = z.object({
  platforms: z.array(z.enum(PLATFORMS)).min(1, 'Select at least one platform')
})

export const completeOnboardingSchema = z.object({
  industry: z.enum(INDUSTRIES),
  industryOtherText: z.string().min(5, 'Please provide at least 5 characters').max(140, 'Maximum 140 characters').optional(),
  targetAudience: z.enum(TARGET_AUDIENCES),
  targetAudienceOtherText: z.string().min(5, 'Please provide at least 5 characters').max(140, 'Maximum 140 characters').optional(),
  primaryGoal: z.enum(PRIMARY_GOALS),
  defaultTone: z.enum(DEFAULT_TONES),
  platforms: z.array(z.enum(PLATFORMS)).min(1, 'Select at least one platform')
}).refine((data) => {
  if (data.industry === 'other') {
    return data.industryOtherText && data.industryOtherText.trim().length >= 5
  }
  return true
}, {
  message: 'Please tell us more about your business (minimum 5 characters)',
  path: ['industryOtherText']
}).refine((data) => {
  if (data.targetAudience === 'other') {
    return data.targetAudienceOtherText && data.targetAudienceOtherText.trim().length >= 5
  }
  return true
}, {
  message: 'Please tell us more about your audience (minimum 5 characters)',
  path: ['targetAudienceOtherText']
})

export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>
export type OnboardingStep4Input = z.infer<typeof onboardingStep4Schema>
export type OnboardingStep5Input = z.infer<typeof onboardingStep5Schema>
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>
