'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface EditCampaignNotesSectionProps {
  formData: {
    description: string
    slug: string
    status: string
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function EditCampaignNotesSection({
  formData,
  onChange,
  errors
}: EditCampaignNotesSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Anything else to note?</h2>
        <p className="text-sm text-muted-foreground">
          Add campaign notes and adjust advanced settings
        </p>
      </div>

      {/* Campaign Notes */}
      <div className="space-y-2">
        <Label htmlFor="description">Campaign Notes</Label>
        <Textarea
          id="description"
          placeholder="Add campaign objectives, key messages, or any important details..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
        />
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Advanced Settings
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-2">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Campaign Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Campaign Slug</Label>
            <Input
              id="slug"
              type="text"
              placeholder="campaign-slug"
              value={formData.slug}
              onChange={(e) => onChange('slug', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs. Auto-generated from campaign name.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
