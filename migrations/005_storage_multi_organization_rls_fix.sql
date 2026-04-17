-- Migration: Fix Storage RLS for Multi-Organization Users
-- Description: Update storage.objects policies to support multi-organization access
-- Root Cause: LIMIT 1 in policies only allowed access to one arbitrary organization per user

-- Drop existing problematic storage policies
DROP POLICY IF EXISTS "Users can delete their org files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their org files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their org files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their org folder" ON storage.objects;

-- Create new multi-organization aware storage policies
-- SELECT policy - allows reading from any active organization the user belongs to
CREATE POLICY "Users can read their org files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'media-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true 
      AND organization_id::text = split_part(name, '/', 1)
  )
);

-- INSERT policy - allows uploading to any active organization the user belongs to
CREATE POLICY "Users can upload to their org folder" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'media-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true 
      AND organization_id::text = split_part(name, '/', 1)
  )
);

-- UPDATE policy - allows updating files in any active organization the user belongs to
CREATE POLICY "Users can update their org files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'media-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true 
      AND organization_id::text = split_part(name, '/', 1)
  )
)
WITH CHECK (
  bucket_id = 'media-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true 
      AND organization_id::text = split_part(name, '/', 1)
  )
);

-- DELETE policy - allows deleting files from any active organization the user belongs to
CREATE POLICY "Users can delete their org files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'media-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE user_id = auth.uid() 
      AND is_active = true 
      AND organization_id::text = split_part(name, '/', 1)
  )
);

-- Note: service_role_temp policies remain for server actions that use service role
