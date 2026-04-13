'use client'

import { CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/formatters/date'

interface ImportSummaryProps {
  batchId: string
  filename: string
  totalRows: number
  successfulRows: number
  failedRows: number
  errors?: string[]
  completedAt?: string
  onNewImport: () => void
}

export function ImportSummary({
  batchId,
  filename,
  totalRows,
  successfulRows,
  failedRows,
  errors = [],
  completedAt,
  onNewImport
}: ImportSummaryProps) {
  const isSuccess = failedRows === 0
  const hasErrors = failedRows > 0

  return (
    <div className="space-y-6">
      {/* Success/Failure Header */}
      <Card className={`p-6 ${isSuccess ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <AlertCircle className="h-8 w-8 text-orange-500" />
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {isSuccess ? 'Import Completed Successfully' : 'Import Completed with Issues'}
            </h2>
            <p className="text-muted-foreground">
              {filename} • {completedAt && formatDate(completedAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Results Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{totalRows}</div>
          <div className="text-sm text-muted-foreground">Total Rows</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{successfulRows}</div>
          </div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            {hasErrors ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <div className={`text-2xl font-bold ${hasErrors ? 'text-red-600' : 'text-green-600'}`}>
              {failedRows}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </Card>
      </div>

      {/* Errors Section */}
      {hasErrors && errors.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Errors ({errors.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm"
              >
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
        <div className="space-y-3">
          {successfulRows > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>View imported posts in Campaigns</span>
            </div>
          )}
          
          {hasErrors && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>Fix errors and re-upload affected rows</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span>Review scheduled posts in Calendar</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={onNewImport} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Import
          </Button>
          {successfulRows > 0 && (
            <Button variant="outline" asChild>
              <a href="/campaigns">View Campaigns</a>
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
