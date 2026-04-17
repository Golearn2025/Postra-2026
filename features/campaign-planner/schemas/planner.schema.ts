import { z } from 'zod'

// AI-generated draft post schema
export const aiDraftPostSchema = z.object({
  day: z.number(),
  date: z.string(),
  mediaFilename: z.string(),
  primaryTopic: z.string().optional(),
  title: z.string(),
  hook: z.string().optional(),
  caption: z.string(),
  cta: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
  targetGoal: z.string().optional(),
})

export type AIDraftPost = z.infer<typeof aiDraftPostSchema>

// Wizard state schema
export const plannerWizardStateSchema = z.object({
  // Step 1: Select Campaign
  selectedCampaignId: z.string().uuid().optional(),
  
  // Step 2: Choose Media
  selectedMediaIds: z.array(z.string().uuid()).default([]),
  
  // Step 3: Planning Setup
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  toneOfVoice: z.array(z.string()).min(1, 'Select at least one tone'),
  topics: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
  
  // Step 5: AI Output
  aiOutput: z.string().optional(),
  
  // Step 6: Parsed Drafts
  parsedDrafts: z.array(aiDraftPostSchema).default([]),
})

export type PlannerWizardState = z.infer<typeof plannerWizardStateSchema>

// AI brief generation parameters
export interface AIBriefParams {
  campaignName: string
  campaignObjective: string
  campaignTargetAudience: string
  campaignTargetMarket: string
  campaignStartDate: string
  campaignEndDate: string
  mediaAssets: Array<{
    filename: string
    title: string
    description: string
    tags: string[]
    // New metadata fields for AI context
    assetTitleShort?: string
    assetDescription?: string
    assetTags?: string[]
    assetAiHint?: string
  }>
  platforms: string[]
  toneOfVoice: string[]
  topics: string[]
  additionalNotes?: string
}

// Draft post creation params
export interface DraftPostCreationParams {
  organizationId: string
  campaignId: string
  userId: string
  drafts: AIDraftPost[]
  mediaAssetMap: Map<string, string> // filename -> asset ID
}
