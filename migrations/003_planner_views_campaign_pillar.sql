-- Phase Planner A1: Add campaign_pillar to planner views
-- This ensures campaign pillar context is available in planner read views

-- Update app_planner_session_detail view to include campaign_pillar
DROP VIEW IF EXISTS app_planner_session_detail;

CREATE VIEW app_planner_session_detail AS
SELECT 
  ps.id,
  ps.organization_id,
  ps.campaign_id,
  c.name AS campaign_name,
  c.slug AS campaign_slug,
  c.objective AS campaign_objective,
  c.campaign_pillar,
  c.target_audience,
  c.target_market,
  c.start_date,
  c.end_date,
  ps.name,
  ps.status,
  ps.timezone,
  ps.duration_days,
  ps.platforms,
  ps.tone_of_voice,
  ps.topics_to_cover,
  ps.optional_notes,
  ps.generated_brief,
  ps.ai_output_raw,
  ps.metadata,
  ps.created_at,
  ps.updated_at,
  ps.created_by,
  ps.updated_by
FROM planner_sessions ps
LEFT JOIN content_campaigns c ON ((c.id = ps.campaign_id) AND (c.deleted_at IS NULL));

-- Update app_planner_sessions_list view to include campaign_pillar
DROP VIEW IF EXISTS app_planner_sessions_list;

CREATE VIEW app_planner_sessions_list AS
SELECT 
  ps.id,
  ps.organization_id,
  ps.campaign_id,
  c.name AS campaign_name,
  c.slug AS campaign_slug,
  c.campaign_pillar,
  ps.name,
  ps.status,
  ps.timezone,
  ps.duration_days,
  ps.platforms,
  ps.tone_of_voice,
  ps.topics_to_cover,
  ps.optional_notes,
  ps.created_at,
  ps.updated_at,
  (SELECT count(*) FROM planner_session_items psi WHERE psi.planner_session_id = ps.id) AS total_items,
  (SELECT count(*) FROM planner_session_items psi WHERE (psi.planner_session_id = ps.id AND psi.status = 'approved'::planner_item_status)) AS approved_items
FROM planner_sessions ps
LEFT JOIN content_campaigns c ON ((c.id = ps.campaign_id) AND (c.deleted_at IS NULL));

-- Add comments for documentation
COMMENT ON VIEW app_planner_session_detail IS 'Detailed view of planner sessions with campaign context including campaign_pillar';
COMMENT ON VIEW app_planner_sessions_list IS 'List view of planner sessions with campaign context including campaign_pillar';
