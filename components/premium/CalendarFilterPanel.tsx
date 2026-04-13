'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { FilterDropdown } from '@/components/premium/FilterDropdown'
import { 
  X, 
  Filter as FilterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Linkedin as LinkedinIcon,
  Music as TikTokIcon,
  Youtube as YoutubeIcon,
  RefreshCw
} from 'lucide-react'

interface CalendarFilterPanelProps {
  campaigns: Array<{ id: string; name: string }>
  selectedCampaigns: string[]
  selectedStatuses: string[]
  selectedPlatforms: string[]
  onCampaignsChange: (campaigns: string[]) => void
  onStatusesChange: (statuses: string[]) => void
  onPlatformsChange: (platforms: string[]) => void
  onClearAll: () => void
}

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'published', label: 'Published' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'empty', label: 'Empty' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'skipped', label: 'Skipped' },
]

const PLATFORM_OPTIONS = [
  { 
    value: 'instagram', 
    label: 'Instagram', 
    icon: InstagramIcon,
    connected: false // V1 honesty - not connected yet
  },
  { 
    value: 'facebook', 
    label: 'Facebook', 
    icon: FacebookIcon,
    connected: false
  },
  { 
    value: 'twitter', 
    label: 'Twitter/X', 
    icon: TwitterIcon,
    connected: false
  },
  { 
    value: 'linkedin', 
    label: 'LinkedIn', 
    icon: LinkedinIcon,
    connected: false
  },
  { 
    value: 'tiktok', 
    label: 'TikTok', 
    icon: TikTokIcon,
    connected: false
  },
  { 
    value: 'youtube', 
    label: 'YouTube', 
    icon: YoutubeIcon,
    connected: false
  },
]

export function CalendarFilterPanel({
  campaigns,
  selectedCampaigns,
  selectedStatuses,
  selectedPlatforms,
  onCampaignsChange,
  onStatusesChange,
  onPlatformsChange,
  onClearAll
}: CalendarFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const hasActiveFilters = selectedCampaigns.length > 0 || 
                          selectedStatuses.length > 0 || 
                          selectedPlatforms.length > 0

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform]
    onPlatformsChange(newPlatforms)
  }

  return (
    <PremiumCard variant="dark" className="h-fit">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#2A2A2E]">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-blue-400" />
          <h3 className="font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {selectedCampaigns.length + selectedStatuses.length + selectedPlatforms.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-gray-400 hover:text-white hover:bg-[#2A2A2E]"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white hover:bg-[#2A2A2E]"
          >
            <X className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Campaign Filter */}
          <div>
            <h4 className="font-medium text-white mb-3">Campaign</h4>
            <FilterDropdown
              label="Select Campaigns"
              options={campaigns.map(c => ({ value: c.id, label: c.name }))}
              selectedValues={selectedCampaigns}
              onSelectionChange={onCampaignsChange}
              variant="dark"
            />
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="font-medium text-white mb-3">Status</h4>
            <FilterDropdown
              label="Select Status"
              options={STATUS_OPTIONS}
              selectedValues={selectedStatuses}
              onSelectionChange={onStatusesChange}
              variant="dark"
            />
          </div>

          {/* Platform Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Platform</h4>
              <span className="text-xs text-gray-400">Not connected</span>
            </div>
            
            <div className="space-y-2">
              {PLATFORM_OPTIONS.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.value)
                
                return (
                  <div
                    key={platform.value}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200',
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                        : 'bg-[#111113] border-[#2A2A2E] text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                    )}
                    onClick={() => handlePlatformToggle(platform.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{platform.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!platform.connected && (
                        <span className="text-xs text-gray-500">Not connected</span>
                      )}
                      <div className={cn(
                        'w-4 h-4 rounded border-2 transition-colors',
                        isSelected 
                          ? 'bg-blue-400 border-blue-400' 
                          : 'border-gray-600'
                      )}>
                        {isSelected && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* View Mode */}
          <div>
            <h4 className="font-medium text-white mb-3">View Mode</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Month', 'Week', 'Year', 'Agenda'].map((mode) => (
                <Button
                  key={mode}
                  variant="outline"
                  size="sm"
                  className="border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-[#2A2A2E]"
                  // onClick={() => onViewModeChange(mode.toLowerCase())}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-[#2A2A2E]">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="w-full border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-[#2A2A2E]"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </PremiumCard>
  )
}
