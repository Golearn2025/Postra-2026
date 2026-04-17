-- Add 'expired' status to the campaign status check constraint
-- This migration adds support for expired campaign status

-- First, check if the constraint exists and drop it if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'content_campaigns_status_check' 
        AND table_name = 'content_campaigns'
    ) THEN
        ALTER TABLE content_campaigns DROP CONSTRAINT content_campaigns_status_check;
    END IF;
END $$;

-- Add the updated constraint with expired status included
ALTER TABLE content_campaigns 
ADD CONSTRAINT content_campaigns_status_check 
CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived', 'expired'));

-- Add comment to document the new status
COMMENT ON COLUMN content_campaigns.status IS 'Campaign status: draft, active, paused, completed, archived, expired';
