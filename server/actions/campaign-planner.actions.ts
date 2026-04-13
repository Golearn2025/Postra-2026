'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'
import type { AIDraftPost } from '@/features/campaign-planner/schemas/planner.schema'

export interface CreateDraftPostsResult {
  success: boolean
  postsCreated: number
  slotsCreated: number
  errors: string[]
  error?: string
}

export async function createDraftPostsAction(
  organizationId: string,
  campaignId: string,
  drafts: AIDraftPost[],
  mediaAssetMap: Record<string, string> // filename -> asset ID
): Promise<CreateDraftPostsResult> {
  const perDraftErrors: string[] = []

  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, postsCreated: 0, slotsCreated: 0, errors: [], error: 'Unauthorized' }
    }

    const supabase = await getSupabaseServerClient()
    let postsCreated = 0
    let slotsCreated = 0

    // Fetch media assets for this campaign to build proper mapping
    const { data: campaignMedia, error: mediaError } = await supabase
      .from('media_assets')
      .select('id, original_filename')
      .eq('campaign_id', campaignId)
      .eq('status', 'ready')

    if (mediaError) {
      console.error('Failed to fetch campaign media assets:', mediaError)
      return { 
        success: false, 
        postsCreated: 0, 
        slotsCreated: 0, 
        errors: ['Failed to fetch media assets'], 
        error: mediaError.message 
      }
    }

    // Build filename -> ID mapping for this campaign
    const campaignMediaMap = (campaignMedia || []).reduce((acc, asset) => {
      acc[asset.original_filename] = asset.id
      return acc
    }, {} as Record<string, string>)

    for (const draft of drafts) {
      const label = `Day ${draft.day} (${draft.date})`

      // Resolve media asset ID using campaign-specific mapping
      const mediaId = campaignMediaMap[draft.mediaFilename]
      if (!mediaId) {
        const msg = `${label}: no asset ID found for filename "${draft.mediaFilename}" in campaign ${campaignId}. Available: ${Object.keys(campaignMediaMap).join(', ')}`
        perDraftErrors.push(msg)
        continue
      }

      // Insert content_post
      const { data: post, error: postError } = await supabase
        .from('content_posts')
        .insert({
          organization_id: organizationId,
          campaign_id: campaignId,
          primary_media_asset_id: mediaId,
          title: draft.title,
          source: 'chatgpt_imported',
          content_type: 'social_post',
          status: 'draft',
          caption_master: draft.caption,
          master_hook: draft.hook ?? null,
          master_cta: draft.cta ?? null,
          import_media_filename: draft.mediaFilename, // Add for traceability
          metadata: {
            primaryTopic: draft.primaryTopic ?? null,
            hashtags: draft.hashtags ?? [],
            targetGoal: draft.targetGoal ?? null,
            plannerDay: draft.day,
          },
          created_by: user.profile.id,
          updated_by: user.profile.id,
        })
        .select('id')
        .single()

      if (postError || !post) {
        const msg = `${label}: failed to create post - ${postError?.message ?? 'unknown error'}`
        console.error(msg, postError)
        perDraftErrors.push(msg)
        continue
      }

      postsCreated++

      // Insert content_calendar_slot
      const { error: slotError } = await supabase
        .from('content_calendar_slots')
        .insert({
          organization_id: organizationId,
          campaign_id: campaignId,
          assigned_post_id: post.id,
          slot_date: draft.date,
          slot_time: '10:00:00',
          timezone: 'UTC',
          status: 'planned',
          target_goal: draft.targetGoal ?? null,
          metadata: {},
          created_by: user.profile.id,
        })

      if (slotError) {
        const msg = `${label}: post created but calendar slot failed - ${slotError.message}`
        console.error(msg, slotError)
        perDraftErrors.push(msg)
      } else {
        slotsCreated++
      }
    }

    
    revalidatePath('/campaigns')
    revalidatePath('/calendar')
    revalidatePath('/posts')

    return {
      success: postsCreated > 0,
      postsCreated,
      slotsCreated,
      errors: perDraftErrors,
    }
  } catch (error) {
    console.error('createDraftPostsAction fatal error:', error)
    return {
      success: false,
      postsCreated: 0,
      slotsCreated: 0,
      errors: perDraftErrors,
      error: error instanceof Error ? error.message : 'Unexpected error',
    }
  }
}
