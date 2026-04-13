#!/usr/bin/env tsx

/**
 * Backfill Script for Existing Media Thumbnails
 * 
 * This script generates thumbnails for all existing media assets
 * that don't have thumbnails yet.
 * 
 * Usage: npx tsx server/scripts/backfill-thumbnails.ts
 */

import { createClient } from '@supabase/supabase-js'
import { generateAndUploadThumbnails } from '../services/thumbnail.service'
import { readFileSync } from 'fs'

// Load environment variables from .env.local
function loadEnvVars() {
  try {
    const envContent = readFileSync('.env.local', 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, ...values] = line.split('=')
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim()
      }
    })
  } catch (error) {
    console.error('Warning: Could not load .env.local file:', error)
  }
}

loadEnvVars()

interface MediaAsset {
  id: string
  organization_id: string
  storage_path: string | null
  type: string
}

// Create Supabase client for script usage
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

async function getMediaAssetsWithoutThumbnails(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('media_assets')
    .select('id, organization_id, storage_path, type')
    .not('storage_path', 'is', null)  // Fix: We want assets WITH storage_path
    .eq('type', 'image')
    .is('thumb_storage_path', null)
    .is('small_storage_path', null)
    .limit(100) // Process in batches
  
  if (error) {
    console.error('Error fetching media assets:', error)
    return []
  }
  
  return data || []
}

async function processMediaAsset(asset: MediaAsset): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  try {
    if (!asset.storage_path) {
      console.log(`Skipping ${asset.id} - no storage path`)
      return true
    }
    
    console.log(`Processing asset ${asset.id}...`)
    
    // Download original image
    const { data: originalFile } = await supabase.storage
      .from('media-assets')
      .download(asset.storage_path)
    
    if (!originalFile) {
      console.log(`Failed to download original for ${asset.id}`)
      return false
    }
    
    // Generate thumbnails
    const arrayBuffer = await originalFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const thumbnailResults = await generateAndUploadThumbnails(
      supabase,
      asset.storage_path,
      buffer
    )
    
    // Update database with thumbnail paths using direct DB update
    const { error: updateError } = await supabase
      .from('media_assets')
      .update({
        thumb_storage_path: thumbnailResults.thumb.path,
        small_storage_path: thumbnailResults.small.path,
        updated_at: new Date().toISOString(),
        updated_by: 'system'
      })
      .eq('id', asset.id)
      .eq('organization_id', asset.organization_id)
    
    if (updateError) {
      console.log(`Failed to update asset ${asset.id}:`, updateError)
      return false
    }
    
    console.log(`Successfully processed asset ${asset.id}`)
    return true
    
  } catch (error) {
    console.error(`Error processing asset ${asset.id}:`, error)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('STARTING THUMBNAIL BACKFILL PROCESS')
  console.log('='.repeat(60))
  
  // First, count total assets to process
  const supabase = getSupabaseClient()
  const { count: totalCount } = await supabase
    .from('media_assets')
    .select('*', { count: 'exact', head: true })
    .not('storage_path', 'is', null)
    .eq('type', 'image')
    .is('thumb_storage_path', null)
    .is('small_storage_path', null)
  
  console.log(`Found ${totalCount || 0} image assets without thumbnails to process`)
  
  let processedCount = 0
  let successCount = 0
  let errorCount = 0
  let batchCount = 0
  
  while (true) {
    batchCount++
    console.log(`\n--- Batch ${batchCount} ---`)
    
    const assets = await getMediaAssetsWithoutThumbnails()
    
    if (assets.length === 0) {
      console.log('No more assets to process. Backfill complete!')
      break
    }
    
    console.log(`Processing batch ${batchCount} with ${assets.length} assets...`)
    
    for (const asset of assets) {
      processedCount++
      const success = await processMediaAsset(asset)
      
      if (success) {
        successCount++
      } else {
        errorCount++
      }
      
      // Progress indicator
      const progress = totalCount ? Math.round((processedCount / totalCount) * 100) : 0
      console.log(`[${progress}%] Asset ${processedCount}/${totalCount} - Success: ${successCount}, Errors: ${errorCount}`)
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`Batch ${batchCount} complete. Total: ${processedCount}, Success: ${successCount}, Errors: ${errorCount}`)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('BACKFILL COMPLETE!')
  console.log(`Total processed: ${processedCount}`)
  console.log(`Success: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Success rate: ${processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0}%`)
  console.log('='.repeat(60))
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}
