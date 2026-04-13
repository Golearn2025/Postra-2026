'use client'

import { useState } from 'react'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { FORMAT_GROUPS, PLATFORMS } from '../schemas/media-asset.schema'
import type { DbContentCampaign } from '@/types/database'

export interface FileMetadata {
  file: File
  title: string
  alt_text: string
  description: string
  tags: string
  format_group: string | null
  suggested_platforms: string[]
  campaign_id: string | null
}

interface FileReviewTableProps {
  filesMetadata: FileMetadata[]
  campaigns: DbContentCampaign[]
  onUpdate: (index: number, metadata: Partial<FileMetadata>) => void
  onRemove: (index: number) => void
}

// Derived planner-readiness check
function isPlannerReady(metadata: FileMetadata, status: string): boolean {
  return !!(
    metadata.title &&
    metadata.alt_text &&
    metadata.description &&
    metadata.tags &&
    status === 'ready'
  )
}

export function FileReviewTable({ filesMetadata, campaigns, onUpdate, onRemove }: FileReviewTableProps) {
  const [status] = useState('draft') // Track status from parent form

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Review & Edit Files</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {filesMetadata.length} file{filesMetadata.length !== 1 ? 's' : ''}
          </span>
          {filesMetadata.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear all files
                filesMetadata.forEach((_, i) => onRemove(i))
              }}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1400px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium min-w-[80px]">Preview</th>
                <th className="px-4 py-3 text-left font-medium min-w-[150px]">Filename</th>
                <th className="px-4 py-3 text-left font-medium min-w-[220px]">Title</th>
                <th className="px-4 py-3 text-left font-medium min-w-[220px]">Alt Text</th>
                <th className="px-4 py-3 text-left font-medium min-w-[250px]">Description</th>
                <th className="px-4 py-3 text-left font-medium min-w-[180px]">Tags</th>
                <th className="px-4 py-3 text-left font-medium min-w-[140px]">Format</th>
                <th className="px-4 py-3 text-left font-medium min-w-[220px]">Platform</th>
                <th className="px-4 py-3 text-left font-medium min-w-[180px]">Campaign</th>
                <th className="px-4 py-3 text-center font-medium min-w-[80px]">Ready</th>
                <th className="px-4 py-3 text-right font-medium min-w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {filesMetadata.map((meta, index) => {
                const ready = isPlannerReady(meta, status)
                const previewUrl = URL.createObjectURL(meta.file)

                return (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      {meta.file.type.startsWith('image/') ? (
                        <img 
                          src={previewUrl} 
                          alt={meta.title} 
                          className="w-14 h-14 object-cover rounded"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-muted rounded flex items-center justify-center text-xs">
                          Video
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs truncate block min-w-[150px]" title={meta.file.name}>
                        {meta.file.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        value={meta.title}
                        onChange={(e) => onUpdate(index, { title: e.target.value })}
                        className="h-9 text-xs min-w-[220px]"
                        placeholder="Title..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        value={meta.alt_text}
                        onChange={(e) => onUpdate(index, { alt_text: e.target.value })}
                        className="h-9 text-xs min-w-[220px]"
                        placeholder="Alt text..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Textarea
                        value={meta.description}
                        onChange={(e) => onUpdate(index, { description: e.target.value })}
                        className="h-9 text-xs resize-none min-w-[250px]"
                        placeholder="Description..."
                        rows={1}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        value={meta.tags}
                        onChange={(e) => onUpdate(index, { tags: e.target.value })}
                        className="h-9 text-xs min-w-[180px]"
                        placeholder="Tags..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={meta.format_group || 'none'}
                        onValueChange={(v) => onUpdate(index, { format_group: v === 'none' ? null : v })}
                      >
                        <SelectTrigger className="h-9 text-xs min-w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {FORMAT_GROUPS.map((g) => (
                            <SelectItem key={g} value={g} className="text-xs capitalize">
                              {g.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <MultiSelect
                        options={[...PLATFORMS]}
                        selected={meta.suggested_platforms || []}
                        onChange={(platforms) => onUpdate(index, { suggested_platforms: platforms })}
                        placeholder="Select..."
                        className="h-9 min-w-[220px]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={meta.campaign_id || 'none'}
                        onValueChange={(v) => onUpdate(index, { campaign_id: v === 'none' ? null : v })}
                      >
                        <SelectTrigger className="h-9 text-xs min-w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {campaigns.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ready ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 inline" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 inline" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(index)}
                        className="h-7 w-7 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <strong>Planner Ready:</strong> Has title, alt text, description, tags, and status = ready
        </span>
      </div>
    </div>
  )
}
