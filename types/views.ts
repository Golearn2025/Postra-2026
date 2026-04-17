// App View Types - Read Models
// These are stable read model types for UI consumption

export interface AppCampaignsListItem {
  id: string
  organization_id: string
  name: string | null
  slug: string | null
  status: 'draft' | 'active' | 'completed' | 'archived'
  campaign_pillar: string | null
  objective: string | null
  target_audience: string | null
  target_market: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  campaign_duration_days: number | null
  schedule_type: 'date_range' | 'selected_dates' | null
  selected_dates_count: number
}

export interface AppCampaignDetail {
  id: string
  organization_id: string
  name: string | null
  slug: string | null
  status: 'draft' | 'active' | 'completed' | 'archived'
  campaign_pillar: string | null
  objective: string | null
  target_audience: string | null
  target_market: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  created_by: string | null
  updated_by: string | null
  campaign_duration_days: number | null
  schedule_type: 'date_range' | 'selected_dates' | null
  selected_dates_count: number
  selected_dates: string[]
}

export interface AppPostsListItem {
  id: string
  organization_id: string
  campaign_id: string | null
  campaign_name: string | null
  title: string
  source: 'manual' | 'chatgpt_imported' | 'ai_platform_generated' | 'bulk_imported'
  content_type: string
  status: 'draft' | 'imported' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'failed' | 'archived'
  caption_master: string | null
  master_hook: string | null
  master_cta: string | null
  primary_media_asset_id: string | null
  metadata: Record<string, unknown>
  scheduled_at: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  created_by: string | null
}

export interface AppCalendarSlotListItem {
  id: string
  organization_id: string
  campaign_id: string | null
  campaign_name: string | null
  assigned_post_id: string | null
  post_title: string | null
  post_caption_master: string | null
  post_status: 'draft' | 'imported' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'failed' | 'archived' | null
  post_source: 'manual' | 'chatgpt_imported' | 'ai_platform_generated' | 'bulk_imported' | null
  post_metadata: Record<string, unknown> | null
  primary_media_asset_id: string | null
  media_filename: string | null
  media_file_url: string | null
  media_storage_path: string | null
  media_mime_type: string | null
  media_width: number | null
  media_height: number | null
  // Thumbnail fields from database view
  media_thumb_storage_path: string | null
  media_small_storage_path: string | null
  slot_date: string
  slot_time: string | null
  timezone: string
  slot_status: 'empty' | 'planned' | 'scheduled' | 'published' | 'skipped' | 'canceled'
  target_goal: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
  signedUrl?: string
  thumbnailUrl?: string
}

export interface AppMediaAssetsListItem {
  id: string
  organization_id: string
  campaign_id: string | null
  campaign_name: string | null
  type: 'image' | 'video' | 'thumbnail' | 'logo'
  source: 'uploaded' | 'ai_generated' | 'imported_manual' | 'rendered_template'
  status: 'draft' | 'ready' | 'processing' | 'failed' | 'archived'
  title: string | null
  original_filename: string | null
  storage_path: string | null
  mime_type: string | null
  file_size_bytes: number | null
  format_group: 'vertical_mobile' | 'portrait_feed' | 'square' | 'landscape' | null
  alt_text: string | null
  transcript: string | null
  hook_text: string | null
  tags: string[]
  suggested_platforms: string[]
  // New metadata fields for AI brief generation
  asset_title_short: string | null
  asset_description: string | null
  asset_tags: string[] | null
  asset_ai_hint: string | null
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
}

export interface AppMediaAssetDetail {
  id: string
  organization_id: string
  campaign_id: string | null
  campaign_name: string | null
  type: 'image' | 'video' | 'thumbnail' | 'logo'
  source: 'uploaded' | 'ai_generated' | 'imported_manual' | 'rendered_template'
  status: 'draft' | 'ready' | 'processing' | 'failed' | 'archived'
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
  format_group: 'vertical_mobile' | 'portrait_feed' | 'square' | 'landscape' | null
  aspect_ratio: string | null
  thumbnail_asset_id: string | null
  alt_text: string | null
  transcript: string | null
  hook_text: string | null
  tags: string[]
  suggested_platforms: string[]
  metadata: Record<string, unknown>
  // New metadata fields for AI brief generation
  asset_title_short: string | null
  asset_description: string | null
  asset_tags: string[] | null
  asset_ai_hint: string | null
  created_at: string | null
  updated_at: string | null
  created_by: string | null
  updated_by: string | null
}
