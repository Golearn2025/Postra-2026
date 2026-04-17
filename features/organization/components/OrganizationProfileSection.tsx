'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Building, Edit2, Save, X } from 'lucide-react'
import type { OrganizationProfile } from '@/types/onboarding'

interface OrganizationProfileSectionProps {
  profile: OrganizationProfile | null
  onUpdate: (updates: Partial<OrganizationProfile>) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
}

export function OrganizationProfileSection({ profile, onUpdate, isLoading }: OrganizationProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<OrganizationProfile>>(profile || {})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      const result = await onUpdate(editForm)
      if (result.success) {
        setIsEditing(false)
      } else {
        setSaveError(result.error || 'Failed to save profile')
      }
    } catch (error) {
      setSaveError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(profile || {})
    setIsEditing(false)
    setSaveError(null)
  }

  const formatValue = (value: string) => {
    return value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl">
            <Building className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Brand Profile</h2>
            <p className="text-slate-600 mt-1">Your organization's core identity</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-6"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-6"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Error Display */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{saveError}</p>
        </div>
      )}

      {/* Profile Content */}
      {isEditing ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Industry Field */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Industry</label>
              <select
                value={editForm.industry || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select industry...</option>
                <option value="technology">Technology</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Target Audience Field */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Target Audience</label>
              <select
                value={editForm.targetAudience || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select audience...</option>
                <option value="b2b">B2B</option>
                <option value="b2c">B2C</option>
                <option value="both">Both B2B and B2C</option>
                <option value="internal">Internal</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Primary Goal Field */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Primary Goal</label>
              <select
                value={editForm.primaryGoal || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, primaryGoal: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select goal...</option>
                <option value="brand_awareness">Brand Awareness</option>
                <option value="lead_generation">Lead Generation</option>
                <option value="sales">Sales</option>
                <option value="engagement">Engagement</option>
                <option value="community">Community Building</option>
              </select>
            </div>

            {/* Default Tone Field */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Default Tone</label>
              <select
                value={editForm.defaultTone || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, defaultTone: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select tone...</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="playful">Playful</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {/* Industry Info Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Industry</div>
            <div className="text-lg font-semibold text-slate-900">
              {profile?.industry ? formatValue(profile.industry) : 'Not set'}
            </div>
          </div>

          {/* Target Audience Info Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Target Audience</div>
            <div className="text-lg font-semibold text-slate-900">
              {profile?.targetAudience ? formatValue(profile.targetAudience) : 'Not set'}
            </div>
          </div>

          {/* Primary Goal Info Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Primary Goal</div>
            <div className="text-lg font-semibold text-slate-900">
              {profile?.primaryGoal ? formatValue(profile.primaryGoal) : 'Not set'}
            </div>
          </div>

          {/* Default Tone Info Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Default Tone</div>
            <div className="text-lg font-semibold text-slate-900">
              {profile?.defaultTone ? formatValue(profile.defaultTone) : 'Not set'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
