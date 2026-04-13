import type { DashboardKpi, ActivityItem, PlatformStatusItem } from '@/types/content'

export const MOCK_KPIS: DashboardKpi[] = [
  { label: 'Total Posts', value: '1,284', delta: 12, deltaLabel: 'vs last month', trend: 'up' },
  { label: 'Scheduled', value: '47', delta: 8, deltaLabel: 'this week', trend: 'up' },
  { label: 'Campaigns Active', value: '9', delta: -2, deltaLabel: 'vs last month', trend: 'down' },
  { label: 'Avg. Engagement', value: '4.8%', delta: 0.4, deltaLabel: 'vs last week', trend: 'up' },
]

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'post_published',
    title: '3 posts published to Instagram',
    description: 'Summer Campaign — Batch A',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: '2',
    type: 'import_completed',
    title: 'Bulk import completed',
    description: '24 posts imported successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    type: 'campaign_created',
    title: 'New campaign created',
    description: 'Q3 Product Launch — 12 posts',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '4',
    type: 'media_uploaded',
    title: 'Media batch uploaded',
    description: '18 assets added to Media Library',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: '5',
    type: 'post_created',
    title: 'Post drafted',
    description: 'LinkedIn thought leadership piece',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
]

export const MOCK_PLATFORMS: PlatformStatusItem[] = [
  { platform: 'instagram', accountName: '@brand_official', status: 'connected', lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { platform: 'facebook', accountName: 'Brand Page', status: 'connected', lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { platform: 'linkedin', accountName: 'Brand Company', status: 'connected', lastSyncAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { platform: 'tiktok', accountName: '@brand_tiktok', status: 'connected', lastSyncAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { platform: 'google_business', accountName: 'Brand Local', status: 'disconnected', lastSyncAt: null },
]
