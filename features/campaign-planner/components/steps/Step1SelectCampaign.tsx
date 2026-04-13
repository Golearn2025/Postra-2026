'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/formatters/date'

interface Campaign {
  id: string
  name: string
  slug: string
  objective: string
  target_audience: string
  target_market: string
  start_date: string
  end_date: string
  status: string
}

interface Step1Props {
  organizationId: string
  selectedCampaignId?: string
  onSelect: (campaignId: string) => void
  onNext: () => void
  campaigns?: Campaign[] // Add campaigns as optional prop
}

export function Step1SelectCampaign({ organizationId, selectedCampaignId, onSelect, onNext, campaigns: campaignsData }: Step1Props) {
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use campaigns prop if provided, otherwise fallback to client-side fetch
    if (campaignsData && Array.isArray(campaignsData)) {
      setCampaignsList(campaignsData)
      setLoading(false)
    } else {
      async function loadCampaigns() {
        try {
          const response = await fetch(`/api/campaigns?organizationId=${organizationId}`)
          const data = await response.json()
          setCampaignsList(data.campaigns || [])
        } catch (error) {
          console.error('Failed to load campaigns:', error)
          setCampaignsList([]) // Ensure it's always an array
        } finally {
          setLoading(false)
        }
      }
      loadCampaigns()
    }
  }, [organizationId, campaignsData])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Campaign</h2>
        <p className="text-muted-foreground">
          Choose the campaign you want to create content for. The planner will use campaign details to generate relevant content suggestions.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">What is a campaign?</p>
            <p className="text-blue-700">
              A campaign is a coordinated series of posts designed to achieve a specific business objective.
              Example: "Summer Product Launch" or "Holiday Sale 2026"
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        </div>
      ) : campaignsList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No campaigns found</p>
          <p className="text-sm text-muted-foreground">Create a campaign first to use the planner</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {campaignsList.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => onSelect(campaign.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedCampaignId === campaign.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{campaign.objective}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>📅 {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
                    <span>🎯 {campaign.target_market}</span>
                    <span>👥 {campaign.target_audience}</span>
                  </div>
                </div>
                {selectedCampaignId === campaign.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedCampaignId}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
