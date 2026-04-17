'use client'

import { useState } from 'react'
import { LayoutGrid, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PremiumPagination } from '@/components/premium-table/PremiumPagination'
import { CampaignsListTable } from './CampaignsListTable'
import { CampaignsListCards } from './CampaignsListCards'
import type { AppCampaignsListItem } from '@/types/views'

interface CampaignsListContainerProps {
  campaigns: AppCampaignsListItem[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange?: (itemsPerPage: number) => void
  }
}

export function CampaignsListContainer({ campaigns, pagination }: CampaignsListContainerProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {pagination ? (
            <span>
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} campaigns
            </span>
          ) : (
            <span>{campaigns.length} campaign{campaigns.length === 1 ? '' : 's'}</span>
          )}
        </div>
        <div className="flex gap-1 rounded-md border bg-card shadow-sm p-1">
          <Button
            size="sm"
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('table')}
            className="h-8"
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('cards')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {viewMode === 'table' ? (
          <div className="space-y-4">
            <CampaignsListTable campaigns={campaigns} />
            {/* Premium Pagination - Always Visible - Below Table */}
            <PremiumPagination
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 1}
              totalItems={pagination?.totalItems || campaigns.length}
              itemsPerPage={pagination?.itemsPerPage || 25}
              onPageChange={pagination?.onPageChange || (() => {})}
              onItemsPerPageChange={pagination?.onItemsPerPageChange}
              showItemsPerPage={true}
              showTotalItems={true}
              className="bg-card border rounded-lg p-4 shadow-sm"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <CampaignsListCards campaigns={campaigns} />
            {/* Premium Pagination - Always Visible - Below Cards */}
            <PremiumPagination
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 1}
              totalItems={pagination?.totalItems || campaigns.length}
              itemsPerPage={pagination?.itemsPerPage || 25}
              onPageChange={pagination?.onPageChange || (() => {})}
              onItemsPerPageChange={pagination?.onItemsPerPageChange}
              showItemsPerPage={true}
              showTotalItems={true}
              className="bg-card border rounded-lg p-4 shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
