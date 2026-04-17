'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, Edit2, Archive, Trash2, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignsListItem } from '@/types/views'
import { archiveCampaignAction, deleteCampaignAction, toggleCampaignStatusAction, restoreCampaignAction, bulkDeleteCampaignsAction } from '@/server/actions/campaigns'
import { PremiumTable } from '@/components/premium-table/PremiumTable'
import { 
  getPillarLabel, 
  getStatusLabel, 
  getStatusVariant,
  getStatusBadgeStyle 
} from '@/features/campaigns/utils/campaign-labels'

interface CampaignsListTableProps {
  campaigns: AppCampaignsListItem[]
  activeTab?: 'active' | 'archived'
}

export function CampaignsListTable({ campaigns, activeTab = 'active' }: CampaignsListTableProps) {
  console.log('CampaignsListTable rendered with campaigns:', campaigns.length)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Force read from URL to override incorrect activeTab prop
  const actualTab = (searchParams.get('tab') as 'active' | 'archived') || activeTab
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  const handleSelectRow = (campaignId: string, checked: boolean) => {
    console.log('Campaign selected:', campaignId, checked)
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(campaignId)
    } else {
      newSelected.delete(campaignId)
    }
    setSelectedRows(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  const handleSelectAll = (checked: boolean) => {
    console.log('Select all clicked:', checked)
    if (checked) {
      const allCampaignIds = new Set(campaigns.map(c => c.id))
      setSelectedRows(allCampaignIds)
      setShowBulkActions(true)
    } else {
      setSelectedRows(new Set())
      setShowBulkActions(false)
    }
  }

  const handleArchiveSelected = async () => {
    if (selectedRows.size === 0) return
    
    const confirmed = confirm(`Archive ${selectedRows.size} campaign${selectedRows.size === 1 ? '' : 's'}?`)
    if (!confirmed) return

    startTransition(async () => {
      for (const campaignId of selectedRows) {
        await archiveCampaignAction(campaignId)
      }
      setSelectedRows(new Set())
      setShowBulkActions(false)
      router.refresh()
    })
  }

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return
    
    const confirmed = confirm(`Delete ${selectedRows.size} campaign${selectedRows.size === 1 ? '' : 's'} permanently?`)
    if (!confirmed) return

    startTransition(async () => {
      for (const campaignId of selectedRows) {
        await deleteCampaignAction(campaignId)
      }
      setSelectedRows(new Set())
      setShowBulkActions(false)
      router.refresh()
    })
  }

  const handleToggleCampaignStatus = async (campaign: AppCampaignsListItem) => {
    let newStatus: 'active' | 'paused' | 'draft'
    
    if (campaign.status === 'draft') {
      newStatus = 'active'
    } else if (campaign.status === 'active') {
      newStatus = 'paused'
    } else if (campaign.status === 'paused' as string) {
      newStatus = 'active'
    } else {
      // For completed, archived, or expired, don't allow toggle
      return
    }
    
    const action = newStatus === 'active' ? 'activate' : 'pause'
    
    const confirmed = confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} campaign "${campaign.name}"?`)
    if (!confirmed) return

    startTransition(async () => {
      const result = await toggleCampaignStatusAction(campaign.id, newStatus)
      if (result.error) {
        alert(result.error)
        return
      }
      router.refresh()
    })
  }

  const formatSchedule = (campaign: AppCampaignsListItem): string => {
    if (campaign.schedule_type === 'date_range' && campaign.start_date && campaign.end_date) {
      const start = formatDate(campaign.start_date)
      const end = formatDate(campaign.end_date)
      const duration = campaign.campaign_duration_days
      return duration ? `${start} → ${end} · ${duration}d` : `${start} → ${end}`
    }
    
    if (campaign.schedule_type === 'selected_dates') {
      const count = campaign.selected_dates_count || 0
      return count > 0 ? `${count} date${count === 1 ? '' : 's'}` : 'Not set'
    }
    
    return 'Not set'
  }

  const formatDateTime = (dateString: string | null): React.ReactNode => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    const dateStr = formatDate(dateString)
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    
    return (
      <div className="space-y-0.5">
        <div className="text-sm font-medium">{dateStr}</div>
        <div className="text-xs text-muted-foreground">{timeStr}</div>
      </div>
    )
  }

  const handleView = (campaign: AppCampaignsListItem) => {
    router.push(`/campaigns/${campaign.id}`)
  }

  const handleEdit = (campaign: AppCampaignsListItem) => {
    router.push(`/campaigns/${campaign.id}`)
  }

  const handleArchive = async (campaign: AppCampaignsListItem) => {
    if (!confirm('Archive this campaign?')) return
    startTransition(async () => {
      await archiveCampaignAction(campaign.id)
      router.refresh()
    })
  }

  const handleDelete = async (campaign: AppCampaignsListItem) => {
    if (!confirm('Delete this campaign permanently?')) return
    startTransition(async () => {
      await deleteCampaignAction(campaign.id)
      router.refresh()
    })
  }

  const handleRestore = async (campaign: AppCampaignsListItem) => {
    if (!confirm('Restore this campaign?')) return
    startTransition(async () => {
      const result = await restoreCampaignAction(campaign.id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return
    
    const confirmMessage = `Delete ${selectedRows.size} campaign${selectedRows.size !== 1 ? 's' : ''} permanently? This action cannot be undone.`
    if (!confirm(confirmMessage)) return
    
    startTransition(async () => {
      const campaignIds = Array.from(selectedRows)
      const result = await bulkDeleteCampaignsAction(campaignIds)
      
      if (result.error) {
        alert(result.error)
      } else {
        alert(`Successfully deleted ${result.deletedCount} campaign${result.deletedCount !== 1 ? 's' : ''}.`)
        setSelectedRows(new Set())
        setShowBulkActions(false)
        router.refresh()
      }
    })
  }

  const columns = [
    {
      key: 'select' as keyof AppCampaignsListItem,
      header: () => (
        <Checkbox
          checked={selectedRows.size === campaigns.length && campaigns.length > 0}
          onCheckedChange={handleSelectAll}
        />
      ),
      width: '25px',
      headerClassName: 'px-2',
      className: 'px-2',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <Checkbox
          checked={selectedRows.has(campaign.id)}
          onCheckedChange={(checked) => handleSelectRow(campaign.id, checked as boolean)}
        />
      )
    },
    {
      key: 'index' as keyof AppCampaignsListItem,
      header: 'No.',
      width: '25px',
      headerClassName: 'px-2',
      className: 'px-2',
      render: (value: any, campaign: AppCampaignsListItem, index: number) => (
        <span className="text-sm font-medium">{index + 1}.</span>
      )
    },
    {
      key: 'name' as keyof AppCampaignsListItem,
      header: 'Campaign Name',
      width: '200px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <div className="font-medium text-sm">{campaign.name || 'Untitled'}</div>
      )
    },
    {
      key: 'status' as keyof AppCampaignsListItem,
      header: 'Status',
      width: '120px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <Badge 
          variant={getStatusVariant(campaign.status)}
          className={getStatusBadgeStyle(campaign.status)}
        >
          {getStatusLabel(campaign.status)}
        </Badge>
      )
    },
    {
      key: 'campaign_pillar' as keyof AppCampaignsListItem,
      header: 'Pillar',
      width: '150px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <span className="text-sm">{getPillarLabel(campaign.campaign_pillar)}</span>
      )
    },
    {
      key: 'target_market' as keyof AppCampaignsListItem,
      header: 'Target Market',
      width: '160px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <span className="text-sm text-muted-foreground">
          {campaign.target_market || 'Not set'}
        </span>
      )
    },
    {
      key: 'start_date' as keyof AppCampaignsListItem,
      header: 'Start Date',
      width: '120px',
      render: (value: any, campaign: AppCampaignsListItem) => {
        if (campaign.schedule_type === 'date_range' && campaign.start_date) {
          return (
            <div className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
              {formatDate(campaign.start_date)}
            </div>
          )
        }
        return <span className="text-sm text-muted-foreground">-</span>
      }
    },
    {
      key: 'end_date' as keyof AppCampaignsListItem,
      header: 'End Date',
      width: '120px',
      render: (value: any, campaign: AppCampaignsListItem) => {
        if (campaign.schedule_type === 'date_range' && campaign.end_date) {
          return (
            <div className="text-sm font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
              {formatDate(campaign.end_date)}
            </div>
          )
        }
        return <span className="text-sm text-muted-foreground">-</span>
      }
    },
    {
      key: 'days' as keyof AppCampaignsListItem,
      header: 'Days',
      width: '80px',
      render: (value: any, campaign: AppCampaignsListItem) => {
        if (campaign.schedule_type === 'date_range') {
          return (
            <span className="text-sm font-medium">
              {campaign.campaign_duration_days || '-'}d
            </span>
          )
        }
        
        if (campaign.schedule_type === 'selected_dates') {
          const count = campaign.selected_dates_count || 0
          return (
            <span className="text-sm font-medium">
              {count} day{count !== 1 ? 's' : ''}
            </span>
          )
        }
        
        return <span className="text-sm text-muted-foreground">-</span>
      }
    },
    {
      key: 'created_at' as keyof AppCampaignsListItem,
      header: 'Created',
      width: '140px',
      render: (value: any, campaign: AppCampaignsListItem) => formatDateTime(campaign.created_at)
    },
    {
      key: 'updated_at' as keyof AppCampaignsListItem,
      header: 'Updated',
      width: '140px',
      render: (value: any, campaign: AppCampaignsListItem) => formatDateTime(campaign.updated_at)
    },
    {
      key: 'toggle' as keyof AppCampaignsListItem,
      header: 'Active',
      width: '80px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={campaign.status === 'active'}
            onCheckedChange={() => handleToggleCampaignStatus(campaign)}
            disabled={isPending || ['completed', 'archived', 'expired'].includes(campaign.status)}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      )
    }
  ]

  const actions = actualTab === 'archived' ? [
    {
      label: 'View',
      icon: Eye,
      onClick: handleView,
      disabled: () => isPending
    },
    {
      label: 'Restore',
      icon: RotateCcw,
      onClick: handleRestore,
      disabled: () => isPending
    },
    {
      label: 'Delete Permanently',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive' as const,
      disabled: () => isPending
    }
  ] : [
    {
      label: 'View',
      icon: Eye,
      onClick: handleView,
      disabled: () => isPending
    },
    {
      label: 'Edit',
      icon: Edit2,
      onClick: handleEdit,
      disabled: () => isPending
    },
    {
      label: 'Archive',
      icon: Archive,
      onClick: handleArchive,
      disabled: () => isPending
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive' as const,
      disabled: () => isPending
    }
  ]

  // Debugging - remove after fixing
  console.log('DEBUG - activeTab prop:', activeTab, 'actualTab from URL:', actualTab)
  console.log('DEBUG - showBulkActions:', showBulkActions)
  console.log('DEBUG - selectedRows.size:', selectedRows.size)

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <Card className={`p-4 ${actualTab === 'archived' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedRows.size} campaign{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              {actualTab === 'archived' ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedRows.size === 0 || isPending}
                >
                  Delete Permanently
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchiveSelected}
                  disabled={selectedRows.size === 0 || isPending}
                >
                  Archive Selected
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(false)}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      <PremiumTable
        data={campaigns}
        columns={columns}
        actions={actions}
        showZebraStriping={true}
        hoverEffect={true}
        compact={false}
        emptyMessage="No campaigns found"
        className="shadow-lg border-slate-200 dark:border-slate-700"
      />
    </div>
  )
}
