#!/usr/bin/env tsx

/**
 * Simple script to generate missing thumbnails using Supabase Edge Functions
 * Uses Supabase's built-in image transformation capabilities
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Asset {
  id: string
  storage_path: string
  thumb_storage_path: string
  small_storage_path: string
  original_filename: string
}

async function generateThumbnailForAsset(asset: Asset): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Processing: ${asset.original_filename}`)
    
    // Download original file
    const { data: originalData, error: downloadError } = await supabase.storage
      .from('media-assets')
      .download(asset.storage_path)
    
    if (downloadError) {
      throw new Error(`Failed to download original: ${downloadError.message}`)
    }
    
    // Convert Blob to ArrayBuffer
    const blob = originalData as Blob
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Generate thumb (150x150) using Supabase transform
    const thumbUrl = supabase.storage
      .from('media-assets')
      .getPublicUrl(asset.storage_path, {
        transform: {
          width: 150,
          height: 150,
          quality: 85
        }
      }).data.publicUrl
    
    // Download transformed thumb
    const thumbResponse = await fetch(thumbUrl)
    if (!thumbResponse.ok) {
      throw new Error(`Failed to fetch transformed thumb: ${thumbResponse.statusText}`)
    }
    const thumbBuffer = Buffer.from(await thumbResponse.arrayBuffer())
    
    // Upload thumb
    const { error: thumbUploadError } = await supabase.storage
      .from('media-assets')
      .upload(asset.thumb_storage_path, thumbBuffer, {
        contentType: 'image/png',
        upsert: true
      })
    
    if (thumbUploadError) {
      throw new Error(`Failed to upload thumb: ${thumbUploadError.message}`)
    }
    
    // Generate small (300x300) using Supabase transform
    const smallUrl = supabase.storage
      .from('media-assets')
      .getPublicUrl(asset.storage_path, {
        transform: {
          width: 300,
          height: 300,
          quality: 85
        }
      }).data.publicUrl
    
    // Download transformed small
    const smallResponse = await fetch(smallUrl)
    if (!smallResponse.ok) {
      throw new Error(`Failed to fetch transformed small: ${smallResponse.statusText}`)
    }
    const smallBuffer = Buffer.from(await smallResponse.arrayBuffer())
    
    // Upload small
    const { error: smallUploadError } = await supabase.storage
      .from('media-assets')
      .upload(asset.small_storage_path, smallBuffer, {
        contentType: 'image/png',
        upsert: true
      })
    
    if (smallUploadError) {
      throw new Error(`Failed to upload small: ${smallUploadError.message}`)
    }
    
    console.log(`â\u009c Success: ${asset.original_filename}`)
    return { success: true }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`â\u009d Failed: ${asset.original_filename} - ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

async function main() {
  console.log('Starting thumbnail generation for vantage-lane-launch-campaign-5-days assets...\n')
  
  try {
    // Get all assets from vantage-lane-launch-campaign-5-days
    const { data: assets, error } = await supabase
      .from('app_media_assets_list')
      .select('id, storage_path, thumb_storage_path, small_storage_path, original_filename')
      .like('storage_path', '%vantage-lane-launch-campaign-5-days%')
    
    if (error) {
      throw new Error(`Failed to fetch assets: ${error.message}`)
    }
    
    if (!assets || assets.length === 0) {
      console.log('No assets found in vantage-lane-launch-campaign-5-days')
      return
    }
    
    console.log(`Found ${assets.length} assets to process\n`)
    
    const results = []
    
    for (const asset of assets as Asset[]) {
      const result = await generateThumbnailForAsset(asset)
      results.push({
        id: asset.id,
        filename: asset.original_filename,
        ...result
      })
    }
    
    // Print summary
    console.log('\n=== THUMBNAIL GENERATION SUMMARY ===')
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    
    console.log(`\nSuccessful: ${successful.length}`)
    successful.forEach(r => {
      console.log(`  â\u009c ${r.filename}`)
    })
    
    if (failed.length > 0) {
      console.log(`\nFailed: ${failed.length}`)
      failed.forEach(r => {
        console.log(`  â\u009d ${r.filename} - ${r.error}`)
      })
    }
    
    console.log(`\nTotal processed: ${results.length}`)
    console.log(`Success rate: ${((successful.length / results.length) * 100).toFixed(1)}%`)
    
  } catch (error) {
    console.error('Script failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}
