'use client'

import Link from 'next/link'
import { Calendar, MapPin, Target, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignsListItem } from '@/types/views'
import { 
  getPillarLabel, 
  getStatusLabel, 
  getStatusVariant 
} from '@/features/campaigns/utils/campaign-labels'

interface CampaignsListCardsProps {
  campaigns: AppCampaignsListItem[]
}

export function CampaignsListCards({ campaigns }: CampaignsListCardsProps) {
  const formatSchedule = (campaign: AppCampaignsListItem): string => {
    if (campaign.schedule_type === 'date_range' && campaign.start_date && campaign.end_date) {
      const start = formatDate(campaign.start_date)
      const end = formatDate(campaign.end_date)
      const duration = campaign.campaign_duration_days
      return duration ? `${start} → ${end} (${duration}d)` : `${start} → ${end}`
    }
    
    if (campaign.schedule_type === 'selected_dates') {
      const count = campaign.selected_dates_count || 0
      return count > 0 ? `${count} selected date${count === 1 ? '' : 's'}` : 'Not set'
    }
    
    return 'Not set'
  }

  if (campaigns.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No campaigns found
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.id}
          href={`/campaigns/${campaign.id}`}
          className="group relative flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {campaign.name || 'Untitled Campaign'}
              </h3>
              {campaign.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {campaign.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={getStatusVariant(campaign.status)}>
                {getStatusLabel(campaign.status)}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4 shrink-0" />
              <span className="truncate">{getPillarLabel(campaign.campaign_pillar)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{campaign.target_market || 'Not set'}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="truncate">{formatSchedule(campaign)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t text-xs text-muted-foreground">
            Updated {campaign.updated_at ? formatDate(campaign.updated_at) : 'never'}
          </div>
        </Link>
      ))}
    </div>
  )
}
