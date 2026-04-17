/**
 * Campaign Form Data API Route
 * Returns approved model campaign form data
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Return approved model defaults - no legacy configuration
    return NextResponse.json({
      formData: {
        objectiveExamples: 'Increase brand awareness, Generate qualified leads, Drive product sales, Build customer loyalty',
        targetAudienceExamples: 'General consumers, Business professionals, Young adults, Decision makers',
        targetMarketExamples: 'Local market, National market, International market, Specific regions'
      }
    })

  } catch (error) {
    console.error('Failed to get campaign form data:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
