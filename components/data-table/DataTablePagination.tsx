'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DataTablePaginationState } from './types'

interface DataTablePaginationProps {
  pagination: DataTablePaginationState
  onPaginationChange: (page: number, pageSize: number) => void
  pageSizeOptions?: number[]
}

export function DataTablePagination({
  pagination,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50, 100],
}: DataTablePaginationProps) {
  const { page, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)
  const startRow = (page - 1) * pageSize + 1
  const endRow = Math.min(page * pageSize, total)

  const handlePreviousPage = () => {
    if (page > 1) {
      onPaginationChange(page - 1, pageSize)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      onPaginationChange(page + 1, pageSize)
    }
  }

  const handlePageSizeChange = (newPageSize: string) => {
    onPaginationChange(1, parseInt(newPageSize))
  }

  if (total === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {startRow} to {endRow} of {total} results
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
