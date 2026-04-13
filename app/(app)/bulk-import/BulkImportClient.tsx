'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FileUpload } from '@/features/bulk-import/components/FileUpload'
import { ImportPreview } from '@/features/bulk-import/components/ImportPreview'
import { ImportSummary } from '@/features/bulk-import/components/ImportSummary'
import { validateImportFileAction, executeImportAction } from '@/server/actions/bulk-import.actions'
import { readFileAsText } from '@/features/bulk-import/utils/client-file-utils'
import { validateFileType } from '@/features/bulk-import/utils/file-parsers'
import type { ImportSummary as ImportSummaryType } from '@/features/bulk-import/schemas/bulk-import.schema'

type ImportState = 'upload' | 'preview' | 'processing' | 'complete'

interface BulkImportClientProps {
  organizationId: string
}

export function BulkImportClient({ organizationId }: BulkImportClientProps) {
  const [importState, setImportState] = useState<ImportState>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationSummary, setValidationSummary] = useState<ImportSummaryType | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<{
    batchId: string
    filename: string
    totalRows: number
    successfulRows: number
    failedRows: number
    errors?: string[]
  } | null>(null)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setProcessingError(null)
    
    try {
      // Validate file type
      const fileType = validateFileType(file)
      if (!fileType) {
        setProcessingError('Invalid file type. Only JSON and CSV files are supported.')
        return
      }

      // Read file content client-side
      const fileContent = await readFileAsText(file)
      
      // Validate file content on server
      const result = await validateImportFileAction(organizationId, file.name, fileType, fileContent)
      
      if (result.success && result.data) {
        setValidationSummary(result.data)
        setImportState('preview')
      } else {
        setProcessingError(result.error || 'Failed to validate file')
      }
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : 'Failed to process file')
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setValidationSummary(null)
    setProcessingError(null)
    setImportState('upload')
  }

  const handleConfirmImport = async () => {
    if (!selectedFile || !validationSummary) return
    
    setImportState('processing')
    setProcessingError(null)

    // Execute the import
    const fileType = selectedFile.name.endsWith('.json') ? 'json' : 'csv'
    const filename = selectedFile.name
    const summary = validationSummary
    
    const result = await executeImportAction(
      organizationId,
      filename,
      fileType,
      summary
    )
    
    if (result.success && result.batchId) {
      setImportResult({
        batchId: result.batchId,
        filename: selectedFile.name,
        totalRows: validationSummary.total_rows,
        successfulRows: validationSummary.valid_rows,
        failedRows: validationSummary.invalid_rows,
        errors: validationSummary.rows
          .filter(row => !row.is_valid)
          .flatMap(row => row.errors)
      })
      setImportState('complete')
    } else {
      setProcessingError(result.error || 'Failed to execute import')
      setImportState('preview')
    }
  }

  const handleCancelImport = () => {
    setImportState('upload')
    setSelectedFile(null)
    setValidationSummary(null)
    setProcessingError(null)
  }

  const handleNewImport = () => {
    setImportState('upload')
    setSelectedFile(null)
    setValidationSummary(null)
    setImportResult(null)
    setProcessingError(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Import"
        description="Import posts in bulk via CSV or JSON. Map fields, preview, and schedule at scale."
      />
      
      {importState === 'upload' && (
        <FileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          selectedFile={selectedFile}
          error={processingError}
        />
      )}
      
      {importState === 'preview' && validationSummary && (
        <ImportPreview
          summary={validationSummary}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}
      
      {importState === 'complete' && importResult && (
        <ImportSummary
          batchId={importResult.batchId}
          filename={importResult.filename}
          totalRows={importResult.totalRows}
          successfulRows={importResult.successfulRows}
          failedRows={importResult.failedRows}
          errors={importResult.errors}
          onNewImport={handleNewImport}
        />
      )}
      
      {importState === 'processing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Processing import...</p>
          <p className="text-muted-foreground">This may take a few moments.</p>
        </div>
      )}
    </div>
  )
}
