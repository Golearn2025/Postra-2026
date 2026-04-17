'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'

export interface UpdateCampaignInput {
  campaignId: string
  organizationId: string
  name: string
  campaign_pillar: string
  objective?: string
  target_audience?: string
  target_market?: string
  schedule_type: 'date_range' | 'selected_dates'
  start_date?: string
  end_date?: string
  selected_dates?: string[]
  slug?: string
  status?: string
  description?: string
}

export async function updateCampaignAction(input: UpdateCampaignInput) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await getSupabaseServerClient()

    // Update campaign
    const { error: campaignError } = await supabase
      .from('content_campaigns')
      .update({
        name: input.name,
        campaign_pillar: input.campaign_pillar,
        objective: input.objective,
        target_audience: input.target_audience,
        target_market: input.target_market,
        schedule_type: input.schedule_type,
        start_date: input.schedule_type === 'date_range' ? input.start_date : null,
        end_date: input.schedule_type === 'date_range' ? input.end_date : null,
        slug: input.slug,
        status: input.status,
        description: input.description,
        updated_by: user.profile.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.campaignId)
      .eq('organization_id', input.organizationId)

    if (campaignError) {
      console.error('Update campaign error:', campaignError)
      return { success: false, error: 'Failed to update campaign' }
    }

    // Handle selected dates if schedule_type is selected_dates
    if (input.schedule_type === 'selected_dates' && input.selected_dates) {
      // Delete existing dates
      await supabase
        .from('content_campaign_dates')
        .delete()
        .eq('campaign_id', input.campaignId)

      // Insert new dates
      if (input.selected_dates.length > 0) {
        const datesToInsert = input.selected_dates.map(date => ({
          campaign_id: input.campaignId,
          scheduled_date: date,
          created_by: user.profile.id
        }))

        const { error: datesError } = await supabase
          .from('content_campaign_dates')
          .insert(datesToInsert)

        if (datesError) {
          console.error('Insert campaign dates error:', datesError)
          return { success: false, error: 'Failed to update campaign dates' }
        }
      }
    }

    revalidatePath('/campaigns')
    revalidatePath(`/campaigns/${input.campaignId}`)

    return { success: true }
  } catch (error) {
    console.error('Update campaign action error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
