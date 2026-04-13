'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DataTableToolbarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
}: DataTableToolbarProps) {
  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
      {onSearchChange && (
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-8"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {children && (
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {children}
        </div>
      )}
    </div>
  )
}
