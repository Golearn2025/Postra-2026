-- Database Indexes Verification Script
-- Run this script to check if required indexes exist for optimal performance

-- Check if organizations.slug index exists
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'organizations' 
AND indexname LIKE '%slug%';

-- Check if organization_members composite index exists
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'organization_members' 
AND indexname LIKE '%organization_id%user_id%is_active%';

-- Check if content_campaigns organization_id index exists
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'content_campaigns' 
AND indexname LIKE '%organization_id%deleted_at%';

-- Recommended indexes to create if missing:
-- CREATE INDEX CONCURRENTLY idx_organizations_slug ON organizations(slug);
-- CREATE INDEX CONCURRENTLY idx_organization_members_org_user_active ON organization_members(organization_id, user_id, is_active);
-- CREATE INDEX CONCURRENTLY idx_campaigns_org_deleted ON content_campaigns(organization_id, deleted_at);

-- Query execution plan analysis
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM organizations WHERE slug = 'test-slug' LIMIT 1;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM organization_members 
WHERE organization_id = $1 AND user_id = $2 AND is_active = true 
LIMIT 1;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM content_campaigns 
WHERE organization_id = $1 AND deleted_at IS NULL 
ORDER BY created_at DESC;
