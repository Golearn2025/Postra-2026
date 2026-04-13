'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MultiSelect } from '@/components/ui/multi-select'
import { MEDIA_SOURCES, MEDIA_STATUSES, FORMAT_GROUPS, PLATFORMS } from '../schemas/media-asset.schema'
import type { DbContentCampaign } from '@/types/database'

interface BatchMetadata {
  source?: string
  status?: string
  format_group?: string | null
  suggested_platforms?: string[]
  tags?: string
  campaign_id?: string | null
}

interface BatchMetadataPanelProps {
  campaigns: DbContentCampaign[]
  onApply: (metadata: BatchMetadata) => void
}

export function BatchMetadataPanel({ campaigns, onApply }: BatchMetadataPanelProps) {
  const [batchMeta, setBatchMeta] = useState<BatchMetadata>({
    source: 'uploaded',
    status: 'draft',
    format_group: null,
    suggested_platforms: [],
    tags: '',
    campaign_id: null,
  })

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onApply(batchMeta)
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Batch Metadata</h3>
        <Button type="button" onClick={handleApply} size="sm" variant="default">
          Apply to All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Source</Label>
          <Select value={batchMeta.source} onValueChange={(v) => setBatchMeta({...batchMeta, source: v})}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_SOURCES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={batchMeta.status} onValueChange={(v) => setBatchMeta({...batchMeta, status: v})}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Format Group</Label>
          <Select value={batchMeta.format_group || 'none'} onValueChange={(v) => setBatchMeta({...batchMeta, format_group: v === 'none' ? null : v})}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {FORMAT_GROUPS.map((g) => (
                <SelectItem key={g} value={g} className="capitalize">{g.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Campaign</Label>
          <Select value={batchMeta.campaign_id || 'none'} onValueChange={(v) => setBatchMeta({...batchMeta, campaign_id: v === 'none' ? null : v})}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No campaign</SelectItem>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Suggested Platforms</Label>
          <MultiSelect
            options={[...PLATFORMS]}
            selected={batchMeta.suggested_platforms || []}
            onChange={(platforms) => setBatchMeta({...batchMeta, suggested_platforms: platforms})}
            placeholder="Select platforms..."
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Common Tags</Label>
          <Input 
            className="h-9"
            value={batchMeta.tags} 
            onChange={(e) => setBatchMeta({...batchMeta, tags: e.target.value})}
            placeholder="e.g., luxury, premium"
          />
        </div>
      </div>
    </div>
  )
}
