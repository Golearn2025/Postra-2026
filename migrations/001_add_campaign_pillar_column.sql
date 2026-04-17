-- Migration 001: Add campaign_pillar column
-- Phase 1: Add new nullable field for single pillar architecture

-- Add new nullable campaign_pillar column
ALTER TABLE content_campaigns 
ADD COLUMN campaign_pillar TEXT NULL;

-- Add index for performance
CREATE INDEX idx_content_campaigns_campaign_pillar 
ON content_campaigns(campaign_pillar);

-- Update app_campaigns_list view to expose campaign_pillar
DROP VIEW IF EXISTS app_campaigns_list;

CREATE VIEW app_campaigns_list AS
SELECT 
  id,
  organization_id,
  name,
  slug,
  status,
  pillar,  -- Keep existing pillar field
  campaign_pillar_custom,  -- Keep existing custom pillar field
  campaign_pillar,  -- NEW: Add new campaign_pillar field
  timezone,
  target_market,
  start_date,
  end_date,
  description,
  created_at,
  updated_at,
  -- Calculate campaign duration days
  CASE 
    WHEN end_date IS NOT NULL AND start_date IS NOT NULL 
    THEN end_date - start_date 
    ELSE NULL 
  END as campaign_duration_days
FROM content_campaigns
WHERE deleted_at IS NULL;

-- Update app_campaign_detail view to expose campaign_pillar
DROP VIEW IF EXISTS app_campaign_detail;

CREATE VIEW app_campaign_detail AS
SELECT 
  id,
  organization_id,
  name,
  slug,
  status,
  pillar,  -- Keep existing pillar field
  campaign_pillar_custom,  -- Keep existing custom pillar field
  campaign_pillar,  -- NEW: Add new campaign_pillar field
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
  -- Calculate campaign duration days
  CASE 
    WHEN end_date IS NOT NULL AND start_date IS NOT NULL 
    THEN end_date - start_date 
    ELSE NULL 
  END as campaign_duration_days
FROM content_campaigns
WHERE deleted_at IS NULL;
