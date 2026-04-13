#!/usr/bin/env tsx

/**
 * Manual thumbnail generation script using direct HTTP requests
 * This approach bypasses API key issues by using public URLs
 */

interface Asset {
  id: string
  storage_path: string
  thumb_storage_path: string
  small_storage_path: string
  original_filename: string
}

// Supabase configuration
const SUPABASE_URL = 'https://wjvuowstthlwgnndcmvq.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdnVvd3N0dGhsd2dubmRjbXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU2MTMzNiwiZXhwIjoyMDkxMTM3MzM2fQ.LOQK7WzZpGnYhTqWfW2kQ8QhLqX9wR8sYqRkW8wR7sY'

async function downloadOriginalFile(storagePath: string): Promise<Buffer> {
  // Get public URL for original file
  const { data: { publicUrl } } = await fetch(`${SUPABASE_URL}/rest/v1/storage/v1/object/media-assets/${storagePath}`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY
    }
  }).then(r => r.json())
  
  // Download the file
  const response = await fetch(publicUrl)
  if (!response.ok) {
    throw new Error(`Failed to download original: ${response.statusText}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function uploadThumbnail(thumbnailPath: string, buffer: Buffer): Promise<void> {
  const formData = new FormData()
  const uint8Array = new Uint8Array(buffer)
  const blob = new Blob([uint8Array])
  formData.append('file', blob)
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/storage/v1/object/media-assets/${thumbnailPath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY
    },
    body: formData
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to upload thumbnail: ${error}`)
  }
}

async function generateThumbnailUsingTransform(originalPath: string, size: number): Promise<Buffer> {
  // Use Supabase's image transformation
  const transformUrl = `${SUPABASE_URL}/rest/v1/storage/v1/render/image/public/media-assets/${originalPath}?width=${size}&height=${size}&quality=85&format=png`
  
  const response = await fetch(transformUrl)
  if (!response.ok) {
    throw new Error(`Failed to generate thumbnail: ${response.statusText}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function processAsset(asset: Asset): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Processing: ${asset.original_filename}`)
    
    // Generate thumb (150x150)
    const thumbBuffer = await generateThumbnailUsingTransform(asset.storage_path, 150)
    await uploadThumbnail(asset.thumb_storage_path, thumbBuffer)
    
    // Generate small (300x300)
    const smallBuffer = await generateThumbnailUsingTransform(asset.storage_path, 300)
    await uploadThumbnail(asset.small_storage_path, smallBuffer)
    
    console.log(`â\u009c Success: ${asset.original_filename}`)
    return { success: true }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`â\u009d Failed: ${asset.original_filename} - ${errorMessage}`)
    return { success: false, error: errorMessage }
  }
}

async function getAssets(): Promise<Asset[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/app_media_assets_list?storage_path=ilike.*vantage-lane-launch-campaign-5-days*`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`)
  }
  
  return response.json()
}

async function main() {
  console.log('Starting thumbnail generation for vantage-lane-launch-campaign-5-days assets...\n')
  
  try {
    const assets = await getAssets()
    
    if (!assets || assets.length === 0) {
      console.log('No assets found in vantage-lane-launch-campaign-5-days')
      return
    }
    
    console.log(`Found ${assets.length} assets to process\n`)
    
    const results = []
    
    for (const asset of assets) {
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

// Run the script
if (require.main === module) {
  main()
}
