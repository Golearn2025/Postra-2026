'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Edit2, Save, X, Check } from 'lucide-react'
import type { OrganizationPlatform } from '@/server/repositories/organization-platform-preferences.repository'

interface PlatformPreferencesSectionProps {
  platforms: OrganizationPlatform[]
  onUpdate: (selectedPlatforms: string[]) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
}

const platformIcons: Record<string, string> = {
  facebook: 'f',
  instagram: 'i', 
  tiktok: 't',
  linkedin: 'li',
  twitter: 'x',
  youtube: 'y'
}

const platformColors: Record<string, string> = {
  facebook: 'bg-blue-500',
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  tiktok: 'bg-black',
  linkedin: 'bg-blue-700',
  twitter: 'bg-slate-800',
  youtube: 'bg-red-600'
}

export function PlatformPreferencesSection({ platforms, onUpdate, isLoading }: PlatformPreferencesSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.filter(p => p.isEnabled).map(p => p.platform)
  )

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      const result = await onUpdate(selectedPlatforms)
      if (result.success) {
        setIsEditing(false)
      } else {
        setSaveError(result.error || 'Failed to save platforms')
      }
    } catch (error) {
      setSaveError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setSelectedPlatforms(platforms.filter(p => p.isEnabled).map(p => p.platform))
    setIsEditing(false)
    setSaveError(null)
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const allPlatforms = ['facebook', 'instagram', 'tiktok', 'linkedin', 'twitter', 'youtube']

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-xl">
            <Settings className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Preferences</h2>
            <p className="text-slate-600 mt-1">Choose your active social platforms</p>
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

      {/* Platform Content */}
      {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {allPlatforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform)
            
            return (
              <div
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Platform Icon */}
                <div className={`w-12 h-12 ${platformColors[platform]} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4`}>
                  {platformIcons[platform]}
                </div>
                
                {/* Platform Name */}
                <div className="font-semibold text-slate-900 capitalize mb-2">
                  {platform}
                </div>
                
                {/* Status */}
                <div className={`text-sm ${
                  isSelected ? 'text-blue-600' : 'text-slate-500'
                }`}>
                  {isSelected ? 'Enabled' : 'Click to enable'}
                </div>
                
                {/* Toggle Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-slate-300'
                  }`}>
                    {isSelected && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {platforms.length > 0 ? (
            platforms.map((platform) => (
              <div
                key={platform.id}
                className={`p-6 border rounded-xl ${
                  platform.isEnabled
                    ? 'border-slate-200 bg-white shadow-sm'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {/* Platform Icon */}
                <div className={`w-12 h-12 ${platformColors[platform.platform]} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4 ${
                  !platform.isEnabled && 'opacity-50'
                }`}>
                  {platformIcons[platform.platform]}
                </div>
                
                {/* Platform Name */}
                <div className={`font-semibold capitalize mb-2 ${
                  platform.isEnabled ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {platform.platform}
                </div>
                
                {/* Status */}
                <div className={`text-sm ${
                  platform.isEnabled ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {platform.isEnabled ? 'Active' : 'Inactive'}
                </div>
                
                {/* Status Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${
                    platform.isEnabled ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No platforms configured</h3>
              <p className="text-slate-600">Click Edit to get started with your social platforms</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
