'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'

export async function archiveCampaignAction(
  campaignId: string
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('content_campaigns')
    .update({
      status: 'archived',
      updated_by: user.profile.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)

  if (error) {
    console.error('Archive campaign error:', error)
    return { error: 'Failed to archive campaign. Please try again.' }
  }

  revalidatePath('/campaigns')
  return {}
}

export async function toggleCampaignStatusAction(
  campaignId: string,
  newStatus: 'active' | 'paused' | 'draft'
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('content_campaigns')
    .update({
      status: newStatus,
      updated_by: user.profile.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)

  if (error) {
    console.error('Toggle campaign status error:', error)
    return { error: 'Failed to update campaign status. Please try again.' }
  }

  revalidatePath('/campaigns')
  return {}
}

export async function deleteCampaignAction(
  campaignId: string
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()
  const now = new Date().toISOString()

  // Get all media assets for this campaign
  const { data: mediaAssets, error: fetchError } = await supabase
    .from('media_assets')
    .select('id, storage_path, thumb_storage_path, small_storage_path')
    .eq('campaign_id', campaignId)
    .is('deleted_at', null)

  if (fetchError) {
    console.error('Failed to fetch media assets for campaign deletion:', fetchError)
    return { error: 'Failed to fetch campaign assets. Please try again.' }
  }

  const assetCount = mediaAssets?.length || 0

  if (assetCount > 0) {
    // Collect all storage paths
    const storagePaths = (mediaAssets || []).flatMap((asset: any) => [
      asset.storage_path,
      asset.thumb_storage_path,
      asset.small_storage_path
    ]).filter(Boolean) as string[]

    // Delete storage files
    if (storagePaths.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('media-assets')
        .remove(storagePaths)

      if (deleteError) {
        console.error('Failed to delete campaign storage files:', deleteError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Soft delete ALL related media assets atomically
    const { error: assetsDeleteError } = await supabase
      .from('media_assets')
      .update({
        deleted_at: now,
        deleted_by: user.profile.id,
        updated_at: now,
      })
      .eq('campaign_id', campaignId)
      .is('deleted_at', null)

    if (assetsDeleteError) {
      console.error('Failed to soft-delete campaign media assets:', assetsDeleteError)
      return { error: 'Failed to delete campaign assets. Please try again.' }
    }
  }

  // Soft delete campaign
  const { error: campaignDeleteError } = await supabase
    .from('content_campaigns')
    .update({
      deleted_at: now,
      updated_by: user.profile.id,
      updated_at: now,
    })
    .eq('id', campaignId)
    .is('deleted_at', null)

  if (campaignDeleteError) {
    console.error('Failed to soft-delete campaign:', campaignDeleteError)
    return { error: 'Failed to delete campaign. Please try again.' }
  }

  revalidatePath('/campaigns')
  revalidatePath('/media-library')
  return {}
}
