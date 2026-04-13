import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext, getOrganizationContextBySlug } from '@/server/services/organization.service'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const useCached = searchParams.get('useCached') === 'true'

    if (useCached && slug) {
      // For organization switching, we expect availableOrgs to be passed from client
      // This is a simplified version - in a real implementation, you'd need to validate
      // that the user has access to the requested organization
      return NextResponse.json({ error: 'useCached requires client-side validation' }, { status: 400 })
    }

    const context = await getCurrentOrganizationContext(user, slug || undefined)
    if (!context) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    return NextResponse.json(context)
  } catch (error) {
    console.error('Failed to load organization context:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
