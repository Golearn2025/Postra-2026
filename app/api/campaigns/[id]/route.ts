import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { getCurrentUser } from '@/server/services/auth.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await getSupabaseServerClient()

    const { data: campaign, error } = await supabase
      .from('content_campaigns')
      .select('id, name, slug, objective, target_audience, target_market, start_date, end_date, status')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[API PATCH] Starting campaign update')
    
    const user = await getCurrentUser()
    if (!user) {
      console.log('[API PATCH] Unauthorized - no user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    console.log('[API PATCH] Campaign ID:', id)
    console.log('[API PATCH] User:', user.profile.email)
    console.log('[API PATCH] Request body:', body)

    const supabase = await getSupabaseServerClient()

    // Verify campaign exists and user has access
    const { data: existingCampaign, error: fetchError } = await supabase
      .from('content_campaigns')
      .select('id, organization_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingCampaign) {
      console.log('[API PATCH] Campaign not found:', fetchError)
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    console.log('[API PATCH] Existing campaign:', existingCampaign)

    // Check if user is platform owner using RLS function
    const { data: isPlatformOwner, error: platformError } = await supabase
      .rpc('is_platform_owner')

    console.log('[API PATCH] Platform owner check:', { isPlatformOwner, platformError })

    // If not platform owner, check organization permissions
    if (platformError || !isPlatformOwner) {
      const { data: memberCheck, error: memberError } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', existingCampaign.organization_id)
        .eq('user_id', user.profile.id)
        .in('role', ['org_admin', 'editor'])
        .single()

      console.log('[API PATCH] Member check:', { memberCheck, memberError })

      if (memberError || !memberCheck) {
        console.log('[API PATCH] Insufficient permissions')
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    // Update campaign
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      organization_id: existingCampaign.organization_id
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.campaign_pillar !== undefined) updateData.campaign_pillar = body.campaign_pillar
    if (body.objective !== undefined) updateData.objective = body.objective
    if (body.target_audience !== undefined) updateData.target_audience = body.target_audience
    if (body.target_market !== undefined) updateData.target_market = body.target_market
    if (body.schedule_type !== undefined) updateData.schedule_type = body.schedule_type
    if (body.start_date !== undefined) updateData.start_date = body.start_date
    if (body.end_date !== undefined) updateData.end_date = body.end_date
    if (body.selected_dates !== undefined) updateData.selected_dates = body.selected_dates
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.status !== undefined) updateData.status = body.status
    if (body.description !== undefined) updateData.description = body.description

    console.log('[API PATCH] Update data prepared:', updateData)

    const { data: updatedCampaign, error: updateError } = await supabase
      .from('content_campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    console.log('[API PATCH] Update result:', { updatedCampaign, updateError })

    if (updateError) {
      console.error('[API PATCH] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }

    console.log('[API PATCH] Update successful, returning response')
    return NextResponse.json({ campaign: updatedCampaign })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
