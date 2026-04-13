'use client'

import { MediaMetadataForm } from './MediaMetadataForm'
import { updateMediaAssetAction } from '@/server/actions/media-assets.actions'
import type { DbMediaAsset } from '@/types/database'
import type { MediaMetadataFormValues } from '../schemas/media-asset.schema'
import type { AppMediaAssetDetail } from '@/types/views'

interface EditMediaAssetFormProps {
  asset: AppMediaAssetDetail & { signedUrl?: string }
  organizationId: string
}

export function EditMediaAssetForm({ asset, organizationId }: EditMediaAssetFormProps) {
  const handleSubmit = async (values: MediaMetadataFormValues) => {
    return updateMediaAssetAction(asset.id, organizationId, values)
  }

  return <MediaMetadataForm asset={asset} onSubmit={handleSubmit} />
}
