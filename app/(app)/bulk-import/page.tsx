import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Megaphone } from 'lucide-react'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { appConfig } from '@/config/app-config'
import { BulkImportClient } from './BulkImportClient'

export const metadata: Metadata = { title: 'Bulk Import' }

export default async function BulkImportPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  
  if (!orgContext) {
    return (
      <div className="space-y-6">
        <PageHeader title="Bulk Import" description="Import posts in bulk via CSV or JSON." />
        <EmptyState 
          icon={Megaphone} 
          title="No organization selected" 
          description="Select an organization to use bulk import." 
        />
      </div>
    )
  }

  return <BulkImportClient organizationId={orgContext.organization.id} />
}
