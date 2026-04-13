import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'

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
