'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { createMediaAsset, updateMediaAsset, softDeleteMediaAsset } from '@/server/repositories/media-assets.repository'
import { mediaMetadataSchema } from '@/features/media-library/schemas/media-asset.schema'
import type { MediaMetadataFormValues } from '@/features/media-library/schemas/media-asset.schema'
import { generateAndUploadThumbnails } from '@/server/services/thumbnail.service'

export type FileFields = {
  original_filename?: string
  file_url?: string
  storage_path?: string
  mime_type?: string
  file_size_bytes?: number
  // Thumbnail fields for upload pipeline
  thumb_storage_path?: string
  thumb_file_url?: string
  thumb_file_size_bytes?: number
  small_storage_path?: string
  small_file_url?: string
  small_file_size_bytes?: number
}

export async function createMediaAssetAction(
  organizationId: string,
  values: MediaMetadataFormValues,
  fileFields: FileFields = {}
): Promise<{ error?: string; id?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = mediaMetadataSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const asset = await createMediaAsset(supabase, organizationId, user.profile.id, parsed.data, fileFields)

  if (!asset) return { error: 'Failed to create media asset. Please try again.' }

  revalidatePath('/media-library')
  redirect(`/media-library/${asset.id}` as any)
}

export async function createMediaAssetBulkAction(
  organizationId: string,
  values: MediaMetadataFormValues,
  fileFields: FileFields = {}
): Promise<{ error?: string; id?: string }> {
  console.log('DEBUG: createMediaAssetBulkAction called')
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = mediaMetadataSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  console.log('DEBUG: Creating media asset in bulk mode')
  
  // Generate thumbnails for images if storage_path exists
  let enhancedFileFields = { ...fileFields }
  if (fileFields.storage_path && parsed.data.type === 'image') {
    try {
      // Download original image buffer for thumbnail generation
      const { data: originalFile } = await supabase.storage
        .from('media-assets')
        .download(fileFields.storage_path)
      
      if (originalFile) {
        console.log('DEBUG: Generating thumbnails for image')
        // Convert Blob to Buffer for Sharp processing
        const arrayBuffer = await originalFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const thumbnailResults = await generateAndUploadThumbnails(
          supabase,
          fileFields.storage_path,
          buffer
        )
        
        // Add thumbnail paths to file fields
        enhancedFileFields = {
          ...fileFields,
          thumb_storage_path: thumbnailResults.thumb.path,
          small_storage_path: thumbnailResults.small.path,
        }
        console.log('DEBUG: Thumbnails generated successfully')
      }
    } catch (error) {
      console.error('Failed to generate thumbnails:', error)
      // Continue without thumbnails - fallback will handle it
    }
  }
  
  const asset = await createMediaAsset(supabase, organizationId, user.profile.id, parsed.data, enhancedFileFields)

  if (!asset) {
    console.log('DEBUG: Failed to create media asset in bulk mode')
    return { error: 'Failed to create media asset. Please try again.' }
  }

  console.log('DEBUG: Successfully created media asset in bulk mode, ID:', asset.id)
  revalidatePath('/media-library')
  // NO REDIRECT in bulk mode
  return { id: asset.id }
}

export async function updateMediaAssetAction(
  mediaId: string,
  organizationId: string,
  values: MediaMetadataFormValues
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = mediaMetadataSchema.safeParse(values)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const supabase = await getSupabaseServerClient()
  const asset = await updateMediaAsset(supabase, mediaId, organizationId, user.profile.id, parsed.data)

  if (!asset) return { error: 'Failed to update media asset. Please try again.' }

  revalidatePath(`/media-library/${mediaId}`)
  revalidatePath('/media-library')
  return {}
}

export async function softDeleteMediaAssetAction(
  mediaId: string,
  organizationId: string
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()
  const asset = await softDeleteMediaAsset(supabase, mediaId, organizationId, user.profile.id)
  if (!asset) return { error: 'Failed to delete media asset. Please try again.' }

  revalidatePath('/media-library')
  return {}
}

