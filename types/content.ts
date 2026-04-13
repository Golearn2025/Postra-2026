import type {
  DbContentPost,
  DbContentCampaign,
  DbMediaAsset,
  DbSocialAccount,
  CampaignStatus,
  ContentPostStatus,
  SocialPlatform,
} from './database'

export interface CampaignSummary {
  campaign: DbContentCampaign
  postCount: number
  publishedCount: number
  scheduledCount: number
}

export interface PostWithAsset {
  post: DbContentPost
  primaryAsset: DbMediaAsset | null
}

export interface PlatformStatusItem {
  platform: SocialPlatform
  accountName: string
  status: 'connected' | 'disconnected' | 'expired' | 'error'
  lastSyncAt: string | null
}

export interface DashboardKpi {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface ActivityItem {
  id: string
  type: 'post_created' | 'post_published' | 'campaign_created' | 'import_completed' | 'media_uploaded'
  title: string
  description: string
  timestamp: string
  user?: string
  platform?: SocialPlatform
}
