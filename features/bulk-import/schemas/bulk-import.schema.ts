import { z } from 'zod'

// Postra JSON Import v1 item schema
export const postraImportItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  campaign_slug: z.string().min(1, 'Campaign slug is required'),
  content_type: z.enum(['social_post', 'blog_post', 'email', 'ad_copy']).default('social_post'),
  post_status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format').default('10:00'),
  timezone: z.string().min(1, 'Timezone is required'),
  platforms: z.array(z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'])).min(1, 'At least one platform is required'),
  caption: z.string().min(1, 'Caption is required'),
  hook: z.string().optional(),
  cta: z.string().optional(),
  media_filename: z.string().min(1, 'Media filename is required'),
  format_group: z.enum(['vertical_mobile', 'portrait_feed', 'square', 'landscape']).optional(),
  visual_prompt: z.string().optional(),
  target_goal: z.string().optional(),
  hashtags: z.array(z.string()).optional().default([]),
})

export type PostraImportItem = z.infer<typeof postraImportItemSchema>

// Import batch schema for DB
export const importBatchSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  filename: z.string(),
  file_type: z.enum(['json', 'csv']),
  total_rows: z.number(),
  successful_rows: z.number(),
  failed_rows: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  errors: z.array(z.string()).optional(),
  created_at: z.string(),
  created_by: z.string().uuid(),
})

export type ImportBatch = z.infer<typeof importBatchSchema>

// Validation result for individual rows
export const importRowValidationSchema = z.object({
  row_number: z.number(),
  data: postraImportItemSchema,
  is_valid: z.boolean(),
  errors: z.array(z.string()),
  campaign_found: z.boolean(),
  media_found: z.boolean(),
  campaign_id: z.string().uuid().optional(),
  media_id: z.string().uuid().optional(),
})

export type ImportRowValidation = z.infer<typeof importRowValidationSchema>

// Import summary
export const importSummarySchema = z.object({
  total_rows: z.number(),
  valid_rows: z.number(),
  invalid_rows: z.number(),
  campaigns_found: z.number(),
  campaigns_missing: z.number(),
  media_found: z.number(),
  media_missing: z.number(),
  rows: z.array(importRowValidationSchema),
})

export type ImportSummary = z.infer<typeof importSummarySchema>

// CSV headers validation
export const CSV_HEADERS = [
  'title',
  'campaign_slug', 
  'content_type',
  'post_status',
  'scheduled_date',
  'scheduled_time',
  'timezone',
  'platforms',
  'caption',
  'hook',
  'cta',
  'media_filename',
  'format_group',
  'visual_prompt',
  'target_goal',
  'hashtags'
] as const

// Minimum required fields
export const REQUIRED_FIELDS = [
  'title',
  'campaign_slug',
  'scheduled_date',
  'timezone',
  'platforms',
  'caption',
  'media_filename'
] as const
