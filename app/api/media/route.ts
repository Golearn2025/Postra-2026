import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId')
    const campaignId = searchParams.get('campaignId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId required' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Use app_media_assets_list view with thumbnail fields
    let query = supabase
      .from('app_media_assets_list')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    query = query.order('created_at', { ascending: false })

    const { data: assets, error } = await query

    if (error) {
      console.error('Error fetching media:', error)
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }

    // Generate signed URLs prioritizing thumbnails for previews
    const assetsWithUrls = await Promise.all((assets || []).map(async asset => {
      let signedUrl = null
      
      if (asset.type === 'image') {
        // Prioritize small storage path for previews, then thumb, then original
        if (asset.small_storage_path) {
          const { data: urlData } = await supabase.storage
            .from('media-assets')
            .createSignedUrl(asset.small_storage_path, 3600)
          signedUrl = urlData?.signedUrl || null
        } else if (asset.thumb_storage_path) {
          const { data: urlData } = await supabase.storage
            .from('media-assets')
            .createSignedUrl(asset.thumb_storage_path, 3600)
          signedUrl = urlData?.signedUrl || null
        } else if (asset.storage_path) {
          const { data: urlData } = await supabase.storage
            .from('media-assets')
            .createSignedUrl(asset.storage_path, 3600)
          signedUrl = urlData?.signedUrl || null
        }
      } else {
        // For videos, use original
        if (asset.storage_path) {
          const { data: urlData } = await supabase.storage
            .from('media-assets')
            .createSignedUrl(asset.storage_path, 3600)
          signedUrl = urlData?.signedUrl || null
        }
      }

      return { ...asset, signedUrl }
    }))

    return NextResponse.json({ assets: assetsWithUrls })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
