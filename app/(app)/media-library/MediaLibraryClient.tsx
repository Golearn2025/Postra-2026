'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MediaCard } from '@/features/media-library/components/MediaCard'
import { softDeleteMediaAssetAction } from '@/server/actions/media-assets.actions'
import type { AppMediaAssetsListItem } from '@/types/views'

interface MediaLibraryClientProps {
  assets: (AppMediaAssetsListItem & { signedUrl?: string })[]
  organizationId: string
}

export function MediaLibraryClient({ assets, organizationId }: MediaLibraryClientProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteClick = async (assetId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this media asset? This will remove it from your active library, but the data will be preserved for recovery.'
    )
    
    if (!confirmed) return

    setIsDeleting(assetId)
    try {
      const result = await softDeleteMediaAssetAction(assetId, organizationId)
      
      if (result.error) {
        console.error('Delete failed:', result.error)
        alert('Failed to delete media asset. Please try again.')
      } else {
        // Success - refresh the page to show updated list
        router.refresh()
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the asset.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {assets.map((asset) => (
        <MediaCard 
          key={asset.id} 
          asset={asset} 
          onDelete={handleDeleteClick}
          isDeleting={isDeleting === asset.id}
        />
      ))}
    </div>
  )
}
