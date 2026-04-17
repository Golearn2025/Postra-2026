import { z } from 'zod'

export const MEDIA_TYPES = ['image', 'video', 'thumbnail', 'logo'] as const
export const MEDIA_SOURCES = ['uploaded', 'ai_generated', 'imported_manual', 'rendered_template'] as const
export const MEDIA_STATUSES = ['draft', 'ready', 'processing', 'failed', 'archived'] as const
export const FORMAT_GROUPS = ['vertical_mobile', 'portrait_feed', 'square', 'landscape'] as const
export const PLATFORMS = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat', 'reddit', 'threads'] as const

export const mediaMetadataSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  campaign_id: z.string().uuid().optional().nullable(),
  type: z.enum(MEDIA_TYPES),
  source: z.enum(MEDIA_SOURCES),
  status: z.enum(MEDIA_STATUSES),
  format_group: z.enum(FORMAT_GROUPS).optional().nullable(),
  alt_text: z.string().max(500).optional().nullable(),
  hook_text: z.string().max(500).optional().nullable(),
  transcript: z.string().max(5000).optional().nullable(),
  tags: z.string().optional().nullable(),
  suggested_platforms: z.array(z.enum(PLATFORMS)).optional().nullable(),
  // New metadata fields for AI brief generation
  asset_title_short: z.string().max(200).optional().nullable(),
  asset_description: z.string().max(500).optional().nullable(),
  asset_tags: z.string().optional().nullable(),
  asset_ai_hint: z.string().max(300).optional().nullable(),
})

export type MediaMetadataFormValues = z.infer<typeof mediaMetadataSchema>

export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw.split(',').map(t => t.trim()).filter(Boolean)
}

export function formatTags(tags: string[]): string {
  return tags.join(', ')
}
