#!/usr/bin/env tsx

/**
 * Script to generate missing thumbnail files for old assets
 * Uses original files to create thumb and small derivatives
 */

import { createClient } from '@supabase/supabase-js'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ImageMagick paths for thumbnail generation
const THUMB_SIZE = '150x150'
const SMALL_SIZE = '300x300'

interface Asset {
  id: string
  storage_path: string
  thumb_storage_path: string
  small_storage_path: string
  original_filename: string
}

async function downloadOriginalFile(asset: Asset): Promise<Buffer> {
  console.log(`Downloading original for ${asset.original_filename}...`)
  
  const { data, error } = await supabase.storage
    .from('media-assets')
    .download(asset.storage_path)
  
  if (error) {
    throw new Error(`Failed to download original: ${error.message}`)
  }
  
  // Convert Blob to Buffer
  const blob = data as Blob
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function generateThumbnail(buffer: Buffer, size: string): Promise<Buffer> {
  console.log(`Generating ${size} thumbnail...`)
  
  // Use ImageMagick convert command with pipe
  const { stdout } = await execAsync(`convert - -resize ${size} -quality 85 png:-`, {
    encoding: 'buffer',
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  })
  
  return stdout as Buffer
}

async function uploadThumbnail(asset: Asset, thumbnailBuffer: Buffer, thumbnailPath: string): Promise<void> {
  console.log(`Uploading thumbnail to ${thumbnailPath}...`)
  
  const { error } = await supabase.storage
    .from('media-assets')
    .upload(thumbnailPath, thumbnailBuffer, {
      contentType: 'image/png',
      upsert: true
    })
  
  if (error) {
    throw new Error(`Failed to upload thumbnail: ${error.message}`)
  }
}

async function processAsset(asset: Asset): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`\nProcessing asset: ${asset.original_filename} (${asset.id})`)
    
    // Download original file
    const originalBuffer = await downloadOriginalFile(asset)
    
    // Generate thumb thumbnail
    const thumbBuffer = await generateThumbnail(originalBuffer, THUMB_SIZE)
    await uploadThumbnail(asset, thumbBuffer, asset.thumb_storage_path)
    
    // Generate small thumbnail
    const smallBuffer = await generateThumbnail(originalBuffer, SMALL_SIZE)
    await uploadThumbnail(asset, smallBuffer, asset.small_storage_path)
    
    console.log(`Successfully generated thumbnails for ${asset.original_filename}`)
    return { success: true }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to process ${asset.original_filename}:`, errorMessage)
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
      const result = await processAsset(asset)
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

// Check if ImageMagick is available
async function checkImageMagick() {
  try {
    await execAsync('convert -version')
    console.log('ImageMagick is available\n')
  } catch (error) {
    console.error('ImageMagick is not available. Please install ImageMagick:')
    console.error('  macOS: brew install imagemagick')
    console.error('  Ubuntu: sudo apt-get install imagemagick')
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  checkImageMagick().then(main)
}
