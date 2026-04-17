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
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const supabase = await getSupabaseServerClient()

    // Verify campaign exists and user has access
    const { data: existingCampaign, error: fetchError } = await supabase
      .from('content_campaigns')
      .select('id, organization_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Update campaign
    const updateData: any = {
      updated_at: new Date().toISOString()
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

    const { data: updatedCampaign, error: updateError } = await supabase
      .from('content_campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }

    return NextResponse.json({ campaign: updatedCampaign })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
