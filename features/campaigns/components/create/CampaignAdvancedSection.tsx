'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignAdvancedSectionProps {
  formData: CreateCampaignFormData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
  isSubmitting: boolean
  onCancel?: () => void
}

export function CampaignAdvancedSection({
  formData,
  onChange,
  errors,
  isSubmitting,
  onCancel
}: CampaignAdvancedSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="space-y-6">
      {/* Advanced Settings Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Settings</h3>
          <p className="text-sm text-muted-foreground">
            Optional settings for campaign management
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show
            </>
          )}
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t">
          {/* Campaign Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Campaign Slug (Optional)</Label>
            <Input
              id="slug"
              type="text"
              placeholder="campaign-name"
              value={formData.slug}
              onChange={(e) => onChange('slug', e.target.value)}
              className={errors.slug ? 'border-destructive' : ''}
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly identifier for the campaign (auto-generated from name)
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
          </div>

          {/* Campaign Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Campaign Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <p className="text-sm text-muted-foreground">
              Set the initial status of your campaign
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
