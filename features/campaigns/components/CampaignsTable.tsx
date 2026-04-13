'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Eye, Edit2, Archive, Trash2 } from 'lucide-react'
import { DataTable, DataTableColumn, DataTableAction, DataTablePagination, DataTableBulkActions } from '@/components/data-table'
import type { DataTablePaginationState, DataTableSortState } from '@/components/data-table'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignsListItem } from '@/types/views'
import { archiveCampaignAction, deleteCampaignAction } from '@/server/actions/campaigns.actions'

interface CampaignsTableProps {
  campaigns: AppCampaignsListItem[]
  pagination?: DataTablePaginationState
  sort?: DataTableSortState
}

export function CampaignsTable({ campaigns, pagination, sort }: CampaignsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const handleView = (campaign: AppCampaignsListItem) => {
    router.push(`/campaigns/${campaign.id}` as any)
  }

  const handleEdit = (campaign: AppCampaignsListItem) => {
    router.push(`/campaigns/${campaign.id}` as any)
  }

  const handleArchive = async (campaign: AppCampaignsListItem) => {
    if (!confirm(`Are you sure you want to archive "${campaign.name}"?`)) return

    startTransition(async () => {
      const result = await archiveCampaignAction(campaign.id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleDelete = async (campaign: AppCampaignsListItem) => {
    if (campaign.status === 'active') {
      alert('Cannot delete an active campaign. Archive it first.')
      return
    }

    if (!confirm(`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`)) return

    startTransition(async () => {
      const result = await deleteCampaignAction(campaign.id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    params.set('pageSize', pageSize.toString())
    router.push(`${pathname}?${params.toString()}` as any)
  }

  const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', column)
    params.set('sortDir', direction)
    params.set('page', '1') // Reset to first page on sort
    router.push(`${pathname}?${params.toString()}` as any)
  }

  const handleBulkArchive = async (selectedCampaigns: AppCampaignsListItem[]) => {
    const count = selectedCampaigns.length
    if (!confirm(`Are you sure you want to archive ${count} campaign${count > 1 ? 's' : ''}?`)) return

    startTransition(async () => {
      for (const campaign of selectedCampaigns) {
        await archiveCampaignAction(campaign.id)
      }
      setSelectedRows(new Set())
      router.refresh()
    })
  }

  const handleBulkDelete = async (selectedCampaigns: AppCampaignsListItem[]) => {
    const activeCampaigns = selectedCampaigns.filter(c => c.status === 'active')
    if (activeCampaigns.length > 0) {
      alert(`Cannot delete ${activeCampaigns.length} active campaign${activeCampaigns.length > 1 ? 's' : ''}. Archive them first.`)
      return
    }

    const count = selectedCampaigns.length
    if (!confirm(`Are you sure you want to delete ${count} campaign${count > 1 ? 's' : ''}? This action cannot be undone.`)) return

    startTransition(async () => {
      for (const campaign of selectedCampaigns) {
        await deleteCampaignAction(campaign.id)
      }
      setSelectedRows(new Set())
      router.refresh()
    })
  }

  const selectedCampaigns = campaigns.filter(c => selectedRows.has(c.id))

  const columns: DataTableColumn<AppCampaignsListItem>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      cell: (campaign) => (
        <div className="font-medium">{campaign.name}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (campaign) => <CampaignStatusBadge status={campaign.status} />,
      width: '110px',
    },
    {
      id: 'pillar',
      header: 'Pillar',
      accessorKey: 'pillar',
      sortable: true,
      cell: (campaign) => (
        <span className="capitalize text-muted-foreground text-sm">
          {campaign.pillar?.replace('_', ' ') || '—'}
        </span>
      ),
      width: '130px',
    },
    {
      id: 'target_market',
      header: 'Target Market',
      accessorKey: 'target_market',
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.target_market || '—'}
        </span>
      ),
      width: '140px',
    },
    {
      id: 'start_date',
      header: 'Start Date',
      accessorKey: 'start_date',
      sortable: true,
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.start_date ? formatDate(campaign.start_date) : '—'}
        </span>
      ),
      width: '110px',
    },
    {
      id: 'end_date',
      header: 'End Date',
      accessorKey: 'end_date',
      sortable: true,
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.end_date ? formatDate(campaign.end_date) : '—'}
        </span>
      ),
      width: '110px',
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.campaign_duration_days 
            ? `${campaign.campaign_duration_days} days`
            : '—'}
        </span>
      ),
      width: '100px',
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      sortable: true,
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.created_at ? formatDate(campaign.created_at) : '—'}
        </span>
      ),
      width: '110px',
    },
    {
      id: 'updated_at',
      header: 'Updated',
      accessorKey: 'updated_at',
      sortable: true,
      cell: (campaign) => (
        <span className="text-muted-foreground text-sm">
          {campaign.updated_at ? formatDate(campaign.updated_at) : '—'}
        </span>
      ),
      width: '110px',
    },
  ]

  const actions: DataTableAction<AppCampaignsListItem>[] = [
    {
      label: 'View',
      icon: Eye,
      onClick: handleView,
    },
    {
      label: 'Edit',
      icon: Edit2,
      onClick: handleEdit,
    },
    {
      label: 'Archive',
      icon: Archive,
      onClick: handleArchive,
      disabled: (campaign) => campaign.status === 'archived',
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive',
      disabled: (campaign) => campaign.status === 'active',
    },
  ]

  const bulkActions: DataTableAction<AppCampaignsListItem[]>[] = [
    {
      label: 'Archive Selected',
      icon: Archive,
      onClick: handleBulkArchive,
    },
    {
      label: 'Delete Selected',
      icon: Trash2,
      onClick: handleBulkDelete,
      variant: 'destructive',
    },
  ]

  return (
    <div className="space-y-4">
      <DataTableBulkActions
        selectedCount={selectedRows.size}
        onClearSelection={() => setSelectedRows(new Set())}
        bulkActions={bulkActions}
        selectedData={selectedCampaigns}
      />
      
      <DataTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns={columns as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={campaigns as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        actions={actions as any}
        sort={sort}
        onSortChange={handleSortChange}
        emptyMessage="No campaigns found"
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getRowId={(campaign: any) => String(campaign.id)}
        showRowNumber={true}
      />
      
      {pagination && (
        <DataTablePagination
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  )
}
