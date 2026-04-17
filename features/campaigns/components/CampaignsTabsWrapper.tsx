'use client'

import { CampaignsTabs } from './list/CampaignsTabs'
import { useSearchParams, useRouter } from 'next/navigation'

interface CampaignsTabsWrapperProps {
  activeTab?: 'active' | 'archived'
}

export function CampaignsTabsWrapper({ activeTab = 'active' }: CampaignsTabsWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get current tab from URL params, fallback to prop
  const tabFromUrl = searchParams.get('tab')
  console.log('DEBUG TabsWrapper - tabFromUrl:', tabFromUrl, 'activeTab prop:', activeTab)
  const currentTab = (tabFromUrl as 'active' | 'archived') || activeTab
  console.log('DEBUG TabsWrapper - currentTab:', currentTab)
  
  const handleTabChange = (tab: 'active' | 'archived') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`/campaigns?${params.toString()}`)
  }

  return (
    <CampaignsTabs 
      activeTab={currentTab}
      onTabChange={handleTabChange}
    />
  )
}
