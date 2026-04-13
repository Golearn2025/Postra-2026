import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/server/services/auth.service'
import { getAvailableOrganizations } from '@/server/services/organization.service'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizations = await getAvailableOrganizations(user)
    return NextResponse.json(organizations)
  } catch (error) {
    console.error('Failed to load organizations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
