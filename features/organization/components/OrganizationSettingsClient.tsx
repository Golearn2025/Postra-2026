'use client'

import { Building, CheckCircle } from 'lucide-react'
import { OrganizationProfileSection } from './OrganizationProfileSection'
import { PlatformPreferencesSection } from './PlatformPreferencesSection'
import { updateOrganizationProfileAction } from '@/server/actions/organization.actions'
import { updatePlatformPreferencesAction } from '@/server/actions/organization.actions'
import type { OrganizationProfile } from '@/types/onboarding'
import type { OrganizationPlatform } from '@/server/repositories/organization-platform-preferences.repository'

interface OrganizationSettingsClientProps {
  organizationId: string
  organizationName: string
  initialProfile: OrganizationProfile | null
  initialPlatforms: OrganizationPlatform[]
}

export function OrganizationSettingsClient({ 
  organizationId, 
  organizationName, 
  initialProfile, 
  initialPlatforms 
}: OrganizationSettingsClientProps) {
  
  // Handle profile updates - separate flow
  const handleProfileUpdate = async (updates: Partial<OrganizationProfile>) => {
    // Filter out null values to match server action types
    const filteredUpdates = {
      industry: updates.industry || undefined,
      industryOtherText: updates.industryOtherText || undefined,
      targetAudience: updates.targetAudience || undefined,
      targetAudienceOtherText: updates.targetAudienceOtherText || undefined,
      primaryGoal: updates.primaryGoal || undefined,
      defaultTone: updates.defaultTone || undefined,
    }
    
    // Delegate to server action - no business logic here
    return await updateOrganizationProfileAction(organizationId, filteredUpdates)
  }

  // Handle platform updates - separate flow
  const handlePlatformUpdate = async (selectedPlatforms: string[]) => {
    // Delegate to server action - no business logic here
    return await updatePlatformPreferencesAction(organizationId, selectedPlatforms)
  }

  const activePlatformsCount = initialPlatforms.filter(p => p.isEnabled).length
  const isOnboardingCompleted = !!initialProfile?.onboardingCompletedAt

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header */}
      <div className="px-6 py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-slate-900">Organization</h1>
              <p className="text-slate-600 text-lg">
                Manage your organization profile and platform preferences
              </p>
            </div>
            
            {/* Organization Badge */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Building className="h-5 w-5 text-slate-500" />
              <div>
                <div className="font-semibold text-slate-900">{organizationName}</div>
                <div className="text-xs text-slate-500">Active</div>
              </div>
            </div>
          </div>
          
          {/* Metadata Line */}
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            {isOnboardingCompleted && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Onboarding completed</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{activePlatformsCount} platforms active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Organization Profile Section - independent save */}
        <OrganizationProfileSection
          profile={initialProfile}
          onUpdate={handleProfileUpdate}
        />

        {/* Platform Preferences Section - independent save */}
        <PlatformPreferencesSection
          platforms={initialPlatforms}
          onUpdate={handlePlatformUpdate}
        />
      </div>
    </div>
  )
}
