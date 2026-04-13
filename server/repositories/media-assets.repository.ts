import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbMediaAsset } from '@/types/database'
import type { MediaMetadataFormValues } from '@/features/media-library/schemas/media-asset.schema'
import type { AppMediaAssetsListItem, AppMediaAssetDetail } from '@/types/views'
import { parseTags } from '@/features/media-library/schemas/media-asset.schema'
import { getMediaAssetsWithUrls, getMediaAssetWithUrl, getMediaAssetsWithThumbnailUrls } from '@/server/services/media-assets.service'

export type MediaAssetFilters = {
  search?: string
  type?: string
  source?: string
  status?: string
  campaign_id?: string
}

export async function getMediaAssetsListByOrganization(
  supabase: SupabaseClient,
  organizationId: string,
  filters: MediaAssetFilters = {}
): Promise<(AppMediaAssetsListItem & { signedUrl?: string })[]> {
  let query = supabase
    .from('app_media_assets_list')
    .select('*')
    .eq('organization_id', organizationId)
    .order('updated_at', { ascending: false })

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,original_filename.ilike.%${filters.search}%`)
  }
  if (filters.type) query = query.eq('type', filters.type)
  if (filters.source) query = query.eq('source', filters.source)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.campaign_id) query = query.eq('campaign_id', filters.campaign_id)

  const { data, error } = await query
  if (error) {
    console.error('getMediaAssetsListByOrganization error:', error)
    return []
  }

  
  // Generate signed URLs with thumbnail prioritization for all assets
  return getMediaAssetsWithThumbnailUrls(supabase, data as AppMediaAssetsListItem[], 'small')
}

export async function getMediaAssetDetailById(
  supabase: SupabaseClient,
  mediaId: string,
  organizationId: string
): Promise<(AppMediaAssetDetail & { signedUrl?: string }) | null> {
  const { data, error } = await supabase
    .from('app_media_asset_detail')
    .select('*')
    .eq('id', mediaId)
    .eq('organization_id', organizationId)
    .single()

  if (error) return null
  
  // Generate signed URL for the asset
  return getMediaAssetWithUrl(supabase, data as AppMediaAssetDetail)
}

export async function createMediaAsset(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  values: MediaMetadataFormValues,
  fileFields: {
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
  } = {}
): Promise<DbMediaAsset | null> {
  const { data, error } = await supabase
    .from('media_assets')
    .insert({
      organization_id: organizationId,
      created_by: userId,
      updated_by: userId,
      tags: parseTags(values.tags),
      suggested_platforms: [],
      metadata: {},
      title: values.title ?? null,
      description: values.description ?? null,
      campaign_id: values.campaign_id ?? null,
      type: values.type,
      source: values.source,
      status: values.status,
      format_group: values.format_group ?? null,
      alt_text: values.alt_text ?? null,
      hook_text: values.hook_text ?? null,
      transcript: values.transcript ?? null,
      ...fileFields,
    })
    .select()
    .single()

  if (error) {
    console.error('createMediaAsset error:', error)
    return null
  }
  return data as DbMediaAsset
}

export async function updateMediaAsset(
  supabase: SupabaseClient,
  mediaId: string,
  organizationId: string,
  userId: string,
  values: Partial<MediaMetadataFormValues>
): Promise<DbMediaAsset | null> {
  const { data, error } = await supabase
    .from('media_assets')
    .update({
      title: values.title ?? null,
      description: values.description ?? null,
      campaign_id: values.campaign_id ?? null,
      type: values.type,
      source: values.source,
      status: values.status,
      format_group: values.format_group ?? null,
      alt_text: values.alt_text ?? null,
      hook_text: values.hook_text ?? null,
      transcript: values.transcript ?? null,
      tags: values.tags !== undefined ? parseTags(values.tags) : undefined,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mediaId)
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('updateMediaAsset error:', error)
    return null
  }
  return data as DbMediaAsset
}

export async function softDeleteMediaAsset(
  supabase: SupabaseClient,
  mediaId: string,
  organizationId: string,
  userId: string
): Promise<DbMediaAsset | null> {
  // Get asset data before deletion for storage cleanup
  const { data: assetData, error: fetchError } = await supabase
    .from('media_assets')
    .select('storage_path, thumb_storage_path, small_storage_path')
    .eq('id', mediaId)
    .eq('organization_id', organizationId)
    .single()

  if (fetchError) {
    console.error('Failed to fetch asset data for storage cleanup:', fetchError)
    return null
  }

  // Delete storage files
  const storagePaths = [
    assetData.storage_path,
    assetData.thumb_storage_path,
    assetData.small_storage_path
  ].filter(Boolean)

  if (storagePaths.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from('media-assets')
      .remove(storagePaths)

    if (deleteError) {
      console.error('Failed to delete storage files:', deleteError)
      // Continue with DB deletion even if storage deletion fails
    }
  }

  // Soft delete in database
  const { data, error } = await supabase
    .from('media_assets')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mediaId)
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('softDeleteMediaAsset error:', error)
    return null
  }
  return data as DbMediaAsset
}
