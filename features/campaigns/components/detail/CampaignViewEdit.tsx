'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Eye, Save, X, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CampaignStatusBadge } from '../CampaignStatusBadge'
import type { AppCampaignDetail } from '@/types/views'
import { CampaignViewMode } from './CampaignViewMode'
import { CampaignEditMode } from './CampaignEditMode'

interface CampaignViewEditProps {
  campaign: AppCampaignDetail
  organizationName: string
}

export function CampaignViewEdit({ campaign, organizationName }: CampaignViewEditProps) {
  const router = useRouter()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (updatedData: any) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) throw new Error('Failed to update campaign')

      router.refresh()
      setIsEditMode(false)
    } catch (error) {
      console.error('[UPDATE ERROR]', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Premium Header */}
      <div className="flex-shrink-0 h-20 bg-white dark:bg-slate-900 border-b border-border/50 shadow-sm">
        <div className="h-full px-8 flex items-center justify-between">
          {/* Left: Campaign Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {campaign.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>for</span>
                <span className="px-2.5 py-1 rounded-md bg-[#eef2ff] dark:bg-[#6366f1]/10 text-[#6366f1] dark:text-[#c7d2fe] font-semibold">
                  {organizationName}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <CampaignStatusBadge status={campaign.status} />
            
            {!isEditMode ? (
              <Button
                onClick={() => setIsEditMode(true)}
                className="gap-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit Campaign
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditMode(false)}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave({})}
                  disabled={isSaving}
                  className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-8 py-6">
          {isEditMode ? (
            <CampaignEditMode
              campaign={campaign}
              onSave={handleSave}
              isSaving={isSaving}
            />
          ) : (
            <CampaignViewMode campaign={campaign} />
          )}
        </div>
      </div>
    </div>
  )
}
