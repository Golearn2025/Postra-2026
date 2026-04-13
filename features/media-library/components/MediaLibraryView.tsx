'use client'

import { useState } from 'react'
import { LayoutGrid, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaCard } from './MediaCard'
import { MediaLibraryTable } from '@/features/media-library/components/MediaLibraryTable'
import type { AppMediaAssetsListItem } from '@/types/views'
import type { DataTablePaginationState, DataTableSortState } from '@/components/data-table'

interface MediaLibraryViewProps {
  assets: (AppMediaAssetsListItem & { signedUrl?: string })[]
  organizationId: string
  pagination?: DataTablePaginationState
  sort?: DataTableSortState
}

type ViewMode = 'cards' | 'table'

export function MediaLibraryView({ assets, organizationId, pagination, sort }: MediaLibraryViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="h-9"
        >
          <Table className="h-4 w-4 mr-2" />
          Table
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cards')}
          className="h-9"
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Cards
        </Button>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => (
            <MediaCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <MediaLibraryTable 
          assets={assets}
          organizationId={organizationId}
          pagination={pagination}
          sort={sort}
        />
      )}
    </div>
  )
}
