'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Edit2, Archive, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignsListItem } from '@/types/views'
import { archiveCampaignAction, deleteCampaignAction } from '@/server/actions/campaigns'
import { PremiumTable } from '@/components/premium-table/PremiumTable'
import { 
  getPillarLabel, 
  getStatusLabel, 
  getStatusVariant 
} from '@/features/campaigns/utils/campaign-labels'

interface CampaignsListTableProps {
  campaigns: AppCampaignsListItem[]
}

export function CampaignsListTable({ campaigns }: CampaignsListTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
    router.push(`/campaigns/${campaign.id}/edit`)
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

  const columns = [
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
        <Badge variant={getStatusVariant(campaign.status)}>
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
      key: 'schedule_type' as keyof AppCampaignsListItem,
      header: 'Schedule',
      width: '280px',
      render: (value: any, campaign: AppCampaignsListItem) => (
        <div className="text-sm font-medium">{formatSchedule(campaign)}</div>
      )
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
    }
  ]

  const actions = [
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

  return (
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
  )
}
