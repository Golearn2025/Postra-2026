import type { SocialPlatform } from '@/types/database'

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  google_business: 'Google Business',
  threads: 'Threads',
  youtube: 'YouTube',
}

export const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  tiktok: '#010101',
  google_business: '#4285F4',
  threads: '#101010',
  youtube: '#FF0000',
}

export const SIDEBAR_WIDTH = 248
export const TOPBAR_HEIGHT = 56
