import Link from 'next/link'
import { CalendarDays, Globe, MapPin, ArrowRight } from 'lucide-react'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignsListItem } from '@/types/views'

interface CampaignCardProps {
  campaign: AppCampaignsListItem
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link
      href={`/campaigns/${campaign.id}` as any}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="truncate font-semibold text-foreground group-hover:text-accent transition-colors">
            {campaign.name}
          </p>
          {campaign.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {campaign.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CampaignStatusBadge status={campaign.status} />
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {campaign.pillar && (
          <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-medium capitalize">
            {campaign.pillar.replace('_', ' ')}
          </span>
        )}
        {campaign.target_market && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {campaign.target_market}
          </span>
        )}
        {campaign.timezone && (
          <span className="inline-flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {campaign.timezone}
          </span>
        )}
        {(campaign.start_date || campaign.end_date) && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {campaign.start_date ? formatDate(campaign.start_date) : '—'}
            {' → '}
            {campaign.end_date ? formatDate(campaign.end_date) : '—'}
          </span>
        )}
      </div>

      <span className="text-xs text-muted-foreground">
        {formatDate(campaign.updated_at || '')}
      </span>
    </Link>
  )
}
