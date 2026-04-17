'use client'

import { Calendar, Target, Users, FileText, CalendarIcon, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/formatters/date'
import type { AppCampaignDetail } from '@/types/views'
import { 
  getPillarLabel, 
  getGoalLabel,
  getAudienceLabel,
  getScheduleTypeLabel
} from '@/features/campaigns/utils/campaign-labels'
import { CAMPAIGN_PILLAR_OPTIONS, CAMPAIGN_GOAL_OPTIONS, TARGET_AUDIENCE_OPTIONS } from '../../constants/campaign-options'

interface CampaignViewModeProps {
  campaign: AppCampaignDetail
}

export function CampaignViewMode({ campaign }: CampaignViewModeProps) {
  const pillarOption = CAMPAIGN_PILLAR_OPTIONS.find(opt => opt.value === campaign.campaign_pillar)
  const goalOption = CAMPAIGN_GOAL_OPTIONS.find(opt => opt.value === campaign.objective)
  const audienceOption = TARGET_AUDIENCE_OPTIONS.find(opt => opt.value === campaign.target_audience)

  const getDaysDuration = () => {
    if (campaign.schedule_type === 'date_range' && campaign.start_date && campaign.end_date) {
      const start = new Date(campaign.start_date)
      const end = new Date(campaign.end_date)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }
    return campaign.selected_dates_count || 0
  }

  const days = getDaysDuration()

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Left Column - What & Who */}
        <div className="space-y-6">
          {/* Campaign Pillar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              CAMPAIGN PILLAR
            </h3>
            {pillarOption && (
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#eef2ff] to-white dark:from-[#6366f1]/10 dark:to-transparent rounded-lg border-2 border-[#6366f1]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#6366f1] mb-1">{pillarOption.label}</div>
                  <div className="text-xs text-muted-foreground">{pillarOption.description}</div>
                </div>
              </div>
            )}
          </div>

          {/* Main Goal */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              MAIN GOAL
            </h3>
            {goalOption && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-sm">{goalOption.label}</div>
              </div>
            )}
          </div>

          {/* Target Audience */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              TARGET AUDIENCE
            </h3>
            {audienceOption && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-sm">{audienceOption.label}</div>
              </div>
            )}
          </div>

          {/* Target Market */}
          {campaign.target_market && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-sm font-bold text-muted-foreground mb-3">TARGET MARKET</h3>
              <div className="text-sm font-medium">{campaign.target_market}</div>
            </div>
          )}
        </div>

        {/* Middle Column - When */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              SCHEDULE
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Schedule Type</div>
                <div className="text-sm font-semibold">{getScheduleTypeLabel(campaign.schedule_type)}</div>
              </div>

              {campaign.schedule_type === 'date_range' && campaign.start_date && campaign.end_date && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-950/20 dark:to-red-950/20 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 dark:text-green-400">{formatDate(campaign.start_date)}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-red-700 dark:text-red-400">{formatDate(campaign.end_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-white">{days}</div>
                          <div className="text-xs text-white/80 font-medium">
                            {days === 1 ? 'Day' : 'Days'} Duration
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {campaign.schedule_type === 'selected_dates' && campaign.selected_dates && campaign.selected_dates.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-white">{campaign.selected_dates.length}</div>
                          <div className="text-xs text-white/80 font-medium">
                            {campaign.selected_dates.length === 1 ? 'Day' : 'Days'} Selected
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {campaign.selected_dates.map((date: string) => (
                        <div
                          key={date}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border-2 border-[#6366f1] rounded-lg shadow-sm text-xs font-medium"
                        >
                          <Calendar className="h-3 w-3 text-[#6366f1]" />
                          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Notes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              NOTES & DESCRIPTION
            </h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {campaign.description || 'No description provided'}
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-4">TECHNICAL DETAILS</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-muted-foreground">Slug</span>
                <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                  {campaign.slug || 'none'}
                </code>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-muted-foreground">Created</span>
                <span>{campaign.created_at ? formatDate(campaign.created_at) : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Updated</span>
                <span>{campaign.updated_at ? formatDate(campaign.updated_at) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
