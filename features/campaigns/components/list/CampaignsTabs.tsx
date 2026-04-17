'use client'

import { cn } from '@/lib/utils/cn'

type CampaignTab = 'active' | 'archived'

interface CampaignsTabsProps {
  activeTab: CampaignTab
  onTabChange: (tab: CampaignTab) => void
  className?: string
}

export function CampaignsTabs({ activeTab, onTabChange, className }: CampaignsTabsProps) {
  const tabs: { value: CampaignTab; label: string; count?: number }[] = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ]

  return (
    <div className={cn('flex items-center space-x-1 rounded-lg border bg-card p-1 shadow-sm', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
            activeTab === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