export async function bulkUpdateMediaAssetsAction(
  assetIds: string[],
  organizationId: string,
  metadata: {
    source?: string
    status?: string
    format_group?: string | null
    suggested_platforms?: string[]
    tags?: string
    campaign_id?: string | null
  }
): Promise<{ error?: string; updatedCount?: number }> {
  console.log('=== DEBUG: bulkUpdateMediaAssetsAction START ===')
  console.log('DEBUG: bulkUpdateMediaAssetsAction called', { assetIds, organizationId, metadata })
  console.log('DEBUG: Number of assets to update:', assetIds.length)
  console.log('DEBUG: Suggested platforms in metadata:', metadata.suggested_platforms)
  
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()
  let updatedCount = 0

  try {
    for (const assetId of assetIds) {
      console.log(`DEBUG: Updating asset ${assetId}`)
      
      // Build update object with only provided fields
      const updateData: any = {
        updated_by: user.profile.id,
        updated_at: new Date().toISOString(),
      }

      console.log(`DEBUG: Processing asset ${assetId}, metadata:`, metadata)

      if (metadata.source !== undefined && metadata.source !== '') {
        updateData.source = metadata.source
        console.log(`DEBUG: Adding source to updateData:`, metadata.source)
      }
      if (metadata.status !== undefined && metadata.status !== '') {
        updateData.status = metadata.status
        console.log(`DEBUG: Adding status to updateData:`, metadata.status)
      }
      if (metadata.format_group !== undefined && metadata.format_group !== null) {
        updateData.format_group = metadata.format_group
        console.log(`DEBUG: Adding format_group to updateData:`, metadata.format_group)
      }
      if (metadata.suggested_platforms !== undefined && metadata.suggested_platforms.length > 0) {
        updateData.suggested_platforms = metadata.suggested_platforms
        console.log(`DEBUG: Adding suggested_platforms to updateData:`, metadata.suggested_platforms)
      }
      if (metadata.tags !== undefined && metadata.tags !== '') {
        updateData.tags = metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        console.log(`DEBUG: Adding tags to updateData:`, updateData.tags)
      }
      if (metadata.campaign_id !== undefined && metadata.campaign_id !== null && metadata.campaign_id !== '') {
        updateData.campaign_id = metadata.campaign_id
        console.log(`DEBUG: Adding campaign_id to updateData:`, metadata.campaign_id)
      }

      console.log(`DEBUG: Final updateData for asset ${assetId}:`, updateData)
      console.log(`DEBUG: updateData keys count:`, Object.keys(updateData).length)

      // Only update if there are fields to update
      if (Object.keys(updateData).length > 2) { // > 2 because we always have updated_by and updated_at
        console.log(`DEBUG: Proceeding with database update for asset ${assetId}`)
        const { error } = await supabase
          .from('media_assets')
          .update(updateData)
          .eq('id', assetId)
          .eq('organization_id', organizationId)
          .is('deleted_at', null)

        if (error) {
          console.error(`DEBUG: Failed to update asset ${assetId}:`, error)
        } else {
          console.log(`DEBUG: Successfully updated asset ${assetId}`)
          updatedCount++
        }
      } else {
        console.log(`DEBUG: Skipping update for asset ${assetId} - no fields to update`)
        console.log(`DEBUG: updateData keys:`, Object.keys(updateData))
        console.log(`DEBUG: updateData values:`, Object.values(updateData))
      }
    }

    revalidatePath('/media-library')
    revalidatePath('/media-library/bulk-edit')
    console.log(`DEBUG: Bulk update completed. Updated ${updatedCount} assets`)
    console.log(`DEBUG: Revalidated paths: /media-library, /media-library/bulk-edit`)
    console.log('=== DEBUG: bulkUpdateMediaAssetsAction END ===')
    return { updatedCount }
  } catch (error) {
    console.error('DEBUG: Bulk update error:', error)
    return { error: 'Failed to update media assets. Please try again.' }
  }
}
