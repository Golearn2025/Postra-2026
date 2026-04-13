'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react'

interface MediaAsset {
  id: string
  title: string
  original_filename: string
  mime_type: string
  file_size_bytes: number
  file_url: string
  signedUrl?: string
  thumbnailUrl?: string
  description: string
  tags: string[]
  campaign_id: string | null
  created_at: string
}

interface Step2Props {
  organizationId: string
  campaignId?: string
  campaignDuration?: number
  selectedMediaIds: string[]
  onSelect: (mediaIds: string[], mediaAssets: MediaAsset[]) => void
  onNext: () => void
  onPrevious: () => void
  mediaAssets?: MediaAsset[] // Add media assets as optional prop
}

/** Extract the trailing numeric suffix from a filename or title, e.g. "airport-transfer-01" → 1 */
function extractTrailingNumber(name: string): number {
  const match = name.match(/[-_](\d+)(?:\.[^.]*)?$/)
  return match ? parseInt(match[1], 10) : Infinity
}

function sortByDayOrder(assets: MediaAsset[]): MediaAsset[] {
  return [...assets].sort((a, b) => {
    const numA = extractTrailingNumber(a.original_filename || a.title || '')
    const numB = extractTrailingNumber(b.original_filename || b.title || '')
    return numA - numB
  })
}

export function Step2ChooseMedia({ 
  organizationId,
  campaignId,
  campaignDuration,
  selectedMediaIds, 
  onSelect, 
  onNext, 
  onPrevious,
  mediaAssets: mediaAssetsProp 
}: Step2Props) {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [autoSelected, setAutoSelected] = useState(false)

  useEffect(() => {
    // Use mediaAssets prop if provided, otherwise fallback to client-side fetch
    if (mediaAssetsProp) {
      const sortedAssets = sortByDayOrder(mediaAssetsProp)
      setMediaAssets(sortedAssets)
      setLoading(false)

      // Auto-select all assets on first load if not already selected
      if (!autoSelected && sortedAssets.length > 0 && selectedMediaIds.length === 0) {
        onSelect(sortedAssets.map(a => a.id), sortedAssets)
        setAutoSelected(true)
      }
    } else {
      async function loadMedia() {
        setLoading(true)
        try {
          const url = campaignId
            ? `/api/media?organizationId=${organizationId}&campaignId=${campaignId}`
            : `/api/media?organizationId=${organizationId}`
          const response = await fetch(url)
          const data = await response.json()
          const assets: MediaAsset[] = sortByDayOrder(data.assets || [])
          setMediaAssets(assets)

          // Auto-select all assets on first load if not already selected
          if (!autoSelected && assets.length > 0 && selectedMediaIds.length === 0) {
            onSelect(assets.map(a => a.id), assets)
            setAutoSelected(true)
          }
        } catch (error) {
          console.error('Failed to load media:', error)
        } finally {
          setLoading(false)
        }
      }
      loadMedia()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, campaignId, mediaAssetsProp, selectedMediaIds, onSelect, autoSelected])

  const toggleMedia = useCallback((asset: MediaAsset) => {
    const isSelected = selectedMediaIds.includes(asset.id)
    const newIds = isSelected
      ? selectedMediaIds.filter(id => id !== asset.id)
      : [...selectedMediaIds, asset.id]
    const newAssets = mediaAssets.filter(a => newIds.includes(a.id))
    onSelect(newIds, newAssets)
  }, [selectedMediaIds, mediaAssets, onSelect])

  // Derive readiness state
  const assetCount = mediaAssets.length
  const selectedCount = selectedMediaIds.length

  const readiness = campaignDuration
    ? assetCount === campaignDuration
      ? 'perfect'
      : assetCount < campaignDuration
        ? 'insufficient'
        : 'excess'
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Choose Campaign Assets</h2>
        <p className="text-muted-foreground">
          Review the assets linked to this campaign. For v1, the planner uses one asset per day in the selected order.
        </p>
      </div>

      {/* Readiness banner */}
      {!loading && campaignDuration && (
        <>
          {readiness === 'perfect' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-900">Ready to plan</p>
                <p className="text-green-700">
                  {assetCount} asset{assetCount !== 1 ? 's' : ''} matched to {campaignDuration} campaign day{campaignDuration !== 1 ? 's' : ''}. Each selected asset will map to one day.
                </p>
              </div>
            </div>
          )}
          {readiness === 'insufficient' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">Not enough assets</p>
                <p className="text-amber-700">
                  Campaign is {campaignDuration} days but only {assetCount} asset{assetCount !== 1 ? 's' : ''} found. Upload more assets linked to this campaign before continuing.
                </p>
              </div>
            </div>
          )}
          {readiness === 'excess' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">More assets than days</p>
                <p className="text-blue-700">
                  {assetCount} assets found for {campaignDuration} days. Only the first {campaignDuration} selected assets will be used — one per day. Deselect any you don't want to include.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !campaignDuration && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Day mapping</p>
            <p className="text-blue-700">
              Each selected asset will be used as the visual basis for a day in your campaign plan. You can review or adjust the order before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Selection summary */}
      {!loading && (
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-lg px-3 py-2">
            <span className="text-sm font-medium">{selectedCount} of {assetCount} selected</span>
          </div>
          {campaignDuration && (
            <span className={`text-sm font-medium ${readiness === 'perfect' ? 'text-green-600' : readiness === 'insufficient' ? 'text-amber-600' : 'text-blue-600'}`}>
              {readiness === 'perfect' ? `✓ ${campaignDuration} days covered` : readiness === 'insufficient' ? `⚠ Need ${campaignDuration - assetCount} more` : `${selectedCount} of ${campaignDuration} days`}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading campaign assets...</p>
        </div>
      ) : mediaAssets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">No assets linked to this campaign</p>
          <p className="text-sm text-muted-foreground">Upload and link media assets to this campaign first</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {mediaAssets.map((asset, index) => {
            const isSelected = selectedMediaIds.includes(asset.id)
            const dayNumber = isSelected
              ? selectedMediaIds.indexOf(asset.id) + 1
              : null

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => toggleMedia(asset)}
                className={`relative group rounded-lg border-2 overflow-hidden transition-all text-left ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Day badge */}
                <div className={`absolute top-2 left-2 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-black/40 text-white'
                }`}>
                  {isSelected ? `Day ${dayNumber}` : `#${index + 1}`}
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-0.5 shadow">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                  {asset.thumbnailUrl || asset.signedUrl || asset.file_url ? (
                    <img
                      src={asset.thumbnailUrl || asset.signedUrl || asset.file_url}
                      alt={asset.title || 'Media asset'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                      <span className="text-[9px] text-slate-400">No preview</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="p-2 bg-background">
                  <p className="text-[11px] font-medium truncate leading-tight">{asset.title || asset.original_filename}</p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight">{asset.original_filename}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={selectedMediaIds.length === 0}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
