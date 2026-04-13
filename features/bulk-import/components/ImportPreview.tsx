'use client'

import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const [showDetails, setShowDetails] = useState(false)

  const hasValidRows = summary.valid_rows > 0
  const hasInvalidRows = summary.invalid_rows > 0

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

      {/* Validation Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Validation Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
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
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {summary.rows.map((row) => (
              <div
                key={row.row_number}
                className={`p-3 rounded-lg border ${
                  row.is_valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {row.is_valid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Row {row.row_number}</span>
                    <span className="text-sm text-muted-foreground">{row.data.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={row.campaign_found ? 'default' : 'destructive'}>
                      Campaign: {row.campaign_found ? 'Found' : 'Missing'}
                    </Badge>
                    <Badge variant={row.media_found ? 'default' : 'destructive'}>
                      Media: {row.media_found ? 'Found' : 'Missing'}
                    </Badge>
                  </div>
                </div>
                
                {row.errors.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    {row.errors.map((error, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
          {isProcessing ? 'Importing...' : `Import ${hasValidRows ? summary.valid_rows : 0} Valid Rows`}
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
