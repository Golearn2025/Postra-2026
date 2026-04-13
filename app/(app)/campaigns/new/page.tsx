import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/shared/PageHeader'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { appConfig } from '@/config/app-config'
import { NewCampaignForm } from '@/features/campaigns/forms/NewCampaignForm'

export const metadata: Metadata = { title: 'New Campaign' }

export default async function NewCampaignPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) redirect('/campaigns' as any)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={'/campaigns' as any}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
      </div>

      <PageHeader
        title="New Campaign"
        description={`Create a new content campaign for ${orgContext.organization.name}.`}
      />

      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <NewCampaignForm organizationId={orgContext.organization.id} />
      </div>
    </div>
  )
}
