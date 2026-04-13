'use client'

import { useMemo } from 'react'
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DataTableProps, DataTableColumn } from './types'

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  actions,
  pagination,
  onPaginationChange,
  sort,
  onSortChange,
  loading,
  emptyMessage = 'No data available',
  error,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => row.id,
  bulkActions,
  showRowNumber = false,
}: DataTableProps<TData>) {
  const selectionState = useMemo(() => ({
    isAllSelected: data.length > 0 && data.every((row) => selectedRows.has(getRowId(row))),
    isSomeSelected: data.some((row) => selectedRows.has(getRowId(row))) && !data.every((row) => selectedRows.has(getRowId(row)))
  }), [data, selectedRows, getRowId])

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    
    if (selectionState.isAllSelected) {
      onSelectionChange(new Set())
    } else {
      const allIds = new Set(data.map((row) => getRowId(row)))
      onSelectionChange(allIds)
    }
  }

  const handleSelectRow = (row: TData) => {
    if (!onSelectionChange) return
    
    const rowId = getRowId(row)
    const newSelection = new Set(selectedRows)
    
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    
    onSelectionChange(newSelection)
  }

  const handleSort = (column: DataTableColumn<TData>) => {
    if (!column.sortable || !onSortChange) return

    const columnId = column.accessorKey?.toString() || column.id
    const currentDirection = sort?.column === columnId ? sort.direction : null
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
    
    onSortChange(columnId, newDirection)
  }

  const getSortIcon = (column: DataTableColumn<TData>) => {
    if (!column.sortable) return null
    
    const columnId = column.accessorKey?.toString() || column.id
    if (sort?.column !== columnId) return null

    return sort.direction === 'asc' ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    )
  }

  const getCellValue = (row: TData, column: DataTableColumn<TData>) => {
    if (column.cell) {
      return column.cell(row)
    }
    if (column.accessorKey) {
      return row[column.accessorKey]
    }
    return null
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const startIndex = pagination ? (pagination.page - 1) * pagination.pageSize : 0

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectionState.isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = selectionState.isSomeSelected
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
              </th>
            )}
            {showRowNumber && (
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">
                #
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`px-4 py-3 text-left font-medium text-muted-foreground ${
                  column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.header}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-4 py-3 text-right font-medium text-muted-foreground w-16">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowId = getRowId(row)
            const isSelected = selectedRows.has(rowId)
            
            return (
              <tr
                key={rowIndex}
                className={`border-b border-border last:border-0 transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-50 hover:bg-blue-100/70' 
                    : rowIndex % 2 === 0
                    ? 'bg-white hover:bg-gray-50/80'
                    : 'bg-gray-50/30 hover:bg-gray-100/60'
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(row)}
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                )}
                {showRowNumber && (
                  <td className="px-4 py-3 text-muted-foreground">
                    {startIndex + rowIndex + 1}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id} className="px-4 py-3 text-foreground">
                    {getCellValue(row, column)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled?.(row)}
                            className={
                              action.variant === 'destructive'
                                ? 'text-destructive focus:text-destructive'
                                : ''
                            }
                          >
                            {action.icon && (
                              <action.icon className="mr-2 h-4 w-4" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
