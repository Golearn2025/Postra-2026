#!/usr/bin/env tsx

/**
 * Storage verification script for vantage-lane-launch-campaign-5-days
 * Lists actual files in storage and compares with DB paths
 */

import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://wjvuowstthlwgnndcmvq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdnVvd3N0dGhsd2dubmRjbXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU2MTMzNiwiZXhwIjoyMDkxMTM3MzM2fQ.LOQK7WzZpGnYhTqWfW2kQ8QhLqX9wR8sYqRkW8wR7sY'
const supabase = createClient(supabaseUrl, serviceRoleKey)

interface DBAsset {
  id: string
  storage_path: string
  thumb_storage_path: string
  small_storage_path: string
  original_filename: string
}

async function listStorageFiles(path: string): Promise<string[]> {
  console.log(`\n=== Listing files in: ${path} ===`)
  
  try {
    const { data, error } = await supabase.storage
      .from('media-assets')
      .list(path, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      console.error(`Error listing ${path}:`, error)
      return []
    }
    
    const files = data.map(file => `${path}/${file.name}`)
    console.log(`Found ${files.length} files:`)
    files.forEach(file => console.log(`  - ${file}`))
    
    return files
  } catch (error) {
    console.error(`Failed to list ${path}:`, error)
    return []
  }
}

async function checkFileExists(path: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from('media-assets')
      .createSignedUrl(path, 3600)
    
    return !error && !!data?.signedUrl
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('STORAGE VERIFICATION FOR VANTAGE LANE ASSETS')
  console.log('===========================================')
  
  // DB Assets from query
  const dbAssets: DBAsset[] = [
    {
      id: 'f288bf9b-0e2c-4eb0-9775-163da927eb16',
      storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762475209-728230da-04c5-4099-8d0e-7846f1612f43.png',
      thumb_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762475209-728230da-04c5-4099-8d0e-7846f1612f43_thumb.png',
      small_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762475209-728230da-04c5-4099-8d0e-7846f1612f43_small.png',
      original_filename: 'airport-transfer-01.png'
    },
    {
      id: '06ac43de-90d2-4aff-bc05-49ab7ad3de10',
      storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762477313-8af04ba4-c2a3-43aa-a9bb-b57c06b4cfe1.png',
      thumb_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762477313-8af04ba4-c2a3-43aa-a9bb-b57c06b4cfe1_thumb.png',
      small_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762477313-8af04ba4-c2a3-43aa-a9bb-b57c06b4cfe1_small.png',
      original_filename: 'business-travel-04.png'
    },
    {
      id: 'dfa8d04a-4ef8-47fd-987e-d4ee13246135',
      storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762478651-6e081e71-7d05-467d-9e7c-d2563b77ea50.png',
      thumb_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762478651-6e081e71-7d05-467d-9e7c-d2563b77ea50_thumb.png',
      small_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762478651-6e081e71-7d05-467d-9e7c-d2563b77ea50_small.png',
      original_filename: 'event-transport-03.png'
    },
    {
      id: 'd775b0c7-03f5-4f22-b5ae-03d9718ac3e3',
      storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762479968-966d9042-f0b3-4790-948b-5af2a6f39c81.png',
      thumb_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762479968-966d9042-f0b3-4790-948b-5af2a6f39c81_thumb.png',
      small_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762479968-966d9042-f0b3-4790-948b-5af2a6f39c81_small.png',
      original_filename: 'hotel-arrival-02.png'
    },
    {
      id: '25262817-78b0-4423-8d65-257d43df27e5',
      storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762481260-76ba74ec-7b6d-4ce0-a4a0-4ea69647621f.png',
      thumb_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762481260-76ba74ec-7b6d-4ce0-a4a0-4ea69647621f_thumb.png',
      small_storage_path: '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/1775762481260-76ba74ec-7b6d-4ce0-a4a0-4ea69647621f_small.png',
      original_filename: 'luxury-experience-05.png'
    }
  ]
  
  // List actual files in storage
  const basePath = '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days'
  const thumbnailPath = '4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails'
  
  const mainFiles = await listStorageFiles(basePath)
  const thumbnailFiles = await listStorageFiles(thumbnailPath)
  
  console.log('\n=== COMPARISON: DB vs STORAGE ===')
  
  let missingOriginals = 0
  let missingThumbnails = 0
  
  for (const asset of dbAssets) {
    console.log(`\nAsset: ${asset.original_filename} (${asset.id})`)
    
    // Check original
    const originalExists = mainFiles.includes(asset.storage_path)
    console.log(`  Original (${asset.original_filename}): ${originalExists ? 'â\u009c EXISTS' : 'â\u009d MISSING'}`)
    if (!originalExists) missingOriginals++
    
    // Check thumb
    const thumbExists = thumbnailFiles.includes(asset.thumb_storage_path)
    console.log(`  Thumb: ${thumbExists ? 'â\u009c EXISTS' : 'â\u009d MISSING'}`)
    if (!thumbExists) missingThumbnails++
    
    // Check small
    const smallExists = thumbnailFiles.includes(asset.small_storage_path)
    console.log(`  Small: ${smallExists ? 'â\u009c EXISTS' : 'â\u009d MISSING'}`)
    if (!smallExists) missingThumbnails++
    
    // Test signed URL generation
    const smallUrlValid = await checkFileExists(asset.small_storage_path)
    const thumbUrlValid = await checkFileExists(asset.thumb_storage_path)
    const originalUrlValid = await checkFileExists(asset.storage_path)
    
    console.log(`  Signed URL - Small: ${smallUrlValid ? 'â\u009c VALID' : 'â\u009d INVALID'}`)
    console.log(`  Signed URL - Thumb: ${thumbUrlValid ? 'â\u009c VALID' : 'â\u009d INVALID'}`)
    console.log(`  Signed URL - Original: ${originalUrlValid ? 'â\u009c VALID' : 'â\u009d INVALID'}`)
  }
  
  console.log('\n=== SUMMARY ===')
  console.log(`Missing originals: ${missingOriginals}`)
  console.log(`Missing thumbnails: ${missingThumbnails}`)
  console.log(`Total DB assets: ${dbAssets.length}`)
  console.log(`Storage files found: ${mainFiles.length + thumbnailFiles.length}`)
  
  if (missingThumbnails > 0) {
    console.log('\nâ\u009a ACTION NEEDED: Regenerate missing thumbnails')
    console.log('Use the thumbnail generation script to create missing files.')
  } else {
    console.log('\nâ\u009c All thumbnails exist in storage')
  }
}

if (require.main === module) {
  main().catch(console.error)
}
