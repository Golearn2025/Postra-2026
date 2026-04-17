import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { createCampaignAction } from '@/server/actions/campaigns/create-campaign.action'

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

    const result = await createCampaignAction(organizationId, data)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, campaign: result.campaign })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
