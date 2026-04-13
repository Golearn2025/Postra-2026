'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'
import { MEDIA_SOURCES, MEDIA_STATUSES, FORMAT_GROUPS, PLATFORMS } from '../schemas/media-asset.schema'
import type { DbContentCampaign } from '@/types/database'
import type { AppMediaAssetsListItem } from '@/types/views'

interface BulkEditFormProps {
  assets: AppMediaAssetsListItem[]
  organizationId: string
  campaigns: DbContentCampaign[]
}

interface BulkMetadata {
  source?: string
  status?: string
  format_group?: string | null
  suggested_platforms?: string[]
  tags?: string
  campaign_id?: string | null
}

export function BulkEditForm({ assets, organizationId, campaigns }: BulkEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bulkMeta, setBulkMeta] = useState<BulkMetadata>({
    source: undefined,
    status: undefined,
    format_group: null,
    suggested_platforms: [],
    tags: '',
    campaign_id: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Only include fields that were actually changed by user
      const metadataToSend: BulkMetadata = {}
      
      if (bulkMeta.source !== undefined) metadataToSend.source = bulkMeta.source
      if (bulkMeta.status !== undefined) metadataToSend.status = bulkMeta.status
      if (bulkMeta.format_group !== undefined) metadataToSend.format_group = bulkMeta.format_group
      if (bulkMeta.suggested_platforms !== undefined) metadataToSend.suggested_platforms = bulkMeta.suggested_platforms
      if (bulkMeta.tags !== undefined) metadataToSend.tags = bulkMeta.tags
      if (bulkMeta.campaign_id !== undefined) metadataToSend.campaign_id = bulkMeta.campaign_id

      const response = await fetch('/api/media-assets/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetIds: assets.map(asset => asset.id),
          organizationId,
          metadata: metadataToSend,
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        // Force a hard refresh to ensure data is reloaded
        router.push('/media-library')
        router.refresh()
      } else {
        console.error('DEBUG: Bulk update failed with response:', responseData)
        alert(`Bulk update failed: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Bulk update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: keyof BulkMetadata, value: any) => {
    setBulkMeta(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Media Library
        </Button>
        <div className="text-sm text-muted-foreground">
          Editing {assets.length} selected asset{assets.length > 1 ? 's' : ''}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4">
          <h3 className="font-medium text-sm mb-4">Bulk Metadata Updates</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Leave fields empty to keep existing values. Only filled fields will be updated.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Source */}
            <div className="space-y-1.5">
              <Label className="text-xs">Source (optional)</Label>
              <Select 
                value={bulkMeta.source} 
                onValueChange={(value) => handleFieldChange('source', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_SOURCES.map(source => (
                    <SelectItem key={source} value={source}>
                      {source.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs">Status (optional)</Label>
              <Select 
                value={bulkMeta.status} 
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campaign */}
            <div className="space-y-1.5">
              <Label className="text-xs">Campaign (optional)</Label>
              <Select 
                value={bulkMeta.campaign_id || ''} 
                onValueChange={(value) => handleFieldChange('campaign_id', value || null)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Group */}
            <div className="space-y-1.5">
              <Label className="text-xs">Format Group (optional)</Label>
              <Select 
                value={bulkMeta.format_group || ''} 
                onValueChange={(value) => handleFieldChange('format_group', value || null)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Keep existing" />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_GROUPS.map(format => (
                    <SelectItem key={format} value={format}>
                      {format.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Tags (optional)</Label>
              <Input
                placeholder="Enter tags separated by commas"
                value={bulkMeta.tags}
                onChange={(e) => handleFieldChange('tags', e.target.value)}
                className="h-9"
              />
            </div>

            {/* Suggested Platforms */}
            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-xs">Suggested Platforms (optional)</Label>
              <MultiSelect
                options={[...PLATFORMS]}
                selected={bulkMeta.suggested_platforms || []}
                onChange={(values) => handleFieldChange('suggested_platforms', values)}
                placeholder="Select platforms..."
                className="min-h-[36px]"
              />
            </div>
          </div>
        </div>

        {/* Selected Assets Summary */}
        <div className="rounded-lg border p-4">
          <h3 className="font-medium text-sm mb-3">Selected Assets</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{asset.title || asset.original_filename || 'Untitled'}</span>
                <span className="text-muted-foreground">{asset.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update Selected Assets'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
