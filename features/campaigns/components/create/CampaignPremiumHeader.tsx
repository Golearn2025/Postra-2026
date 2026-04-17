'use client'

import { Button } from '@/components/ui/button'
import { Megaphone, Save, Sparkles } from 'lucide-react'

interface CampaignPremiumHeaderProps {
  organizationName: string
  isSubmitting: boolean
  onSaveDraft?: () => void
  onCancel: () => void
}

export function CampaignPremiumHeader({
  organizationName,
  isSubmitting,
  onSaveDraft,
  onCancel
}: CampaignPremiumHeaderProps) {
  return (
    <div className="flex-shrink-0 h-20 bg-white dark:bg-slate-900 border-b border-border/50 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create Campaign</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>for</span>
                <span className="px-2.5 py-1 rounded-md bg-[#eef2ff] dark:bg-[#6366f1]/10 text-[#6366f1] dark:text-[#c7d2fe] font-semibold">
                  {organizationName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="gap-2 border-slate-300 dark:border-slate-600"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] shadow-lg shadow-[#6366f1]/25 text-white"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </div>
    </div>
  )
}
