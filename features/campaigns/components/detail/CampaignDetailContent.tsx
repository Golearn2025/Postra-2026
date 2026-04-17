import { Calendar, Target, Users, FileText, Hash, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignDetail } from '@/types/views'
import { 
  getPillarLabel, 
  getStatusLabel, 
  getStatusVariant,
  getGoalLabel,
  getAudienceLabel,
  getScheduleTypeLabel
} from '@/features/campaigns/utils/campaign-labels'

interface CampaignDetailContentProps {
  campaign: AppCampaignDetail
}

export function CampaignDetailContent({ campaign }: CampaignDetailContentProps) {
  const formatDuration = (days: number): string => {
    if (days === 1) return '1 day'
    if (days < 7) return `${days} days`
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    if (remainingDays === 0) return weeks === 1 ? '1 week' : `${weeks} weeks`
    return `${weeks}w ${remainingDays}d`
  }

  return (
    <div className="space-y-8">
      {/* Campaign Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Campaign Overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge variant={getStatusVariant(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Pillar</div>
            <div className="font-medium">{getPillarLabel(campaign.campaign_pillar)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Objective</div>
            <div className="font-medium">{getGoalLabel(campaign.objective)}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Target Audience</div>
            <div className="font-medium">{getAudienceLabel(campaign.target_audience)}</div>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <div className="text-sm text-muted-foreground">Target Market</div>
            <div className="font-medium">{campaign.target_market || 'Not set'}</div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule
        </h2>
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Schedule Type</div>
            <div className="font-medium">{getScheduleTypeLabel(campaign.schedule_type)}</div>
          </div>

          {campaign.schedule_type === 'date_range' && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-medium">
                  {campaign.start_date ? formatDate(campaign.start_date) : 'Not set'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="font-medium">
                  {campaign.end_date ? formatDate(campaign.end_date) : 'Not set'}
                </div>
              </div>

              {campaign.campaign_duration_days && (
                <div className="space-y-1 sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">{formatDuration(campaign.campaign_duration_days)}</div>
                </div>
              )}
            </div>
          )}

          {campaign.schedule_type === 'selected_dates' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Selected Dates</div>
                <div className="font-medium">
                  {campaign.selected_dates_count || 0} date{campaign.selected_dates_count === 1 ? '' : 's'}
                </div>
              </div>
              {campaign.selected_dates && campaign.selected_dates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {campaign.selected_dates.map((date: string) => (
                    <div
                      key={date}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md text-sm font-medium"
                    >
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notes
        </h2>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Description</div>
          <div className="text-sm whitespace-pre-wrap">
            {campaign.description || 'Not set'}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-6">Technical Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Slug</span>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {campaign.slug || 'Not set'}
            </code>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Campaign ID</span>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {campaign.id}
            </code>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {campaign.created_at ? formatDate(campaign.created_at) : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Updated</span>
            <span className="text-sm">
              {campaign.updated_at ? formatDate(campaign.updated_at) : 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
