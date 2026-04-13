import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await getSupabaseServerClient()

    const { data: asset, error } = await supabase
      .from('media_assets')
      .select('id, title, original_filename, mime_type, file_size_bytes, file_url, storage_path, description, tags')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !asset) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 })
    }

    // Generate signed URL if needed
    if (!asset.file_url && asset.storage_path) {
      const { data: urlData } = await supabase.storage
        .from('media-assets')
        .createSignedUrl(asset.storage_path, 3600) // 1 hour expiry
      asset.file_url = urlData?.signedUrl || null
    }

    return NextResponse.json({ asset })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
