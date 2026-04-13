/**
 * Postra Database Types
 *
 * This file is the canonical source of truth for database schema types.
 * It should be regenerated from Supabase when the schema changes:
 *   npx supabase gen types typescript --project-id wjvuowstthlwgnndcmvq > types/database.ts
 *
 * Until regeneration, types are manually maintained here as a structural reference.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export type OrganizationStatus = 'active' | 'suspended' | 'pending'
export type OrganizationMemberRole = 'org_admin' | 'editor' | 'reviewer' | 'viewer'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'tiktok'
  | 'google_business'
  | 'threads'
  | 'youtube'

export type SocialAccountStatus = 'active' | 'disconnected' | 'expired' | 'error'
export type MediaAssetType = 'image' | 'video' | 'thumbnail' | 'logo'
export type MediaAssetSource = 'uploaded' | 'ai_generated' | 'imported_manual' | 'rendered_template'
export type MediaAssetStatus = 'draft' | 'ready' | 'processing' | 'failed' | 'archived'

export type ContentPostStatus =
  | 'draft'
  | 'imported'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'archived'

export type ContentVariantStatus =
  | 'draft'
  | 'ready'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'archived'

export type CalendarSlotStatus = 'empty' | 'planned' | 'scheduled' | 'published' | 'skipped' | 'canceled'
export type PublishLogStatus = 'pending' | 'success' | 'failed'

export type AiGenerationType =
  | 'caption'
  | 'rewrite'
  | 'month_plan'
  | 'year_plan'
  | 'image_prompt'
  | 'image_generation'
  | 'video_hook'
  | 'video_script'
  | 'hashtags'

export type AiGenerationStatus = 'pending' | 'success' | 'failed'
export type ContentSourceType = 'manual' | 'chatgpt_imported' | 'ai_platform_generated' | 'bulk_imported'

export type ContentPillarType =
  | 'luxury'
  | 'airport'
  | 'corporate'
  | 'wedding'
  | 'testimonial'
  | 'promo'
  | 'educational'
  | 'seasonal'
  | 'general'

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'archived'
export type FormatGroupType = 'vertical_mobile' | 'portrait_feed' | 'square' | 'landscape'

// ─── Row Types ───────────────────────────────────────────────────────────────

export interface DbProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_platform_owner: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface DbOrganization {
  id: string
  name: string
  slug: string
  status: OrganizationStatus
  brand_logo_url: string | null
  timezone: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface DbOrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: OrganizationMemberRole
  is_active: boolean
  invited_at: string | null
  joined_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface DbOrganizationSettings {
  id: string
  organization_id: string
  default_timezone: string
  default_language: string
  ai_enabled: boolean
  bulk_import_enabled: boolean
  max_social_accounts: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface DbOrganizationSubscription {
  id: string
  organization_id: string
  plan_id: string
  status: SubscriptionStatus
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface DbContentCampaign {
  id: string
  organization_id: string
  name: string
  slug: string
  status: CampaignStatus
  pillar: ContentPillarType | null
  objective: string | null
  target_audience: string | null
  target_market: string | null
  timezone: string
  start_date: string | null
  end_date: string | null
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  deleted_by: string | null
}

export interface DbSocialAccount {
  id: string
  organization_id: string
  platform: SocialPlatform
  account_name: string
  external_account_id: string
  account_handle: string | null
  status: SocialAccountStatus
  token_expires_at: string | null
  last_sync_at: string | null
  last_publish_at: string | null
  last_error_at: string | null
  last_error_message: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  deleted_by: string | null
}

export interface DbMediaAsset {
  id: string
  organization_id: string
  campaign_id: string | null
  type: MediaAssetType
  source: MediaAssetSource
  status: MediaAssetStatus
  title: string | null
  description: string | null
  original_filename: string | null
  storage_path: string | null
  file_url: string | null
  mime_type: string | null
  file_size_bytes: number | null
  width: number | null
  height: number | null
  duration_seconds: number | null
  format_group: FormatGroupType | null
  aspect_ratio: string | null
  thumbnail_asset_id: string | null
  alt_text: string | null
  transcript: string | null
  hook_text: string | null
  tags: string[]
  suggested_platforms: string[]
  metadata: Record<string, unknown>
  // Thumbnail fields for persistent preview support
  thumb_storage_path: string | null
  thumb_file_url: string | null
  thumb_file_size_bytes: number | null
  thumb_width: number | null
  thumb_height: number | null
  small_storage_path: string | null
  small_file_url: string | null
  small_file_size_bytes: number | null
  small_width: number | null
  small_height: number | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  deleted_by: string | null
}

export interface DbContentPost {
  id: string
  organization_id: string
  campaign_id: string | null
  primary_media_asset_id: string | null
  title: string
  slug: string | null
  pillar: ContentPillarType | null
  source: ContentSourceType
  content_type: string
  status: ContentPostStatus
  caption_master: string | null
  master_hook: string | null
  master_cta: string | null
  preferred_format_group: FormatGroupType | null
  import_media_filename: string | null
  import_batch_id: string | null
  scheduled_at: string | null
  published_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

export interface DbImportBatch {
  id: string
  organization_id: string
  campaign_id: string | null
  source: ContentSourceType
  import_format: string
  total_items: number
  success_items: number
  failed_items: number
  notes: string | null
  metadata: Record<string, unknown>
  created_at: string
  created_by: string | null
}
