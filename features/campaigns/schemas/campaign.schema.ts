import { z } from 'zod'

export const CAMPAIGN_STATUSES = ['draft', 'active', 'completed', 'archived'] as const
export const CAMPAIGN_PILLARS = [
  'luxury', 'airport', 'corporate', 'wedding', 'testimonial',
  'promo', 'educational', 'seasonal', 'general',
] as const

export const campaignSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  status: z.enum(CAMPAIGN_STATUSES),
  pillar: z.enum(CAMPAIGN_PILLARS).optional().nullable(),
  objective: z.string().max(500).optional().nullable(),
  target_audience: z.string().max(500).optional().nullable(),
  target_market: z.string().max(200).optional().nullable(),
  timezone: z.string().min(1, 'Timezone is required'),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) >= new Date(data.start_date)
    }
    return true
  },
  { message: 'End date must be on or after start date', path: ['end_date'] }
)

export type CampaignFormValues = z.infer<typeof campaignSchema>

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
