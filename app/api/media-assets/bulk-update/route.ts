import { NextRequest, NextResponse } from 'next/server'
import { bulkUpdateMediaAssetsAction } from '@/server/actions/media-assets.actions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetIds, organizationId, metadata } = body

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { error: 'Asset IDs are required' },
        { status: 400 }
      )
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    console.log('DEBUG: API received:', { assetIds, organizationId, metadata })
    const result = await bulkUpdateMediaAssetsAction(assetIds, organizationId, metadata)
    console.log('DEBUG: Server action result:', result)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedCount: result.updatedCount,
      message: `Successfully updated ${result.updatedCount} asset${result.updatedCount !== 1 ? 's' : ''}`
    })

  } catch (error) {
    console.error('Bulk update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
