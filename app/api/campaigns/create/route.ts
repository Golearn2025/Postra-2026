import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { createCampaignAction } from '@/server/actions/campaigns/create-campaign.action'
import type { CreateCampaignFormData } from '@/types/campaigns'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data, organizationId } = body

    if (!data || !organizationId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Log organization context for debugging
    console.log('[CREATE CAMPAIGN] User:', user.profile.email, 'Organization ID:', organizationId, 'Campaign Name:', data.name)

    const result = await createCampaignAction(organizationId, data)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, campaign: result.campaign })
  } catch (error) {
    console.error('Create campaign API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
