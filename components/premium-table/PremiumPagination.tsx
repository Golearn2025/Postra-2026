'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PremiumPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  showTotalItems?: boolean
  className?: string
  compact?: boolean
}

export function PremiumPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  showItemsPerPage = true,
  showTotalItems = true,
  className,
  compact = false
}: PremiumPaginationProps) {
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false)

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    const items = parseInt(newItemsPerPage)
    if (onItemsPerPageChange && items !== itemsPerPage) {
      onItemsPerPageChange(items)
    }
    setItemsPerPageOpen(false)
  }

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4",
      compact && "gap-2",
      className
    )}>
      {/* Items per page selector */}
      {showItemsPerPage && totalPages > 1 && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm text-muted-foreground",
            compact && "text-xs"
          )}>
            Items per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
            open={itemsPerPageOpen}
            onOpenChange={setItemsPerPageOpen}
          >
            <SelectTrigger className={cn(
              "w-20 h-8",
              compact && "w-16 h-7 text-xs"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 px-3",
            compact && "h-7 px-2"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {!compact && <span className="ml-1">Previous</span>}
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span
                key={`dots-${index}`}
                className={cn(
                  "px-2 text-muted-foreground",
                  compact && "px-1 text-xs"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size={compact ? "sm" : "default"}
                onClick={() => handlePageChange(page as number)}
                className={cn(
                  "h-8 w-8 p-0",
                  compact && "h-7 w-7"
                )}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 px-3",
            compact && "h-7 px-2"
          )}
        >
          {!compact && <span className="mr-1">Next</span>}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Total items */}
      {showTotalItems && (
        <div className={cn(
          "text-sm text-muted-foreground",
          compact && "text-xs"
        )}>
          {totalItems > 0 ? (
            <span>
              Showing {startItem} to {endItem} of {totalItems} items
            </span>
          ) : (
            <span>No items</span>
          )}
        </div>
      )}
    </div>
  )
}

// Compact pagination for tight spaces
export function CompactPagination(props: Omit<PremiumPaginationProps, 'compact'>) {
  return (
    <PremiumPagination
      {...props}
      compact={true}
      showItemsPerPage={false}
      showTotalItems={false}
    />
  )
}

// Minimal pagination for cards/small spaces
export function MinimalPagination(props: Omit<PremiumPaginationProps, 'compact'>) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {props.currentPage} of {props.totalPages}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.onPageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.onPageChange(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
