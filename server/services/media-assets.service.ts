import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppMediaAssetsListItem, AppMediaAssetDetail } from '@/types/views'
import { getThumbnailSignedUrl, ThumbnailSize } from './thumbnail.service'

// Simple in-memory cache for signed URLs (per request)
const signedUrlCache = new Map<string, { url: string; expiry: number }>()

/**
 * Clear expired entries from cache
 */
function clearExpiredCache() {
  const now = Date.now()
  for (const [key, value] of signedUrlCache.entries()) {
    if (value.expiry < now) {
      signedUrlCache.delete(key)
    }
  }
}

/**
 * Generate a signed URL for a media asset
 * @param supabase - Supabase client
 * @param storagePath - The storage path from the media asset
 * @param expiresIn - Seconds until URL expires (default: 1 hour)
 */
export async function generateSignedUrl(
  supabase: SupabaseClient,
  storagePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!storagePath) return null

  // Clear expired entries
  clearExpiredCache()
  
  // Check cache first
  const cacheKey = `${storagePath}:${expiresIn}`
  const cached = signedUrlCache.get(cacheKey)
  if (cached && cached.expiry > Date.now()) {
    return cached.url
  }

  // Generate new signed URL
  const { data, error } = await supabase.storage
    .from('media-assets')
    .createSignedUrl(storagePath, expiresIn)

  if (error) {
    console.error('Failed to generate signed URL:', error)
    return null
  }

  // Cache the result
  const signedUrl = data.signedUrl
  signedUrlCache.set(cacheKey, {
    url: signedUrl,
    expiry: Date.now() + (expiresIn * 1000 * 0.9) // Cache for 90% of expiry time
  })

  return signedUrl
}

/**
 * Get a media asset with a signed URL for display
 * @param supabase - Supabase client
 * @param asset - The media asset from view
 * @param expiresIn - Seconds until URL expires
 */
export async function getMediaAssetWithUrl<T extends AppMediaAssetsListItem | AppMediaAssetDetail>(
  supabase: SupabaseClient,
  asset: T,
  expiresIn: number = 3600
): Promise<T & { signedUrl?: string }> {
  const signedUrl = await generateSignedUrl(supabase, asset.storage_path || '', expiresIn)
  
  return {
    ...asset,
    signedUrl: signedUrl || undefined,
  }
}

/**
 * Get multiple media assets with signed URLs for display
 * @param supabase - Supabase client
 * @param assets - Array of media assets from view
 * @param expiresIn - Seconds until URLs expire
 */
export async function getMediaAssetsWithUrls<T extends AppMediaAssetsListItem | AppMediaAssetDetail>(
  supabase: SupabaseClient,
  assets: T[],
  expiresIn: number = 3600
): Promise<(T & { signedUrl?: string })[]> {
  const assetsWithUrls = await Promise.all(
    assets.map(async (asset) => {
      const signedUrl = asset.storage_path 
        ? await generateSignedUrl(supabase, asset.storage_path, expiresIn)
        : null
      return {
        ...asset,
        signedUrl: signedUrl || undefined,
      }
    })
  )
  
  return assetsWithUrls
}

/**
 * Get media asset with thumbnail URLs for preview
 * @param supabase - Supabase client
 * @param asset - Media asset from view
 * @param thumbnailSize - Size of thumbnail to generate
 * @param expiresIn - Seconds until URLs expire
 */
export async function getMediaAssetWithThumbnailUrls<T extends AppMediaAssetsListItem | AppMediaAssetDetail>(
  supabase: SupabaseClient,
  asset: T,
  thumbnailSize: ThumbnailSize,
  expiresIn: number = 3600
): Promise<T & { signedUrl?: string; thumbnailUrl?: string }> {
  // Get original signed URL
  const signedUrl = asset.storage_path 
    ? await generateSignedUrl(supabase, asset.storage_path, expiresIn)
    : null

  // Get thumbnail signed URL with fallback logic
  let thumbnailUrl: string | null = null
  if (asset.storage_path && asset.type === 'image') {
    // First try to get thumbnail from dedicated path (for new media)
    const thumbnailPath = thumbnailSize === 'thumb' 
      ? (asset as any).thumb_storage_path 
      : (asset as any).small_storage_path
    
    if (thumbnailPath) {
      try {
        thumbnailUrl = await generateSignedUrl(supabase, thumbnailPath, expiresIn)
        if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
          thumbnailUrl = null
        }
      } catch (error) {
        thumbnailUrl = null
      }
    }
    
    // Fallback to dynamic thumbnail generation for old media
    if (!thumbnailUrl) {
      try {
        thumbnailUrl = await getThumbnailSignedUrl(supabase, asset.storage_path, thumbnailSize, expiresIn)
        if (!thumbnailUrl || !thumbnailUrl.startsWith('http')) {
          thumbnailUrl = null
        }
      } catch (error) {
        thumbnailUrl = null
      }
    }
  }

  return {
    ...asset,
    signedUrl: signedUrl || undefined,
    thumbnailUrl: thumbnailUrl || undefined,
  }
}

/**
 * Get multiple media assets with thumbnail URLs for preview
 * @param supabase - Supabase client
 * @param assets - Array of media assets from view
 * @param thumbnailSize - Size of thumbnail to generate
 * @param expiresIn - Seconds until URLs expire
 */
export async function getMediaAssetsWithThumbnailUrls<T extends AppMediaAssetsListItem | AppMediaAssetDetail>(
  supabase: SupabaseClient,
  assets: T[],
  thumbnailSize: ThumbnailSize,
  expiresIn: number = 3600
): Promise<(T & { signedUrl?: string; thumbnailUrl?: string })[]> {
  const assetsWithUrls = await Promise.all(
    assets.map(async (asset) => {
      return await getMediaAssetWithThumbnailUrls(supabase, asset, thumbnailSize, expiresIn)
    })
  )
  
  return assetsWithUrls
}
