-- Migration: Add rich metadata fields to media_assets table
-- Purpose: Support enhanced asset context for AI brief generation
-- Version: v1.2

-- Add new metadata columns to media_assets table
ALTER TABLE media_assets 
ADD COLUMN asset_title_short TEXT NULL,
ADD COLUMN asset_description TEXT NULL,
ADD COLUMN asset_tags TEXT[] NULL,
ADD COLUMN asset_ai_hint TEXT NULL;

-- Add comments for documentation
COMMENT ON COLUMN media_assets.asset_title_short IS 'Short clean title for UI/library display (max 200 chars)';
COMMENT ON COLUMN media_assets.asset_description IS '1 short sentence describing the visual scene (max 500 chars)';
COMMENT ON COLUMN media_assets.asset_tags IS 'Array of tags/keywords for categorization and AI context';
COMMENT ON COLUMN media_assets.asset_ai_hint IS 'Optional short creative angle or intended message for AI generation (max 300 chars)';

-- Update app_media_assets_list view to include new fields
CREATE OR REPLACE VIEW app_media_assets_list AS
SELECT 
  ma.id,
  ma.organization_id,
  ma.campaign_id,
  ma.type,
  ma.source,
  ma.status,
  ma.title,
  ma.description,
  ma.original_filename,
  ma.file_url,
  ma.mime_type,
  ma.file_size_bytes,
  ma.width,
  ma.height,
  ma.duration_seconds,
  ma.format_group,
  ma.aspect_ratio,
  ma.alt_text,
  ma.transcript,
  ma.hook_text,
  ma.tags,
  ma.suggested_platforms,
  ma.created_at,
  ma.updated_at,
  ma.created_by,
  ma.updated_by,
  ma.deleted_at,
  ma.deleted_by,
  -- New metadata fields
  ma.asset_title_short,
  ma.asset_description,
  ma.asset_tags,
  ma.asset_ai_hint,
  -- Thumbnail fields
  ma.thumb_storage_path,
  ma.thumb_file_url,
  ma.thumb_file_size_bytes,
  ma.thumb_width,
  ma.thumb_height,
  ma.small_storage_path,
  ma.small_file_url,
  ma.small_file_size_bytes,
  ma.small_width,
  ma.small_height
FROM media_assets ma
WHERE ma.deleted_at IS NULL;

-- Update app_media_asset_detail view to include new fields
CREATE OR REPLACE VIEW app_media_asset_detail AS
SELECT 
  ma.id,
  ma.organization_id,
  ma.campaign_id,
  ma.type,
  ma.source,
  ma.status,
  ma.title,
  ma.description,
  ma.original_filename,
  ma.file_url,
  ma.mime_type,
  ma.file_size_bytes,
  ma.width,
  ma.height,
  ma.duration_seconds,
  ma.format_group,
  ma.aspect_ratio,
  ma.alt_text,
  ma.transcript,
  ma.hook_text,
  ma.tags,
  ma.suggested_platforms,
  ma.metadata,
  ma.created_at,
  ma.updated_at,
  ma.created_by,
  ma.updated_by,
  ma.deleted_at,
  ma.deleted_by,
  -- New metadata fields
  ma.asset_title_short,
  ma.asset_description,
  ma.asset_tags,
  ma.asset_ai_hint,
  -- Thumbnail fields
  ma.thumb_storage_path,
  ma.thumb_file_url,
  ma.thumb_file_size_bytes,
  ma.thumb_width,
  ma.thumb_height,
  ma.small_storage_path,
  ma.small_file_url,
  ma.small_file_size_bytes,
  ma.small_width,
  ma.small_height
FROM media_assets ma
WHERE ma.deleted_at IS NULL;
