'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Bug } from 'lucide-react'
import type { CreateCampaignFormData } from '@/types/campaigns'

interface CampaignDebugPanelProps {
  formData: CreateCampaignFormData
}

export function CampaignDebugPanel({ formData }: CampaignDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900 text-white rounded-lg shadow-2xl border-2 border-slate-700 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">Debug Panel</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Content */}
        {isOpen && (
          <div className="p-4 border-t border-slate-700 max-h-96 overflow-y-auto">
            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="text-yellow-400 font-semibold mb-1">name:</div>
                <div className="bg-slate-800 p-2 rounded">
                  {formData.name ? (
                    <span className="text-green-400">"{formData.name}"</span>
                  ) : (
                    <span className="text-red-400">empty or undefined</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-yellow-400 font-semibold mb-1">campaignPillar:</div>
                <div className="bg-slate-800 p-2 rounded text-blue-400">
                  {formData.campaignPillar || 'undefined'}
                </div>
              </div>

              <div>
                <div className="text-yellow-400 font-semibold mb-1">mainGoal:</div>
                <div className="bg-slate-800 p-2 rounded text-blue-400">
                  {formData.mainGoal || 'undefined'}
                </div>
              </div>

              <div>
                <div className="text-yellow-400 font-semibold mb-1">scheduleType:</div>
                <div className="bg-slate-800 p-2 rounded text-blue-400">
                  {formData.scheduleType}
                </div>
              </div>

              {formData.scheduleType === 'date_range' && (
                <div>
                  <div className="text-yellow-400 font-semibold mb-1">dates:</div>
                  <div className="bg-slate-800 p-2 rounded space-y-1">
                    <div>start: {formData.startDate || <span className="text-red-400">undefined</span>}</div>
                    <div>end: {formData.endDate || <span className="text-red-400">undefined</span>}</div>
                  </div>
                </div>
              )}

              {formData.scheduleType === 'selected_dates' && (
                <div>
                  <div className="text-yellow-400 font-semibold mb-1">selectedDates:</div>
                  <div className="bg-slate-800 p-2 rounded">
                    {formData.selectedDates && formData.selectedDates.length > 0 ? (
                      <div className="text-green-400">{formData.selectedDates.length} dates</div>
                    ) : (
                      <span className="text-red-400">none</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="text-yellow-400 font-semibold mb-1">status:</div>
                <div className="bg-slate-800 p-2 rounded text-blue-400">
                  {formData.status}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <div className="text-yellow-400 font-semibold mb-2">Full JSON:</div>
                <pre className="bg-slate-800 p-2 rounded text-[10px] overflow-x-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
