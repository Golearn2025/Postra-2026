'use client'

import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import type { ImportSummary } from '../schemas/bulk-import.schema'

interface ImportPreviewProps {
  summary: ImportSummary
  onConfirm: () => void
  onCancel: () => void
  isProcessing?: boolean
}

export function ImportPreview({ 
  summary, 
  onConfirm, 
  onCancel, 
  isProcessing = false 
}: ImportPreviewProps) {
  console.log('ImportPreview component rendered with summary:', summary)
  console.log('Summary rows count:', summary.rows.length)
  console.log('Show details state:', false)
  
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  const hasValidRows = summary.valid_rows > 0
  const hasInvalidRows = summary.invalid_rows > 0

  const handleSelectRow = (rowNumber: number, checked: boolean) => {
    console.log('Row selected:', rowNumber, checked)
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(rowNumber)
    } else {
      newSelected.delete(rowNumber)
    }
    setSelectedRows(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  const handleSelectAll = (checked: boolean) => {
    console.log('Select all clicked:', checked)
    if (checked) {
      const allRowNumbers = new Set(summary.rows.map(row => row.row_number))
      setSelectedRows(allRowNumbers)
      setShowBulkActions(true)
    } else {
      setSelectedRows(new Set())
      setShowBulkActions(false)
    }
  }

  const toggleDetails = () => {
    const newShowDetails = !showDetails
    console.log('Toggling details from', showDetails, 'to', newShowDetails)
    setShowDetails(newShowDetails)
  }

  const handleDeleteSelected = () => {
    // This would need to be implemented in the parent component
    console.log('Delete selected rows:', Array.from(selectedRows))
    // For now, just clear selection
    setSelectedRows(new Set())
    setShowBulkActions(false)
  }

  const validRows = summary.rows.filter(row => row.is_valid)
  const selectedValidRows = validRows.filter(row => selectedRows.has(row.row_number))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{summary.total_rows}</div>
          <div className="text-sm text-muted-foreground">Total Rows</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{summary.valid_rows}</div>
          </div>
          <div className="text-sm text-muted-foreground">Valid</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <div className="text-2xl font-bold text-red-600">{summary.invalid_rows}</div>
          </div>
          <div className="text-sm text-muted-foreground">Invalid</div>
        </Card>
        
        <Card className="p-4">
          <div className={`text-2xl font-bold ${hasValidRows ? 'text-green-600' : 'text-red-600'}`}>
            {hasValidRows ? 'Ready' : 'Blocked'}
          </div>
          <div className="text-sm text-muted-foreground">Status</div>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
              <span className="text-sm text-muted-foreground">
                ({selectedValidRows.length} valid, {selectedRows.size - selectedValidRows.length} invalid)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedRows.size === 0}
              >
                Delete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(false)}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Validation Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Validation Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDetails}
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{summary.campaigns_found} campaigns found</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">{summary.campaigns_missing} campaigns missing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{summary.media_found} media files found</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">{summary.media_missing} media files missing</span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2">
            {/* Table Header with Select All */}
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
              <Checkbox
                checked={selectedRows.size === summary.rows.length && summary.rows.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex items-center gap-4 flex-1 text-sm font-medium text-gray-600">
                <span className="w-16">#</span>
                <span className="flex-1">Title</span>
                <span className="w-24">Status</span>
                <span className="w-32">Campaign</span>
                <span className="w-24">Media</span>
              </div>
            </div>
            
            {/* Table Rows */}
            <div className="max-h-64 overflow-y-auto space-y-1">
              {summary.rows.map((row) => (
                <div
                  key={row.row_number}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    row.is_valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  } ${selectedRows.has(row.row_number) ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <Checkbox
                    checked={selectedRows.has(row.row_number)}
                    onCheckedChange={(checked) => handleSelectRow(row.row_number, checked as boolean)}
                  />
                  
                  {/* Criteria Number */}
                  <span className="w-16 text-sm font-medium">#{row.row_number}</span>
                  
                  {/* Title */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {row.is_valid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">{row.data.title}</span>
                    </div>
                    {row.errors.length > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        {row.errors.slice(0, 2).map((error, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                          </div>
                        ))}
                        {row.errors.length > 2 && (
                          <div className="text-xs text-red-500">
                            +{row.errors.length - 2} more errors
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div className="w-24">
                    <Badge variant={row.is_valid ? 'default' : 'destructive'} className="text-xs">
                      {row.is_valid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  
                  {/* Campaign Status */}
                  <div className="w-32">
                    <Badge variant={row.campaign_found ? 'default' : 'destructive'} className="text-xs">
                      {row.campaign_found ? 'Found' : 'Missing'}
                    </Badge>
                  </div>
                  
                  {/* Media Status */}
                  <div className="w-24">
                    <Badge variant={row.media_found ? 'default' : 'destructive'} className="text-xs">
                      {row.media_found ? 'Found' : 'Missing'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onConfirm}
          disabled={!hasValidRows || isProcessing}
          className="flex-1"
        >
          {isProcessing 
            ? 'Importing...' 
            : selectedRows.size > 0 
              ? `Import ${selectedValidRows.length} Selected Valid Rows`
              : `Import ${hasValidRows ? summary.valid_rows : 0} Valid Rows`
          }
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>

      {!hasValidRows && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Cannot import</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            No valid rows found. Please fix the validation errors before proceeding.
          </p>
        </Card>
      )}
    </div>
  )
}
