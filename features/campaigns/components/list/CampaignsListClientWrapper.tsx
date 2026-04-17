'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CampaignsListContainer } from './CampaignsListContainer'
import type { AppCampaignsListItem } from '@/types/views'

interface CampaignsListClientWrapperProps {
  campaigns: AppCampaignsListItem[]
  initialPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function CampaignsListClientWrapper({
  campaigns,
  initialPage,
  totalPages,
  totalItems,
  itemsPerPage
}: CampaignsListClientWrapperProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

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

  return (
    <CampaignsListContainer 
      campaigns={campaigns}
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
