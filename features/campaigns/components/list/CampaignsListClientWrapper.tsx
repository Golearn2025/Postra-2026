'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CampaignsListContainer } from './CampaignsListContainer'
import type { AppCampaignsListItem } from '@/types/views'

interface CampaignsListClientWrapperProps {
  campaigns: AppCampaignsListItem[]
  activeTab?: 'active' | 'archived'
  initialPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function CampaignsListClientWrapper({
  campaigns,
  activeTab = 'active',
  initialPage,
  totalPages,
  totalItems,
  itemsPerPage
}: CampaignsListClientWrapperProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get current tab from URL params, fallback to prop
  const tabFromUrl = searchParams.get('tab')
  console.log('DEBUG ClientWrapper - tabFromUrl:', tabFromUrl, 'activeTab prop:', activeTab)
  const currentTab = (tabFromUrl as 'active' | 'archived') || activeTab
  console.log('DEBUG ClientWrapper - currentTab:', currentTab)

  const currentPage = parseInt(searchParams.get('page') || initialPage.toString())
  const currentItemsPerPage = parseInt(searchParams.get('pageSize') || itemsPerPage.toString())

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/campaigns?${params.toString()}`)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageSize', newItemsPerPage.toString())
    params.delete('page') // Reset to page 1
    router.push(`/campaigns?${params.toString()}`)
  }

  const handleTabChange = (newTab: 'active' | 'archived') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', newTab)
    params.delete('page') // Reset to page 1 when switching tabs
    router.push(`/campaigns?${params.toString()}`)
  }

  return (
    <CampaignsListContainer 
      campaigns={campaigns}
      activeTab={currentTab}
      onTabChange={handleTabChange}
      pagination={{
        currentPage,
        totalPages: Math.ceil(totalItems / currentItemsPerPage),
        totalItems,
        itemsPerPage: currentItemsPerPage,
        onPageChange: handlePageChange,
        onItemsPerPageChange: handleItemsPerPageChange
      }}
    />
  )
}
