'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Eye, Edit2, Archive, Trash2, ImageIcon, Video, Edit } from 'lucide-react'
import { DataTable, DataTableColumn, DataTableAction, DataTablePagination, DataTableBulkActions } from '@/components/data-table'
import type { DataTablePaginationState, DataTableSortState } from '@/components/data-table'
import { MediaTypeBadge, MediaStatusBadge } from './MediaTypeBadge'
import { formatDate } from '@/lib/formatters/date'
import { formatFileSize } from '@/lib/formatters/file'
import type { AppMediaAssetsListItem } from '@/types/views'
import { softDeleteMediaAssetAction } from '@/server/actions/media-assets.actions'

interface MediaLibraryTableProps {
  assets: (AppMediaAssetsListItem & { signedUrl?: string })[]
  organizationId: string
  pagination?: DataTablePaginationState
  sort?: DataTableSortState
}

export function MediaLibraryTable({ assets, organizationId, pagination, sort }: MediaLibraryTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  const handleView = (asset: AppMediaAssetsListItem) => {
    router.push(`/media-library/${asset.id}` as any)
  }

  const handleEdit = (asset: AppMediaAssetsListItem) => {
    router.push(`/media-library/${asset.id}` as any)
  }

  const handleDelete = async (asset: AppMediaAssetsListItem) => {
    if (!confirm(`Are you sure you want to delete "${asset.title || asset.original_filename}"? This will remove it from your active library, but the data will be preserved for recovery.`)) return

    startTransition(async () => {
      const result = await softDeleteMediaAssetAction(asset.id, organizationId)
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

  const handleBulkDelete = async (selectedAssets: AppMediaAssetsListItem[]) => {
    const count = selectedAssets.length
    if (!confirm(`Are you sure you want to delete ${count} media asset${count > 1 ? 's' : ''}? This will remove them from your active library, but the data will be preserved for recovery.`)) return

    startTransition(async () => {
      for (const asset of selectedAssets) {
        await softDeleteMediaAssetAction(asset.id, organizationId)
      }
      setSelectedRows(new Set())
      router.refresh()
    })
  }

  const handleBulkEdit = (selectedAssets: AppMediaAssetsListItem[]) => {
    const assetIds = selectedAssets.map(asset => asset.id).join(',')
    router.push(`/media-library/bulk-edit?ids=${assetIds}` as any)
  }

  const selectedAssets = assets.filter(a => selectedRows.has(a.id))

  const columns: DataTableColumn<AppMediaAssetsListItem>[] = [
    {
      id: 'preview',
      header: 'Preview',
      cell: (asset) => {
        const assetWithUrl = asset as AppMediaAssetsListItem & { signedUrl?: string }
        return (
          <div className="w-12 h-12 rounded border border-border bg-muted/40 flex items-center justify-center overflow-hidden">
            {assetWithUrl.signedUrl ? (
              asset.type === 'video' ? (
                <video
                  src={assetWithUrl.signedUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={assetWithUrl.signedUrl}
                  alt={asset.alt_text || asset.title || asset.original_filename || 'Media'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )
            ) : (
              asset.type === 'video' ? (
                <Video className="w-5 h-5 text-muted-foreground/30" />
              ) : (
                <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
              )
            )}
          </div>
        )
      },
      width: '80px',
    },
    {
      id: 'title',
      header: 'Title',
      accessorKey: 'title',
      sortable: true,
      cell: (asset) => (
        <div className="font-medium max-w-[200px] truncate">
          {asset.title || asset.original_filename || 'Untitled'}
        </div>
      ),
    },
    {
      id: 'filename',
      header: 'Filename',
      accessorKey: 'original_filename',
      sortable: true,
      cell: (asset) => (
        <span className="text-muted-foreground text-sm max-w-[150px] truncate block">
          {asset.original_filename || 'N/A'}
        </span>
      ),
      width: '150px',
    },
    {
      id: 'campaign',
      header: 'Campaign',
      accessorKey: 'campaign_name',
      sortable: true,
      cell: (asset) => (
        <span className="text-muted-foreground text-sm">
          {asset.campaign_name || 'No campaign'}
        </span>
      ),
      width: '150px',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (asset) => <MediaStatusBadge status={asset.status} />,
      width: '110px',
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (asset) => <MediaTypeBadge type={asset.type} />,
      width: '110px',
    },
    {
      id: 'suggested_platforms',
      header: 'Suggested Platforms',
      cell: (asset) => (
        <span className="text-muted-foreground text-sm">
          {Array.isArray(asset.suggested_platforms) && asset.suggested_platforms.length > 0
            ? asset.suggested_platforms.join(', ')
            : 'None'}
        </span>
      ),
      width: '180px',
    },
    {
      id: 'format_group',
      header: 'Format',
      accessorKey: 'format_group',
      sortable: true,
      cell: (asset) => (
        <span className="text-muted-foreground text-sm">
          {asset.format_group || 'None'}
        </span>
      ),
      width: '120px',
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      sortable: true,
      cell: (asset) => (
        <span className="text-muted-foreground text-sm">
          {asset.created_at ? formatDate(asset.created_at) : 'N/A'}
        </span>
      ),
      width: '110px',
    },
    {
      id: 'updated_at',
      header: 'Updated',
      accessorKey: 'updated_at',
      sortable: true,
      cell: (asset) => (
        <span className="text-muted-foreground text-sm">
          {asset.updated_at ? formatDate(asset.updated_at) : 'N/A'}
        </span>
      ),
      width: '110px',
    },
  ]

  const actions: DataTableAction<AppMediaAssetsListItem>[] = [
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
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive',
    },
  ]

  const bulkActions: DataTableAction<AppMediaAssetsListItem[]>[] = [
    {
      label: 'Edit Selected',
      icon: Edit,
      onClick: handleBulkEdit,
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
        selectedData={selectedAssets}
      />
      
      <DataTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns={columns as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={assets as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        actions={actions as any}
        sort={sort}
        onSortChange={handleSortChange}
        emptyMessage="No media assets found"
        selectable={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getRowId={(asset: any) => String(asset.id)}
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
