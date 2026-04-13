'use client'

import { useState } from 'react'
import { LayoutGrid, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CampaignCard } from './CampaignCard'
import { CampaignsTable } from './CampaignsTable'
import type { AppCampaignsListItem } from '@/types/views'
import type { DataTablePaginationState, DataTableSortState } from '@/components/data-table'

interface CampaignsViewProps {
  campaigns: AppCampaignsListItem[]
  pagination?: DataTablePaginationState
  sort?: DataTableSortState
}

type ViewMode = 'cards' | 'table'

export function CampaignsView({ campaigns, pagination, sort }: CampaignsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <CampaignsTable 
          campaigns={campaigns}
          pagination={pagination}
          sort={sort}
        />
      )}
    </div>
  )
}
