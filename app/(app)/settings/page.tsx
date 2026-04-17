import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { getCurrentUser } from '@/server/services/auth.service'
import { getCurrentOrganizationContext } from '@/server/services/organization.service'
import { appConfig } from '@/config/app-config'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect(appConfig.routes.login)

  const cookieStore = await cookies()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  if (!orgContext) redirect('/dashboard')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your organization settings."
      />

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Organization Profile Editor</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Coming soon: Edit industry, target audience, primary goal, default tone, and platform preferences
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Settings will allow you to edit:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Industry & Target Audience</li>
              <li>Primary Goal & Default Tone</li>
              <li>Platform Preferences</li>
              <li>Language Settings</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
