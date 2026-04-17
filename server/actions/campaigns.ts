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

  // NEW ARCHIVE FLOW: set archived_at = now()
  const { error } = await supabase
    .from('content_campaigns')
    .update({
      archived_at: new Date().toISOString(),
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

export async function restoreCampaignAction(
  campaignId: string
): Promise<{ error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()

  // Get campaign data to check for slug conflicts
  const { data: campaignData, error: fetchError } = await supabase
    .from('content_campaigns')
    .select('id, organization_id, slug')
    .eq('id', campaignId)
    .single()

  if (fetchError || !campaignData) {
    console.error('Failed to fetch campaign data for restore:', fetchError)
    return { error: 'Failed to fetch campaign data. Please try again.' }
  }

  // Check for slug conflicts with active campaigns
  const { data: conflictingCampaigns, error: conflictError } = await supabase
    .from('content_campaigns')
    .select('id, name')
    .eq('organization_id', campaignData.organization_id)
    .eq('slug', campaignData.slug)
    .is('archived_at', null)
    .is('deleted_at', null)
    .neq('id', campaignId)

  if (conflictError) {
    console.error('Failed to check slug conflicts:', conflictError)
    return { error: 'Failed to check for conflicts. Please try again.' }
  }

  if (conflictingCampaigns && conflictingCampaigns.length > 0) {
    const conflictName = conflictingCampaigns[0].name
    return { 
      error: `Cannot restore: Campaign "${conflictName}" is already using the same slug. Please rename the active campaign first.` 
    }
  }

  // Restore campaign by setting archived_at = null
  const { error: restoreError } = await supabase
    .from('content_campaigns')
    .update({
      archived_at: null,
      updated_by: user.profile.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)

  if (restoreError) {
    console.error('Restore campaign error:', restoreError)
    return { error: 'Failed to restore campaign. Please try again.' }
  }

  revalidatePath('/campaigns')
  return {}
}

export async function bulkDeleteCampaignsAction(
  campaignIds: string[]
): Promise<{ error?: string; deletedCount?: number; failedCount?: number }> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  const supabase = await getSupabaseServerClient()
  const now = new Date().toISOString()
  
  let deletedCount = 0
  let failedCount = 0

  for (const campaignId of campaignIds) {
    try {
      // Get all media assets for this campaign
      const { data: mediaAssets, error: fetchError } = await supabase
        .from('media_assets')
        .select('id, storage_path, thumb_storage_path, small_storage_path')
        .eq('campaign_id', campaignId)
        .is('deleted_at', null)

      if (fetchError) {
        console.error(`Failed to fetch media assets for campaign ${campaignId}:`, fetchError)
        failedCount++
        continue
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
            console.error(`Failed to delete storage files for campaign ${campaignId}:`, deleteError)
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
          console.error(`Failed to soft-delete media assets for campaign ${campaignId}:`, assetsDeleteError)
          failedCount++
          continue
        }
      }

      // Delete content_campaign_dates first
      const { error: datesDeleteError } = await supabase
        .from('content_campaign_dates')
        .delete()
        .eq('campaign_id', campaignId)

      if (datesDeleteError) {
        console.error(`Failed to delete campaign dates for ${campaignId}:`, datesDeleteError)
        failedCount++
        continue
      }

      // Hard delete the campaign
      const { error: campaignDeleteError } = await supabase
        .from('content_campaigns')
        .delete()
        .eq('id', campaignId)

      if (campaignDeleteError) {
        console.error(`Failed to hard-delete campaign ${campaignId}:`, campaignDeleteError)
        failedCount++
        continue
      }

      deletedCount++
    } catch (error) {
      console.error(`Unexpected error deleting campaign ${campaignId}:`, error)
      failedCount++
    }
  }

  revalidatePath('/campaigns')
  revalidatePath('/media-library')
  
  if (failedCount > 0) {
    return { 
      error: `Failed to delete ${failedCount} campaign${failedCount === 1 ? '' : 's'}. Successfully deleted ${deletedCount}.`,
      deletedCount,
      failedCount 
    }
  }

  return { deletedCount, failedCount: 0 }
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

  // NEW HARD DELETE FLOW: delete content_campaign_dates first, then content_campaigns
  const { error: datesDeleteError } = await supabase
    .from('content_campaign_dates')
    .delete()
    .eq('campaign_id', campaignId)

  if (datesDeleteError) {
    console.error('Failed to delete campaign dates:', datesDeleteError)
    return { error: 'Failed to delete campaign dates. Please try again.' }
  }

  // Hard delete the campaign
  const { error: campaignDeleteError } = await supabase
    .from('content_campaigns')
    .delete()
    .eq('id', campaignId)

  if (campaignDeleteError) {
    console.error('Failed to hard-delete campaign:', campaignDeleteError)
    return { error: 'Failed to delete campaign. Please try again.' }
  }

  revalidatePath('/campaigns')
  revalidatePath('/media-library')
  return {}
}
