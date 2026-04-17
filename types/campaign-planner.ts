import type { AppCampaignsListItem } from './views'
import type { AppMediaAssetsListItem } from './views'

export interface Campaign {
  id: string
  name: string
  objective: string
  target_audience: string
  description?: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  pillar: string
  start_date?: string
  end_date?: string
}

export interface MediaAsset {
  id: string
  filename: string
  title?: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CampaignPlannerClientProps {
  organizationId: string
  userId: string
  campaigns?: AppCampaignsListItem[]
  mediaAssets?: AppMediaAssetsListItem[]
}

export interface SelectedCampaign extends AppCampaignsListItem {
  objective: string | null
  target_audience: string | null
}

export interface SelectedMedia extends AppMediaAssetsListItem {
  description?: string
  file_url?: string
}
