import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    
    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Get signed URL for the file
    const { data: urlData, error: urlError } = await supabase.storage
      .from('media-assets')
      .createSignedUrl(path, 3600) // 1 hour expiry

    if (urlError || !urlData?.signedUrl) {
      console.error('Error creating signed URL:', urlError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Redirect to the signed URL
    return NextResponse.redirect(urlData.signedUrl)
  } catch (error) {
    console.error('Media file API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
