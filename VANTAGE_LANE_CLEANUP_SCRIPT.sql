-- VANTAGE LANE CLEANUP SCRIPT
-- Complete cleanup for vantage-lane-launch-campaign-5-days campaign

-- Step 1: Delete calendar slots
DELETE FROM app_calendar_slots 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 2: Delete calendar slots (base table)
DELETE FROM content_calendar_slots 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 3: Delete posts
DELETE FROM app_posts_list 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 4: Delete posts (base table)
DELETE FROM content_posts 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 5: Delete media assets
DELETE FROM app_media_assets_list 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 6: Delete media assets (base table)
DELETE FROM media_assets 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 7: Delete planner sessions
DELETE FROM app_planner_session_detail 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 8: Delete planner sessions (base table)
DELETE FROM planner_sessions 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 9: Delete planner session items
DELETE FROM app_planner_session_items_list 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 10: Delete planner session items (base table)
DELETE FROM planner_session_items 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 11: Delete import batches
DELETE FROM import_batches 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 12: Delete recurring events
DELETE FROM recurring_events 
WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Step 13: Finally, delete the campaign itself
DELETE FROM content_campaigns 
WHERE id = '40f96085-0494-4e70-b5fa-c282ae3964b1';

-- Verification queries
SELECT 'Calendar slots remaining' as table_name, COUNT(*) as count FROM app_calendar_slots WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1'
UNION ALL
SELECT 'Posts remaining', COUNT(*) FROM app_posts_list WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1'
UNION ALL
SELECT 'Media assets remaining', COUNT(*) FROM app_media_assets_list WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1'
UNION ALL
SELECT 'Planner sessions remaining', COUNT(*) FROM app_planner_session_detail WHERE campaign_id = '40f96085-0494-4e70-b5fa-c282ae3964b1'
UNION ALL
SELECT 'Campaign remaining', COUNT(*) FROM content_campaigns WHERE id = '40f96085-0494-4e70-b5fa-c282ae3964b1';
