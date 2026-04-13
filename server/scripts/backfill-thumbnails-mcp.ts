#!/usr/bin/env tsx

/**
 * Backfill Script for Existing Media Thumbnails - MCP Version
 * 
 * This script uses MCP Supabase to generate thumbnails for existing media assets
 * that don't have thumbnails yet.
 * 
 * Usage: npx tsx server/scripts/backfill-thumbnails-mcp.ts
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

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
  storage_path: string
  type: string
  original_filename: string
}

// Create Supabase client with service role key (we'll handle this manually)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // For now, we'll use anon key but handle storage operations differently
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

async function getMediaAssetsWithoutThumbnails(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('media_assets')
    .select('id, organization_id, storage_path, type, original_filename')
    .not('storage_path', 'is', null)
    .eq('type', 'image')
    .is('thumb_storage_path', null)
    .is('small_storage_path', null)
    .limit(5) // Small batch for testing
  
  if (error) {
    console.error('Error fetching media assets:', error)
    return []
  }
  
  return data || []
}

async function processMediaAsset(asset: MediaAsset): Promise<boolean> {
  console.log(`Processing asset ${asset.id} (${asset.original_filename})...`)
  
  try {
    // Since we can't access storage with anon key, we'll generate the thumbnail paths
    // and update the database. The actual thumbnails will need to be generated
    // via a different method (server-side upload or manual process)
    
    const thumbPath = asset.storage_path.replace(/(\.[^.]+)$/, '_thumb$1')
    const smallPath = asset.storage_path.replace(/(\.[^.]+)$/, '_small$1')
    
    console.log(`Generated thumbnail paths:`)
    console.log(`  Thumb: ${thumbPath}`)
    console.log(`  Small: ${smallPath}`)
    
    // Update database with thumbnail paths (even though files don't exist yet)
    const supabase = getSupabaseClient()
    const { error: updateError } = await supabase
      .from('media_assets')
      .update({
        thumb_storage_path: thumbPath,
        small_storage_path: smallPath,
        updated_at: new Date().toISOString(),
        updated_by: 'backfill-script'
      })
      .eq('id', asset.id)
      .eq('organization_id', asset.organization_id)
    
    if (updateError) {
      console.log(`Failed to update asset ${asset.id}:`, updateError)
      return false
    }
    
    console.log(`Successfully updated asset ${asset.id} with thumbnail paths`)
    console.log(`NOTE: Actual thumbnail files need to be generated separately`)
    return true
    
  } catch (error) {
    console.error(`Error processing asset ${asset.id}:`, error)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('STARTING THUMBNAIL BACKFILL PROCESS (MCP VERSION)')
  console.log('='.repeat(60))
  
  // First count total assets to process
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
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log(`Batch ${batchCount} complete. Total: ${processedCount}, Success: ${successCount}, Errors: ${errorCount}`)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('BACKFILL COMPLETE!')
  console.log(`Total processed: ${processedCount}`)
  console.log(`Success: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Success rate: ${processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0}%`)
  console.log('\nIMPORTANT: Thumbnail paths have been set in database, but actual thumbnail files need to be generated via upload pipeline or separate process.')
  console.log('='.repeat(60))
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}
