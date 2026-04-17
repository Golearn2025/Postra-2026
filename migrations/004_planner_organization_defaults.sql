-- Phase Planner A1: Add Step 3 defaults to organization_settings
-- This provides enterprise-safe generic defaults for all organizations

-- Add platform_options to ai_defaults for all organizations that don't have it
UPDATE organization_settings 
SET ai_defaults = ai_defaults || 
'{
  "platform_options": [
    {"value": "instagram", "label": "Instagram", "enabled": true},
    {"value": "facebook", "label": "Facebook", "enabled": true},
    {"value": "tiktok", "label": "TikTok", "enabled": true},
    {"value": "linkedin", "label": "LinkedIn", "enabled": true},
    {"value": "pinterest", "label": "Pinterest", "enabled": true}
  ]
}'::jsonb
WHERE NOT (ai_defaults ? 'platform_options');

-- Add default_platforms to ai_defaults for all organizations that don't have it
UPDATE organization_settings 
SET ai_defaults = ai_defaults || 
'{
  "default_platforms": ["instagram", "facebook"]
}'::jsonb
WHERE NOT (ai_defaults ? 'default_platforms');

-- Add planner_topics to ai_defaults for all organizations that don't have it
UPDATE organization_settings 
SET ai_defaults = ai_defaults || 
'{
  "planner_topics": [
    {"value": "brand_story", "label": "Brand Story", "enabled": true},
    {"value": "product_service_highlight", "label": "Product / Service Highlight", "enabled": true},
    {"value": "customer_trust", "label": "Customer Trust", "enabled": true},
    {"value": "offer_promotion", "label": "Offer / Promotion", "enabled": true},
    {"value": "educational_post", "label": "Educational Post", "enabled": true},
    {"value": "behind_scenes", "label": "Behind the Scenes", "enabled": true},
    {"value": "lifestyle_moment", "label": "Lifestyle Moment", "enabled": true},
    {"value": "launch_announcement", "label": "Launch / Announcement", "enabled": true}
  ]
}'::jsonb
WHERE NOT (ai_defaults ? 'planner_topics');

-- Add comments for documentation
COMMENT ON COLUMN organization_settings.ai_defaults IS 'Organization-specific AI defaults including platform_options, default_platforms, and planner_topics for Step 3 of the campaign planner';
