import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import sharp from 'sharp'

export interface ThumbnailOptions {
  width: number
  height: number
  quality?: number
}

export const THUMBNAIL_SIZES = {
  thumb: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 300, quality: 85 }
} as const

export type ThumbnailSize = keyof typeof THUMBNAIL_SIZES

/**
 * Generate thumbnail path for a given storage path
 * Example: media-assets/original.jpg -> media-assets/thumbnails/original_thumb.jpg
 */
export function getThumbnailPath(originalPath: string, size: ThumbnailSize): string {
  const parts = originalPath.split('/')
  const filename = parts[parts.length - 1]
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'))
  const extension = filename.substring(filename.lastIndexOf('.'))
  
  return `${parts.slice(0, -1).join('/')}/thumbnails/${nameWithoutExt}_${size}${extension}`
}

/**
 * Generate thumbnail from image buffer
 */
export async function generateThumbnail(
  imageBuffer: Buffer,
  options: ThumbnailOptions
): Promise<Buffer> {
  return await sharp(imageBuffer)
    .resize(options.width, options.height, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: options.quality || 80 })
    .toBuffer()
}

/**
 * Upload thumbnail to Supabase storage
 */
export async function uploadThumbnail(
  supabase: SupabaseClient,
  thumbnailPath: string,
  thumbnailBuffer: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<{ path: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('media-assets')
      .upload(thumbnailPath, thumbnailBuffer, {
        contentType: mimeType,
        upsert: true
      })

    if (error) {
      console.error('Failed to upload thumbnail:', error)
      return { path: thumbnailPath, error: error.message }
    }

    return { path: data.path }
  } catch (error) {
    console.error('Error uploading thumbnail:', error)
    return { path: thumbnailPath, error: 'Unknown error' }
  }
}

/**
 * Generate and upload all thumbnail sizes for an image
 */
export async function generateAndUploadThumbnails(
  supabase: SupabaseClient,
  originalPath: string,
  imageBuffer: Buffer
): Promise<Record<ThumbnailSize, { path?: string; error?: string }>> {
  const results: Record<ThumbnailSize, { path?: string; error?: string }> = {
    thumb: {},
    small: {}
  }

  for (const [size, options] of Object.entries(THUMBNAIL_SIZES)) {
    try {
      const thumbnailBuffer = await generateThumbnail(imageBuffer, options)
      const thumbnailPath = getThumbnailPath(originalPath, size as ThumbnailSize)
      const uploadResult = await uploadThumbnail(supabase, thumbnailPath, thumbnailBuffer)
      
      results[size as ThumbnailSize] = uploadResult
    } catch (error) {
      console.error(`Failed to generate ${size} thumbnail:`, error)
      results[size as ThumbnailSize] = { error: 'Generation failed' }
    }
  }

  return results
}

/**
 * Get signed URL for thumbnail (fallback to original if thumbnail doesn't exist)
 */
export async function getThumbnailSignedUrl(
  supabase: SupabaseClient,
  originalPath: string,
  size: ThumbnailSize,
  expiresIn: number = 3600
): Promise<string | null> {
  const thumbnailPath = getThumbnailPath(originalPath, size)
  
  try {
    // Try to get signed URL for thumbnail first
    const { data, error } = await supabase.storage
      .from('media-assets')
      .createSignedUrl(thumbnailPath, expiresIn)

    if (data?.signedUrl) {
      return data.signedUrl
    }

    // If thumbnail doesn't exist, fallback to original
    const { data: originalData, error: originalError } = await supabase.storage
      .from('media-assets')
      .createSignedUrl(originalPath, expiresIn)

    if (originalData?.signedUrl) {
      return originalData.signedUrl
    }

    return null
  } catch (error) {
    console.error('Error getting thumbnail signed URL:', error)
    return null
  }
}

/**
 * Check if thumbnail exists in storage
 */
export async function thumbnailExists(
  supabase: SupabaseClient,
  originalPath: string,
  size: ThumbnailSize
): Promise<boolean> {
  const thumbnailPath = getThumbnailPath(originalPath, size)
  
  try {
    const { data } = await supabase.storage
      .from('media-assets')
      .getPublicUrl(thumbnailPath)

    // If we can get a public URL, the file exists
    return !!data.publicUrl
  } catch (error) {
    return false
  }
}
