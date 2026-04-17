-- Migration 002: Populate campaign_pillar from existing fields
-- Phase 2: Data Migration - Populate campaign_pillar from existing fields
-- Priority: campaign_pillar_custom first, then fallback to pillar (cast to text)

UPDATE content_campaigns 
SET campaign_pillar = COALESCE(campaign_pillar_custom, pillar::text, NULL)
WHERE campaign_pillar IS NULL;

-- Verify migration results
SELECT 
  COUNT(*) as total_campaigns,
  COUNT(CASE WHEN campaign_pillar IS NOT NULL THEN 1 END) as has_campaign_pillar,
  COUNT(CASE WHEN campaign_pillar_custom IS NOT NULL THEN 1 END) as has_custom_pillar,
  COUNT(CASE WHEN pillar IS NOT NULL THEN 1 END) as has_legacy_pillar,
  COUNT(CASE WHEN campaign_pillar IS NULL THEN 1 END) as still_null
FROM content_campaigns
WHERE deleted_at IS NULL;
