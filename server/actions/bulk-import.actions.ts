'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { 
  createImportBatch, 
  updateImportBatch, 
  validateImportRows, 
  executeImport 
} from '@/server/repositories/bulk-import.repository'
import { parseJsonFile, parseCsvFile } from '@/features/bulk-import/utils/file-parsers'
import type { PostraImportItem } from '@/features/bulk-import/schemas/bulk-import.schema'
import type { ImportSummary } from '@/features/bulk-import/schemas/bulk-import.schema'

export async function validateImportFileAction(
  organizationId: string,
  filename: string,
  fileType: 'json' | 'csv',
  fileContent: string
): Promise<{ success: boolean; data?: ImportSummary; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Parse file based on type
    let items: PostraImportItem[]
    try {
      if (fileType === 'json') {
        items = parseJsonFile(fileContent)
      } else {
        items = parseCsvFile(fileContent)
      }
    } catch (parseError) {
      return { 
        success: false, 
        error: `Failed to parse file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` 
      }
    }

    if (items.length === 0) {
      return { success: false, error: 'No valid items found in file' }
    }

    // Validate items against database
    const supabase = await getSupabaseServerClient()
    const summary = await validateImportRows(supabase, organizationId, items)

    return { success: true, data: summary }
  } catch (error) {
    console.error('validateImportFileAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to validate file' 
    }
  }
}

export async function executeImportAction(
  organizationId: string,
  filename: string,
  fileType: 'json' | 'csv',
  summary: ImportSummary
): Promise<{ success: boolean; batchId?: string; error?: string }> {
  try {
    console.log('🎯 executeImportAction called with:', { organizationId, filename, fileType, totalRows: summary.total_rows })
    
    const user = await getCurrentUser()
    if (!user) {
      console.log('❌ Unauthorized - no user')
      return { success: false, error: 'Unauthorized' }
    }

    console.log('✅ User authenticated:', user.profile.id)
    const supabase = await getSupabaseServerClient()

    // Create import batch
    console.log('📦 Creating import batch...')
    const batch = await createImportBatch(
      supabase,
      organizationId,
      user.profile.id,
      filename,
      fileType,
      summary.total_rows
    )
    console.log('📦 Batch created:', batch)

    if (!batch) {
      return { success: false, error: 'Failed to create import batch' }
    }

    // Update batch status to processing
    await updateImportBatch(supabase, batch.id, { status: 'processing' })

    // Execute import for valid rows only
    const validRows = summary.rows.filter(row => row.is_valid)
    console.log('🔄 Executing import for valid rows:', validRows.length)
    const result = await executeImport(supabase, batch.id, organizationId, user.profile.id, validRows)
    console.log('📊 Import execution result:', result)

    // Update batch with results
    console.log('📝 Updating batch with results...')
    await updateImportBatch(supabase, batch.id, {
      successful_rows: result.success,
      failed_rows: result.failed,
      status: result.failed > 0 ? 'completed' : 'completed',
      errors: result.errors,
    })

    // Revalidate bulk import page
    revalidatePath('/bulk-import')

    console.log('✅ Import action completed successfully')
    return { success: true, batchId: batch.id }
  } catch (error) {
    console.error('executeImportAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to execute import' 
    }
  }
}

export async function getImportBatchesAction(
  organizationId: string
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await getSupabaseServerClient()
    const batches = await (await import('@/server/repositories/bulk-import.repository')).getImportBatches(supabase, organizationId)

    return { success: true, data: batches }
  } catch (error) {
    console.error('getImportBatchesAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get import batches' 
    }
  }
}
