'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DataTableAction } from './types'

interface DataTableBulkActionsProps<TData> {
  selectedCount: number
  onClearSelection: () => void
  bulkActions?: DataTableAction<TData[]>[]
  selectedData: TData[]
}

export function DataTableBulkActions<TData>({
  selectedCount,
  onClearSelection,
  bulkActions,
  selectedData,
}: DataTableBulkActionsProps<TData>) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      {bulkActions && bulkActions.length > 0 && (
        <div className="flex items-center gap-2">
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'destructive' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => action.onClick(selectedData)}
              className="h-7"
            >
              {action.icon && <action.icon className="h-3 w-3 mr-1.5" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
