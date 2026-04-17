-- Migration: Add campaign_pillar_custom field
-- Date: 2026-04-14
-- Purpose: Enable organization-specific custom campaign pillars
-- Backward compatibility: Maintains existing pillar enum field

-- Step 1: Add new column to content_campaigns
ALTER TABLE content_campaigns 
ADD COLUMN campaign_pillar_custom text NULL;

COMMENT ON COLUMN content_campaigns.campaign_pillar_custom IS 'Organization-specific custom campaign pillar (alternative to enum pillar field)';

-- Step 2: Recreate app_campaigns_list view with new column
DROP VIEW IF EXISTS app_campaigns_list;

CREATE VIEW app_campaigns_list AS
SELECT 
  id,
  organization_id,
  name,
  slug,
  status,
  pillar,
  campaign_pillar_custom,
  timezone,
  target_market,
  start_date,
  end_date,
  description,
  created_at,
  updated_at,
  CASE
    WHEN start_date IS NOT NULL AND end_date IS NOT NULL 
    THEN end_date - start_date + 1
    ELSE NULL::integer
  END AS campaign_duration_days
FROM content_campaigns c
WHERE deleted_at IS NULL;

-- Step 3: Recreate app_campaign_detail view with new column
DROP VIEW IF EXISTS app_campaign_detail;

CREATE VIEW app_campaign_detail AS
SELECT 
  id,
  organization_id,
  name,
  slug,
  status,
  pillar,
  campaign_pillar_custom,
  objective,
  target_audience,
  target_market,
  timezone,
  start_date,
  end_date,
  description,
  metadata,
  created_at,
  updated_at,
  created_by,
  updated_by,
  CASE
    WHEN start_date IS NOT NULL AND end_date IS NOT NULL 
    THEN end_date - start_date + 1
    ELSE NULL::integer
  END AS campaign_duration_days
FROM content_campaigns c
WHERE deleted_at IS NULL;
