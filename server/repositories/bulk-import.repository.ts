import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImportBatch, ImportRowValidation, ImportSummary } from '@/features/bulk-import/schemas/bulk-import.schema'
import type { PostraImportItem } from '@/features/bulk-import/schemas/bulk-import.schema'

export async function createImportBatch(
  supabase: SupabaseClient,
  organizationId: string,
  userId: string,
  filename: string,
  fileType: 'json' | 'csv',
  totalRows: number
): Promise<ImportBatch | null> {
  const { data, error } = await supabase
    .from('import_batches')
    .insert({
      organization_id: organizationId,
      filename,
      file_type: fileType,
      total_rows: totalRows,
      successful_rows: 0,
      failed_rows: 0,
      status: 'pending',
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('createImportBatch error:', error)
    return null
  }
  
  return data as ImportBatch
}

export async function updateImportBatch(
  supabase: SupabaseClient,
  batchId: string,
  updates: {
    successful_rows?: number
    failed_rows?: number
    status?: 'pending' | 'processing' | 'completed' | 'failed'
    errors?: string[]
  }
): Promise<ImportBatch | null> {
  const { data, error } = await supabase
    .from('import_batches')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', batchId)
    .select()
    .single()

  if (error) {
    console.error('updateImportBatch error:', error)
    return null
  }
  
  return data as ImportBatch
}

export async function validateImportRows(
  supabase: SupabaseClient,
  organizationId: string,
  items: PostraImportItem[]
): Promise<ImportSummary> {
  const validations: ImportRowValidation[] = []
  
  // Get all campaigns and media assets for validation
  const { data: campaigns } = await supabase
    .from('content_campaigns')
    .select('id, slug')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
  
  const { data: mediaAssets } = await supabase
    .from('media_assets')
    .select('id, original_filename')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
  
  const campaignMap = new Map(
    (campaigns || []).map(c => [c.slug, c.id])
  )
  
  const mediaMap = new Map(
    (mediaAssets || []).map(m => [m.original_filename, m.id])
  )
  
  let validRows = 0
  let invalidRows = 0
  let campaignsFound = 0
  let campaignsMissing = 0
  let mediaFound = 0
  let mediaMissing = 0
  
  items.forEach((item, index) => {
    const errors: string[] = []
    
    // Normalize input values
    const normalizedCampaignSlug = item.campaign_slug.trim()
    const normalizedMediaFilename = item.media_filename.trim()
    
    // Validate campaign exists
    const campaignId = campaignMap.get(normalizedCampaignSlug)
    if (campaignId) {
      campaignsFound++
    } else {
      campaignsMissing++
      errors.push(`Campaign "${normalizedCampaignSlug}" not found`)
    }
    
    // Validate media exists
    const mediaId = mediaMap.get(normalizedMediaFilename)
    if (mediaId) {
      mediaFound++
    } else {
      mediaMissing++
      errors.push(`Media file "${normalizedMediaFilename}" not found`)
    }
    
    // Check if row is valid
    const isValid = errors.length === 0
    if (isValid) {
      validRows++
    } else {
      invalidRows++
    }
    
    validations.push({
      row_number: index + 1,
      data: item,
      is_valid: isValid,
      errors,
      campaign_found: !!campaignId,
      media_found: !!mediaId,
      campaign_id: campaignId,
      media_id: mediaId,
    })
  })
  
  return {
    total_rows: items.length,
    valid_rows: validRows,
    invalid_rows: invalidRows,
    campaigns_found: campaignsFound,
    campaigns_missing: campaignsMissing,
    media_found: mediaFound,
    media_missing: mediaMissing,
    rows: validations,
  }
}

export async function executeImport(
  supabase: SupabaseClient,
  batchId: string,
  organizationId: string,
  userId: string,
  validations: ImportRowValidation[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  console.log('🏭 executeImport called with:', { batchId, organizationId, userId, validationCount: validations.length })
  
  let successCount = 0
  let failedCount = 0
  const errors: string[] = []
  
  for (const validation of validations) {
    if (!validation.is_valid || !validation.campaign_id || !validation.media_id) {
      failedCount++
      errors.push(`Row ${validation.row_number}: Invalid data`)
      continue
    }
    
    try {
      console.log(`📝 Creating post for row ${validation.row_number}: ${validation.data.title}`)
      
      // Create content post
      const { data: post, error: postError } = await supabase
        .from('content_posts')
        .insert({
          organization_id: organizationId,
          campaign_id: validation.campaign_id,
          title: validation.data.title,
          content_type: validation.data.content_type,
          post_status: validation.data.post_status,
          caption: validation.data.caption,
          hook: validation.data.hook,
          cta: validation.data.cta,
          visual_prompt: validation.data.visual_prompt,
          target_goal: validation.data.target_goal,
          hashtags: validation.data.hashtags,
          import_batch_id: batchId,
          created_by: userId,
          updated_by: userId,
        })
        .select()
        .single()
      
      if (postError) {
        console.log(`❌ Failed to create post for row ${validation.row_number}:`, postError)
        failedCount++
        errors.push(`Row ${validation.row_number}: Failed to create post - ${postError.message}`)
        continue
      }
      
      console.log(`✅ Post created for row ${validation.row_number}:`, post.id)
      
      // Create variants for each platform
      for (const platform of validation.data.platforms) {
        console.log(`🔄 Creating ${platform} variant for post ${post.id}`)
        const { error: variantError } = await supabase
          .from('content_post_variants')
          .insert({
            post_id: post.id,
            platform,
            media_id: validation.media_id,
            format_group: validation.data.format_group,
            created_by: userId,
          })
        
        if (variantError) {
          console.log(`❌ Failed to create ${platform} variant:`, variantError)
          errors.push(`Row ${validation.row_number}: Failed to create ${platform} variant - ${variantError.message}`)
        } else {
          console.log(`✅ ${platform} variant created`)
        }
      }
      
      // Create calendar slot if scheduled
      if (validation.data.post_status === 'scheduled' && validation.data.scheduled_date) {
        const scheduledAt = `${validation.data.scheduled_date}T${validation.data.scheduled_time || '10:00'}:00`
        console.log(`📅 Creating calendar slot for ${scheduledAt}`)
        
        await supabase
          .from('content_calendar_slots')
          .insert({
            organization_id: organizationId,
            campaign_id: validation.campaign_id,
            post_id: post.id,
            scheduled_at: scheduledAt,
            timezone: validation.data.timezone,
            status: 'scheduled',
            created_by: userId,
          })
      }
      
      successCount++
      console.log(`✅ Row ${validation.row_number} completed successfully`)
    } catch (error) {
      failedCount++
      errors.push(`Row ${validation.row_number}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  console.log(`🏁 executeImport completed:`, { success: successCount, failed: failedCount, errorCount: errors.length })
  return { success: successCount, failed: failedCount, errors }
}

export async function getImportBatches(
  supabase: SupabaseClient,
  organizationId: string
): Promise<ImportBatch[]> {
  const { data, error } = await supabase
    .from('import_batches')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getImportBatches error:', error)
    return []
  }
  
  return data as ImportBatch[]
}
